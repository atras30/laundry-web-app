import axios from "axios";
import { formatRelative } from "date-fns";
import { id } from "date-fns/locale";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiBaseUrl, baseUrl } from "../provider/ApiService";
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
  const changeNotes = useRef(null);
  const closeModalButton = useRef(null);
  const closeModalChangeNotesButton = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, []);

  function fetchOrder() {
    axios
      .get(apiBaseUrl(`/orders/${orderId}`))
      .then((response) => {
        const order = response.data.order;
        setOrder(response.data.order);
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
    if (status === "Ubah Status") return;

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

  function handlePaymentStatusChange() {
    const status = statusPayment.current.value;
    if (!status) return;
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
        navigate("/admin");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  async function handleWhatsappChat(status) {
    let textWithOrderLink = `Halo pelanggan cinta laundry!\n\nLaundry anda telah kami terima dengan nomor antrian : *${orderId}*.\n\nUntuk memantau proses dan rincian laundry anda, bisa dilihat di link berikut ya : https://cintalaundry.atras.my.id/#/orders?id=${orderId}\n\n-Salam hangat, Cinta Laundry-`;
    let textOrderDone = `Halo pelanggan cinta laundry!\n\nLaundry kamu sudah selesai \n\nberikut rincian keterangan pesanannya :\n\n• *Nomor Antrian* : ${order.id}\n\n=====`;
    let textDelivered = `Halo pelanggan cinta laundry!\n\nLaundry kamu sudah selesai dan sudah diantar \n\nberikut rincian keterangan pesanannya :\n\n• *Nomor Antrian* : ${order.id}\n\n=====`;
    let textRequestForPickup = `Halo pelanggan cinta laundry!\n\nLaundry kamu sudah selesai dan sudah bisa diambil di *Kota Sutera Cluster BlossomVille Blok B7/20* atau *Taman Nuri Blok NC1/32* (Cinta Laundry)\n\nberikut rincian keterangan pesanannya :\n\n• *Nomor Antrian* : ${order.id}\n\n=====`;

    order.sub_orders.forEach((subOrder, index) => {
      textRequestForPickup += `\n• *Layanan* : ${subOrder?.type}\n• *Jumlah* : ${subOrder.amount}\n• *Harga* : ${formatRupiah(subOrder.price_per_kg, "Rp. ")} ${parseInt(subOrder.is_price_per_unit) === 1 ? " / Unit" : subOrder?.price_per_multiplied_kg ? ` / ${subOrder?.price_per_multiplied_kg} KG` : " / KG"} \n• *Sub Total* : ${formatRupiah(subOrder?.total, "Rp. ")}\n=====`;
      textOrderDone += `\n• *Layanan* : ${subOrder?.type}\n• *Jumlah* : ${subOrder.amount}\n• *Harga* : ${formatRupiah(subOrder.price_per_kg, "Rp. ")} ${parseInt(subOrder.is_price_per_unit) === 1 ? " / Unit" : subOrder?.price_per_multiplied_kg ? ` / ${subOrder?.price_per_multiplied_kg} KG` : " / KG"} \n• *Sub Total* : ${formatRupiah(subOrder?.total, "Rp. ")}\n=====`;
    });
    textRequestForPickup += `\n\n• *Total Harga* : ${formatRupiah(order?.price, "Rp. ")}\n• *Status Pesanan* : Sudah Selesai dan ${order?.status}\n• *Status Pembayaran* : ${order?.payment_status}\n\nTerimakasih telah mempercayakan kebutuhan laundry anda kepada kami.\nUntuk informasi lebih lanjut anda bisa mengunjungi website kami : https://cintalaundry.atras.my.id\n\n-Salam hangat, Cinta Laundry-`;
    textOrderDone += `\n\n• *Total Harga* : ${formatRupiah(order?.price, "Rp. ")}\n• *Status Pesanan* : ${order?.status}\n• *Status Pembayaran* : ${order?.payment_status}\n\nTerimakasih telah mempercayakan kebutuhan laundry anda kepada kami.\nUntuk informasi lebih lanjut anda bisa mengunjungi website kami : https://cintalaundry.atras.my.id\n\n-Salam hangat, Cinta Laundry-`;
    textDelivered += `\n\n• *Total Harga* : ${formatRupiah(order?.price, "Rp. ")}\n• *Status Pesanan* : ${order?.status}\n• *Status Pembayaran* : ${order?.payment_status}\n\nTerimakasih telah mempercayakan kebutuhan laundry anda kepada kami.\nUntuk informasi lebih lanjut anda bisa mengunjungi website kami : https://cintalaundry.atras.my.id\n\n-Salam hangat, Cinta Laundry-`;

    // await navigator.clipboard.writeText(text);

    switch (status) {
      case "Sedang dikerjakan":
        window.location.href = `https://api.whatsapp.com/send/?phone=${order.customer.phone_number}&text=${encodeURIComponent(textWithOrderLink)}`;
        break;
      case "Menunggu diambil":
        window.location.href = `https://api.whatsapp.com/send/?phone=${order.customer.phone_number}&text=${encodeURIComponent(textRequestForPickup)}`;
        break;
      case "Sudah diantar":
        window.location.href = `https://api.whatsapp.com/send/?phone=${order.customer.phone_number}&text=${encodeURIComponent(textDelivered)}`;
        break;
      case "Selesai":
        window.location.href = `https://api.whatsapp.com/send/?phone=${order.customer.phone_number}&text=${encodeURIComponent(textOrderDone)}`;
        break;
      default:
        break;
    }
  }

  function download(e) {
    window.location.href = `${baseUrl("/download/qris-cinta-laundry")}`;
  }

  function handleChangeNotes() {
    const newNote = changeNotes.current.value;

    axios
      .put(
        apiBaseUrl(`/orders/notes/${orderId}`),
        {
          notes: newNote,
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
        closeModalChangeNotesButton.current.click();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  return (
    <MasterLayout>
      <div className="title fw-bold fs-2 text-center mb-3">Detail Order</div>
      <div className="container">
        {/* If order is still fecthing, display loading */}
        {isFetchingDetailOrder ? (
          <LoadingSpinner />
        ) : (
          <>
            <div data-aos="flip-right" className="card text-center mb-3">
              <div className="card-body text-start m-0 p-0">
                <h5 className="card-header fw-bold text-center rounded-top p-2 border-2 border-black border-bottom bg-secondary text-white">{order?.customer.name}</h5>
                <div className="p-3">
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td className="fw-bold">Nomor antrian</td>
                        <td className="px-2">:</td>
                        <td>{order?.id}</td>
                      </tr>
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
                        <td>{formatRupiah(order?.price, "Rp ")}</td>
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
                          <span className={`mb-1 ${order?.status === "Sedang dikerjakan" ? "bg-primary" : order?.status === "Selesai" ? "bg-success" : order?.status === "Menunggu diambil" ? "bg-danger" : order?.status === "Sudah diantar" ? "bg-success" : null} p-3 rounded py-0 text-white text-center fw-bold d-flex justify-content-center align-items-center`}>{order?.status}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Status Pembayaran</td>
                        <td className="px-2">:</td>
                        <td>
                          <span className={`mb-1 ${order?.payment_status === "Lunas" ? "bg-success" : order?.payment_status === "Belum bayar" ? "bg-danger" : null} text-white p-3 rounded py-0  fw-bold d-flex justify-content-center align-items-center`}>{order?.payment_status}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer text-muted">
                <div>Tanggal Masuk : {order && formatRelative(new Date(order?.created_at), new Date(), { locale: id })}</div>
                <div>Tanggal Selesai : {new Date().toJSON().slice(0, 10)}</div>
              </div>
            </div>

            <div>
              <div className="text-center fs-5 fw-bold mt-3 mb-2">Metode Pembayaran</div>
              <table data-aos="flip-left" className="table table-striped rounded overflow-hidden">
                <thead className="purple-200 text-white">
                  <tr className="text-center">
                    <th className="p-2">Metode</th>
                    <th className="p-2">Tata Cara</th>
                  </tr>
                </thead>
                <tbody className="table-light">
                  <tr className="fw-semibold">
                    <td className="text-center">Cash</td>
                    <td>-</td>
                  </tr>
                  <tr className="fw-semibold">
                    <td className="text-center">Transfer</td>
                    <td>
                      <div>Bank BCA</div>
                      <div>Nomor Rekening : 7435327362</div>
                      <div>
                        Atas nama : <i>HARI YANI SARI</i>
                      </div>
                    </td>
                  </tr>
                  <tr className="fw-semibold">
                    <td className="text-center">QRIS</td>
                    <td>
                      <div>Nama : Cinta Laundry</div>
                      <div>NMID : ID102106814865401</div>
                      <div>QR Code:</div>
                      <div>
                        <img className="img-fluid border border-secondary border-4 rounded mb-2" style={{ height: "200px", objectFit: "contain" }} src="/assets/pembayaran/qris-barcode-crop.jpg" alt="QRIS Cinta Laundry" />
                      </div>
                      <button onClick={download} className="mb-2 btn button-accent-purple">
                        Download QR Code
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {new Cookies().get("token") ? (
              <div>
                <div className="d-flex gap-2 mb-3 fw-bold">
                  <select ref={orderStatus} onChange={handleStatusChange} className="form-select btn button-accent-purple" aria-label="Default select example">
                    <option>Ubah Status</option>
                    <option value="Sedang dikerjakan">Sedang dikerjakan</option>
                    <option value="Menunggu diambil">Menunggu diambil</option>
                    <option value="Sudah diantar">Sudah diantar</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                  <select ref={statusPayment} onChange={handlePaymentStatusChange} className="form-select btn button-accent-purple" aria-label="Default select example">
                    <option>Ubah Status Bayar</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Belum bayar">Belum bayar</option>
                  </select>
                </div>

                <div className="d-flex flex-column gap-3">
                  <button className="btn btn button-accent-purple rounded-pill w-100" data-bs-toggle="modal" data-bs-target="#change-notes-modal">
                    <i className="bi bi-pencil"></i> Ubah catatan
                  </button>

                  <button onClick={() => handleWhatsappChat(order?.status)} className="btn btn-success rounded-pill w-100 ">
                    <i className="bi bi-whatsapp me-2"></i>Chat Melalui Whatsapp
                  </button>

                  <a className="btn btn-primary rounded-pill" href={`intent:#Intent;scheme=startci://open?url_param=${order?.id};package=com.dantsu.thermalprinter;S.browser_fallback_url=${encodeURIComponent("https://cintalaundry.atras.my.id/#/not_found")};end`}>
                    <i className="bi bi-printer"></i> Cetak Struk
                  </a>
                  {/* <a className="btn btn-primary rounded-pill" href={`laundryprojectprinter://printer?uuid=${order?.id}`}>
                    <i className="bi bi-printer"></i> Cetak Struk (Flutter)
                  </a> */}

                  <button className="btn btn-danger rounded-pill w-100 mb-4" data-bs-toggle="modal" data-bs-target="#delete-modal">
                    <i className="bi bi-trash"></i> Hapus Pesanan
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="modal fade" id="change-notes-modal" tabIndex="-1" aria-labelledby="change-notes-modal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-center" id="exampleModalLabel">
                Ubah Catatan
              </h1>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="input-change-notes" className="form-label">
                  Ubah catatan
                </label>
                <input type="text" className="form-control" id="input-change-notes" ref={changeNotes} defaultValue={order?.notes} />
              </div>
            </div>
            <div className="modal-footer">
              <button ref={closeModalChangeNotesButton} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Kembali
              </button>
              <button type="button" className="btn btn-primary" onClick={handleChangeNotes}>
                Ubah
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="delete-modal" tabIndex="-1" aria-labelledby="delete-modal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-center" id="exampleModalLabel">
                yakin ingin menghapus pesanan <b>{order?.customer?.name}</b> dengan nomor transaksi <b>{order?.id}</b>?
              </h1>
            </div>
            <div className="modal-footer">
              <button ref={closeModalButton} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Kembali
              </button>
              <button type="button" className="btn btn-danger" onClick={deleteOrder}>
                Ya, Yakin!
              </button>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
