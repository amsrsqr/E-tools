import { React } from "react";
import { Modal, ModalBody, Button, ModalHeader, ModalFooter } from "reactstrap";
import { OK } from "../constant/MessageConstant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const ModalError = ({
  showErrorPopup,
  fieldArray = [],
  errorMessage,
  secondMsg = "",
  thirdMsg="",
  header,
  handleErrorClose,
  buttonType = "remove",
}) => {
  const toggleShow = (flag) => {
    handleErrorClose(flag);
  };

  return (
    <Modal
      isOpen={showErrorPopup}
      centered
      toggle={() => {
        toggleShow(false);
      }}
    >
      <ModalHeader
        style={{ borderBottom: "0 none" }}
        toggle={() => {
          toggleShow(false);
        }}
      ></ModalHeader>
      <ModalBody className="p-0">
        <div className="text-center">
          <p>
            {/* <i
              class="fa fa-exclamation-triangle fa-cog"
              aria-hidden="true"
              // style={{ fontSize: "20px" }}
            ></i> */}
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ fontSize: "60px", color: "red" }}
            />
          </p>
          <div className="fw-bold" style={{ fontSize: "16px" }}>
            {header}
          </div>
          <p className="mt-3" style={{ fontSize: "14px" }}>
            {errorMessage}
          </p>
          <p style={{marginTop:"-15px"}}>
          {thirdMsg}
          </p>
          {secondMsg && (
            <p className="mt-3" style={{ fontSize: "14px" }}>
              {secondMsg}
            </p>
          )}
        </div>
        <div className="offset-4 col-sm-12">
          <ul className="list-group-horizontal-md">
            {fieldArray.map((field) => {
              return <li style={{ fontSize: "14px" }}>{field.name}</li>;
            })}
          </ul>
        </div>
      </ModalBody>
      <ModalFooter
        style={{
          padding: "1px",
          borderTop: "none",
          margin:"0px -5px -5px -5px"
        }}
      >
        <div
          className="d-flex justify-content-center"
          style={{
            width: "100%",
            backgroundColor: buttonType === "remove" ? "" : "#F5F5F5",
          }}
        >
          {buttonType === "remove" ? (
            <div style={{marginTop:"15px"}}>
              <Button
                onClick={() => {
                  toggleShow(true);
                }}
                className="fw-bold"
                style={{
                  fontSize: "16px",
                  backgroundColor: "rgb(60, 141, 188)",
                  color: "white",
                  borderColor: "white",
                  marginRight: "10px",
                  borderRadius: "5px",
                }}
              >
                {"Yes, remove"}
              </Button>
              <Button
                onClick={() => {
                  toggleShow(false);
                }}
                className="fw-bold"
                style={{
                  fontSize: '16px',
                  backgroundColor: '#F5F5F5',
                  color: 'black',
                  borderColor: 'lightgray',
                  borderRadius: "5px",
                }}
              >
                {"No, cancel"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                toggleShow(false);
              }}
              className="fw-bold swal2-confirm swal2-styled swal2-default-outline footerBtn"
              style={{
                fontSize: "16px",
                backgroundColor: "#F4F4F4",
                color: "black",
                padding:"13px"
              }}
            >
              {"Ok"}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ModalError;
