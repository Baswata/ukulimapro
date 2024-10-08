// Registration with Backend Integration
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.querySelector('.register-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent traditional form submission

            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Send registration data to backend
            fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullname,
                    email,
                    username,
                    password
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful. Please log in.');
                    window.location.href = 'login.html'; 
                } else {
                    alert(data.message || 'Registration failed'); 
                }
            })
            .catch(error => {
                console.error('Error during registration:', error);
                alert('An error occurred during registration. Please try again.');
            });
        });
    }
});

// Login with Backend Integration
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form from submitting the traditional way

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                alert('Please fill in both fields.');
                return;
            }

            // Send login data to backend
            fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    window.location.href = 'service_directory.html'; 
                } else {
                    alert(data.message || 'Login failed');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please try again.');
            });
        });
    }
});

