document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;

        if (email && password) {
            console.log('Login attempt with:');
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Remember Me:', rememberMe);
            
            alert('Login button clicked. Data logged to console.');
        } else {
            alert('Please enter both email and password.');
        }
    });
});