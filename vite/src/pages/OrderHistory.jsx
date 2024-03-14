import React, { useContext, useEffect, useRef, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import Order from "../components/Order";
import { useNavigate } from "react-router-dom";
import { AxiosContext } from "../service/axios/AxiosProvider";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import LoadingLayout from "../layouts/LoadingLayout";

export default function OrderHistory() {
  // Misc
  const navigate = useNavigate();
  const axiosInstance = useContext(AxiosContext);

  // Main State
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [fetchedOrderCount, setFetchedOrderCount] = useState(0);
  const [nextCurrentPage, setNextCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [statusPayment, setStatusPayment] = useState("");

  // Misc State
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    fetchOrders(search, nextCurrentPage, true, status, statusPayment);
  }, []);

  async function fetchOrders(search = "", nextCurrentPage, replaceAll = false, filterStatus = "", filterStatusPayment = "") {
    setIsFetchingOrders(true);

    const currentPage = replaceAll ? 1 : nextCurrentPage;
    const response = await axiosInstance.get(`${apiBaseUrl(`/orders`)}?search=${search}&currentPage=${currentPage}&status=${filterStatus}&statusPayment=${filterStatusPayment}`).finally(() => setIsFetchingOrders(false));
    if (response?.data === null) return;

    const orders = response.data.orders.map((record) => ({
      ...record,
      expand: false,
    }));

    // Order Counts
    setOrderCount(response.data.total);
    setFetchedOrderCount(response.data.currentTotalData);

    //set if pagination has next page
    setHasNextPage(response.data.hasNextPage);

    // Handle returned orders.
    if (replaceAll) {
      setNextCurrentPage(2);
      setOrders(orders);
      setExpandAll(false);
      return;
    }

    // Increment Current Page
    setNextCurrentPage(nextCurrentPage + 1);

    // Handle Returned Orders
    setOrders((prev) => [...prev, ...orders]);
    return;
  }

  function handleAddOrder() {
    navigate("/orders/add");
  }

  function expandAllOrders() {
    setOrders((prev) => [...prev?.map((record) => ({ ...record, expand: true }))]);
    setExpandAll(true);
  }

  function hideAllOrders() {
    setOrders((prev) => [...prev?.map((record) => ({ ...record, expand: false }))]);
    setExpandAll(false);
  }

  function _renderExpandAllButton() {
    if (expandAll)
      return (
        <button className="btn button-accent-purple rounded-pill w-100 mb-2 fw-bold" onClick={hideAllOrders}>
          Sembunyikan Semua
        </button>
      );

    return (
      <button className="btn button-accent-purple rounded-pill w-100 mb-2 fw-bold" onClick={expandAllOrders}>
        Tampilkan Semua
      </button>
    );
  }

  function _renderOrders() {
    // Otherwise, show orders
    return orders?.map((order) => <Order orders={orders} setOrders={setOrders} key={order.id} order={order} />);
  }

  function loadMoreOrders() {
    fetchOrders(search, nextCurrentPage, false, status, statusPayment);
  }

  function _renderLoadMoreButton() {
    if (!hasNextPage) return;

    return (
      <button className="btn button-accent-purple rounded-pill w-100 mb-2 fw-bold" onClick={loadMoreOrders}>
        Tampilkan Lebih Banyak Lagi.
      </button>
    );
  }

  function handleStatusChange(e) {
    const value = e.currentTarget.value;
    setStatus(value);
    fetchOrders(search, nextCurrentPage, true, value, statusPayment)
  }

  function handleStatusPaymentChange(e) {
    const value = e.currentTarget.value;
    setStatusPayment(value);
    fetchOrders(search, nextCurrentPage, true, status, value)
  }
  
  return (
    <AuthenticatedLayout>
      <MasterLayout>
        <div data-aos="fade-down" className="container orders pb-2">
          {/* Page's main title */}
          <div className="title fw-bold fs-4 text-center mb-2">Daftar Order</div>
          <div className="d-flex justify-content-center">
            <small className="fw-semibold text-secondary mb-2">
              Menampilkan {fetchedOrderCount} order dari total {orderCount} order.
            </small>
          </div>

          {/* Input customer name filter */}
          <div className="d-flex justify-content-center align-items-center gap-1 mb-2">
            <input value={search} onChange={(e) => setSearch(e.currentTarget.value)} type="text" className="form-control bg-light rounded-pill" placeholder="Masukkan nama customer..." />
            <button style={{ minWidth: "6rem" }} className="btn button-accent-purple rounded-pill fw-bold" onClick={() => fetchOrders(search, nextCurrentPage, true, status, statusPayment)}>
              cari
            </button>
          </div>

          {/* Filter buttons */}
          <div className="d-flex gap-2 mb-2 fw-bold">
            <select value={status} onChange={handleStatusChange} className="form-select btn btn-secondary rounded-pill" aria-label="Default select example">
              <option value="">Filter Status</option>
              <option value="Sedang dikerjakan">Sedang dikerjakan</option>
              <option value="Menunggu diambil">Menunggu diambil</option>
              <option value="Sudah diantar">Sudah diantar</option>
              <option value="Selesai">Selesai</option>
            </select>
            <select value={statusPayment} onChange={handleStatusPaymentChange} className="form-select btn btn-secondary rounded-pill" aria-label="Default select example">
              <option value="">Filter Status Bayar</option>
              <option value="Lunas">Lunas</option>
              <option value="Belum bayar">Belum bayar</option>
            </select>
          </div>

          {/* Add order button */}
          <button className="btn button-accent-purple rounded-pill w-100 mb-2 fw-bold" style={{ background: "#287eff" }} onClick={handleAddOrder}>
            Tambah Order
          </button>

          {_renderExpandAllButton()}

          <LoadingLayout isLoading={isFetchingOrders} customStyle={{ minHeight: "3rem" }}>
            {_renderOrders()}
          </LoadingLayout>

          {_renderLoadMoreButton()}
        </div>
      </MasterLayout>
    </AuthenticatedLayout>
  );
}
