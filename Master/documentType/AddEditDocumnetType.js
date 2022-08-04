import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ModalError from "../../../components/ModalError";
import { CKEditor } from "ckeditor4-react";
import Loader from "../../../components/Loader";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import documentTypeService from "../../../services/Master/documentType.service";
import { CLOSE, SAVE } from "../../../constant/MessageConstant";
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
} from "reactstrap";

import {
  ADD,
  CANCLE,
  DESCRIPTION,
  DOCUMENTTYPE,
  DOCUMENTTYPES,
  EDIT,
  NOTE,
} from "../../../constant/FieldConstant";

const AddEditDocumnetType = ({
  ShowModel,
  Data,
  type,
  callBackAddEditFormToViewForm,
}) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(ShowModel);
  const [id, setId] = useState(0);
  const [ckEditorData, setckEditorData] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
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
      document.body.style.overflow = 'hidden'
    }else {
      document.body.style.overflow = 'unset';
    }
  }, [show])

  useEffect(() => {
    setShow(ShowModel);
  }, [ShowModel]);

  useEffect(() => {
    if (Data.item) {
      setId(Data.item.id);
      setInitialValues({
        name: Data.item.name,
        description: Data.item.description,
      });
      setckEditorData(Data.item.description);
    } else {
      setId(0);
      setckEditorData("");
      setInitialValues({
        name: "",
        description: "",
      });
    }
  }, [Data]);

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    setShow(!show);
    setId(0);
    setckEditorData("");
  };

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);
    if (values.name === "" || values.name.trim() === "") {
      errorObj.name = DOCUMENTTYPE;
      errorArr.push({ name: DOCUMENTTYPE });
    }

    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  async function saveDocumentType(fields, { setStatus, setSubmitting }) {
    let ckEditorDataFilter = ckEditorData
      .replaceAll("&nbsp;", "")
      .replaceAll(/\s/g, "")
      .replaceAll("<p></p>", "");
    if (fields.name === "") {
      fields.name.replace(/ /g, "");
    }
    let ckEditorDescription = !ckEditorDataFilter.length ? "" : ckEditorData;
    if (type == EDIT) {
      setLoading(true);
      documentTypeService
        .updateDocumentType(id, fields.name, ckEditorDescription)
        .then((res) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, res.message);
          setShow(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      documentTypeService
        .addDocumentTypes(fields.name, ckEditorDescription)
        .then((res) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, res.message);
          setShow(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    setSubmitting(false);
  }

  const handleEditorChange = (event) => {
    let ckEditorData = event.editor.getData();
    setckEditorData(ckEditorData);
  };

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string(),
        description: Yup.string(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveDocumentType}
    >
      {({
        errors,
        handleReset,
        handleSubmit,
        isSubmitting,
        setErrors,
        touched,
        setFieldValue,
        handleBlur,
        values,
      }) => (
        <>
          {loading ? <Loader></Loader> : null}
          <Modal
            centered
            isOpen={show}
            size="lg"
            toggle={() => {
              handleClose(values, false);
              handleReset();
            }}
          >
            <ModalHeader
              toggle={() => {
                handleClose(values, false);
                handleReset();
              }}
            >
              {type} {DOCUMENTTYPE}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="documentName"
                      column
                      sm={2}
                      className={
                        errors.name && touched.name
                          ? "is-invalid-label required-field fw-bold"
                          : "required-field"
                      }
                    >
                      {DOCUMENTTYPE}
                    </Label>

                    <Col sm={10}>
                      <Field
                        type="text"
                        //maxlength={250}
                        name="name"
                        value={values.name}
                        onChange={(e) => {
                          const val = (e.target.value || "").replace(
                            /\s+/gi,
                            " "
                          );
                          setFieldValue("name", val.trimLeft());
                          handleBlur(val);
                        }}
                        style={{ alignText: "right" }}
                        className={
                          "text form-control" +
                          (errors.name && touched.name ? " is-invalid" : "")
                        }
                      />
                      <InlineBottomErrorMessage name="name" />
                    </Col>
                  </FormGroup>
                </Row>
                <Row className="text-end">
                  <FormGroup row>
                    <Label sm={2}>{DESCRIPTION}</Label>
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
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="md"
                  className="modalsave btn btn-primary mr-2 "
                >
                  {type === ADD ? ADD : SAVE}
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
                  {type === ADD ? CLOSE : CANCLE}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default AddEditDocumnetType;
