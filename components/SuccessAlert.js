import React, { useEffect } from "react";
import Swal from "sweetalert2";
import {
  ADD,
  DELETE,
  DELETESUCCESS,
  EDIT,
  SAVESUCCESS,
  UPDATESUCCESS,
  ARCHIVE,
  UPDATE,
  FINALISED,
  SAVECHANGESFINALISED,
} from "../constant/FieldConstant";

const SuccessAlert = (paramObj) => {
  useEffect(() => {
    var title = "";
    switch (paramObj.type) {
      case ADD:
        title = SAVESUCCESS;
        break;
      case UPDATE:
        title = UPDATESUCCESS;
        break;
      case EDIT:
        title = UPDATESUCCESS;
        break;
      case DELETE:
        title = DELETESUCCESS;
        break;
      case ARCHIVE:
        title = "Archive";
        break;
      case FINALISED:
        title = "End of Period - Finalise Successful";
        break;
      case SAVECHANGESFINALISED:
        title = "End of Period - Save Changes Successful";
        break;
      default:
        break;
    }
    Swal.fire({
      title: title,
      text: paramObj.msg,
      iconHtml:
        '<div><i class="fa fa-check-circle fa-success" aria-hidden="true"></i></div>',
      confirmButtonText: "Close",
      confirmButtonColor: "#F5f5f5",
      buttonsStyling: true,
      focusConfirm: false,
    }).then((value) => {
      paramObj.callback(value);
    });
  }, []);
  return <div></div>;
};

export default SuccessAlert;
