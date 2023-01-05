import axios from "axios";
import React, { useEffect, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import { useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Dashboard() {
  const [priceList, setPriceList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchCategories();
    checkRedirectToken();
  }, []);

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

        <h2 className="text-center mt-3 fw-bold mb-3">Selamat datang di website Cinta Laundry!</h2>
        <section className="deskripsi rounded shadow p-4 mb-3 light-grey-background text-white" style={{ textAlign: "justify" }}>
          <p>Kami merupakan usaha laundry profesional yang menyediakan layanan cuci, setrika, dan pengemasan pakaian dengan kualitas terbaik. Kami menggunakan mesin cuci dan setrika terbaik serta deterjen yang aman untuk kulit dan lingkungan.</p>
          <p>Bagi Anda yang sibuk dengan kegiatan sehari-hari, layanan laundry kami sangat cocok untuk membantu anda menghemat waktu dan tenaga. Jika Anda memiliki pertanyaan atau ingin memesan layanan kami, silakan hubungi kami melalui nomor kontak (Whatsapp) yang tersedia di bagian bawah halaman ini. Kami dengan senang hati akan menjawab pertanyaan Anda dan membantu Anda sesuai dengan kebutuhan yang anda inginkan.</p>
        </section>

        <h2 className="fw-bold text-center mt-5 mb-3">Tentang Kami</h2>
        <Swiper className="d-flex rounded" slidesPerView={1} onSlideChange={() => console.log("slide change")} onSwiper={(swiper) => console.log(swiper)}>
          {[...new Array(5)].map((each, index) => {
            return (
              <SwiperSlide style={{ height: "400px" }} className="overflow-hidden d-flex justify-content-center align-items-center">
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
                    <td className="text-center">{category.id}</td>
                    <td>{category.title}</td>
                    <td>{formatRupiah(category.price, "Rp. ") + (category.price_per_multiplied_kg ? ` / ${category.price_per_multiplied_kg} KG` : parseInt(category.is_price_per_unit) === 1 ? " / Unit" : " / KG")}</td>
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
                <td>0812-8424-5520</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="footer">Footer</section>
      </div>
    </MasterLayout>
  );
}
