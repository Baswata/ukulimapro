// Validation for Registration Form
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.querySelector('.register-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                e.preventDefault(); // Prevent form submission
            }
        });
    }
});

// Basic Login Alert
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (!username || !password) {
                alert('Please fill in both fields.');
                e.preventDefault(); // Prevent form submission
            }
        });
    }
});

// Fetch service providers from the server and display them
document.addEventListener('DOMContentLoaded', () => {
    const serviceProvidersList = document.getElementById('service-providers-list');

    fetch('/services')
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
