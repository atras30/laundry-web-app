import React from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import DetailSubOrder from "./DetailSubOrder";
import { formatRupiah } from "../helper/helper";

export default function Order({ order }) {
  const navigate = useNavigate();

  function handleRedirect() {
    if (!new Cookies().get("token")) return;

    navigate(`/orders?id=${order.id}`);
  }

  return (
    <div className="card text-center mb-3" style={{ cursor: "pointer" }} onClick={handleRedirect}>
      <div className="card-body text-start m-0 p-0">
        <h5 className="card-header fw-bold text-center rounded-top p-2 border-2 border-black border-bottom">{order?.customer.name}</h5>

        <div className="p-3">
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td className="fw-bold">Alamat</td>
                <td className="px-2">:</td>
                <td>{order?.customer.address}</td>
              </tr>

              <td colSpan={3} className="pt-3 pb-1">
                {console.log(order)}
                {order?.sub_orders?.map((subOrder) => (
                  <DetailSubOrder key={subOrder.id} subOrder={subOrder} />
                ))}
              </td>

              <tr>
                <td className="fw-bold">Total Harga</td>
                <td className="px-2">:</td>
                <td>{formatRupiah(order?.price, "Rp. ")}</td>
              </tr>

              <tr>
                <td className="fw-bold">Catatan</td>
                <td className="px-2">:</td>
                <td>{order?.notes}</td>
              </tr>

              <tr>
                <td className="fw-bold">Status</td>
                <td className="px-2">:</td>
                <td>
                  <span className={`mb-1 ${order?.status === "Sedang dikerjakan" ? "bg-primary" : order?.status === "Selesai" ? "bg-success" : order?.status === "Menunggu diambil" ? "bg-danger" : ""} p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>{order?.status}</span>
                </td>
              </tr>

              <tr>
                <td className="fw-bold">Status Bayar</td>
                <td className="px-2">:</td>
                <td>
                  <span className={`${order?.payment_status === "Belum bayar" ? "bg-danger" : order?.payment_status === "Lunas" ? "bg-success" : ""} p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>{order?.payment_status}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer text-muted">Tanggal Masuk : {order && formatRelative(new Date(order?.created_at), new Date(), { locale: id })}</div>
    </div>
  );
}
