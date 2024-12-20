import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function AppNavbar() {
  const location = useLocation();

  return (
    <div className="nav-bar">
      <div className="logo">
        <Link to="/suppliers" className="cookie-regular">
          InventoryTracker
        </Link>
      </div>
      <div className="nav-links">
        <Link
          to="/suppliers"
          className={`nav-link ${location.pathname === "/suppliers" ? "active" : ""}`}
        >
          Suppliers
        </Link>
        <Link
          to="/products"
          className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}
        >
          Products
        </Link>
        <Link
          to="/stocks"
          className={`nav-link ${location.pathname === "/stocks" ? "active" : ""}`}
        >
          Stocks
        </Link>
      </div>
    </div>
  );
}
