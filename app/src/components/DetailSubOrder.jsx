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
    <table className="table table-bordered table-striped shadow-sm text-center rounded overflow-hidden">
      <thead className="purple-300 text-white">
        <tr>
          <th colSpan={4}>{subOrder.type}</th>
          {console.log(subOrder)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="fw-bold">Harga</td>
          <td>
            {formatRupiah(subOrder.price_per_kg, "Rp. ")} {+parseInt(subOrder.is_price_per_unit) === 1 ? " / Unit" : subOrder?.price_per_multiplied_kg ? ` / ${subOrder?.price_per_multiplied_kg} KG` : " / KG"}
          </td>
        </tr>
        <tr>
          <td className="fw-bold">Jumlah</td>
          <td>{subOrder.amount}</td>
        </tr>
        <tr>
          <td className="fw-bold">Sub Total</td>
          <td>{formatRupiah(subOrder.total, "Rp. ")}</td>
        </tr>
      </tbody>
    </table>
  );
}
