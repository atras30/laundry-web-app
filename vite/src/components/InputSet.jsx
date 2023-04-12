import React from "react";

export default function InputSet({ weightInKg, handleCategoryChange }) {
  return (
    <>
      <label htmlFor="input-set" className="mb-2 fw-bold">
        Set
      </label>

      <div className="input-group shadow-sm">
        <input ref={weightInKg} id="input-unit" type="number" step="any" className="form-control" inputMode="decimal" onChange={handleCategoryChange} />
        <span className="input-group-text" id="basic-addon2">
          Set
        </span>
      </div>
    </>
  );
}
