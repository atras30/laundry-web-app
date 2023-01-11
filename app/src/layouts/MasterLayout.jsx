import React from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";

export default function MasterLayout({ children }) {
  return (
    <div className="purple-gradient-background" style={{ minHeight: "100vh" }}>
      {new Cookies().get("token") ? <NavbarAdmin /> : <Navbar />}
      <div className="d-flex justify-content-center flex-column align-items-center">
        <div className="col-12 col-lg-6 col-md-8">{children}</div>
      </div>
    </div>
  );
}
