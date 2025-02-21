// auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const response = await fetch('https://priyankomanna.pythonanywhere.com/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: e.target[0].value,
                password: e.target[1].value
            })
        });
        // Handle response
    });

    // Similar for registration
});