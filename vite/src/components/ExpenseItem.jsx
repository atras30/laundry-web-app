import axios from "axios";
import { format } from "date-fns";
import id from "date-fns/locale/id";
import { useRef } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { formatRupiah } from "../helper/helper";
import { apiBaseUrl } from "../provider/ApiService";

export default function ExpenseItem({ expense, index, fetchExpenses }) {
  const closeModalButton = useRef(null);

  function handleDeleteItem() {
    console.log("Got id : " + expense.id);

    axios
      .delete(apiBaseUrl(`/expenses/${expense.id}`), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .then((response) => {
        fetchExpenses();
        toast.success(response.data.message);
        closeModalButton.current.click();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  return (
    <tr>
      <td className="fw-bold">{index}</td>
      <td>{expense.item}</td>
      <td>{expense.quantity}</td>
      <td>{formatRupiah(expense.total)}</td>
      <td>{format(new Date(expense?.created_at), "dd MMMM yyyy", { locale: id })}</td>
      <td>
        <button data-bs-toggle="modal" data-bs-target={`#delete-expense-modal-${expense.id}`} className="btn btn-danger">
          Hapus
        </button>

        <div className="modal fade" id={`delete-expense-modal-${expense.id}`} tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title text-center fs-5 w-100 fw-bold" id="exampleModalLabel">
                  Hapus Pengeluaran
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">Anda yakin ingin menghapus item {expense?.item} ?</div>

              <div className="modal-footer">
                <div className="btn btn-danger" data-bs-dismiss="modal" ref={closeModalButton}>
                  Kembali
                </div>
                <div className="btn btn-primary" onClick={handleDeleteItem}>
                  Yakin
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
