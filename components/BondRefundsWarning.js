import React, { useEffect, useState } from "react";
import Page from "./Page";

import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { DELETE } from "../constant/FieldConstant";
import { ARCHIVE } from "./../constant/FieldConstant";

const BondRefundsWarning = ({
  ShowDeleteModal,
  archiveConfirmationCallBack,
  Data,
  handleCloseModal
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
    archiveConfirmationCallBack(false, false);
    ShowModelAlert(!showalert);
    handleCloseModal();
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
            ></i>
          </p>
          <div className="fw-bold" style={{ fontSize: "16px" }}>
            Finalise
          </div>
          <p
            style={{ marginBottom: "0", fontSize: "14px" }}
            className="fs-6 mt-3"
          >
            Are you sure you want to finalise the RAD refund for this resident?
          </p>
        </ModalBody>

        <ModalFooter>
          <div className="w-100 d-flex justify-content-center">
            <Button
              type="submit"
              className="fw-bold "
              style={{
                width: "40%",
                backgroundColor: "#ed7d31",
                fontSize: "14px",
              }}
              onClick={onDelete}
            >
              Yes, finalise
            </Button>
            <Button
              type="reset"
              className="fw-bold"
              style={{
                width: "40%",
                fontSize: "14px",
                backgroundColor: "#F5F5F5",
                color: "black",
                marginLeft: "7px",
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

export default BondRefundsWarning;
