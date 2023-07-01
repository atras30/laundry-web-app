import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import Order from "../components/Order";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import OrderSkeleton from "../components/skeleton/OrderSkeleton";
import Skeleton from "react-loading-skeleton";

export default function OrderHistory() {
  // Misc
  const navigate = useNavigate();

  // Main State
  const [orders, setOrders] = useState([]);
  const [initOrders, setInitOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  // Misc State
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);

  // Refs
  const inputCustomerName = useRef(null);
  const filterOrderStatus = useRef(null);
  const filterStatusPayment = useRef(null);

  useEffect(() => {
    checkMiddleware();
    fetchOrders();
  }, []);

  function checkMiddleware() {
    axios
      .get(apiBaseUrl("/auth/users"), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .catch((error) => {
        if (error?.response?.data?.message === "Unauthenticated.") {
          new Cookies().remove("token");
          navigate("/");
        }
      });
  }

  useEffect(() => {
    const lastCard = document.getElementById(`order-${localStorage.getItem("lastOrderDetailId")}`);

    if (!lastCard) return;

    window.scrollTo(0, lastCard.offsetTop);
  }, [orders]);

  async function fetchOrders() {
    const response = await axios.get(apiBaseUrl(`/orders`));
    setInitOrders(response.data.orders);
    setOrders(response.data.orders);
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

  return (
    <MasterLayout>
      <div data-aos="fade-down" className="container orders pb-2">
        {/* Page's main title */}
        <div className="title fw-bold fs-4 text-center mb-2">Daftar Order</div>
        <div className="d-flex justify-content-center">
          <small className="fw-semibold text-secondary mb-3">Total Order : {orderCount}</small>
        </div>

        {/* Input customer name filter */}
        <div className="mb-3">
          <input onChange={handleInputCustomerChange} type="text" ref={inputCustomerName} className="form-control bg-light rounded-pill" placeholder="Masukkan nama customer..." />
        </div>

        {/* Filter buttons */}
        <div className="d-flex gap-2 mb-3 fw-bold">
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
        <button className="btn button-accent-purple rounded-pill w-100 mb-3 fw-bold" style={{ background: "#287eff" }} onClick={handleAddOrder}>
          Tambah Order
        </button>

        {/* If the order is still fetching, display the loading skeleton */}
        {isFetchingOrders ? <OrderSkeleton /> : null}

        {/* Otherwise, show orders */}
        {orders?.map((order, index) => (
          <Order key={order.id} index={index} order={order} />
        ))}
      </div>
    </MasterLayout>
  );
}
