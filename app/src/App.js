import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import axios from "axios";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import AddOrder from "./pages/AddOrder";
import DetailOrder from "./pages/DetailOrder";
import OrderHistory from "./pages/OrderHistory";
import "./styles/global.css";

export default function App() {
  useEffect(() => {
    axios.defaults.withCredentials = true;
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/admin" element={<OrderHistory />}></Route>
          <Route path="/admin/customers" element={<Admin />}></Route>
          <Route path="/orders/add" element={<AddOrder />}></Route>
          <Route path="/orders" element={<DetailOrder />}></Route>
        </Routes>
      </HashRouter>
      <ToastContainer />
    </div>
  );
}
