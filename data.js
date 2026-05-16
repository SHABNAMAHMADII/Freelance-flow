// Data management - localStorage stuff
// TODO: Maybe add export to CSV later if I have time

const STORAGE_KEY = 'freelance_flow_data';

// Default empty structure
const defaultData = {
    clients: [],
    invoices: []
};

export function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return { ...defaultData };
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error('Failed to load data', e);
        return { ...defaultData };
    }
}

export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Helper to get next ID (using timestamp like assignment says)
export function generateId() {
    return Date.now();
}

// This function felt tricky at first but got it working
export function saveClients(clients) {
    const data = loadData();
    data.clients = clients;
    saveData(data);
}

export function saveInvoices(invoices) {
    const data = loadData();
    data.invoices = invoices;
    saveData(data);
}