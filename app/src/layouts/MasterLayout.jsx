import React from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";

export default function MasterLayout({ children }) {
  return (
    <div className="position-relative" style={{ minHeight: "100vh" }}>
      <div style={{ zIndex: -1 }} className="purple-gradient-background position-fixed top-0 bottom-0 start-0 end-0" />
      {new Cookies().get("token") ? <NavbarAdmin /> : <Navbar />}
      <div className="d-flex justify-content-center flex-column align-items-center">
        <div className="col-12 col-lg-6 col-md-8">{children}</div>
      </div>
    </div>
  );
}
