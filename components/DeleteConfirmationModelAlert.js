import React, { useEffect, useState } from "react";
import Page from "./Page";

import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { DELETE } from "../constant/FieldConstant";

const DeleteConfirmationModelAlert = ({
  ShowDeleteModal,
  deleteConfirmationCallBack,
  Data,
}) => {
  const [showalert, ShowModelAlert] = useState(ShowDeleteModal);
  const onDelete = () => {
    deleteConfirmationCallBack(false, true);
  };
  useEffect(() => {
    ShowModelAlert(ShowDeleteModal);
  }, [ShowDeleteModal]);
  useEffect(() => {}, [Data]);
  const handleClose = () => {
    deleteConfirmationCallBack(false, false);
    ShowModelAlert(!showalert);
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
              className="fa fa-exclamation-triangle fa-5x "
              aria-hidden="true"
            ></i>
          </p>
          <div className="fw-bold" style={{ fontSize: "16px" }}>
            {`${DELETE} ${Data.header}`}
          </div>
          <p
            style={{ marginBottom: "0"}}
            className="fs-7 mt-3"
          >
                {`Are you sure you want to delete this `}
                <b> {Data.message}</b>{'?'}
                
          </p>
          <p className="fs-7" >
            This action cannot be undone.
          </p>
        </ModalBody>

        <ModalFooter>
          <div className="w-100 d-flex justify-content-center">
            <Button
              type="submit"
              className="fw-bold "
              style={{ width: "25%", backgroundColor: '#3c8dbc', fontSize: "16px" }}
              onClick={onDelete}
            >
              {"Yes, delete"}
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
                borderColor:"rgba(128, 128, 128, 0.31)"
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

export default DeleteConfirmationModelAlert;
