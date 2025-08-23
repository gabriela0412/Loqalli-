// script.js

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');


// Your API login endpoint
const API_URL = "http://localhost:3000/login";

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert('Please fill in both fields.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            window.location.href = '../mainpage/mainpage.html';
        } else {
            alert(data.message || 'Login failed. Check your credentials.');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('There was an error connecting to the server.');
    }
});
