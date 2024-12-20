import { useEffect, useState } from "react";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    supplier_id: "",
  });

  // Fetch all products
  useEffect(() => {
    fetch("https://inventory-system-y7yr.onrender.com/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  // Create a new product
  const handleCreate = () => {
    fetch("https://inventory-system-y7yr.onrender.com/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(JSON.stringify(errorData));
          });
        }
        return response.json();
      })
      .then((data) => {
        setProducts((prev) => [...prev, data.product]);
        setForm({ name: "", description: "", price: "", supplier_id: "" });
        alert("Product created successfully!");
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        alert(`Failed to create product: ${error.message}`);
      });
  };
  

  // Update a product
  const handleUpdate = (id) => {
    const updatedName = prompt("Enter the new name:");
    const updatedDescription = prompt("Enter the new description:");
    const updatedPrice = prompt("Enter the new price:");
    const updatedSupplierId = prompt("Enter the new supplier ID:");

    if (
      !updatedName &&
      !updatedDescription &&
      !updatedPrice &&
      !updatedSupplierId
    ) {
      alert("No changes provided. Update cancelled.");
      return;
    }

    const updatedData = {
      ...(updatedName && { name: updatedName }),
      ...(updatedDescription && { description: updatedDescription }),
      ...(updatedPrice && { price: updatedPrice }),
      ...(updatedSupplierId && { supplier_id: updatedSupplierId }),
    };

    fetch(`https://inventory-system-y7yr.onrender.com/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then(() => {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, ...updatedData } : product
          )
        );
        alert("Product updated successfully!");
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  // Delete a product
  const handleDelete = (id) => {
    fetch(`https://inventory-system-y7yr.onrender.com/products/${id}`, { method: "DELETE" })
      .then(() => {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      });
  };

  return (
    <div>
      <h2>Products</h2>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        type="number"
        placeholder="Supplier ID"
        value={form.supplier_id}
        onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
      />
      <button onClick={handleCreate}>Add Product</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Supplier ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.supplier_id}</td>
              <td>
                <button onClick={() => handleUpdate(product.id)}>Update</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
