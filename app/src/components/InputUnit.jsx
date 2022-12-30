import React from "react";

export default function InputUnit({ weightInKg, handleCategoryChange }) {
  return (
    <div className="mb-3">
      <label htmlFor="input-weight" className="mb-2 fw-bold">
        Unit
      </label>

      <div className="input-group mb-3 shadow-sm">
        <input ref={weightInKg} id="input-weight" type="number" step="any" className="form-control" inputMode="decimal" onChange={handleCategoryChange} />
        <span className="input-group-text" id="basic-addon2">
          Unit
        </span>
      </div>
    </div>
  );
}
