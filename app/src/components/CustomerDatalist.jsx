import React, { useRef } from "react";

export default function CustomerDatalist({ customer }) {
  return <option value={`${customer.id}. ${customer.name}`}></option>;
}
