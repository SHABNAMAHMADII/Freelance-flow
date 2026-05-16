// Clients Module - CRUD operations + Random User API
// Shabnam's implementation

import { loadData, saveClients, generateId } from './data.js';
import { validateClient, formatCurrency } from './utils.js';

let currentClients = [];

// Fetch initial clients from Random User API
async function fetchRandomUsers() {
    try {
        console.log('Fetching 5 random users for Shabnam...');
        const response = await fetch('https://randomuser.me/api/?results=5&nat=us');
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        
        const newClients = data.results.map((user, index) => ({
            id: generateId() + index,
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            company: 'Freelance Inc.', // As specified in assignment
            notes: `Imported from API - ${user.location.city}, ${user.location.state}`,
            createdAt: new Date().toISOString()
        }));
        
        return newClients;
    } catch (error) {
        console.error('Failed to fetch random users:', error);
        alert('Could not load sample clients. You can add them manually.');
        return [];
    }
}

// Render clients table - using forEach like assignment requires
function renderClients() {
    const tbody = document.getElementById('clientsList');
    if (!tbody) return;
    
    if (currentClients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No clients yet. Add one above!</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    currentClients.forEach(client => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${escapeHtml(client.name)}</td>
            <td>${escapeHtml(client.email)}</td>
            <td>${escapeHtml(client.company || '-')}</td>
            <td>${escapeHtml(client.notes || '-')}</td>
            <td>
                <button class="btn-edit small" data-id="${client.id}">✏️ Edit</button>
                <button class="btn-delete small" data-id="${client.id}">🗑️ Delete</button>
            </td>
        `;
    });
    
    // Add event listeners to buttons - this took me a while to figure out
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editClient(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteClient(parseInt(btn.dataset.id)));
    });
}

// Simple escape to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Add new client
function addClient(event) {
    event.preventDefault();
    
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const company = document.getElementById('clientCompany').value;
    const notes = document.getElementById('clientNotes').value;
    
    const validationError = validateClient(name, email);
    if (validationError) {
        alert(validationError);
        return;
    }
    
    const newClient = {
        id: generateId(),
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || '',
        notes: notes.trim() || '',
        createdAt: new Date().toISOString()
    };
    
    currentClients.push(newClient);
    saveClients(currentClients);
    renderClients();
    
    // Clear form
    document.getElementById('clientForm').reset();
    alert('Client added successfully!');
}

// Edit client - I like how this works
function editClient(id) {
    const client = currentClients.find(c => c.id === id);
    if (!client) return;
    
    const newName = prompt('Edit name:', client.name);
    if (!newName) return;
    
    const newEmail = prompt('Edit email:', client.email);
    if (!newEmail) return;
    
    const validationError = validateClient(newName, newEmail);
    if (validationError) {
        alert(validationError);
        return;
    }
    
    client.name = newName.trim();
    client.email = newEmail.trim();
    client.company = prompt('Edit company:', client.company) || '';
    client.notes = prompt('Edit notes:', client.notes) || '';
    
    saveClients(currentClients);
    renderClients();
    alert('Client updated!');
}

// Delete client
function deleteClient(id) {
    if (confirm('Are you sure? This will also delete their invoices!')) {
        // Also need to delete associated invoices - found this bug and fixed it
        const data = loadData();
        data.invoices = data.invoices.filter(inv => inv.clientId !== id);
        data.clients = currentClients.filter(c => c.id !== id);
        currentClients = data.clients;
        saveData(data);
        renderClients();
        alert('Client and their invoices deleted.');
    }
}

// Load initial data
function init() {
    const data = loadData();
    currentClients = data.clients || [];
    
    if (currentClients.length === 0) {
        // Fetch from API as specified
        fetchRandomUsers().then(apiClients => {
            if (apiClients.length > 0) {
                currentClients = apiClients;
                saveClients(currentClients);
            }
            renderClients();
        });
    } else {
        renderClients();
    }
    
    document.getElementById('clientForm')?.addEventListener('submit', addClient);
}

// Start the app
init();
