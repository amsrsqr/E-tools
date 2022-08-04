import React, { useEffect, useState, useRef } from "react";
import Loader from "../../../components/Loader";
import Page from "../../../components/Page";
import Icon from "../../../../src/assets/Images/icon.png";
import {
  ADD,
  ADDITIONSERVICES,
  AMOUNT,
  BASICDAILY,
  COMPENSATIONAMOUNT,
  COST,
  DAILYCARE,
  EDIT,
  EXTRASERVICE,
  EXTRASERVICEINCLUDED,
  EXTRASERVICEREDUCTION,
  FEEPAYMENT,
  HARDSHIPSUPPLIMENT,
  INFO,
  MEANSTESTEDCAREFEES,
  MEANSTESTEDFEES,
  OTHERCHARGES,
  OTHERFEES,
  OVERRIDE,
  OVERRIDEREDUCTION,
  RESIDENTFEES,
  TOTALSTARTINGDAILYFEES,
  TYPE,
} from "../../../constant/FieldConstant";
import { Button, Form, Label } from "reactstrap";
import WarningMessageModelAlert from "../../../components/WarningMessageModelAlert";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import {
  ADDITIONAL,
  BASICWARNINGTITLE,
  DAILYCAREFEETEXT,
  FEEPAYMENTINFO,
} from "../../../constant/MessageConstant";
import AdditionalServices from "./AdditionalServices";
import getFeePaymentCycle from "../../../services/Master/residentFees.service";
import { Field, Formik, useFormikContext } from "formik";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
import SuccessAlert from "../../../components/SuccessAlert";
import DirtyWarningAlert from "../../../components/DirtyWarningAlert";
import BasicDailyFeesWarning from "../../../components/BasicDailyFeesWarning";
import RefundsWarningModal from "../../../components/RefundsWarningModal";
import "../../../css/ViewResidentFee.css";
import SingleSelect from "../../../components/MySelect/MySelect";
import { SortArrayOfObjs } from "../../../utils/ArrayFun";
import { useNavigate } from "react-router-dom";

const AutoSubmitToken = ({ handlIsUnSavedDataFormik }) => {
  // Grab values and submitForm from context
  const { dirty } = useFormikContext();
  // alert("sfsf");
  useEffect(() => {
    console.log("sfsf", dirty);
    handlIsUnSavedDataFormik(dirty);
  }, [dirty]);
  return dirty;
};

