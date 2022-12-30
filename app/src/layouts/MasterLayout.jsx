import React from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";

export default function MasterLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#ddd" }}>
      {new Cookies().get("token") ? <NavbarAdmin /> : <Navbar />}
      {children}
    </div>
  );
}
