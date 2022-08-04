import React from "react";
import Page from "./Page";

import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import { CLOSE, OK } from "../constant/MessageConstant";
const WarningMessageModelAlert = ({
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

        <ModalBody className="text-center">
          <p>
            {warningType === "info" ? (
              <i
                class="fa fa-info-circle fa-lg ml-2 fa-5x"
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
            <p className="head mt-3" style={{ fontSize: "16px" }}>
              {header}
            </p>
          ) : null}
          <div className="fw-bold" style={{ fontSize: "16px" }}></div>
          <hr />

          <Scrollbars style={{ height: 150 }}>
            <p
              style={{ height: "100px", textAlign: "left" }}
              className="fs-7 p-3"
            >
              {msg}
            </p>
          </Scrollbars>
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

export default WarningMessageModelAlert;
