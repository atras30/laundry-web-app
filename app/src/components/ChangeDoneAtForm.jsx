import React from "react";
import DatePicker from "react-datepicker";
import { apiBaseUrl } from "../provider/ApiService";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function ChangeDoneAtForm({ hideModal, fetchOrder, finishDate, setFinishDate, orderId }) {
  function handleCreatedAtChange() {
    const id = toast.loading("Please wait...");

    axios
      .put(
        apiBaseUrl("/orders/done_at/" + orderId),
        {
          done_at: format(finishDate, "dd-MM-yyyy"),
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
    <div className="d-flex mt-3 justify-content-evenly align-items-center gap-2">
      <div>
        <DatePicker dateFormat="dd/MM/yyyy" selected={finishDate} onChange={(date) => setFinishDate(date)} />
      </div>
      <div>
        <button className="btn button-accent-purple" onClick={handleCreatedAtChange}>
          Ubah
        </button>
      </div>
    </div>
  );
}
