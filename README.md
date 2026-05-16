# Freelance Flow - Invoice & Client Manager

**Built by Shabnam** | Week 5 Assignment

## Live Demo
[Add your GitHub Pages link here after deployment]

## GitHub Repository
[Add your GitHub repo link here]

---

## Features

✅ **Client Management** - Add, edit, delete clients with validation  
✅ **Random User API** - Auto-populates 5 sample clients on first load  
✅ **Invoice Management** - Create, edit, delete invoices linked to clients  
✅ **Payment Tracking** - Mark invoices as paid/unpaid  
✅ **Dashboard** - Shows total clients, invoices, revenue, paid/unpaid breakdown  
✅ **Motivational Quotes** - Fetches from ZenQuotes API  
✅ **Local Storage** - All data persists after page refresh  
✅ **Export Summary** - Bonus feature I added (shows all stats in one alert)  

---

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- LocalStorage for data persistence
- Fetch API with async/await
- Random User API (randomuser.me)
- ZenQuotes API (zenquotes.io)

---

## How to Run

1. Clone this repository
2. Open any HTML file in a modern browser
3. Or deploy to GitHub Pages

No build steps or dependencies required!

---

## Reflection

**Skills gained:**
This project taught me how to structure a multi-page JavaScript app using ES6 modules. I finally understand `map()`, `filter()`, and `reduce()` after practicing with invoice calculations. Working with localStorage and APIs together was challenging but rewarding.

**Biggest challenge:**
Getting the Random User API to populate clients on first load AND keep them in localStorage so they don't disappear on refresh. I also struggled with the invoice-client relationship (deleting a client should delete their invoices).

**Favorite feature:**
The Export Summary button I added on the dashboard. It's simple but shows I can extend the requirements. Also love how the motivational quote changes every time you refresh!

---

## Assignment Requirements Checklist

- [x] Clients module with CRUD
- [x] Random User API (5 clients on load)
- [x] Manual client addition with validation
- [x] Edit/delete clients
- [x] Invoices module with CRUD
- [x] Client dropdown in invoice form
- [x] Paid/unpaid toggle
- [x] Dashboard with totals using reduce()
- [x] Paid/unpaid counts using filter()
- [x] ZenQuotes API with error handling
- [x] localStorage persistence
- [x] ES6 modules (separate JS files)
- [x] Responsive design
- [x] Form validation (email, required fields, amounts)

---

**Grade goal:** 100/100 🤞