const ViewResidentFees = ({
  flag,
  residentFeesCallaback,
  residentId,
  selectedFacility,
  refundComplete,
  isExtra,
  editDataId,
  getValueOfFacility,
  commingFacilities,
  callbackHandleSave,
  isCancelling,
  navigationToView,
}) => {
  const [loading, setLoading] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [additionalService, setAdditionalService] = useState(false);
  const [paymentCycle, setPaymentCycle] = useState([]);
  const [dailyCareType, setDailyCareType] = useState([]);
  const [extraServiceCharge, setExtraServiceCharge] = useState([]);
  const [selectedDefault, setSelectedDefault] = useState({});
  const [selectedDefaultDaily, setSelectedDefaultDaily] = useState({});
  const [selectedDefaultExtra, setSelectedDefaultExtra] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [errorArray, setErrorArray] = useState([]);
  const selectInputRef = useRef();
  const [title, setTitle] = useState([]);
  const [residentialType, setResidentialType] = useState([]);
  const [showWarningAlert2, setShowWarningAlert2] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const ref = useRef();
  const form = useRef();
  const [fieldAlertWarning, setFieldAlertWarning] = useState(false);
  const [warningAlertOptions, setWarningAlertOptions] = useState({});
  const [facilityID, setFacilityId] = useState(selectedFacility);

  const [facilities, setFacilities] = useState([]);
  const [updatedfacilities, setUpdatedFacilities] = useState([]);
  const [updateCheck, setUpdateCheck] = useState([]);
  const [isUnsavedData, setIsUnsavedData] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    setFacilityId(selectedFacility);
  }, [selectedFacility]);

  useEffect(() => {
    if (navigationToView) {
      navigate("/eRADWeb/viewResident", { replace: true });
    }
  }, [navigationToView]);

  useEffect(() => {
    setTitle(title);
  }, []);

  useEffect(() => {
    setIsFormSubmitting(flag);
    if (flag) {
      form.current.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  }, [flag]);

  const onHandleMessage = (type, title, content) => {
    setShowWarningAlert(!showWarningAlert);
    const setNewTitle = {
      warningType: type,
      header: title,
      msg: content,
    };
    setTitle(setNewTitle);
  };

  const handlIsUnSavedDataFormik = (data) => {
    handlIsUnSavedData(data);
  };

  const handlIsUnSavedData = (data) => {
    if (typeof callbackHandleSave === "function") {
      callbackHandleSave(data);
    }
  };

  const onHandleMessage2 = (type, title, content) => {
    setShowWarningAlert2(!showWarningAlert2);
    const setNewTitle = {
      warningType: type,
      header: title,
      msg: content,
    };
    setTitle(setNewTitle);
  };

  const [initialValue, setInitialValues] = useState({
    id: 0,
    residentId: 0,
    feePaymentCycleId: 0,
    basicDailyCareFeeTypeId: 0,
    amount: 0,
    isOverrideAmount: 0,
    overrideAmount: 0,
    isCompensationPayment: false,
    compensationPayment: "",
    isHardshipSupplement: false,
    hardshipSupplement: "",
    isAdditionalServices: false,
    additionalServices: "",
    isOtherCharges: false,
    otherCharges: "",
    meansTestedCareFee: "",
    isExtraServiceIncluded: false,
    extraServiceTypeId: 0,
    extraServiceCost: "",
    isExtraServiceOverrideCost: false,
    extraServiceOverrideCost: "",
    extraServiceReduction: "",
    isExtraServiceOverrideReduction: false,
    extraServiceOverrideReduction: "",
  });

  useEffect(() => {
    getAllResidentialCareFees();
  }, []);

  const getAllResidentialCareFees = () => {
    setLoading(true);
    // first dropdown
    getFeePaymentCycle
      .getresidentialCareFees(residentId)
      .then((response) => {
        getFeePaymentCycle
          .getFeePaymentCycleList()
          .then((res) => {
            const result = res.map((x) => {
              x.label = x.name;
              return x;
            });
            setPaymentCycle(result);
            if (response.result === null) {
              const val = { value: result[0].id, label: result[0].name };
              setSelectedDefault(val);
            } else {
              let tosel = result.filter(
                (m) => m.id == response.result.feePaymentCycleId
              );
              setSelectedDefault(tosel);
            }
          })
          .catch(() => {});
        // second dropdown
        getFeePaymentCycle
          .getBasicDailyCareFeeTypeList()
          .then((res) => {
            const result1 = res.map((x) => {
              x.label = x.residentDescription;
              return x;
            });
            setDailyCareType(result1);
            if (response.result === null) {
              const val = { value: 0, label: "Select..." };
              setSelectedDefaultDaily(val);
            } else {
              let tosel = result1.filter(
                (m) => m.feeId == response.result.basicDailyCareFeeTypeId
              );
              setSelectedDefaultDaily(tosel);
            }
          })
          .catch(() => {});
        // third dropdown
        const getId = localStorage.getItem("FacilityId");
        getFeePaymentCycle
          .getFacilityExtraServiceChargeList(getId)
          .then((res) => {
            const result2 = res.map((x) => {
              x.label = x.extraServiceChargeLevel;
              return x;
            });
            setExtraServiceCharge(result2);
            if (response.result === null) {
              const val = { value: 0, label: "Select..." };
              setSelectedDefaultExtra(val);
            } else {
              let tosel = result2.filter(
                (m) => m.id == response.result.extraServiceTypeId
              );
              setSelectedDefaultExtra(tosel);
            }
          })
          .catch(() => {});

        setLoading(false);
        setResidentialType(response.result);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (residentialType && residentialType.id) {
      extraServiceCharge.map((m) => {
        if (isExtra === true) {
          if (m.id === residentialType.extraServiceTypeId) {
            setSelectedDefaultExtra({
              value: m.extraServiceFee,
              label: m.extraServiceChargeLevel,
            });
          }
        } else if (isExtra === false) {
          if (m.id === residentialType.extraServiceTypeId) {
            setSelectedDefaultExtra({
              value: m.extraServiceFee,
              label: m.extraServiceChargeLevel,
            });
          } else {
            // setSelectedDefaultExtra(null);
            // ref.current.setFieldValue("extraServiceTypeId", 0);
          }
        }
      });
    }
  }, [extraServiceCharge]);

  useEffect(() => {
    if (residentialType && residentialType.id) {
      setInitialValues({
        id: residentialType.id ? residentialType.id : 0,
        residentId: residentialType.residentId ? residentialType.residentId : 0,
        feePaymentCycleId: residentialType.feePaymentCycleId
          ? residentialType.feePaymentCycleId
          : 0,
        basicDailyCareFeeTypeId: residentialType.basicDailyCareFeeTypeId
          ? residentialType.basicDailyCareFeeTypeId
          : 0,
        amount: residentialType.amount ? residentialType.amount : 0,
        isOverrideAmount: residentialType.isOverrideAmount
          ? residentialType.isOverrideAmount
          : 0,
        overrideAmount: residentialType.overrideAmount
          ? residentialType.overrideAmount
          : "",
        isCompensationPayment: residentialType.isCompensationPayment
          ? residentialType.isCompensationPayment
          : false,
        compensationPayment: residentialType.compensationPayment
          ? residentialType.compensationPayment
          : "",
        isHardshipSupplement: residentialType.isHardshipSupplement
          ? residentialType.isHardshipSupplement
          : false,
        hardshipSupplement: residentialType.hardshipSupplement
          ? residentialType.hardshipSupplement
          : "",
        isAdditionalServices: residentialType.isAdditionalServices
          ? residentialType.isAdditionalServices
          : false,
        additionalServices: residentialType.additionalServices
          ? residentialType.additionalServices
          : "",
        isOtherCharges: residentialType.isOtherCharges
          ? residentialType.isOtherCharges
          : false,
        otherCharges: residentialType.otherCharges
          ? residentialType.otherCharges
          : "",
        meansTestedCareFee: residentialType.meansTestedCareFee
          ? residentialType.meansTestedCareFee
          : "",
        isExtraServiceIncluded: residentialType.isExtraServiceIncluded
          ? residentialType.isExtraServiceIncluded
          : false,
        extraServiceTypeId: residentialType.extraServiceTypeId
          ? residentialType.extraServiceTypeId
          : 0,
        extraServiceCost: residentialType.extraServiceCost
          ? residentialType.extraServiceCost
          : 0,
        isExtraServiceOverrideCost: residentialType.isExtraServiceOverrideCost
          ? residentialType.isExtraServiceOverrideCost
          : false,
        extraServiceOverrideCost: residentialType.extraServiceOverrideCost
          ? residentialType.extraServiceOverrideCost
          : "",
        extraServiceReduction: residentialType.extraServiceReduction
          ? residentialType.extraServiceReduction
          : 0,
        isExtraServiceOverrideReduction: residentialType.isExtraServiceOverrideReduction
          ? residentialType.isExtraServiceOverrideReduction
          : false,
        extraServiceOverrideReduction: residentialType.extraServiceOverrideReduction
          ? residentialType.extraServiceOverrideReduction
          : "",
      });
    } else {
      setInitialValues({
        id: 0,
        residentId: 0,
        feePaymentCycleId: 0,
        basicDailyCareFeeTypeId: 0,
        amount: 0,
        isOverrideAmount: 0,
        overrideAmount: "",
        isCompensationPayment: false,
        compensationPayment: "",
        isHardshipSupplement: false,
        hardshipSupplement: "",
        isAdditionalServices: false,
        additionalServices: "",
        isOtherCharges: false,
        otherCharges: "",
        meansTestedCareFee: "",
        isExtraServiceIncluded: false,
        extraServiceTypeId: 0,
        extraServiceCost: 0,
        isExtraServiceOverrideCost: false,
        extraServiceOverrideCost: "",
        extraServiceReduction: 0,
        isExtraServiceOverrideReduction: false,
        extraServiceOverrideReduction: "",
      });
    }
  }, [residentialType]);

  const updateAttachedChecbox = (value, id) => {
    const items = [...updatedfacilities];
    setUpdateCheck((arr) => [...arr, { value: value, id: id }]);

    const objIndex = items.findIndex((obj) => obj.id === id);

    // make new object of updated object.
    items[objIndex].attached = value;

    // make final new array of objects by combining updated object.
    // const updatedProjects = [
    //   ...items.slice(0, objIndex),
    //   updatedObj,
    //   ...items.slice(objIndex + 1),
    // ];

    // setFacilities(items);
    console.log("before save state data=", items);
    console.log("original data=", facilities);

    // if(updatedProjects !== oldUpdatedfacilities){
    //  alert("There is some chnage in values again ");
    // }
    // console.log("after save state data=", updatedProjects);

    setUpdatedFacilities(items);

    //let index = items2.findIndex((m) => m.id === id);
    //items2[objIndex].attached = value;

    // console.log("before save state data item=", items);
    // console.log("after save state data=", updatedProjects);
  };

  const updateOverrideTotal = (value, id) => {
    const unsaveditems = Array.from(facilities);
    const items = Array.from(updatedfacilities);
    updateCheck.map((m) => {
      if (m.id === id && m.value === true) {
        setInitialValues({ ...initialValue, additionalServices: value });
      }
    });
    setFacilities(unsaveditems);
    items.map((item) => {
      if (Number(value) <= Number(item.price) && item.attached) {
        let index = items.findIndex((m) => m.id === id);
        items[index].overridePrice = value;
      }
    });
    setUpdatedFacilities(items);
  };

  const handleCancelCallback = () => {
    setUpdatedFacilities(JSON.parse(JSON.stringify([...facilities])));
    setIsUnsavedData(false);
    handlIsUnSavedData(false);
  };

  const handleOpenAdditional = () => {
    if (commingFacilities?.length > 0) {
      setFacilities(commingFacilities);
      setAdditionalService(!additionalService);
    } else {
      getAllFacilities();
    }
  };

  async function onSave(fields, { setStatus, setSubmitting }) {
    if (JSON.stringify(fields) === JSON.stringify(initialValue)) {
      residentFeesCallaback({
        submitFlag: false,
        successFlag: true,
      });
    } else {
      if (
        !fields.isExtraServiceIncluded ||
        (fields.isExtraServiceIncluded && fields.extraServiceTypeId)
      ) {
        if (
          (fields.overrideAmount === undefined ||
            fields.overrideAmount <= fields.amount) &&
          (fields.extraServiceOverrideCost === undefined ||
            fields.extraServiceOverrideCost <= fields.extraServiceCost)
        ) {
          setLoading(true);
          getFeePaymentCycle
            .updateResidentCare(
              fields.id,
              residentId,
              fields.feePaymentCycleId,
              fields.basicDailyCareFeeTypeId,
              fields.amount,
              fields.isOverrideAmount,
              fields.overrideAmount,
              fields.isCompensationPayment,
              fields.compensationPayment ? fields.compensationPayment : 0,
              fields.isHardshipSupplement,
              fields.hardshipSupplement ? fields.hardshipSupplement : 0,
              fields.isAdditionalServices,
              fields.additionalServices ? fields.additionalServices : 0,
              fields.isOtherCharges,
              fields.otherCharges ? fields.otherCharges : 0,
              fields.meansTestedCareFee ? fields.meansTestedCareFee : 0,
              fields.isExtraServiceIncluded,
              fields.extraServiceTypeId,
              fields.extraServiceCost,
              fields.isExtraServiceOverrideCost,
              fields.extraServiceOverrideCost
                ? fields.extraServiceOverrideCost
                : 0,
              fields.extraServiceReduction,
              fields.isExtraServiceOverrideReduction,
              fields.extraServiceOverrideReduction
                ? fields.extraServiceOverrideReduction
                : 0
            )
            .then(
              (res) => {
                setSuccessAlertOptions({
                  title: "",
                  actionType: editDataId ? EDIT : ADD,
                  msg: editDataId
                    ? res.message
                    : "Your data has been saved successfully",
                  callback: () => {
                    residentFeesCallaback({
                      submitFlag: false,
                      successFlag: true,
                    });
                    callbackHandleSave(false);
                    getValueOfFacility(facilities);
                    setShowSuccessAlert(false);
                  },
                });

                setLoading(false);
                setShowSuccessAlert(true);
              },
              () => {
                residentFeesCallaback({
                  submitFlag: false,
                  successFlag: false,
                });
                setLoading(false);
                callbackHandleSave(true);
              }
            );
        } else {
          setFieldAlertWarning(true);
          residentFeesCallaback({ submitFlag: false, successFlag: false });
          setWarningAlertOptions({
            title: BASICWARNINGTITLE,
            msg: (
              <p className="text-center">
                The Basic Daily Care Fee cannot exceed ${/* 0 means false */}
                {fields.isOverrideAmount === 0 ||
                (fields.isOverrideAmount === 1 &&
                  fields.overrideAmount < fields.amount)
                  ? fields.extraServiceCost
                  : fields.amount}
                . <br /> Please try again. <br /> <br />
                For more details on these Fees, please check Admin {">"} Fees &
                Charges.
              </p>
            ),
            callback: () => {
              setFieldAlertWarning(false);
            },
          });
        }
      } else {
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }
  }

  const getAllFacilities = () => {
    const getId = localStorage.getItem("FacilityId");

    getFeePaymentCycle
      .getfacilityForAdditionalServiceFees(getId, residentId)
      .then((res) => {
        let sortedList = SortArrayOfObjs(res, "name");
        const dup_array = JSON.parse(JSON.stringify(sortedList));
        setUpdatedFacilities(dup_array);
        setFacilities(sortedList);
        setAdditionalService(!additionalService);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const callBackAddition = () => {
    const subcategoryList = JSON.parse(JSON.stringify([...updatedfacilities]));
    let total = 0;
    subcategoryList.map((item) => {
      if (Number(item.overridePrice) <= Number(item.price) && item.isActive) {
        total += parseFloat(
          item.overridePrice ? item.overridePrice : item.price
        );
        console.log("total", total);
        ref.current.setFieldValue("additionalServices", total);
        setFacilities(JSON.parse(JSON.stringify([...updatedfacilities])));
      }
    });
    handlIsUnSavedData(true);
    setIsUnsavedData(true);
  };

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);
    if (values.isOverrideAmount === 1) {
      if (
        values.overrideAmount === 0 ||
        values.overrideAmount === "" ||
        values.overrideAmount === undefined
      ) {
        errorObj.overrideAmount = "Required Field";
        errorArr.push({ name: "overrideAmount" });
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }

    if (values.isCompensationPayment === true) {
      console.log("compensastion=>", values.compensationPayment);
      if (
        values.compensationPayment === 0 ||
        values.compensationPayment === "" ||
        values.compensationPayment === undefined
      ) {
        errorObj.compensationPayment = "Required Field";
        errorArr.push({ name: "compensationPayment" });
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }
    if (values.isHardshipSupplement === true) {
      if (
        values.hardshipSupplement === "" ||
        values.hardshipSupplement === 0 ||
        values.hardshipSupplement === undefined
      ) {
        errorObj.hardshipSupplement = "Required Field";
        errorArr.push({ name: "hardshipSupplement" });
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }
    if (values.isAdditionalServices === true) {
      if (
        values.additionalServices === "" ||
        values.additionalServices === 0 ||
        values.additionalServices === undefined
      ) {
        errorObj.additionalServices = "Required Field";
        errorArr.push({ name: "additionalServices" });
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }
    if (values.isOtherCharges === true) {
      if (
        values.otherCharges === "" ||
        values.otherCharges === 0 ||
        values.otherCharges === undefined
      ) {
        errorObj.otherCharges = "Required Field";
        errorArr.push({ name: "otherCharges" });
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }

    if (values.isExtraServiceOverrideCost === true) {
      if (
        values.extraServiceOverrideCost === "" ||
        values.extraServiceOverrideCost === 0 ||
        values.extraServiceOverrideCost === undefined
      ) {
        errorObj.extraServiceOverrideCost = "Required Field";
        errorArr.push({ name: "extraServiceOverrideCost" });
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }
    if (values.isExtraServiceOverrideReduction === true) {
      if (
        values.extraServiceOverrideReduction === 0 ||
        values.extraServiceOverrideReduction === "" ||
        values.extraServiceOverrideReduction === undefined
      ) {
        errorObj.extraServiceOverrideReduction = "Required Field";
        errorArr.push({ name: "extraServiceOverrideReduction" });
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }

    if (values.isExtraServiceIncluded || isExtra === true) {
      if (values.extraServiceTypeId === 0) {
        errorObj.extraServiceTypeId = "Required Field";
        errorArr.push({ name: "extraServiceTypeId" });
        residentFeesCallaback({ submitFlag: false, successFlag: false });
      }
    }

    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  return (
    <Formik
      enableReinitialize
      innerRef={ref}
      initialValues={initialValue}
      onSubmit={onSave}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={false}
    >
      {({ errors, handleSubmit, setFieldValue, touched, values, dirty }) => (
        <>
          {loading ? (
            <Loader></Loader>
          ) : (
            <>
              <Form onSubmit={handleSubmit} innerRef={form}>
                <AutoSubmitToken
                  handlIsUnSavedDataFormik={handlIsUnSavedDataFormik}
                />
                {(dirty || isUnsavedData) && !isCancelling ? (
                  <DirtyWarningAlert
                    isBlocking={(dirty || isUnsavedData) && !isCancelling}
                    sourceName={
                      editDataId ? "Edit Resident" : "Add New Resident"
                    }
                    messageBody={
                      "Are you sure you want to exit to the Register and discard these changes?"
                    }
                  />
                ) : null}

                {fieldAlertWarning && (
                  <BasicDailyFeesWarning
                    title={warningAlertOptions.title}
                    msg={warningAlertOptions.msg}
                    fieldAlertWarning={fieldAlertWarning}
                    setFieldAlertWarning={setFieldAlertWarning}
                  />
                )}
                <Page title={RESIDENTFEES}>
                  <div className="mb-3">
                    <div className="wrapper">
                      <div className="container-fluid px-0">
                        <div className="row no-gutters ">
                          <div className="col-sm-6">
                            <div className="head mt-3">
                              <img src={Icon} className="icon" />
                              {DAILYCARE}{" "}
                              <i
                                className="fa fa-info-circle fa-sm"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  onHandleMessage(
                                    INFO,
                                    DAILYCARE,
                                    DAILYCAREFEETEXT.TEXT
                                  )
                                }
                              ></i>
                            </div>
                            <hr className="headerBorder" />
                            <div className="container">
                              <div className="row">
                                <div className="col-sm-3">
                                  <p className="mt-2">
                                    {FEEPAYMENT}
                                    <i
                                      className="fa fa-info-circle fa-lg"
                                      onClick={() =>
                                        onHandleMessage2(
                                          INFO,
                                          FEEPAYMENT,
                                          FEEPAYMENTINFO.TEXT
                                        )
                                      }
                                      style={{
                                        marginLeft: "6px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  </p>
                                </div>
                                <div className="col-sm-5 ">
                                  <SingleSelect
                                    name="feePaymentCycleId"
                                    options={paymentCycle.map((x) => {
                                      return { value: x.id, label: x.name };
                                    })}
                                    onChange={(selected) => {
                                      setSelectedDefault(selected);
                                      setFieldValue(
                                        "feePaymentCycleId",
                                        selected.value
                                      );
                                    }}
                                    value={selectedDefault}
                                    isDisabled={refundComplete}
                                  />
                                </div>
                              </div>
                              <div className="col-10 mt-4">
                                <div
                                  className="card col-10 "
                                  style={{
                                    backgroundColor: refundComplete
                                      ? "#d3d3d378"
                                      : "",
                                  }}
                                >
                                  <div className="card-body col-11 ">
                                    <div className="row mt-2">
                                      <div className="col-1"></div>
                                      <div className="col-sm-4">
                                        <p className="fw-bold text-end ">
                                          {BASICDAILY}
                                        </p>
                                      </div>

                                      <div className="col-md-7"></div>

                                      <div className="col-1"></div>
                                      <div className="col-sm-4">
                                        <p className="text-end mt-2">
                                          {BASICDAILY} {TYPE}
                                        </p>
                                      </div>
                                      <div className="col-1"></div>
                                      <div className="col-md-6 col-sm-offset-1 mb-2">
                                        <SingleSelect
                                          isDisabled={refundComplete}
                                          name="basicDailyCareFeeTypeId"
                                          options={dailyCareType.map((x) => {
                                            return {
                                              value: x.feeId,
                                              label: x.residentDescription,
                                              fee: x.feePre,
                                            };
                                          })}
                                          onChange={(selected) => {
                                            setSelectedDefaultDaily(selected);
                                            setFieldValue(
                                              "basicDailyCareFeeTypeId",
                                              selected.value
                                            );
                                            setFieldValue(
                                              "amount",
                                              selected.fee
                                            );
                                          }}
                                          value={selectedDefaultDaily}
                                        />
                                      </div>

                                      <div className="col-1 "></div>
                                      <div className="col-sm-4">
                                        <p className="text-end mt-2">
                                          {AMOUNT}
                                        </p>
                                      </div>
                                      <div className="col-1"></div>
                                      <div className="col-md-6 col-sm-offset-1 mb-2">
                                        <NumberFormat
                                          placeholder="$0.00"
                                          thousandSeparator={true}
                                          prefix={"$"}
                                          allowNegative={false}
                                          disabled
                                          name="amount"
                                          id="amount"
                                          fixedDecimalScale={2}
                                          decimalScale={2}
                                          value={
                                            values.amount ? values.amount : ""
                                          }
                                          className="form-control input-sm"
                                        />
                                      </div>

                                      <div className="col-1 "></div>
                                      <div className="col-sm-4">
                                        <p
                                          className={
                                            "text-end mt-2 " +
                                            (errors.overrideAmount &&
                                            touched.overrideAmount &&
                                            values.isOverrideAmount
                                              ? " is-invalid-label required-field fw-bold"
                                              : values.isOverrideAmount === 1
                                              ? "required-field"
                                              : "")
                                          }
                                        >
                                          {OVERRIDE} {AMOUNT}
                                        </p>
                                      </div>
                                      <div className="col-1"></div>
                                      <div className="col-md-1">
                                        <Field
                                          placeholder="$0.00"
                                          thousandSeparator={true}
                                          prefix={"$"}
                                          allowNegative={false}
                                          onChange={(val) => {
                                            val.currentTarget.checked === true
                                              ? setFieldValue(
                                                  "isOverrideAmount",
                                                  1
                                                )
                                              : setFieldValue(
                                                  "isOverrideAmount",
                                                  0
                                                );
                                            val.currentTarget.checked === false
                                              ? setFieldValue(
                                                  "overrideAmount",
                                                  ""
                                                )
                                              : setFieldValue(
                                                  "overrideAmount",
                                                  values.overrideAmount
                                                );
                                          }}
                                          type="checkbox"
                                          className="isOverrideAmount sizeAmount mt-2"
                                          name="isOverrideAmount"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                          disabled={refundComplete}
                                        />
                                      </div>
                                      <div
                                        className={
                                          errors.overrideAmount &&
                                          touched.overrideAmount &&
                                          values.isOverrideAmount
                                            ? "col-md-5 col-sm-offset-1 invaildPlaceholders"
                                            : "col-md-5 col-sm-offset-1"
                                        }
                                      >
                                        <NumberFormat
                                          placeholder={
                                            values.overrideAmount === 0
                                              ? "$0.00"
                                              : "$0.00"
                                          }
                                          thousandSeparator={true}
                                          prefix={"$"}
                                          allowNegative={false}
                                          disabled={
                                            values.isOverrideAmount === 1 &&
                                            !refundComplete
                                              ? false
                                              : true
                                          }
                                          // maxLength={
                                          //   values.overrideAmount === 0
                                          //     ? 14
                                          //     : 16
                                          // }
                                          name="overrideAmount"
                                          id="overrideAmount"
                                          fixedDecimalScale={2}
                                          decimalScale={2}
                                          allowLeadingZeros={true}
                                          value={
                                            values.overrideAmount
                                            // ? values.overrideAmount
                                            // : ""
                                          }
                                          onValueChange={(
                                            values,
                                            sourceInfo
                                          ) => {
                                            const { floatValue } = values;
                                            const {
                                              event,
                                              source,
                                            } = sourceInfo;
                                            setFieldValue(
                                              "overrideAmount",
                                              floatValue
                                            );
                                          }}
                                          className={
                                            "text form-control" +
                                            (errors.overrideAmount &&
                                            touched.overrideAmount &&
                                            values.isOverrideAmount
                                              ? " is-invalid "
                                              : "")
                                          }
                                          style={{ paddingRight: "10px" }}
                                        />
                                      </div>
                                    </div>
                                    <div style={{ width: "570px" }}>
                                      {" "}
                                      <hr className="headerBorder" />
                                    </div>

                                    <div className="row mt-2">
                                      <div className="col-1"></div>
                                      <div className="col-sm-4">
                                        <p className="fw-bold text-end">
                                          {OTHERFEES}
                                        </p>
                                      </div>
                                      <div className="col-md-7"></div>
                                      <div className="col-1"></div>
                                      <div className="col-sm-4">
                                        <p
                                          className={
                                            "text-end mt-2 " +
                                            ((errors.compensationPayment &&
                                              touched.compensationPayment &&
                                              values.isCompensationPayment) ||
                                            (values.compensationPayment ===
                                              undefined &&
                                              values.isCompensationPayment ===
                                                true)
                                              ? " is-invalid-label required-field fw-bold "
                                              : values.isCompensationPayment ===
                                                true
                                              ? "required-field"
                                              : "")
                                          }
                                        >
                                          {COMPENSATIONAMOUNT}
                                        </p>
                                      </div>
                                      <div className="col-1"></div>
                                      <div className="col-md-1 mt-2">
                                        <Field
                                          disabled={refundComplete}
                                          onChange={(val) => {
                                            setFieldValue(
                                              "isCompensationPayment",
                                              val.currentTarget.checked
                                            );
                                            val.currentTarget.checked === false
                                              ? setFieldValue(
                                                  "compensationPayment",
                                                  ""
                                                )
                                              : setFieldValue(
                                                  "compensationPayment",
                                                  values.compensationPayment
                                                );
                                          }}
                                          type="checkbox"
                                          className="isCompensationPayment mt-1"
                                          name="isCompensationPayment"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                        />
                                      </div>
                                      <div
                                        className={
                                          (errors.compensationPayment &&
                                            touched.compensationPayment &&
                                            values.isCompensationPayment) ||
                                          (values.compensationPayment ===
                                            undefined &&
                                            values.isCompensationPayment ===
                                              true)
                                            ? "col-md-5 col-sm-offset-1 invaildPlaceholders"
                                            : "col-md-5 col-sm-offset-1"
                                        }
                                      >
                                        <NumberFormat
                                          thousandSeparator={true}
                                          placeholder={
                                            values.isCompensationPayment ===
                                            false
                                              ? "N/A"
                                              : "T.B.A."
                                          }
                                          prefix={"$"}
                                          allowNegative={false}
                                          disabled={
                                            values.isCompensationPayment ===
                                              true && !refundComplete
                                              ? false
                                              : true
                                          }
                                          // maxLength={
                                          //   values.compensationPayment === 0 ||
                                          //   values.compensationPayment === ""
                                          //     ? 14
                                          //     : 16
                                          // }
                                          name="compensationPayment"
                                          id="compensationPayment"
                                          fixedDecimalScale={2}
                                          decimalScale={2}
                                          value={values.compensationPayment}
                                          onValueChange={(values) => {
                                            const { floatValue } = values;
                                            setFieldValue(
                                              "compensationPayment",
                                              floatValue
                                            );
                                          }}
                                          className={
                                            values.isCompensationPayment ===
                                            false
                                              ? "text form-control"
                                              : "text form-control" +
                                                ((errors.compensationPayment &&
                                                  touched.compensationPayment &&
                                                  values.isCompensationPayment) ||
                                                values.compensationPayment ===
                                                  undefined
                                                  ? " is-invalid "
                                                  : "")
                                          }
                                          style={{ paddingRight: "10px" }}
                                        />
                                      </div>
                                      <div className="col-1 "></div>
                                      <div className="col-sm-4">
                                        <p
                                          className={
                                            "text-end mt-2 " +
                                            ((errors.hardshipSupplement &&
                                              touched.hardshipSupplement &&
                                              values.isHardshipSupplement) ||
                                            (values.hardshipSupplement ===
                                              undefined &&
                                              values.isHardshipSupplement ===
                                                true)
                                              ? " is-invalid-label required-field fw-bold "
                                              : values.isHardshipSupplement ===
                                                true
                                              ? "required-field"
                                              : "")
                                          }
                                        >
                                          {HARDSHIPSUPPLIMENT}
                                        </p>
                                      </div>
                                      <div className="col-1"></div>
                                      <div className="col-md-1 mt-2">
                                        <Field
                                          onChange={(val) => {
                                            setFieldValue(
                                              "isHardshipSupplement",
                                              val.currentTarget.checked
                                            );
                                            val.currentTarget.checked === false
                                              ? setFieldValue(
                                                  "hardshipSupplement",
                                                  ""
                                                )
                                              : setFieldValue(
                                                  "hardshipSupplement",
                                                  values.hardshipSupplement
                                                );
                                          }}
                                          type="checkbox"
                                          className="isHardshipSupplement mt-1"
                                          name="isHardshipSupplement"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                          disabled={refundComplete}
                                        />
                                      </div>
                                      <div
                                        className={
                                          (errors.hardshipSupplement &&
                                            touched.hardshipSupplement &&
                                            values.isHardshipSupplement) ||
                                          (values.hardshipSupplement ===
                                            undefined &&
                                            values.isHardshipSupplement ===
                                              true)
                                            ? "col-md-5 col-sm-offset-1 invaildPlaceholders"
                                            : "col-md-5 col-sm-offset-1"
                                        }
                                      >
                                        <NumberFormat
                                          thousandSeparator={true}
                                          placeholder={
                                            values.isHardshipSupplement ===
                                            false
                                              ? "N/A"
                                              : "T.B.A."
                                          }
                                          prefix={"$"}
                                          allowNegative={false}
                                          disabled={
                                            values.isHardshipSupplement ===
                                              true && !refundComplete
                                              ? false
                                              : true
                                          }
                                          // maxLength={
                                          //   values.hardshipSupplement === 0 ||
                                          //   values.hardshipSupplement === ""
                                          //     ? 14
                                          //     : 16
                                          // }
                                          name="hardshipSupplement"
                                          id="hardshipSupplement"
                                          fixedDecimalScale={2}
                                          decimalScale={2}
                                          value={values.hardshipSupplement}
                                          onValueChange={(values) => {
                                            const { floatValue } = values;
                                            setFieldValue(
                                              "hardshipSupplement",
                                              floatValue
                                            );
                                          }}
                                          className={
                                            values.isHardshipSupplement ===
                                            false
                                              ? "text form-control"
                                              : "text form-control" +
                                                ((errors.hardshipSupplement &&
                                                  touched.hardshipSupplement &&
                                                  values.isHardshipSupplement) ||
                                                values.hardshipSupplement ===
                                                  undefined
                                                  ? " is-invalid "
                                                  : "")
                                          }
                                          style={{ paddingRight: "10px" }}
                                        />
                                      </div>
                                      <div className="col-sm-6 ">
                                        <Button
                                          className="btn btn-block btn-light addbtn"
                                          onClick={handleOpenAdditional}
                                          style={{
                                            marginLeft: "60px",
                                            pointerEvents: refundComplete
                                              ? "none"
                                              : "",
                                          }}
                                        >
                                          <small
                                            style={{ fontSize: "14px" }}
                                            className={
                                              " " +
                                              ((errors.additionalServices &&
                                                touched.additionalServices &&
                                                values.isAdditionalServices) ||
                                              (values.additionalServices ===
                                                undefined &&
                                                values.isAdditionalServices ===
                                                  true)
                                                ? " is-invalid-label required-field fw-bold"
                                                : values.isAdditionalServices ===
                                                  true
                                                ? "required-field"
                                                : "")
                                            }
                                          >
                                            {ADDITIONSERVICES}
                                          </small>
                                        </Button>
                                        <i
                                          className="fa fa-info-circle fa-lg mt-2"
                                          aria-hidden="true"
                                          onClick={() =>
                                            onHandleMessage2(
                                              INFO,
                                              ADDITIONSERVICES,
                                              ADDITIONAL.TEXT
                                            )
                                          }
                                          style={{
                                            cursor: "pointer",
                                            paddingLeft: "7px",
                                          }}
                                        ></i>
                                      </div>
                                      {/* <div className="col-1 mt-2">
                                        {' '}
                                       
                                      </div> */}
                                      <div className="col-md-1 mt-2">
                                        <Field
                                          onChange={(val) => {
                                            setFieldValue(
                                              "isAdditionalServices",
                                              val.currentTarget.checked
                                            );
                                            val.currentTarget.checked === false
                                              ? setFieldValue(
                                                  "additionalServices",
                                                  ""
                                                )
                                              : setFieldValue(
                                                  "additionalServices",
                                                  values.additionalServices
                                                );
                                          }}
                                          type="checkbox"
                                          className="isAdditionalServices "
                                          name="isAdditionalServices"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                          disabled={refundComplete}
                                        />
                                      </div>
                                      <div
                                        className={
                                          (errors.additionalServices &&
                                            touched.additionalServices &&
                                            values.isAdditionalServices) ||
                                          (values.additionalServices ===
                                            undefined &&
                                            values.isAdditionalServices ===
                                              true)
                                            ? "col-md-5 col-sm-offset-1 invaildPlaceholders"
                                            : "col-md-5 col-sm-offset-1"
                                        }
                                      >
                                        <NumberFormat
                                          thousandSeparator={true}
                                          placeholder={
                                            values.isAdditionalServices ===
                                            false
                                              ? "N/A"
                                              : "T.B.A."
                                          }
                                          prefix={"$"}
                                          allowNegative={false}
                                          disabled={
                                            values.isAdditionalServices ===
                                              true && !refundComplete
                                              ? false
                                              : true
                                          }
                                          // maxLength={
                                          //   values.additionalServices === 0 ||
                                          //   values.additionalServices === ""
                                          //     ? 14
                                          //     : 16
                                          // }
                                          name="additionalServices"
                                          id="additionalServices"
                                          fixedDecimalScale={2}
                                          decimalScale={2}
                                          value={values.additionalServices}
                                          onValueChange={(values) => {
                                            const { floatValue } = values;
                                            setFieldValue(
                                              "additionalServices",
                                              floatValue
                                            );
                                          }}
                                          className={
                                            values.isAdditionalServices ===
                                            false
                                              ? "text form-control"
                                              : "text form-control" +
                                                ((errors.additionalServices &&
                                                  touched.additionalServices &&
                                                  values.isAdditionalServices) ||
                                                values.additionalServices ===
                                                  undefined
                                                  ? " is-invalid "
                                                  : "")
                                          }
                                          style={{ paddingRight: "10px" }}
                                        />
                                      </div>
                                      <div className="col-1 "></div>
                                      <div className="col-sm-4">
                                        <p
                                          // className="text-end mt-2"
                                          className={
                                            "text-end mt-2 " +
                                            ((errors.otherCharges &&
                                              touched.otherCharges &&
                                              values.isOtherCharges) ||
                                            (values.otherCharges ===
                                              undefined &&
                                              values.isOtherCharges === true)
                                              ? " is-invalid-label required-field fw-bold "
                                              : values.isOtherCharges === true
                                              ? "required-field"
                                              : "")
                                          }
                                        >
                                          {OTHERCHARGES}
                                        </p>
                                      </div>
                                      <div className="col-1"></div>
                                      <div className="col-md-1 mt-2">
                                        <Field
                                          onChange={(val) => {
                                            setFieldValue(
                                              "isOtherCharges",
                                              val.currentTarget.checked
                                            );
                                            val.currentTarget.checked === false
                                              ? setFieldValue(
                                                  "otherCharges",
                                                  ""
                                                )
                                              : setFieldValue(
                                                  "otherCharges",
                                                  values.otherCharges
                                                );
                                          }}
                                          type="checkbox"
                                          className="isOtherCharges "
                                          name="isOtherCharges"
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                          disabled={refundComplete}
                                        />
                                      </div>
                                      <div
                                        className={
                                          (errors.otherCharges &&
                                            touched.otherCharges &&
                                            values.isOtherCharges) ||
                                          (values.otherCharges === undefined &&
                                            values.isOtherCharges === true)
                                            ? "col-md-5 col-sm-offset-1 invaildPlaceholders"
                                            : "col-md-5 col-sm-offset-1"
                                        }
                                      >
                                        <NumberFormat
                                          thousandSeparator={true}
                                          placeholder={
                                            values.isOtherCharges === false
                                              ? "N/A"
                                              : "T.B.A."
                                          }
                                          prefix={"$"}
                                          allowNegative={false}
                                          disabled={
                                            values.isOtherCharges === true &&
                                            !refundComplete
                                              ? false
                                              : true
                                          }
                                          // maxLength={
                                          //   values.otherCharges === 0 ||
                                          //   values.otherCharges === ""
                                          //     ? 14
                                          //     : 16
                                          // }
                                          name="otherCharges"
                                          id="otherCharges"
                                          fixedDecimalScale={2}
                                          decimalScale={2}
                                          value={values.otherCharges}
                                          onValueChange={(values) => {
                                            const { floatValue } = values;
                                            setFieldValue(
                                              "otherCharges",
                                              floatValue
                                            );
                                          }}
                                          className={
                                            values.isOtherCharges === false
                                              ? "text form-control"
                                              : "text form-control" +
                                                ((errors.otherCharges &&
                                                  touched.otherCharges &&
                                                  values.isOtherCharges) ||
                                                values.otherCharges ===
                                                  undefined
                                                  ? " is-invalid "
                                                  : "")
                                          }
                                          style={{ paddingRight: "10px" }}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ width: "570px" }}>
                                      {" "}
                                      <hr className="headerBorder" />
                                    </div>
                                    <div className="row ">
                                      <div className="col-1"></div>
                                      <div className="col-sm-4">
                                        <p className="fw-bold text-end">
                                          {MEANSTESTEDFEES}
                                        </p>
                                      </div>

                                      <div className="col-md-7"></div>

                                      <div className="col-1"></div>
                                      <div className="col-sm-4">
                                        <p className="text-end mt-2">
                                          {MEANSTESTEDCAREFEES}
                                        </p>
                                      </div>
                                      <div className="col-1"></div>
                                      <div className="col-md-6 col-sm-offset-1 mb-2">
                                        <NumberFormat
                                          placeholder={
                                            values.meansTestedCareFee ===
                                              undefined ||
                                            values.meansTestedCareFee === ""
                                              ? "T.B.A"
                                              : "$0.00"
                                          }
                                          thousandSeparator={true}
                                          prefix={"$"}
                                          allowNegative={false}
                                          name="meansTestedCareFee"
                                          id="meansTestedCareFee"
                                          fixedDecimalScale={2}
                                          decimalScale={2}
                                          // maxLength={
                                          //   values.meansTestedCareFee === 0
                                          //     ? 14
                                          //     : 16
                                          // }
                                          value={values.meansTestedCareFee}
                                          onValueChange={(values) => {
                                            const { floatValue } = values;
                                            setFieldValue(
                                              "meansTestedCareFee",
                                              floatValue
                                            );
                                          }}
                                          className="form-control input-sm"
                                          disabled={refundComplete}
                                        />
                                      </div>
                                    </div>
                                    <div style={{ width: "570px" }}>
                                      {" "}
                                      <hr className="headerBorder" />
                                    </div>
                                    <div className="row">
                                      <div className="col-1"></div>
                                      <div className="col-sm-4">
                                        <p className="text-end fw-bold mt-2">
                                          {TOTALSTARTINGDAILYFEES}
                                        </p>
                                      </div>
                                      <div className="col-1"></div>

                                      <div className="col-md-6 col-sm-offset-1 mb-2">
                                        <NumberFormat
                                          thousandSeparator={true}
                                          prefix={"$"}
                                          allowNegative={false}
                                          disabled
                                          fixedDecimalScale={2}
                                          decimalScale={2}
                                          value={
                                            (Number(values.overrideAmount) > 0
                                              ? Number(values.overrideAmount)
                                              : Number(values.amount)) +
                                            Number(
                                              values.compensationPayment
                                                ? values.compensationPayment
                                                : 0
                                            ) -
                                            Number(
                                              values.hardshipSupplement
                                                ? values.hardshipSupplement
                                                : 0
                                            ) +
                                            Number(
                                              values.additionalServices
                                                ? values.additionalServices
                                                : 0
                                            ) +
                                            Number(
                                              values.otherCharges
                                                ? values.otherCharges
                                                : 0
                                            ) +
                                            Number(
                                              values.meansTestedCareFee
                                                ? values.meansTestedCareFee
                                                : 0
                                            )
                                          }
                                          className="form-control input-sm fw-bold"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* EXTRASERVICE */}
                          {isExtra === true ? (
                            <div className="col-sm-6">
                              <div className="head mt-3">
                                <img src={Icon} className="icon" />
                                {EXTRASERVICE}
                              </div>
                              <hr className="headerBorder" />
                              <div className="container">
                                <div className="row">
                                  <div className="row ">
                                    {EXTRASERVICEINCLUDED}
                                    <div
                                      className="col-sm-7"
                                      style={{
                                        marginLeft: "17px",
                                        marginTop: "-4px",
                                      }}
                                    >
                                      <Field
                                        checked={
                                          isExtra === true ? true : false
                                        }
                                        type="checkbox"
                                        className="isExtraServiceIncluded mt-1"
                                        name="isExtraServiceIncluded"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                        }}
                                        disabled={refundComplete}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="row mt-2">
                                  <div className="col-sm-2 text-end">
                                    <Label
                                      style={{ textAlign: "right" }}
                                      htmlFor="extraServiceTypeId"
                                      column
                                      className={
                                        errors.extraServiceTypeId &&
                                        touched.extraServiceTypeId &&
                                        isExtra === true
                                          ? "is-invalid-label required-field"
                                          : "required-field"
                                      }
                                    >
                                      Type
                                    </Label>
                                  </div>
                                  <div className="col-sm-7 mt-1">
                                    <SingleSelect
                                      name="extraServiceTypeId"
                                      ref={selectInputRef}
                                      options={extraServiceCharge.map((x) => {
                                        return {
                                          value: x.id,
                                          label: x.extraServiceChargeLevel,
                                          cost: x.extraServiceFee,
                                          reduction: x.extraServiceReduction,
                                        };
                                      })}
                                      error={
                                        errors.extraServiceTypeId &&
                                        touched.extraServiceTypeId
                                      }
                                      onChange={(selected) => {
                                        setSelectedDefaultExtra(selected);
                                        if (selected === null) {
                                          return;
                                        } else {
                                          setFieldValue(
                                            "extraServiceTypeId",
                                            selected.value
                                          );
                                        }
                                        setFieldValue(
                                          "extraServiceCost",
                                          selected.cost
                                        );

                                        setFieldValue(
                                          "extraServiceReduction",
                                          selected.reduction
                                        );
                                      }}
                                      value={selectedDefaultExtra}
                                    />
                                    {isExtra === true ? (
                                      <InlineBottomErrorMessage name="extraServiceTypeId" />
                                    ) : null}
                                  </div>
                                </div>
                                <div className="row mt-2">
                                  <div className="col-sm-4"></div>
                                  <div className="col-sm-1 text-end">
                                    <p className="extra-service-labels">
                                      {COST}
                                    </p>
                                  </div>
                                  <div className="col-sm-4">
                                    <NumberFormat
                                      thousandSeparator={true}
                                      prefix={"$"}
                                      placeholder="$0.00"
                                      allowNegative={false}
                                      disabled
                                      name="extraServiceCost"
                                      id="extraServiceCost"
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      value={
                                        isExtra === true
                                          ? values.extraServiceCost
                                          : ""
                                      }
                                      className="form-control input-sm"
                                    />
                                  </div>
                                </div>
                                <div className="row mt-2">
                                  <div className="col-sm-2"></div>
                                  <div className="col-sm-3 text-end mt-1">
                                    <p
                                      // className="mt-1"
                                      className={
                                        errors.extraServiceOverrideCost &&
                                        touched.extraServiceOverrideCost &&
                                        values.isExtraServiceOverrideCost &&
                                        values.extraServiceOverrideCost <= 0
                                          ? "is-invalid-label required-field"
                                          : values.isExtraServiceOverrideCost ===
                                            true
                                          ? "required-field"
                                          : ""
                                      }
                                    >
                                      {OVERRIDE} {COST}
                                    </p>
                                  </div>
                                  <div
                                    className="col-md-1"
                                    style={{ marginTop: "3px" }}
                                  >
                                    <Field
                                      onChange={(val) => {
                                        setFieldValue(
                                          "isExtraServiceOverrideCost",
                                          val.currentTarget.checked
                                        );
                                        val.currentTarget.checked === false
                                          ? setFieldValue(
                                              "extraServiceOverrideCost",
                                              ""
                                            )
                                          : setFieldValue(
                                              "extraServiceOverrideCost",
                                              values.extraServiceOverrideCost
                                            );
                                      }}
                                      type="checkbox"
                                      className="isExtraServiceOverrideCost mt-2 pt-2"
                                      name="isExtraServiceOverrideCost"
                                      style={{ width: "20px", height: "20px" }}
                                      disabled={
                                        isExtra === false ? true : false
                                      }
                                    />
                                  </div>
                                  <div className="col-sm-3">
                                    <NumberFormat
                                      thousandSeparator={true}
                                      placeholder="$0.00"
                                      prefix={"$"}
                                      allowNegative={false}
                                      disabled={
                                        values.isExtraServiceOverrideCost ===
                                        true
                                          ? false
                                          : true
                                      }
                                      // maxLength={
                                      //   values.extraServiceOverrideCost === 0
                                      //     ? 14
                                      //     : 16
                                      // }
                                      name="extraServiceOverrideCost"
                                      id="extraServiceOverrideCost"
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      value={
                                        values.extraServiceOverrideCost
                                        // || 0
                                      }
                                      onValueChange={(values) => {
                                        const { floatValue } = values;
                                        setFieldValue(
                                          "extraServiceOverrideCost",
                                          floatValue
                                        );
                                      }}
                                      className={
                                        "text form-control text-end" +
                                        (errors.extraServiceOverrideCost &&
                                        touched.extraServiceOverrideCost &&
                                        values.isExtraServiceOverrideCost
                                          ? " is-invalid "
                                          : "")
                                      }
                                      style={{ paddingRight: "10px" }}
                                    />
                                  </div>
                                </div>

                                <div className="row mt-2">
                                  <div className="col-sm-2 text-end">
                                    <p>{EXTRASERVICEREDUCTION}</p>
                                  </div>
                                  <div className="col-sm-7">
                                    <NumberFormat
                                      thousandSeparator={true}
                                      prefix={"$"}
                                      placeholder="$0.00"
                                      allowNegative={false}
                                      disabled
                                      name="extraServiceReduction"
                                      id="extraServiceReduction"
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      value={
                                        isExtra
                                          ? values.extraServiceReduction
                                          : ""
                                      }
                                      className="form-control input-sm"
                                    />
                                  </div>
                                </div>

                                <div className="row mt-2">
                                  <div className="col-sm-2 text-end">
                                    <p
                                      style={{
                                        marginTop: "10px",
                                        width: "max-content",
                                      }}
                                      className={
                                        errors.extraServiceOverrideReduction &&
                                        touched.extraServiceOverrideReduction &&
                                        values.isExtraServiceOverrideReduction &&
                                        values.extraServiceOverrideReduction <=
                                          0
                                          ? "is-invalid-label required-field"
                                          : values.isExtraServiceOverrideReduction ===
                                            true
                                          ? "required-field"
                                          : ""
                                      }
                                    >
                                      {OVERRIDEREDUCTION}
                                    </p>
                                  </div>
                                  <div className="col-sm-1">
                                    <Field
                                      onChange={(val) => {
                                        setFieldValue(
                                          "isExtraServiceOverrideReduction",
                                          val.currentTarget.checked
                                        );
                                        val.currentTarget.checked === false
                                          ? setFieldValue(
                                              "extraServiceOverrideReduction",
                                              ""
                                            )
                                          : setFieldValue(
                                              "extraServiceOverrideReduction",
                                              values.extraServiceOverrideReduction
                                            );
                                      }}
                                      type="checkbox"
                                      className="isExtraServiceOverrideReduction mt-3 pt-2"
                                      name="isExtraServiceOverrideReduction"
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginTop: "10px",
                                      }}
                                      disabled={
                                        isExtra === false ? true : false
                                      }
                                    />
                                  </div>
                                  <div className="col-sm-6">
                                    <NumberFormat
                                      thousandSeparator={true}
                                      placeholder="$0.00"
                                      prefix={"$"}
                                      allowNegative={false}
                                      disabled={
                                        values.isExtraServiceOverrideReduction ===
                                        true
                                          ? false
                                          : true
                                      }
                                      // maxLength={
                                      //   values.extraServiceOverrideReduction ===
                                      //   0
                                      //     ? 14
                                      //     : 16
                                      // }
                                      name="extraServiceOverrideReduction"
                                      id="extraServiceOverrideReduction"
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      value={
                                        values.extraServiceOverrideReduction
                                        // ? values.extraServiceOverrideReduction
                                        // : ""
                                      }
                                      onValueChange={(values) => {
                                        const { floatValue } = values;
                                        setFieldValue(
                                          "extraServiceOverrideReduction",
                                          floatValue
                                        );
                                      }}
                                      className={
                                        "text form-control text-end" +
                                        (errors.extraServiceOverrideReduction &&
                                        touched.extraServiceOverrideReduction &&
                                        values.isExtraServiceOverrideReduction
                                          ? " is-invalid "
                                          : "")
                                      }
                                      style={{ paddingRight: "10px" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="col-sm-6">
                              <div className="head mt-3">
                                <img src={Icon} className="icon" />
                                {EXTRASERVICE}
                              </div>
                              <hr className="headerBorder" />
                              <div className="container">
                                <div className="row">
                                  <div
                                    className="row "
                                    style={{ marginLeft: "0px" }}
                                  >
                                    {EXTRASERVICEINCLUDED}
                                    <div
                                      className="col-sm-7"
                                      style={{
                                        marginLeft: "8px",
                                        marginTop: "-4px",
                                      }}
                                    >
                                      <Field
                                        onChange={(val) => {
                                          setFieldValue(
                                            "isExtraServiceIncluded",
                                            val.currentTarget.checked
                                          );
                                          if (
                                            val.currentTarget.checked ===
                                              false &&
                                            isExtra === false
                                          ) {
                                            setFieldValue(
                                              "extraServiceTypeId",
                                              0
                                            );
                                            setFieldValue(
                                              "extraServiceCost",
                                              0
                                            );
                                            setFieldValue(
                                              "extraServiceReduction",
                                              0
                                            );
                                            setSelectedDefaultExtra(null);
                                          }
                                          setFieldValue(
                                            "isExtraServiceOverrideCost",
                                            (val.currentTarget.checked = false)
                                          );
                                          setFieldValue(
                                            "isExtraServiceOverrideReduction",
                                            (val.currentTarget.checked = false)
                                          );

                                          val.currentTarget.checked === false
                                            ? setFieldValue(
                                                "extraServiceOverrideCost",
                                                ""
                                              )
                                            : setFieldValue(
                                                "extraServiceOverrideCost",
                                                values.extraServiceOverrideCost
                                              );

                                          val.currentTarget.checked === false
                                            ? setFieldValue(
                                                "extraServiceOverrideReduction",
                                                ""
                                              )
                                            : setFieldValue(
                                                "extraServiceOverrideReduction",
                                                values.extraServiceOverrideReduction
                                              );
                                        }}
                                        onClick={() => {
                                          if (selectInputRef === undefined) {
                                            return;
                                          } else {
                                            // selectInputRef.current.clearValue();
                                            setSelectedDefaultExtra(0);
                                          }
                                        }}
                                        type="checkbox"
                                        className="isExtraServiceIncluded mt-1"
                                        name="isExtraServiceIncluded"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                        }}
                                        disabled={refundComplete}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    errors.extraServiceTypeId &&
                                    touched.extraServiceTypeId
                                      ? "row mt-2 invaildPlaceholders"
                                      : "row mt-2"
                                  }
                                >
                                  <div className="col-sm-2 text-end">
                                    <Label
                                      style={{
                                        textAlign: "right",
                                        marginTop: "12px",
                                      }}
                                      htmlFor="extraServiceTypeId"
                                      column
                                      className={
                                        errors.extraServiceTypeId &&
                                        touched.extraServiceTypeId &&
                                        values.isExtraServiceIncluded &&
                                        values.extraServiceTypeId <= 0
                                          ? "is-invalid-label required-field"
                                          : values.isExtraServiceIncluded ===
                                            true
                                          ? "required-field"
                                          : ""
                                      }
                                    >
                                      Type
                                    </Label>
                                    {/* <p className="extra-service-labels">{TYPE}</p> */}
                                  </div>
                                  <div className="col-sm-7 mt-1">
                                    <SingleSelect
                                      name="extraServiceTypeId"
                                      ref={selectInputRef}
                                      isDisabled={
                                        values.isExtraServiceIncluded === true
                                          ? false
                                          : true
                                      }
                                      options={extraServiceCharge.map((x) => {
                                        return {
                                          value: x.id,
                                          label: x.extraServiceChargeLevel,
                                          cost: x.extraServiceFee,
                                          reduction: x.extraServiceReduction,
                                        };
                                      })}
                                      error={
                                        errors.extraServiceTypeId &&
                                        touched.extraServiceTypeId &&
                                        values.isExtraServiceIncluded &&
                                        values.extraServiceTypeId <= 0
                                      }
                                      onChange={(selected) => {
                                        setSelectedDefaultExtra(selected);
                                        if (selected === null) {
                                          return;
                                        } else {
                                          setFieldValue(
                                            "extraServiceTypeId",
                                            selected.value
                                          );
                                        }
                                        setFieldValue(
                                          "extraServiceCost",
                                          selected.cost
                                        );

                                        setFieldValue(
                                          "extraServiceReduction",
                                          selected.reduction
                                        );
                                      }}
                                      value={selectedDefaultExtra}
                                      // theme={reactSelectTheme(
                                      //   errors.extraServiceTypeId &&
                                      //     touched.extraServiceTypeId &&
                                      //     values.isExtraServiceIncluded &&
                                      //     values.extraServiceTypeId <= 0
                                      // )}
                                      // styles={selectStyle}
                                    />
                                    {values.isExtraServiceIncluded &&
                                    values.extraServiceTypeId <= 0 ? (
                                      <InlineBottomErrorMessage name="extraServiceTypeId" />
                                    ) : null}
                                  </div>
                                </div>
                                <div className="row mt-2">
                                  <div className="col-sm-4"></div>
                                  <div className="col-sm-1 text-end">
                                    <p className="extra-service-labels">
                                      {COST}
                                    </p>
                                  </div>
                                  <div className="col-sm-4">
                                    <NumberFormat
                                      thousandSeparator={true}
                                      prefix={"$"}
                                      allowNegative={false}
                                      disabled
                                      placeholder="$0.00"
                                      name="extraServiceCost"
                                      id="extraServiceCost"
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      value={
                                        values.isExtraServiceIncluded === true
                                          ? values.extraServiceCost
                                          : ""
                                      }
                                      className="form-control input-sm"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={
                                    errors.extraServiceOverrideCost &&
                                    touched.extraServiceOverrideCost &&
                                    values.isExtraServiceOverrideCost &&
                                    values.extraServiceOverrideCost <= 0
                                      ? "row mt-2 invaildPlaceholders"
                                      : "row mt-2"
                                  }
                                >
                                  <div className="col-sm-2"></div>
                                  <div className="col-sm-3 text-end mt-1">
                                    <p
                                      // className="mt-1"
                                      className={
                                        errors.extraServiceOverrideCost &&
                                        touched.extraServiceOverrideCost &&
                                        values.isExtraServiceOverrideCost &&
                                        values.extraServiceOverrideCost <= 0
                                          ? "is-invalid-label required-field"
                                          : values.isExtraServiceOverrideCost ===
                                            true
                                          ? "required-field"
                                          : ""
                                      }
                                    >
                                      {OVERRIDE} {COST}
                                    </p>
                                  </div>
                                  <div
                                    className="col-md-1"
                                    style={{
                                      marginTop: "3px",
                                      marginRight: "-30px",
                                    }}
                                  >
                                    <Field
                                      onChange={(val) => {
                                        setFieldValue(
                                          "isExtraServiceOverrideCost",
                                          val.currentTarget.checked
                                        );
                                        val.currentTarget.checked === false
                                          ? setFieldValue(
                                              "extraServiceOverrideCost",
                                              ""
                                            )
                                          : setFieldValue(
                                              "extraServiceOverrideCost",
                                              values.extraServiceOverrideCost
                                            );
                                      }}
                                      type="checkbox"
                                      className="isExtraServiceOverrideCost mt-2 pt-2"
                                      name="isExtraServiceOverrideCost"
                                      style={{ width: "20px", height: "20px" }}
                                      disabled={
                                        values.isExtraServiceIncluded === false
                                          ? true
                                          : false
                                      }
                                    />
                                  </div>
                                  <div
                                    className="col-sm-3"
                                    style={{ width: "28.4%" }}
                                  >
                                    <NumberFormat
                                      thousandSeparator={true}
                                      placeholder="$0.00"
                                      prefix={"$"}
                                      allowNegative={false}
                                      disabled={
                                        values.isExtraServiceOverrideCost ===
                                        true
                                          ? false
                                          : true
                                      }
                                      // maxLength={
                                      //   values.extraServiceOverrideCost === 0
                                      //     ? 14
                                      //     : 16
                                      // }
                                      name="extraServiceOverrideCost"
                                      id="extraServiceOverrideCost"
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      value={values.extraServiceOverrideCost}
                                      onValueChange={(values) => {
                                        const { floatValue } = values;
                                        setFieldValue(
                                          "extraServiceOverrideCost",
                                          floatValue
                                        );
                                      }}
                                      className={
                                        "text form-control" +
                                        (errors.extraServiceOverrideCost &&
                                        touched.extraServiceOverrideCost &&
                                        values.isExtraServiceOverrideCost
                                          ? " is-invalid "
                                          : "")
                                      }
                                      style={{ paddingRight: "10px" }}
                                    />
                                  </div>
                                </div>

                                <div className="row mt-2">
                                  <div className="col-sm-2 text-end mt-2">
                                    <p
                                      style={{
                                        width: "max-content",
                                        marginLeft: "-9px",
                                      }}
                                    >
                                      {EXTRASERVICEREDUCTION}
                                    </p>
                                  </div>
                                  <div className="col-sm-7">
                                    <NumberFormat
                                      thousandSeparator={true}
                                      prefix={"$"}
                                      placeholder="$0.00"
                                      allowNegative={false}
                                      disabled
                                      name="extraServiceReduction"
                                      id="extraServiceReduction"
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      value={
                                        values.isExtraServiceIncluded
                                          ? values.extraServiceReduction
                                          : ""
                                      }
                                      className="form-control input-sm"
                                    />
                                  </div>
                                </div>

                                <div
                                  className={
                                    errors.extraServiceOverrideReduction &&
                                    touched.extraServiceOverrideReduction &&
                                    values.isExtraServiceOverrideReduction &&
                                    values.extraServiceOverrideReduction <= 0
                                      ? "row mt-2 invaildPlaceholders"
                                      : "row mt-2"
                                  }
                                >
                                  <div className="col-sm-2 text-end">
                                    <p
                                      style={{
                                        marginTop: "10px",
                                        width: "max-content",
                                      }}
                                      className={
                                        errors.extraServiceOverrideReduction &&
                                        touched.extraServiceOverrideReduction &&
                                        values.isExtraServiceOverrideReduction &&
                                        values.extraServiceOverrideReduction <=
                                          0
                                          ? "is-invalid-label required-field"
                                          : values.isExtraServiceOverrideReduction ===
                                            true
                                          ? "required-field"
                                          : ""
                                      }
                                    >
                                      {OVERRIDEREDUCTION}
                                    </p>
                                  </div>
                                  <div className="col-sm-1">
                                    <Field
                                      onChange={(val) => {
                                        setFieldValue(
                                          "isExtraServiceOverrideReduction",
                                          val.currentTarget.checked
                                        );
                                        val.currentTarget.checked === false
                                          ? setFieldValue(
                                              "extraServiceOverrideReduction",
                                              ""
                                            )
                                          : setFieldValue(
                                              "extraServiceOverrideReduction",
                                              values.extraServiceOverrideReduction
                                            );
                                      }}
                                      type="checkbox"
                                      className="isExtraServiceOverrideReduction mt-2"
                                      name="isExtraServiceOverrideReduction"
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                      }}
                                      disabled={
                                        values.isExtraServiceIncluded === false
                                          ? true
                                          : false
                                      }
                                    />
                                  </div>
                                  <div
                                    className="col-sm-6"
                                    style={{
                                      marginLeft: "-25px",
                                      width: "52.8%",
                                    }}
                                  >
                                    <NumberFormat
                                      thousandSeparator={true}
                                      placeholder="$0.00"
                                      prefix={"$"}
                                      allowNegative={false}
                                      disabled={
                                        values.isExtraServiceOverrideReduction ===
                                        true
                                          ? false
                                          : true
                                      }
                                      // maxLength={
                                      //   values.extraServiceOverrideReduction ===
                                      //   0
                                      //     ? 14
                                      //     : 16
                                      // }
                                      name="extraServiceOverrideReduction"
                                      id="extraServiceOverrideReduction"
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      value={
                                        values.extraServiceOverrideReduction
                                        // ? values.extraServiceOverrideReduction
                                        // : ""
                                      }
                                      onValueChange={(values) => {
                                        const { floatValue } = values;
                                        setFieldValue(
                                          "extraServiceOverrideReduction",
                                          floatValue
                                        );
                                      }}
                                      className={
                                        "text form-control" +
                                        (errors.extraServiceOverrideReduction &&
                                        touched.extraServiceOverrideReduction &&
                                        values.isExtraServiceOverrideReduction
                                          ? " is-invalid "
                                          : "")
                                      }
                                      style={{ paddingRight: "10px" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {showSuccessAlert && (
                      <SuccessAlert
                        type={successAlertOptions.actionType}
                        msg={successAlertOptions.msg}
                        title={successAlertOptions.title}
                        callback={successAlertOptions.callback}
                      ></SuccessAlert>
                    )}
                    {showWarningAlert && (
                      <WarningMessageModelAlert
                        warningType={title.warningType}
                        header={title.header}
                        msg={title.msg}
                        showWarningAlert={showWarningAlert}
                        setShowWarningAlert={setShowWarningAlert}
                      />
                    )}
                    {showWarningAlert2 && (
                      <RefundsWarningModal
                        warningType={title.warningType}
                        header={title.header}
                        msg={title.msg}
                        showWarningAlert={showWarningAlert2}
                        setShowWarningAlert={setShowWarningAlert2}
                      />
                    )}
                    {additionalService && (
                      <div style={{ overflowY: "scroll" }}>
                        <AdditionalServices
                          callBackAddition={callBackAddition}
                          additionalService={additionalService}
                          setAdditionalService={setAdditionalService}
                          updateAttachedChecbox={updateAttachedChecbox}
                          updateOverrideTotal={updateOverrideTotal}
                          handleCancelCallback={handleCancelCallback}
                          facilities={facilities}
                          residentId={residentId}
                          setUpdatedFacilities={setUpdatedFacilities}
                        />
                      </div>
                    )}
                  </div>
                </Page>
              </Form>
            </>
          )}
        </>
      )}
    </Formik>
  );
};
export default ViewResidentFees;
