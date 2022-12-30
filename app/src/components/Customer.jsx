import React from "react";
import { useNavigate } from "react-router-dom";

export default function Customer({ customer }) {
  const navigate = useNavigate();
  function redirectToWhatsapp() {}

  return (
    <div className="customer card text-center mb-3">
      <div className="card-header text-black fw-bold">{customer.name}</div>
      <div className="card-body p-3">
        <p className="card-text m-2 mt-0">Alamat : {customer.address}</p>
        <p className="card-text m-2">Nomor HP : {customer.phone_number}</p>
        <p className="card-text m-2">Saldo : Rp. {customer.balance}</p>
        <button className="btn btn-success w-100 fw-bold" onClick={redirectToWhatsapp}>
          <i className="bi bi-whatsapp me-2"></i>Chat Whatsapp
        </button>
      </div>
    </div>
  );
}
