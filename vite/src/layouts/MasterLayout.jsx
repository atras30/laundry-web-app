import React from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";
import Footer from "../components/Footer";

export default function MasterLayout({ children }) {
  const cookies = new Cookies();

  return (
    <div className="position-relative d-flex justify-content-between flex-column" style={{ minHeight: "100vh" }}>
      {/* Background Layer */}
      <div style={{ zIndex: -1 }} className="purple-gradient-background position-fixed top-0 bottom-0 start-0 end-0" />
      
      <div>
        {/* Display Navbar */}
        {cookies.get("token") ? <NavbarAdmin /> : <Navbar />}

        {/* Display Content */}
        <div className="d-flex justify-content-center flex-column align-items-center">
          <div className="col-12 col-lg-6 col-md-8">{children}</div>
        </div>
      </div>

      {/* Display Footer */}
      <Footer />
    </div>
  );
}
