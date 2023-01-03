import axios from "axios";
import { formatRelative } from "date-fns";
import { id } from "date-fns/locale";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiBaseUrl } from "../provider/ApiService";
import MasterLayout from "../layouts/MasterLayout";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import DetailSubOrder from "../components/DetailSubOrder";
import { formatRupiah } from "../helper/helper";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DetailOrder() {
  const [order, setOrder] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFetchingDetailOrder, setIsFetchingDetailOrder] = useState(true);
  const orderId = searchParams.get("id");
  const orderStatus = useRef(null);
  const statusPayment = useRef(null);
  const navigate = useNavigate();
  const closeModalButton = useRef(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  function fetchOrder() {
    axios
      .get(apiBaseUrl(`/orders/${orderId}`))
      .then((response) => {
        setOrder(response.data.order);
        // console.log(response.data.order);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsFetchingDetailOrder(false);
      });
  }

  function handleStatusChange() {
    const status = orderStatus.current.value;
    if (status === "Sedang dikerjakan") {
      axios
        .put(
          apiBaseUrl(`/orders/status/${orderId}`),
          {
            status: orderStatus.current.value,
          },
          {
            headers: {
              Authorization: new Cookies().get("token"),
            },
          }
        )
        .then((response) => {
          toast.success(response.data.message);
          fetchOrder();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else if (status === "Selesai") {
      axios
        .put(
          apiBaseUrl(`/orders/status/${orderId}`),
          {
            status: orderStatus.current.value,
          },
          {
            headers: {
              Authorization: new Cookies().get("token"),
            },
          }
        )
        .then((response) => {
          toast.success(response.data.message);
          fetchOrder();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else if (status === "Menunggu diambil") {
      axios
        .put(
          apiBaseUrl(`/orders/status/${orderId}`),
          {
            status: orderStatus.current.value,
          },
          {
            headers: {
              Authorization: new Cookies().get("token"),
            },
          }
        )
        .then((response) => {
          toast.success(response.data.message);
          fetchOrder();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  }

  function handlePaymentStatusChange() {
    const status = statusPayment.current.value;
    if (status === "Lunas") {
      axios
        .put(
          apiBaseUrl(`/orders/payment_status/${orderId}`),
          {
            payment_status: statusPayment.current.value,
          },
          {
            headers: {
              Authorization: new Cookies().get("token"),
            },
          }
        )
        .then((response) => {
          toast.success(response.data.message);
          fetchOrder();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else if (status === "Belum bayar") {
      axios
        .put(
          apiBaseUrl(`/orders/payment_status/${orderId}`),
          {
            payment_status: statusPayment.current.value,
          },
          {
            headers: {
              Authorization: new Cookies().get("token"),
            },
          }
        )
        .then((response) => {
          toast.success(response.data.message);
          fetchOrder();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  }

  function deleteOrder() {
    axios
      .delete(apiBaseUrl(`/orders/${orderId}`), {
        headers: {
          Authorization: new Cookies().get("token"),
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        closeModalButton.current.click();
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  async function handleWhatsappChat(status) {
    let textWithOrderLink = `Halo pelanggan cinta laundry!\n\nLaundry anda telah kami terima dengan nomor antrian : *${orderId}*.\n\nUntuk memantau proses dan rincian laundry anda, bisa dilihat di link berikut ya : https://cintalaundry.atras.my.id/#/orders?id=${orderId}\n\n-Salam hangat, Cinta Laundry-`;
    let textRequestForPickup = `Halo pelanggan cinta laundry!\n\nkami ingin memberikan info bahwa laundry kamu sudah selesai dan sudah bisa diambil di *Kota Sutera Cluster BlossomVille Blok B7/20* atau *Taman Nuri Blok NC1/32* (Cinta Laundry)\n\nberikut rincian keterangan pesanannya :\nNomor Antrian : *${order.id}*\n=====\n`;
    order.sub_orders.forEach((subOrder, index) => {
      textRequestForPickup += `${index + 1}.\nJenis Layanan : *${subOrder?.type}*\nJumlah : *${subOrder.amount}*\nHarga Per (KG / Unit) : *${formatRupiah(subOrder?.price_per_kg, "Rp. ")}* \nSub Total : *${formatRupiah(subOrder?.total, "Rp. ")}*\n`;
    });
    textRequestForPickup += `=====\nTotal Harga : *Rp. ${formatRupiah(order?.price, "Rp. ")}*\nStatus Pesanan : *${order?.status}*\nStatus Pembayaran : *${order?.payment_status}*\n\nTerimakasih telah mempercayakan kebutuhan laundry anda kepada kami.\nUntuk informasi lebih lanjut anda bisa mengunjungi website kami : https://cintalaundry.atras.my.id\n\n-Salam hangat, Cinta Laundry-`;

    // await navigator.clipboard.writeText(text);

    if (status === "Sedang dikerjakan") {
      window.location.href = `https://api.whatsapp.com/send/?phone=${order.customer.phone_number}&text=${encodeURIComponent(textWithOrderLink)}`;
    } else if (status === "Menunggu diambil") {
      window.location.href = `https://api.whatsapp.com/send/?phone=${order.customer.phone_number}&text=${encodeURIComponent(textRequestForPickup)}`;
    } else if (status === "Lunas") {
      // window.location.href = `https://api.whatsapp.com/send/?phone=${order.customer.phone_number}&text=${encodeURIComponent(text)}`;
    }
  }

  return (
    <MasterLayout>
      <div className="title fw-bold fs-2 text-center mb-3 text-white">Detail Order</div>
      <div className="container">
        {/* If order is still fecthing, display loading */}
        {isFetchingDetailOrder ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="card text-center mb-3">
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
                          <span className={`${order?.status === "Sedang dikerjakan" ? "bg-primary" : order?.status === "Selesai" ? "bg-success" : order?.status === "Menunggu diambil" ? "bg-danger" : ""} p-3 rounded py-0 text-white fw-bold d-flex justify-content-center align-items-center`}>{order?.status}</span>
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
            <div>
              <div className="d-flex gap-2 mb-3">
                <select ref={orderStatus} onChange={handleStatusChange} className="form-select btn button-accent-purple" aria-label="Default select example">
                  <option>Ubah Status</option>
                  <option value="Sedang dikerjakan">Sedang dikerjakan</option>
                  <option value="Menunggu diambil">Menunggu diambil</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <select ref={statusPayment} onChange={handlePaymentStatusChange} className="form-select btn button-accent-purple" aria-label="Default select example">
                  <option>Ubah Status Bayar</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Belum bayar">Belum bayar</option>
                </select>
              </div>

              <div className="d-flex flex-column gap-3">
                <button onClick={() => handleWhatsappChat(order?.status)} className="btn btn-success w-100">
                  <i className="bi bi-whatsapp me-2"></i>Chat Melalui Whatsapp
                </button>

                <button className="btn btn-danger w-100 mb-4" data-bs-toggle="modal" data-bs-target="#delete-modal">
                  Hapus Pesanan
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="modal fade" id="delete-modal" tabIndex="-1" aria-labelledby="delete-modal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-center" id="exampleModalLabel">
                yakin ingin menghapus pesanan ?
              </h1>
            </div>
            <div className="modal-footer">
              <button ref={closeModalButton} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Kembali
              </button>
              <button type="button" className="btn btn-primary" onClick={deleteOrder}>
                Ya, Yakin!
              </button>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
