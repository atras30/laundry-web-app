import { Fragment, useState } from "react";

export default function LoadingLayout({ children, isLoading, customStyle }) {
  // Stylesheet objects
  const masterStyle = {
    loadingLayer: {
      backgroundColor: "rgba(0,0,0,.1)",
      backdropFilter: "blur(5px)",
      zIndex: 9999
    },
  };
  return (
    <div className="position-relative" style={customStyle}>
      <div className={`rounded position-absolute end-0 start-0 top-0 bottom-0 shadow-sm d-flex justify-content-center align-items-center gap-2 px-3 ${isLoading ? "d-block" : "d-none"}`} style={masterStyle.loadingLayer}>
        <div className="spinner-grow" style={{ width: "1.5rem", height: "1.5rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow" style={{ width: "1.2rem", height: "1.2rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow" style={{ width: ".8rem", height: ".8rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      {children}
    </div>
  );
}
