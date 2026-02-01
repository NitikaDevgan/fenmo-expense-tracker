# Expense Tracker

A simple, modern Expense Tracker built with **React** for the frontend. This app allows users to:

- Add expenses with **amount, category, description, and date**
- View a list of expenses
- Filter expenses by category
- Sort expenses by date (newest/oldest)
- See a real-time **total expense**
- Prevent duplicate entries
- Handle **loading states** and **API errors**

---

## Features

- Responsive design and modern UI
- Prevents duplicate submissions
- Shows error messages if API calls fail
- Loading indicators while fetching or submitting data
- Filters and sorting for better expense management

---

## Storage / Database Choice

For this project, we use **SQLite** as the backend storage.

### Why SQLite?

- **Lightweight and easy to set up**: No need to run a separate database server.
- **Persistent storage**: Data is saved on disk, unlike in-memory storage which disappears on reload.
- **Production-like behavior**: Gives a realistic feel of working with a relational database without the complexity of setting up something like PostgreSQL or MySQL.
- **Better than JSON file**: Unlike JSON files, SQLite handles **concurrent writes**, avoids data corruption, and supports **querying/filtering efficiently**.
- **Good learning experience**: Helps practice **SQL queries**, which are common in production systems.

Other storage options considered:

1. **JSON file** – Simple but not ideal for concurrent access or larger data.
2. **In-memory storage** – Fast but temporary; all data is lost when the app restarts.

---

## Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
