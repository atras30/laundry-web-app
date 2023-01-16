import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { apiBaseUrl } from "../provider/ApiService";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import Customer from "../components/Customer";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../layouts/MasterLayout";
import AddCustomerModal from "../components/AddCustomerModal.jsx";

export default function Customers() {
  const inputCustomerName = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [initCustomers, setInitCustomers] = useState([]);

  const [selectedEditCustomerId, setSelectedEditCustomerId] = useState(null);
  const [selectedEditCustomer, setSelectedEditCustomer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!new Cookies().get("token")) {
      navigate("/");
      return;
    }

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!selectedEditCustomerId) return;
    axios
      .get(apiBaseUrl(`/customers/${selectedEditCustomerId}`), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .then((response) => {
        const customer = response.data.customer;
        setSelectedEditCustomer(customer);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedEditCustomerId]);

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

    setCustomers(response.data.customers);
    setInitCustomers(response.data.customers);
  }

  const handleInputCustomerChange = () => {
    setCustomers(initCustomers?.filter((customer) => customer.name.toLowerCase().includes(inputCustomerName.current.value.toLowerCase())));
  };

  function deleteCustomer(id, closeButton) {
    // console.log("Deleting customer : " + id);

    closeButton.click();
    const deleteCustomerToast = toast.loading("Menghapus Customer...");

    axios
      .delete(apiBaseUrl("/customers/" + id), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .then((response) => {
        toast.update(deleteCustomerToast, { render: response.data.message, type: "success", isLoading: false, autoClose: 3000, draggable: true, closeOnClick: true });
        closeButton.click();
        fetchCustomers();
      })
      .catch((error) => {
        toast.update(deleteCustomerToast, { render: error.response.data.message, type: "error", isLoading: false, autoClose: 3000, draggable: true, closeOnClick: true });
      });
  }

  return (
    <MasterLayout>
      <div className="container pb-2">
        <div className="title fs-4 fw-bold text-center mb-2">Data Customer</div>

        <div className="mb-3">
          <input onChange={handleInputCustomerChange} type="text" ref={inputCustomerName} className="form-control bg-light rounded-pill" placeholder="Masukkan nama customer..." />
        </div>

        <button className="add-customer rounded-pill btn button-accent-purple w-100 mb-3" style={{ background: "#287eff" }} data-bs-toggle="modal" data-bs-target="#add-customer-modal">
          Tambah Customer
        </button>

        <div className="customers">
          {customers?.map((customer) => (
            <Customer key={customer.id} customerId={customer.id} customer={customer} fetchCustomers={fetchCustomers} setSelectedEditCustomerId={setSelectedEditCustomerId} selectedEditCustomerId={selectedEditCustomerId} selectedEditCustomer={selectedEditCustomer} deleteCustomer={deleteCustomer} />
          ))}
        </div>
      </div>
      {/* ADD CUSTOMER MODAL */}
      <AddCustomerModal fetchCustomers={fetchCustomers} />
    </MasterLayout>
  );
}
