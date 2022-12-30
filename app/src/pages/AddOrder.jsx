import React, { useEffect, useRef, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import Customer from "../components/CustomerDatalist";
import axios from "axios";
import { apiBaseUrl } from "../provider/ApiService";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import Category from "../components/Category";
import InputBerat from "../components/InputBerat";
import InputUnit from "../components/InputUnit";
import { useNavigate } from "react-router-dom";

export default function AddOrder() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chosenCategory, setChosenCategory] = useState([]);
  const pickCustomer = useRef(null);
  const weightInKg = useRef(null);
  const category = useRef(null);
  const paymentStatus = useRef(null);
  const notes = useRef(null);
  const inputName = useRef(null);
  const inputAddress = useRef(null);
  const inputPhone = useRef(null);
  const buttonDismissCreateCustomerModal = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
    fetchCategories();
  }, []);

  function fetchCustomers() {
    axios
      .get(apiBaseUrl("/customers"), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .then((response) => {
        setCustomers(response.data.customers);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        if (error.response.data.message === "Unauthenticated.") {
          new Cookies().remove("token");
          navigate("/login");
        }
      });
  }

  function fetchCategories() {
    axios
      .get(apiBaseUrl("/categories"))
      .then((response) => {
        setCategories(response.data.categories);
        console.log(response.data.categories);
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  }

  function handleCategoryChange() {
    const chosenCategory = categories.find((eachCategory) => parseInt(eachCategory.id) === parseInt(category.current.value));

    if (!chosenCategory) return setTotalPrice(0);

    setChosenCategory(chosenCategory);

    if (chosenCategory.price_per_multiplied_kg != null) {
      return setTotalPrice(chosenCategory.price * Math.ceil(weightInKg.current.value / chosenCategory.price_per_multiplied_kg));
    }

    return setTotalPrice(chosenCategory.price * weightInKg.current.value);
  }

  function togglePaymentStatus() {
    paymentStatus.current.classList.toggle("bg-danger");
    paymentStatus.current.classList.toggle("bg-success");
    if (paymentStatus.current.textContent === "Belum bayar") {
      paymentStatus.current.textContent = "Lunas";
    } else {
      paymentStatus.current.textContent = "Belum bayar";
    }
  }

  function formatRupiah(angka, prefix) {
    angka = angka.toString();
    var number_string = angka.replace(/[^,\d]/g, "").toString(),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
      let separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return prefix === undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
  }

  function handleAddOrder() {
    const customerId = customers.find((customer) => parseInt(customer.id) === parseInt(pickCustomer.current.value.split(".")[0]))?.id;

    axios
      .post(
        apiBaseUrl("/orders"),
        {
          customer_id: customerId,
          weight_in_kg: weightInKg.current.value,
          category: chosenCategory.title,
          notes: notes.current.value,
          payment_status: paymentStatus.current.textContent,
          price: totalPrice,
        },
        {
          headers: {
            Authorization: new Cookies().get("token"),
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  function createCustomer() {
    axios
      .post(
        apiBaseUrl("/customers"),
        {
          name: inputName.current.value,
          address: inputAddress.current.value,
          phone_number: "62" + inputPhone.current.value,
        },
        {
          headers: {
            Authorization: new Cookies().get("token"),
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        fetchCustomers();
        buttonDismissCreateCustomerModal.current.click();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  return (
    <MasterLayout>
      <div className="container">
        <form>
          <div className="mb-3">
            <label htmlFor="exampleDataList" className="form-label fw-bold">
              Pilih Customer
            </label>
            <input ref={pickCustomer} className="form-control shadow-sm" list="datalistOptions" id="exampleDataList" placeholder="Ketik untuk mencari customer..." />
            <datalist id="datalistOptions">
              {customers?.map((customer) => (
                <Customer key={customer.id} customer={customer} />
              ))}
            </datalist>
            <p className="mt-1">
              Customer belum terdaftar ?{" "}
              <button className="m-0 p-0 border-0 bg-transparent link-primary text-decoration-underline" data-bs-toggle="modal" data-bs-target="#add-customer-modal">
                Daftar disini
              </button>
            </p>
          </div>
          <div className="mb-2">
            <label htmlFor="category" className="mb-2 fw-bold">
              Jenis Laundry
            </label>

            <select ref={category} id="category" className="form-select shadow-sm" aria-label="Default select example" onChange={handleCategoryChange}>
              <option>Pilih Jenis Laundry</option>
              {categories?.map((category) => (
                <Category category={category} />
              ))}
            </select>
          </div>
          <InputBerat weightInKg={weightInKg} handleCategoryChange={handleCategoryChange} />
          <div className="form-floating mb-3">
            <textarea ref={notes} className="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
            <label htmlFor="floatingTextarea">Catatan</label>
          </div>
          <div className="status d-flex mb-3">
            <span ref={paymentStatus} className="bg-danger flex-grow-1 p-2 rounded py-1 fw-bold text-white shadow-sm border border-1 text-center" onClick={togglePaymentStatus}>
              Belum bayar
            </span>
          </div>
          <div className="mb-3 fw-bold fs-4 text-center text-black">Total : {formatRupiah(Math.ceil(totalPrice), "Rp. ")}</div>
          <div>
            <button type="submit" onClick={handleAddOrder} className="btn btn-primary w-100 rounded-pill">
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* ADD CUSTOMER MODAL */}
      <div className="modal fade" data-bs-backdrop="static" id="add-customer-modal" tabIndex="-1" aria-labelledby="add-customer-modal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 w-100 text-center" id="exampleModalLabel">
                Daftarkan Customer
              </h1>
            </div>
            <form>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="input-email" className="form-label">
                    Name
                  </label>
                  <input ref={inputName} type="email" className="form-control" id="input-email" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                  <label htmlFor="input-address" className="form-label">
                    Address
                  </label>
                  <input ref={inputAddress} type="text" className="form-control" id="input-address" />
                </div>
                <label htmlFor="input-tel" className="form-label">
                  Phone
                </label>
                <div class="input-group mb-3">
                  <span class="input-group-text">+62</span>
                  <input ref={inputPhone} id="input-tel" type="tel" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                </div>
              </div>
              <div className="modal-footer d-flex flex-column">
                <button ref={buttonDismissCreateCustomerModal} type="button" className="btn btn-danger w-100" data-bs-dismiss="modal">
                  Batalkan
                </button>
                <button onClick={createCustomer} type="button" className="btn btn-primary w-100">
                  Daftar Customer Baru!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
