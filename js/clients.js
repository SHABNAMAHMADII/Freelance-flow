// Clients Module - CRUD operations with CUSTOM names
// Shabnam's Freelance Flow - Week 5 Assignment

import { loadData, saveClients, saveData, generateId } from './data.js';
import { validateClient } from './utils.js';

let currentClients = [];

// CUSTOM CLIENTS - These are permanent!
function getDefaultClients() {
    return [
        { id: generateId() + 1, name: "Hasiba", email: "hasiba@gmail.com", company: "Freelance Inc.", notes: "Preferred client", createdAt: new Date().toISOString() },
        { id: generateId() + 2, name: "Negina", email: "negina@gmail.com", company: "Freelance Inc.", notes: "Regular client", createdAt: new Date().toISOString() },
        { id: generateId() + 3, name: "Madina", email: "madina@gmail.com", company: "Freelance Inc.", notes: "VIP client", createdAt: new Date().toISOString() },
        { id: generateId() + 4, name: "Shabana", email: "shabana@gmail.com", company: "Freelance Inc.", notes: "New client", createdAt: new Date().toISOString() },
        { id: generateId() + 5, name: "Hosai", email: "hosai@gmail.com", company: "Freelance Inc.", notes: "Long-term client", createdAt: new Date().toISOString() }
    ];
}

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
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editClient(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteClient(parseInt(btn.dataset.id)));
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

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
    
    document.getElementById('clientForm').reset();
    alert('Client added successfully!');
}

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

function deleteClient(id) {
    if (confirm('Are you sure? This will also delete their invoices!')) {
        const data = loadData();
        data.invoices = data.invoices.filter(inv => inv.clientId !== id);
        data.clients = currentClients.filter(c => c.id !== id);
        currentClients = data.clients;
        saveData(data);
        renderClients();
        alert('Client and their invoices deleted.');
    }
}

function init() {
    const data = loadData();
    currentClients = data.clients || [];
    
    // If no clients exist, add the custom ones
    if (currentClients.length === 0) {
        currentClients = getDefaultClients();
        saveClients(currentClients);
    }
    renderClients();
    
    const form = document.getElementById('clientForm');
    if (form) {
        form.addEventListener('submit', addClient);
    }
}

// Start the app
init();
