import axios from "axios";
import React, { useEffect, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [priceList, setPriceList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    checkRedirectToken();
    checkMiddleware();
  }, []);

  function checkMiddleware() {
    if (new Cookies().get("token")) {
      navigate("/admin");
    }
  }

  const checkRedirectToken = () => {
    const token = searchParams.get("token");
    if (!token) return;
    new Cookies().set("token", `Bearer ${token}`);
  };

  const fetchCategories = () => {
    axios
      .get(apiBaseUrl("/categories"))
      .then((response) => {
        setPriceList(response.data.categories);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

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

  return (
    <MasterLayout>
      <div className="container">
        <section className="hero mb-5 px-3 d-flex justify-content-center align-items-center flex-column" style={{ borderRadius: "50%" }}>
          <h1 className="fw-bold text-center mb-4 fs-1">Cinta Laundry</h1>
          <img src="/logo.jpg" className="cinta-laundry-logo img-fluid" style={{ objectFit: "cover", borderRadius: "50%" }} alt="Logo Cinta Laundry" />
        </section>

        <h2 className="text-center mt-3 fw-bold mb-3 tagline ">
          Melaundry pakaian kamu dengan cinta <span className="heart">&#10084;</span>
        </h2>
        <section className="deskripsi rounded shadow p-4 mb-3 light-grey-background text-white" style={{ textAlign: "justify" }}>
          <div className="quality-list fw-bold">
            <div className="mb-4">
              Bersih & Higienis <i className="bi bi-check-circle-fill bg-success rounded-circle"></i>
              <div className="fw-light">Menjaga kebersihan mesin cuci dan lingkungan pencucian agar pakaian tercuci dengan higienis.</div>
            </div>
            <div className="mb-4">
              Berkualitas <i className="bi bi-check-circle-fill bg-success rounded-circle"></i>
              <div className="fw-light">Menggunakan mesin cuci dan pewangi berkualitas tinggi untuk hasil yang maksimal.</div>
            </div>
          </div>
          <p>
            Yuk, pesan layanan laundry di cinta laundry! Kami melayani kebutuhan laundry anda dengan sepenuh hati. Hubungi kami di nomor{" "}
            <a href="https://wa.me/6281284245520" className="text-white">
              0812-8424-5520
            </a>{" "}
            untuk memesan layanan kami.
          </p>
        </section>

        <h2 className="fw-bold text-center mt-5 mb-3">Tentang Kami</h2>
        <Swiper grabCursor={true} className="d-flex rounded" slidesPerView={1} onSlideChange={() => console.log("slide change")} onSwiper={(swiper) => console.log(swiper)}>
          {[...new Array(5)].map((each, index) => {
            return (
              <SwiperSlide key={index} style={{ height: "400px" }} className="overflow-hidden d-flex justify-content-center align-items-center">
                <img style={{ objectFit: "cover" }} className="h-100 img-thumbnail rounded" src={`/assets/images/landing_page/image-${index + 1}.png`} alt="Swiper Item" />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <section className="price-list">
          <h1 className="text-center mt-5 fw-bold mb-3">Price List</h1>
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

        <section className="address mt-5">
          <h2 className="text-center fw-bold">Alamat</h2>
          <table className="table table-striped shadow rounded overflow-hidden">
            <thead className="light-grey-background text-white">
              <tr>
                <th className="p-2 text-center">#</th>
                <th className="p-2">Alamat</th>
              </tr>
            </thead>
            <tbody className="table-light">
              <tr className="fw-semibold">
                <td className="text-center">1</td>
                <td>Kota Sutera Cluster BlossomVille Blok B7/20</td>
              </tr>
              <tr className="fw-semibold">
                <td className="text-center">2</td>
                <td>Taman Nuri Blok NC1/32</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="contact mt-5">
          <h2 className="text-center fw-bold">Kontak</h2>
          <table className="table table-striped shadow rounded overflow-hidden">
            <thead className="light-grey-background text-white">
              <tr>
                <th className="p-2 text-center">#</th>
                <th className="p-2">Layanan</th>
                <th className="p-2">Nomor Telepon</th>
              </tr>
            </thead>
            <tbody className="table-light">
              <tr className="fw-semibold">
                <td className="text-center">1</td>
                <td>Whatsapp dan Telepon</td>
                <td>
                  <a href="https://wa.me/6281284245520">0812-8424-5520</a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="footer">Footer</section>
      </div>
    </MasterLayout>
  );
}
