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
                if (data.success) { // Check for success response
                    alert('Registration successful. Please log in.');
                    window.location.href = 'login.html'; // Redirect to login after successful registration
                } else {
                    alert(data.message || 'Registration failed'); // Show the error message
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
                    localStorage.setItem('authToken', data.token); // Store token in localStorage
                    window.location.href = 'service_directory.html'; // Redirect to service providers page on success
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
    .then(response => {
        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = 'login.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data && data.length > 0) {
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
