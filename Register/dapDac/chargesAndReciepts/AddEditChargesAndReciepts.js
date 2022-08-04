import React, { Fragment, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
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
} from "reactstrap";
import { ErrorMessage, Field, Formik } from "formik";
import Loader from "../../../../components/Loader";
import ModalError from "../../../../components/ModalError";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import InlineBottomErrorMessage from "../../../../components/InlineBottomErrorMessage";
import { CKEditor } from "ckeditor4-react";
import { ADD, CANCLE, EDIT } from "../../../../constant/FieldConstant";
import { CLOSE, SAVE } from "../../../../constant/MessageConstant";
import getDrodownChargeAndReciepts from "../../../../services/Resident/dapDacRecieptsAndCharges.service";
import MuiDatePicker from "../../../../components/DatePicker/MaterialUi";
import EopServices from "../../../../services/EndOfPeriod/EndOfPeriod.services";
import WarningAlert from "../../../../components/ModalWarning";
import SingleSelect from "../../../../components/MySelect/MySelect";
const AddEditChargesAndReciepts = ({
  type,
  data,
  showModel,
  callBackAddEditFormToViewForm,
  oldRadId,
  admissionDate,
  UpdateCancelCallback,
  handleIsAdded,
}) => {
  const [show, setShow] = useState(showModel);
  const [typeList, setTypeList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [deductionNewAmount, setDeductionNewAmount] = useState(0);
  const [ckEditorData, setckEditorData] = useState("");
  const [lastUpdated, setUpdatedBy] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [newRadId, setNewRadId] = useState(null);
  const [showEopErrorPopup, setShowEopErrorPopup] = useState(false);
  const [BeFoforeEopCheckData, setBeFoforeEopCheckData] = useState({});
  const refCalendar = useRef();
  const [initialValues, setInitialValues] = useState({
    radId: 0,
    deductionTypeId: "",
    chargeAmount: 0,
    isNegative: false,
    chargeDate: new Date().toJSON(),
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
    setNewRadId(oldRadId);
  }, [oldRadId]);

  useEffect(() => {
    setShow(showModel);
  }, [showModel]);

  useEffect(() => {
    if (data.id) {
      setInitialValues({
        id: data.id ? data.id : 0,
        radId: newRadId,
        deductionTypeId: data.deductionTypeId ? data.deductionTypeId : 0,
        chargeAmount: data.chargeAmount,
        isNegative: data.isNegative,
        chargeDate: data.chargeDate ? data.chargeDate : "",
        comment: data.comment,
      });
      setSelectedCategory({
        id: data.deductionTypeId,
        label: data.deductionType,
      });
      setckEditorData(data.comment || "");
      setDeductionNewAmount(data.chargeAmount);
      setCreatedBy(data.createdBy);
      setUpdatedBy(data.modifiedBy);
    } else {
      setSelectedCategory(null);
      setInitialValues({
        id: 0,
        radId: 0,
        deductionTypeId: "",
        chargeAmount: 0,
        isNegative: false,
        chargeDate: new Date().toJSON(),
        comment: "",
      });
      setckEditorData("");
      setDeductionNewAmount(0);
    }
  }, [data]);

  useEffect(() => {
    getDrodownChargeAndReciepts
      .getAllDropdownChargesAndReciepts()
      .then((response) => {
        const result = response.result.map((x) => {
          x.label = x.name;
          x.value = x.id;
          return x;
        });
        setTypeList(result);
      })
      .catch(() => {});
  }, []);
  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    if (type === EDIT) {
      setSelectedCategory({
        id: data.deductionTypeId,
        label: data.deductionType,
      });
      setckEditorData(data.comment || "");
      setDeductionNewAmount(data.chargeAmount);
    } else {
      setSelectedCategory(null);
      setckEditorData("");
      setDeductionNewAmount(0);
    }
    setShow(!show);
  };
  const openDatePicker = () => {
    refCalendar.current.setOpen(true);
  };

  const validateForm = (values) => {
    let plainText = values.comment.replace(/<\/?[^>]+(>|$)/g, "");
    plainText = plainText.replace("/\n\n/g", "").replace(/\&nbsp;/g, "");
    plainText = plainText.replace(/<style([\s\S]*?)<\/style>/gi, "");
    plainText = plainText.replace(/<script([\s\S]*?)<\/script>/gi, "");
    plainText = plainText.replace(/<\/div>/gi, "\n");
    plainText = plainText.replace(/<\/li>/gi, "\n");
    plainText = plainText.replace(/<li>/gi, "  *  ");
    plainText = plainText.replace(/<\/ul>/gi, "\n");
    plainText = plainText.replace(/<\/p>/gi, "\n");
    plainText = plainText.replace(/<br\s*[\/]?>/gi, "\n");
    plainText = plainText.replace(/<[^>]+>/gi, "");

    var errorObj = {},
      errorArr = [];
    setErrorArray([]);

    if (deductionNewAmount == 0 || deductionNewAmount === " ") {
      errorObj.chargeAmount = "deductionAmount error";
      errorArr.push({ name: "deductionAmount error" });
    }

    if (values.isNegative === true) {
      if (plainText.trim() === "") {
        errorObj.name =
          "Please enter Comments as ‘Negative Amount’ is entered ";
        errorArr.push({
          name: "Please enter Comments as ‘Negative Amount’ is entered",
        });
      }
    }

    // if (values.chargeDate === "" || values.chargeDate === null) {
    //   if (values.chargeDate === null) {
    //     errorObj.chargeDate = "Invalid date";
    //   } else {
    //     errorObj.chargeDate = "Charge / Payment Date date cannot be empty";
    //   }
    //   errorArr.push({ name: "Charge / Payment Date cannot be empty" });
    // }

    if (
      values.chargeDate === "Invalid date" ||
      values.chargeDate === null ||
      values.chargeDate === ""
    ) {
      if (values.chargeDate === "Invalid date" || values.chargeDate === null) {
        errorObj.chargeDate = "Invalid date";
      } else {
        errorObj.chargeDate = "Required Field";
      }
      // errorObj.AdmissionDate = "Required Field";
      errorArr.push({ name: "chargeDate" });
    }

    console.log("values.chargeDate", values.chargeDate);
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

  const handleEditorChange = (event, func) => {
    let ckEditorData = event.editor.getData();
    func(ckEditorData);
  };
  const selectStyle = {
    control: (base, state) => ({
      ...base,
      //border: 1,
      // This line disable the blue border
      // boxShadow: state.isFocused ? "0px 0px 0px 5px #c2dbfe !important" : 0,
      //   '&:hover': {
      //     border: 0,
      //     boxShadow: "0px 0px 0px 5px #c2dbfe !important"
      //  },
    }),
  };
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

  async function saveChargeAndReciepts(fields, { setStatus, setSubmitting }) {
    setStatus();
    // if (
    //   deductionNewAmount <=
    //   parseFloat(radRacBalance)
    //     .toFixed(2)
    //     .toString()
    //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    // ) {

    const FacilityId = localStorage.getItem("FacilityId");
    EopServices.checkFinalisePeriod(FacilityId, fields.chargeDate).then(
      (response) => {
        if (response && response.result) {
          setBeFoforeEopCheckData(
            type == EDIT
              ? {
                  id: fields.id,
                  newRadId,
                  deductionTypeId: fields.deductionTypeId,
                  deductionNewAmount,
                  isNegative: fields.isNegative,
                  chargeDate: fields.chargeDate,
                  ckEditorData,
                }
              : {
                  newRadId,
                  deductionTypeId: fields.deductionTypeId,
                  deductionNewAmount,
                  isNegative: fields.isNegative,
                  chargeDate: fields.chargeDate,
                  ckEditorData,
                }
          );
          setShowEopErrorPopup(!showEopErrorPopup);
        } else {
          if (type == EDIT) {
            setLoading(true);
            getDrodownChargeAndReciepts
              .updateChargeAndReciepts(
                fields.id,
                newRadId,
                fields.deductionTypeId,
                deductionNewAmount,
                fields.isNegative,
                fields.chargeDate,
                ckEditorData
              )
              .then(
                (data) => {
                  setLoading(false);
                  callBackAddEditFormToViewForm(false, true, data.message);
                  setShow(false);
                  UpdateCancelCallback(fields.id);
                },
                () => {
                  setLoading(false);
                }
              );
          } else {
            setLoading(true);
            getDrodownChargeAndReciepts
              .createChargeAndReciepts(
                newRadId,
                fields.deductionTypeId,
                deductionNewAmount,
                fields.isNegative,
                fields.chargeDate,
                ckEditorData
              )
              .then(
                (data) => {
                  setLoading(false);
                  callBackAddEditFormToViewForm(false, true, data.message);
                  setShow(false);
                  handleIsAdded();
                },
                () => {
                  setLoading(false);
                }
              );
          }
        }
      }
    );
    // } else {
    //   setWarningAlertOptions({
    //     title: "Insufficient RAD / RAC Balance",
    //     msg: (
    //       <p className="text-center">
    //         This Resident does not sufficient RAD / RAC Balance to proceed with
    //         the <br /> deduction. <br /> <br />
    //         Please confirm their current RAD Balance and try again. <br />{" "}
    //         <br />
    //       </p>
    //     ),
    //     callback: (value) => {
    //       setFieldAlertWarning(false);
    //     },
    //   });
    //   setFieldAlertWarning(true);
    // }
    setSubmitting(false);
  }

  const onContinueEop = () => {
    setShowEopErrorPopup(!showEopErrorPopup);
    if (BeFoforeEopCheckData && Object.keys(BeFoforeEopCheckData).length > 0) {
      if (type == EDIT) {
        setLoading(true);
        getDrodownChargeAndReciepts
          .updateChargeAndReciepts(
            BeFoforeEopCheckData.id,
            BeFoforeEopCheckData.newRadId,
            BeFoforeEopCheckData.deductionTypeId,
            BeFoforeEopCheckData.deductionNewAmount,
            BeFoforeEopCheckData.isNegative,
            BeFoforeEopCheckData.chargeDate,
            BeFoforeEopCheckData.ckEditorData
          )
          .then(
            (data) => {
              setLoading(false);
              callBackAddEditFormToViewForm(false, true, data.message);
              setShow(false);
              UpdateCancelCallback(BeFoforeEopCheckData.id);
            },
            () => {
              setLoading(false);
            }
          );
      } else {
        setLoading(true);
        getDrodownChargeAndReciepts
          .createChargeAndReciepts(
            BeFoforeEopCheckData.newRadId,
            BeFoforeEopCheckData.deductionTypeId,
            BeFoforeEopCheckData.deductionNewAmount,
            BeFoforeEopCheckData.isNegative,
            BeFoforeEopCheckData.chargeDate,
            BeFoforeEopCheckData.ckEditorData
          )
          .then(
            (data) => {
              setLoading(false);
              callBackAddEditFormToViewForm(false, true, data.message);
              setShow(false);
              handleIsAdded();
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
        deductionTypeId: Yup.string().required(),
        chargeAmount: Yup.string(),
        chargeDate: Yup.string(),
        comment: Yup.string().when("isNegative", {
          is: true,
          then: Yup.string().required(
            "Please enter Comments as ‘Negative Amount’ is entered. Please try again"
          ),
        }),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveChargeAndReciepts}
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
              {type} {"DAP / DAC Charge or Payment"}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={"DAP/DAC Charge or Payment"}
                ></ModalError>
                <Row className={"fieldstyle"}>
                  <FormGroup
                    row
                    className={
                      errors.chargeAmount && touched.chargeAmount
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
                        errors.chargeAmount &&
                        touched.chargeAmount &&
                        !deductionNewAmount
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      Amount
                    </Label>
                    <Col sm={5}>
                      <NumberFormat
                        thousandSeparator={true}
                        prefix={values.isNegative === true ? "-$" : "$"}
                        placeholder={
                          values.isNegative === true ? "-$0.00" : "$0.00"
                        }
                        allowNegative={false}
                        name="chargeAmount"
                        id="chargeAmount"
                        // maxLength={
                        //   parseFloat(deductionNewAmount) == 0 ? 14 : 17
                        // }
                        style={{ alignText: "right" }}
                        value={deductionNewAmount ? deductionNewAmount : ""}
                        onBlur={handleBlur}
                        onValueChange={(values) => {
                          const { formattedValue, value, floatValue } = values;
                          if (floatValue) {
                            setDeductionNewAmount(floatValue);
                          } else {
                            setDeductionNewAmount(0);
                          }
                        }}
                        fixedDecimalScale={2}
                        decimalScale={2}
                        className={
                          "text form-control " +
                          (errors.chargeAmount &&
                          touched.chargeAmount &&
                          !deductionNewAmount
                            ? " is-invalid"
                            : "")
                        }
                      />
                      {!deductionNewAmount ? (
                        <InlineBottomErrorMessage
                          name="chargeAmount"
                          msg={"Required field & should be greater than 0"}
                        />
                      ) : null}
                    </Col>
                    {/* <Col className="d-flex col-4">
                      <Field
                        onChange={(val) => {
                          setFieldValue(
                            "isNegative",
                            val.currentTarget.checked
                          );
                        }}
                        type="checkbox"
                        className="isNegative mt-1"
                        name="isNegative"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Col>
                    <Col sm={3}  className="mt-2" >
                      <p>Negative Amount</p>
                    </Col> */}
                    <div className="d-flex col-4">
                      <div style={{ marginLeft: "20px" }}>
                        <Field
                          onChange={(val) => {
                            setFieldValue(
                              "isNegative",
                              val.currentTarget.checked
                            );
                          }}
                          type="checkbox"
                          className="isNegative mt-1"
                          name="isNegative"
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
                      style={{ textAlign: "right" }}
                      htmlFor="deductionTypeId"
                      column
                      sm={3}
                      className={
                        errors.deductionTypeId && touched.deductionTypeId
                          ? "is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      Type
                    </Label>
                    <Col sm={8}>
                      <SingleSelect
                        name="deductionTypeId"
                        placeholder="Select...."
                        onBlur={(selected) =>
                          setFieldTouched("deductionTypeId", selected.id)
                        }
                        onChange={(selected) => {
                          setFieldValue("deductionTypeId", selected.id);
                          setSelectedCategory(selected);
                        }}
                        error={
                          errors.deductionTypeId && touched.deductionTypeId
                            ? true
                            : false
                        } 
                        // className={errors.deductionTypeId ? "is-invalid " : " "}
                        options={typeList}
                        isOptionSelected={(x) => {
                          return selectedCategory &&
                            x.id === selectedCategory.id
                            ? x
                            : null;
                        }}
                        value={selectedCategory}
                        isSearchable={typeList.length <= 6 ? false : true}
                        theme={reactSelectTheme(
                          errors.deductionTypeId && touched.deductionTypeId
                        )}
                        styles={selectStyle}
                      />
                      <InlineBottomErrorMessage name="deductionTypeId" />
                    </Col>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      column
                      style={{ textAlign: "right" }}
                      className={
                        errors.chargeDate && touched.chargeDate
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                      sm={3}
                    >
                      {"Date"}
                    </Label>
                    <Col sm={8}>
                      <MuiDatePicker
                        id="chargeDate"
                        name="chargeDate"
                        className={"text form-control"}
                        minDate={admissionDate}
                        selectedDate={
                          (values.chargeDate && new Date(values.chargeDate)) ||
                          null
                        }
                        error={errors.chargeDate && touched.chargeDate}
                        getChangedDate={(val) => {
                          if (val) {
                            setFieldValue(
                              "chargeDate",

                              val.toJSON()
                            );
                          } else {
                            setFieldValue("chargeDate", "");
                          }
                        }}
                      />
                      {errors.chargeDate && touched.chargeDate ? (
                        <InlineBottomErrorMessage msg={errors.chargeDate} />
                      ) : (
                        ""
                      )}
                    </Col>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="comment"
                      column
                      sm={3}
                      className={
                        errors.comment && touched.comment
                          ? "is-invalid-label required-field fw-bold"
                          : values.isNegative
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
                      {values.isNegative === true ? (
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
                          htmlFor=""
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                          className="footerLabels"
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
                            {/* {createdBy} */}

                            {createdBy && createdBy.split("Created By")}
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
                          className="footerLabels"
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
export default AddEditChargesAndReciepts;
