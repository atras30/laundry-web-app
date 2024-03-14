import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import DetailSubOrder from "./DetailSubOrder";
import { formatRupiah } from "../helper/helper";
import "../styles/order.css";

export default function Order({ order, orders, setOrders }) {
  // Misc
  const navigate = useNavigate();

  function handleRedirect() {
    if (!new Cookies().get("token")) return;

    navigate(`/orders?id=${order.id}`);
  }

  function expandDetailOrder(event) {
    event.stopPropagation();

    const newOrders = orders?.map((record) => {
      if (record.id == order.id) return { ...record, expand: !order?.expand };

      return record;
    });

    setOrders(newOrders);
  }

  function _renderExpandIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
      </svg>
    );
  }

  //CSS Stylesheet objects
  const masterStyle = {
    showDetailOrder: { borderRadius: "0", borderTopRightRadius: ".4rem", minWidth: "3rem", fontSize: ".8rem" },
  };

  return (
    <div id={`order-${order.id}`} className="shadow-md card text-center mb-2" style={{ cursor: "pointer" }} onClick={handleRedirect}>
      <div className="card-body text-start m-0 p-0">
        <h5 className="card-header fw-bold text-center rounded-top p-2 border-2 border-black border-bottom position-relative">
          <span>{order?.customer.name}</span>
          <div className="button-accent-purple position-absolute end-0 top-50 translate-middle-y px-3 h-100 d-flex justify-content-center align-items-center" style={masterStyle.showDetailOrder} onClick={expandDetailOrder}>
            {_renderExpandIcon()}
          </div>
        </h5>

        <div className={`overflow-hidden ${order?.expand && "p-3"}`} style={{ height: order?.expand ? "auto" : "0" }}>
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
                  <span
                    className={`${
                      order?.payment_status === "Belum bayar" ? "bg-danger" : order?.payment_status === "Lunas" ? "bg-success" : order?.payment_status === "Sudah bayar" ? "bg-warning" : "Unknown"
                    } p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>
                    {order?.payment_status}
                  </span>
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
