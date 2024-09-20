// Registration form submission
document.querySelector('.register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful');
            window.location.href = 'public/login.html'; // Redirect to login page
        } else {
            alert(data.message || 'Registration failed');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Login form submission
document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful');
            window.location.href = 'public/index.html'; // Redirect to main page
        } else {
            alert(data.message || 'Login failed');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Fetch and display service providers
document.addEventListener('DOMContentLoaded', () => {
    const serviceProvidersList = document.getElementById('service-providers-list');
    
    fetch('/api/services')
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
    .catch(error => console.error('Error fetching service providers:', error));
});
