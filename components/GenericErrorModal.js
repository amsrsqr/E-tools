import { React } from "react";
import { Modal, ModalBody, Button, ModalHeader, ModalFooter } from "reactstrap";
import { CLOSE, OK } from "../constant/MessageConstant";

const GenericErrorModal = ({
  showErrorPopup,
  header,
  errorMessage,
  data,
  handleErrorClose,
}) => {
  const toggleShow = () => {
    handleErrorClose(data);
  };

  return (
    <Modal isOpen={showErrorPopup} centered toggle={toggleShow}>
      <ModalHeader
        style={{ "border-bottom": "0 none" }}
        toggle={toggleShow}
      ></ModalHeader>
      <ModalBody>
        {/* <div className=" d-flex align-items-center justify-content-center"> */}
        <div className="text-center">
          <p>
            {/* nbgvf */}
            <i
              class="fa fa-exclamation-triangle fa-color"
              aria-hidden="true"
              style={{ marginTop: "7px", fontSize: "5em" }}
            ></i>
          </p>
          <div
            className="fw-bold"
            style={{ fontSize: "18px", marginLeft: "10px", marginTop: "31px" }}
          >
            {header}
          </div>
        </div>
        <p className="mt-3 text-center" style={{ fontSize: "14px" }}>
          {errorMessage}
        </p>
      </ModalBody>

      <Button
        onClick={toggleShow}
        className="fw-bold"
        style={{
          fontSize: "17px",
          backgroundColor: "#F5F5F5",
          color: "black",
          borderColor: "white",
        }}
      >
        OK
      </Button>
    </Modal>
  );
};

export default GenericErrorModal;
