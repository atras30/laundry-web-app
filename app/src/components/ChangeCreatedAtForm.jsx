import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import { apiBaseUrl } from "../provider/ApiService";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";

export default function ChangeCreatedAtForm({ hideModal, fetchOrder, startDate, setStartDate, orderId }) {
  function handleCreatedAtChange() {
    const id = toast.loading("Please wait...");

    axios
      .put(
        apiBaseUrl("/orders/created_at/" + orderId),
        {
          created_at: startDate,
        },
        {
          headers: {
            Authorization: new Cookies().get("token"),
          },
        }
      )
      .then((response) => {
        toast.update(id, { render: response.data.message, type: "success", closeButton: true, closeOnClick: true, autoClose: 2000, isLoading: false });
        fetchOrder();
        hideModal();
      })
      .catch((error) => {
        toast.update(id, { render: error.response.data.message, type: "error", closeButton: true, closeOnClick: true, autoClose: 2000, isLoading: false });
      });
  }

  return (
    <div className="d-flex mt-3 justify-content-evenly align-items-center">
      <div>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
      </div>
      <div>
        <button className="btn btn-primary" onClick={handleCreatedAtChange}>
          Ubah tanggal Masuk
        </button>
      </div>
    </div>
  );
}
