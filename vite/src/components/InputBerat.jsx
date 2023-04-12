import React from "react";

export default function InputBerat({ weightInKg, handleCategoryChange }) {
  return (
    <>
      <label htmlFor="input-weight" className="mb-2 fw-bold">
        Berat
      </label>

      <div className="input-group shadow-sm">
        <input ref={weightInKg} id="input-weight" type="number" step="any" className="form-control" inputMode="decimal" onChange={handleCategoryChange} />
        <span className="input-group-text" id="basic-addon2">
          KG
        </span>
      </div>
    </>
  );
}
