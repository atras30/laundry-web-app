import React from "react";
import DeleteCustomerModal from "./DeleteCustomerModal";
import EditCustomerModal from "./EditCustomerModal";

export default function Customer({ deleteCustomer, selectedEditCustomer, customerId, customer, editCustomerButton, fetchCustomers, setSelectedEditCustomerId, selectedEditCustomerId }) {
  function changeSelectedCustomerId(element) {
    const selectedCustomerId = element.target.getAttribute("id");
    setSelectedEditCustomerId(selectedCustomerId);
  }

  return (
    <div className="customer card text-center mb-3 overflow-hidden">
      <div className="card-header text-black fw-bold position-relative">
        <span>{customer.name}</span>
        <button id={customerId} onClick={changeSelectedCustomerId} data-bs-toggle="modal" data-bs-target="#edit-customer-modal" ref={editCustomerButton} className="btn button-accent-purple m-0 position-absolute end-0 top-0 h-100" style={{ padding: ".3em", width: "5em", borderRadius: "0" }}>
          Edit
        </button>
      </div>
      <div className="card-body p-3">
        <p className="card-text m-2 mt-0">Alamat : {customer.address}</p>
        <p className="card-text m-2">Nomor HP : {customer.phone_number}</p>
        <p className="card-text m-2">Saldo : Rp. {customer.balance}</p>
        <a href={`https://wa.me/${customer?.phone_number}`} className="mb-2 btn btn-success w-100 fw-bold rounded-pill">
          <i className="bi bi-whatsapp me-2"></i>Chat Whatsapp
        </a>
        <button data-bs-toggle="modal" data-bs-target={`#delete-modal-${customer.id}`} className="btn btn-danger w-100 fw-bold rounded-pill">
          <i class="bi bi-trash"></i> Hapus Customer
        </button>
      </div>

      <EditCustomerModal selectedEditCustomer={selectedEditCustomer} fetchCustomers={fetchCustomers} selectedEditCustomerId={selectedEditCustomerId} />
      <DeleteCustomerModal customer={customer} deleteCustomer={deleteCustomer} />
    </div>
  );
}
