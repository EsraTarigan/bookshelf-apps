document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (ev) {
        ev.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'user' && password === 'password') {
            window.location.href = 'index.html'; 
        } else {
            alert('Login Gagal, Periksa Username dan Password Anda!');
        }
    });
});
