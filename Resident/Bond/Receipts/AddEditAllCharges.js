import { ErrorMessage, Field, Formik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import Loader from "../../../../components/Loader";
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
import * as Yup from "yup";
import {
  ADD,
  BONDHISTORY,
  CANCLE,
  EDIT,
} from "../../../../constant/FieldConstant";
import { CLOSE, SAVE } from "../../../../constant/MessageConstant";
import ModalError from "../../../../components/ModalError";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import InlineBottomErrorMessage from "../../../../components/InlineBottomErrorMessage";
import MuiDatePicker from "../../../../components/DatePicker/MaterialUi";
import { CKEditor } from "ckeditor4-react";
import Select from "react-select";
import "../../../../css/AddEditReciepts.css";
import allCharges from "../../../../services/Resident/allCharges.service";
import EopServices from "../../../../services/EndOfPeriod/EndOfPeriod.services";
import { removeEmptySpaces } from "../../../../utils/Strings";
import WarningAlert from "../../../../components/ModalWarning";

const AddEditAllCharges = ({
  showModel,
  callBackAddEditFormToViewForm,
  type,
  data,
  BondId,
  retentionAmount,
  handleCancelOnAdd1,
  UpdateCancelCallback,
}) => {
  const [show, setShow] = useState(showModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [newAmount, setNewAmount] = useState(0);
  const [ckEditorData, setckEditorData] = useState("");
  const [lastUpdated, setUpdatedBy] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [typeList, setTypeList] = useState([]);
  const [showEopErrorPopup, setShowEopErrorPopup] = useState(false);
  const [BeFoforeEopCheckData, setBeFoforeEopCheckData] = useState({});
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const [initialValues, setInitialValues] = useState({
    bondId: 0,
    paymentTypeId: 0,
    paymentAmount: 0,
    transactionCount: 1,
    isnegativeAmount: false,
    paymentDate: "",
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
    setShow(showModel);
  }, [showModel]);

  useEffect(() => {
    if (data.id) {
      setInitialValues({
        id: data.id ? data.id : 0,
        bondId: BondId,
        paymentTypeId: data.paymentTypeId ? data.paymentTypeId : 0,
        paymentAmount: data.paymentAmount,
        transactionCount: data.transactionCount ? data.transactionCount : 1,
        isnegativeAmount: data.paymentAmount > 0 ? false : true,
        paymentDate: data.paymentDate ? data.paymentDate : "",
        comment: data.comments,
      });
      setSelectedCategory({
        id: data.paymentTypeId,
        label: data.paymentType,
      });
      setckEditorData(data.comments || "");
      setNewAmount(data.paymentAmount);
      setCreatedBy(data.createdBy);
      setUpdatedBy(data.modifiedBy);
    } else {
      setSelectedCategory(null);
      setInitialValues({
        id: 0,
        bondId: BondId,
        paymentTypeId: 0,
        paymentAmount: 0,
        transactionCount: 1,
        isnegativeAmount: false,
        paymentDate: new Date().toJSON(),
        comment: "",
      });
      setckEditorData("");
      setNewAmount(0);
    }
  }, [data]);

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  useEffect(() => {
    allCharges
      .getDeductionType()
      .then((response) => {
        const result1 = response.filter((val) => val.deductionTypeId == 5);
        const result = result1.map((x) => {
          x.label = x.bondDeductionType;
          x.value = x.id;
          return x;
        });
        setTypeList(result);
      })
      .catch(() => {});
  }, []);

  const handleClose = () => {
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

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);

    if (!newAmount) {
      errorObj.paymentAmount = "Bond Deduction Amount error";
      errorArr.push({ name: "Bond Deduction Amount error" });
    }
    if (!values.paymentTypeId) {
      errorObj.paymentTypeId = "Deduction type cannot be empty";
      errorArr.push({ name: "Deduction type" });
    }
    if (values.paymentDate === "") {
      errorObj.paymentDate = "Bond Deduction Date cannot be empty";
      errorArr.push({ name: "Bond Deduction Date cannot be empty" });
    }
    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  const handleEditorChange = (event, func) => {
    let ckEditorData = event.editor.getData();
    func(ckEditorData);
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

  async function saveBondDecutionAllCharges(
    fields,
    { setStatus, setSubmitting }
  ) {
    setStatus();

    const FacilityId = localStorage.getItem("FacilityId");
    EopServices.checkFinalisePeriod(FacilityId, fields.paymentDate).then(
      (response) => {
        if (response && response.result) {
          setBeFoforeEopCheckData(
            type == EDIT
              ? {
                  id: fields.id,
                  BondId,
                  paymentTypeId: fields.paymentTypeId,
                  transactionCount: fields.transactionCount,
                  newAmount,
                  paymentDate: fields.paymentDate,
                  ckEditorData,
                }
              : {
                  BondId,
                  paymentTypeId: fields.paymentTypeId,
                  transactionCount: fields.transactionCount,
                  newAmount,
                  paymentDate: fields.paymentDate,
                  ckEditorData,
                }
          );
          setShowEopErrorPopup(!showEopErrorPopup);
        } else {
          if (type == EDIT) {
            setLoading(true);
            allCharges
              .updateAllCharges(
                fields.id,
                BondId,
                fields.paymentTypeId,
                fields.transactionCount,
                newAmount,
                fields.paymentDate,
                ckEditorData
              )
              .then(
                (data) => {
                  setLoading(false);
                  callBackAddEditFormToViewForm(false, true, data.message);
                  console.log("fields.id", fields.id);
                  UpdateCancelCallback(fields.id);
                  setShow(false);
                },
                () => {
                  setLoading(false);
                }
              );
          } else {
            setLoading(true);
            allCharges
              .createAllCharges(
                BondId,
                fields.paymentTypeId,
                fields.transactionCount,
                newAmount,
                fields.paymentDate,
                ckEditorData
              )
              .then(
                (data) => {
                  setLoading(false);
                  callBackAddEditFormToViewForm(false, true, data.message);
                  handleCancelOnAdd1({
                    screen: "reciepts",
                    tab: "listAllChargesReceipt",
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
        allCharges
          .updateAllCharges(
            BeFoforeEopCheckData.id,
            BeFoforeEopCheckData.BondId,
            BeFoforeEopCheckData.paymentTypeId,
            BeFoforeEopCheckData.transactionCount,
            BeFoforeEopCheckData.newAmount,
            BeFoforeEopCheckData.paymentDate,
            BeFoforeEopCheckData.ckEditorData
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
      } else {
        setLoading(true);
        allCharges
          .createAllCharges(
            BeFoforeEopCheckData.BondId,
            BeFoforeEopCheckData.paymentTypeId,
            BeFoforeEopCheckData.transactionCount,
            BeFoforeEopCheckData.newAmount,
            BeFoforeEopCheckData.paymentDate,
            BeFoforeEopCheckData.ckEditorData
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
        paymentTypeId: Yup.string().required(
          "Bond deduction type cannot be empty"
        ),
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
      onSubmit={saveBondDecutionAllCharges}
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
              {type} {"Charge Payments"}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={BONDHISTORY}
                ></ModalError>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="paymentTypeId"
                      column
                      sm={3}
                      className={
                        errors.paymentTypeId && touched.paymentTypeId
                          ? "is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      Payment Type
                    </Label>
                    <Col sm={8}>
                      <Select
                        name="paymentTypeId"
                        placeholder="Select...."
                        onBlur={(selected) =>
                          setFieldTouched("paymentTypeId", selected.id)
                        }
                        onChange={(selected) => {
                          setFieldValue("paymentTypeId", selected.id);
                          setSelectedCategory({
                            id: selected.id,
                            label: selected.label,
                          });
                          if (selected.label === "Retention Charge") {
                            setNewAmount(retentionAmount);
                          } else {
                            setNewAmount("");
                          }
                        }}
                        className={
                          errors.paymentTypeId
                            ? "is-invalid fontsize-14"
                            : "fontsize-14"
                        }
                        options={typeList}
                        isOptionSelected={(x) => {
                          return selectedCategory &&
                            x.id === selectedCategory.id
                            ? x
                            : null;
                        }}
                        defaultValue={selectedCategory}
                        theme={reactSelectTheme(
                          errors.paymentTypeId && touched.paymentTypeId
                        )}
                        styles={selectStyle}
                        isSearchable={typeList.length < 5 ? false : true}
                      />
                      <InlineBottomErrorMessage name="paymentTypeId" />
                    </Col>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup
                    row
                    className={
                      errors.paymentAmount && touched.paymentAmount
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
                        errors.paymentAmount &&
                        touched.paymentAmount &&
                        !newAmount
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      Payment Amount
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
                        name="paymentAmount"
                        id="paymentAmount"
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
                          (errors.paymentAmount &&
                          touched.paymentAmount &&
                          !newAmount
                            ? " is-invalid"
                            : "")
                        }
                        disabled={
                          selectedCategory?.label === "Retention Charge"
                            ? true
                            : false
                        }
                      />
                      {!newAmount ? (
                        <InlineBottomErrorMessage
                          name="paymentAmount"
                          msg={"Required Field & should be greater than 0"}
                        />
                      ) : null}
                    </Col>
                    <div className="d-flex col-3">
                      {selectedCategory?.label === "Retention Charge" ? (
                        <Field
                          type="number"
                          //maxlength={250}
                          name="transactionCount"
                          value={values.transactionCount}
                          defaultValue={1}
                          onChange={(ev) => {
                            if (ev.target.value > 0) {
                              setFieldValue(
                                "transactionCount",
                                removeEmptySpaces(ev.target.value)
                              );
                              setNewAmount(
                                retentionAmount *
                                  removeEmptySpaces(ev.target.value)
                              );
                            } else {
                              setFieldValue("transactionCount", "");
                            }
                          }}
                          onKeyDown={blockInvalidChar}
                          className={
                            "text form-control" +
                            (errors.transactionCount && touched.transactionCount
                              ? " is-invalid"
                              : "")
                          }
                        />
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      column
                      style={{ textAlign: "right" }}
                      className={
                        errors.paymentDate && touched.paymentDate
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                      sm={3}
                    >
                      Payment Date
                    </Label>
                    <Col sm={8}>
                      <InputGroup>
                        <MuiDatePicker
                          id="paymentDate"
                          name="paymentDate"
                          className={"text form-control"}
                          //minDate={admissionDate}
                          selectedDate={
                            (values.paymentDate &&
                              new Date(values.paymentDate)) ||
                            null
                          }
                          error={touched.paymentDate && errors.paymentDate}
                          getChangedDate={(val) => {
                            if (val) {
                              setFieldValue(
                                "paymentDate",

                                val.toJSON()
                              );
                            } else {
                              setFieldValue("paymentDate", "");
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
                      <InlineBottomErrorMessage name="paymentDate" />
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
                          ? "required-field "
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
                      ) : null}
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
                            fontSize: "12px !important",
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
                            fontSize: "12px !important",
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
export default AddEditAllCharges;
