import { formatRelative } from "date-fns";
import { id } from "date-fns/locale";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatRupiah } from "../helper/helper";

export default function OrderReport({ index, order }) {
  const navigate = useNavigate();
  console.log(order);
  return (
    <tr>
      <td className="fw-bold">{index}</td>
      <td>{order.customer.name}</td>
      <td>{formatRupiah(order.price, "Rp ")}</td>
      <td>{formatRelative(new Date(order.created_at), new Date(), { locale: id })}</td>
      <td>
        <button className="btn btn-primary" onClick={() => navigate("/orders?id=" + order.id)}>
          Lihat Detail
        </button>
      </td>
    </tr>
  );
}
