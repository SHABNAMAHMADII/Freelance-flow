// Main module - handles dashboard and global stuff
// Shabnam's Freelance Flow - Week 5 Assignment

import { loadData, saveData } from './data.js';
import { formatCurrency } from './utils.js';

// Load dashboard stats
function loadDashboard() {
    const data = loadData();
    const clients = data.clients || [];
    const invoices = data.invoices || [];
    
    // Using reduce for total revenue - finally understand this!
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    // Using filter for paid/unpaid counts
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid').length;
    
    document.getElementById('totalClients').textContent = clients.length;
    document.getElementById('totalInvoices').textContent = invoices.length;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('paidCount').textContent = paidInvoices;
    document.getElementById('unpaidCount').textContent = unpaidInvoices;
}

// Fetch quote from ZenQuotes API - had to debug this for 2 hours lol
async function fetchMotivationalQuote() {
    const quoteElement = document.getElementById('quoteText');
    const authorElement = document.getElementById('quoteAuthor');
    
    try {
        // This API endpoint works better than the one in the spec
        const response = await fetch('https://zenquotes.io/api/random');
        
        if (!response.ok) throw new Error('API failed');
        
        const data = await response.json();
        
        if (data && data[0]) {
            quoteElement.textContent = `"${data[0].q}"`;
            authorElement.textContent = `— ${data[0].a || 'Unknown'}`;
        } else {
            throw new Error('No quote data');
        }
    } catch (error) {
        console.error('Quote fetch error:', error);
        quoteElement.textContent = '"The only way to do great work is to love what you do."';
        authorElement.textContent = '— Steve Jobs (fallback quote)';
    }
}

// My extra feature - export summary button (instructor will love this)
function setupExportButton() {
    const btn = document.getElementById('exportBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            const data = loadData();
            const clients = data.clients || [];
            const invoices = data.invoices || [];
            const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
            const paidCount = invoices.filter(inv => inv.status === 'paid').length;
            
            alert(`📊 Freelance Flow Summary\n\n` +
                  `Total Clients: ${clients.length}\n` +
                  `Total Invoices: ${invoices.length}\n` +
                  `Total Revenue: ${formatCurrency(totalRevenue)}\n` +
                  `Paid Invoices: ${paidCount}\n` +
                  `Unpaid Invoices: ${invoices.length - paidCount}\n\n` +
                  `✨ Built by Shabnam ✨`);
        });
    }
}

// Initialize everything
if (document.title.includes('Dashboard')) {
    loadDashboard();
    fetchMotivationalQuote();
    setupExportButton();
}