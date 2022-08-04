import React, { Fragment, useEffect, useRef, useState } from "react";
import { ADD, CANCLE, EDIT } from "../../../../constant/FieldConstant";
import dapDacDeductionData from "../../../../services/Resident/dapDacDeduction.service";
import Select from "react-select";
import * as Yup from "yup";
import EopServices from "../../../../services/EndOfPeriod/EndOfPeriod.services";
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
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import { ErrorMessage, Field, Formik } from "formik";
import { CKEditor } from "ckeditor4-react";
import { CLOSE, SAVE } from "../../../../constant/MessageConstant";
import Loader from "../../../../components/Loader";
import ModalError from "../../../../components/ModalError";
import InlineBottomErrorMessage from "../../../../components/InlineBottomErrorMessage";
import MuiDatePicker from "../../../../components/DatePicker/MaterialUi";
import WarningAlert from "../../../../components/ModalWarning";

const AddEditDapDacDeduction = ({
  type,
  data,
  showModel,
  callBackAddEditFormToViewForm,
  oldRadId,
  admissionDate,
  UpdateCancelCallback,
  handleIsAdded1,
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
    deductionAmount: 0,
    isNegative: false,
    deductionDate: new Date().toJSON(),
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
        deductionAmount: data.deductionAmount,
        isNegative: data.isNegative,
        deductionDate: data.deductionDate ? data.deductionDate : "",
        comment: data.comment,
      });
      setSelectedCategory({
        id: data.deductionTypeId,
        label: data.deductionType,
      });
      setckEditorData(data.comment || "");
      setDeductionNewAmount(data.deductionAmount);
      setCreatedBy(data.createdBy);
      setUpdatedBy(data.modifiedBy);
    } else {
      setSelectedCategory(null);
      setInitialValues({
        id: 0,
        radId: 0,
        deductionTypeId: "",
        deductionAmount: 0,
        isNegative: false,
        deductionDate: new Date().toJSON(),
        comment: "",
      });
      setckEditorData("");
      setDeductionNewAmount(0);
    }
  }, [data]);

  useEffect(() => {
    dapDacDeductionData
      .getAllDropdownDeduction()
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

  useEffect(() => {
    if (typeList && typeList.length > 0 && type === ADD) {
      console.log("hii", typeList);
      setSelectedCategory(typeList[0]);
      setInitialValues({ ...initialValues, deductionTypeId: typeList[0].id });
    }
  }, [typeList, type, show]);

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
      setDeductionNewAmount(data.deductionAmount);
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
      errorObj.deductionAmount = "deductionAmount error";
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

    if (values.deductionDate === "" || values.deductionDate == null) {
      if (
        values.deductionDate === null ||
        values.deductionDate === "Invalid date"
      ) {
        errorObj.deductionDate = "Invalid date";
      } else {
        errorObj.deductionDate = "Charge / Payment Date date cannot be empty";
      }
      errorArr.push({ name: "Charge / Payment Date cannot be empty" });
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

  async function saveDeduction(fields, { setStatus, setSubmitting }) {
    setStatus();
    // if (
    //   deductionNewAmount <=
    //   parseFloat(radRacBalance)
    //     .toFixed(2)
    //     .toString()
    //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    // ) {

    const FacilityId = localStorage.getItem("FacilityId");
    EopServices.checkFinalisePeriod(FacilityId, fields.deductionDate).then(
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
                  deductionDate: fields.deductionDate,
                  ckEditorData,
                }
              : {
                  newRadId,
                  deductionTypeId: fields.deductionTypeId,
                  deductionNewAmount,
                  isNegative: fields.isNegative,
                  deductionDate: fields.deductionDate,
                  ckEditorData,
                }
          );
          setShowEopErrorPopup(!showEopErrorPopup);
        } else {
          if (type == EDIT) {
            setLoading(true);
            dapDacDeductionData
              .updateDeduction(
                fields.id,
                newRadId,
                fields.deductionTypeId,
                deductionNewAmount,
                fields.isNegative,
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
            dapDacDeductionData
              .createDeduction(
                newRadId,
                fields.deductionTypeId,
                deductionNewAmount,
                fields.isNegative,
                fields.deductionDate,
                ckEditorData
              )
              .then(
                (data) => {
                  setLoading(false);
                  callBackAddEditFormToViewForm(false, true, data.message);
                  setShow(false);
                  handleIsAdded1();
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
        dapDacDeductionData
          .updateDeduction(
            BeFoforeEopCheckData.id,
            BeFoforeEopCheckData.newRadId,
            BeFoforeEopCheckData.deductionTypeId,
            BeFoforeEopCheckData.deductionNewAmount,
            BeFoforeEopCheckData.isNegative,
            BeFoforeEopCheckData.deductionDate,
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
        dapDacDeductionData
          .createDeduction(
            BeFoforeEopCheckData.newRadId,
            BeFoforeEopCheckData.deductionTypeId,
            deductionNewAmount,
            BeFoforeEopCheckData.isNegative,
            BeFoforeEopCheckData.deductionDate,
            BeFoforeEopCheckData.ckEditorData
          )
          .then(
            (data) => {
              setLoading(false);
              callBackAddEditFormToViewForm(false, true, data.message);
              setShow(false);
              handleIsAdded1();
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
        deductionAmount: Yup.string(),
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
              {type} {"DAP / DAC Deduction"}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={"DAP/DAC Deduction"}
                ></ModalError>
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
                        // maxLength={
                        //   parseFloat(deductionNewAmount) == 0 ? 14 : 17
                        // }
                        name="deductionAmount"
                        id="deductionAmount"
                        style={{ alignText: "right" }}
                        value={deductionNewAmount ? deductionNewAmount : ""}
                        onBlur={handleBlur}
                        onValueChange={(values) => {
                          const { floatValue } = values;
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
                      <Select
                        name="deductionTypeId"
                        placeholder="Select...."
                        onBlur={(selected) =>
                          setFieldTouched("deductionTypeId", selected.id)
                        }
                        onChange={(selected) => {
                          console.log("selected", selected);
                          setFieldValue("deductionTypeId", selected.id);
                          setSelectedCategory(selected);
                        }}
                        className={errors.deductionTypeId ? "is-invalid " : " "}
                        options={typeList}
                        isOptionSelected={(x) => {
                          return selectedCategory &&
                            x.id === selectedCategory.id
                            ? x
                            : null;
                        }}
                        defaultValue={selectedCategory}
                        isDisabled
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
                      htmlFor="deductionDate "
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
export default AddEditDapDacDeduction;
