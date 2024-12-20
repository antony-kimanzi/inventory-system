import { useEffect, useState } from "react";

const StockTable = () => {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({ product_id: "", quantity: "" });
  const [error, setError] = useState(null);

  // Fetch all stocks
  useEffect(() => {
    fetch("https://inventory-system-y7yr.onrender.com/stocks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch stocks.");
        }
        return response.json();
      })
      .then((data) => setStocks(data))
      .catch((err) => setError(err.message));
  }, []);

  // Create a new stock
  const handleCreate = () => {
    if (!form.product_id || !form.quantity) {
      alert("Please fill in both Product ID and Quantity.");
      return;
    }

    fetch("https://inventory-system-y7yr.onrender.com/stocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        product_id: Number(form.product_id), 
        quantity: Number(form.quantity) 
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail || "Failed to create stock.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setStocks((prev) => [...prev, data.stock]);
        setForm({ product_id: "", quantity: "" });
      })
      .catch((err) => setError(err.message));
  };

  // Update a stock
  const handleUpdate = (id) => {
    const updatedProductId = prompt("Enter the new product ID (leave empty to keep current):");
    const updatedQuantity = prompt("Enter the new quantity (leave empty to keep current):");

    if (!updatedProductId && !updatedQuantity) {
      alert("No changes provided. Update cancelled.");
      return;
    }

    const updatedData = {
      ...(updatedProductId && { product_id: Number(updatedProductId) }),
      ...(updatedQuantity && { quantity: Number(updatedQuantity) }),
    };

    fetch(`https://inventory-system-y7yr.onrender.com/stocks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail || "Failed to update stock.");
          });
        }
        return response.json();
      })
      .then(() => {
        setStocks((prev) =>
          prev.map((stock) => (stock.id === id ? { ...stock, ...updatedData } : stock))
        );
        alert("Stock updated successfully!");
      })
      .catch((err) => {
        setError(err.message);
        alert(`Error updating stock: ${err.message}`);
      });
  };

  // Delete a stock
  const handleDelete = (id) => {
    fetch(`https://inventory-system-y7yr.onrender.com/stocks/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete stock.");
        }
        setStocks((prev) => prev.filter((stock) => stock.id !== id));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div>
      <h2>Stocks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="number"
        placeholder="Product ID"
        value={form.product_id}
        onChange={(e) => setForm({ ...form, product_id: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      />
      <button onClick={handleCreate}>Add Stock</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Date Supplied</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.id}</td>
              <td>{stock.product_id}</td>
              <td>{stock.quantity}</td>
              <td>{new Date(stock.date_supplied).toLocaleString()}</td>
              <td>{new Date(stock.last_updated).toLocaleString()}</td>
              <td>
                <button onClick={() => handleUpdate(stock.id)}>Update</button>
                <button onClick={() => handleDelete(stock.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
