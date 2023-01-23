import React, { useEffect, useRef } from "react";

export default function DeleteCustomerModal({ customer, deleteCustomer }) {
  const closeButton = useRef(null);

  useEffect(() => {
    // console.log(customer);
  }, []);

  function handleDeleteCustomer() {
    deleteCustomer(customer.id, closeButton.current);
  }

  return (
    <div className="modal fade" id={`delete-modal-${customer.id}`} tabindex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Anda yakin ingin menghapus <b>{customer.name}</b> ?
            </h1>
          </div>
          <div className="modal-footer">
            <button ref={closeButton} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDeleteCustomer}>
              Yakin!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
