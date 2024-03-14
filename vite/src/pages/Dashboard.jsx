import React, { useContext, useEffect, useState } from "react";
import MasterLayout from "../layouts/MasterLayout";
import { apiBaseUrl } from "../provider/ApiService";
import { useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";
import "../styles/dashboard.css";
import TypeIt from "typeit";
import CategorySkeleton from "../components/skeleton/CategorySkeleton";
import { Autoplay, EffectCube, Navigation, Pagination } from "swiper";
import { AxiosContext } from "../service/axios/AxiosProvider";

export default function Dashboard() {
  const [priceList, setPriceList] = useState([]);
  const [expressPriceList, setExpressPriceList] = useState([]);
  const [instantPriceList, setInstantPriceList] = useState([]);
  const [searchParams] = useSearchParams();

  //Context
  const axiosInstance = useContext(AxiosContext);

  useEffect(() => {
    fetchCategories();
    checkRedirectToken();
    initTaglineTypeIt();
  }, []);

  function initTaglineTypeIt() {
    new TypeIt("#tagline", {
      speed: 125,
    }).go();
  }

  // Check if the user is logged in using login by google ?
  const checkRedirectToken = () => {
    const token = searchParams.get("token");
    if (!token) return;

    new Cookies().set("token", `Bearer ${token}`, {
      expires: new Date(Date.now() + 3600 * 24 * 365 * 1000),
    });
  };

  const fetchCategories = () => {
    axiosInstance
      .get(apiBaseUrl("/categories"))
      .then((response) => {
        const categories = response.data.categories;

        const normalPriceList = categories.filter((category) => category.type === "normal");
        const expressPriceList = categories.filter((category) => category.type === "express");
        const instantPriceList = categories.filter((category) => category.type === "instant");

        setPriceList(normalPriceList);
        setExpressPriceList(expressPriceList);
        setInstantPriceList(instantPriceList);
      });
  };

  function renderPriceList(category = "normal") {
    let processingTime = 0;
    let tempPriceList = [];
    let className = "";
    let title = "Price List";

    if (priceList.length === 0) return <CategorySkeleton />;

    switch (category) {
      case "normal":
        processingTime = 3;
        tempPriceList = priceList;
        break;
      case "express":
        processingTime = 2;
        tempPriceList = expressPriceList;
        className = "express-price-list";
        title = "Express Price List";
        break;
      case "instant":
        processingTime = 1;
        tempPriceList = instantPriceList;
        className = "instant-price-list";
        title = "Instant Price List";
        break;
    }

    return (
      <section data-aos="flip-left" className="price-list">
        <h1 className={`text-center mt-5 text-decoration-underline fw-bold ${className}`} style={masterStyle.heroTitle}>
          {title}
        </h1>
        <p className="text-center text-danger fw-bold mb-3">*Estimasi waktu pengerjaan : {processingTime} Hari</p>
        <table className="table table-striped shadow rounded overflow-hidden">
          <thead className="light-grey-background text-white">
            <tr>
              <th className="p-2 text-center">#</th>
              <th className="p-2">Layanan</th>
              <th className="p-2">Harga</th>
            </tr>
          </thead>
          <tbody className="table-light">
            {tempPriceList.map((category, index) => {
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
    );
  }

  function renderCubeSwiper() {
    return (
      <div>
        <Swiper
          effect={"cube"}
          grabCursor={true}
          cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 25,
            shadowScale: 0.94,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          pagination={true}
          modules={[EffectCube, Pagination, Navigation, Autoplay]}
          className="mySwiper"
          style={{ overflow: "visible" }}>
          {[...new Array(3)].map((each, index) => {
            return (
              <SwiperSlide key={index}>
                <img className="h-100 w-100 rounded img-thumbnail" src={`/assets/images/landing_page/image-${index + 1}.jpg`} alt="Swiper Item" />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }

  //CSS Stylesheet objects
  const partialStyle = {
    fontPattaya: { fontFamily: "Pattaya" },
  };
  const masterStyle = {
    heroTitle: { letterSpacing: ".2rem", ...partialStyle.fontPattaya },
  };

  return (
    <MasterLayout>
      <div className="container">
        <section className="hero mb-5 px-3 d-flex justify-content-center align-items-center flex-column" style={{ borderRadius: "50%" }}>
          <h1 data-aos="fade-down" data-aos-duration="1000" className="fw-bold text-center mb-4 fs-1" style={masterStyle.heroTitle}>
            Cinta Laundry
          </h1>
          <img data-aos="flip-down" src="/logo.jpg" className="cinta-laundry-logo img-fluid" style={{ objectFit: "cover", borderRadius: "50%" }} alt="Logo Cinta Laundry" />
        </section>

        <h2 data-aos="fade-in" className="text-center mt-3 fw-bold mb-3 tagline" id="tagline">
          Melaundry pakaian kamu dengan cinta <span className="heart">&#10084;</span>
        </h2>
        <section data-aos="fade-up" className="deskripsi rounded shadow p-4 mb-3 light-grey-background text-white" style={{ textAlign: "justify" }}>
          <div className="quality-list fw-bold">
            <div className="mb-4">
              <div className="text-decoration-underline">
                Bersih & Higienis <i className="bi bi-check-circle-fill bg-success rounded-circle"></i>
              </div>
              <div className="fw-light">Menjaga kebersihan mesin cuci dan lingkungan pencucian agar pakaian tercuci dengan higienis.</div>
            </div>
            <div className="mb-4">
              <div className="text-decoration-underline">
                Berkualitas <i className="bi bi-check-circle-fill bg-success rounded-circle"></i>
              </div>
              <div className="fw-light">Menggunakan mesin cuci dan pewangi berkualitas tinggi untuk hasil yang maksimal.</div>
            </div>
          </div>
          <p>
            Yuk, pesan layanan laundry di cinta laundry! Kami melayani kebutuhan laundry anda dengan sepenuh hati. Hubungi kami di nomor{" "}
            <a href="https://wa.me/6281284245520" className="text-white fw-bolder">
              0812-8424-5520
            </a>{" "}
            untuk memesan layanan kami.
          </p>
        </section>

        <h2 data-aos="fade-up" className="fw-bold text-center mt-5 mb-3 text-decoration-underline" style={masterStyle.heroTitle}>
          Tentang Kami
        </h2>
        {renderCubeSwiper()}

        {renderPriceList("normal")}
        {renderPriceList("express")}
        {renderPriceList("instant")}

        <section data-aos="flip-right" className="address mt-5">
          <h2 className="text-center fw-bold" style={masterStyle.heroTitle}>
            Alamat
          </h2>
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

        <section data-aos="fade-up" className="contact mt-5">
          <h2 className="text-center fw-bold" style={masterStyle.heroTitle}>
            Kontak
          </h2>
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
      </div>
    </MasterLayout>
  );
}
