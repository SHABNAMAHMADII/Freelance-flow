// Invoices Module - FULLY WORKING for Shabnam

import { loadData, saveInvoices, generateId } from './data.js';
import { formatCurrency, formatDate, getClientName } from './utils.js';

let currentInvoices = [];
let currentClients = [];

function populateClientDropdown() {
    const select = document.getElementById('invoiceClientId');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Client *</option>';
    
    for (let i = 0; i < currentClients.length; i++) {
        const client = currentClients[i];
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name + (client.company ? ' (' + client.company + ')' : '');
        select.appendChild(option);
    }
}

function renderInvoices() {
    const tbody = document.getElementById('invoicesList');
    if (!tbody) return;
    
    if (currentInvoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No invoices yet. Create one above!</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    for (let i = 0; i < currentInvoices.length; i++) {
        const invoice = currentInvoices[i];
        const row = tbody.insertRow();
        const clientName = getClientName(invoice.clientId, currentClients);
        
        row.innerHTML = `
            <td>${escapeHtml(clientName)}</td>
            <td>${escapeHtml(invoice.serviceTitle)}</td>
            <td>${formatCurrency(invoice.amount)}</td>
            <td>${formatDate(invoice.date)}</td>
            <td>
                <button class="btn-paid small" data-id="${invoice.id}">
                    ${invoice.status === 'paid' ? '✅ Paid' : '⏳ Mark Paid'}
                </button>
            </td>
            <td>
                <button class="btn-edit small" data-id="${invoice.id}">✏️ Edit</button>
                <button class="btn-delete small" data-id="${invoice.id}">🗑️ Delete</button>
            </td>
        `;
    }
    
    // ATTACH DELETE EVENT LISTENERS
    const allDeleteBtns = document.querySelectorAll('.btn-delete');
    for (let i = 0; i < allDeleteBtns.length; i++) {
        allDeleteBtns[i].onclick = function() {
            const idToDelete = parseInt(this.dataset.id);
            const confirmDelete = confirm('Are you sure you want to delete this invoice?');
            if (confirmDelete) {
                const newList = [];
                for (let j = 0; j < currentInvoices.length; j++) {
                    if (currentInvoices[j].id !== idToDelete) {
                        newList.push(currentInvoices[j]);
                    }
                }
                currentInvoices = newList;
                saveInvoices(currentInvoices);
                renderInvoices();
                alert('Invoice deleted!');
            }
        };
    }
    
    // ATTACH EDIT EVENT LISTENERS
    const allEditBtns = document.querySelectorAll('.btn-edit');
    for (let i = 0; i < allEditBtns.length; i++) {
        allEditBtns[i].onclick = function() {
            const idToEdit = parseInt(this.dataset.id);
            let invoiceToEdit = null;
            for (let j = 0; j < currentInvoices.length; j++) {
                if (currentInvoices[j].id === idToEdit) {
                    invoiceToEdit = currentInvoices[j];
                    break;
                }
            }
            if (invoiceToEdit) {
                const newTitle = prompt('Edit service title:', invoiceToEdit.serviceTitle);
                if (newTitle && newTitle.trim() !== '') invoiceToEdit.serviceTitle = newTitle.trim();
                const newAmount = parseFloat(prompt('Edit amount:', invoiceToEdit.amount));
                if (!isNaN(newAmount) && newAmount > 0) invoiceToEdit.amount = newAmount;
                const newDate = prompt('Edit date (YYYY-MM-DD):', invoiceToEdit.date);
                if (newDate && newDate.trim() !== '') invoiceToEdit.date = newDate;
                saveInvoices(currentInvoices);
                renderInvoices();
                alert('Invoice updated!');
            }
        };
    }
    
    // ATTACH PAID/UNPAID EVENT LISTENERS
    const allPaidBtns = document.querySelectorAll('.btn-paid');
    for (let i = 0; i < allPaidBtns.length; i++) {
        allPaidBtns[i].onclick = function() {
            const idToToggle = parseInt(this.dataset.id);
            let invoiceToToggle = null;
            for (let j = 0; j < currentInvoices.length; j++) {
                if (currentInvoices[j].id === idToToggle) {
                    invoiceToToggle = currentInvoices[j];
                    break;
                }
            }
            if (invoiceToToggle) {
                invoiceToToggle.status = invoiceToToggle.status === 'paid' ? 'unpaid' : 'paid';
                saveInvoices(currentInvoices);
                renderInvoices();
                alert('Invoice marked as ' + invoiceToToggle.status + '!');
            }
        };
    }
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

function addInvoice(event) {
    event.preventDefault();
    
    const clientId = document.getElementById('invoiceClientId').value;
    const serviceTitle = document.getElementById('serviceTitle').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    
    if (!clientId) {
        alert('Please select a client');
        return;
    }
    if (!serviceTitle || serviceTitle.trim() === '') {
        alert('Service title is required');
        return;
    }
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Valid amount is required');
        return;
    }
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    const newInvoice = {
        id: generateId(),
        clientId: parseInt(clientId),
        serviceTitle: serviceTitle.trim(),
        description: description.trim() || '',
        amount: amount,
        date: date,
        status: 'unpaid',
        createdAt: new Date().toISOString()
    };
    
    currentInvoices.push(newInvoice);
    saveInvoices(currentInvoices);
    renderInvoices();
    
    document.getElementById('invoiceForm').reset();
    alert('Invoice created!');
}

function init() {
    const data = loadData();
    currentInvoices = data.invoices || [];
    currentClients = data.clients || [];
    
    populateClientDropdown();
    renderInvoices();
    
    const form = document.getElementById('invoiceForm');
    if (form) {
        form.addEventListener('submit', addInvoice);
    }
}

init();
