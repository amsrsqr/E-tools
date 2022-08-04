import React, { Fragment, useEffect, useRef, useState } from "react";
import Loader from "../../../components/Loader";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
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
  InputGroup,
} from "reactstrap";
import { ErrorMessage, Field, Formik } from "formik";
import { ADD, CANCLE, EDIT } from "../../../constant/FieldConstant";
import { CLOSE, SAVE } from "../../../constant/MessageConstant";
import ModalError from "../../../components/ModalError";
import { CKEditor } from "ckeditor4-react";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
import otherDedution from "../../../services/Resident/otherDeduction.service";
import BasicDailyFeesWarning from "../../../components/BasicDailyFeesWarning";
import MuiDatePicker from "../../../components/DatePicker/MaterialUi";
import "../../../css/style.css";
import EopServices from "../../../services/EndOfPeriod/EndOfPeriod.services";
import WarningAlert from "../../../components/ModalWarning";
import SingleSelect from "../../../components/MySelect/MySelect";

const AddEditOtherDeduction = ({
  showModel,
  callBackAddEditFormToViewForm,
  type,
  data,
  oldRadId,
  radRacBalance,
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
  const [fieldAlertWarning, setFieldAlertWarning] = useState(false);
  const [warningAlertOptions, setWarningAlertOptions] = useState({});
  const [showEopErrorPopup, setShowEopErrorPopup] = useState(false);
  const [BeFoforeCheckData, setBeFoforeCheckData] = useState({});
  const refCalendar = useRef();
  const [initialValues, setInitialValues] = useState({
    radId: 0,
    radDeductionTypeId: "",
    deductionAmount: 0,
    isnegativeAmount: false,
    deductionDate: new Date().toJSON(),
    comments: "",
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
        radDeductionTypeId: data.radDeductionTypeId
          ? data.radDeductionTypeId
          : 0,
        radDeductionType: data.radDeductionType,
        deductionAmount: data.deductionAmount,
        isnegativeAmount: data.isnegativeAmount,
        deductionDate: data.deductionDate ? data.deductionDate : "",
        comments: data.comments,
      });
      setSelectedCategory({
        id: data.radDeductionTypeId,
        label: data.radDeductionType,
      });
      setckEditorData(data.comments || "");
      setDeductionNewAmount(data.deductionAmount);
      setCreatedBy(data.createdBy);
      setUpdatedBy(data.modifiedBy);
    } else {
      setSelectedCategory(null);
      setInitialValues({
        id: 0,
        radId: 0,
        radDeductionTypeId: "",
        radDeductionType: "",
        deductionAmount: 0,
        isnegativeAmount: false,
        deductionDate: new Date().toJSON(),
        comments: "",
      });
      setckEditorData("");
      setDeductionNewAmount(0);
    }
  }, [data]);

  useEffect(() => {
    otherDedution
      .getAllDropdownDeductionType(false, false, true)
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
        id: data.radDeductionTypeId,
        label: data.radDeductionType,
      });
      setckEditorData(data.comments || "");
      setDeductionNewAmount(data.deductionAmount);
    } else {
      setSelectedCategory(null);
      setckEditorData("");
      setDeductionNewAmount(0);
    }
    setShow(!show);
  };

  const handleEditorChange = (event, func) => {
    let ckEditorData = event.editor.getData();
    func(ckEditorData);
  };
  const openDatePicker = () => {
    refCalendar.current.setOpen(true);
  };
  const validateForm = (values) => {
    let plainText = values.comments.replace(/<\/?[^>]+(>|$)/g, "");
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

    if (!deductionNewAmount) {
      errorObj.deductionAmount = "deductionAmount error";
      errorArr.push({ name: "deductionAmount error" });
    }

    if (values.isnegativeAmount === true) {
      if (plainText.trim() === "") {
        errorObj.name =
          "Please enter Comments as ‘Negative Amount’ is entered ";
        errorArr.push({
          name: "Please enter Comments as ‘Negative Amount’ is entered",
        });
      }
    }
    // if (values.deductionDate === "") {
    //   errorObj.deductionDate = "deduction date cannot be empty";
    //   errorArr.push({ name: "deduction date cannot be empty" });
    // }

    if (values.deductionDate === "" || values.deductionDate == null) {
      if (
        values.deductionDate === null ||
        values.deductionDate === "Invalid date"
      ) {
        errorObj.deductionDate = "Invalid date";
      } else {
        errorObj.deductionDate = "Required Field";
      }
      errorArr.push({ name: "deduction date cannot be empty" });
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

  const selectStyle = {
    control: (base, state) => ({
      ...base,
      // boxShadow: state.isFocused ? "0px 0px 0px 5px #c2dbfe !important" : 0,
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

  async function saveDeduction(fields, { setStatus, setSubmitting }) {
    setStatus();
    let additionOfAmount = deductionNewAmount + parseFloat(radRacBalance);
    if (
      (type === EDIT && deductionNewAmount <= additionOfAmount) ||
      (type === ADD && deductionNewAmount <= parseFloat(radRacBalance)) ||
      (parseFloat(radRacBalance) < 0 && deductionNewAmount < 0)
    ) {
      console.log("fields", fields);
      const FacilityId = localStorage.getItem("FacilityId");
      EopServices.checkFinalisePeriod(FacilityId, fields.deductionDate).then(
        (response) => {
          if (response && response.result) {
            setBeFoforeCheckData(
              type == EDIT
                ? {
                    id: fields.id,
                    newRadId,
                    radDeductionTypeId: fields.radDeductionTypeId,
                    deductionNewAmount,
                    isnegativeAmount: fields.isnegativeAmount,
                    deductionDate: fields.deductionDate,
                    ckEditorData,
                  }
                : {
                    newRadId,
                    radDeductionTypeId: fields.radDeductionTypeId,
                    deductionNewAmount,
                    isnegativeAmount: fields.isnegativeAmount,
                    deductionDate: fields.deductionDate,
                    ckEditorData,
                  }
            );
            setShowEopErrorPopup(!showEopErrorPopup);
          } else {
            if (type == EDIT) {
              setLoading(true);
              otherDedution
                .updateOtherDeduction(
                  fields.id,
                  newRadId,
                  fields.radDeductionTypeId,
                  deductionNewAmount,
                  fields.isnegativeAmount,
                  fields.deductionDate,
                  ckEditorData
                )
                .then(
                  (data) => {
                    setLoading(false);
                    callBackAddEditFormToViewForm(false, true, data.message);
                    setShow(false);
                  },
                  () => {
                    setLoading(false);
                  }
                );
              UpdateCancelCallback(fields.id);
            } else {
              setLoading(true);
              otherDedution
                .createOtherDeduction(
                  newRadId,
                  fields.radDeductionTypeId,
                  deductionNewAmount,
                  fields.isnegativeAmount,
                  fields.deductionDate,
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
    } else {
      setWarningAlertOptions({
        title: "Insufficient RAD / RAC Balance",
        msg: (
          <p className="text-center">
            This Resident does not have sufficient RAD / RAC Balance to proceed
            with the <br /> deduction.
            <br />
            Please confirm their current RAD Balance and try again.{" "}
          </p>
        ),
        callback: (value) => {
          setFieldAlertWarning(false);
        },
      });
      setFieldAlertWarning(true);
    }
    setSubmitting(false);
  }

  const onContinueEop = () => {
    setShowEopErrorPopup(!showEopErrorPopup);
    if (BeFoforeCheckData && Object.keys(BeFoforeCheckData).length > 0) {
      if (type == EDIT) {
        setLoading(true);
        otherDedution
          .updateOtherDeduction(
            BeFoforeCheckData.id,
            BeFoforeCheckData.newRadId,
            BeFoforeCheckData.radDeductionTypeId,
            BeFoforeCheckData.deductionNewAmount,
            BeFoforeCheckData.isnegativeAmount,
            BeFoforeCheckData.deductionDate,
            BeFoforeCheckData.ckEditorData
          )
          .then(
            (data) => {
              setLoading(false);
              callBackAddEditFormToViewForm(false, true, data.message);
              setShow(false);
              UpdateCancelCallback(BeFoforeCheckData.id);
            },
            () => {
              setLoading(false);
            }
          );
      } else {
        setLoading(true);
        otherDedution
          .createOtherDeduction(
            BeFoforeCheckData.newRadId,
            BeFoforeCheckData.radDeductionTypeId,
            deductionNewAmount,
            BeFoforeCheckData.isnegativeAmount,
            BeFoforeCheckData.deductionDate,
            BeFoforeCheckData.ckEditorData
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
        radDeductionTypeId: Yup.string().required(),
        deductionAmount: Yup.string(),
        comments: Yup.string().when("isnegativeAmount", {
          is: true,
          then: Yup.string().required(
            "Please enter Comments as ‘Negative Amount’ is entered. Please try again"
          ),
        }),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveDeduction}
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
              {type} {"Other Deduction"}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={"Other Deduction"}
                ></ModalError>
                {fieldAlertWarning && (
                  //     <WarningMessageModelAlert
                  //     msg={warningAlertOptions.msg}
                  //     showWarningAlert={showWarningAlert}
                  //     setShowWarningAlert={setShowWarningAlert}
                  //  />
                  <BasicDailyFeesWarning
                    title={warningAlertOptions.title}
                    msg={warningAlertOptions.msg}
                    fieldAlertWarning={fieldAlertWarning}
                    setFieldAlertWarning={setFieldAlertWarning}
                  />
                )}
                <Row className={"fieldstyle"}>
                  <FormGroup
                    row
                    className={
                      errors.deductionAmount && touched.deductionAmount
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
                        errors.deductionAmount &&
                        touched.deductionAmount &&
                        !deductionNewAmount
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      Deduction Amount
                    </Label>
                    <Col sm={5}>
                      <NumberFormat
                        // allowedDecimalSeparators={'.'}
                        thousandSeparator={true}
                        prefix={values.isnegativeAmount === true ? "-$" : "$"}
                        placeholder={
                          values.isnegativeAmount === true ? "-$0.00" : "$0.00"
                        }
                        allowNegative={false}
                        // maxLength={
                        //   type === "ADD"
                        //     ? deductionNewAmount === 0
                        //       ? 14
                        //       : 16
                        //     : deductionNewAmount === 0
                        //     ? 14
                        //     : 17
                        // }
                        // format="##########.##"
                        name="deductionAmount"
                        id="deductionAmount"
                        style={{ alignText: "right" }}
                        value={deductionNewAmount ? deductionNewAmount : ""}
                        onBlur={handleBlur}
                        onValueChange={(values) => {
                          const { value, floatValue } = values;
                          if (floatValue) {
                            console.log("floatValue before", floatValue);
                            console.log("value before", value);

                            // if (`${floatValue}`.length < 11) {
                            //   console.log('floatValue', floatValue);
                            //   setDeductionNewAmount(
                            //     `${floatValue}`.replace('.', '')
                            //   );
                            // } else {
                            setDeductionNewAmount(floatValue);
                            // }
                          } else {
                            setDeductionNewAmount(0);
                          }
                        }}
                        fixedDecimalScale={2}
                        decimalScale={2}
                        className={
                          "text form-control " +
                          (errors.deductionAmount &&
                          touched.deductionAmount &&
                          !deductionNewAmount
                            ? " is-invalid"
                            : "")
                        }
                      />
                      {!deductionNewAmount ? (
                        <InlineBottomErrorMessage
                          name="deductionAmount"
                          msg={"Required field & should be greater than 0"}
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
                      style={{ textAlign: "right" }}
                      htmlFor="radDeductionTypeId"
                      column
                      sm={3}
                      className={
                        errors.radDeductionTypeId &&
                        touched.radDeductionTypeId &&
                        !values.radDeductionTypeId
                          ? "is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      Type
                    </Label>
                    <Col sm={8}>
                      <SingleSelect
                        name="radDeductionTypeId"
                        placeholder="Select...."
                        onBlur={(selected) =>
                          setFieldTouched("radDeductionTypeId", selected.id)
                        }
                        onChange={(selected) => {
                          setFieldValue("radDeductionTypeId", selected.id);
                          setFieldValue("radDeductionType", selected.label);
                          setSelectedCategory(selected);
                        }}
                        error={
                          errors.radDeductionTypeId &&
                          touched.radDeductionTypeId && 
                          !values.radDeductionTypeId
                            ? true
                            : false
                        }
                        className={
                          errors.radDeductionTypeId ? "is-invalid " : " "
                        }
                        options={typeList}
                        value={selectedCategory}
                      />
                      {!values.radDeductionTypeId ? (
                        <InlineBottomErrorMessage name="radDeductionTypeId" />
                      ) : null}
                    </Col>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      column
                      style={{ textAlign: "right" }}
                      className={
                        errors.deductionDate && touched.deductionDate
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                      sm={3}
                    >
                      {"Deduction Date"}
                    </Label>
                    <Col sm={8}>
                      <InputGroup>
                        <MuiDatePicker
                          id="deductionDate"
                          name="deductionDate"
                          className={"text form-control"}
                          minDate={admissionDate}
                          selectedDate={
                            (values.deductionDate &&
                              new Date(values.deductionDate)) ||
                            null
                          }
                          // error={values.deductionDate === ""}
                          error={errors.deductionDate && touched.deductionDate}
                          getChangedDate={(val) => {
                            if (val) {
                              setFieldValue(
                                "deductionDate",

                                val.toJSON()
                              );
                            } else {
                              setFieldValue("deductionDate", "");
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
                      {errors.deductionDate && touched.deductionDate ? (
                        <InlineBottomErrorMessage msg={errors.deductionDate} />
                      ) : null}
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
                        errors.comments && touched.comments
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
                        id="comments"
                        name="comments"
                        initData={ckEditorData}
                        onChange={($event) => {
                          handleEditorChange($event, setckEditorData);
                          setFieldValue("comments", $event.editor.getData());
                        }}
                      />
                      {values.isnegativeAmount === true ? (
                        <ErrorMessage name="comments">
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
                            className="lastCreatedUpdatedLabelSize"
                            style={{
                              paddingTop: "7px",
                            }}
                          >
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
                            className="lastCreatedUpdatedLabelSize"
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
export default AddEditOtherDeduction;
