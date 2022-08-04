import React, { useCallback, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import "../css/style.css";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useBlocker } from "./NavPrompt/useBlocker";

const RefundWarningAlert = ({
  isBlocking,
  isSaving,
  onSave,
  messageBody,
  sourceName,
}) => {
  const formik = useFormikContext();
  function useCallbackPrompt(when) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPrompt, setShowPrompt] = useState(false);
    const [lastLocation, setLastLocation] = useState(null);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);
    const cancelNavigation = useCallback(() => {
      setShowPrompt(false);
    }, []);

    const handleBlockedNavigation = useCallback(
      (nextLocation) => {
        if (
          !confirmedNavigation &&
          nextLocation.location.pathname !== location.pathname
        ) {
          setShowPrompt(true);
          setLastLocation(nextLocation);
          return false;
        }
        return true;
      },
      [confirmedNavigation, isBlocking]
    );

    const confirmNavigation = useCallback(() => {
      setShowPrompt(false);
      setConfirmedNavigation(true);
    }, []);

    useEffect(() => {
      if (confirmedNavigation && lastLocation) {
        navigate(lastLocation.location.pathname);
      }
    }, [confirmedNavigation, lastLocation]);

    useBlocker(handleBlockedNavigation, when);

    return [showPrompt, confirmNavigation, cancelNavigation];
  }

  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(
    isBlocking || (formik?.dirty && formik?.submitCount === 0)
  );
  // console.log("showPrompt in dirty", showPrompt);
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
          <b>{`${sourceName}.`}</b>
          <br />
          {messageBody}
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="w-100 d-flex justify-content-center">
          <Button
            type="submit"
            className="fw-bold btn  addbtn  btn-primary"
            style={{ fontSize: "16px" }}
            onClick={confirmNavigation}
          >
            {"Yes, discard changes"}
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
            onClick={cancelNavigation}
          >
            {"No, cancel"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default RefundWarningAlert;
