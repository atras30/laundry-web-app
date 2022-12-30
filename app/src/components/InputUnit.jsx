import React from "react";

export default function InputUnit({ weightInKg, handleCategoryChange }) {
  return (
    <>
      <label htmlFor="input-unit" className="mb-2 fw-bold">
        Unit
      </label>

      <div className="input-group shadow-sm">
        <input ref={weightInKg} id="input-unit" type="number" step="any" className="form-control" inputMode="decimal" onChange={handleCategoryChange} />
        <span className="input-group-text" id="basic-addon2">
          Unit
        </span>
      </div>
    </>
  );
}
