import React, { useContext, useEffect, useRef, useState } from "react";
import { apiBaseUrl } from "../provider/ApiService";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import Customer from "../components/Customer";
import MasterLayout from "../layouts/MasterLayout";
import AddCustomerModal from "../components/AddCustomerModal.jsx";
import CustomerSkeleton from "../components/skeleton/CustomerSkeleton";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import { AxiosContext } from "../service/axios/AxiosProvider";

export default function Customers() {
  const inputCustomerName = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [initCustomers, setInitCustomers] = useState([]);
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(true);

  const [selectedEditCustomerId, setSelectedEditCustomerId] = useState(null);
  const [selectedEditCustomer, setSelectedEditCustomer] = useState(null);

  // Context
  const axiosInstance = useContext(AxiosContext);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!selectedEditCustomerId) return;
    const customerUrl = apiBaseUrl(`/customers/${selectedEditCustomerId}`);

    axiosInstance.get(customerUrl).then((response) => {
      const customer = response.data.customer;
      setSelectedEditCustomer(customer);
    });
  }, [selectedEditCustomerId]);

  async function fetchCustomers() {
    const response = await axiosInstance.get(apiBaseUrl("/customers"));

    setInitCustomers(response.data.customers);
    setIsFetchingCustomer(false);

    if (!inputCustomerName.current.value) return setCustomers(response.data.customers);
    return setCustomers(response.data.customers?.filter((customer) => customer.name.toLowerCase().includes(inputCustomerName.current.value.toLowerCase())));
  }

  const handleInputCustomerChange = () => {
    setCustomers(initCustomers?.filter((customer) => customer.name.toLowerCase().includes(inputCustomerName.current.value.toLowerCase())));
  };

  function deleteCustomer(id, closeButton) {
    closeButton.click();
    const deleteCustomerToast = toast.loading("Menghapus Customer...");

    axiosInstance
      .delete(apiBaseUrl(`/customers/${id}`))
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
    <AuthenticatedLayout>
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
            {isFetchingCustomer && <CustomerSkeleton />}
            {customers?.map((customer) => (
              <Customer
                key={customer.id}
                customerId={customer.id}
                customer={customer}
                fetchCustomers={fetchCustomers}
                setSelectedEditCustomerId={setSelectedEditCustomerId}
                selectedEditCustomerId={selectedEditCustomerId}
                selectedEditCustomer={selectedEditCustomer}
                deleteCustomer={deleteCustomer}
              />
            ))}
          </div>
        </div>

        {/* ADD CUSTOMER MODAL */}
        <AddCustomerModal fetchCustomers={fetchCustomers} />
      </MasterLayout>
    </AuthenticatedLayout>
  );
}
