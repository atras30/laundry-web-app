import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import ExpenseItem from "../components/ExpenseItem";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import { formatRupiah } from "../helper/helper";
import { format, lastDayOfMonth } from "date-fns";
import ExpenseSkeleton from "../components/skeleton/ExpenseSkeleton";
import OrderReport from "../components/OrderReport";
import "../styles/report.css";

export default function Expense() {
  const inputItem = useRef(null);
  const inputQuantity = useRef(null);
  const inputTotal = useRef(null);
  const closeButton = useRef(null);
  const filterStartYear = useRef(null);
  const filterStartDate = useRef(null);

  const [expenses, setExpenses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isFetchingExpense, setIsFetchingExpense] = useState(true);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const inputTempTotal = useRef(null);

  function clearInputModal() {
    inputItem.current.value = "";
    inputQuantity.current.value = "";
    inputTotal.current.value = "";
  }

  function handleAddItem() {
    const item = inputItem.current.value;
    const quantity = inputQuantity.current.value;
    const total = inputTotal.current.value;

    axios
      .post(
        apiBaseUrl("/expenses"),
        {
          item,
          quantity,
          total,
        },
        {
          headers: {
            Authorization: new Cookies().get("token"),
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        fetchExpenses();
        closeButton.current.click();
        clearInputModal();
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    fetchExpenses();
    fetchOrders();
  }, []);

  useEffect(() => {
    calculateTotalExpense();
    calculateTotalIncome();
  }, [filteredExpense, filteredOrders]);

  function fetchOrders() {
    axios
      .get(apiBaseUrl("/orders"), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .then((response) => {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
        setIsFetchingOrders(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function calculateTotalExpense() {
    let total = 0;
    filteredExpense.forEach((expense) => {
      total += parseInt(expense.total);
    });
    setTotalExpense(total);
  }

  function calculateTotalIncome() {
    let total = 0;
    filteredOrders.forEach((order) => {
      total += parseInt(order.price);
    });
    setTotalIncome(total);
  }

  function fetchExpenses() {
    axios
      .get(apiBaseUrl("/expenses"), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .then((response) => {
        setExpenses(response.data.expenses);
        setFilteredExpense(response.data.expenses);
        setIsFetchingExpense(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function filterExpense(startYear, startMonth) {
    if (startYear === "" || startMonth === "") {
      setFilteredExpense(expenses);
      setFilteredOrders(orders);
      return;
    }

    let startDate, startDateFilter, endDateFilter;

    if (startMonth === "all") {
      startDate = new Date(startYear);
      startDateFilter = format(startDate, "yyyy-MM-dd 00:00:00");
      endDateFilter = format(lastDayOfMonth(startDate), "yyyy-12-dd 23:59:59");
    } else {
      startDate = new Date(startYear, startMonth);
      startDateFilter = format(startDate, "yyyy-MM-01 00:00:00");
      endDateFilter = format(lastDayOfMonth(startDate), "yyyy-MM-dd 23:59:59");
    }

    console.log({ startDateFilter, endDateFilter });

    const filteredExpense = expenses.filter((expense) => {
      return expense.created_at >= startDateFilter && expense.created_at <= endDateFilter;
    });

    const filteredOrders = orders.filter((order) => {
      return order.created_at >= startDateFilter && order.created_at <= endDateFilter;
    });

    setFilteredExpense(filteredExpense);
    setFilteredOrders(filteredOrders);
  }

  return (
    <MasterLayout>
      <div className="container">
        <div className="title expense text-center fw-bold fs-3 mb-3">Laporan Pengeluaran</div>

        <button className="w-100 rounded-pill align-self-end add-item btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#add-item-modal">
          Tambah Pengeluaran
        </button>

        <div className="d-flex mb-3 justify-content-center align-items-center gap-2">
          <select onChange={() => filterExpense(filterStartYear.current.value, filterStartDate.current.value)} ref={filterStartYear} className="form-select text-center rounded-pill" aria-label="Default select example">
            <option value="">Filter Tahun</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
          <select onChange={() => filterExpense(filterStartYear.current.value, filterStartDate.current.value)} ref={filterStartDate} className="form-select text-center rounded-pill" aria-label="Default select example">
            <option value="">Filter Bulan</option>
            <option value="0">Januari</option>
            <option value="1">Februari</option>
            <option value="2">Maret</option>
            <option value="3">April</option>
            <option value="4">Mei</option>
            <option value="5">Juni</option>
            <option value="6">Juli</option>
            <option value="7">Agustus</option>
            <option value="8">September</option>
            <option value="9">Oktober</option>
            <option value="10">November</option>
            <option value="11">Desember</option>
            <option value="all">Semua Bulan</option>
          </select>
        </div>

        <table className="table table-striped table-bordered text-center bg-light rounded overflow-hidden col-12">
          <thead>
            <tr className="bg-secondary text-white fw-bold rounded">
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
              <td>{formatRupiah(totalExpense - totalIncome, "Rp ")}</td>
            </tr>
          </tbody>
        </table>

        <div className="report-table" style={{ overflowX: "scroll" }}>
          <table className="table table-striped table-bordered text-center bg-light rounded overflow-hidden col-12">
            <thead>
              <tr className="bg-secondary text-white fw-bold rounded">
                <td colSpan={5}>Tabel Pengeluaran</td>
              </tr>
              <tr>
                <th>#</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {isFetchingExpense && <ExpenseSkeleton />}
              {filteredExpense?.map((expense, index) => (
                <ExpenseItem key={expense.id} expense={expense} index={index + 1}></ExpenseItem>
              ))}
            </tbody>
          </table>
        </div>

        <div className="report-table" style={{ overflowX: "scroll" }}>
          <table className="table table-striped table-bordered text-center bg-light rounded overflow-hidden  col-12">
            <thead>
              <tr className="bg-secondary text-white fw-bold rounded">
                <td colSpan={5}>Tabel Pendapatan</td>
              </tr>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Tanggal</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isFetchingOrders && <ExpenseSkeleton />}
              {filteredOrders?.map((order, index) => (
                <OrderReport key={order.id} order={order} index={index + 1}></OrderReport>
              ))}
            </tbody>
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
              <div className="modal-footer">
                <button ref={closeButton} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Batal
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddItem}>
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
