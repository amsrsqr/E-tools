import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Page from "./Page";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Label,
  Button,
  Row,
} from "reactstrap";

const ValidationAlert = ({ showValidationAlert }) => {
  const [showalert, ModelAlert] = useState();
  useEffect(() => {
    //console.log(showValidationAlert);
    ModelAlert(showValidationAlert);
  }, [showValidationAlert]);

  //useEffect(() => { //console.log(Data)}, [Data]);

  const handleClose = () => {
    ModelAlert(false);
  };
  return (
    <Page title="Product Type">
      <Modal isOpen={showalert} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>Invalid</ModalHeader>
        <ModalBody>
          <Row className="mb-3">
            <FormGroup row>
              <Label column sm={12} style={{ textAlign: "center" }}>
                Product Subcategory required
              </Label>
            </FormGroup>
          </Row>
          <ToastContainer />
        </ModalBody>
        <ModalFooter>
          <Button
            type="reset"
            color="secondary"
            size="md"
            onClick={() => {
              handleClose();
            }}
          >
            Ok
          </Button>
        </ModalFooter>
      </Modal>
    </Page>
  );
};

ValidationAlert.propTypes = {
  //AddDocument: PropTypes.func.isRequired,
  //UpdateDocument: PropTypes.func.isRequired
};
//   function mapDispatchToProps(dispatch) {
//     return {
//         AddDocument: (documentname) => {
//            dispatch(createDocumentType(documentname));

//       },
//       UpdateDocument: (id,documentname) => {
//         dispatch(updateDocumentType(id,documentname));

//    }
//     };
//   }
const mapStateToProps = (state) => state;
export default ValidationAlert;
