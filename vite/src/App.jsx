import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import AddOrder from "./pages/AddOrder";
import DetailOrder from "./pages/DetailOrder";
import OrderHistory from "./pages/OrderHistory";
import "./styles/global.css";
import ApplicationNotFound from "./pages/ApplicationNotFound";
import Aos from "aos";
import Report from "./pages/Report";
import Category from "./pages/Category";
import PrintReport from "./pages/PrintReport";
import AxiosProvider from "./service/axios/AxiosProvider";

export default function App() {
  useEffect(() => {
    initBootstrap();
    initAos();
  }, []);

  function initAos() {
    Aos.init({
      duration: 1000,
    });
  }

  function initBootstrap() {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }

  return (
    <div className="App">
      <HashRouter>
        <AxiosProvider>
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/admin" element={<OrderHistory />}></Route>
            <Route path="/admin/customers" element={<Customers />}></Route>
            <Route path="/orders/add" element={<AddOrder />}></Route>
            <Route path="/orders" element={<DetailOrder />}></Route>
            <Route path="/admin/report" element={<Report />}></Route>
            <Route path="/admin/report/print" element={<PrintReport />}></Route>
            <Route path="/categories" element={<Category />}></Route>
            <Route path="/not_found" element={<ApplicationNotFound />}></Route>
          </Routes>
        </AxiosProvider>
      </HashRouter>
      <ToastContainer />
    </div>
  );
}
