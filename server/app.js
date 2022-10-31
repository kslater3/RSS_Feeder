var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const session = require('express-session');
const cors = require('cors');

const fetch = require('node-fetch');
//const request = require('request');

const bcrypt = require('bcrypt');

require('dotenv').config()

var app = express();
const port = 3000;


app.use(cors());


// Chrome won't redirect after login and logout without sending a "new" document everytime
app.get('/*', function(req, res, next){
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const { Pool } = require('pg');

const pgPool = new Pool({
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    max: process.env.PG_POOLMAX,
    idleTimeoutMillis: process.env.PG_IDLE_TIMEOUT_MILLIS,
    connectionTimeoutMillis: process.env.PG_CONNECTION_TIMEOUT_MILLIS
});

const sessionStore = new (require('connect-pg-simple')(session))({
    pool: pgPool,
    createTableIfMissing: true
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
        res.sendStatus(403);

        return;
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const pgClient = await pgPool.connect();

        const results = await pgClient.query(
            'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [firstname, lastname, email, hashedPassword]
        );

        pgClient.release();

        if (results.rows.length === 0) {
            res.sendStatus(403);

            return;
        }

        const user = results.rows[0];

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        };

        res.status(200);
        res.json({ user: req.session.user });
    }catch(e) {
        console.error(e);

        res.sendStatus(403);
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(email == null || password == null) {
        res.sendStatus(403);

        return;
    }

    try {
        const pgClient = await pgPool.connect();

        const results = await pgClient.query(
            'SELECT id, firstname, lastname, email, password FROM users WHERE email = $1',
            [email]
        );

        pgClient.release();

        if (results.rows.length === 0) {
            res.sendStatus(403);

            return;
        }
        const user = results.rows[0];

        const matches = bcrypt.compareSync(password, user.password)
        if (!matches) {
            res.sendStatus(403);

            return;
        }

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        }

        req.session.save(() => {
            res.status(200);
            res.send('');
        });
    }catch(e) {
        console.error(e);

        res.sendStatus(403);
    }
});


app.post('/logout', async (req, res) => {
    try {
        await req.session.destroy();

        res.status(200);
        res.send('');
    } catch (e) {
        console.error(e);

        res.sendStatus(500);
    }
});


app.get('/session', (req, res) => {
    try {
        // If you have an Active Session, send the Angular App
        if (req.sessionID && req.session.user) {
            res.json(req.session.user);
        }else {
            res.sendStatus(403);
        }
    }catch(e) {
        console.error(e);
    }
});


app.get('/corsproxy/*', cors(), async (req, res) => {
    let proxyString = '/corsproxy/'
    let unproxyURL = req.path.substring(proxyString.length);

    try {
        let proxyResponse = await fetch(unproxyURL);

        let body = await proxyResponse.text();

        res.send(body);
    }catch(e) {
        console.error(e);

        res.sendStatus(500);
    }
});



app.get('/userlinks/:uid', async (req, res) => {
    // If you have an Active Session, send the Angular App
    if(!req.sessionID && !req.session.user) {
        res.sendStatus(403);

        return;
    }

    if( !('uid') in req.params ) {
        res.sendStatus(403);

        return;
    }


    const pgClient = await pgPool.connect();

    let results;

    try {
        results = await pgClient.query(
            'SELECT l.link, l.label FROM userlinks AS ul INNER JOIN links AS l ON ul.linkid=l.id WHERE ul.userid=$1',
            [req.params['uid']]
        );
    }catch(e) {
        // If this link already was added, that is okay we will move on, if something else happend we will kill it
        // Postgres Error Code 23505 is for the Unique constraint meaning we already have that link, no problem
        if(e.code !== 23505) {
            pgClient.release();

            console.error(e);

            res.sendStatus(403);

            return;
        }
    }


    if (!results) {
        pgClient.release();

        res.sendStatus(403);

        return;
    }


    pgClient.release();

    res.json(results);
});



app.post('/link/:uid', async (req, res) => {
    // If you have an Active Session, send the Angular App
    if(!req.sessionID && !req.session.user) {
        res.sendStatus(403);

        return;
    }

    if( !('uid') in req.params ) {
        res.sendStatus(403);

        return;
    }

    const {link, label} = req.body;

    if(link == null || label == null) {
        res.sendStatus(403);

        return;
    }

    const pgClient = await pgPool.connect();

    let results;

    try {
        results = await pgClient.query(
            'INSERT INTO links (link, label) VALUES ($1, $2) RETURNING *',
            [link, label]
        );
    }catch(e) {
        // If this link already was added, that is okay we will move on, if something else happend we will kill it
        // Postgres Error Code 23505 is for the Unique constraint meaning we already have that link, no problem
        if(e.code !== 23505) {
            pgClient.release();

            console.error(e);

            res.sendStatus(403);

            return;
        }
    } finally {

        // In this case I hit the unique error on the link, so now I will go query it so I can get its id
        if (!results || results.rows.length === 0) {
            try {
                results = await pgClient.query(
                    'SELECT id FROM links WHERE link=$1',
                    [link]
                );
            }catch(e) {
                // If this link already was added, that is okay we will move on, if something else happend we will kill it
                // Postgres Error Code 23505 is for the Unique constraint meaning we already have that link, no problem
                if(e.code !== 23505) {
                    pgClient.release();

                    console.error(e);

                    res.sendStatus(403);

                    return;
                }
            }
        }

console.log(results);
        const newLink = results.rows[0];

        // Now that we know the new link is in the system, let's update the user's link table to associate that link to this user
        try {
            results = await pgClient.query(
                'INSERT INTO userlinks (linkid, userid) VALUES ($1, $2) RETURNING *',
                [newLink.id, req.params['uid']]
            );
        }catch(e) {
            pgClient.release();

            console.error(e);

            res.sendStatus(403);

            return;
        } finally {
            if (!results || results.rows.length === 0) {
                pgClient.release();

                res.sendStatus(403);

                return;
            }


            pgClient.release();

            res.sendStatus(201);
        }
    }
});



// Delivers the Core of the angular app if you are logged in, other stuff can be put into the public folder
app.get('/static/js/*.js', (req, res) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app') + req.path);
    }
});

app.get('/static/css/*.css', (req, res) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app') + req.path);
    }
});

app.get('/*.json', (req, res) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app') + req.path);
    }
});



app.get('/app', (req, res, next) => {
    // If you have an Active Session, send the Angular App
    if (req.sessionID && req.session.user) {
        res.sendFile(path.join(__dirname, 'app', 'index.html'));
    }else {
        res.sendStatus(403);
    }
});

app.get('/', (req, res) => {
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
  res.send(err);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})


module.exports = app;
