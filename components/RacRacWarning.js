import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { OK } from "../constant/MessageConstant";
import Page from "./Page";

const RacRacWarning = ({
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
        <Modal isOpen={fieldAlertWarning} centered toggle={handleClose}>
          <ModalHeader
            style={{ "border-bottom": "0 none" }}
            toggle={handleClose}
          ></ModalHeader>

          <ModalBody className="text-center">
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
          <ModalFooter>
            <div className="w-100 d-flex justify-content-center">
              {/* <Button
                onClick={handleClose}
                className="fw-bold"
                style={{
                  fontSize: "16px",
                  backgroundColor: "#F5F5F5",
                  color: "black",
                  borderColor: "white",
                  width: "100%",
                }}
              >
                {OK}  
              </Button> */}
            </div>
          </ModalFooter>
        </Modal>
      </Page>
    </>
  );
};

export default RacRacWarning;
