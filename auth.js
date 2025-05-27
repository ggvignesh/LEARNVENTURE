// Authentication components
const authContainer = document.createElement('div');
authContainer.className = 'auth-container';

// Login Form
const loginForm = document.createElement('form');
loginForm.className = 'auth-form';
loginForm.innerHTML = `
    <h2>Login</h2>
    <div class="form-group">
        <input type="email" id="loginEmail" placeholder="Email" required>
    </div>
    <div class="form-group">
        <input type="password" id="loginPassword" placeholder="Password" required>
    </div>
    <button type="submit" class="auth-button">Login</button>
    <p class="forgot-password">
        <a href="#" id="forgotPasswordLink">Forgot password?</a>
    </p>
    <p class="auth-switch">
        Don't have an account? <a href="#" id="showRegister">Register</a>
    </p>
`;

// Registration Form
const registerForm = document.createElement('form');
registerForm.className = 'auth-form hidden';
registerForm.innerHTML = `
    <h2>Register</h2>
    <div class="form-group">
        <input type="text" id="registerName" placeholder="Name" required>
    </div>
    <div class="form-group">
        <input type="email" id="registerEmail" placeholder="Email" required>
    </div>
    <div class="form-group">
        <input type="password" id="registerPassword" placeholder="New Password" required>
    </div>
    <div class="form-group">
        <input type="password" id="confirmPassword" placeholder="Retype Password" required>
    </div>
    <button type="submit" class="auth-button">Register</button>
    <p class="auth-switch">
        Already have an account? <a href="#" id="showLogin">Login</a>
    </p>
`;

// Forgot Password Form
const forgotPasswordForm = document.createElement('form');
forgotPasswordForm.className = 'auth-form hidden';
forgotPasswordForm.innerHTML = `
    <h2>Forgot Password</h2>
    <div class="form-group">
        <input type="email" id="forgotEmail" placeholder="Enter your email" required>
    </div>
    <button type="submit" class="auth-button">Reset Password</button>
    <p class="auth-switch">
        <a href="#" id="backToLogin">Back to Login</a>
    </p>
`;

// Add forms to container
authContainer.appendChild(loginForm);
authContainer.appendChild(registerForm);
authContainer.appendChild(forgotPasswordForm);

// Add styles
const styles = document.createElement('style');
styles.textContent = `
    .auth-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .auth-form.hidden {
        display: none;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
    }

    .auth-button {
        padding: 12px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .auth-button:hover {
        background: #0056b3;
    }

    .auth-switch {
        text-align: center;
        margin-top: 15px;
    }

    .auth-switch a {
        color: #007bff;
        text-decoration: none;
    }

    .auth-switch a:hover {
        text-decoration: underline;
    }

    .forgot-password {
        text-align: right;
        margin-top: -10px;
    }

    .forgot-password a {
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
    }

    .forgot-password a:hover {
        text-decoration: underline;
    }

    h2 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
    }
`;

document.head.appendChild(styles);

// Event Listeners
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    forgotPasswordForm.classList.add('hidden');
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    forgotPasswordForm.classList.add('hidden');
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    forgotPasswordForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

document.getElementById('backToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Form Submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data));
            // Redirect to main page or show chat interface
            window.location.href = '/';
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            // Switch to login form
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
});

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;

    try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Password reset instructions sent to your email');
            // Switch back to login form
            forgotPasswordForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        } else {
            alert(data.error || 'Failed to process request');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        alert('An error occurred while processing your request');
    }
});

// Export the auth container
export { authContainer };

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authContainer = document.getElementById('auth-container');
    const mainContent = document.getElementById('main-content');

    if (user) {
        authContainer.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        authContainer.style.display = 'block';
        mainContent.style.display = 'none';
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data));
            checkAuth();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
});

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            showLoginForm();
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
});

// Handle forgot password form submission
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;

    try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Password reset instructions sent to your email');
            showLoginForm();
        } else {
            alert(data.error || 'Failed to process request');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        alert('An error occurred while processing your request');
    }
});

// Form switching functions
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

function showForgotPasswordForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
}

// Add event listeners for form switching
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPasswordForm();
});

document.getElementById('backToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Handle logout
document.getElementById('logout-button').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    checkAuth();
});

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth); 