import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="d-flex mb-3 justify-content-center align-items-center gap-3 fw-bold">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      Mengambil Data...
    </div>
  );
}
