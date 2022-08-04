import axios from "axios";
// import i18n from 'src/i18n';
import apiUrl from "./AppConfiguration";

import Swal from "sweetalert2";

//import authService from './services/auth.service';

// export function translateCell(cell) {
//   return i18n.t(cell);
// }
const tanentId = sessionStorage.getItem("tanentId");
const operatorId = sessionStorage.getItem("operatorId");
const AxiosSetup = () => {
  // This flag enables the Http Request to carry all Cookies present on browser for this app.
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = apiUrl; // process.env.REACT_APP_SECRET_API_URL;
  axios.interceptors.request.use((config) => {
    // const user = authService.getUserFromStorage();
    // if (user) {
    config.headers.tenantid = tanentId ? tanentId : 6;
    config.headers.operatorid = operatorId ? operatorId : 8;
    // }
    // console.log("request configuration", config);
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      //console.log(response);
      return response;
    },
    (error) => {
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      if (error.response) {
        switch (error.response.status) {
          case 500: // INTERNAL_SERVER_ERROR
            message = "Internal Server Error";
            break;
          case 401: // UNAUTHORIZED
            message = "Unauthorized";
            break;
          case 403: // FORBIDDEN
            message = "Forbidden";
            break;
          case 414: // REQUEST_TOO_LONG:
            message = "RequestToLong";
            break;
          case 400: // BAD_REQUEST:
            //console.log(error.response);

            Swal.fire({
              title: "Error",
              text:
                error.response.data.errors && error.response.data.errors.Name
                  ? error.response.data.errors.Name[0]
                  : error.response.data.errors.extraServiceOverrideReduction
                  ? error.response.data.errors.extraServiceOverrideReduction[0]
                  : error.response.data.errors.name
                  ? error.response.data.errors.name[0]
                  : error.response.data.errors.payee
                  ? error.response.data.errors.payee[0]
                  : error.response.data.errors.payer
                  ? error.response.data.errors.payer[0]
                  : error.response.data.errors.FirstName
                  ? error.response.data.errors.FirstName[0]
                  : error.response.data.errors.LastName
                  ? error.response.data.errors.LastName[0]
                  : error.response.data.errors.Record_id
                  ? error.response.data.errors.Record_id[0]
                  : error.response.data.errors.Message,

              iconHtml:
                '<div><i class="fa fa-exclamation-triangle " aria-hidden="true"></i></div>',
              confirmButtonText: "Close",
              confirmButtonColor: "#F5f5f5",
              buttonsStyling: true,
              focusConfirm: false,
            });

            break;
          case 409: // CONFLICT:
            message = "Conflict";
            break;
          default:
            break;
        }
      }
      error.message = message;
      return Promise.reject(error);
    }
  );
  return null;
};

export default AxiosSetup;
