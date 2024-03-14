import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import { formatRupiah } from "../helper/helper";
import ExpenseSkeleton from "../components/skeleton/ExpenseSkeleton";
import OrderReport from "../components/OrderReport";
import { MonthPicker, MonthInput } from "react-lite-month-picker";
import "../styles/report.css";
import { AxiosContext } from "../service/axios/AxiosProvider";

export default function Report() {
  const axiosInstance = useContext(AxiosContext);
  const inputItem = useRef(null);
  const inputQuantity = useRef(null);
  const inputTotal = useRef(null);
  const closeButton = useRef(null);
  const [selectedMonthData, setSelectedMonthData] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const inputTempTotal = useRef(null);

  useEffect(() => {
    if (selectedMonthData) fetchIncome();
  }, [selectedMonthData]);

  async function fetchIncome() {
    setIsFetchingOrders(true);
    const url = `${apiBaseUrl("/report/expense")}?year=${selectedMonthData.year}&month=${selectedMonthData.month}`;

    axiosInstance
      .get(url)
      .then((response) => {
        const orders = response.data.data;
        setFilteredOrders(orders);

        const totalIncome = orders.reduce((accumulator, order) => {
          if (order.payment_status === "Lunas") {
            return accumulator + parseInt(order.price);
          }

          return accumulator;
        }, 0);

        console.log("total income", totalIncome);
        setTotalIncome(totalIncome);
      })
      .finally((r) => {
        setIsFetchingOrders(false);
      });
  }

  return (
    <MasterLayout>
      <div className="container">
        <div className="title expense text-center fw-bold fs-3 mb-3">Laporan Pengeluaran</div>

        <div>
          <label className="fw-bold">Pilih bulan</label>
          <MonthInput size={"small"} selected={selectedMonthData} setShowMonthPicker={setIsPickerOpen} showMonthPicker={isPickerOpen} />
          {isPickerOpen && <MonthPicker size={"small"} setIsOpen={setIsPickerOpen} selected={selectedMonthData} onChange={setSelectedMonthData} />}
        </div>

        <table className="table table-striped table-bordered text-center bg-light rounded overflow-hidden col-12">
          <thead>
            <tr className="purple-300 text-white fw-bold rounded">
              <td colSpan={3}>Ringkasan</td>
            </tr>
            <tr>
              <th>Total Pengeluaran</th>
              <th>Total Pemasukan</th>
              <th>Total Pendapatan</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{formatRupiah(totalExpense, "Rp ")}</td>
              <td>{formatRupiah(totalIncome, "Rp ")}</td>
              <td>{formatRupiah(totalIncome - totalExpense, totalIncome - totalExpense < 0 ? "Rp -" : "Rp ")}</td>
            </tr>
          </tbody>
        </table>

        <div className="report-table" style={{ overflowX: "scroll" }}>
          <table className="table table-striped table-bordered text-center bg-light rounded overflow-hidden text-center">
            <thead>
              <tr className="purple-300 text-white fw-bold rounded">
                <td colSpan={8}>Tabel Pendapatan</td>
              </tr>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Status Pembayaran</th>
                <th>Tanggal Masuk</th>
                <th>Tanggal Selesai</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>{isFetchingOrders ? <ExpenseSkeleton /> : filteredOrders?.map((order, index) => <OrderReport key={order.id} order={order} index={index + 1} />)}</tbody>
          </table>
        </div>

        <div className="modal fade" id="add-item-modal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title text-center fs-5 w-100 fw-bold" id="exampleModalLabel">
                  Tambah Pengeluaran
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="input-item" className="form-label">
                    Barang
                  </label>
                  <input required type="text" className="form-control" id="input-item" ref={inputItem} />
                </div>
                <div className="mb-3">
                  <label htmlFor="input-quantity" className="form-label">
                    Jumlah
                  </label>
                  <input ref={inputQuantity} type="text" className="form-control" id="input-quantity" />
                </div>
                <div className="mb-3">
                  <label htmlFor="input-total" className="form-label">
                    Total
                  </label>
                  <input ref={inputTotal} onChange={() => (inputTempTotal.current.textContent = formatRupiah(inputTotal.current.value, "Rp "))} required type="number" min={0} className="form-control" id="input-total" />
                  <div ref={inputTempTotal} className="fw-bold text-muted mt-1"></div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center align-items-center w-100 flex-nowrap">
                <button ref={closeButton} type="button" className="btn button-accent-purple w-50" data-bs-dismiss="modal">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
