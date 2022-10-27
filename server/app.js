var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const session = require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config()

var app = express();
const port = 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))


const { Client } = require('pg')
const pgObject = {
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT
}

const pgClient = new Client(pgObject);
pgClient.connect();

const sessionStore = new (require('connect-pg-simple')(session))({
    pgObject
});

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: false,
        sameSite: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));


app.post('/register', async (req, res) => {
    const {firstname, lastname, email, password} = req.body;

    if(firstname == null || lastname == null || email == null || password == null) {
        return res.sendStatus(403);
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const results = await pgClient.query(
            'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [firstname, lastname, email, hashedPassword]
        );

        if (results.rows.length === 0) {
            res.sendStatus(403);
        }

        const user = results.rows[0];

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        };

        res.status(200);
        return res.json({ user: req.session.user });
    }catch(e) {
        console.error(e);

        res.sendStatus(403);
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(email == null || password == null) {
        return res.sendStatus(403);
    }

    try {
        const results = await client.query(
            'SELECT id, firstname, lastname, email, password FROM users WHERE email = $1',
            [email]
        );

        if (results.rows.length === 0) {
            return res.sendStatus(403);
        }
        const user = results.rows[0];

        const matches = bcrypt.compareSync(password, user.password)
        if (!matches) {
            return res.sendStatus(403);
        }

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        }

        res.status(200);
        return res.json({ user: req.session.user });
    }catch(e) {
        console.error(e);

        return res.sendStatus(403);
    }
});


app.post('/logout', async (req, res) => {
    try {
        await req.session.destroy();

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);

        return res.sendStatus(500);
    }
});


// Delivers the Core of the angular app if you are logged in, other stuff can be put into the public folder
app.get('/main.*.js', (req, res) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app') + req.path);
    }
});

app.get('/runtime.*.js', (req, res) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app') + req.path);
    }
});

app.get('/polyfills.*.js', (req, res) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app') + req.path);
    }
});

app.get('/styles.*.css', (req, res) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app') + req.path);
    }
});


app.get('/', (req, res) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app', 'index.html'));
    }

    // If you don't have an active session, redirect to the login page
    res.sendFile(path.join(__dirname, 'login', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


module.exports = app;
