import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../components/Loader";
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
  Form,
  InputGroup,
  Input,
} from "reactstrap";
import {
  ADD,
  CANCLE,
  COMMENT,
  DAILYEQUIVALENT,
  EDIT,
  EFFECTIVEDATE,
  LUMPSUMEQUIVALENTPAYMNT,
  MPIR,
  OVERRIDEMPIR,
  PAYMENTDETAILS,
  PAYMENTMETHOD,
  PAYMENTPRICE,
  RECOVERYMETHOD,
  SUPPORTEDCATEGORY,
} from "../../constant/FieldConstant";
import { CKEditor } from "ckeditor4-react";

import { CLOSE, SAVE } from "../../constant/MessageConstant";
import InlineBottomErrorMessage from "../../components/InlineBottomErrorMessage";
import commonServices from "../../services/Common/common.services";
import paymentService from "../../services/Resident/payment.service";
import ModalError from "../../components/ModalError";
import MuiDatePicker from "./../../components/DatePicker/MaterialUi";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../components/NumberFormat";
import SingleSelect from "../../components/MySelect/MySelect";

const AddPaymentDetails = ({
  ShowModel,
  ParentCallBackToView,
  type,
  Data,
  residentId,
  admissionDate,
  handleIsAdded,
}) => {
  const [currentMpir, setCurrentMpir] = useState(0);

  const getInitialValues = () => {
    return {
      effectiveDate: new Date(admissionDate),
      mpir: currentMpir,
      lumsumEquivalent: "",
      dailyEquivalent: "",
      supportedCategoryId: "",
      paymentMethodId: "",
      isOverrideMPIR: false,
      changedMpir: "",
      radPortion: "",
      dapPortion: "",
      recoveryMethodId: "",
      isDrowdownDap: false,
      isLumSumEq: true,
    };
  };
  const [show, setShow] = useState(ShowModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supportedCategory, setSupportedCategory] = useState([]);
  const [selectedSupportedCategory, setSelectedSupportedCategory] = useState(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [ckEditorData, setckEditorData] = useState("");
  const ref = useRef();
  const [initialValues, setInitialValues] = useState(getInitialValues());
  const [recoveryList, setRecoveryList] = useState([]);
  const [selectedRecovery, setSelectedRecovery] = useState({});
  const [showMPIRError, setShowMPIRError] = useState(false);
  const [mpirErrorMsg, setMpirErrorMsg] = useState("");
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
    setCurrentMpir(paymentService.getMpir());
    getNewMpir();
  }, []);

  const handleChangeDate = (date) => {
    ref.current.setFieldValue("effectiveDate", date);
    getNewMpir(date);
  };

  const getNewMpir = (date) => {
    console.log("date", convertDate(date));

    // moment(date).format("MM/DD/YYYY");

    commonServices
      .getMPIR(date ? date.toJSON() : new Date().toJSON())
      .then((response) => {
        console.log("MPIR===>", response.result.feePost);
        setCurrentMpir(response && response.result.feePost);
        ref &&
          ref.current &&
          ref.current.setFieldValue(
            "mpir",
            response && response.result.feePost
          );
      });
  };

  useEffect(() => {
    getSupportedCategory();
    getRecoveryMethods(3);
    // getPaymentMethod();
  }, []);

  const getRecoveryMethods = (participantId) => {
    commonServices.getPaymentMethod(participantId).then((response) => {
      if (response.length) {
        response.forEach((x) => {
          x.label = x.name;
          x.value = x.id;
        });
        setSelectedRecovery(response[0]);
        ref &&
          ref.current &&
          ref.current.setFieldValue("recoveryMethodId", response[0].id);
      }
      setRecoveryList(response);
    });
  };

  const getSupportedCategory = () => {
    setLoading(true);
    commonServices.getSupportedCategory().then((response) => {
      setLoading(false);
      response.map((x) => {
        x.value = x.supported_category_id;
        x.label = x.supported_category_name;
      });
      setSupportedCategory(response);
    });
  };
  const getPaymentMethod = (supportedCatId) => {
    setLoading(true);
    commonServices.getPaymentMethod(supportedCatId).then((response) => {
      setLoading(false);
      response.map((x) => {
        x.label = x.name;
        x.value = x.id;
      });
      ref.current.setFieldValue("paymentMethodId", "");
      setSelectedPaymentMethod(null);
      setPaymentMethod(response);
    });
  };

  useEffect(() => {
    if (type == EDIT) {
      let selectedSupportedCateg = supportedCategory.filter(
        (x) => x.supported_category_id === x.supportedCategoryId
      );
      setSelectedSupportedCategory(
        selectedSupportedCateg ? selectedSupportedCateg[0] : {}
      );

      let selectedPaymentMethod = paymentMethod.filter(
        (x) => x.id === x.paymentMethodId
      );
      setSelectedPaymentMethod(
        selectedPaymentMethod ? selectedPaymentMethod[0] : null
      );
      setInitialValues({ ...Data });
    } else {
      setInitialValues(getInitialValues());
    }
  }, [Data]);

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

  const handleClose = (values) => {
    ParentCallBackToView(!show, false);
    // values.newType = type === ADD ? '' : Data.name;
    setShow(!show);
    if (type === ADD) {
      setInitialValues(getInitialValues());
      setSelectedPaymentMethod(null);
      setPaymentMethod([]);
      setSelectedSupportedCategory(null);
      setSelectedRecovery(null);
      // setIsLumpsum(true);
    }
  };

  const savePaymentDetails = (fields, { setSubmitting }) => {
    setLoading(true);

    fields.lumsumEquivalent =
      typeof fields.lumsumEquivalent === "string"
        ? parseFloat(fields.lumsumEquivalent).toFixed(2)
        : fields.lumsumEquivalent.toFixed(2);
    fields.dailyEquivalent =
      typeof fields.dailyEquivalent === "string"
        ? parseFloat(fields.dailyEquivalent).toFixed(2)
        : fields.dailyEquivalent.toFixed(2);
    fields.radPortion =
      typeof fields.radPortion === "string"
        ? parseFloat(fields.radPortion)
        : fields.radPortion;
    fields.dapPortion =
      typeof fields.dapPortion === "string"
        ? parseFloat(fields.dapPortion)
        : fields.dapPortion;
    fields.effectiveDate = new Date(
      new Date(fields.effectiveDate).setSeconds(
        new Date(fields.effectiveDate).getSeconds() + 5
      )
    ).toJSON();
    fields.changedMpir = !fields.changedMpir ? 0 : fields.changedMpir;
    paymentService
      .createPaymentDetails({
        ...initialValues,
        ...fields,
        effectiveDate: convertDtFormat(fields.effectiveDate),
        radPortion: fields.radPortion ? fields.radPortion : 0,
        dapPortion: fields.dapPortion ? fields.dapPortion : 0,
        recoveryMethodId: fields.recoveryMethodId ? fields.recoveryMethodId : 0,
        paymentMethodId: fields.paymentMethodId ? fields.paymentMethodId : 0,
        residentId,
        comments: ckEditorData,
      })
      .then(
        (res) => {
          console.log("after save", res);
          setLoading(false);
          ParentCallBackToView(false, true, res.message);
          setShow(false);
          handleIsAdded();
        },
        (errors) => {
          setLoading(false);
        }
      );
    // }
    setSubmitting(false);
  };

  const convertDtFormat = (dt = new Date()) => {
    if (new Date(dt) === "invalid date") return "";
    let dte = new Date(dt);
    return `${dte.getFullYear()}-${
      dte.getMonth() === 11 ? dte.getMonth() + 1 : "0" + (dte.getMonth() + 1)
    }-${dte.getDate() < 10 ? "0" + dte.getDate() : dte.getDate()}T${
      dte.getHours() < 10 ? "0" + dte.getHours() : dte.getHours()
    }:${dte.getMinutes() < 10 ? "0" + dte.getMinutes() : dte.getMinutes()}:${
      dte.getSeconds() < 10 ? "0" + dte.getSeconds() : dte.getSeconds()
    }`;
  };
  const convertDate = (dt) => {
    console.log(dt);
    let altDate = new Date();
    dt = dt ? dt : altDate;
    return `${(new Date(dt).getDate() < 10 ? "0" : "") +
      new Date(dt).getDate()}/${(new Date(dt).getMonth() < 10 ? "0" : "") +
      (new Date(dt).getMonth() + 1)}/${new Date(dt).getFullYear()}`;
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.effectiveDate) {
      errors.effectiveDate = "Error";
    }

    if (
      !values.radPortion &&
      values.paymentMethodId &&
      selectedPaymentMethod &&
      (selectedPaymentMethod.name.replaceAll(" ", "") ===
        "RAC/DACCombination" ||
        selectedPaymentMethod.name.replaceAll(" ", "") === "RAD/DAPCombination")
    ) {
      // if (ref && ref.current && ref.current.touched.radPortion === undefined) {
      //   ref.current.setFieldTouched("radPortion", true);
      // }
      errors.radPortion = "Required field & should not be less than 1";
    }
    if (values.radPortion && values.radPortion > values.lumsumEquivalent) {
      errors.radPortion = "Must be less than lumpsum amount";
    }
    if (
      (!values.lumsumEquivalent || parseFloat(values.lumsumEquivalent) < 1) &&
      values.isLumSumEq
    ) {
      errors.lumsumEquivalent = "Error";
    }
    if (
      (!values.dailyEquivalent || parseFloat(values.dailyEquivalent) < 1) &&
      !values.isLumSumEq
    ) {
      errors.dailyEquivalent = "Error";
    }
    if (!values.supportedCategoryId) {
      errors.supportedCategoryId = "Error";
    }
    if (
      !values.paymentMethodId &&
      values.supportedCategoryId !== 1 &&
      values.supportedCategoryId
    ) {
      errors.paymentMethodId = "Error";
    }
    if (
      (values.isOverrideMPIR && !values.changedMpir) ||
      (values.isOverrideMPIR && values.changedMpir > values.mpir) ||
      parseFloat(values.changedMpir) === 0
    ) {
      errors.changedMpir =
        parseFloat(values.changedMpir) === 0
          ? "MPIR cannot be 0"
          : "Required Field";
      if (values.isOverrideMPIR && values.changedMpir >= values.mpir) {
        errors.changedMpir = "Invalid Input";
        setMpirErrorMsg(
          `The MPIR cannot be higher than ${values.mpir +
            "%"}, effective ${convertDate(values.effectiveDate)}.`
        );
        setShowMPIRError(true);
      }
    }
    return errors;
  };

  return (
    <Formik
      enableReinitialize
      innerRef={ref}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({})}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={savePaymentDetails}
    >
      {({
        errors,
        handleReset,
        setErrors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue,
      }) => (
        <>
          {loading ? <Loader></Loader> : null}
          {showErrorPopup && (
            <ModalError
              showErrorPopup={showErrorPopup}
              fieldArray={[]}
              errorMessage={
                "The Effective Date of this variation cannot be earlier than previous finalized version. Please enter the date later than earlier version"
              }
              header={"Payment Details - Effective Date"}
              buttonType={"Okay"}
              handleErrorClose={() => {
                setShowErrorPopup(false);
              }}
            ></ModalError>
          )}
          {touched.changedMpir ? (
            <ModalError
              showErrorPopup={showMPIRError}
              fieldArray={[]}
              errorMessage={mpirErrorMsg}
              thirdMsg={"Please try again."}
              secondMsg={
                "For more details on the MPIR, please check Admin > Fees & Charges."
              }
              header={"Payment Details - MPIR"}
              buttonType={"Ok"}
              handleErrorClose={() => {
                setShowMPIRError(false);
              }}
            ></ModalError>
          ) : (
            <></>
          )}
          <Modal
            centered
            isOpen={show}
            size="lg"
            className="payment-modal"
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
            >
              {PAYMENTDETAILS}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <Row className={"fieldStyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="effectiveDate"
                      className={
                        errors.effectiveDate && touched.effectiveDate
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                      column
                      sm={4}
                    >
                      {EFFECTIVEDATE}
                    </Label>
                    <Col sm={8}>
                      <InputGroup>
                        <MuiDatePicker
                          id="effectiveDate"
                          name="effectiveDate"
                          autoComplete="off"
                          selectedDate={values.effectiveDate}
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date(admissionDate)}
                          getChangedDate={handleChangeDate}
                          error={touched.effectiveDate && errors.effectiveDate}
                          className={"datepickerwidth"}
                        />
                      </InputGroup>

                      {!values.effectiveDate && (
                        <div
                          className="error-spanvariation"
                          style={{ marginLeft: "1px" }}
                        >
                          <InlineBottomErrorMessage name="effectiveDate" />
                        </div>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label
                      sm={4}
                      style={{ textAlign: "right" }}
                      className={
                        (errors.lumsumEquivalent && touched.lumsumEquivalent) ||
                        (errors.dailyEquivalent && touched.dailyEquivalent)
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {PAYMENTPRICE}
                    </Label>
                    <Col sm={3}>
                      <FormGroup check>
                        <input
                          id="radio"
                          name="active"
                          type="radio"
                          style={{ marginLeft: "-20px" }}
                          checked={values.isLumSumEq === true}
                          onChange={() => {
                            setFieldValue("isLumSumEq", true);
                          }}
                        />{" "}
                        <Label style={{ width: "fit-content" }} sm={10}>
                          {LUMPSUMEQUIVALENTPAYMNT}
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col
                      style={{
                        marginRight: "10px",
                        width: "30%",
                        height: "90%",
                        marginLeft: "-27px",
                      }}
                    >
                      <NumberFormat
                        thousandSeparator={true}
                        prefix={"$"}
                        // maxLength={values.lumsumEquivalent === 0 ? 14 : 16}
                        fixedDecimalScale={2}
                        allowNegative={false}
                        decimalScale={2}
                        name="lumsumEquivalent"
                        id="lumsumEquivalent"
                        // className="textfield"
                        onBlur={handleBlur}
                        value={parseFloat(
                          values.lumsumEquivalent //?.toString().substring(0, 10)
                        )}
                        placeholder={"$0.00"}
                        onValueChange={(x, src) => {
                          // console.log(x);
                          let dailyamt = "";
                          if (src.source === "event") {
                            if (!x.floatValue) {
                              // setFieldValue("dailyEquivalent", "");
                              dailyamt = "dailyAmt";
                              setFieldValue("lumsumEquivalent", x.floatValue);
                            } else {
                              let radAmt = x.floatValue;
                              let dailyAmt =
                                (radAmt *
                                  (values.isOverrideMPIR
                                    ? values.changedMpir
                                    : values.mpir)) /
                                36500;
                              setFieldValue("lumsumEquivalent", x.floatValue);
                              // setFieldValue("dailyEquivalent", dailyAmt);
                              dailyamt = dailyAmt;
                            }
                            setTimeout(() => {
                              setFieldValue("dailyEquivalent", dailyamt);
                            }, 200);
                          }
                        }}
                        style={{
                          alignText: "right",
                          width: "71.6%",
                        }}
                        // className={
                        //   'text form-control' +
                        //   (errors.lumsumEquivalent && touched.lumsumEquivalent
                        //     ? ' is-invalid'
                        //     : '')
                        // }
                        className={
                          "text form-control" +
                          (errors.lumsumEquivalent && touched.lumsumEquivalent
                            ? " is-invalid"
                            : "")
                        }
                        disabled={!values.isLumSumEq}
                      />
                      <InlineBottomErrorMessage
                        name="lumsumEquivalent"
                        msg="Required field & should be greater than 1"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} style={{ textAlign: "right" }}>
                      {""}
                    </Label>
                    <Col sm={3}>
                      <FormGroup check>
                        <input
                          id="radio"
                          name="active"
                          type="radio"
                          style={{ marginLeft: "-20px" }}
                          checked={values.isLumSumEq === false}
                          onChange={() => {
                            setFieldValue("isLumSumEq", false);
                            // setTimeout(() => {
                            //   validateForm(values);
                            // }, 500);
                          }}
                        />{" "}
                        <Label sm={10}>{DAILYEQUIVALENT}</Label>
                      </FormGroup>
                    </Col>
                    <Col
                      style={{
                        width: "30%",
                        height: "90%",
                        marginLeft: "-27px",
                      }}
                    >
                      <NumberFormat
                        thousandSeparator={true}
                        prefix={"$"}
                        // maxLength={values.dailyEquivalent === 0 ? 14 : 16}
                        maxLength={8}
                        fixedDecimalScale={2}
                        allowNegative={false}
                        decimalScale={2}
                        name="dailyEquivalent"
                        id="dailyEquivalent"
                        // className="textfield"
                        value={
                          values.dailyEquivalent //?.toString().substring(0, 5)
                        }
                        placeholder={"$0.00"}
                        onValueChange={(x, src) => {
                          if (src.source === "event") {
                            if (!x.floatValue) {
                              setFieldValue("dailyEquivalent", x.floatValue);
                              setFieldValue("lumsumEquivalent", "");
                            } else {
                              let dailyAmt = x.floatValue;
                              let radAmt =
                                (dailyAmt * 36500) /
                                (values.isOverrideMPIR
                                  ? values.changedMpir
                                  : values.mpir);
                              setFieldValue("lumsumEquivalent", radAmt);
                              setFieldValue("dailyEquivalent", x.floatValue);
                            }
                          }
                        }}
                        style={{
                          alignText: "right",
                          width: "69.5%",
                        }}
                        className={
                          "text form-control" +
                          (errors.dailyEquivalent && touched.dailyEquivalent
                            ? " is-invalid"
                            : "")
                        }
                        disabled={values.isLumSumEq}
                      />
                      <InlineBottomErrorMessage
                        name="dailyEquivalent"
                        msg="Required field & should be greater than 1"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="mpir"
                      column
                      sm={4}
                    >
                      {MPIR}
                    </Label>
                    <Col sm={8}>
                      <NumberFormat
                        thousandSeparator={false}
                        suffix={"%"}
                        maxLength={7}
                        fixedDecimalScale={2}
                        allowNegative={false}
                        onBlur={handleBlur}
                        decimalScale={2}
                        name="mpir"
                        id="mpir"
                        value={values.mpir}
                        placeholder={"0.00%"}
                        style={{
                          alignText: "right",
                          width: "67%",
                        }}
                        className={
                          "text form-control" +
                          (errors.mpir && touched.mpir ? " is-invalid" : "")
                        }
                        disabled={true}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    {/* <Label sm={3} style={{ textAlign: 'right' }}>
                      {PAYMENTPRICE}
                    </Label> */}
                    <Label
                      sm={6}
                      style={{ textAlign: "right", marginLeft: "-14px" }}
                      className={
                        errors.changedMpir && touched.changedMpir
                          ? " is-invalid-label required-field"
                          : values.isOverrideMPIR
                          ? "required-field"
                          : ""
                      }
                    >
                      {OVERRIDEMPIR}
                    </Label>
                    <Col sm={1}>
                      <FormGroup check>
                        <input
                          id="checkbox"
                          name="active"
                          type="checkbox"
                          style={{ marginTop: "10px", marginLeft: "-27px" }}
                          checked={values.isOverrideMPIR}
                          // onKeyPress={(x) => {
                          //   x.stopPropagation();
                          //   limitText(x.target, 9);
                          // }}
                          onChange={() => {
                            setFieldValue(
                              "isOverrideMPIR",
                              !values.isOverrideMPIR
                            );
                            setTimeout(() => {
                              if (values.isOverrideMPIR) {
                                setFieldValue("changedMpir", "");
                                if (values.isLumSumEq) {
                                  const dailyAmt =
                                    (parseFloat(values.lumsumEquivalent) *
                                      parseFloat(values.mpir)) /
                                    36500;
                                  setFieldValue("dailyEquivalent", dailyAmt);
                                  console.log("check daily amt", dailyAmt);
                                } else {
                                  if (values.changedMpir) {
                                    const radAmt =
                                      (parseFloat(values.dailyEquivalent) *
                                        36500) /
                                        parseFloat(values.mpir) || 0;
                                    setFieldValue("lumsumEquivalent", radAmt);
                                  }
                                }
                              }
                            }, 200);
                          }}
                        />{" "}
                      </FormGroup>
                    </Col>
                    <Col
                      sm={4}
                      style={{
                        marginLeft: "-42px",
                        width: "28%",
                        height: "90%",
                      }}
                    >
                      <NumberFormat
                        thousandSeparator={false}
                        suffix={"%"}
                        maxLength={7}
                        fixedDecimalScale={2}
                        allowNegative={false}
                        decimalScale={2}
                        name="changedMpir"
                        id="changedMpir"
                        value={values.changedMpir}
                        placeholder={"0.00%"}
                        onValueChange={(x, src) => {
                          // console.log(src);
                          if (src.source === "event") {
                            setFieldValue("changedMpir", x.value);
                            if (x.floatValue > 0) {
                              // let dailyAmt;
                              // let radAmt;
                              if (values.isLumSumEq) {
                                const dailyAmt =
                                  (values.lumsumEquivalent * x.floatValue) /
                                  36500;
                                setFieldValue(
                                  "dailyEquivalent",
                                  dailyAmt,
                                  false
                                );
                                console.log("check daily amt", dailyAmt);
                              } else {
                                const radAmt =
                                  (values.dailyEquivalent * 36500) /
                                    x.floatValue || 0;
                                setFieldValue(
                                  "lumsumEquivalent",
                                  radAmt,
                                  false
                                );
                              }
                            }
                          }
                        }}
                        style={{ alignText: "right" }}
                        className={
                          "text form-control" +
                          (errors.changedMpir && touched.changedMpir
                            ? " is-invalid"
                            : "")
                        }
                        disabled={!values.isOverrideMPIR}
                      />
                      {errors &&
                        errors.changedMpir &&
                        errors.changedMpir !== "Invalid Input" && (
                          <InlineBottomErrorMessage
                            name="changedMpir"
                            msg={errors.changedMpir}
                          />
                        )}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      htmlFor="supportedCategoryId "
                      column
                      style={{ textAlign: "right" }}
                      sm={4}
                      className={
                        errors.supportedCategoryId &&
                        touched.supportedCategoryId
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {SUPPORTEDCATEGORY}
                    </Label>
                    <Col sm={4}>
                      <SingleSelect
                        // isDisabled={!values.isDrowdownDap}
                        name="supportedCategoryId"
                        onChange={(selected) => {
                          setSelectedSupportedCategory(selected);
                          setFieldValue(
                            "supportedCategoryId",
                            selected.supported_category_id
                          );

                          let id = -1;
                          switch (selected.supported_category_id) {
                            case 1:
                              id = 0;
                              break;
                            case 2:
                              id = 2;
                              break;
                            case 3:
                              id = 1;
                              break;
                            default:
                          }
                          getPaymentMethod(id);
                          if (id === 2) {
                            getRecoveryMethods(4);
                          } else {
                            getRecoveryMethods(3);
                          }
                        }}
                        error={
                          errors.supportedCategoryId &&
                          touched.supportedCategoryId
                            ? true
                            : false
                        }
                        options={supportedCategory}
                        value={selectedSupportedCategory}
                      />
                      <InlineBottomErrorMessage name="supportedCategoryId" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      htmlFor="paymentMethodId "
                      column
                      style={{ textAlign: "right" }}
                      sm={4}
                      className={
                        (errors.paymentMethodId && touched.paymentMethodId
                          ? " is-invalid-label "
                          : " ") +
                        (values.supportedCategoryId === 1 ||
                        !values.supportedCategoryId
                          ? ""
                          : "required-field")
                      }
                    >
                      {PAYMENTMETHOD}
                    </Label>
                    <Col sm={4}>
                      <SingleSelect
                        isDisabled={
                          values.supportedCategoryId === 1 ||
                          !values.supportedCategoryId
                        }
                        placeholder={
                          values.supportedCategoryId === 1 ||
                          !values.supportedCategoryId
                            ? "None"
                            : ""
                        }
                        name="paymentMethodId"
                        onChange={(selected) => {
                          setFieldValue("paymentMethodId", selected.id);
                          setSelectedPaymentMethod(selected);
                          if (
                            selected.name === "RAC Only" ||
                            selected.name === "DAC Only" ||
                            selected.name === "RAD Only" ||
                            selected.name === "DAP Only"
                          ) {
                            setTimeout(() => {
                              setFieldValue("radPortion", "");
                              setFieldValue("dapPortion", "");
                            }, 3000);
                          }
                        }}
                        error={
                          errors.paymentMethodId && touched.paymentMethodId
                            ? true
                            : false
                        }
                        options={paymentMethod}
                        value={selectedPaymentMethod}
                      />
                      <InlineBottomErrorMessage name="paymentMethodId" />
                    </Col>
                  </FormGroup>
                  {values.supportedCategoryId === 1 ? (
                    <></>
                  ) : selectedPaymentMethod &&
                    (selectedPaymentMethod.name.replaceAll(" ", "") ===
                      "RAC/DACCombination" ||
                      selectedPaymentMethod.name.replaceAll(" ", "") ===
                        "RAD/DAPCombination") ? (
                    <>
                      <FormGroup row>
                        <Label
                          htmlFor="supportedCategoryId "
                          column
                          style={{ textAlign: "right" }}
                          sm={4}
                        >
                          {"New Payment Price"}
                        </Label>
                        <Col sm={8}>
                          <div
                            className="addpaymentouterbox"
                            style={{ height: "90%" }}
                          >
                            <Row className={"fieldStyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  //htmlFor="AdmissionDate"
                                  column
                                  sm={3}
                                  className={
                                    errors.radPortion && touched.radPortion
                                      ? " is-invalid-label required-field"
                                      : "required-field"
                                  }
                                >
                                  {selectedPaymentMethod.name.replaceAll(
                                    " ",
                                    ""
                                  ) === "RAD/DAPCombination"
                                    ? "RAD Portion"
                                    : "RAC Portion"}
                                </Label>
                                <Col sm={6}>
                                  <NumberFormat
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    // maxLength={
                                    //   values.radPortion === 0 ? 14 : 16
                                    // }
                                    // maxLength={16}
                                    fixedDecimalScale={2}
                                    allowNegative={false}
                                    decimalScale={2}
                                    name="radPortion"
                                    id="radPortion"
                                    onBlur={handleBlur}
                                    value={values.radPortion}
                                    placeholder={"$0.00"}
                                    onValueChange={(x, src) => {
                                      console.log(src);
                                      if (src.source === "event") {
                                        setFieldValue(
                                          "radPortion",
                                          x.floatValue
                                        );
                                        setTimeout(() => {
                                          setFieldValue(
                                            "dapPortion",
                                            values.lumsumEquivalent -
                                              x.floatValue
                                          );
                                        }, 200);
                                      }
                                    }}
                                    style={{ fontSize: "14px" }}
                                    className={
                                      "text form-control" +
                                      (errors.radPortion && touched.radPortion
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                </Col>
                                <Col sm={8} style={{ marginLeft: "110px" }}>
                                  <InlineBottomErrorMessage
                                    name="radPortion"
                                    msg={errors.radPortion}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="newType"
                                  column
                                  sm={3}
                                >
                                  {selectedPaymentMethod.name.replaceAll(
                                    " ",
                                    ""
                                  ) === "RAD/DAPCombination"
                                    ? "DAP Portion"
                                    : "DAC Portion"}
                                </Label>
                                <Col sm={6}>
                                  {/* <NumberFormat
                                      name="dapPortion"
                                      type="number"
                                      value={values.dapPortion}
                                      placeholder={'0.00'}
                                      style={{
                                        fontSize: '14px',
                                        width: '90%',
                                      }}
                                      disabled={true}
                                    /> */}
                                  <NumberFormat
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    // maxLength={17}
                                    fixedDecimalScale={2}
                                    allowNegative={false}
                                    decimalScale={2}
                                    name="dapPortion"
                                    id="dapPortion"
                                    value={values.dapPortion}
                                    placeholder="$0.00"
                                    style={{
                                      fontSize: "14px",
                                      // width: "90%",
                                    }}
                                    className={"text form-control"}
                                    disabled
                                  />
                                </Col>
                                <Col sm={3}>
                                  <p className="mt-2">
                                    {(values.isOverrideMPIR
                                      ? values.changedMpir
                                      : values.mpir) && values.dapPortion
                                      ? "$" +
                                        (
                                          ((values.isOverrideMPIR
                                            ? values.changedMpir
                                            : values.mpir) *
                                            values.dapPortion) /
                                          36500
                                        ).toFixed(2) +
                                        " per day"
                                      : ""}
                                  </p>
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Label sm={3} style={{ textAlign: "right" }}>
                                  {""}
                                </Label>
                                <Col sm={3}>
                                  <FormGroup check>
                                    <Input
                                      id="checkbox"
                                      name="active"
                                      type="checkbox"
                                      checked={values.isDrowdownDap}
                                      onChange={() => {
                                        setFieldValue(
                                          "isDrowdownDap",
                                          !values.isDrowdownDap
                                        );
                                      }}
                                      style={{ marginTop: "10px" }}
                                    />{" "}
                                  </FormGroup>
                                </Col>
                                <Label sm={6} style={{ marginLeft: "-78px" }}>
                                  {selectedPaymentMethod.name.replaceAll(
                                    " ",
                                    ""
                                  ) === "RAD/DAPCombination"
                                    ? "Drawdown DAP from RAD"
                                    : "Drawdown DAC from RAC"}
                                </Label>
                              </FormGroup>
                              <FormGroup row>
                                <Col sm={3}></Col>
                                <Label
                                  sm={4}
                                  style={{
                                    textAlign: "right",
                                    marginLeft: "11px",
                                  }}
                                >
                                  {RECOVERYMETHOD}
                                </Label>
                                <Col sm={5} style={{ marginLeft: "-11px" }}>
                                  <SingleSelect
                                    isDisabled={!values.isDrowdownDap}
                                    name="recoveryMethodId"
                                    onChange={(selected) => {
                                      setFieldValue(
                                        "recoveryMethodId",
                                        selected.id
                                      );
                                      setSelectedRecovery(selected);
                                    }}
                                    options={recoveryList}
                                    value={selectedRecovery}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                          </div>
                        </Col>
                      </FormGroup>
                    </>
                  ) : (
                    <></>
                  )}

                  <FormGroup row>
                    <Label sm={4} style={{ textAlign: "right" }}>
                      {COMMENT}
                    </Label>
                    <Col sm={6}>
                      <CKEditor
                        config={editorConfiguration}
                        id="firstEditor"
                        name="description"
                        initData={ckEditorData}
                        onChange={handleEditorChange}
                        style={{ width: "400px" }}
                      />
                    </Col>
                  </FormGroup>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="modalsave btn btn-primary mr-2"
                  color="primary"
                  size="md"
                >
                  {type === ADD ? ADD : SAVE}
                </Button>
                <Button
                  onClick={() => {
                    handleClose(values);
                    handleReset();
                  }}
                  variant="secondary"
                  className="clsbtn btn btn-secondary"
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

export default AddPaymentDetails;
