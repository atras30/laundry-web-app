import axios from "axios";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { apiBaseUrl } from "../provider/ApiService";

export default function AddCustomerModal({ fetchCustomers }) {
  // For input customer modal
  const inputName = useRef(null);
  const inputAddress = useRef(null);
  const inputPhone = useRef(null);
  const buttonDismissCreateCustomerModal = useRef(null);

  function createCustomer() {
    axios
      .post(
        apiBaseUrl("/customers"),
        {
          name: inputName.current.value,
          address: inputAddress.current.value,
          phone_number: "62" + inputPhone.current.value,
        },
        {
          headers: {
            Authorization: new Cookies().get("token"),
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        fetchCustomers();
        buttonDismissCreateCustomerModal.current.click();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  return (
    <div className="modal fade" data-bs-backdrop="static" id="add-customer-modal" tabIndex="-1" aria-labelledby="add-customer-modal" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5 w-100 text-center fw-bold" id="exampleModalLabel">
              Daftarkan Customer
            </h1>
          </div>
          <form>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="input-email" className="form-label">
                  Nama
                </label>
                <input ref={inputName} type="email" className="form-control" id="input-email" aria-describedby="emailHelp" />
              </div>
              <div className="mb-3">
                <label htmlFor="input-address" className="form-label">
                  Alamat
                </label>
                <input ref={inputAddress} type="text" className="form-control" id="input-address" />
              </div>
              <label htmlFor="input-tel" className="form-label">
                Nomor Handphone
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text">+62</span>
                <input ref={inputPhone} id="input-tel" type="tel" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
              </div>
            </div>
            <div className="modal-footer d-flex flex-column">
              <button onClick={createCustomer} type="button" className="btn button-accent-purple w-100 fw-semibold">
                Daftar Customer Baru!
              </button>
              <button ref={buttonDismissCreateCustomerModal} type="button" className="btn button-accent-purple w-100 fw-semibold" data-bs-dismiss="modal">
                Batalkan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
