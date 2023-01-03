import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar mb-3 navbar-expand-lg position-relative shadow-sm navbar-background">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          <img className="rounded-pill me-2" style={{ width: "30px", height: "30px" }} src="/logo.jpg" alt="Cinta Laundry Logo" />
          Cinta laundry
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item top-0 bottom-0">
              <Link to="/login" className="nav-link active" aria-current="page">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
