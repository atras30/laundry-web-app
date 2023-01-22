import React from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { apiBaseUrl } from "../provider/ApiService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function NavbarAdmin() {
  const navigate = useNavigate();

  function handleLogout() {
    axios
      .post(
        apiBaseUrl("/auth/logout"),
        {},
        {
          headers: {
            Authorization: new Cookies().get("token"),
          },
        }
      )
      .then((response) => {
        toast.success("Logout berhasil.");
      })
      .catch((error) => {
        toast.error("Error, " + error.response.data.message);
      })
      .finally(() => {
        new Cookies().remove("token");
        navigate("/");
      });
  }

  return (
    <nav className="navbar mb-3 navbar-expand-lg position-relative shadow-sm navbar-background">
      <div className="container-fluid px-4">
        <Link className="navbar-brand text-white fw-semibold" to="/">
          <img className="rounded-pill me-2" style={{ width: "30px", height: "30px" }} src="/logo.jpg" alt="Cinta Laundry Logo" />
          Admin
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="text-white nav-link active" to="/admin">
                Daftar Order
              </Link>
            </li>
            <li className="nav-item">
              <Link className="text-white nav-link active" to="/admin/customers">
                Daftar Customer
              </Link>
            </li>
            <li className="nav-item">
              <Link className="text-white nav-link active" to="/admin/report">
                Laporan Keuangan
              </Link>
            </li>
            <li className="nav-item">
              <Link className="text-white nav-link active" to={"/admin/report/print"}>
                Cetak Laporan
              </Link>
            </li>
            <li className="nav-item">
              <Link className="text-white nav-link active" onClick={() => (window.location.href = "https://drive.google.com/drive/u/0/folders/1DFmnM9N4erE2PmtIXJCpp_g43KNEgxdc")}>
                Aplikasi Printer
              </Link>
            </li>
            <li className="nav-item">
              <span className="nav-link active text-white" onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
