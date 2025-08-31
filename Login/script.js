const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const verificationContainer = document.getElementById('verification-container');
const verificationInput = document.getElementById('verification-code');
const verifyButton = document.getElementById('verify-button');
const otpMessage = document.getElementById('otp-display');

let userEmail = '';

// Evitamos que el submit recargue la página
document.getElementById('login-form').addEventListener('submit', e => e.preventDefault());

// --- LOGIN ---
loginButton.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert('Please fill in both fields.');
        return;
    }

    try {
        // Login
        const loginRes = await fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            alert(loginData.message || 'Login failed.');
            return;
        }

        // OTP
        const otpRes = await fetch("http://localhost:3000/send-otp", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const otpData = await otpRes.json();

        if (!otpRes.ok) {
            alert(otpData.message || 'Error generating verification code.');
            return;
        }

        userEmail = email;

        // MOSTRAR FORMULARIO OTP
        verificationContainer.style.display = 'block';
        otpMessage.textContent = `Your verification code is: ${otpData.otp}`;

        // Opcional: si quieres, puedes deshabilitar inputs de login
        emailInput.disabled = true;
        passwordInput.disabled = true;
        loginButton.disabled = true;

    } catch (err) {
        console.error(err);
        alert('Error connecting to server.');
    }
});

// --- VERIFICAR OTP ---
verifyButton.addEventListener('click', async () => {
    const enteredOtp = verificationInput.value.trim();

    if (!enteredOtp) {
        alert('Please enter the verification code.');
        return;
    }

    try {
        const verifyRes = await fetch("http://localhost:3000/verify-otp", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, otp: enteredOtp })
        });
        const verifyData = await verifyRes.json();

        if (verifyRes.ok) {
            alert(`Welcome ${verifyData.user.name}!`);
            window.location.href = '../mainpage/mainpage.html';
        } else {
            alert(verifyData.message || 'Verification code is invalid.');
        }
    } catch (err) {
        console.error(err);
        alert('Error connecting to server.');
    }
});
