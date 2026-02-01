const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

const router = express.Router();

// POST /expenses (idempotent)
router.post("/expenses", (req, res) => {
  const { amount, category, description, date, requestId } = req.body;

  if (!amount || !category || !date || !requestId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existing = db
    .prepare("SELECT * FROM expenses WHERE request_id = ?")
    .get(requestId);

  if (existing) {
    return res.json(existing);
  }

  const expense = {
    id: uuidv4(),
    amount_cents: Math.round(Number(amount) * 100),
    category,
    description: description || "",
    date,
    created_at: new Date().toISOString(),
    request_id: requestId,
  };

  db.prepare(`
    INSERT INTO expenses
    (id, amount_cents, category, description, date, created_at, request_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    expense.id,
    expense.amount_cents,
    expense.category,
    expense.description,
    expense.date,
    expense.created_at,
    expense.request_id
  );

  res.status(201).json(expense);
});

// GET /expenses
router.get("/expenses", (req, res) => {
  const { category, sort } = req.query;

  let query = "SELECT * FROM expenses";
  const params = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  if (sort === "date_desc") {
    query += " ORDER BY date DESC";
  }

  const results = db.prepare(query).all(...params);
  res.json(results);
});

module.exports = router;
