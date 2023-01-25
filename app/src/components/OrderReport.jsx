import { format } from "date-fns";
import { id } from "date-fns/locale";
import React from "react";
import { Link } from "react-router-dom";
import { formatRupiah } from "../helper/helper";

export default function OrderReport({ index, order }) {
  return (
    <tr>
      <td className="text-center fw-bold">{index}</td>
      <td className="text-center">{order.customer.name}</td>
      <td className="text-center">{formatRupiah(order.price)}</td>
      <td className="text-center">{order.status}</td>
      <td className="text-center">{order.payment_status}</td>
      <td className="text-center">{format(new Date(order?.created_at), "dd MMMM yyyy", { locale: id })}</td>
      <td className="text-center">{order?.done_at ? format(new Date(order?.done_at), "dd MMMM yyyy", { locale: id }) : "-"}</td>
      <td className="text-center">
        <Link className="link link-primary" to={"/orders?id=" + order.id}>
          Lihat Detail
        </Link>
      </td>
    </tr>
  );
}
