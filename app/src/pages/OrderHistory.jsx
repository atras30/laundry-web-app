import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import Order from "../components/Order";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import OrderSkeleton from "../components/skeleton/OrderSkeleton";

export default function OrderHistory() {
  const [initOrders, setInitOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const navigate = useNavigate();
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

  async function fetchOrders() {
    const response = await axios.get(apiBaseUrl("/orders"));
    // console.log(response.data.orders);
    setInitOrders(response.data.orders);
    setOrders(response.data.orders);
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
        <div className="title fw-bold fs-4 text-center mb-3">Daftar Order</div>
        <div className="mb-3">
          <input onChange={handleInputCustomerChange} type="text" ref={inputCustomerName} className="form-control bg-light rounded-pill" placeholder="Masukkan nama customer..." />
        </div>

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

        {new Cookies().get("token") && (
          <button className="btn button-accent-purple rounded-pill w-100 mb-3 fw-bold" style={{ background: "#287eff" }} onClick={handleAddOrder}>
            Tambah Order
          </button>
        )}

        {isFetchingOrders ? <OrderSkeleton /> : null}

        {orders?.map((order, index) => (
          <Order key={order.id} index={index} order={order} />
        ))}
      </div>
    </MasterLayout>
  );
}
