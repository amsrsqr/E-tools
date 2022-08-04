import React, { useEffect } from "react";
import Swal from "sweetalert2";

const SweetAlert = (paramObj) => {
  useEffect(() => {
    var title = "";
    switch (paramObj.type) {
      case "Add":
        title = "Save Successful";
        break;
      case "Edit":
        title = "Update Successful";
        break;
      case "Delete":
        title = "Delete Successful";

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

export default SweetAlert;

//useeffect is executed when the component is loaded for the first time and when updated.
