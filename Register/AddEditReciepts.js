import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
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
import { Formik, Form } from "formik";
import moment from "moment";
import {
  RADRACPAYMENTS,
  RADRACPAYMENTAMOUNT,
  RADRACPAYMENTTYPE,
  RADRACPAYMENTDATE,
  RADRACCOMMENTS,
  NEGITAIVEAMOUNT,
  EDIT,
} from "../../constant/FieldConstant";
import { RADCOMMENTVALIDATIONMSG } from "../../constant/MessageConstant";
import InlineBottomErrorMessage from "../../components/InlineBottomErrorMessage";
import Loader from "../../components/Loader";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../components/NumberFormat";
import { CKEditor } from "ckeditor4-react";
import radRacRecieptsservice from "../../services/Resident/radRacReciepts.service";
import EopServices from "../../services/EndOfPeriod/EndOfPeriod.services";
import "../../css/AddEditReciepts.css";
import MuiDatePicker from "../../components/DatePicker/MaterialUi";
import WarningAlert from "../../components/ModalWarning";
import SingleSelect from "../../components/MySelect/MySelect";

const AddEditReciepts = ({
  ShowModel,
  Data,
  type,
  handleModalClose,
  callBackAddEditFormToViewForm,
  actionType,
  agreedRadRacPortion,
  radRacPaidToDate,
  totalRadTopUp,
  totalDeductionFromRadRac,
  UpdateCancelCallback,
  handleIsAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0);
  const [ckEditorData, setckEditorData] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [BeFoforeCheckData, setBeFoforeCheckData] = useState({});
  const [errorArray, setErrorArray] = useState([]);
  const [paymentTypesList, setPaymentTypesList] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState();
  const [selectedType, setSelectedType] = useState(undefined);
  const [date, setDate] = useState(moment());

  const [isChecked, setIsChecked] = useState(false);
  const [warningAlertOptions, setWarningAlertOptions] = useState(undefined);
  const [initialValues, setInitialValues] = useState({
    paymentAmount: 0,
    isNegitive: false,
    paymentType: "",
    paymentDate: moment(),
    radRadComment: "",
  });

  // const [fieldAlertWarning, setFieldAlertWarning] = useState(false);
  const [createdBy, setCreatedBy] = useState(undefined);
  const [modifiedBy, setModifiedBy] = useState(undefined);
  const [PayAmount, setPayAmount] = useState(0);
  const [receiptTemplate, setReceiptTemplate] = useState(undefined);
  const ref = useRef();

  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    getRadRacTypesApi();
  }, []);

  useEffect(() => {
    if (ShowModel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [ShowModel]);

  useEffect(() => {
    if (actionType === "ADD") {
      const result = paymentTypesList[0];
      setSelectedPayment(result);
      setIsChecked(false);
      setSelectedType(0);
      if (result) ref.current.setFieldValue("paymentType", result.id);
    }
  }, [actionType, ShowModel]);

  useEffect(() => {
    console.log("Data", Data);

    if (Data && Object.keys(Data).length > 0) {
      setInitialValues({
        paymentAmount: Data.paymentAmount,
        isNegitive: Data.isNegative,
        paymentType: Data.typeId,
        paymentDate: Data.paymentDate,
        radRadComment: Data.comments,
      });
      setPayAmount(Data.paymentAmount);
      if (Data.isNegative === true) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
      setckEditorData(Data.comments);
      setSelectedType(Data.typeId);
      setCreatedBy(Data.createdBy);
      setModifiedBy(Data.modifiedBy);
      const result = paymentTypesList.filter((x) => x.id === Data.typeId);
      if (result && result.length > 0) {
        setSelectedPayment(result[0]);
      }
    }
  }, [Data]);

  const radId = localStorage.getItem("PaymentRadId");
  const FacilityId = localStorage.getItem("FacilityId");

  useEffect(() => {
    if (actionType === "ADD") {
      setIsChecked(false);
      // setSelectedType(0);
    }
  }, [actionType, ShowModel]);

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

  const getRadRacTypesApi = () => {
    console.log("radId", radId);
    radRacRecieptsservice
      .getRadRacPaymentTypes(radId)
      .then((response) => {
        console.log("getRadRacPaymentTypes response", response);
        const result = response.result.map((x, index) => {
          x.value = x.id;
          x.label = x.name;
          x.id = x.id;
          return x;
        });
        setPaymentTypesList(result);
      })
      .catch((error) => {
        console.log("getRadRacPaymentTypes error", error.result);
        setLoading(false);
      });
  };

  const editorConfiguration = {
    removePlugins:
      "specialCharacters,elementspath,blockquote,save,flash,iframe,pagebreak,templates,about,showblocks,newpage,language,print,div",
    extraPlugins: ["font", "justify"],
    removeButtons:
      "Undo,Redo,SpecialChar,HorizontalRule,PasteText,Scayt,Styles,HorizontalLine,Subscript,Superscript,Link,Cut,Copy,Unlink,Paste,Indent,Outdent,Format,Table,Image,Source,Anchor,PasteFromWord,Insert Special Character,Save,Print,Preview,Find,About,Maximize,ShowBlocks",
    height: 160,
    innerWidth: 200,
  };

  const handleEditorChange = (event) => {
    let ckEditorData = event.editor.getData();
    setckEditorData(ckEditorData);
  };

  const handleClose = () => {
    handleModalClose();
    setckEditorData("");
    if (type === EDIT) {
      setInitialValues({
        paymentAmount: Data.paymentAmount,
        isNegitive: Data.isNegative,
        paymentType: Data.typeId,
        paymentDate: Data.paymentDate,
        radRadComment: ckEditorData,
      });
      setPayAmount(Data.paymentAmount);
      setDate(Data.paymentDate);
    } else {
      setInitialValues({
        paymentAmount: 0,
        isNegitive: false,
        paymentType: 0,
        paymentDate: moment(),
        radRadComment: "",
      });
      setPayAmount(0);
      setDate(moment());
    }
  };

  const validateForm = (values) => {
    console.log("validateForm", values);
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);

    if (!PayAmount) {
      errorObj.paymentAmount = "Required field & should be greater than 0";
      errorArr.push({ name: "paymentAmount" });
    }

    if (
      (ckEditorData === "" || ckEditorData === undefined) &&
      isChecked === true
    ) {
      errorObj.radRadComment =
        "Please enter Comments as ‘Negative Amount’ is entered";
      errorArr.push({ name: "radRadComment" });
    }

    // if (!date === null || !values.paymentDate === null) {
    //   errorObj.paymentDate = "Required Field";
    //   errorArr.push({ name: "paymentDate" });
    // }

    if (date === "" || (date == null && values.paymentDate === null)) {
      errorObj.paymentDate = "Required Field";
      errorArr.push({ name: "paymentDate" });
    }

    console.log("errorArr", errorArr);

    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  const onWarningClicked = () => {
    setShowAlert(false);
  };

  const onWarningClicked2 = () => {
    console.log("CLicked two", receiptTemplate);
    setShowAlert(false);

    const radId = Number(localStorage.getItem("PaymentRadId"));
    EopServices.checkFinalisePeriod(
      FacilityId,
      moment(receiptTemplate.paymentDate).format("YYYY-MM-DD")
    ).then((response) => {
      if (response && response.result) {
        setBeFoforeCheckData({
          ...receiptTemplate,
          tmpType: Data.id ? "Edit" : "Add",
        });
        setShowErrorPopup(!showErrorPopup);
      } else {
        if (Data.id) {
          receiptTemplate.id = Data.id;
          editRadRacRecieptsApi(receiptTemplate);
        } else {
          addRadRacRecieptApi(receiptTemplate);
        }
      }
    });
  };

  const saveRecipt = (fields, { setStatus, setSubmitting }) => {
    console.log("saveRecipt....");
    const total =
      parseFloat(agreedRadRacPortion) -
      parseFloat(radRacPaidToDate) +
      parseFloat(totalDeductionFromRadRac) -
      parseFloat(totalRadTopUp);

    const radId = Number(localStorage.getItem("PaymentRadId"));
    let data = {
      radId: radId,
      type: fields.paymentType,
      paymentAmount: PayAmount,
      isNegative: isChecked,
      paymentDate: fields.paymentDate,
      comment: ckEditorData,
    };

    //if (total < 0) total = -total;
    if (PayAmount > total) {
      // setWarningAlertOptions({
      //   title: <p>Error - Payment exceeds Agreed RAD / RAC Portion</p>,
      //   msg: (
      //     <p className="text-center">
      //       This RAD / RAC Payment cannot be added because it exceeds the
      //       Resident’s Agreed RAD / RAC Portion.
      //       <br /> <br />
      //       Please update the Resident’s Payment Details if they have recently
      //       changed their Agreed RAD / RAC Portion, or select “RAD / RAC Top Up”
      //       if the user is topping up their RAD / RAC Balance.
      //     </p>
      //   ),
      // });
      setWarningAlertOptions({
        header: "RAD Payment",
        messageBody:
          "Please check your calculations to make sure that this is not an error and then proceed",
      });
      setShowAlert(true);
      setReceiptTemplate(data);
    } else {
      console.log("ELSE PART");
      EopServices.checkFinalisePeriod(
        FacilityId,
        moment(fields.paymentDate).format("YYYY-MM-DD")
      ).then((response) => {
        if (response && response.result) {
          setBeFoforeCheckData({ ...data, tmpType: Data.id ? "Edit" : "Add" });
          setShowErrorPopup(!showErrorPopup);
        } else {
          if (Data.id) {
            data.id = Data.id;
            editRadRacRecieptsApi(data);
          } else {
            addRadRacRecieptApi(data);
          }
        }
      });
    }
  };

  const addRadRacRecieptApi = (data) => {
    setLoading(true);
    radRacRecieptsservice
      .addRadRacReciept(data)
      .then((response) => {
        console.log("addRadRacReciept response", response);
        callBackAddEditFormToViewForm(false, true, response.message);
        handleModalClose();
        handleIsAdded();
        setLoading(false);
      })
      .catch((errors) => {
        console.log("addRadRacReciept error", errors.Message);
        setLoading(false);
        callBackAddEditFormToViewForm(false, false, errors.Message);
      });
  };

  const editRadRacRecieptsApi = (data) => {
    setLoading(true);
    radRacRecieptsservice
      .editRadRacReciept(data)
      .then((response) => {
        console.log("editRadRacReciepts response", response);
        callBackAddEditFormToViewForm(false, true, response.message);
        handleModalClose();
        UpdateCancelCallback(data.id);
        setLoading(false);
      })
      .catch((errors) => {
        console.log("editRadRacReciepts error", errors.Message);
        setLoading(false);
      });
  };

  const onContinueEop = () => {
    console.log("BeFoforeCheckData", BeFoforeCheckData);
    setShowErrorPopup(!showErrorPopup);
    if (BeFoforeCheckData && Object.keys(BeFoforeCheckData).length > 0) {
      const cpyData = { ...BeFoforeCheckData };
      if (cpyData.tmpType === "Edit") {
        delete BeFoforeCheckData.tmpType;
        BeFoforeCheckData.id = Data.id;
        editRadRacRecieptsApi(BeFoforeCheckData);
      } else {
        delete BeFoforeCheckData.tmpType;
        addRadRacRecieptApi(BeFoforeCheckData);
      }
    }
  };
  const onEopCancelClick = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const handleChecked = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          // paymentAmount: Yup.string().required(),
          paymentDate: Yup.string().required(),
        })}
        validate={validateForm}
        innerRef={ref}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={saveRecipt}
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
          <>
            {loading ? <Loader></Loader> : null}
            <Modal
              centered
              isOpen={ShowModel}
              size="lg"
              toggle={() => {
                handleClose(values, false);
                handleReset();
              }}
            >
              <WarningAlert
                isOpen={showErrorPopup}
                continueClicked={onContinueEop}
                cancelClicked={onEopCancelClick}
              ></WarningAlert>
              <ModalHeader
                toggle={() => {
                  handleClose(values, false);
                  handleReset();
                }}
              >
                {actionType === "ADD" ? "Add" : "Edit"} {RADRACPAYMENTS}
              </ModalHeader>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <ModalBody>
                  <div className="col-12" style={{ marginLeft: "3rem" }}>
                    <Row sm={12}>
                      <Col sm={6} style={{ marginLeft: "-31px" }}>
                        <FormGroup
                          row
                          className={
                            errors.paymentAmount &&
                            touched.paymentAmount &&
                            !PayAmount
                              ? "invaildPlaceholders"
                              : ""
                          }
                        >
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="paymentAmount"
                            column
                            sm={5}
                            className={
                              errors.paymentAmount &&
                              touched.paymentAmount &&
                              !PayAmount
                                ? "is-invalid-label required-field fw-bold"
                                : "required-field"
                            }
                          >
                            {RADRACPAYMENTAMOUNT}
                          </Label>
                          <Col sm={7}>
                            <NumberFormat
                              thousandSeparator={true}
                              prefix={isChecked ? "-$" : "$"}
                              // maxLength={
                              //   type === "ADD"
                              //     ? PayAmount === 0
                              //       ? 14
                              //       : 16
                              //     : PayAmount === 0
                              //     ? 14
                              //     : 17
                              // }
                              fixedDecimalScale={2}
                              allowNegative={false}
                              decimalScale={2}
                              name="paymentAmount"
                              value={PayAmount ? PayAmount : ""}
                              placeholder={isChecked ? "-$0.00" : "$0.00"}
                              onBlur={handleBlur}
                              onValueChange={(values) => {
                                const { floatValue } = values;
                                if (floatValue) {
                                  setPayAmount(floatValue);
                                } else {
                                  setPayAmount(0);
                                }
                              }}
                              style={{ alignText: "right" }}
                              className={
                                "text form-control " +
                                (errors.paymentAmount &&
                                touched.paymentAmount &&
                                !PayAmount
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col sm={6}>
                        <FormGroup row>
                          <Input
                            sm={2}
                            type="checkbox"
                            name="isNegitive"
                            checked={isChecked}
                            onChange={handleChecked}
                            style={{
                              width: "20px",
                              height: "25px",
                              marginTop: "4px",
                              marginLeft: "1rem",
                            }}
                          />
                          <Col sm={8}>
                            <Label htmlFor="isNegitive" column sm={10}>
                              {NEGITAIVEAMOUNT}
                            </Label>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Row
                        style={{
                          marginBottom: "12px",
                          marginLeft: "-5px",
                          marginTop: "-8px",
                        }}
                      >
                        <Col xs={2}></Col>
                        <Col xs={10}>
                          {!PayAmount ? (
                            actionType === EDIT ? (
                              <InlineBottomErrorMessage
                                // name="paymentAmount"
                                msg="Required field & should be greater than 0"
                              />
                            ) : (
                              <InlineBottomErrorMessage
                                name="paymentAmount"
                                msg="Required field & should be greater than 0"
                              />
                            )
                          ) : null}
                        </Col>
                      </Row>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="paymentType"
                            column
                            sm={2}
                            className={
                              errors.paymentType && touched.paymentType
                                ? "is-invalid-label required-field fw-bold"
                                : "required-field"
                            }
                          >
                            {RADRACPAYMENTTYPE}
                          </Label>
                          <Col sm={8}>
                            <SingleSelect
                              name="paymentType"
                              placeholder="Select...."
                              onBlur={(selected) =>
                                setFieldTouched("paymentType", selected.id)
                              }
                              onChange={(selected) => {
                                setFieldValue("paymentType", selected.id);
                                setSelectedPayment(selected);
                              }}
                              className={
                                errors.paymentType ? "is-invalid " : " "
                              }
                              options={paymentTypesList}
                              isOptionSelected={(x) => {
                                return selectedPayment &&
                                  x.id === selectedPayment.id
                                  ? x
                                  : null;
                              }}
                              value={selectedPayment}
                              // isSearchable={
                              //   paymentTypesList.length <= 6 ? false : true
                              // }
                              theme={reactSelectTheme(
                                errors.paymentType && touched.paymentType
                              )}
                              styles={selectStyle}
                            />
                            <InlineBottomErrorMessage name="paymentType" />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={12}>
                        <FormGroup row>
                          <Label
                            style={{
                              textAlign: "right",
                              pointerEvents: "none",
                            }}
                            column
                            sm={2}
                            className={
                              errors.paymentDate && touched.paymentDate && !date
                                ? " is-invalid-label required-field"
                                : "required-field"
                            }
                          >
                            {RADRACPAYMENTDATE}
                          </Label>
                          <Col sm={8}>
                            <MuiDatePicker
                              id="paymentDate"
                              name="paymentDate"
                              handleBlur={handleBlur}
                              doNotSetimmediateDate={true}
                              className={
                                "text form-control" +
                                (!date &&
                                errors.paymentDate &&
                                touched.paymentDate
                                  ? " is-invalid invalidDate"
                                  : "")
                              }
                              selectedDate={
                                (values.paymentDate &&
                                  new Date(values.paymentDate)) ||
                                undefined
                              }
                              //error={!date}
                              error={
                                errors.paymentDate &&
                                touched.paymentDate &&
                                !date
                              }
                              getChangedDate={(val) => {
                                // cheCkIsFinalied(val, setFieldValue);
                                setFieldValue("paymentDate", val);
                                setDate(val);
                              }}
                            />

                            {!date &&
                            errors.paymentDate &&
                            touched.paymentDate ? (
                              <InlineBottomErrorMessage msg="Required Field" />
                            ) : null}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={12}>
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="radRadComment"
                            column
                            sm={2}
                            className={
                              errors.radRadComment &&
                              touched.radRadComment &&
                              isChecked
                                ? "is-invalid-label required-field fw-bold"
                                : isChecked
                                ? " required-field "
                                : ""
                            }
                          >
                            {RADRACCOMMENTS}
                          </Label>
                          <Col sm={8}>
                            <CKEditor
                              config={editorConfiguration}
                              id="radRadComment"
                              name="radRadComment"
                              initData={ckEditorData}
                              onChange={handleEditorChange}
                            />
                            {isChecked && ckEditorData == "" ? (
                              <InlineBottomErrorMessage
                                name="radRadComment"
                                msg={RADCOMMENTVALIDATIONMSG}
                              />
                            ) : null}

                            {/* {values.isNegitive === true &&
                            ckEditorData == "" ? (
                              <ErrorMessage name="comments">
                                {(msg) => (
                                  <div style={{ color: "red" }}>{msg}</div>
                                )}
                              </ErrorMessage>
                            ) : (
                              ""
                            )} */}

                            {/* {isChecked && ckEditorData == "" ? (
                              <InlineBottomErrorMessage
                                // name="paymentAmount"
                                msg="Please enter Comments as ‘Negative Amount’ is entered"
                              />
                            ) : null} */}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div></div>
                </ModalBody>
                <ModalFooter>
                  {actionType === "EDIT" ? (
                    <>
                      <div
                        className=" col justify-content-start"
                        style={{ fontSize: "12px" }}
                      >
                        <Row>
                          <Label
                            sm={3}
                            htmlFor=""
                            style={{
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: "12px !important",
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
                              marginLeft: "5px",
                              fontSize: "12px !important",
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
                              {modifiedBy}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : null}
                  <Button
                    type="submit"
                    size="md"
                    className="modalsave btn btn-primary mr-2 btn btn-primary btn-md"
                  >
                    {actionType === "ADD" ? "Add" : "Save"}
                  </Button>
                  <Button
                    type="reset"
                    className="clsbtn btn btn-secondary btn btn-secondary"
                    size="md"
                    onClick={() => {
                      handleClose(values);
                      handleReset();
                    }}
                  >
                    {actionType === "ADD" ? "Close" : "Cancel"}
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
          </>
        )}
      </Formik>

      {/* {warningAlertOptions !== undefined && (
        <RacRacWarning
          title={warningAlertOptions.title}
          msg={warningAlertOptions.msg}
          fieldAlertWarning={fieldAlertWarning}
          setFieldAlertWarning={setFieldAlertWarning}
        />
      )} */}
      {showAlert && (
        <WarningAlert
          header={warningAlertOptions.header}
          messageBody={warningAlertOptions.messageBody}
          isOpen={showAlert}
          continueClicked={onWarningClicked2}
          cancelClicked={onWarningClicked}
        ></WarningAlert>
      )}
    </div>
  );
};

export default AddEditReciepts;
