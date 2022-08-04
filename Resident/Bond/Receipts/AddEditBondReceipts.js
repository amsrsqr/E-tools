import { ErrorMessage, Field, Formik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Col,
  Row,
  FormGroup,
  InputGroup,
} from "reactstrap";
import Loader from "../../../../components/Loader";
import {
  ADD,
  BONDRECEI,
  CANCLE,
  EDIT,
} from "../../../../constant/FieldConstant";
import * as Yup from "yup";
import ModalError from "../../../../components/ModalError";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import InlineBottomErrorMessage from "../../../../components/InlineBottomErrorMessage";
import MuiDatePicker from "../../../../components/DatePicker/MaterialUi";
import { CKEditor } from "ckeditor4-react";
import "../../../../css/AddEditReciepts.css";
import { CLOSE, SAVE } from "../../../../constant/MessageConstant";
import BondReceipts from "../../../../services/Resident/bondReceipts.service";
import EopServices from "../../../../services/EndOfPeriod/EndOfPeriod.services";
import WarningAlert from "../../../../components/ModalWarning";
const AddEditBondReceipts = ({
  showModel,
  callBackAddEditFormToViewForm,
  UpdateCancelCallback,
  type,
  data,
  oldBondId,
  admissionDate,
  handleCancelOnAdd,
}) => {
  const [show, setShow] = useState(showModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [newAmount, setNewAmount] = useState(0);
  const [ckEditorData, setckEditorData] = useState("");
  const [lastUpdated, setUpdatedBy] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [newBondId, setNewBondId] = useState(null);
  const [showEopErrorPopup, setShowEopErrorPopup] = useState(false);
  const [BeFoforeEopCheckData, setBeFoforeEopCheckData] = useState({});
  const [initialValues, setInitialValues] = useState({
    bondId: 0,
    bondPaymentAmount: 0,
    isnegativeAmount: false,
    bondPaymentDate: "",
    comment: "",
  });

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [show]);
  useEffect(() => {
    setNewBondId(oldBondId);
  }, [oldBondId]);

  useEffect(() => {
    setShow(showModel);
  }, [showModel]);

  useEffect(() => {
    if (data.id) {
      setInitialValues({
        id: data.id ? data.id : 0,
        bondId: newBondId,
        bondPaymentAmount: data.paymentAmount,
        isnegativeAmount: data.paymentAmount > 0 ? false : true,
        bondPaymentDate: data.paymentDate ? data.paymentDate : "",
        comment: data.comments,
      });
      setckEditorData(data.comments || "");
      setNewAmount(data.paymentAmount);
      setCreatedBy(data.createdBy);
      setUpdatedBy(data.modifiedBy);
    } else {
      setInitialValues({
        id: 0,
        bondId: 0,
        bondPaymentAmount: 0,
        isnegativeAmount: false,
        bondPaymentDate: new Date().toJSON(),
        comment: "",
      });
      setckEditorData("");
      setNewAmount(0);
    }
  }, [data]);

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    if (type === EDIT) {
      setckEditorData(data.comments || "");
      setNewAmount(data.paymentAmount);
    } else {
      setckEditorData("");
      setNewAmount(0);
    }
    setShow(!show);
  };

  const handleEditorChange = (event, func) => {
    let ckEditorData = event.editor.getData();
    func(ckEditorData);
  };
  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);

    if (!newAmount) {
      errorObj.bondPaymentAmount = "bondPaymentAmount error";
      errorArr.push({ name: "bondPaymentAmount error" });
    }
    if (values.bondPaymentDate === "") {
      errorObj.bondPaymentDate = "bond Payment Date cannot be empty";
      errorArr.push({ name: "bond Payment Date cannot be empty" });
    }
    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };
  const editorConfiguration = {
    removePlugins:
      "specialCharacters,elementspath,blockquote,save,flash,iframe,pagebreak,templates,about,showblocks,newpage,language,print,div",
    extraPlugins: ["font", "justify"],
    removeButtons:
      "Undo,Redo,SpecialChar,HorizontalRule,PasteText,Scayt,Styles,HorizontalLine,Subscript,Superscript,Link,Cut,Copy,Unlink,Paste,Indent,Outdent,Format,Table,Image,Source,Anchor,PasteFromWord,Insert Special Character,Save,Print,Preview,Find,About,Maximize,ShowBlocks",
    height: 100,
    innerWidth: 100,
  };

  async function saveReceipts(fields, { setStatus, setSubmitting }) {
    setStatus();
    const FacilityId = localStorage.getItem("FacilityId");
    EopServices.checkFinalisePeriod(FacilityId, fields.bondPaymentDate).then(
      (response) => {
        if (response && response.result) {
          setBeFoforeEopCheckData(
            type == EDIT
              ? {
                  id: fields.id,
                  newBondId,
                  newAmount,
                  bondPaymentDate: fields.bondPaymentDate,
                  ckEditorData,
                }
              : {
                  newBondId,
                  newAmount,
                  bondPaymentDate: fields.bondPaymentDate,
                  ckEditorData,
                }
          );
          setShowEopErrorPopup(!showEopErrorPopup);
        } else {
          if (type == EDIT) {
            setLoading(true);
            BondReceipts.updateReceipts(
              fields.id,
              newBondId,
              newAmount,
              fields.bondPaymentDate,
              ckEditorData
            ).then(
              (data) => {
                setLoading(false);
                callBackAddEditFormToViewForm(false, true, data.message);
                UpdateCancelCallback(fields.id);
                setShow(false);
              },
              () => {
                setLoading(false);
              }
            );
          } else {
            setLoading(true);
            BondReceipts.createReciepts(
              newBondId,
              newAmount,
              fields.bondPaymentDate,
              ckEditorData
            ).then(
              (data) => {
                setLoading(false);
                callBackAddEditFormToViewForm(false, true, data.message);
                handleCancelOnAdd({
                  screen: "reciepts",
                  tab: "listBondReceipt",
                  data: [],
                });
                setShow(false);
              },
              () => {
                setLoading(false);
              }
            );
          }
        }
      }
    );
    setSubmitting(false);
  }

  const onContinueEop = () => {
    setShowEopErrorPopup(!showEopErrorPopup);
    if (BeFoforeEopCheckData && Object.keys(BeFoforeEopCheckData).length > 0) {
      if (type == EDIT) {
        setLoading(true);
        BondReceipts.updateReceipts(
          BeFoforeEopCheckData.id,
          BeFoforeEopCheckData.newBondId,
          BeFoforeEopCheckData.newAmount,
          BeFoforeEopCheckData.bondPaymentDate,
          BeFoforeEopCheckData.ckEditorData
        ).then(
          (data) => {
            setLoading(false);
            callBackAddEditFormToViewForm(false, true, data.message);
            UpdateCancelCallback(BeFoforeEopCheckData.id);
            setShow(false);
          },
          () => {
            setLoading(false);
          }
        );
      } else {
        setLoading(true);
        BondReceipts.createReciepts(
          BeFoforeEopCheckData.newBondId,
          BeFoforeEopCheckData.newAmount,
          BeFoforeEopCheckData.bondPaymentDate,
          BeFoforeEopCheckData.ckEditorData
        ).then(
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
  };
  const onEopCancelClick = () => {
    setShowEopErrorPopup(!showEopErrorPopup);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        bondPaymentAmount: Yup.string(),
        comment: Yup.string().when("isnegativeAmount", {
          is: true,
          then: Yup.string().required(
            "Please enter Comments as ‘Negative Amount’ is entered. Please try again"
          ),
        }),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveReceipts}
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
        setFieldTouched,
      }) => (
        <Fragment>
          {loading ? <Loader></Loader> : null}
          <Modal
            isOpen={show}
            centered
            toggle={() => {
              handleClose(values);
              handleReset();
            }}
            size="lg"
          >
            <WarningAlert
              isOpen={showEopErrorPopup}
              continueClicked={onContinueEop}
              cancelClicked={onEopCancelClick}
            ></WarningAlert>
            <ModalHeader
              toggle={() => {
                handleClose(values);
                handleReset();
              }}
            >
              {type} {"Bond Payment"}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={BONDRECEI}
                ></ModalError>
                <Row className={"fieldstyle"}>
                  <FormGroup
                    row
                    className={
                      errors.bondPaymentAmount && touched.bondPaymentAmount
                        ? "invaildPlaceholders"
                        : ""
                    }
                  >
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="name"
                      column
                      sm={3}
                      className={
                        errors.bondPaymentAmount &&
                        touched.bondPaymentAmount &&
                        !newAmount
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      Bond Payment Amount
                    </Label>
                    <Col sm={5}>
                      <NumberFormat
                        thousandSeparator={true}
                        prefix={values.isnegativeAmount === true ? "-$" : "$"}
                        placeholder={
                          values.isnegativeAmount === true ? "-$0.00" : "$0.00"
                        }
                        allowNegative={false}
                        // maxLength={
                        //   type === "ADD"
                        //     ? newAmount === 0
                        //       ? 14
                        //       : 16
                        //     : newAmount === 0
                        //     ? 14
                        //     : 17
                        // }
                        name="bondPaymentAmount"
                        id="bondPaymentAmount"
                        style={{ alignText: "right" }}
                        value={newAmount ? newAmount : ""}
                        onBlur={handleBlur}
                        onValueChange={(values) => {
                          const { floatValue } = values;
                          if (floatValue) {
                            setNewAmount(floatValue);
                          } else {
                            setNewAmount(0);
                          }
                        }}
                        fixedDecimalScale={2}
                        decimalScale={2}
                        className={
                          "text form-control " +
                          (errors.bondPaymentAmount &&
                          touched.bondPaymentAmount &&
                          !newAmount
                            ? " is-invalid"
                            : "")
                        }
                      />
                      {!newAmount ? (
                        <InlineBottomErrorMessage
                          name="bondPaymentAmount"
                          msg={"Required Field & should be greater than 0"}
                        />
                      ) : null}
                    </Col>
                    <div className="d-flex col-4">
                      <div style={{ marginLeft: "20px" }}>
                        <Field
                          onChange={(val) => {
                            setFieldValue(
                              "isnegativeAmount",
                              val.currentTarget.checked
                            );
                          }}
                          type="checkbox"
                          className="isnegativeAmount mt-1"
                          name="isnegativeAmount"
                          style={{ width: "20px", height: "20px" }}
                        />
                      </div>
                      <div className="mt-1" style={{ marginLeft: "10px" }}>
                        <p>Negative Amount</p>
                      </div>
                    </div>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      column
                      style={{ textAlign: "right" }}
                      className={
                        errors.bondPaymentDate && touched.bondPaymentDate
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                      sm={3}
                    >
                      Bond Payment Date
                    </Label>
                    <Col sm={8}>
                      <InputGroup>
                        <MuiDatePicker
                          id="bondPaymentDate"
                          name="bondPaymentDate"
                          className={"text form-control"}
                          minDate={admissionDate}
                          selectedDate={
                            (values.bondPaymentDate &&
                              new Date(values.bondPaymentDate)) ||
                            null
                          }
                          error={
                            touched.bondPaymentDate && errors.bondPaymentDate
                          }
                          getChangedDate={(val) => {
                            if (val) {
                              setFieldValue(
                                "bondPaymentDate",

                                val.toJSON()
                              );
                            } else {
                              setFieldValue("bondPaymentDate", "");
                            }
                          }}
                        />
                      </InputGroup>
                      <div
                        style={{
                          color: "#dc3545",
                          fontSize: ".875em",
                        }}
                      ></div>
                      <InlineBottomErrorMessage name="bondPaymentDate" />
                    </Col>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="typeId"
                      column
                      sm={3}
                      className={
                        errors.comment && touched.comment
                          ? "is-invalid-label required-field fw-bold"
                          : values.isnegativeAmount
                          ? " required-field "
                          : ""
                      }
                    >
                      Comment
                    </Label>
                    <Col sm={8}>
                      <CKEditor
                        config={editorConfiguration}
                        id="comment"
                        name="comment"
                        initData={ckEditorData}
                        onChange={($event) => {
                          handleEditorChange($event, setckEditorData);
                          setFieldValue("comment", $event.editor.getData());
                        }}
                      />
                      {values.isnegativeAmount ? (
                        <ErrorMessage name="comment">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      ) : (
                        ""
                      )}
                    </Col>
                  </FormGroup>
                </Row>
              </ModalBody>
              <ModalFooter>
                {type == EDIT ? (
                  <>
                    <div className=" col justify-content-start">
                      <Row>
                        <Label
                          sm={3}
                          className="footerLabels"
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        >
                          First Created By
                        </Label>
                        <Col sm={4}>
                          <div
                            style={{
                              paddingTop: "7px",
                            }}
                            className="lastCreatedUpdatedLabelSize"
                          >
                            {createdBy && createdBy.split("Created By")}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Label
                          sm={3}
                          className="footerLabels"
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        >
                          Last Modified By
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
                  size="md"
                  className="modalsave btn btn-primary mr-2"
                >
                  {type === ADD ? ADD : SAVE}
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
                  {type === ADD ? CLOSE : CANCLE}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </Fragment>
      )}
    </Formik>
  );
};
export default AddEditBondReceipts;
