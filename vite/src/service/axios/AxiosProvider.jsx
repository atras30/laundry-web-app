import axios from "axios";
import { Fragment, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { apiBaseUrl } from "../../provider/ApiService";

export const AxiosContext = createContext();

export default function AxiosProvider({ children }) {
  //Misc
  const navigate = useNavigate();

  // cookies
  const cookies = new Cookies();

  // axios
  const axiosInstance = axios.create();
  axiosInstance.defaults.withCredentials = true;

  //Request Interceptor
  axiosInstance.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      config.headers.Authorization = cookies.get("token");

      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  //Response Interceptor
  axiosInstance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error === null) {
        toast.error("Something went wrong...");
        return Promise.reject(error);
      }

      const status = error?.response?.status || "";

      if (status === 401) {
        handleUnauthorizedResponse(error, axiosInstance);
      } else if (String(error?.response?.status).startsWith("4")) {
        console.log("Error : ", error);
        toast.error(error?.response?.data?.message ?? error?.message ?? "Client Error.");
      } else if (String(error?.response?.status).startsWith("5")) {
        console.log("Error : ", error);
        toast.error(error?.response?.data?.message ?? error?.message ?? "Server Error.");
      } else {
        toast.error("Something went wrong...");
      }

      return Promise.reject(error);
    }
  );

  async function handleUnauthorizedResponse(error) {
    // Display Message
    let errorMessage = "";
    if (error.response.data.message) errorMessage = `[Error :  ${error.response.data.message}]`;
    toast.error(`You're not authorized for this action. ${errorMessage}`);

    //Check cookies
    const token = cookies.get("token");
    if (token) await handleLogout();

    return navigate("/");
  }

  async function handleLogout() {
    // Hit Logout endpoint
    await axios
      .post(
        apiBaseUrl("/auth/logout"),
        {},
        {
          headers: {
            Authorization: cookies.get("token"),
          },
        }
      )
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/");
      })
      .finally(() => {
        cookies.remove("token");
      });
  }

  return <AxiosContext.Provider value={axiosInstance}>{children}</AxiosContext.Provider>;
}
