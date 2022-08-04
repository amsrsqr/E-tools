import React, { useEffect, useState } from "react";
import Page from "./Page";

import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { CLOSE, OK } from "../constant/MessageConstant";

const EOPWarningMesaageModalAlert = ({
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
      <Modal isOpen={showWarningAlert} centered toggle={handleClose}>
        <ModalHeader
          style={{ "border-bottom": "0 none" }}
          toggle={handleClose}
        ></ModalHeader>

        <ModalBody className="text-center" style={{maxHeight:"45rem",overflowY:"scroll"}} >
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
          <p className="mt-3 fs-7" style={{textAlign:"left", marginBottom: "0"}} >
            {msg}
          </p>
        </ModalBody>

        <ModalFooter className="p-0 border-0">
          <div className="w-100 d-flex justify-content-center">
            <Button
              onClick={handleClose}
              className="fw-bold"
              style={{
                fontSize: "16px",
                backgroundColor: "#F5F5F5",
                color: "black",
                borderColor: "white",
                width: "100%",
                padding:"10px"
              }}
            >
              {warningType === "info" ? CLOSE : OK}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </Page>
  );
};

export default EOPWarningMesaageModalAlert;
