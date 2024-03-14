import React, { Fragment, useContext, useEffect } from "react";
import { AxiosContext } from "../service/axios/AxiosProvider";
import { apiBaseUrl } from "../provider/ApiService";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export default function AuthenticatedLayout({ children }) {
  const axiosInstance = useContext(AxiosContext);
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user dont have any token, then redirect the user to homepage.
    const token = cookies.get("token");
    if (!token) return navigate("/");

    // If the user have token, check if the token is valid.
    // If the token is not valid, then the user will be redirected to homepage automatically based on axios response interceptor.
    axiosInstance.get(apiBaseUrl("/auth/users"));
  }, []);

  return <Fragment>{children}</Fragment>;
}
