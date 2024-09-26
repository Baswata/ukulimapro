// Fetch service providers from the server and display them (with authentication)
document.addEventListener('DOMContentLoaded', () => {
    const serviceProvidersList = document.getElementById('service-providers-list');
    const authToken = localStorage.getItem('authToken'); // Get token from localStorage

    // Check if the user is authenticated
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
            window.location.href = 'login.html'; // Redirect to login if unauthorized
            return;
        } else if (!response.ok) {
            throw new Error('Failed to fetch service providers');
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
