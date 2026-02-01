import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getExpenses, createExpense } from "./api";
import "./App.css";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [filterCategory, setFilterCategory] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [loading, setLoading] = useState(false); // form submission loading
  const [fetching, setFetching] = useState(false); // API fetching loading
  const [error, setError] = useState("");

  async function loadExpenses() {
    try {
      setError("");
      setFetching(true);
      const data = await getExpenses({
        category: filterCategory,
        sort,
      });
      setExpenses(data);
    } catch (err) {
      setError("Failed to fetch expenses: " + err.message);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, [filterCategory, sort]);

  const totalCents = expenses.reduce(
    (sum, e) => sum + e.amount_cents,
    0
  );

 async function handleSubmit(e) {
  e.preventDefault();
  if (loading) return; // prevent multiple clicks

  // Check for duplicate
  const isDuplicate = expenses.some(
    (exp) =>
      exp.amount_cents === Math.round(parseFloat(form.amount) * 100) &&
      exp.category.trim().toLowerCase() === form.category.trim().toLowerCase() &&
      (exp.description || "").trim().toLowerCase() === (form.description || "").trim().toLowerCase() &&
      exp.date === form.date
  );

  if (isDuplicate) {
    setError("Duplicate expense detected! Please check your entry.");
    return; // stop submission
  }

  setLoading(true);
  setError("");

  try {
    await createExpense({
      ...form,
      requestId: uuidv4(),
    });
    setForm({ amount: "", category: "", description: "", date: "" });
    await loadExpenses(); // reload after successful creation
  } catch (err) {
    setError("Failed to save expense: " + err.message);
  } finally {
    setLoading(false);
  }
}


  const uniqueCategories = [
    ...new Set(expenses.map((e) => e.category)),
  ];

  return (
    <div className="app-container">
      <h2>Expense Tracker</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
          required
        />
        <button disabled={loading}>
          {loading ? "Saving..." : "Add Expense"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="error-message">{error}</p>}

      {/* Filters */}
      <div className="filters">
        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value)
          }
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="date_desc">Newest First</option>
          <option value="">Oldest First</option>
        </select>
      </div>

      {/* Total */}
      <div className="total">
        <strong>Total:</strong> ₹{(totalCents / 100).toFixed(2)}
      </div>

      {/* Loading */}
      {fetching ? (
        <p className="loading">Loading expenses...</p>
      ) : (
        <ul>
          {expenses.map((e) => (
            <li key={e.id}>
              <span>{e.date}</span>
              <span>{e.category}</span>
              <span>₹{(e.amount_cents / 100).toFixed(2)}</span>
              <span>{e.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
