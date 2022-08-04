import React, { useEffect, useState, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  CLOSE,
  SAVE,
  FILENAMEERROR,
  ADDDOCUMENT,
  UPDATEDOCUMENT,
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
import {
  ADD,
  DOCUMENTTYPE,
  FILEUPLOAD,
  TEMPLATENAME,
  EDIT,
  DOCUMENTFILE,
} from "../../../constant/FieldConstant";
import ModalError from "../../../components/ModalError";
import { CKEditor } from "ckeditor4-react";
import facilityServiceDetailsServices from "../../../services/Facility/facilityServiceDetails.services";
import Select from "react-select";
import moment from "moment";
import SuccessAlert from "../../../components/SuccessAlert";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import FileUploader from "../../../components/FileUploader/FileUploader";
import documentTypeService from "../../../services/Master/documentType.service";
import AddEditDocumnetType from "../../Master/documentType/AddEditDocumnetType";
import SingleSelect from "../../../components/MySelect/MySelect";

const AddEditDocumentLogo = ({
  ShowModel,
  callBackAddEditFormToViewForm,
  Type,
  facilityid,
  Data,
}) => {
  const [show, setShow] = useState(ShowModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showDocumentType, setShowDocumentType] = useState(false);
  const [id, setId] = useState(0);
  const [errorArray, setErrorArray] = useState([]);
  const [isActive, setIsAtiveShow] = useState(true);
  const [headOfficeId, setHeadOfficeId] = useState("");
  //setFacilityId
  const [facilityId, setFacilityId] = useState("");
  const [documentType, setDocumentType] = useState([]);
  const [ckEditorData, setckEditorData] = useState("");
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setUpdatedBy] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [data, setData] = useState({});
  const [type, setType] = useState();
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [initialValues, setInitialValues] = useState({
    DocumentTypeId: 0,
    fileName: "",
    active: false,
    comment: "",
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedfileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [editFileObj, setEditFileObj] = useState({});
  const [isFileUpdate, setFileUpdate] = useState(false);

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
    console.log("ckEditorData in useEffect", ckEditorData);
  }, [ckEditorData]);

  useEffect(() => {
    setShow(ShowModel);
    getDocumentTypeList();
  }, [ShowModel]);

  useEffect(() => {
    console.log("selectedCategory in useEffect", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    setFacilityId(facilityid);
  }, [facilityid]);

  //   const getDocumentTypeList = () => {
  //     // headOfficeDocumentLogoServices.getAllDocumentTypeList().then(
  //     //   (response) => {
  //     //     setLoading(false);
  //     //     const result = response.map((x) => {
  //     //       x.value = x.id;
  //     //       x.label = x.name;
  //     //       return x;
  //     //     });
  //     //     setDocumentType(result);
  //     //   },
  //     //   (error) => {
  //     //     setLoading(false);
  //     //   }
  //     // );
  //   };
  const getDocumentTypeList = () => {
    setLoading(true);
    documentTypeService
      .getAlldocumentTypes()
      .then(
        (response) => {
          setLoading(false);
          console.log("getDocumentTypeList", response);
          const result = response.map((x) => {
            x.value = x.id;
            x.label = x.name;
            return x;
          });
          setDocumentType(result);
        },
        (error) => {
          setLoading(false);
        }
      )
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (Data && Data.item) {
      console.log(Data.item);
      console.log(Data.item.displayFileName);
      const tempDate = moment(Data.item.createdAt).format("DD/MM/YYYY");
      const tempTime = moment(Data.item.createdAt).format("hh:mm a");
      setCreatedBy(Data.item.createdBy + " , " + tempDate);
      const tempDateCreatedBy = moment(Data.item.lastUpdated).format(
        "DD/MM/YYYY"
      );
      if (Data.item.lastUpdated && Data.item.lastUpdated !== null) {
        const tempTimeCreatedBy = moment(Data.item.lastUpdated).format(
          "DD/MM/YYYY"
        );

        setUpdatedBy(Data.item.updatedBy + " , " + tempTimeCreatedBy);
      } else {
        setUpdatedBy(Data.item.updatedBy);
      }

      // delete x.displayFileName;
      setEditFileObj({ ...Data.item, fileName: Data.item.displayFileName });

      setId(Data.item.id);
      setckEditorData(Data.item.comment ? Data.item.comment : "");
      setIsAtiveShow(Data.item.active === true ? true : false);
      //setIsAtiveShow(Data.item.status === "Archived" ? false:  true  );
      setIsAtiveShow(Data.item.isActive);
      setFileName(Data.item.displayFileName);
      setSelectedCategory({
        id: Data.item.typeId,
        label: Data.item.type,
      });
      ref.current.setFieldValue("DocumentTypeId", Data.item.typeId);
      ref.current.setFieldValue("fileName", Data.item.displayFileName);

      setFileData({});
      setInitialValues({
        DocumentTypeId: Data.item.typeId,
        comment: ckEditorData ? ckEditorData : "",
        fileName: Data.item.displayFileName,
      });
    } else {
      setEditFileObj({});
      setckEditorData("");
      // setSelectedCategory({ id: 0, label: "" });
      setSelectedCategory(null);
      setEditFileObj({});
      setIsAtiveShow(true);
      setInitialValues({
        DocumentTypeId: 0,
        comment: "",
        fileName: "",
      });
    }
  }, [Data]);

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const getHeadOfficeId = () => {
    // headOfficeDocumentLogoServices.getHeadOfficeDetailsId().then(
    //   (response) => {
    //     console.log("Officeid" + response.id);
    //     if (response && response.id) {
    //       setHeadOfficeId(response.id);
    //     }
    //   },
    //   (error) => {
    //     setLoading(false);
    //   }
    // );
  };

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);

    setInitialValues({
      DocumentTypeId: 0,
      comment: "",
      fileName: "",
      active: false,
    });

    setShow(!show);
    setId(0);
  };

  const validateForm = (values) => {
    console.log("validateForm", values);
    var errorObj = {},
      errorArr = [];
    if (!selectedfileName) {
    }
    if (
      values.DocumentTypeId == 0 ||
      values.DocumentTypeId == undefined
      //   &&
      //   selectedCategory &&
      //   selectedCategory.id == 0
    ) {
      console.log("DocumentTypeId error");
      errorObj.DocumentTypeId = "DocumentType can not empty";
      errorArr.push({ name: "DocumentTypeId" });
    }
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
    console.log("ckEditorData", event.editor.getData());
    setckEditorData(ckEditorData);
  };

  const handleDocumenFile = (file) => {
    setFileData(file);
    setFileName(file.name);
    setFileUpdate(!isFileUpdate);
    ref.current.setFieldValue("fileName", file.name);
  };
  const handeDocumentTypeChange = (selected) => {
    setSelectedDocumentType(selected.id);
  };
  const AddNewDocumentType = () => {
    setShowDocumentType(true);
    setData({});
    setType("Add");
  };
  const childToParent = (childdata, success, msg) => {
    setShowDocumentType(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        type,
        msg: msg ? msg : type === "Edit" ? ADDDOCUMENT : UPDATEDOCUMENT,
        callback: (value) => {
          setShowSuccessAlert(false);
          getDocumentTypeList();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  async function saveDocumentLogo(fields, { setStatus, setSubmitting }) {
    console.log("Fields", fields);
    setStatus();
    debugger;
    // let ckEditorDescription = "";
    // let newdes = ckEditorData
    //   ? ckEditorData
    //       .replaceAll("&nbsp;", "")
    //       .replaceAll(/\s/g, "")
    //       .replaceAll("<p></p>", "")
    //   : "";
    // ckEditorDescription = !newdes.length ? "" : ckEditorData;

    setSubmitting(false);
    if (Type == EDIT) {
      setLoading(true);

      let formData = new FormData();
      formData.append("facilityId", facilityId ? facilityId : "");
      formData.append(
        "documentTypeId",
        fields.DocumentTypeId ? fields.DocumentTypeId : selectedCategory.id
      );
      formData.append("active", isActive);
      formData.append("comment", ckEditorData);
      formData.append("documentFile", fileData ? fileData : {});
      formData.append("isUpdated", isFileUpdate);
      formData.append("Id", Data.item.id);
      facilityServiceDetailsServices.updateFacilityDocumentlogo(formData).then(
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
      formData.append("facilityId", facilityId ? facilityId : "");
      formData.append("documentTypeId", fields.DocumentTypeId);
      formData.append("active", isActive);
      formData.append("documentFile", fileData);
      formData.append("comment", ckEditorData);

      // createFacilityDocumentlogo

      facilityServiceDetailsServices.createFacilityDocumentlogo(formData).then(
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
  }

  const fetchFile = (documentId) => {};

  const handleSelectChange = (selected) => {};

  const reactSelectTheme = (error) => (theme) => {
    const errorStyling = error
      ? {
          neutral50: "#dc3545",

          neutral30: "#dc3545",

          neutral20: "#dc3545",

          neutral60: "#dc3545",
        }
      : {};

    return {
      ...theme,

      colors: {
        ...theme.colors,

        ...errorStyling,
      },
    };
  };
  return (
    <Formik
      enableReinitialize
      innerRef={ref}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        DocumentTypeId: Yup.string(),
        fileName: Yup.mixed().required(FILENAMEERROR),
        active: Yup.string(),
        comment: Yup.string(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveDocumentLogo}
    >
      {({
        errors,
        setErrors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        touched,
        values,
      }) => (
        <>
          {loading ? <Loader></Loader> : null}
          <Modal
            isOpen={show}
            centered
            size="lg"
            // style={{ maxWidth: "900px", width: "100%" }}
            toggle={() => {
              setErrors({});
              handleClose(values);
            }}
          >
            <ModalHeader
              toggle={() => {
                setErrors({});
                handleClose(values);
              }}
              className="text-dark"
            >
              {Type === ADD ? ADD + " New Document" : EDIT + " Document"}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={TEMPLATENAME}
                ></ModalError>

                <AddEditDocumnetType
                  type={type}
                  Data={data}
                  ShowModel={showDocumentType}
                  callBackAddEditFormToViewForm={childToParent}
                />
                {showSuccessAlert && (
                  <SuccessAlert
                    type={successAlertOptions.type}
                    msg={successAlertOptions.msg}
                    title={successAlertOptions.title}
                    callback={successAlertOptions.callback}
                  ></SuccessAlert>
                )}

                <Row style={{ marginRight: "-60px" }}>
                  <FormGroup row>
                    <Label
                      htmlFor="DocumentTypeId "
                      sm={2}
                      className={
                        errors.DocumentTypeId && touched.DocumentTypeId
                          ? " is-invalid-label required-field text-end"
                          : "required-field text-end"
                      }
                    >
                      {DOCUMENTTYPE}
                    </Label>
                    <Col sm={8}>
                      <SingleSelect
                        name="DocumentTypeId"
                        //className="text-start"
                        placeholder="Select...."
                        onChange={(selected) => {
                          handeDocumentTypeChange(selected);
                          setFieldValue("DocumentTypeId", selected.id);
                          setSelectedCategory(selected);
                        }}
                        error={
                          errors.DocumentTypeId && touched.DocumentTypeId
                            ? true
                            : false
                        }
                        className={
                          errors.DocumentTypeId
                            ? "is-invalid fontsize-14"
                            : "fontsize-14"
                        }
                        options={documentType}
                        onBlur={(selected) =>
                          setFieldTouched("DocumentTypeId", selected.id)
                        }
                        isOptionSelected={(x) => {
                          return selectedCategory &&
                            x.id === selectedCategory.id
                            ? x
                            : null;
                        }}
                        theme={reactSelectTheme(
                          errors.DocumentTypeId && touched.DocumentTypeId
                        )}
                        // defaultValue={
                        //   selectedCategory !== null ? selectedCategory : ""
                        // }
                        value={
                          selectedCategory !== null ? selectedCategory : ""
                        }
                      />

                      <InlineBottomErrorMessage name="DocumentTypeId" />
                    </Col>
                    <Col sm={2} style={{ cursor: "pointer", marginTop: "8px" }}>
                      <a
                        className="mt-5"
                        style={{ cursor: "pointer" }}
                        onClick={AddNewDocumentType}
                      >
                        Add New
                      </a>
                    </Col>
                  </FormGroup>
                </Row>

                <Row className="text-end" style={{ marginRight: "-60px" }}>
                  <FormGroup row>
                    <Label sm={2}>Active</Label>
                    <Col sm={10}>
                      <FormGroup check>
                        <Input
                          id="checkbox"
                          name="active"
                          type="checkbox"
                          style={{ marginTop: "10px" }}
                          checked={isActive}
                          onChange={() => handleIsActive(values)}
                        />{" "}
                        <Label
                          className="text-center"
                          style={{ color: "gray" }}
                          check
                        >
                          {/* {isActive ? null : DOCUMENT_ACTIVE_INACTIVECHECKBOX} */}
                        </Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Row>
                <Row style={{ marginRight: "-60px" }}>
                  <FormGroup row>
                    <Label
                      sm={2}
                      htmlFor="fileName"
                      style={{
                        textAlign: "right",
                      }}
                      className={
                        errors.fileName && touched.fileName
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {DOCUMENTFILE}
                    </Label>

                    <Col sm={8}>
                      <FormGroup>
                        <FileUploader
                          hrefUrl={fileContent}
                          fileObj={editFileObj}
                          fetchFile={fetchFile}
                          handleTemplateFile={handleDocumenFile}
                          acceptImage={true}
                          className={
                            errors.fileName && touched.fileName
                              ? "is-invalid"
                              : ""
                          }
                          callBackFileChanged={(fileName) => {
                            setFieldValue("fileName", fileName);
                          }}
                        />

                        <InlineBottomErrorMessage
                          name="fileName"
                          style={{ textAlign: "left" }}
                        />
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Row>
                <Row style={{ marginRight: "-60px" }} className="text-end">
                  <FormGroup row>
                    <Label sm={2}>Comment</Label>
                    <Col sm={8}>
                      <CKEditor
                        config={editorConfiguration}
                        name="comment"
                        initData={ckEditorData}
                        onChange={(event) => {
                          handleEditorChange(event);
                          setFieldValue("comment", event.editor.getData());
                        }}
                      />
                    </Col>
                  </FormGroup>
                </Row>
              </ModalBody>
              <ModalFooter>
                {Type == EDIT ? (
                  <>
                    <div
                      className=" col justify-content-start "
                      style={{ marginLeft: "-49px" }}
                    >
                      <Row>
                        <Label
                          sm={3}
                          htmlFor=""
                          //   style={{
                          //     textAlign: "right",
                          //   }}
                          className="footerLabels"
                        >
                          Uploaded by
                        </Label>
                        <Col sm={4}>
                          <div
                            style={{
                              paddingTop: "7px",
                            }}
                            className="lastCreatedUpdatedLabelSize"
                          >
                            {createdBy}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Label
                          sm={3}
                          htmlFor=""
                          //   style={{
                          //     textAlign: "right",
                          //   }}
                          className="footerLabels"
                        >
                          Last modified by
                        </Label>
                        <Col sm={4}>
                          <div
                            style={{
                              paddingTop: "7px",
                            }}
                            className="lastCreatedUpdatedLabelSize"
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
                  size="lg"
                >
                  {Type === ADD ? ADD : SAVE}
                </Button>
                <Button
                  type="reset"
                  className="clsbtn btn btn-secondary"
                  size="md"
                  onClick={() => {
                    setErrors({});
                    handleClose(values);
                  }}
                >
                  {CLOSE}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default AddEditDocumentLogo;
