import axios from "axios";
import React, { useEffect, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import Order from "../components/Order";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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
    setOrders(response.data.orders);
  }

  function handleAddOrder() {
    navigate("/orders/add");
  }

  return (
    <MasterLayout>
      <div className="container orders">
        <div className="title fw-bold fs-4 text-center text-black mb-3">Antrian Customer</div>
        <div className="mb-3">
          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Search..." />
        </div>

        {new Cookies().get("token") && (
          <button className="btn btn-primary w-100 mb-3 fw-bold" onClick={handleAddOrder}>
            Tambah Order
          </button>
        )}

        {orders?.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    </MasterLayout>
  );
}
