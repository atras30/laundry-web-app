import React from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";

export default function MasterLayout({ children }) {
  return (
    <div className="purple-gradient-background" style={{ minHeight: "100vh" }}>
      {new Cookies().get("token") ? <NavbarAdmin /> : <Navbar />}
      {children}
    </div>
  );
}
