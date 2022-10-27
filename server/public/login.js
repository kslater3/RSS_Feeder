

function login() {
    let login_email = document.getElementById('login_email');
    let login_password = document.getElementById('login_password')

    console.log('email: ' + login_email.value + ', password: ' + login_password.value);
}


function register() {
    let register_firstname = document.getElementById('register_firstname');
    let register_lastname = document.getElementById('register_lastname');
    let register_email = document.getElementById('register_email');
    let register_password = document.getElementById('register_password');
    let register_password2 = document.getElementById('register_password2');

    console.log('firstname: ' + register_firstname.value + 'lastname: ' + register_lastname.value + 'email: ' + register_email.value + ', password: ' + register_password.value + ', password2: ' + register_password2.value);
}
