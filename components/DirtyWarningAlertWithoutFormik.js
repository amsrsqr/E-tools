import React, { useCallback, useEffect, useState } from "react";
import "../css/style.css";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useBlocker } from "./NavPrompt/useBlocker";

const DirtyWarningAlertWithoutFormik = ({
  isBlocking,
  isSaving,
  onSave,
  messageBody,
  sourceName,
  callBackResult,
}) => {
  // debugger;
  const [showPrompt, setShowPrompt] = useState(false);
  const cancelNavigation = () => {
    callBackResult(false);
  };

  const confirmNavigation = () => {
    callBackResult(true);
  };

  useEffect(() => {
    setShowPrompt(isBlocking);
  }, [isBlocking]);

  return (
    <Modal
      isOpen={showPrompt}
      centered
      toggle={cancelNavigation}
      className="modal-md"
    >
      <ModalHeader
        style={{ "border-bottom": "0 none" }}
        toggle={cancelNavigation}
      ></ModalHeader>
      <ModalBody className="text-center">
        <p>
          <i
            className="fa fa-exclamation-triangle fa-5x fa-cog"
            aria-hidden="true"
          ></i>
        </p>
        <div className="fw-bold" style={{ fontSize: "16px" }}>
          {`${sourceName} - Unsaved Changes`}
        </div>
        <p
          style={{ marginBottom: "0", fontSize: "14px" }}
          className="fs-6 mt-3"
        >
          {`There are unsaved changes in `}
          <b>{`${sourceName}`}</b>
          <br />
          {messageBody}
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="w-100 d-flex justify-content-center">
          <Button
            type="submit"
            className="fw-bold btn btn-secondary addbtn  btn-primary"
            style={{ fontSize: "16px" }}
            onClick={confirmNavigation}
          >
            {"Yes, discard changes"}
          </Button>
          <Button
            type="reset"
            className="fw-bold btn btn-secondary"
            style={{
              fontSize: "16px",
              backgroundColor: "#F5F5F5",
              color: "black",
              marginLeft: "7px",
            }}
            size="md"
            onClick={cancelNavigation}
          >
            {"No, cancel"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DirtyWarningAlertWithoutFormik;
