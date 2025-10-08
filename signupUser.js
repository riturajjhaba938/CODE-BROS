document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (nameInput.value.trim() === '') {
            alert('Please enter your name.');
            nameInput.focus();
            return;
        }

        if (emailInput.value.trim() === '') {
            alert('Please enter your email.');
            emailInput.focus();
            return;
        }

        if (passwordInput.value.trim() === '') {
            alert('Please create a password.');
            passwordInput.focus();
            return;
        }

        // If all fields are filled, you can proceed with form submission logic
        alert('Form submitted successfully!');
        // Example: form.submit(); or fetch('/api/create-account', { method: 'POST', body: new FormData(form) });
    });
});