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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadExpenses() {
    try {
      setError("");
      const data = await getExpenses({
        category: filterCategory,
        sort,
      });
      setExpenses(data);
    } catch (err) {
      setError(err.message);
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
    setLoading(true);
    setError("");

    try {
      await createExpense({
        ...form,
        requestId: uuidv4(),
      });
      setForm({ amount: "", category: "", description: "", date: "" });
      loadExpenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const uniqueCategories = [
    ...new Set(expenses.map((e) => e.category)),
  ];

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Expense Tracker</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
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

      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>
          {error}
        </p>
      )}

      <div style={{ marginBottom: 10 }}>
        <strong>Total:</strong> ₹
        {(totalCents / 100).toFixed(2)}
      </div>

      <div style={{ marginBottom: 20 }}>
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

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.date} — {e.category} — ₹
            {(e.amount_cents / 100).toFixed(2)} —{" "}
            {e.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
