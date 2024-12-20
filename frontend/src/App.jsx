import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Suppliers from "./pages/Suppliers";
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirect "/" to "/suppliers" */}
          <Route index element={<Navigate to="/suppliers" />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stocks" element={<Stocks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
