import React, { useContext, useEffect, useRef, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import Order from "../components/Order";
import { useNavigate } from "react-router-dom";
import OrderSkeleton from "../components/skeleton/OrderSkeleton";
import { AxiosContext } from "../service/axios/AxiosProvider";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

export default function OrderHistory() {
  // Misc
  const navigate = useNavigate();
  const axiosInstance = useContext(AxiosContext);

  // Main State
  const [orders, setOrders] = useState([]);
  const [initOrders, setInitOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  // Misc State
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [expandAll, setExpandAll] = useState(false);

  // Refs
  const inputCustomerName = useRef(null);
  const filterOrderStatus = useRef(null);
  const filterStatusPayment = useRef(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const response = await axiosInstance.get(apiBaseUrl(`/orders`));
    if (response?.data === null) return;

    const orders = response.data.orders.map((record) => ({
      ...record,
      expand: false,
    }));

    setInitOrders(orders);
    setOrders(orders);
    setOrderCount(response.data.total);
    setIsFetchingOrders(false);
  }

  function handleAddOrder() {
    navigate("/orders/add");
  }

  const handleInputCustomerChange = () => {
    setOrders(initOrders.filter((order) => order.customer.name.toLowerCase().includes(inputCustomerName.current.value.toLowerCase())));
  };

  function handleFilterChange() {
    const status = filterOrderStatus.current.value;
    const statusPayment = filterStatusPayment.current.value;
    let filteredOrders = [...initOrders];

    if (status) {
      filteredOrders = filteredOrders.filter((order) => order.status === status);
    }

    if (statusPayment) {
      filteredOrders = filteredOrders.filter((order) => order.payment_status === statusPayment);
    }

    setOrders(filteredOrders);
  }

  function expandAllOrders() {
    setOrders((prev) => [...prev?.map((record) => ({ ...record, expand: true }))]);
    setExpandAll(true);
  }

  function hideAllOrders() {
    setOrders((prev) => [...prev?.map((record) => ({ ...record, expand: false }))]);
    setExpandAll(false);
  }

  function searchOrders() {
    const name = inputCustomerName.current.value.toLowerCase();

    axiosInstance.get(apiBaseUrl("/orders"));
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


  
  return (
    <AuthenticatedLayout>
      <MasterLayout>
        <div data-aos="fade-down" className="container orders pb-2">
          {/* Page's main title */}
          <div className="title fw-bold fs-4 text-center mb-2">Daftar Order</div>
          <div className="d-flex justify-content-center">
            <small className="fw-semibold text-secondary mb-2">Total Order : {orderCount}</small>
          </div>

          {/* Input customer name filter */}
          <div className="mb-2 d-flex justify-content-center align-items-center gap-2">
            <input onChange={handleInputCustomerChange} type="text" ref={inputCustomerName} className="form-control bg-light rounded-pill" placeholder="Masukkan nama customer..." />
            <button style={{minWidth: "6rem"}} className="btn button-accent-purple rounded-pill fw-bold" onClick={searchOrders}>
              cari
            </button>
          </div>

          {/* Filter buttons */}
          <div className="d-flex gap-2 mb-2 fw-bold">
            <select ref={filterOrderStatus} onChange={handleFilterChange} className="form-select btn btn-secondary rounded-pill" aria-label="Default select example">
              <option value="">Filter Status</option>
              <option value="Sedang dikerjakan">Sedang dikerjakan</option>
              <option value="Menunggu diambil">Menunggu diambil</option>
              <option value="Sudah diantar">Sudah diantar</option>
              <option value="Selesai">Selesai</option>
            </select>
            <select ref={filterStatusPayment} onChange={handleFilterChange} className="form-select btn btn-secondary rounded-pill" aria-label="Default select example">
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

          {/* If the order is still fetching, display the loading skeleton */}
          {isFetchingOrders ? <OrderSkeleton /> : null}

          {/* Otherwise, show orders */}
          {orders?.map((order) => (
            <Order orders={orders} setOrders={setOrders} key={order.id} order={order} />
          ))}
        </div>
      </MasterLayout>
    </AuthenticatedLayout>
  );
}
