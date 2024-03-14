import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import { apiBaseUrl } from "../provider/ApiService";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { AxiosContext } from "../service/axios/AxiosProvider";

export default function ChangeDoneAtForm({ hideModal, fetchOrder, finishDate, setFinishDate, orderId, setUpdateOrderLoading}) {
  // Context
  const axiosInstance = useContext(AxiosContext);
  
  function handleCreatedAtChange() {
    setUpdateOrderLoading(true);
    
    axiosInstance
      .put(
        apiBaseUrl("/orders/done_at/" + orderId),
        {
          done_at: format(finishDate, "dd-MM-yyyy"),
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
