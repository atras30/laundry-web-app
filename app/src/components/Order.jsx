import React from "react";
import { format, formatRelative } from "date-fns";
import { id } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import DetailSubOrder from "./DetailSubOrder";
import { formatRupiah } from "../helper/helper";

export default function Order({ order, index }) {
  const navigate = useNavigate();

  function handleRedirect() {
    if (!new Cookies().get("token")) return;

    navigate(`/orders?id=${order.id}`);
  }

  return (
    <div data-aos={index % 2 === 0 ? "flip-left" : "flip-right"} data-aos-duration="400" className="card text-center mb-3" style={{ cursor: "pointer" }} onClick={handleRedirect}>
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

              <tr>
                <td colSpan={3} className="pt-3 pb-1">
                  {order?.sub_orders?.map((subOrder) => (
                    <DetailSubOrder key={subOrder.id} subOrder={subOrder} />
                  ))}
                </td>
              </tr>

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
                  {order?.status === "Sedang dikerjakan" && <span className={`bg-primary mb-1 p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>{order?.status}</span>}
                  {order?.status === "Selesai" && <span className={`bg-success mb-1 p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>{order?.status}</span>}
                  {order?.status === "Menunggu diambil" && <span className={`bg-danger mb-1 p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>{order?.status}</span>}
                  {order?.status === "Sudah diantar" && <span className={`bg-success mb-1 p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>{order?.status}</span>}
                </td>
              </tr>

              <tr>
                <td className="fw-bold">Status Bayar</td>
                <td className="px-2">:</td>
                <td>
                  <span className={`${order?.payment_status === "Belum bayar" ? "bg-danger" : order?.payment_status === "Lunas" ? "bg-success" : order?.payment_status === "Sudah bayar" ? "bg-warning" : "Unknown"} p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>{order?.payment_status}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer text-muted">
        {/* <div>Tanggal Masuk : {order && formatRelative(new Date(order?.created_at), new Date(), { locale: id })}</div> */}
        <div>Tanggal Masuk : {order && format(new Date(order?.created_at), "dd MMMM yyyy", { locale: id })}</div>
        <div>Tanggal Selesai : {!order.done_at ? "-" : format(new Date(order?.done_at), "dd MMMM yyyy", { locale: id })}</div>
      </div>
    </div>
  );
}
