import axios from "axios";
import React, { useEffect, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";

export default function Dashboard() {
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      <div className="container text-white">
        <section className="hero rounded-pill mb-5 px-3 d-flex justify-content-center align-items-center flex-column">
          <h1 className="fw-bold text-center mb-4 fs-1">Cinta Laundry</h1>
          <img src="/logo.jpg" className="cinta-laundry-logo img-fluid rounded-pill" style={{ objectFit: "cover" }} alt="Logo Cinta Laundry" />
        </section>

        <section className="deskripsi px-3" style={{ textAlign: "justify" }}>
          <p className="text-center fw-bold">Selamat datang Cinta Laundry!</p>
          <p>Kami merupakan usaha laundry profesional yang menyediakan layanan cuci, setrika, dan pengemasan pakaian dengan kualitas terbaik. Kami menggunakan mesin cuci dan setrika terbaik serta deterjen yang aman untuk kulit dan lingkungan.</p>
          <p>Bagi Anda yang sibuk dengan kegiatan sehari-hari, jangan khawatir! layanan laundry kami sangat cocok untuk membantu anda menghemat waktu dan tenaga. Jika Anda memiliki pertanyaan atau ingin memesan layanan kami, silakan hubungi kami melalui nomor kontak (Whatsapp) yang tersedia di bagian bawah halaman ini. Kami dengan senang hati akan menjawab pertanyaan Anda dan membantu Anda sesuai dengan kebutuhan yang anda inginkan.</p>
        </section>

        <section className="price-list">
          <h1 className="text-center mt-3 fw-bold mb-3">Price List</h1>
          <table className="table table-striped shadow rounded overflow-hidden">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="p-2 text-center">#</th>
                <th className="p-2">Layanan</th>
                <th className="p-2">Harga</th>
              </tr>
            </thead>
            <tbody>
              {priceList.map((category, index) => {
                return (
                  <tr key={index + 1} className="table-light fw-semibold">
                    <td className="text-center">{category.id}</td>
                    <td>{category.title}</td>
                    <td>{formatRupiah(category.price, "Rp. ") + (category.price_per_multiplied_kg ? ` / ${category.price_per_multiplied_kg} KG` : parseInt(category.is_price_per_unit) === 1 ? " / Unit" : " / KG")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="kiosk-photo">Foto Kios</section>

        <section className="address">Alamat : Kota Sutera Cluster BlossomVille Blok B7/20 Atau Taman Nuri Blok NC1/32</section>

        <section className="contact-us">Contact</section>
      </div>
    </MasterLayout>
  );
}
