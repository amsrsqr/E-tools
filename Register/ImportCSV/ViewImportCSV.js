import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import { Formik, Form } from "formik";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Row,
  Col,
} from "reactstrap";

import { CLOSE } from "../../../constant/MessageConstant";

import MapCSVFields from "./MapCSVFields";
import PreviewAndConfirm from "./PreviewAndConfirm";
import UploadCSV from "./UploadCSV";
import { v4 as uuid } from "uuid";
import SuccessAlert from "../../../components/SuccessAlert";
import ChildNavigationBar from "./ChildNavigationBar";
import DirtyWarningAlertWithoutFormik from "../../../components/DirtyWarningAlertWithoutFormik";

const ViewImportCSV = ({
  showModel,
  callBackForClose,
  callbackImport,
  setShowAddEditForm,

}) => {

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [show, setShow] = useState(showModel);
  const [loading, setLoading] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [Action, setAction] = useState("");

  const [errorObj, setErrorObj] = useState({});

  const [maplist, setMaplist] = useState([]);
  const [uniqueId, setUniqueId] = useState(0);

  //Generic error

  const [callSave, setCallSave] = useState(false);
  const [residentType, setResidentType] = useState("");

  const [AllFiles, setAllFiles] = useState([]);
  const [DbFiles, setDbFiles] = useState([]);

  const [finalmaplist, setFinalMaplist] = useState([]);
  const [unsavePopUp,setUnsavePopUp]=useState(false);

  useEffect(() => {
    const unique_id = uuid();
    console.log("unique_id", unique_id);
    setUniqueId(unique_id);
  }, []);

  const continueStep = () => {
    if (activeStep === 0 || activeStep === 1 || activeStep === 2) {
      setCallSave(true);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const callBackActiveStepUpload = (isSuccess, data, residentType) => {
    setCallSave(false);
    if (isSuccess) {
      setMaplist(data);
      setActiveStep(activeStep + 1);
      setResidentType(residentType);
    }
  };

  const callbackFileUpload = (fileData, DbFiles) => {
    console.log("fileData", fileData);
    console.log("DbFiles", DbFiles);
    setAllFiles(fileData);
    setDbFiles(fileData);
  };

  const callBackActiveStepValidation = (isSuccess, data) => {
    
    setCallSave(false);
    //setActiveStep(activeStep + 1);
    if (isSuccess) {
      console.log("Data in second button save", data);
      setFinalMaplist(data);
      setActiveStep(activeStep + 1);
    } else {
      setMaplist(data);
    }
  };

  const callBackActiveStepImport = (isFormVisible, isSuccess, data) => {
    setCallSave(false);
    if (isSuccess) {
      handleClose();
      callbackImport(isFormVisible, isSuccess, "Data Imported Successfully");
    }
  };

  const backStep = () => {
    setActiveStep(activeStep - 1);
    setAction("Back");
    setCallSave(false);
  };

  const handleClose = (values) => {
    if(activeStep===2){
      setUnsavePopUp(true)
    }else{
    callBackForClose(!show, false);
    setErrorObj({});
    setActiveStep(0);
    setShow(!show);
    }
   
  };
  useEffect(()=>{
   setShow(showModel)
  },[showModel])

const getCallbackUnsave=(val)=>{
  if(val){
      setUnsavePopUp(false)
      setShow(false)
      setShowAddEditForm(false);
    }else{
      setUnsavePopUp(false)
      // setShowAddEditForm(false);
    }
}

  return (
    <>
      {showSuccessAlert && (
        <SuccessAlert
          type={successAlertOptions.actionType}
          msg={successAlertOptions.msg}
          title={successAlertOptions.title}
          callback={successAlertOptions.callback}
        ></SuccessAlert>
      )}

      <Formik
        enableReinitialize
        validateOnChange={true}
        validateOnBlur={false}
        // onSubmit={saveNotesList}
      >
        {({
          errors,
          handleReset,
          setErrors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue,
          setFieldTouched,
        }) => (
          <>
            {loading ? <Loader></Loader> : null}

            <Modal
              centered
              isOpen={show}
              //size="xxl"
              className="import-modal"
              toggle={() => {
                setErrors({});
                handleClose(values);
              }}
            >
              <ModalHeader
                toggle={() => {
                  handleClose(values);
                  handleReset();
                }}
              >
                {"Register - Upload CSV"}
              </ModalHeader>
              <Form onSubmit={handleSubmit}>
                <ModalBody
                  style={{
                    height: "700px",
                  }}
                >
                  {unsavePopUp ?
                  <DirtyWarningAlertWithoutFormik
                   isBlocking={unsavePopUp}
                  sourceName="Import CSV "
                  messageBody={
                    "Are you sure you want to exit the Upload CSV scren and lose all the import data?"
                  }
                  callBackResult={getCallbackUnsave}
                />:null}
                  
                  <Row>
                    <Col sm={1}></Col>
                    <Col sm={10}>
                      <ChildNavigationBar currentStep={activeStep} />
                    </Col>
                    <Col sm={1}></Col>
                  </Row>
                  <Row>
                    <Col sm={12}></Col>
                  </Row>
                  {/* <div
                    style={{
                      height: "100px",
                      width: "100%",
                      marginRight: "40px",
                      marginLeft: "40px",
                    }}
                  >
                    
                  </div> */}

                  <Row>
                    <Col sm={12}>
                      {activeStep === 0 && (
                        <div>
                          <UploadCSV
                            callSave={callSave}
                            callBackActiveStep={callBackActiveStepUpload}
                            uniqueId={uniqueId}
                            callbackFileUpload={callbackFileUpload}
                            DataFile={DbFiles}
                            Action={Action}
                          />
                        </div>
                      )}

                      {activeStep === 1 && (
                        <div>
                          <MapCSVFields
                            maplist={maplist}
                            callSave={callSave}
                            callBackActiveStep={callBackActiveStepValidation}
                            uniqueId={uniqueId}
                            residentType={residentType}
                          />
                        </div>
                      )}
                      {activeStep === 2 && (
                        <div>
                          <PreviewAndConfirm
                            maplist={finalmaplist}
                            callSave={callSave}
                            callBackActiveStep={callBackActiveStepImport}
                            uniqueId={uniqueId}
                            residentType={residentType}
                          />
                        </div>
                      )}

                      {/* {activeStep === 4 && <div>Step 5</div>} */}
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-between">
                  <div className="row">
                    <div className="col-4">
                      {activeStep > 0 && (
                        <Button
                          type="button"
                          className="clsbtn btn btn-secondary "
                          onClick={() => {
                            backStep();
                          }}
                          style={{ width: "10% !important" }}
                        >
                          Back
                        </Button>
                      )}
                    </div>
                  </div>
                  <div
                    className="d-flex justify-content-end"
                    style={{ width: "75% !important" }}
                  >
                    {activeStep === 2 ? (
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        className="modalsave btn btn-primary mr-2"
                        color="primary"
                        size="md"
                        onClick={() => {
                          continueStep();
                        }}
                      >
                        {"Import"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        className="modalsave btn btn-primary mr-2"
                        color="primary"
                        size="md"
                        onClick={() => {
                          continueStep();
                        }}
                      >
                        {"Continue"}
                      </Button>
                    )}

                    <Button
                      onClick={() => {
                        setErrors({});
                        handleClose(values);
                      }}
                      style={{ marginLeft: "15px" }}
                      className="clsbtn btn btn-secondary"
                    >
                      {CLOSE}
                    </Button>
                  </div>
                </ModalFooter>
              </Form>
            </Modal>
          </>
        )}
      </Formik>
    </>
  );
};

export default ViewImportCSV;
