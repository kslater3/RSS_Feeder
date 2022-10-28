
let login_email, login_password;

let register_firstname, register_lastname, register_email, register_password, register_password2;

let login_error_div, register_error_div;


async function post(path, body) {
    if(path !== '/login' && path !== '/register') {
        console.error('Script Error: Must send request to "/login" or "/register", but recieved path="' + path + '"');

        register_error_div.innerHTML = 'Script Error';
        login_error_div.innerHTML = 'Script Error';

        return;
    }

    if(!body || body == {}) {
        console.error('Script Error: body of post must not be null');

        if(path == '/register') {
            register_error_div.innerHTML = 'Script Error';
        }else {
            login_error_div.innerHTML = 'Script Error';
        }

        return;
    }


    try {
        const response = await fetch('http://localhost:3000' + path, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            redirect: 'follow',

            body: JSON.stringify(body)
        });

        if(!response.ok) {
            if(path == '/register') {
                register_error_div.innerHTML = 'Registration Error';
            }else {
                login_error_div.innerHTML = 'Email or Password is Incorrect';
            }
        }
    }catch(e) {
        if(path == '/register') {
            register_error_div.innerHTML = e.message;
        }else {
            login_error_div.innerHTML = e.message;
        }
    }
}



function validateName(name) {
    return RegExp('[A-Z][a-z]+').test(name);
}


function validateEmail(email) {
    return email.includes('@');
}

function validatePassword(password) {
    return password.length >= 8 && RegExp('[A-Z]').test(password) && RegExp('[^a-zA-Z]').test(password);
}


async function login() {
    if(login_email.value == '' || login_password.value == '') {
        login_error_div.innerHTML = 'Missing Required Fields';

        return;
    }

    login_error_div.innerHTML = '';

    let login_body = {
        email: login_email.value,

        password: login_password.value
    };

    post('/login', login_body);
}


async function register() {
    if(!validateName(register_firstname.value)) {
        register_error_div.innerHTML = 'First Name Must Be Capital Followed By Lowercase Letters';

        return;
    }

    if(!validateName(register_lastname.value)) {
        register_error_div.innerHTML = 'Last Name Must Be Capital Followed By Lowercase Letters';

        return;
    }

    if(!validateEmail(register_email.value)) {
        register_error_div.innerHTML = 'Not A Valid Email Address';

        return;
    }

    if(!validatePassword(register_password.value)) {
        register_error_div.innerHTML = 'Password Must Be At Least 8 Characters<br/>Contain A Capital Letter<br/>Contain At Least 1 Non Alphabetical Character';

        return;
    }

    if(register_password.value !== register_password2.value) {
        register_error_div.innerHTML = 'Passwords Do Not Match';

        return;
    }

    register_error_div.innerHTML = '';

    let register_body = {
        firstname: register_firstname.value,
        lastname: register_lastname.value,
        email: register_email.value,
        password: register_password.value
    };

    post('/register', register_body);
}


window.onload = function() {
    login_email = document.getElementById('login_email');
    login_password = document.getElementById('login_password');

    register_firstname = document.getElementById('register_firstname');
    register_lastname = document.getElementById('register_lastname');
    register_email = document.getElementById('register_email');
    register_password = document.getElementById('register_password');
    register_password2 = document.getElementById('register_password2');

    login_error_div = document.getElementById('login_error_div');
    register_error_div = document.getElementById('register_error_div');
}
