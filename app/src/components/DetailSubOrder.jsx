import React, { useEffect, useRef, useState } from "react";
import InputBerat from "./InputBerat";
import InputUnit from "./InputUnit";

export default function DetailSubOrder({ subOrder }) {
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
    <div style={{ background: "#eaeaea" }} className="p-3 mb-3 rounded shadow-sm border border-1 border-secondary mt-2 pt-3 pb-4">
      <div className="d-flex justify-content-between align-items-start gap-2 flex-column">
        <div className="row col-12">
          <div className="fw-bold col-4">Jenis Layanan</div>
          <div className="col-1">:</div>
          <div className="col-7">{subOrder.type}</div>
        </div>
        <div className="row col-12">
          <div className="fw-bold col-4">Harga Per KG</div>
          <div className="col-1">:</div>
          <div className="col-7">{subOrder.price_per_kg}</div>
        </div>
        <div className="row col-12">
          <div className="fw-bold col-4">Jumlah</div>
          <div className="col-1">:</div>
          <div className="col-7">{subOrder.amount}</div>
        </div>
        <div className="row col-12">
          <div className="fw-bold col-4">Sub Total</div>
          <div className="col-1">:</div>
          <div className="col-7">{subOrder.total}</div>
        </div>
      </div>
    </div>
  );
}
