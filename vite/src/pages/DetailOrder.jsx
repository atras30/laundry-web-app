import { format } from "date-fns";
import { id } from "date-fns/locale";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiBaseUrl, baseUrl } from "../provider/ApiService";
import MasterLayout from "../layouts/MasterLayout";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import DetailSubOrder from "../components/DetailSubOrder";
import { formatRupiah } from "../helper/helper";
import DetailOrderSkeleton from "../components/skeleton/DetailOrderSkeleton";
import ChangeCreatedAtForm from "../components/ChangeCreatedAtForm";
import ChangeDoneAtForm from "../components/ChangeDoneAtForm";
import Compressor from "compressorjs";
import LoadingLayout from "../layouts/LoadingLayout";
import { AxiosContext } from "../service/axios/AxiosProvider";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

export default function DetailOrder() {
  //Main State
  const [order, setOrder] = useState(null);
  const [searchParams] = useSearchParams();
  const [isFetchingDetailOrder, setIsFetchingDetailOrder] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [finishDate, setFinishDate] = useState(new Date());
  const [photos, setPhotos] = useState([]);
  const orderId = searchParams.get("id");
  const orderStatus = useRef(null);
  const statusPayment = useRef(null);
  const changeNotes = useRef(null);
  const closeModalButton = useRef(null);
  const closeModalChangeNotesButton = useRef(null);
  const inputChangeDate = useRef(null);
  const inputPhoto = useRef(null);
  const [changeDate, setChangeDate] = useState(null);
  const [photoIdToBeDeleted, setPhotoIdToBeDeleted] = useState(null);

  //Input State
  const [uploadPhotoDescription, setUploadPhotoDescription] = useState("");

  // Loading States
  const [updateOrderLoading, setUpdateOrderLoading] = useState(false);
  const [isInputImageLoading, setIsInputImageLoading] = useState(false);
  const [deletePhotoLoading, setDeletePhotoLoading] = useState(false);

  //Misc
  const navigate = useNavigate();
  const axiosInstance = useContext(AxiosContext);

  //Use Effects
  useEffect(() => {
    fetchOrder();
  }, []);

  function fetchOrder() {
    const orderPromise = axiosInstance.get(apiBaseUrl(`/orders/${orderId}`));

    fetchPhotos();

    orderPromise
      .then((response) => {
        const order = response.data.order;

        // Save last history card for scrolling back to the latest user's scroll
        localStorage.setItem("lastOrderDetailId", order.id);

        setOrder(order);
        setStartDate(new Date(order.created_at));

        if (!order.done_at) {
          setFinishDate(null);
        } else {
          setFinishDate(new Date(order.done_at));
        }
      })
      .finally(() => {
        setIsFetchingDetailOrder(false);
      });
  }

  function fetchPhotos() {
    axiosInstance.get(apiBaseUrl(`/orders/photos/${orderId}`)).then((response) => {
      setPhotos(response?.data ?? []);
    });
  }

  function handleStatusChange() {
    setUpdateOrderLoading(true);

    const status = orderStatus.current.value;
    if (status === "Ubah Status") return;

    axiosInstance
      .put(apiBaseUrl(`/orders/status/${orderId}`), {
        status: orderStatus.current.value,
      })
      .then((response) => {
        toast.success(response.data.message);
        fetchOrder();
      })
      .finally(() => {
        setUpdateOrderLoading(false);
      });
  }

  function handlePaymentStatusChange() {
    setUpdateOrderLoading(true);

    const status = statusPayment.current.value;
    if (!status) return;
    axiosInstance
      .put(apiBaseUrl(`/orders/payment_status/${orderId}`), {
        payment_status: statusPayment.current.value,
      })
      .then((response) => {
        toast.success(response.data.message);
        fetchOrder();
      })
      .finally(() => {
        setUpdateOrderLoading(false);
      });
  }

  function deleteOrder() {
    axiosInstance.delete(apiBaseUrl(`/orders/${orderId}`)).then((response) => {
      toast.success(response.data.message);
      closeModalButton.current.click();
      navigate("/admin");
    });
  }

  async function handleWhatsappChat(status) {
    let textWithOrderLink = `Halo pelanggan cinta laundry!\n\nLaundry anda telah kami terima dengan nomor antrian : *${orderId}*.\n\nUntuk memantau proses dan rincian laundry anda, bisa dilihat di link berikut ya : https://cintalaundry.atras.my.id/#/orders?id=${orderId}\n\n-Salam hangat, Cinta Laundry-`;
    let textOrderDone = `Halo pelanggan cinta laundry!\n\nLaundry kamu sudah selesai \n\nberikut rincian keterangan pesanannya :\n\n• *Nomor Antrian* : ${order.id}\n\n=====`;
    let textDelivered = `Halo pelanggan cinta laundry!\n\nLaundry kamu sudah selesai dan sudah diantar \n\nberikut rincian keterangan pesanannya :\n\n• *Nomor Antrian* : ${order.id}\n\n=====`;
    let textRequestForPickup = `Halo pelanggan cinta laundry!\n\nLaundry kamu sudah selesai dan sudah bisa diambil di *Kota Sutera Cluster BlossomVille Blok B7/20* atau *Taman Nuri Blok NC1/32* (Cinta Laundry)\n\nberikut rincian keterangan pesanannya :\n\n• *Nomor Antrian* : ${order.id}\n\n=====`;

    order.sub_orders.forEach((subOrder, index) => {
      textRequestForPickup += `\n• *Layanan* : ${subOrder?.type}\n• *Jumlah* : ${subOrder.amount}\n• *Harga* : ${formatRupiah(subOrder.price_per_kg, "Rp. ")} ${
        parseInt(subOrder.is_price_per_unit) === 1 ? " / Unit" : subOrder?.price_per_multiplied_kg ? ` / ${subOrder?.price_per_multiplied_kg} KG` : " / KG"
      } \n• *Sub Total* : ${formatRupiah(subOrder?.total, "Rp. ")}\n=====`;
      textOrderDone += `\n• *Layanan* : ${subOrder?.type}\n• *Jumlah* : ${subOrder.amount}\n• *Harga* : ${formatRupiah(subOrder.price_per_kg, "Rp. ")} ${
        parseInt(subOrder.is_price_per_unit) === 1 ? " / Unit" : subOrder?.price_per_multiplied_kg ? ` / ${subOrder?.price_per_multiplied_kg} KG` : " / KG"
      } \n• *Sub Total* : ${formatRupiah(subOrder?.total, "Rp. ")}\n=====`;
    });
    textRequestForPickup += `\n\n• *Total Harga* : ${formatRupiah(order?.price, "Rp. ")}\n• *Status Pesanan* : Sudah Selesai dan ${order?.status}\n• *Status Pembayaran* : ${
      order?.payment_status
    }\n\nTerimakasih telah mempercayakan kebutuhan laundry anda kepada kami.\nUntuk informasi lebih lanjut anda bisa mengunjungi website kami : https://cintalaundry.atras.my.id\n\n-Salam hangat, Cinta Laundry-`;
    textOrderDone += `\n\n• *Total Harga* : ${formatRupiah(order?.price, "Rp. ")}\n• *Status Pesanan* : ${order?.status}\n• *Status Pembayaran* : ${
      order?.payment_status
    }\n\nTerimakasih telah mempercayakan kebutuhan laundry anda kepada kami.\nUntuk informasi lebih lanjut anda bisa mengunjungi website kami : https://cintalaundry.atras.my.id\n\n-Salam hangat, Cinta Laundry-`;
    textDelivered += `\n\n• *Total Harga* : ${formatRupiah(order?.price, "Rp. ")}\n• *Status Pesanan* : ${order?.status}\n• *Status Pembayaran* : ${
      order?.payment_status
    }\n\nTerimakasih telah mempercayakan kebutuhan laundry anda kepada kami.\nUntuk informasi lebih lanjut anda bisa mengunjungi website kami : https://cintalaundry.atras.my.id\n\n-Salam hangat, Cinta Laundry-`;

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
    setUpdateOrderLoading(true);

    const newNote = changeNotes.current.value;

    axiosInstance
      .put(apiBaseUrl(`/orders/notes/${orderId}`), {
        notes: newNote,
      })
      .then((response) => {
        toast.success(response.data.message);
        fetchOrder();
        closeModalChangeNotesButton.current.click();
      })
      .finally(() => {
        setUpdateOrderLoading(false);
      });
  }

  function hideModal() {
    const button = document.getElementById("change-date-modal-back-button");
    button.click();
  }

  function _renderOrderPhotos() {
    //Belum ada foto
    if (photos?.length === 0)
      return (
        <div>
          <div>
            <small className="text-center d-block text-muted text-small">Belum ada Foto</small>
          </div>
        </div>
      );

    //Sudah ada foto
    return (
      <div>
        {photos?.map((photo, index) => {
          console.log(photo);
          return (
            <div className="w-100 position-relative mb-3" key={index}>
              <img style={{ objectFit: "contain", objectPosition: "center" }} height={300} className="w-100 img-thumbnail shadow-sm" src={photo?.upload_path ?? ""} alt="Error" />

              {new Cookies().get("token") && (
                <button
                  onClick={() => setPhotoIdToBeDeleted(photo?.id)}
                  data-bs-toggle="modal"
                  data-bs-target="#delete-photo-modal"
                  className="btn btn-danger rounded-0 position-absolute top-0 end-0 text-white text-center rounded-bottom p-2">
                  <small className="fw-bold">Hapus Foto</small>
                </button>
              )}

              <div className="position-absolute bottom-0 start-0 end-0 text-white text-center rounded-bottom p-2" style={{ background: "rgba(0,0,0,.6)" }}>
                <span className="fw-bold">{photo?.description && `${photo.description} - `}</span>
                <span className="fw-bold">{photo?.created_at ?? ""}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function handleDeletePhoto() {
    setDeletePhotoLoading(true);

    axiosInstance
      .delete(apiBaseUrl(`/orders/photos/${photoIdToBeDeleted}`))
      .then((response) => {
        toast.success(response.data.message);
        // Close Modal
        document.querySelector("#button-close-upload-photo-modal").click();
        fetchPhotos();
      })
      .finally(() => {
        setDeletePhotoLoading(false);
      });
  }

  function handleAddPhoto() {
    setIsInputImageLoading(true);

    new Compressor(inputPhoto.current.files[0], {
      quality: 0.3,
      success(result) {
        axiosInstance
          .post(
            apiBaseUrl("/orders/photos"),
            {
              photo: result,
              customerId: order.customer_id,
              orderId: order.id,
              description: uploadPhotoDescription,
            },
            {
              headers: {
                Accept: "Application/json",
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            toast.success(response.data.message);
            fetchPhotos();
            // Close Modal
            document.querySelector(".btn-input-photo-close").click();
          })
          .finally(() => {
            setIsInputImageLoading(false);
          });
      },
      error(err) {
        toast.error(err.message || "Image compressing failed.");
        setIsInputImageLoading(false);
      },
    });
  }

  return (
    <MasterLayout>
      <div className="order-page">
        <div className="title fw-bold fs-2 text-center mb-3">Detail Order</div>

        <div className="container">
          <LoadingLayout isLoading={updateOrderLoading}>
            {/* If order is still fecthing, display loading */}
            {isFetchingDetailOrder ? (
              <DetailOrderSkeleton />
            ) : (
              <>
                <div /*data-aos="flip-right"*/ className="card text-center mb-3">
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
                              <span
                                className={`mb-1 ${
                                  order?.status === "Sedang dikerjakan"
                                    ? "bg-primary"
                                    : order?.status === "Selesai"
                                    ? "bg-success"
                                    : order?.status === "Menunggu diambil"
                                    ? "bg-danger"
                                    : order?.status === "Sudah diantar"
                                    ? "bg-success"
                                    : null
                                } p-3 rounded py-0 text-white text-center fw-bold d-flex justify-content-center align-items-center`}>
                                {order?.status}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Status Pembayaran</td>
                            <td className="px-2">:</td>
                            <td>
                              <span
                                className={`mb-1 ${
                                  order?.payment_status === "Lunas" ? "bg-success" : order?.payment_status === "Belum bayar" ? "bg-danger" : null
                                } text-white p-3 rounded py-0  fw-bold d-flex justify-content-center align-items-center`}>
                                {order?.payment_status}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer text-muted">
                    <div>Tanggal Masuk : {order && format(new Date(order?.created_at), "dd MMMM yyyy", { locale: id })}</div>
                    <div>Tanggal Selesai : {!order.done_at ? "-" : format(new Date(order?.done_at), "dd MMMM yyyy", { locale: id })}</div>
                  </div>
                </div>

                <div className="overflow-hidden rounded">
                  <div className="position-relative text-center fs-5 fw-bold purple-200 text-white" style={{ height: "2.5rem" }}>
                    {new Cookies().get("token") && (
                      <button
                        className="btn text-white fw-bold shadow-none border-0 position-absolute end-0 h-100 bg-primary d-flex justify-content-center align-items-center px-3"
                        style={{ fontSize: ".8rem", cursor: "pointer" }}
                        data-bs-toggle="modal"
                        data-bs-target="#add-photo-modal">
                        <i className="bi bi-cloud-plus me-2 fs-5"></i>Tambah
                      </button>
                    )}

                    <div className="h-100 d-flex justify-content-center align-items-center">Foto</div>
                  </div>
                  <div className="p-2 px-3" style={{ background: "#F7F7F7" }}>
                    {_renderOrderPhotos()}
                  </div>
                </div>

                <div>
                  <div className="text-center fs-5 fw-bold mt-3 mb-2">Metode Pembayaran</div>
                  <table /*data-aos="flip-left"*/ className="table table-striped rounded overflow-hidden">
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

                      <button className="btn btn button-accent-purple rounded-pill w-100" data-bs-toggle="modal" data-bs-target="#change-date-modal">
                        <i className="bi bi-check-circle"></i> Ubah Tanggal
                      </button>

                      <button onClick={() => handleWhatsappChat(order?.status)} className="btn btn-success rounded-pill w-100 ">
                        <i className="bi bi-whatsapp me-2"></i>Chat Melalui Whatsapp
                      </button>

                      <a
                        className="btn btn-primary rounded-pill"
                        href={`intent:#Intent;scheme=startci://open?url_param=${order?.id};package=com.dantsu.thermalprinter;S.browser_fallback_url=${encodeURIComponent("https://cintalaundry.atras.my.id/#/not_found")};end`}>
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
          </LoadingLayout>
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

        <div className="modal fade" id="change-date-modal" tabIndex="-1" aria-labelledby="change-notes-modal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content h-100">
              <div className="modal-header">
                <h1 className="w-100 modal-title fs-5 text-center fw-bold" id="exampleModalLabel">
                  Ubah Tanggal
                </h1>
              </div>

              <div className="modal-body">
                <select ref={inputChangeDate} className="form-select" onChange={() => setChangeDate(inputChangeDate.current.value)}>
                  <option defaultChecked>Pilih Tanggal</option>
                  <option value="created_at">Tanggal Masuk</option>
                  <option value="done_at">Tanggal Selesai</option>
                </select>

                {changeDate === "created_at" ? (
                  <ChangeCreatedAtForm setUpdateOrderLoading={setUpdateOrderLoading} hideModal={hideModal} fetchOrder={fetchOrder} orderId={order?.id} startDate={startDate} setStartDate={setStartDate} />
                ) : changeDate === "done_at" ? (
                  <ChangeDoneAtForm setUpdateOrderLoading={setUpdateOrderLoading} hideModal={hideModal} fetchOrder={fetchOrder} orderId={order?.id} finishDate={finishDate} setFinishDate={setFinishDate} />
                ) : null}
              </div>
              <div className="modal-footer">
                <button id="change-date-modal-back-button" type="button" className="btn button-accent-purple w-100" data-bs-dismiss="modal">
                  Kembali
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

        <div className="modal fade" id="delete-photo-modal" tabIndex="-1" aria-labelledby="delete-photo-modal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <LoadingLayout isLoading={deletePhotoLoading}>
                <div className="modal-header">
                  <h1 className="modal-title fs-5 text-center" id="exampleModalLabel">
                    yakin ingin menghapus foto dengan id {photoIdToBeDeleted} ?
                  </h1>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" id="button-close-upload-photo-modal" data-bs-dismiss="modal">
                    Kembali
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleDeletePhoto}>
                    Ya, Yakin!
                  </button>
                </div>
              </LoadingLayout>
            </div>
          </div>
        </div>

        <div className="modal fade" id="add-photo-modal" tabIndex="-1" aria-labelledby="add-photo-modal" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <LoadingLayout isLoading={isInputImageLoading}>
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="add-photo-label">
                    Tambah Foto
                  </h1>
                  <button type="button" className="btn-close btn-input-photo-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label htmlFor="formFile" className="form-label">
                        Pilih Foto
                      </label>
                      <input ref={inputPhoto} className="form-control" type="file" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="input-description" className="form-label">
                        Deskripsi
                      </label>
                      <input placeholder="Tidak ada orang dirumah, saya taruh depan pintu..." className="form-control" type="text" onChange={(e) => setUploadPhotoDescription(e.target.value)} />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                    Close
                  </button>
                  <button onClick={handleAddPhoto} type="button" className="btn button-accent-purple rounded purple-200 text-white">
                    Tambah
                  </button>
                </div>
              </LoadingLayout>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
