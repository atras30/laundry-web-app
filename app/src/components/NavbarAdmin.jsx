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
        new Cookies().remove("token");
        toast.success("Logout berhasil.");
        navigate("/login");
      })
      .catch((error) => {
        console.log("TEST");
        toast.error(error.response.data.message);
        if (error.response.data.message === "Unauthenticated.") {
          new Cookies().remove("token");
          navigate("/login");
        }
      });
  }

  return (
    <nav className="navbar mb-3 navbar-expand-lg bg-light position-relative shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-semibold" to="/">
          Cinta laundry
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/admin">
                <img className="rounded-pill me-2" style={{ width: "30px", height: "30px" }} src="/logo.jpg" alt="Cinta Laundry Logo" />
                Lihat Data Customer
              </Link>
            </li>
            <li className="nav-item">
              <span className="nav-link active" onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
