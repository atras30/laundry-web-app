import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import Order from "../components/Order";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import LoadingSpinner from "../components/LoadingSpinner";

export default function OrderHistory() {
  const [initOrders, setInitOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const navigate = useNavigate();
  const inputCustomerName = useRef(null);

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
    console.log(response.data.orders);
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

  return (
    <MasterLayout>
      <div className="container orders pb-2">
        <div className="title fw-bold fs-4 text-center mb-3">Daftar Order</div>
        <div className="mb-3">
          <input onChange={handleInputCustomerChange} type="text" ref={inputCustomerName} className="form-control bg-light rounded-pill" placeholder="Masukkan nama customer..." />
        </div>

        {new Cookies().get("token") && (
          <button className="btn button-accent-purple rounded-pill w-100 mb-3 fw-bold" style={{ background: "#287eff" }} onClick={handleAddOrder}>
            Tambah Order
          </button>
        )}

        {isFetchingOrders ? <LoadingSpinner /> : null}

        {orders?.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    </MasterLayout>
  );
}
