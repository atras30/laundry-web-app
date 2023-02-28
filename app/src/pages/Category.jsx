import axios from "axios";
import React, { useEffect, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";

export default function Category() {
  const [priceList, setPriceList] = useState([]);
  const [expressPriceList, setExpressPriceList] = useState([]);
  const [instantPriceList, setInstantPriceList] = useState([]);

  const fetchCategories = () => {
    axios
      .get(apiBaseUrl("/categories"))
      .then((response) => {
        const categories = response.data.categories;
        const normalPriceList = categories.filter((category) => category.type === "normal");
        const expressPriceList = categories.filter((category) => category.type === "express");
        const instantPriceList = categories.filter((category) => category.type === "instant");

        setPriceList(normalPriceList);
        setExpressPriceList(expressPriceList);
        setInstantPriceList(instantPriceList);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <MasterLayout>
      <div className="p-3">
        <h1 className="text-center mt-5 fw-bold">Daftar Kategori</h1>

        <button className="btn button-accent-purple rounded-pill w-100 mb-3 fw-bold" style={{ background: "#287eff" }}>
          Tambah Order
        </button>

        <section data-aos="flip-left" className="price-list">
          <h1 className="text-center fw-bold">Price List</h1>
          <p className="text-center text-danger fw-bold mb-3">*Estimasi waktu pengerjaan : 3 Hari</p>
          <table className="table table-striped shadow rounded overflow-hidden">
            <thead className="light-grey-background text-white">
              <tr>
                <th className="p-2 text-center">#</th>
                <th className="p-2">Layanan</th>
                <th className="p-2">Harga</th>
              </tr>
            </thead>
            <tbody className="table-light">
              {priceList.map((category, index) => {
                return (
                  <tr key={index + 1} className="fw-semibold">
                    <td className="text-center">{index + 1}</td>
                    <td>{category.title}</td>
                    <td>{category.price_text}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section data-aos="flip-left" className="price-list">
          <p className="text-center mt-5 mb-3 express-price-list fw-bold fs-1">Express Price List</p>
          <p className="text-center text-danger fw-bold mb-3">*Estimasi waktu pengerjaan : 2 Hari</p>
          <table className="table table-striped shadow rounded overflow-hidden">
            <thead className="light-grey-background text-white">
              <tr>
                <th className="p-2 text-center">#</th>
                <th className="p-2">Layanan</th>
                <th className="p-2">Harga</th>
              </tr>
            </thead>
            <tbody className="table-light">
              {expressPriceList.map((category, index) => {
                return (
                  <tr key={index + 1} className="fw-semibold">
                    <td className="text-center">{index + 1}</td>
                    <td>{category.title}</td>
                    <td>{category.price_text}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section data-aos="flip-left" className="price-list">
          <p className="text-center mt-5 mb-3 instant-price-list fw-bold fs-1">Instant Price List</p>
          <p className="text-center text-danger fw-bold mb-3">*Estimasi waktu pengerjaan : 1 Hari</p>
          <table className="table table-striped shadow rounded overflow-hidden">
            <thead className="light-grey-background text-white">
              <tr>
                <th className="p-2 text-center">#</th>
                <th className="p-2">Layanan</th>
                <th className="p-2">Harga</th>
              </tr>
            </thead>
            <tbody className="table-light">
              {instantPriceList.map((category, index) => {
                return (
                  <tr key={index + 1} className="fw-semibold">
                    <td className="text-center">{index + 1}</td>
                    <td>{category.title}</td>
                    <td>{category.price_text}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>

      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h3 class="modal-title w-100 fs-5 fw-bold">Tambah Kategori</h3>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="nama-kategori" class="form-label">
                    Nama Kategori
                  </label>
                  <input type="text" class="form-control" id="nama-kategori" />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="rounded-pill btn btn-secondary" data-bs-dismiss="modal">
                Batal
              </button>
              <button type="button" class="btn btn-primary rounded-pill">
                Tambah Kategori
              </button>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
