// Validation and Registration with Backend Integration
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.querySelector('.register-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form from submitting the traditional way

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            // Basic password confirmation check
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Send registration data to backend
            fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message); // Display success or error message from backend
                    window.location.href = 'login.html'; // Redirect to login after successful registration
                } else {
                    alert('Registration failed');
                }
            })
            .catch(error => {
                console.error('Error during registration:', error);
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
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('authToken', data.token); // Store token in localStorage
                    window.location.href = 'index.html'; // Redirect to dashboard on success
                } else {
                    alert('Login failed');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
            });
        });
    }
});

// Fetch service providers from the server and display them (with authentication)
document.addEventListener('DOMContentLoaded', () => {
    const serviceProvidersList = document.getElementById('service-providers-list');
    const authToken = localStorage.getItem('authToken'); // Get token from localStorage

    if (!authToken) {
        alert('You need to log in first.');
        window.location.href = 'login.html'; // Redirect to login if not authenticated
        return;
    }

    // Fetch service providers using the token
    fetch('/api/services', {
        headers: {
            'Authorization': `Bearer ${authToken}` // Send token in request header
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            data.forEach(provider => {
                const listItem = document.createElement('li');
                listItem.textContent = `${provider.name} - ${provider.contact} - ${provider.category} - ${provider.location}`;
                serviceProvidersList.appendChild(listItem);
            });
        } else {
            serviceProvidersList.textContent = 'No service providers found.';
        }
    })
    .catch(error => {
        console.error('Error fetching service providers:', error);
        serviceProvidersList.textContent = 'Error fetching service providers.';
    });
});