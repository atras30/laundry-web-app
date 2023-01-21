import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect } from "react";
import axios from "axios";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import AddOrder from "./pages/AddOrder";
import DetailOrder from "./pages/DetailOrder";
import OrderHistory from "./pages/OrderHistory";
import "./styles/global.css";
import ApplicationNotFound from "./pages/ApplicationNotFound";
import Aos from "aos";
import "aos/dist/aos.css";
import Expense from "./pages/Expense";

export default function App() {
  useEffect(() => {
    // Bootstrap javascript import
    require("bootstrap/dist/js/bootstrap.bundle.min.js");

    // axios default configurations
    axios.defaults.withCredentials = true;

    // Animate On Scroll library Initialization
    Aos.init({
      duration: 1000,
    });
  }, []);

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/admin" element={<OrderHistory />}></Route>
          <Route path="/admin/customers" element={<Customers />}></Route>
          <Route path="/orders/add" element={<AddOrder />}></Route>
          <Route path="/orders" element={<DetailOrder />}></Route>
          <Route path="/admin/expense" element={<Expense />}></Route>
          <Route path="/not_found" element={<ApplicationNotFound />}></Route>
        </Routes>
      </HashRouter>
      <ToastContainer />
    </div>
  );
}
