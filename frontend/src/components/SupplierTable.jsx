import { useEffect, useState } from "react";

const SupplierTable = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", contact: "" });

  // Fetch all suppliers
  useEffect(() => {
    fetch("http://127.0.0.1:8000/suppliers")
      .then((response) => response.json())
      .then((data) => setSuppliers(data));
  }, []);

  // Create a new supplier
  const handleCreate = () => {
    fetch("http://127.0.0.1:8000/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        setSuppliers((prev) => [...prev, data.supplier]);
        setForm({ name: "", email: "", contact: "" });
      });
  };

  // Update a supplier
  const handleUpdate = (id) => {
    const updatedName = prompt("Enter the new name:");
    const updatedEmail = prompt("Enter the new email:");
    const updatedContact = prompt("Enter the new contact:");

    if (!updatedName && !updatedEmail && !updatedContact) {
      alert("No changes provided. Update cancelled.");
      return;
    }

    const updatedData = {
      ...(updatedName && { name: updatedName }),
      ...(updatedEmail && { email: updatedEmail }),
      ...(updatedContact && { contact: updatedContact }),
    };

    fetch(`http://127.0.0.1:8000/suppliers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then(() => {
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.id === id ? { ...supplier, ...updatedData } : supplier
          )
        );
        alert("Supplier updated successfully!");
      })
      .catch((error) => console.error("Error updating supplier:", error));
  };

  // Delete a supplier
  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/suppliers/${id}`, { method: "DELETE" })
      .then(() => {
        setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
      });
  };

  return (
    <div>
      <h2>Suppliers</h2>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Contact"
        value={form.contact}
        onChange={(e) => setForm({ ...form, contact: e.target.value })}
      />
      <button onClick={handleCreate}>Add Supplier</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.id}</td>
              <td>{supplier.name}</td>
              <td>{supplier.email}</td>
              <td>{supplier.contact}</td>
              <td>
                <button onClick={() => handleUpdate(supplier.id)}>Update</button>
                <button onClick={() => handleDelete(supplier.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
