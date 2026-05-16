// Helper functions - validation, formatting, etc.
// Spent way too much time on email regex lol

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

export function validateEmail(email) {
    // This regex works (I think)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validateClient(name, email) {
    if (!name || name.trim() === '') {
        return 'Name is required';
    }
    if (!email || !validateEmail(email)) {
        return 'Valid email is required';
    }
    return null;
}

export function validateInvoice(serviceTitle, amount, clientId) {
    if (!clientId) return 'Please select a client';
    if (!serviceTitle || serviceTitle.trim() === '') return 'Service title is required';
    if (!amount || isNaN(amount) || amount <= 0) return 'Valid amount is required';
    return null;
}

// Format date for display - YYYY-MM-DD
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
}

// This is where I had a bug but fixed it (I think)
export function getClientName(clientId, clients) {
    const client = clients.find(c => c.id == clientId);
    return client ? client.name : 'Unknown Client';
}
