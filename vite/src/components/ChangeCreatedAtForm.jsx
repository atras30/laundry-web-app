import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import { apiBaseUrl } from "../provider/ApiService";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { AxiosContext } from "../service/axios/AxiosProvider";

export default function ChangeCreatedAtForm({ hideModal, fetchOrder, startDate, setStartDate, orderId, setUpdateOrderLoading }) {
  // Context
  const axiosInstance = useContext(AxiosContext);

  function handleCreatedAtChange() {
    setUpdateOrderLoading(true);

    axiosInstance
      .put(
        apiBaseUrl("/orders/created_at/" + orderId),
        {
          created_at: format(startDate, "dd-MM-yyyy"),
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        fetchOrder();
        hideModal();
      })
      .finally(() => {
        setUpdateOrderLoading(false);
      })
  }

  return (
    <div className="d-flex mt-3 justify-content-evenly align-items-center">
      <div>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
      </div>
      <div>
        <button className="btn button-accent-purple" onClick={handleCreatedAtChange}>
          Ubah
        </button>
      </div>
    </div>
  );
}
