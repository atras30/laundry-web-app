import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="d-flex mb-3 justify-content-center align-items-center gap-3 fw-bold">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      Mengambil Data...
    </div>
  );
}
