import React from "react";
import Page from "./Page";

import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CLOSE, OK } from "../constant/MessageConstant";
const ErrorMessageModelAlert = ({
  warningType,
  msg,
  showWarningAlert,
  setShowWarningAlert,
  header,
}) => {
  const handleClose = () => {
    setShowWarningAlert(!showWarningAlert);
  };

  return (
    <Page title="">
      <Modal
        isOpen={showWarningAlert}
        centered
        toggle={handleClose}
        style={{ width: "600px", height: "300px", borderRadius: "5px" }}
      >
        <ModalHeader
          style={{ "border-bottom": "0 none" }}
          toggle={handleClose}
        ></ModalHeader>

        <ModalBody className="text-center" style={{ maxHeight: "35rem" }}>
          <p>
            {warningType === "error" ? (
              <i
                class="fa fa-exclamation-triangle  fa-lg ml-2 fa-5x"
                aria-hidden="true"
              ></i>
            ) : (
              <i
                className="fa fa-exclamation-circle fa-5x "
                aria-hidden="true"
              ></i>
            )}
          </p>
          {warningType === "info" ? (
            <p className="head mt-3 text-center" style={{ fontSize: "16px" }}>
              {header}
            </p>
          ) : null}
          <div className="fw-bold" style={{ fontSize: "16px" }}></div>

          {/* <Scrollbars style={{ height: 40 }}> */}
          <p
            style={{ height: "60px", textAlign: "left" }}
            className="fs-7 p-3 text-center"
          >
            <h2
              style={{
                fontSize: "16px",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Error - Wrong Document Type
            </h2>
            <p className="mt-2 mb-2">{msg}</p>
          </p>
          {/* </Scrollbars> */}
        </ModalBody>

        <div
          className="w-100 d-flex justify-content-center "
          // style={{ height: "50px" }}
        >
          <div
            onClick={handleClose}
            className="fw-bold"
            style={{
              fontSize: "16px",
              backgroundColor: "#F5F5F5",
              color: "black",
              borderColor: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            <p style={{ marginTop: "12px", cursor: "pointer" }}>
              {warningType === "info" ? CLOSE : OK}
            </p>
          </div>
        </div>
      </Modal>
    </Page>
  );
};

export default ErrorMessageModelAlert;
