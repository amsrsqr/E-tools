import React from "react";

import "../css/style.css";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";

const WarningAlert = ({
  isOpen,
  messageBody,
  header,
  continueClicked,
  cancelClicked,
}) => {
  const handleContinue = () => {
    // console.log("continue clicked");
    if (continueClicked) continueClicked();
  };
  const handleCancel = () => {
    // console.log("cancel clicked");
    if (cancelClicked) cancelClicked();
  };

  return (
    <Modal isOpen={isOpen} centered toggle={handleCancel} className="modal-md">
      <ModalHeader
        style={{ "border-bottom": "0 none" }}
        toggle={handleCancel}
      ></ModalHeader>
      <ModalBody className="text-center">
        <p>
          <i
            className="fa fa-exclamation-triangle fa-5x fa-cog"
            aria-hidden="true"
          ></i>
        </p>
        <div className="fw-bold" style={{ fontSize: "16px" }}>
          {header ? header : "Warning - Date within Finalised Period"}
        </div>
        <p className="fs-6 mt-3 " style={{ padding: "0px 12px" }}>
          {messageBody ? (
            messageBody
          ) : (
            <span className="text-center">
              The date selected is during a Period which has already been
              finalised in the End of Period proccess. This may impact the
              DAP/DAC Fees of the Resident for <br /> that Period.
              <br />
              This transaction will be added in the Resident’s profile, but will
              not update the End of Period calculations for that Period which
              the RAD/RAC Payment <br /> will be added in.
              <br />
              Are you sure you want to continue?
            </span>
          )}
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="w-100 d-flex justify-content-center">
          <Button
            type="submit"
            className="fw-bold btn  addbtn  btn-primary"
            style={{ fontSize: "16px" }}
            onClick={handleContinue}
          >
            {"Yes, continue"}
          </Button>
          <Button
            type="reset"
            className="fw-bold btn btn-secondary"
            style={{
              fontSize: "14px",
              backgroundColor: "#F5F5F5",
              color: "black",
              marginLeft: "7px",
              borderColor: "#80808059",
            }}
            size="md"
            onClick={handleCancel}
          >
            {"No, cancel"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default WarningAlert;
