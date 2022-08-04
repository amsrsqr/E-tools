import React, { useEffect, useState, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  CLOSE,
  SAVE,
  RESIDENTLETTER_ACTIVE_INACTIVECHECKBOX,
  TEMPLATENAMEERROR,
  FILENAMEERROR,
} from "../../../constant/MessageConstant";
import Loader from "../../../components/Loader";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Label,
  Button,
  Row,
  Col,
  Input,
} from "reactstrap";
import { ADD, CANCLE, TEMPLATENAME } from "../../../constant/FieldConstant";
import ModalError from "./../../../components/ModalError";
import { CKEditor } from "ckeditor4-react";
import residentLetterServices from "../../../services/Master/residentLetter.services";
import { EDIT } from "../../../constant/FieldConstant";
import FileUploader from "../../../components/FileUploader/FileUploader";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";

const AddResidentLetter = ({
  ShowModel,
  callBackAddEditFormToViewForm,
  Type,
  Data,
}) => {
  const [show, setShow] = useState(ShowModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [id, setId] = useState(0);
  const [errorArray, setErrorArray] = useState([]);
  const [isActive, setIsAtiveShow] = useState(true);
  const [selectedfileName, setFileName] = useState("");
  const [ckEditorData, setckEditorData] = useState("");
  const [fileData, setFileData] = useState("");
  const ref = useRef();
  const [fileContent, setFileContent] = useState("");
  const [editFileObj, setEditFileObj] = useState({});
  const [isFileUpdate, setFileUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setUpdatedBy] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [initialValues, setInitialValues] = useState({
    TemplateName: "",
    fileName: "",
    active: false,
    description: "",
  });

  const editorConfiguration = {
    removePlugins:
      "specialCharacters,elementspath,blockquote,save,flash,iframe,pagebreak,templates,about,showblocks,newpage,language,print,div",
    extraPlugins: ["font", "justify"],
    removeButtons:
      "Undo,Redo,SpecialChar,HorizontalRule,PasteText,Scayt,Styles,HorizontalLine,Subscript,Superscript,Link,Cut,Copy,Unlink,Paste,Indent,Outdent,Format,Table,Image,Source,Anchor,PasteFromWord,Insert Special Character,Save,Print,Preview,Find,About,Maximize,ShowBlocks",
    height: 160,
    innerWidth: 200,
  };
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [show]);

  useEffect(() => {
    setShow(ShowModel);
  }, [ShowModel]);

  useEffect(() => {
    if (Data.item) {
      setCreatedBy(Data.item.createdBy);
      setUpdatedBy(Data.item.modifiedBy);
      setEditFileObj(Data.item);
      setId(Data.item.id);
      setckEditorData(Data.item.description);
      setIsAtiveShow(Data.item.status === "Active" ? true : false);
      setFileName(Data.item.displayFileName);
      setFileData({});
      ref.current.setFieldValue("fileName", Data.item.displayFileName);
      var parts = Data.item.name.split(".");
      let templateName = "";
      if (parts.length > 0) {
        templateName = parts[0];
      } else {
        templateName = Data.item.name;
      }
      setInitialValues({
        TemplateName: templateName,
        active: Data.item.status === "Active" ? true : false,
        description: ckEditorData,
        fileName: Data.item.displayFileName,
      });
    } else {
      setEditFileObj({});
      setckEditorData("");
      setIsAtiveShow(true);
      setInitialValues({
        TemplateName: "",
        active: true,
        description: "",
        fileName: "",
      });
    }
  }, [Data]);

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    values.TemplateName = Type === "Add" ? "" : Data.name;
    setShow(!show);
    setId(0);
  };

  const validateForm = (values) => {
    debugger;
    var errorObj = {},
      errorArr = [];
    if (values.TemplateName === "" && ref.current.values.TemplateName === "") {
      errorObj.TemplateName = TEMPLATENAMEERROR;
      errorArr.push({ name: TEMPLATENAMEERROR });
    }
    if (!selectedfileName) {
    }
    // if (values.fileName === "") {
    //     errorObj.fileName = FILENAMEERROR;
    //     errorArr.push({ name: FILENAMEERROR });
    //   }
    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  const handleIsActive = (val) => {
    setIsAtiveShow(!isActive);
  };

  const handleEditorChange = (event) => {
    let ckEditorData = event.editor.getData();
    setckEditorData(ckEditorData);
  };

  const handleDocumenFile = (file) => {
    let tempTemplate = ref.current.values.TemplateName;
    setFileData(file);
    setFileName(file.name);
    setFileUpdate(!isFileUpdate);
    if (!ref.current.values.TemplateName) {
      var parts = file.name.split(".");
      let templateName = parts[0];
      tempTemplate = templateName;
      ref.current.setFieldValue("TemplateName", templateName);
    }
    setInitialValues({
      ...initialValues,
      TemplateName: tempTemplate,
      fileName: file.name,
    });
    ref.current.setFieldValue("fileName", file.name);
  };

  async function saveResidentLetter(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (Type == EDIT) {
      setLoading(true);
      let formData = new FormData();
      formData.append("id", id);
      formData.append("templateName", fields.TemplateName);
      formData.append("active", isActive);
      formData.append("description", ckEditorData);
      formData.append("file", fileData ? fileData : {});
      formData.append("isUpdate", isFileUpdate);
      residentLetterServices.updateResidentLetterTemplate(formData).then(
        (data) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, data.message);
          setShow(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(true);
      let formData = new FormData();
      formData.append("templateName", fields.TemplateName);
      formData.append("active", isActive);
      formData.append("description", ckEditorData);
      formData.append("file", fileData);
      residentLetterServices.createResidentLetterTemplate(formData).then(
        (data) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, data.message);
          setShow(false);
        },
        () => {
          setLoading(false);
        }
      );
    }
    setSubmitting(false);
  }

  const fetchFile = (documentId) => {};
  const updateInput = (value) => {
    ref.current.setFieldValue("TemplateName", value);
  };

  return (
    <Formik
      enableReinitialize
      innerRef={ref}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        TemplateName: Yup.string().required(),
        fileName: Yup.mixed().required(FILENAMEERROR),
        active: Yup.string(),
        description: Yup.string(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveResidentLetter}
    >
      {({
        errors,
        setErrors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        touched,
        values,
        handleReset,
      }) => (
        <>
          {loading ? <Loader></Loader> : null}
          <Modal
            isOpen={show}
            centered
            size="lg"
            toggle={() => {
              handleClose(values);
              handleReset();
            }}
          >
            <ModalHeader
              toggle={() => {
                handleClose(values);
                handleReset();
              }}
              className="text-dark"
            >
              {Type} Letter Template
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={TEMPLATENAME}
                ></ModalError>

                <Row>
                  <FormGroup row>
                    <Label
                      htmlFor="TemplateName"
                      column
                      sm={2}
                      style={{
                        textAlign: "right",
                      }}
                      className={
                        errors.TemplateName && touched.TemplateName
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {TEMPLATENAME}
                    </Label>
                    <Col sm={10}>
                      <Field
                        name="TemplateName"
                        type="text"
                        ref={ref}
                        value={values.TemplateName}
                        onChange={(e) => {
                          const val = (e.target.value || "").replace(
                            /\s+/gi,
                            " "
                          );
                          setFieldValue("TemplateName", val.trimLeft());
                          handleBlur(val);
                        }}
                        autoComplete="off"
                        className={
                          "text form-control" +
                          (errors.TemplateName && touched.TemplateName
                            ? " is-invalid"
                            : "")
                        }
                        isvalid={touched.TemplateName && !errors.TemplateName}
                      />

                      <InlineBottomErrorMessage
                        style={{
                          display: "block",
                          textAlign: "left",
                          width: "fit-content",
                        }}
                        name="TemplateName"
                      />
                    </Col>
                  </FormGroup>
                </Row>
                <Row className="text-end">
                  <FormGroup row>
                    <Label style={{ paddingTop: "0px" }} sm={2}>
                      Active
                    </Label>
                    <Col sm={10}>
                      <FormGroup check>
                        <Input
                          id="checkbox"
                          name="active"
                          type="checkbox"
                          checked={isActive}
                          onChange={() => handleIsActive(values)}
                        />{" "}
                        <Label
                          style={{
                            color: "gray",
                            display: "flex",
                            fontStyle: "italic",
                          }}
                          check
                        >
                          {isActive
                            ? null
                            : "( " +
                              RESIDENTLETTER_ACTIVE_INACTIVECHECKBOX +
                              " )"}
                        </Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Row>
                <Row className="text-end">
                  <FormGroup row>
                    <Label sm={2}>Description</Label>
                    <Col sm={10}>
                      <CKEditor
                        config={editorConfiguration}
                        id="firstEditor"
                        name="description"
                        initData={ckEditorData}
                        onChange={handleEditorChange}
                      />
                    </Col>
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup row>
                    <Label
                      sm={2}
                      htmlFor="fileName"
                      className={
                        errors.fileName && touched.fileName
                          ? " is-invalid-label required-field text-end"
                          : "required-field text-end"
                      }
                    >
                      File Upload
                    </Label>

                    <Col style={{ paddingLeft: "7px" }} sm={10}>
                      <FormGroup>
                        <FileUploader
                          hrefUrl={fileContent}
                          fileObj={editFileObj}
                          fetchFile={fetchFile}
                          handleTemplateFile={(file) => {
                            // var parts = file.name.split('.');
                            // let templateName = parts[0];
                            // values.TemplateName=templateName
                            handleDocumenFile(file);
                          }}
                          acceptImage={false}
                          className={
                            errors.fileName && touched.fileName
                              ? "is-invalid"
                              : ""
                          }
                        />
                        <InlineBottomErrorMessage
                          style={{
                            display: "block",
                            textAlign: "left",
                            width: "fit-content",
                            marginLeft: "5px",
                          }}
                          name="fileName"
                        />
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Row>
              </ModalBody>
              <ModalFooter>
                {Type == EDIT ? (
                  <>
                    <div className=" col justify-content-start">
                      <Row>
                        <Label
                          sm={3}
                          htmlFor=""
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        >
                          Uploaded by
                        </Label>
                        <Col sm={4}>
                          <div
                            style={{
                              paddingTop: "7px",
                            }}
                          >
                            {createdBy}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Label
                          sm={3}
                          htmlFor=""
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        >
                          Last modified by
                        </Label>
                        <Col sm={4}>
                          <div
                            style={{
                              paddingTop: "7px",
                            }}
                          >
                            {lastUpdated}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : null}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="modalsave btn btn-primary mr-2"
                  size="md"
                >
                  {Type === ADD ? ADD : SAVE}
                </Button>
                <Button
                  type="reset"
                  className="clsbtn btn btn-secondary"
                  size="md"
                  onClick={() => {
                    handleClose(values);
                    handleReset();
                  }}
                >
                  {Type === ADD ? CLOSE : CANCLE}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default AddResidentLetter;
