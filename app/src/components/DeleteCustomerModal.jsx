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
    <div class="modal fade" id={`delete-modal-${customer.id}`} tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Anda yakin ingin menghapus <b>{customer.name}</b> ?
            </h1>
          </div>
          <div class="modal-footer">
            <button ref={closeButton} type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-danger" onClick={handleDeleteCustomer}>
              Yakin!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
