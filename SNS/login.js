// Predefined users
const users = [
    {
        email: 'chei@email.com',
        password: 'chei123',
        username: 'chei',
        birthday: '2004-05-15',
        interests: ['anime', 'gaming']
    },
    {
        email: 'lam@email.com',
        password: 'lam123',
        username: 'lam',
        birthday: '1999-08-22',
        interests: ['music', 'arts']
    }
];

// Initialize users in localStorage if not exists
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'home.html';
        return;
    }
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    const user = storedUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    } else {
        showMessage('Invalid email or password. Please try again.', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const birthday = document.getElementById('birthday').value;
    
    // Get selected interests
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
    const interests = Array.from(interestCheckboxes).map(cb => cb.value);
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    if (!birthday) {
        showMessage('Please select your birthday!', 'error');
        return;
    }
    
    if (interests.length === 0) {
        showMessage('Please select at least one interest!', 'error');
        return;
    }
    
    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (storedUsers.find(u => u.email === email)) {
        showMessage('User with this email already exists!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        username,
        email,
        password,
        birthday,
        interests,
        joinDate: new Date().toISOString()
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    showMessage('Registration successful! You can now login.', 'success');
    
    // Reset form
    document.getElementById('registerForm').reset();
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'auth-message';
    messageDiv.textContent = message;
    
    const color = type === 'success' ? '#4CAF50' : '#f44336';
    messageDiv.style.cssText = `
        background: ${color};
        color: white;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        text-align: center;
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Insert message at the top of the form
    const form = document.querySelector('.auth-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
        style.remove();
    }, 5000);
}

// Add demo login functionality
document.addEventListener('DOMContentLoaded', function() {
    const demoAccounts = document.querySelectorAll('.demo-account');
    demoAccounts.forEach(account => {
        account.style.cursor = 'pointer';
        account.addEventListener('click', function() {
            const text = this.textContent;
            const emailMatch = text.match(/(\S+@\S+\.\S+)/);
            const passwordMatch = text.match(/\/\s*(\S+)/);
            
            if (emailMatch && passwordMatch) {
                document.getElementById('email').value = emailMatch[1];
                document.getElementById('password').value = passwordMatch[1];
                showMessage('Demo credentials filled! Click Login to continue.', 'success');
            }
        });
    });
});