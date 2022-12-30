import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiBaseUrl, baseUrl } from "../provider/ApiService";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import Customer from "../components/Customer";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../layouts/MasterLayout";

export default function Admin() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!new Cookies().get("token")) {
      navigate("/");
      return;
    }

    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    const response = await axios
      .get(apiBaseUrl("/customers"), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        if (error.response.data.message === "Unauthenticated.") {
          new Cookies().remove("token");
          navigate("/");
          return;
        }
      });

    console.log(response);
    setCustomers(response.data.customers);
  }
  return (
    <MasterLayout>
      <div className="container text-black">
        <div className="title fs-5 fw-bold text-center mb-2">Data Customer</div>
        <button className="add-customer btn btn-primary w-100 mb-3">Tambah Customer</button>

        <div className="customers">
          {customers?.map((customer) => (
            <Customer key={customer.id} customer={customer} />
          ))}
        </div>
      </div>
    </MasterLayout>
  );
}
