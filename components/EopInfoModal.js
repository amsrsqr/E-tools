import React, { useEffect, useState } from "react";
import Page from "./Page";

import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { DELETE } from "../constant/FieldConstant";
import { ARCHIVE } from "./../constant/FieldConstant";

const EopInfoModal = ({
  ShowDeleteModal,
  archiveConfirmationCallBack,
  Data,
  setShowFinaliseConfirm,
}) => {
  const [showalert, ShowModelAlert] = useState(ShowDeleteModal);
  const onDelete = () => {
    archiveConfirmationCallBack(false, true);
  };
  useEffect(() => {
    ShowModelAlert(ShowDeleteModal);
  }, [ShowDeleteModal]);
  useEffect(() => {}, [Data]);
  const handleClose = () => {
    // archiveConfirmationCallBack(false, false);
    ShowModelAlert(!showalert);
    setShowFinaliseConfirm(false);
  };
  return (
    <Page title="">
      <Modal isOpen={showalert} centered toggle={handleClose}>
        <ModalHeader
          style={{ "border-bottom": "0 none" }}
          toggle={handleClose}
        ></ModalHeader>

        <ModalBody className="text-center">
          <p>
            <i
              className="fa fa-exclamation-circle fa-5x "
              aria-hidden="true"
              style={{
                color: "#ed7d31",
              }}
            ></i>
          </p>
          <div className="fw-bold" style={{ fontSize: "16px" }}>
            End of Period - Finalise
          </div>
          <p
            style={{ marginBottom: "0", fontSize: "14px" }}
            className="fs-6 mt-3 pb-2"
          >
            Are you sure you want to Finalise this End of Period? <br/> Once
            Finalised, the action cannot be undone.
          </p>
        </ModalBody>

        <ModalFooter>
          <div className="w-100 d-flex justify-content-center">
            <Button
              type="submit"
              className="fw-bold "
              style={{
                width: "25%",
                backgroundColor: "#ed7d31",
                fontSize: "16px",
                border: "1px solid lightgray",
              }}
              onClick={onDelete}
            >
              Yes, finalise
            </Button>
            <Button
              type="reset"
              className="fw-bold"
              style={{
                width: "25%",
                fontSize: "16px",
                backgroundColor: "#F5F5F5",
                color: "black",
                marginLeft: "7px",
                border: "1px solid lightgray",
              }}
              size="md"
              onClick={() => {
                handleClose();
              }}
            >
              {"No, cancel"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </Page>
  );
};

export default EopInfoModal;
