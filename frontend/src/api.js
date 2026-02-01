const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function getExpenses({ category, sort }) {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (sort) params.append("sort", sort);

  const res = await fetch(`${API_URL}/expenses?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createExpense(payload) {
  const res = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
}
