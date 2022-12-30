import React, { useEffect, useRef } from "react";
import axios from "axios";
import { apiBaseUrl, baseUrl } from "../provider/ApiService";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../layouts/MasterLayout";

export default function Login() {
  const email = useRef(null);
  const password = useRef(null);
  const cookies = new Cookies();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const loginToast = toast.loading("Mencari data pelanggan...");
    // GET XSRF-TOKEN
    await axios.get(baseUrl("/sanctum/csrf-cookie"));

    // Hit login request via API
    axios
      .post(
        apiBaseUrl("/auth/login"),
        {
          email: email.current.value,
          password: password.current.value,
        },
        {
          headers: {
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        toast.update(loginToast, { render: response.data.message, type: "success", isLoading: false, autoClose: 3000, draggable: true, closeOnClick: true });
        new Cookies().set("token", `Bearer ${response.data.token}`);
        navigate("/");
      })
      .catch((error) => {
        toast.update(loginToast, { render: error.response.data.message, type: "error", isLoading: false, autoClose: 3000, draggable: true, closeOnClick: true });
      });
  };
  return (
    <MasterLayout>
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="card shadow p-4 my-4 bordered bord  er-1 border-black">
          <div className="title text-center fs-3 fw-bold mb-2">Login</div>
          <form className="mb-2" onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input ref={email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
              <div id="emailHelp" className="form-text">
                We&apos;ll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input ref={password} type="password" className="form-control" id="exampleInputPassword1" />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold">
              Login
            </button>
          </form>

          <div className="fw-bold fs-5 text-center mb-2">OR</div>

          <button className="btn btn-primary login-with-google bordered border-2 border-black p-2 fw-bold text-center">
            <i className="bi bi-google me-2"></i>
            Login With Google
          </button>
        </div>
      </div>
    </MasterLayout>
  );
}
