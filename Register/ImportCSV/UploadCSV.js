import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Row,
  FormGroup,
  Label,
  Col,
  Input,
  CardTitle,
  InputGroup,
} from "reactstrap";
import Page from "../../../components/Page";
import Loader from "../../../components/Loader";
import ReactTable from "../../../components/ReactTable";
import SuccessAlert from "../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
//import Icon from "../../assets/Images/icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack, faDownload } from "@fortawesome/free-solid-svg-icons";
import { ACTION, ADD, DELETE, EDIT } from "../../../constant/FieldConstant";
import { MultipleFileUploadField } from "../../../components/MultipleFileUploader/MultipleFileUploadField";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import importCSV from "../../../services/Resident/importCSV.service";
import residentimport from "../../../services/Resident/importCSV.service"

// import {

// } from "../../../constant/MessageConstant";
//import Logo from "../../assets/Images/icon.png";
import { ButtonGroup, Dropdown } from "react-bootstrap";

const UploadCSV = ({
  callSave,
  callBackActiveStep,
  uniqueId,
  callbackFileUpload,
  DataFile,
  Action,
  cell
}) => {
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [type, setType] = useState();
  const [data, setData] = useState({});
  const [
    showDeleteConfirmationModelAlert,
    setShowDeleteConfirmationModelAlert,
  ] = useState(false);
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [itemForDelete, setItemForDelete] = useState({});
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [AllFiles, setAllFiles] = useState([]);
  const [updateFile, setIsUpdateFile] = useState(false);
  const [selectedDeleteFile, setSelectedDeleteFile] = useState();
  const [residentType, setResidentType] = useState("1");
  const [errorArray, setErrorArray] = useState([]);
  const [initialValues, setInitialValues] = useState({
    fileName: "",
  });

  useEffect(() => {
    console.log("This is DataFile", DataFile);
    if (Action === "Back" && DataFile.length > 0) {
      setAllFiles(DataFile);
    }
  }, [Action, DataFile]);

  console.log("callSave", callSave);
  useEffect(() => {
    if (callSave) {
      let error = validateForm();
      console.log("inside useeffect", errorArray);
      if (!error.fileName) {
        saveDataImport();
      } else {
        callBackActiveStep(false, "", "");
      }
    }
  }, [callSave]);


  const getDownloadresidentimport = (cell,filename) => {
    const link = document.createElement("a");
    residentimport
    .getDownloadresidentimport(cell,filename, )
    .then((response) => {
      link.target = "_blank";
      // link.download = filename;
      link.href = URL.createObjectURL(new Blob([response.data]));
      link.setAttribute('download',filename);
      document.body.appendChild(link);
      link.click();
      return response.data.result;
   })
  }


  const editshowChecklistModel = (item) => {
    setSelectedRowData(item);
    setShowAddEditForm(true);
    setChecklist(item);
    setType(EDIT);
  };

  const handleShow = () => {
    setShowAddEditForm(true);
    setData({});
    setType(ADD);
  };

  const getFile = (fileData, newFiles) => {
    console.log("newFilesvvvv", fileData);
    if (newFiles && newFiles.length > 0) {
      setIsUpdateFile(true);
      setAllFiles(newFiles);

      console.log("newFilesvvvv", newFiles);
      console.log("fileData", fileData);
      // setDbFiles([
      //   ...DbFiles,
      //   ...newFiles.map((flc, index) => ({
      //     file: flc.file,
      //     id: `${index}`,
      //     isDeleted: false,
      //   })),
      // ]);
      callbackFileUpload(newFiles);
      // callbackFileUpload(fileData, [
      //   ...DbFiles,
      //   ...newFiles.map((flc, index) => ({
      //     file: flc.file,
      //     id: `${index}`,
      //     isDeleted: false,
      //   })),
      // ]);
    }
  };

  const handleFileDelete = (dltFile, progress) => {
    setSelectedDeleteFile(dltFile);
    console.log("dltFile before", dltFile.file.name);
    console.log("progress before", progress);
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: dltFile.file?.name,
      message: dltFile.file?.name,
      fullSubMsg:
        progress < 100
          ? "Are you sure you want to cancel this file upload"
          : "",
      headMsg: progress < 100 ? `Cancel ${dltFile.file?.name} upload` : "",
      btnHeader: progress < 100 ? "Yes, continue" : "",
    });
  };

  const deleteConfirmationCallBack = (childdata, success) => {
    setShowDeleteConfirmationModal(childdata);
    if (success) {
      console.log("dltFile", selectedDeleteFile);
      let cpyFiles = [...AllFiles];
      const dltFileIndx = cpyFiles.findIndex(
        (flc) => flc.id === selectedDeleteFile.id
      );
      if (dltFileIndx >= 0) {
        cpyFiles.splice(dltFileIndx, 1);
        setAllFiles(cpyFiles);
      }
    }
  };

  async function saveDataImport(fields) {
    setLoading(true);
    let formData = new FormData();
    if (AllFiles && AllFiles.length > 0) {
      formData.append("file", AllFiles[0].file);
    } else {
      formData.append("file", {});
    }
    formData.append("uniqueId", uniqueId);
    formData.append("residentType", residentType);

    importCSV.importCSV(formData).then(
      (data) => {
        setLoading(false);
        console.log("This is data of 1st import", data.result);
        callBackActiveStep(true, data.result, residentType);
        // setShow(false);
      },
      () => {
        setLoading(false);
      }
    );
  }

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);

    if (AllFiles?.length <= 0) {
      errorObj.fileName = "Please Upload file";
      errorArr.push({ name: "fileName" });
    }

    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  return (
    <>
      <Formik
        enableReinitialize
        //innerRef={ref}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          fileName: Yup.string().required(),
          // lastVaccinationDate: Yup.string().required(),
          // dosesRequired: Yup.string().required(),
        })}
        validate={validateForm}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={saveDataImport}
      >
        {({
          errors,
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
            <DeleteConfirmationModelAlert
              ShowDeleteModal={showDeleteConfirmationModal}
              Data={deleteConfirmationModalData}
              deleteConfirmationCallBack={deleteConfirmationCallBack}
            ></DeleteConfirmationModelAlert>

            {showSuccessAlert && (
              <SuccessAlert
                type={successAlertOptions.actionType}
                msg={successAlertOptions.msg}
                title={successAlertOptions.title}
                callback={successAlertOptions.callback}
              ></SuccessAlert>
            )}
            {loading ? <Loader></Loader> : ""}
            <Row
              className={"fieldstyle"}
              style={{ padding: "3rem", marginTop: "40px" }}
            >
              <Col sm={6}>
                <Row style={{ marginBottom: "25px" }}>
                  <Col sm={1}>
                    <div
                      className=""
                      style={{
                        borderRadius: "50%",
                        border: "1px solid #a8e0e4",
                        boxShadow: "0 2px 0px 0 #a8e0e4",
                        width: 45,
                        height: 45,
                        color: "black",
                        fontWeight: "bold",

                        backgroundColor: "white",
                      }}
                    >
                      <p
                        style={{
                          marginTop: "8px",
                          marginLeft: "16px",
                          fontSize: "16px",
                        }}
                      >
                        1
                      </p>
                    </div>
                  </Col>
                  <Col sm={11}>
                    <p>
                      Download the relevant attached CSV file and input the
                      relevant details. If you have your own CSV file, you may
                      skip this step.
                    </p>
                    <div className="d-flex">
                      <Button className="addbtn btn btn-primary m-2  justify-content-end " 
                       onClick={()=> {
                            getDownloadresidentimport('2', "Pre 2014 Bonds.csv");
                          }}>
                        <FontAwesomeIcon
                          icon={faDownload}
                          style={{ width: "15px", height: "20px" }}
                        />{" "}
                        Pre 2014 Bonds
                      </Button>

                      <Button className="addbtn btn btn-default m-2  justify-content-end "
                      onClick={() => {
                        getDownloadresidentimport('1','Post 2014.csv')}}>
                        <FontAwesomeIcon
                          icon={faDownload}
                          style={{ width: "15px", height: "20px" }}                          
                        />{" "}
                        Post 2014
                      </Button>
                    </div>
                    <p>
                      Ensure you save in the CSV format so that you can upload
                      it in Step 3.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={1}>
                    <div
                      className=""
                      style={{
                        borderRadius: "50%",
                        border: "1px solid #a8e0e4",
                        boxShadow: "0 2px 0px 0 #a8e0e4",
                        width: 45,
                        height: 45,
                        color: "black",
                        fontWeight: "bold",

                        backgroundColor: "white",
                      }}
                    >
                      <p
                        style={{
                          marginTop: "8px",
                          marginLeft: "16px",
                          fontSize: "16px",
                        }}
                      >
                        2
                      </p>
                    </div>
                  </Col>
                  <Col sm={11}>
                    <p>What type of Residents is this for?</p>
                    <p>
                      <input
                        type="radio"
                        defaultChecked="true"
                        checked={residentType === "1" ? true : false}
                        onChange={() => {
                          setResidentType("1");
                        }}
                      />{" "}
                      &nbsp; Post 1st July 2014 Residents
                    </p>
                    <p>
                      <input
                        type="radio"
                        defaultChecked="false"
                        checked={residentType !== "1" ? true : false}
                        onChange={() => {
                          setResidentType("2");
                        }}
                      />{"  "}
                     &nbsp; Pre 1st July 2014 Bond Resident
                    </p>
                  </Col>
                </Row>
              </Col>

              <Col sm={6}>
                <Row>
                  <Col sm={1}>
                    <div
                      className=""
                      style={{
                        borderRadius: "50%",
                        border: "1px solid #a8e0e4",
                        boxShadow: "0 2px 0px 0 #a8e0e4",
                        width: 45,
                        height: 45,
                        color: "black",
                        fontWeight: "bold",

                        backgroundColor: "white",
                      }}
                    >
                      <p
                        style={{
                          marginTop: "8px",
                          marginLeft: "16px",
                          fontSize: "16px",
                        }}
                      >
                        3
                      </p>
                    </div>
                  </Col>
                  <Col sm={11}>
                    <p>
                      Upload your CSV file below. Press the Continue button once
                      uploaded. Please ensure that the file is in CSV format.
                    </p>
                    <Col sm={12}>
                      <FormGroup row>
                        <Col
                          sm={12}
                          className={
                            AllFiles &&
                            AllFiles?.length <= 0 &&
                            errorArray.length > 0
                              ? "fileInvalidate"
                              : "filevalidate"
                          }
                          //   style={{
                          //     marginLeft: "6px",
                          //     background: values.copyReceived ? "" : "#e9ecef",
                          //   }}
                        >
                          <MultipleFileUploadField
                            name="fileName"
                            selectedFile={AllFiles}
                            fileCallBack={getFile}
                            handleDelete={handleFileDelete}
                            isNotMultiple={true}
                          />
                        </Col>
                      </FormGroup>
                      {AllFiles &&
                      AllFiles?.length <= 0 &&
                      errorArray.length > 0 ? (
                        <InlineBottomErrorMessage msg="Required" />
                      ) : (
                        ""
                      )}
                    </Col>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        )}
      </Formik>
    </>
  );
};

export default UploadCSV;
