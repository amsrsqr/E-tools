import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Page from "./Page";
import "../css/BasicDailyFeesWarning.css";

const BasicDailyFeesWarning = ({
  title,
  msg,
  fieldAlertWarning,
  setFieldAlertWarning,
}) => {
  const handleClose = () => {
    setFieldAlertWarning(!fieldAlertWarning);
  };

  return (
    <>
      <Page title="">
        <Modal
          isOpen={fieldAlertWarning}
          centered
          toggle={handleClose}
          className="p-1"
        >
          <ModalHeader
            style={{ "border-bottom": "0 none" }}
            toggle={handleClose}
          ></ModalHeader>

          <ModalBody className="text-center" style={{ marginBottom: "-6px" }}>
            <p>
              <i
                className="fa fa-exclamation-triangle fa-5x fa-cog"
                aria-hidden="true"
              ></i>
            </p>
            <div>
              <p className="fw-bold">{title}</p>
              <p>{msg}</p>
            </div>
          </ModalBody>
          <div
            className="w-100 d-flex justify-content-center "
            style={{ height: "50px" }}
          >
            <div
              onClick={handleClose}
              className="fw-bold footerBtn"
              style={{
                // fontSize: "16px",
                // backgroundColor: "#F5F5F5",
                // color: "black",
                // borderColor: "white",
                // width: "110%",
                textAlign: "center",
                // margin:"5px 7px 5px 7px"
              }}
            >
              <div style={{ cursor: "pointer" }}>{"Ok"}</div>
            </div>
          </div>
        </Modal>
      </Page>
    </>
  );
};

export default BasicDailyFeesWarning;
