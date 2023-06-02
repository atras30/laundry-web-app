import React, { useEffect, useRef } from "react";
import axios from "axios";
import { apiBaseUrl, baseUrl } from "../provider/ApiService";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../layouts/MasterLayout";
import "../styles/login.css";
import jwt_decode from "jwt-decode";

export default function Login() {
  const email = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const google = window.google;
  
  useEffect(() => {
    // Login by Google init
    google?.accounts?.id?.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
      callback: handleCredentialResponse,
    });

    google?.accounts?.id?.renderButton(
      document.getElementById("sign-in-button"),
      { width: "500", shape: "pill", size: "medium" } // customization attributes
    );
  }, []);

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
        new Cookies().set("token", `Bearer ${response.data.token}`, {
          expires: new Date(Date.now() + 3600 * 24 * 365 * 1000),
        });
        navigate("/");
      })
      .catch((error) => {
        toast.update(loginToast, { render: error.response.data.message, type: "error", isLoading: false, autoClose: 3000, draggable: true, closeOnClick: true });
      });
  };

  function handleCredentialResponse(response) {
    const user = jwt_decode(response.credential);
    // console.log(response);

    // console.log(user);

    // axios
    //   .get(apiBaseUrl(`/users/find-by-email/${user.email}`))
    //   .then(async (response) => {
    //     if (response.data.message === "User was not found") {
    //       document.querySelector(".close-button-login-modal").click();

    //       const userInformation = {
    //         first_name: user.given_name,
    //         last_name: user.family_name,
    //         email: user.email,
    //       };

    //       cookies.set("user_information", userInformation);

    //       // redirect to user registration page with google information
    //       return navigate("/register/google");
    //     }

    //     //already registered
    //     await handleLoginByGoogle(user.email);
    //     setLoadingLogin(false);
    //   })
    //   .catch((response) => {
    //     console.log(response);
    //   });
  }

  const handleLoginWithGoogleRedirect = () => {
    window.location.href = baseUrl("/auth/login/google");
  };

  return (
    <MasterLayout>
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="card login-card border border-5 border-white p-4 shadow my-4 mt-5 position-relative" style={{ border: "none", outline: "none" }}>
          <div className="top-0 end-50 start-50 translate-middle border border-4 border-white position-absolute profile-circle rounded-circle d-flex justify-content-center align-items-center" style={{ width: "85px", height: "85px", backgroundColor: "#9C6EB6" }}>
            <i className="bi bi-person-fill text-white p-0 m-0" style={{ fontSize: "3rem", translate: "0 -0.06em" }}></i>
          </div>
          <div className="inner-circle-layer position-absolute start-0 end-0 bottom-0 top-0 overflow-hidden">
            <div className="inner-circle-background fw-bold text-white"></div>
          </div>
          <form onSubmit={submitHandler} className="login-form">
            <div className="mb-3 position-relative">
              <i className="bi bi-person-fill position-absolute form-icon bootstrap-icon fs-4"></i>
              <input tabIndex={100} placeholder="Email" ref={email} type="email" className="shadow-none form-control login-form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3 position-relative">
              <i className="bi bi-lock-fill position-absolute form-icon bootstrap-icon fs-4"></i>
              <input tabIndex={101} ref={password} type="password" className="form-control login-form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <button tabIndex={102} type="submit" className="fw-bold text-white border border-2 btn button-login-accent-purple w-100 fw-semibold">
              Login
            </button>
          </form>
          <div className="fw-bold fs-5 text-center">OR</div>
          {/* <button id="sign-in-button" onClick={handleLoginWithGoogleRedirect} className="shadow-none rounded-pill overflow-hidden" style={{ outline: "none", border: "none" }}>
            <i className="bi bi-google me-2"></i>
            Login With Google
          </button> */}
          <button tabIndex={103} type="submit" onClick={handleLoginWithGoogleRedirect} className="fw-bold text-white border border-2 btn button-login-accent-purple w-100 fw-semibold">
            <i className="bi bi-google me-2"></i> Login With Google
          </button>
        </div>
      </div>
    </MasterLayout>
  );
}
