import React, { useEffect, useState, useRef } from "react";
import { Formik, Field } from "formik";
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
import moment from "moment";

import {
  ADD,
  BY,
  CANCLE,
  CATEGOTYCHANGE,
  COMMENT,
  CURRENTPAYMENTPRICEANDMETHOD,
  DAILYEQUIVALENT,
  DAPPORTION,
  DRAWDOWN,
  EDIT,
  EFFECTIVEDATE,
  EFFECTIVEFROM,
  FIRSTCREATEDBY,
  LASTMODIFIEDBY,
  LUMPSUMEQUIVALENTPAYMNT,
  MPIR,
  MPIRCHANGE,
  NEWPAYMENTMETHOD,
  NEWPAYMENTPRICE,
  NEWSUPPORTEDCATEGORY,
  PAYMENTMETHOD,
  PAYMENTMETHODCHANGE,
  PRICECHANGE,
  RADPORTION,
  RECOVERYMETHOD,
  SUPPORTEDSTATUS,
  VARIATIONDETAILS,
  VARIATIONHISTORY,
} from "../../constant/FieldConstant";
import InlineBottomErrorMessage from "../../components/InlineBottomErrorMessage";
import commonServices from "../../services/Common/common.services";
import { CKEditor } from "ckeditor4-react";
import { CLOSE, SAVE } from "../../constant/MessageConstant";
import paymentService from "../../services/Resident/payment.service";
import ".././../css/style.css";
import ModalError from "../../components/ModalError";
import MuiDatePicker from "../../components/DatePicker/MaterialUi";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../components/NumberFormat";
import SingleSelect from "../../components/MySelect/MySelect";
// change
const AddPaymentVariationDetails = ({
  ShowModel,
  ParentCallBackToView,
  type,
  Data,
  paymentDetails,
  residentId,
  finalisedDate,
  refundComplete,
  admissionDate,
  UpdateCancelCallback,
  handleIsAdded,

  secondEffectiveDate,
}) => {
  const [currentMpir, setCurrentMpir] = useState(0);
  const [supportedCategory, setSupportedCategory] = useState([]);
  const [selectedSupportedCategory, setSelectedSupportedCategory] = useState(
    null
  );
  const [recoveryList, setRecoveryList] = useState([]);
  const [customStyle, setCustomStyle] = useState({
    width: "116px",
    marginLeft: "37%",
  });

  const getInitialValues = () => {
    return {
      effectiveDate: new Date(paymentDetails.currentEffectiveFrom),
      currentMpir: paymentDetails.currentMapir
        ? paymentDetails.currentMapir
        : "",
      lumsumEquivalent: paymentDetails.currentLumSumEquivalent
        ? paymentDetails.currentLumSumEquivalent
        : "",
      dailyEquivalent: paymentDetails.currentDailyEquivalent
        ? paymentDetails.currentDailyEquivalent
        : "",
      supportedCategoryId: paymentDetails.currentSupportedStatusId
        ? paymentDetails.currentSupportedStatusId
        : "",
      paymentMethodId: paymentDetails.currentPaymentMethodId
        ? paymentDetails.currentPaymentMethodId
        : "",
      isOverrideMPIR: false,
      radPortion: paymentDetails.currentRadPortion
        ? paymentDetails.currentRadPortion
        : "",
      dapdacPortion: paymentDetails.currentDapPortion
        ? paymentDetails.currentDapPortion
        : "",
      recoveryMethodId: paymentDetails.currentRecoveryMethodId || 0,
      isDrowdownDap: paymentDetails.currentDrawdown === "Yes" ? true : false,
      mpir: paymentDetails.currentMapir ? paymentDetails.currentMapir : "",
      changedMpir: paymentDetails.currentMapir
        ? paymentDetails.currentMapir
        : "",
      isLumSumEq: paymentDetails.currentIsLumSumEq
        ? paymentDetails.currentIsLumSumEq
        : false,
      isPaymentMethodChange: true,
      isPriceChange: true,
    };
  };
  const [show, setShow] = useState(ShowModel);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(getInitialValues());
  const [secondLastEffectiveDate, setSecondLastEffectiveDate] = useState(
    secondEffectiveDate
  );
  const [priceRangeEnabled, setpriceRangeEnabled] = useState(false);
  const [categoryChangeEnabled, setCategoryChangeEnabled] = useState(false);
  const [paymentChangeEnabled, setPaymentChangeEnabled] = useState(false);
  const [
    paymentMethodCheckboxChange,
    setPaymentMethodCheckboxChange,
  ] = useState(false);
  const ref = useRef();
  const [isLumpsum, setIsLumpsum] = useState(true);
  const [selectedRecovery, setSelectedRecovery] = useState({});
  const [showMPIRError, setShowMPIRError] = useState(false);
  const [mpirErrorMsg, setMpirErrorMsg] = useState("");
  const [originalLumsumEquivalent, setOriginalLumsumEquivalent] = useState("");
  const [originalDailyEquivalent, setOriginalDailyEquivalent] = useState("");
  const [originalGovMPIR, setOriginalGovMPIR] = useState(4.91);

  useEffect(() => {
    setShow(ShowModel);
    if (type === ADD) {
      setInitialValues(getInitialValues());
    }
  }, [ShowModel]);

  const getNewMpir = (date) => {
    console.log("date", convertDate(date));
    // moment(date).format("MM/DD/YYYY");
    commonServices
      .getMPIR(date ? date.toJSON() : new Date().toJSON())
      .then((response) => {
        setOriginalGovMPIR(response.result.feePost);
        console.log("MPIR===>", response.result.feePost);
      });
  };

  const handleClose = (values) => {
    ParentCallBackToView(!show, false);
    // setShowErrorPopup(false);

    // values.newType = type === ADD ? '' : Data.name;
    setShow(!show);
    setCategoryChangeEnabled(false);
    setPaymentChangeEnabled(false);
    setpriceRangeEnabled(false);
    if (type === ADD) {
      setInitialValues(getInitialValues());
      setSelectedPaymentMethod(null);
      setSelectedSupportedCategory(null);
      setSelectedRecovery(null);
    }
  };

  const getSupportedCategoryStatus = (supportedArr) => {
    let ind = -1;
    supportedArr.forEach((x, i) => {
      if (x.supported_category_id === paymentDetails.currentSupportedStatusId) {
        ind = i;
      }
    });
    if (supportedArr.length) {
      setSelectedSupportedCategory(supportedArr[ind]);
      setInitialValues({
        ...getInitialValues(),
        supportedCategoryId: supportedArr[ind].supported_category_id,
      });
      let id = -1;
      switch (supportedArr[ind].supported_category_id) {
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
      getPaymentMethod(id, true);
    }
  };

  const getRecoveryMethods = (participantId) => {
    commonServices.getPaymentMethod(participantId).then((response) => {
      response.forEach((x) => {
        x.label = x.name;
        x.value = x.id;
      });
      response.forEach((x) => {
        if (
          type === EDIT &&
          x.id === (Data && Data.item && Data.item.recoveryMethodId)
        ) {
          setSelectedRecovery(x);
          ref.current.recoveryMethodId = x.id;
        }
        if (type === ADD && x.id === paymentDetails.currentRecoveryMethodId) {
          setSelectedRecovery(x);
          if (ref && ref.current)
            ref.current.setFieldValue("recoveryMethodId", x.id);
        }
      });
      setRecoveryList(response);
    });
  };

  const convertDate = (dt) => {
    return `${(new Date(dt).getDate() < 10 ? "0" : "") +
      new Date(dt).getDate()}/${(new Date(dt).getMonth() < 10 ? "0" : "") +
      (new Date(dt).getMonth() + 1)}/${new Date(dt).getFullYear()}`;
  };

  useEffect(() => {
    if (paymentDetails) {
      paymentDetails.currentDrawdown =
        typeof paymentDetails.currentDrawdown === "boolean"
          ? paymentDetails.currentDrawdown
            ? "Yes"
            : "No"
          : paymentDetails.currentDrawdown;
    }
  }, [paymentDetails]);

  useEffect(() => {
    // getPaymentMethod();
    getNewMpir();
    setCurrentMpir(paymentDetails.currentMapir);
    // getNewMpir();
    let id = 3;
    if (type === EDIT && Data.item) {
      if (Data.item.supportedCategoryId === 2) {
        id = 4;
      } else {
        id = 3;
      }
    } else if (type === ADD && paymentDetails.currentSupportedStatusId) {
      if (paymentDetails.currentSupportedStatusId) {
        id = 4;
      } else {
        id = 3;
      }
    }
    getRecoveryMethods(id);
  }, []);

  // const getNewMpir = () => {
  //   let date =
  //     type === ADD
  //       ? paymentDetails.currentEffectiveFrom
  //       : Data.item.effectiveDate;
  //   console.log("date", convertDate(date));

  //   // moment(date).format("MM/DD/YYYY");

  //   commonServices
  //     .getMPIR(new Date(date) ? new Date(date).toJSON() : new Date().toJSON())
  //     .then((response) => {
  //       // console.log("MPIR===>", response.result.feePost);

  //       setCurrentMpir(
  //         (response && response.result && response.result.feePost) || 0
  //       );
  //       ref.current.setFieldValue(
  //         "mpir",
  //         (response && response.result && response.result.feePost) || 0
  //       );
  //     });
  // };

  const getSupportedCategory = () => {
    setLoading(true);
    commonServices.getSupportedCategory().then((response) => {
      setLoading(false);
      // console.log(response);
      response.map((x) => {
        x.label = x.supported_category_name;
        x.value = x.supported_category_id;
      });
      setSupportedCategory(response);
      if (type === ADD) {
        getSupportedCategoryStatus(response);
      } else {
        let selectedSupportedCateg = response.filter(
          (x) => x.supported_category_id === Data.item.supportedCategoryId
        );
        setSelectedSupportedCategory(
          selectedSupportedCateg ? selectedSupportedCateg[0] : {}
        );
        ref.current.setFieldValue(
          "supportedCategoryId",
          Data.item.supportedCategoryId,
          false
        );
      }
    });
  };

  const getPaymentMethod = (supportedCatId, setDefault = false) => {
    setLoading(true);
    commonServices.getPaymentMethod(supportedCatId).then((response) => {
      setLoading(false);

      response.map((x) => {
        x.label = x.name;
        x.value = x.name;
      });
      let id = -1;
      switch (type === EDIT ? Data.item.supportedCategoryId : 4) {
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
      let selectedPaymentMethod;
      if (type === EDIT && Data && Data.item && supportedCatId === id) {
        selectedPaymentMethod = response.filter(
          (x) => x.id === Data.item.paymentMethodId
        );
      } else if (type === ADD) {
        selectedPaymentMethod = response.filter(
          (x) => x.name === paymentDetails.currentPaymentMethod
        );
      }
      if (setDefault) {
        setSelectedPaymentMethod(
          selectedPaymentMethod ? selectedPaymentMethod[0] : null
        );

        // ref.current.setFieldValue("paymentMethodId", selectedPaymentMethod.id);
      }
      setPaymentMethod(response);
    });
  };

  const editorConfiguration = {
    removePlugins:
      "specialCharacters,elementspath,blockquote,save,elementspath,flash,iframe,pagebreak,templates,about,showblocks,newpage,language,print,div",
    extraPlugins: ["font", "justify"],
    removeButtons:
      "Undo,Redo,SpecialChar,HorizontalRule,PasteText,Scayt,Styles,HorizontalLine,Subscript,Superscript,Link,Cut,Copy,Unlink,Paste,Indent,Outdent,Format,Table,Image,Source,Anchor,PasteFromWord,Insert Special Character,Save,Print,Preview,Find,About,Maximize,ShowBlocks",
    height: "100%",
    innerWidth: 200,
    // resize: '100%',
  };
  const handleEditorChange = (event) => {
    let ckEditorData = event.editor.getData();
    // setSetterFn(event.editor.setData);
    setckEditorData(ckEditorData);
  };

  const [ckEditorData, setckEditorData] = useState("");
  // const [setterFn, setSetterFn] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [paymentMethodChanged, setpaymentMethodChanged] = useState(true);
  const [supportCategoryChanged, setSupportCategoryChanged] = useState(true);
  const [priceChange, setPriceChange] = useState(true);

  const handleChangeDate = (date) => {
    ref.current.setFieldValue(
      "effectiveDate",
      date
        ? new Date(new Date(date).setHours(new Date().getHours())).toJSON()
        : ""
    );
    // console.log(
    //   date
    //     ? new Date(new Date(date).setHours(new Date().getHours())).toJSON()
    //     : ""
    // );
  };

  const selectStyle = {
    control: (base, state) => ({
      ...base,
      //border: 1,
      // This line disable the blue border
      // boxShadow: state.isFocused ? "0px 0px 0px 5px #c2dbfe !important" : 0,
      width: "62%",
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

  useEffect(() => {
    if (Data.item) {
      // setterFn && setterFn(Data.item.comments);
      setckEditorData(Data.item.comments);
      // console.log("DTAT", Data.item);
      let selectedSupportedCateg = supportedCategory.filter(
        (x) => x.supported_category_id === Data.item.supportedCategoryId
      );
      Data.item.effectiveDate = new Date(Data.item.effectiveDate);
      setSelectedSupportedCategory(
        selectedSupportedCateg ? selectedSupportedCateg[0] : {}
      );
      let id = -1;
      switch (Data.item.supportedCategoryId) {
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
      // console.log("id", "--->", Data.item);

      Data.item.dailyEquivalent = (
        (Data.item.lumsumEquivalent *
          (Data.item.isOverrideMPIR || type === EDIT
            ? parseFloat(Data.item.changedMpir)
            : 4.01)) /
        36500
      ).toFixed(2);

      setOriginalDailyEquivalent(Data.item.dailyEquivalent);
      setOriginalLumsumEquivalent(Data.item.lumsumEquivalent);

      getPaymentMethod(id, true);
      setInitialValues({
        ...Data.item,
      });
      getRecoveryMethods(3);
    } else {
      setOriginalDailyEquivalent(paymentDetails.currentDailyEquivalent);
      setOriginalLumsumEquivalent(paymentDetails.currentLumSumEquivalent);

      setInitialValues(getInitialValues());
      setckEditorData(paymentDetails.currentComment);

      // setOriginalRadPortion();
      // setOriginalDacPortion();
      ref.current.setFieldValue(
        "paymentMethodId",
        paymentDetails.currentPaymentMethodId
      );
      getRecoveryMethods(3);
      // console.log(paymentDetails.currentPaymentMethodId);
    }
    getSupportedCategory();
  }, [Data]);

  const savePaymentVaraition = (fields, { errors }) => {
    setShowErrorPopup(false);
    let compareDate = new Date(new Date(finalisedDate).setHours(0, 0, 0, 0));

    // console.log("all fields", fields);
    delete fields.isPaymentMethodChange;
    delete fields.isPriceChange;

    if (
      type === EDIT
        ? // new Date(fields.effectiveDate).getTime() >=
          //     new Date(compareDate).getTime() &&
          moment(fields.effectiveDate).format("YYYY-MM-DD") >=
          moment(secondLastEffectiveDate).format("YYYY-MM-DD")
        : new Date(fields.effectiveDate).getTime() -
            new Date(compareDate).getTime() >
            86400000 ||
          (new Date(fields.effectiveDate).getTime() -
            new Date(compareDate).getTime() <
            86400000 &&
            new Date(fields.effectiveDate).getTime() -
              new Date(compareDate).getTime() >
              0 &&
            new Date(fields.effectiveDate).getDay() !==
              new Date(compareDate).getDay())
    ) {
      if (type === EDIT) {
        setLoading(true);
        // fields.effectiveDate = moment(fields.effectiveDate)
        //   .local()
        //   .format('DD/MM/YYYY ');

        //   isPaymentMethodChange: true,
        // isPriceChange: true,
        paymentService
          .updatePaymentDetails({
            ...fields,
            effectiveDate: convertDtFormat(fields.effectiveDate),
            mpir: fields.changedMpir === "" ? 0 : fields.changedMpir,
            changedMpir: fields.changedMpir === "" ? 0 : fields.changedMpir,
            residentId,
            comments: ckEditorData,
          })
          .then(
            (res) => {
              setLoading(false);
              ParentCallBackToView(false, true, res.message);
              setShow(false);
              UpdateCancelCallback(fields.id);
            },
            (errors) => {
              ref && ref.current && ref.current.setSubmitting(false);
              setLoading(false);
            }
          );
      } else {
        setLoading(true);
        console.log(fields);
        // fields.effectiveDate = moment(fields.effectiveDate)
        //   .local()
        //   .format('DD/MM/YYYY ');
        paymentService
          .createPaymentDetails({
            ...initialValues,
            ...fields,
            effectiveDate: convertDtFormat(fields.effectiveDate),
            changedMpir: fields.changedMpir === "" ? 0 : fields.changedMpir,
            radPortion: fields.radPortion ? fields.radPortion : 0,
            dapdacPortion: fields.dapdacPortion ? fields.dapdacPortion : 0,
            recoveryMethodId: fields.recoveryMethodId
              ? fields.recoveryMethodId
              : 0,
            paymentMethodId: fields.paymentMethodId
              ? fields.paymentMethodId
              : 0,
            residentId,
            comments: ckEditorData,
          })
          .then(
            (res) => {
              setLoading(false);
              ParentCallBackToView(false, true, res.message);
              setShow(false);
              handleIsAdded(true);
            },
            (errors) => {
              ref && ref.current && ref.current.setSubmitting(false);
              setLoading(false);
            }
          );
      }
    } else {
      setShowErrorPopup(true);
      ref && ref.current && ref.current.setSubmitting(false);
    }
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

  const validateForm = (values) => {
    let errors = {};
    let compareDate = new Date(new Date(finalisedDate).setHours(0, 0, 0, 0));
    if (!values.effectiveDate) {
      if (values.effectiveDate === null) {
        errors.effectiveDate = "Invalid date";
      } else {
        errors.effectiveDate = "Required Field";
      }
    } else if (ref && ref.current && ref.current.touched.effectiveDate) {
      if (
        type === EDIT &&
        new Date(values.effectiveDate).getTime() <
          new Date(compareDate).getTime()
      ) {
        console.log("errir from validation");
        setShowErrorPopup(true);
        ref && ref.current && ref.current.setSubmitting(false);
        // errors.effectiveDate = "Error";
      }
      if (
        type === ADD &&
        (new Date(values.effectiveDate).getTime() -
          new Date(compareDate).getTime() <
          0 ||
          (new Date(values.effectiveDate).getTime() -
            new Date(compareDate).getTime() <
            86400000 &&
            new Date(values.effectiveDate).getDay() ===
              new Date(compareDate).getDay()))
      ) {
        // console.log("values.compareDate in add", compareDate);
        setShowErrorPopup(true);
        ref && ref.current && ref.current.setSubmitting(false);
        // errors.effectiveDate = "Error";
      }
    }
    if (
      (!values.lumsumEquivalent ||
        values.lumsumEquivalent === "" ||
        parseFloat(values.lumsumEquivalent) < 1) &&
      values.isLumSumEq &&
      priceRangeEnabled &&
      values.isPriceChange
    ) {
      errors.lumsumEquivalent = "Error";
      // ref &&
      //   ref.current &&
      //   ref.current.setFieldTouched("lumsumEquivalent", true, false);
    }
    if (
      (!values.dailyEquivalent ||
        values.dailyEquivalent === "" ||
        parseFloat(values.dailyEquivalent) < 1) &&
      values.isLumSumEq === false &&
      priceRangeEnabled &&
      values.isPriceChange
    ) {
      errors.dailyEquivalent = "Error";
      // ref &&
      //   ref.current &&
      //   ref.current.setFieldTouched("lumsumEquivalent", true, false);
    }

    if (
      selectedPaymentMethod &&
      selectedPaymentMethod.name &&
      (selectedPaymentMethod.name.replaceAll(" ", "") ===
        "RAC/DACCombination" ||
        selectedPaymentMethod.name.replaceAll(" ", "") ===
          "RAD/DAPCombination") &&
      ((!values.radPortion &&
        paymentMethodChanged &&
        supportCategoryChanged &&
        values.isPaymentMethodChange) ||
        (values.radPortion === 0 &&
          paymentMethodChanged &&
          supportCategoryChanged &&
          paymentChangeEnabled &&
          values.isPaymentMethodChange) ||
        (values.radPortion === undefined &&
          paymentMethodChanged &&
          supportCategoryChanged &&
          paymentChangeEnabled &&
          values.isPaymentMethodChange))
    ) {
      errors.radPortion = "Required field & should be greater than 0";
      ref &&
        ref.current &&
        ref.current.setFieldTouched("radPortion", true, false);
      setCustomStyle({
        width: "116px",
        marginLeft: "37%",
      });
    }
    if (
      selectedPaymentMethod &&
      selectedPaymentMethod.name &&
      (selectedPaymentMethod.name.replaceAll(" ", "") ===
        "RAC/DACCombination" ||
        selectedPaymentMethod.name.replaceAll(" ", "") ===
          "RAD/DAPCombination") &&
      values.radPortion > values.lumsumEquivalent
    ) {
      errors.radPortion = "Must be less than lumpsum amount";
      setCustomStyle({
        width: "225px",
        marginLeft: "37%",
      });
    }
    if (!values.supportedCategoryId) {
      errors.supportedCategoryId = "Error";
    }
    if (
      !values.paymentMethodId &&
      values.supportedCategoryId !== 1 &&
      supportCategoryChanged &&
      paymentChangeEnabled &&
      values.isPaymentMethodChange
    ) {
      errors.paymentMethodId = "Error";
    }

    if (
      (values.isOverrideMPIR && !values.changedMpir) ||
      (values.isOverrideMPIR && values.changedMpir > originalGovMPIR) ||
      parseFloat(values.changedMpir) === 0
    ) {
      errors.changedMpir =
        parseFloat(values.changedMpir) === 0
          ? "MPIR cannot be 0"
          : "Required field";
      if (values.isOverrideMPIR && values.changedMpir > originalGovMPIR) {
        setMpirErrorMsg(
          `The MPIR cannot be higher than ${originalGovMPIR +
            "%"}, effective ${convertDate(values.effectiveDate)}. `
        );
        errors.changedMpir = "Higher error";
        // `The MPIR cannot be higher than ${
        //   paymentDetails.currentMapir
        // }, effective ${convertDate(values.effectiveDate)}.`
        setShowMPIRError(true);
      }
    }
    if (Object.keys(errors).length > 1) {
      ref && ref.current && ref.current.setSubmitting(false);
    }
    console.log(errors);
    //setpaymentMethodChanged(true);
    return errors;
  };

  return (
    <Formik
      enableReinitialize
      innerRef={ref}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        // lumsumEquivalent: Yup.string().required(),
        // effectiveDate: Yup.date().required(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={savePaymentVaraition}
    >
      {({
        errors,
        handleReset,
        setErrors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setSubmitting,
        touched,
        values,
        setFieldValue,
        setFieldTouched,
      }) => (
        <>
          {loading ? <Loader></Loader> : null}
          {errors.changedMpir && touched.changedMpir ? (
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
          {showErrorPopup && (
            <ModalError
              showErrorPopup={showErrorPopup}
              fieldArray={[]}
              errorMessage={
                <p style={{ margin: "37px 7px" }}>
                  The Effective Date of this variation cannot be earlier than
                  previous finalized version. Please enter the date later than
                  earlier version
                </p>
              }
              header={"Payment Details - Effective Date"}
              buttonType={"Okay"}
              handleErrorClose={() => {
                setShowErrorPopup(false);
              }}
            ></ModalError>
          )}
          <Modal
            centered
            isOpen={show}
            // size="lg"
            className="paymentvariation-modal"
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
              {type === ADD ? "Add Variation" : "Edit Variation"}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <Row className={"fieldStyle"}>
                  <FormGroup row>
                    <div className="head mt-3" style={{ fontSize: "16px" }}>
                      {CURRENTPAYMENTPRICEANDMETHOD}
                    </div>
                    <div
                      className="variationouterbox"
                      style={{
                        marginLeft: "15px",
                        marginBottom: "10px",
                        backgroundColor: "#F0F0F0",
                      }}
                    >
                      <div className="d-flex">
                        <div style={{ width: "65%", marginRight: 10 }}>
                          <div style={{ height: "30%" }}>
                            <br />

                            <div style={{ marginLeft: "35px" }}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor=""
                                  column
                                  sm={2}
                                >
                                  {EFFECTIVEFROM}
                                </Label>
                                <Col sm={10}>
                                  <Field
                                    name="effectiveFrom"
                                    type="text"
                                    value={convertDate(
                                      paymentDetails.currentEffectiveFrom
                                    )}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    maxLength="250"
                                    disabled={true}
                                    style={{
                                      width: "61.6%",
                                      paddingLeft: "12px",
                                    }}
                                  />
                                  {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                                </Col>
                              </FormGroup>
                              <FormGroup row style={{ marginTop: "-10px" }}>
                                <Label sm={2} style={{ textAlign: "right" }}>
                                  {BY}
                                </Label>
                                <Col
                                  sm={3}
                                  className="d-flex"
                                  style={{ marginTop: "-6px" }}
                                >
                                  <FormGroup check>
                                    <input
                                      id="radio"
                                      name="active2"
                                      type="radio"
                                      style={{
                                        backgroundColor: "gray",
                                        borderColor: "gray",
                                        marginLeft: "-8px",
                                      }}
                                      checked={paymentDetails.currentIsLumSumEq}
                                      disabled={true}
                                      // onChange={() => setCurrentIsLumsum(true)}
                                    />{" "}
                                    <Label
                                      sm={10}
                                      style={{ width: "fit-content" }}
                                    >
                                      {LUMPSUMEQUIVALENTPAYMNT}
                                    </Label>
                                  </FormGroup>
                                </Col>
                                {/* <span className="input-symbol-dollar"> */}
                                <Col>
                                  <NumberFormat
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    // maxLength={17}
                                    fixedDecimalScale={2}
                                    allowNegative={false}
                                    decimalScale={2}
                                    name="price"
                                    id="currentLumSumEquivalent"
                                    value={
                                      paymentDetails.currentLumSumEquivalent
                                    }
                                    placeholder="$0.00"
                                    style={{
                                      marginRight: "10px",
                                      width: "47%",
                                      height: "62%",
                                      paddingLeft: "12px",
                                      marginLeft: "-10px",
                                    }}
                                    disabled={true || refundComplete}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup row style={{ marginTop: "-14px" }}>
                                <Label sm={2} style={{ textAlign: "right" }}>
                                  {""}
                                </Label>
                                <Col
                                  sm={3}
                                  style={{
                                    marginTop: "-6px",
                                    marginLeft: "-8px",
                                  }}
                                >
                                  <FormGroup check>
                                    <input
                                      id="radio"
                                      name="active2"
                                      type="radio"
                                      style={{}}
                                      checked={
                                        !paymentDetails.currentIsLumSumEq
                                      }
                                      disabled={true || refundComplete}
                                      // onChange={() => setIsLumpsum(false)}
                                    />{" "}
                                    <Label sm={10}>{DAILYEQUIVALENT}</Label>
                                  </FormGroup>
                                </Col>
                                <Col>
                                  <NumberFormat
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    // maxLength={17}
                                    fixedDecimalScale={2}
                                    allowNegative={false}
                                    decimalScale={2}
                                    name="currentDailyEquivalent"
                                    id="currentDailyEquivalent"
                                    value={
                                      paymentDetails.currentDailyEquivalent
                                    }
                                    placeholder="$0.00"
                                    style={{
                                      marginLeft: "8px",
                                      width: "46%",
                                      height: "70%",
                                      paddingLeft: "12px",
                                      marginLeft: "-2px",
                                    }}
                                    disabled
                                  />
                                </Col>
                                {/* <Field
                                  name="productQuntity"
                                  type="number"
                                  value={paymentDetails.currentDailyEquivalent}
                                  onBlur={handleBlur}
                                
                                  style={{
                                    marginRight: '10px',
                                    width: '26%',
                                    height: '60%',
                                  }}
                                  disabled={true}
                                /> */}
                              </FormGroup>

                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="currentMpir"
                                  column
                                  sm={2}
                                >
                                  {MPIR}
                                </Label>
                                <Col sm={9}>
                                  <NumberFormat
                                    thousandSeparator={false}
                                    suffix={"%"}
                                    maxLength={7}
                                    fixedDecimalScale={2}
                                    allowNegative={false}
                                    decimalScale={2}
                                    name="currentMpir"
                                    id="currentMpir"
                                    value={paymentDetails.currentMapir}
                                    placeholder={"0.00%"}
                                    disabled={true}
                                    style={{
                                      width: "68.7%",
                                      paddingLeft: "12px",
                                    }}
                                  />
                                  {/* <Field
                                    name="mpir"
                                    type="text"
                                    value={paymentDetails.currentMpir}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    disabled={true}
                                  /> */}
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Label
                                  style={{
                                    textAlign: "right",
                                    marginLeft: "-8%",
                                  }}
                                  htmlFor=""
                                  column
                                  sm={3}
                                >
                                  {SUPPORTEDSTATUS}
                                </Label>
                                <Col sm={9}>
                                  <Field
                                    name="effectiveFrom"
                                    type="text"
                                    value={
                                      paymentDetails.currentSupportedStatus
                                    }
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    maxLength="250"
                                    disabled={true}
                                    style={{
                                      width: "68.8%",
                                      marginLeft: "-3px",
                                      paddingLeft: "12px",
                                    }}
                                  />
                                  {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                                </Col>
                              </FormGroup>
                            </div>
                          </div>
                        </div>
                        {/* 1st 50% wala div ends */}
                        <div style={{ width: "45%" }}>
                          <div style={{ height: "12%" }}>
                            <div
                              className="head mt-3"
                              //   class="head-style mb-2"
                            >
                              {/* <img src={Icon} className="icon" /> */}
                              {""}
                            </div>

                            {/* <br /> */}
                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor=""
                                column
                                sm={4}
                              >
                                {PAYMENTMETHOD}
                              </Label>
                              <Col sm={8}>
                                <Field
                                  name="paymentMethod"
                                  type="text"
                                  value={paymentDetails.currentPaymentMethod}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  maxLength="250"
                                  disabled={true}
                                  style={{ width: "50%", paddingLeft: "12px" }}
                                />
                                {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor=""
                                column
                                sm={4}
                              >
                                {RADPORTION}
                              </Label>
                              <Col sm={8}>
                                <NumberFormat
                                  thousandSeparator={true}
                                  prefix={"$"}
                                  // maxLength={17}
                                  fixedDecimalScale={2}
                                  allowNegative={false}
                                  decimalScale={2}
                                  name="currentRadPortion"
                                  id="currentRadPortion"
                                  value={paymentDetails.currentRadPortion}
                                  placeholder="$0.00"
                                  style={{ width: "50%", paddingLeft: "12px" }}
                                  disabled
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor=""
                                column
                                sm={4}
                              >
                                {DAPPORTION}
                              </Label>
                              <Col sm={8}>
                                <NumberFormat
                                  thousandSeparator={true}
                                  prefix={"$"}
                                  // maxLength={17}
                                  fixedDecimalScale={2}
                                  allowNegative={false}
                                  decimalScale={2}
                                  name="currentDapPortion"
                                  id="currentDapPortion"
                                  value={paymentDetails.currentDapPortion}
                                  placeholder="$0.00"
                                  style={{ width: "50%", paddingLeft: "12px" }}
                                  disabled
                                />
                                {/* <Field
                                  name="paymentMethod"
                                  type="text"
                                  value={paymentDetails.currentDapPortion}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  maxLength="250"
                                  disabled={true}
                                  style={{ width: '50%' }}
                                /> */}
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor=""
                                column
                                sm={4}
                              >
                                {DRAWDOWN}
                              </Label>
                              <Col sm={8}>
                                <Field
                                  name="paymentMethod"
                                  type="text"
                                  value={paymentDetails.currentDrawdown}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  maxLength="250"
                                  disabled={true}
                                  style={{ width: "50%", paddingLeft: "12px" }}
                                />
                                {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                              </Col>
                            </FormGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="headerBorder" />
                    <div className="head" style={{ fontSize: "16px" }}>
                      {VARIATIONDETAILS}
                    </div>

                    <div className="d-flex">
                      <div style={{ width: "64%", marginLeft: "20px" }}>
                        <div style={{ height: "30%" }}>
                          <div
                            className="paymentouterbox"
                            style={{ height: "190px" }}
                          >
                            <Row className={"fieldStyle d-flex"}>
                              <div
                                className="head "
                                style={{ marginTop: "-20px", fontSize: "16px" }}
                              >
                                {EFFECTIVEDATE}
                              </div>
                              <hr className="headerBorder" />
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="effectiveDate"
                                  className={
                                    !values.effectiveDate &&
                                    errors.effectiveDate &&
                                    touched.effectiveDate
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
                                      name="effectiveDate"
                                      autoComplete="off"
                                      selectedDate={values.effectiveDate}
                                      // selected={new Date(values.effectiveDate)}
                                      // ref={refCalendar}
                                      onBlur={handleBlur}
                                      error={
                                        !values.effectiveDate &&
                                        errors.effectiveDate &&
                                        touched.effectiveDate
                                      }
                                      dateFormat="dd/MM/yyyy"
                                      getChangedDate={handleChangeDate}
                                      minDate={admissionDate}
                                    />
                                  </InputGroup>
                                  {/* {!values.effectiveDate && (
                                    <div
                                      className="error-spanvariation"
                                      style={{
                                        marginTop: "10px",
                                        marginLeft: "0px",
                                      }}
                                    > */}
                                  <InlineBottomErrorMessage
                                    name="effectiveDate"
                                    msg={errors.effectiveDate}
                                  />
                                  {/* </div>
                                  )} */}
                                </Col>
                              </FormGroup>
                            </Row>
                          </div>
                          <div
                            className="paymentouterbox"
                            style={{ height: "87%", marginTop: "25px" }}
                          >
                            <Row
                              className={"fieldStyle"}
                              style={{ marginTop: "-25px" }}
                            >
                              <FormGroup row>
                                <Col sm={1}>
                                  <FormGroup check>
                                    <Input
                                      id="checkbox"
                                      name="active"
                                      type="checkbox"
                                      style={{ marginTop: "10px" }}
                                      checked={categoryChangeEnabled}
                                      onChange={(ev) => {
                                        if (!ev.target.checked) {
                                          const selectedSupportedCat = supportedCategory.find(
                                            (x) =>
                                              x.supported_category_id ===
                                              paymentDetails?.currentSupportedStatusId
                                          );
                                          setSelectedSupportedCategory(
                                            selectedSupportedCat
                                              ? selectedSupportedCat
                                              : {}
                                          );
                                        }
                                        setCategoryChangeEnabled(
                                          !categoryChangeEnabled
                                        );
                                      }}
                                    />{" "}
                                  </FormGroup>
                                </Col>
                                <Col sm={8} style={{ marginLeft: "-20px" }}>
                                  <div
                                    className="head "
                                    style={{
                                      marginTop: "4px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {CATEGOTYCHANGE}
                                  </div>
                                  <hr
                                    className="headerBorder"
                                    style={{
                                      width: "168%",
                                      marginLeft: "-38px",
                                      marginTop: "0px",
                                    }}
                                  />
                                </Col>
                              </FormGroup>
                              <br />
                              <FormGroup row>
                                <Label
                                  htmlFor="supportedCategoryId "
                                  column
                                  style={{ textAlign: "right" }}
                                  sm={4}
                                >
                                  {NEWSUPPORTEDCATEGORY}
                                </Label>

                                <Col sm={8}>
                                  <SingleSelect
                                    onChange={(selected) => {
                                      setSupportCategoryChanged(false);
                                      setSelectedSupportedCategory(selected);
                                      setFieldValue(
                                        "supportedCategoryId",
                                        selected.supported_category_id
                                      );
                                      setFieldValue("paymentMethodId", 0);
                                      setSelectedPaymentMethod(null);
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
                                      setSelectedSupportedCategory(selected);
                                      setTimeout(() => {
                                        //setSupportCategoryChanged(true);
                                      }, 100);
                                      // setFieldValue('paymentMethodId', null);
                                    }}
                                    error={
                                      errors.supportedCategoryId ? true : false
                                    }
                                    options={supportedCategory}
                                    isDisabled={!categoryChangeEnabled}
                                    value={selectedSupportedCategory}
                                  />

                                  <InlineBottomErrorMessage
                                    className="error-space"
                                    name="supportedCategoryId"
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                          </div>
                          <div
                            className="paymentouterbox"
                            style={{ height: "146%", marginTop: "25px" }}
                          >
                            <Row className={"fieldStyle"}>
                              <div
                                className="head "
                                style={{ marginTop: "-20px", fontSize: "16px" }}
                              >
                                {COMMENT}
                              </div>
                              <hr
                                className="headerBorder"
                                style={{
                                  width: "201%",
                                  marginLeft: "-6px",
                                }}
                              />
                              <br />
                              <FormGroup row>
                                <Col sm={12}>
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
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "56%",
                        }}
                      >
                        <div
                          style={{
                            height: errors.lumsumEquivalent ? "15%" : "12%",
                          }}
                        >
                          <div
                            className="paymentouterbox"
                            style={{ height: "242%" }}
                          >
                            <FormGroup
                              row
                              className={"fieldStyle"}
                              style={{
                                marginTop: "-25px",
                                marginLeft: "-41px",
                              }}
                            >
                              <Col sm={1} style={{ marginLeft: "27px" }}>
                                <FormGroup check>
                                  <Input
                                    id="isPriceChange"
                                    name="isPriceChange"
                                    type="checkbox"
                                    style={{
                                      marginTop: "13px",
                                    }}
                                    checked={priceRangeEnabled}
                                    onBlur={handleBlur}
                                    onChange={() => {
                                      setPriceChange(false);
                                      setFieldValue("isPriceChange", false);
                                      setpriceRangeEnabled(!priceRangeEnabled);
                                      if (priceRangeEnabled === true) {
                                        setFieldValue(
                                          "lumsumEquivalent",
                                          originalLumsumEquivalent
                                        );
                                        setFieldValue(
                                          "dailyEquivalent",
                                          originalDailyEquivalent
                                        );
                                        setFieldValue(
                                          "radPortion",
                                          originalLumsumEquivalent
                                        );
                                        setFieldValue("dapdacPortion", 0);
                                      }
                                    }}
                                  />{" "}
                                </FormGroup>
                              </Col>
                              <Col sm={8} style={{ marginLeft: "-20px" }}>
                                <div
                                  className="head"
                                  style={{ marginTop: "7px", fontSize: "16px" }}
                                >
                                  {PRICECHANGE}
                                </div>
                                <hr
                                  className="headerBorder"
                                  style={{
                                    width: "156%",
                                    marginLeft: "-47px",
                                    marginTop: "-2px",
                                  }}
                                />
                              </Col>
                              <FormGroup FormGroup row>
                                <Label
                                  sm={4}
                                  style={{ textAlign: "right" }}
                                  className={
                                    (errors.lumsumEquivalent &&
                                      touched.lumsumEquivalent &&
                                      priceRangeEnabled &&
                                      values.isPriceChange) ||
                                    (errors.dailyEquivalent &&
                                      touched.dailyEquivalent &&
                                      priceRangeEnabled &&
                                      values.isPriceChange)
                                      ? " is-invalid-label required-field"
                                      : "required-field"
                                  }
                                >
                                  {NEWPAYMENTPRICE}
                                </Label>
                                <Col sm={4}>
                                  <FormGroup check>
                                    <input
                                      className={
                                        !priceRangeEnabled && !values.isLumSumEq
                                          ? "check-disabled"
                                          : ""
                                      }
                                      id="isLumSumEq"
                                      name="isLumSumEq"
                                      type="radio"
                                      checked={values.isLumSumEq}
                                      style={{
                                        marginLeft: "-22px",
                                      }}
                                      onChange={() => {
                                        setFieldValue("isLumSumEq", true);
                                      }}
                                      onBlur={handleBlur}
                                      disabled={!priceRangeEnabled}
                                    />{" "}
                                    <Label
                                      sm={12}
                                      className={
                                        values.isLumSumEq === true &&
                                        errors.lumsumEquivalent &&
                                        priceRangeEnabled &&
                                        values.isPriceChange
                                          ? " is-invalid-label required-field "
                                          : ""
                                      }
                                    >
                                      {LUMPSUMEQUIVALENTPAYMNT}
                                    </Label>
                                  </FormGroup>
                                </Col>
                                <Col sm={3} style={{ marginLeft: "-20px" }}>
                                  <NumberFormat
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    // maxLength={
                                    //   values.lumsumEquivalent === 0 ? 14 : 16
                                    //   // : PayAmount === 0
                                    //   // ? 14
                                    //   // : 17
                                    // }
                                    fixedDecimalScale={2}
                                    allowNegative={false}
                                    decimalScale={2}
                                    name="lumsumEquivalent"
                                    id="lumsumEquivalent"
                                    value={values.lumsumEquivalent}
                                    className={
                                      values.isLumSumEq === true &&
                                      errors.lumsumEquivalent &&
                                      priceRangeEnabled &&
                                      values.isPriceChange
                                        ? "text form-control is-invalid"
                                        : "text form-control"
                                    }
                                    // onBlur={handleBlur}
                                    onBlur={() => {
                                      setFieldValue("isPriceChange", true);
                                      setPriceChange(true);
                                    }}
                                    placeholder={"$0.00"}
                                    onValueChange={(x, src) => {
                                      setPriceChange(true);
                                      // console.log("onValueChange", x);
                                      if (src.source === "event") {
                                        let dailyamt = "";
                                        if (x.floatValue === "") {
                                          // setFieldValue("dailyEquivalent", "");
                                          dailyamt = "";
                                          setFieldValue(
                                            "lumsumEquivalent",
                                            x.floatValue ? x.floatValue : ""
                                          );

                                          //setTimeout(() => {
                                          // setFieldValue(
                                          //   "radPortion",
                                          //   x.floatValue
                                          // );
                                          //});
                                        } else {
                                          let radAmt = parseFloat(x.floatValue);
                                          console.log("radAmt", radAmt);
                                          let dailyAmt = parseFloat(
                                            radAmt *
                                              (values.isOverrideMPIR ||
                                              type === EDIT
                                                ? values.changedMpir
                                                : values.mpir)
                                          );
                                          setFieldValue(
                                            "lumsumEquivalent",
                                            x.floatValue
                                          );
                                          dailyamt =
                                            dailyAmt === "NaN"
                                              ? 0
                                              : parseFloat(dailyAmt / 36500);
                                        }

                                        // setTimeout(() => {
                                        setFieldValue(
                                          "dailyEquivalent",
                                          dailyamt,
                                          false
                                        );
                                        setFieldValue(
                                          "radPortion",
                                          x.floatValue ? x.floatValue : "",
                                          false
                                        );
                                        setFieldValue(
                                          "dapdacPortion",
                                          0,
                                          false
                                        );

                                        // }, 200);
                                      }
                                    }}
                                    style={{
                                      marginRight: "90px",
                                      width: "140%",
                                      height: "90%",
                                    }}
                                    disabled={
                                      !priceRangeEnabled || !values.isLumSumEq
                                    }
                                  />
                                </Col>
                                <div style={{ marginLeft: "304px" }}>
                                  {values.isLumSumEq === true &&
                                  errors.lumsumEquivalent &&
                                  priceRangeEnabled &&
                                  values.isPriceChange ? (
                                    <InlineBottomErrorMessage
                                      customStyle={{
                                        width: "50%",
                                        marginLeft: "30%",
                                      }}
                                      msg="Required field & should be greater than 1"
                                    />
                                  ) : null}
                                </div>
                              </FormGroup>
                              <FormGroup row>
                                <Label sm={4} style={{ textAlign: "right" }}>
                                  {""}
                                </Label>
                                <Col sm={4}>
                                  <FormGroup check>
                                    <input
                                      id="radio"
                                      name="active"
                                      type="radio"
                                      style={{
                                        marginLeft: "-22px",
                                      }}
                                      className={
                                        !priceRangeEnabled && !values.isLumSumEq
                                          ? "check-disabled"
                                          : ""
                                      }
                                      checked={!values.isLumSumEq}
                                      onChange={() =>
                                        setFieldValue("isLumSumEq", false)
                                      }
                                      disabled={!priceRangeEnabled}
                                    />{" "}
                                    <Label
                                      sm={12}
                                      className={
                                        values.isLumSumEq === false &&
                                        errors.dailyEquivalent &&
                                        priceRangeEnabled &&
                                        values.isPriceChange
                                          ? " is-invalid-label"
                                          : ""
                                      }
                                    >
                                      {DAILYEQUIVALENT}
                                    </Label>
                                  </FormGroup>
                                </Col>
                                <Col sm={3} style={{ marginLeft: "-20px" }}>
                                  <NumberFormat
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    // maxLength={
                                    //   // values.dailyEquivalent === 0 ? 14 : 16
                                    //   values.dailyEquivalent === 0 ? 10 : 10
                                    // }
                                    maxLength={9}
                                    fixedDecimalScale={2}
                                    allowNegative={false}
                                    decimalScale={2}
                                    name="dailyEquivalent"
                                    id="dailyEquivalent"
                                    value={values.dailyEquivalent}
                                    placeholder={"$0.00"}
                                    className={
                                      values.isLumSumEq === false &&
                                      errors.dailyEquivalent &&
                                      priceRangeEnabled &&
                                      values.isPriceChange
                                        ? "text form-control is-invalid"
                                        : "text form-control"
                                    }
                                    onBlur={() => {
                                      setFieldValue("isPriceChange", true);
                                      setPriceChange(true);
                                    }}
                                    onValueChange={(x, src) => {
                                      console.log(src);
                                      if (src.source === "event") {
                                        if (!x.floatValue) {
                                          setFieldValue(
                                            "dailyEquivalent",
                                            x.floatValue
                                          );
                                          setFieldValue("lumsumEquivalent", "");
                                          setFieldValue("radPortion", "");
                                        } else {
                                          let dailyAmt = parseFloat(
                                            x.floatValue
                                          );
                                          let radAmt =
                                            (dailyAmt * 36500) /
                                            (values.isOverrideMPIR ||
                                            type === EDIT
                                              ? values.changedMpir
                                              : values.mpir);
                                          setFieldValue(
                                            "lumsumEquivalent",
                                            radAmt
                                          );
                                          setFieldValue("radPortion", radAmt);

                                          setFieldValue(
                                            "dailyEquivalent",
                                            x.floatValue
                                          );
                                        }
                                      }
                                    }}
                                    style={{
                                      marginRight: "5px",
                                      width: "140%",
                                      height: "90%",
                                    }}
                                    disabled={
                                      !priceRangeEnabled || values.isLumSumEq
                                    }
                                  />
                                </Col>
                                <div style={{ marginLeft: "304px" }}>
                                  {values.isLumSumEq === false &&
                                    errors.dailyEquivalent &&
                                    priceRangeEnabled &&
                                    values.isPriceChange && (
                                      <InlineBottomErrorMessage
                                        customStyle={{
                                          width: "50%",
                                          marginLeft: "30%",
                                        }}
                                        msg="Required field & should be greater than 1"
                                      />
                                    )}
                                </div>
                              </FormGroup>
                              <FormGroup row>
                                <Label sm={4} style={{ textAlign: "right" }}>
                                  {MPIRCHANGE}
                                </Label>
                                <Col sm={1}>
                                  <FormGroup check>
                                    <Input
                                      id="checkbox"
                                      name="active"
                                      type="checkbox"
                                      checked={values.isOverrideMPIR}
                                      onChange={() => {
                                        setFieldValue(
                                          "isOverrideMPIR",
                                          !values.isOverrideMPIR
                                        );
                                        if (values.isOverrideMPIR) {
                                          setFieldValue(
                                            "changedMpir",
                                            currentMpir,
                                            false
                                          );
                                        }
                                      }}
                                      style={{ marginTop: "10px" }}
                                      disabled={!priceRangeEnabled}
                                    />{" "}
                                  </FormGroup>
                                </Col>
                                <Col sm={7} style={{ marginLeft: "-20px" }}>
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
                                    // onBlur={handleBlur}
                                    disabled={
                                      !priceRangeEnabled ||
                                      !values.isOverrideMPIR
                                    }
                                    placeholder={"0.00%"}
                                    onValueChange={(x) => {
                                      if (x.value) {
                                        setFieldValue("changedMpir", x.value);
                                        if (isLumpsum) {
                                          const dailyAmt =
                                            (values.lumsumEquivalent *
                                              x.floatValue) /
                                            36500;
                                          setFieldValue(
                                            "dailyEquivalent",
                                            dailyAmt.toFixed(2),
                                            false
                                          );
                                        } else {
                                          const radAmt =
                                            (values.dailyEquivalent * 36500) /
                                              x.floatValue || 0;
                                          setFieldValue(
                                            "lumsumEquivalent",
                                            radAmt.toFixed(2),
                                            false
                                          );
                                        }
                                      }
                                    }}
                                    style={{
                                      alignText: "right",
                                    }}
                                    className={
                                      "text form-control" +
                                      (errors.changedMpir && touched.changedMpir
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  {errors.changedMpir !== "Higher error" && (
                                    <InlineBottomErrorMessage
                                      name="changedMpir"
                                      msg={errors.changedMpir}
                                    />
                                  )}
                                </Col>
                              </FormGroup>
                            </FormGroup>
                          </div>
                          <div
                            className="paymentouterbox"
                            style={{
                              marginTop: "25px",
                              height: "fit-content",

                              pointerEvents:
                                selectedSupportedCategory?.supported_category_id ===
                                1
                                  ? "none"
                                  : "",
                            }}
                          >
                            <Row
                              className={"fieldStyle"}
                              style={{ marginTop: "-25px" }}
                            >
                              <FormGroup row>
                                <Col sm={1}>
                                  <FormGroup check>
                                    <Input
                                      id="isPaymentMethodChange"
                                      name="isPaymentMethodChange"
                                      type="checkbox"
                                      style={{ marginTop: "13px" }}
                                      checked={
                                        paymentChangeEnabled &&
                                        selectedSupportedCategory?.supported_category_id !==
                                          1
                                      }
                                      onChange={() => {
                                        setPaymentChangeEnabled(
                                          !paymentChangeEnabled
                                        );
                                        setPaymentMethodCheckboxChange(false);
                                        setFieldValue(
                                          "isPaymentMethodChange",
                                          false
                                        );
                                      }}
                                      className={
                                        selectedSupportedCategory?.supported_category_id ===
                                        1
                                          ? "check-disabled"
                                          : ""
                                      }
                                      isDisabled={
                                        selectedSupportedCategory?.supported_category_id ===
                                        1
                                      }
                                    />{" "}
                                  </FormGroup>
                                </Col>
                                <Col sm={8} style={{ marginLeft: "-20px" }}>
                                  <div
                                    className="head"
                                    style={{
                                      marginTop: "8px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {PAYMENTMETHODCHANGE}
                                  </div>
                                  <hr
                                    className="headerBorder"
                                    style={{
                                      width: "172%",
                                      marginLeft: "-45px",
                                      marginTop: "-2px",
                                    }}
                                  ></hr>
                                </Col>
                              </FormGroup>
                              <br />
                              <FormGroup row>
                                <Label
                                  htmlFor="paymentMethodId "
                                  column
                                  style={{ textAlign: "right" }}
                                  sm={4}
                                  className={
                                    errors.paymentMethodId &&
                                    touched.paymentMethodId &&
                                    supportCategoryChanged &&
                                    paymentChangeEnabled &&
                                    values.isPaymentMethodChange
                                      ? " is-invalid-label required-field"
                                      : "required-field"
                                  }
                                >
                                  {NEWPAYMENTMETHOD}
                                </Label>
                                <Col sm={8}>
                                  <SingleSelect
                                    placeholder={
                                      !paymentChangeEnabled ||
                                      values.supportedCategoryId === 1 ||
                                      selectedSupportedCategory?.supported_category_id ===
                                        1
                                        ? "None"
                                        : "Select...."
                                    }
                                    onBlur={handleBlur}
                                    onChange={(selected) => {
                                      setPaymentMethodCheckboxChange(true);
                                      setFieldValue(
                                        "isPaymentMethodChange",
                                        true
                                      );

                                      setpaymentMethodChanged(false);
                                      setSupportCategoryChanged(false);
                                      setFieldValue(
                                        "paymentMethodId",
                                        selected.id
                                      );
                                      setSelectedPaymentMethod(selected);
                                      setpaymentMethodChanged(false);
                                      if (
                                        selected.name === "RAC Only" ||
                                        selected.name === "DAC Only" ||
                                        selected.name === "RAD Only" ||
                                        selected.name === "DAP Only"
                                      ) {
                                        //setTimeout(() => {
                                        setFieldValue("radPortion", 0);
                                        setFieldValue("dapdacPortion", 0);
                                        //}, 200);
                                      } else {
                                        setFieldValue(
                                          "radPortion",
                                          values.lumsumEquivalent
                                        );
                                        setFieldValue("dapdacPortion", 0);
                                        setTimeout(() => {
                                          setpaymentMethodChanged(true);
                                          setSupportCategoryChanged(true);
                                        }, 20);
                                      }
                                    }}
                                    error={
                                      errors.paymentMethodId &&
                                      touched.paymentMethodId &&
                                      supportCategoryChanged &&
                                      paymentChangeEnabled &&
                                      values.isPaymentMethodChange
                                        ? true
                                        : false
                                    }
                                    options={paymentMethod}
                                    value={
                                      selectedPaymentMethod &&
                                      selectedPaymentMethod.id
                                        ? selectedPaymentMethod
                                        : null
                                    }
                                    isDisabled={
                                      !paymentChangeEnabled ||
                                      values.supportedCategoryId === 1
                                    }
                                  />
                                  {errors.paymentMethodId &&
                                  touched.paymentMethodId &&
                                  supportCategoryChanged &&
                                  paymentChangeEnabled &&
                                  values.isPaymentMethodChange ? (
                                    <InlineBottomErrorMessage
                                      className="error-space"
                                      name="paymentMethodId"
                                    />
                                  ) : null}
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row>
                              {values.supportedCategoryId === 1 ? (
                                <></>
                              ) : selectedPaymentMethod &&
                                selectedPaymentMethod.name &&
                                (selectedPaymentMethod.name.replaceAll(
                                  " ",
                                  ""
                                ) === "RAC/DACCombination" ||
                                  selectedPaymentMethod.name.replaceAll(
                                    " ",
                                    ""
                                  ) === "RAD/DAPCombination") ? (
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
                                      {/* <div className="addpaymentouterbox"> */}
                                      <Row className={"fieldStyle"}>
                                        <FormGroup row>
                                          <Label
                                            style={{ textAlign: "right" }}
                                            //htmlFor="AdmissionDate"
                                            column
                                            sm={4}
                                            className={
                                              errors.radPortion &&
                                              touched.radPortion &&
                                              paymentMethodChanged &&
                                              paymentChangeEnabled &&
                                              values.isPaymentMethodChange
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
                                          <Col sm={8}>
                                            <NumberFormat
                                              thousandSeparator={true}
                                              prefix={"$"}
                                              fixedDecimalScale={2}
                                              allowNegative={false}
                                              decimalScale={2}
                                              name="radPortion"
                                              id="radPortion"
                                              value={
                                                values.radPortion
                                                  ? values.radPortion
                                                  : ""
                                              }
                                              placeholder={"$0.00"}
                                              // onBlur={handleBlur}
                                              onBlur={() => {
                                                setFieldValue(
                                                  "isPaymentMethodChange",
                                                  true
                                                );
                                                setpaymentMethodChanged(true);
                                              }}
                                              onValueChange={(x, src) => {
                                                if (src.source === "event") {
                                                  setFieldValue(
                                                    "radPortion",
                                                    x.floatValue
                                                  );
                                                  setFieldValue(
                                                    "dapdacPortion",
                                                    values.lumsumEquivalent -
                                                      x.floatValue,
                                                    false
                                                  );
                                                }
                                                setPaymentMethodCheckboxChange(
                                                  true
                                                );
                                              }}
                                              style={{
                                                fontSize: "14px",
                                                width: "90%",
                                              }}
                                              className={
                                                "text form-control" +
                                                (errors.radPortion &&
                                                touched.radPortion &&
                                                paymentMethodChanged &&
                                                paymentChangeEnabled
                                                  ? " is-invalid"
                                                  : "")
                                              }
                                              disabled={!paymentChangeEnabled}
                                            />
                                          </Col>
                                          <div style={{ marginLeft: "111px" }}>
                                            {paymentChangeEnabled && (
                                              <InlineBottomErrorMessage
                                                name="radPortion"
                                                msg={errors.radPortion}
                                                customStyle={customStyle}
                                              />
                                            )}
                                          </div>
                                        </FormGroup>
                                        <FormGroup row>
                                          <Label
                                            style={{
                                              textAlign: "right",
                                              marginLeft: "-7px",
                                            }}
                                            htmlFor="newType"
                                            column
                                            sm={4}
                                            // className={
                                            //   errors.newType && touched.newType
                                            //     ? ' is-invalid-label required-field'
                                            //     : 'required-field'
                                            // }
                                          >
                                            {selectedPaymentMethod.name.replaceAll(
                                              " ",
                                              ""
                                            ) === "RAD/DAPCombination"
                                              ? "DAP Portion"
                                              : "DAC Portion"}
                                          </Label>
                                          <Col sm={6}>
                                            {/* <Field
                                                name="dapPortion"
                                                type="number"
                                                value={values.dapPortion}
                                                placeholder={'0.00'}
                                                style={{
                                                  fontSize: '14px',
                                                  width: '123%',
                                                }}
                                                disabled={true}
                                              /> */}
                                            <NumberFormat
                                              thousandSeparator={true}
                                              prefix={"$"}
                                              // maxLength={16}
                                              fixedDecimalScale={2}
                                              allowNegative={false}
                                              decimalScale={2}
                                              name="dapdacPortion"
                                              id="dapdacPortion"
                                              value={
                                                values.dapdacPortion
                                                  ? values.dapdacPortion
                                                  : ""
                                              }
                                              placeholder={"$0.00"}
                                              style={{
                                                fontSize: "14px",
                                                width: "125%",
                                                marginLeft: "7px",
                                              }}
                                              className="text form-control"
                                              disabled
                                            />
                                          </Col>

                                          <Col sm={2}>
                                            <p
                                              style={{
                                                marginLeft: "29px",
                                                paddingTop: "8px",
                                              }}
                                            >
                                              {values.changedMpir &&
                                              values.dapdacPortion
                                                ? "$" +
                                                  (
                                                    (values.changedMpir *
                                                      values.dapdacPortion) /
                                                    36500
                                                  ).toFixed(2)
                                                : ""}
                                            </p>
                                          </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                          <Label
                                            sm={4}
                                            style={{ textAlign: "right" }}
                                          >
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
                                                className="customCheck"
                                                disabled={!paymentChangeEnabled}
                                                style={{ marginTop: "10px" }}
                                              />{" "}
                                            </FormGroup>
                                          </Col>
                                          <Label
                                            sm={5}
                                            style={{
                                              marginLeft: "-56px",
                                              width: "fit-content",
                                            }}
                                          >
                                            {selectedPaymentMethod.name.replaceAll(
                                              " ",
                                              ""
                                            ) === "RAD/DAPCombination"
                                              ? "Drawdown DAP from RAD"
                                              : "Drawdown DAC from RAC"}
                                          </Label>
                                        </FormGroup>
                                        <FormGroup row>
                                          <Label
                                            sm={4}
                                            style={{ textAlign: "right" }}
                                          >
                                            {""}
                                          </Label>
                                          <Col sm={3}></Col>
                                          <Label
                                            sm={5}
                                            style={{ marginLeft: "-56px" }}
                                          >
                                            {RECOVERYMETHOD}
                                          </Label>
                                          <Col
                                            sm={4}
                                            style={{
                                              marginTop: "-11%",
                                              marginLeft: "77%",
                                              width: "41%",
                                            }}
                                          >
                                            <SingleSelect
                                              isDisabled={
                                                !paymentChangeEnabled ||
                                                !values.isDrowdownDap
                                              }
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

                                            {/* <Select
                                              placeholder="Select...."
                                              onChange={(selected) => {
                                                setFieldValue(
                                                  "recoveryMethodId",
                                                  selected.id
                                                );
                                                setSelectedRecovery(selected);
                                              }}
                                              options={recoveryList}
                                              isOptionSelected={(x) => {
                                                return selectedRecovery &&
                                                  x.id === selectedRecovery.id
                                                  ? x
                                                  : null;
                                              }}
                                              value={selectedRecovery}
                                              isDisabled={
                                                !paymentChangeEnabled ||
                                                !values.isDrowdownDap
                                              }
                                              isSearchable={
                                                recoveryList.length < 5
                                                  ? false
                                                  : true
                                              }
                                            /> */}
                                          </Col>
                                        </FormGroup>
                                      </Row>
                                      {/* </div> */}
                                    </Col>
                                  </FormGroup>
                                </>
                              ) : (
                                <></>
                              )}
                            </Row>
                          </div>

                          {type === EDIT ? (
                            <>
                              <div
                                className="paymentouterbox"
                                style={{ height: "227%", marginTop: "25px" }}
                              >
                                <Row className={"fieldStyle"}>
                                  <div
                                    className="head"
                                    style={{
                                      marginTop: "-20px",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {VARIATIONHISTORY}
                                  </div>
                                  <hr
                                    className="headerBorder"
                                    style={{
                                      width: "177%",
                                      marginLeft: "-7px",
                                      marginTop: "-2px",
                                    }}
                                  ></hr>
                                  <br />

                                  <FormGroup row>
                                    <Label
                                      style={{
                                        textAlign: "right",
                                        fontWeight: "bold",
                                      }}
                                      htmlFor=""
                                      column
                                      sm={4}
                                    >
                                      {FIRSTCREATEDBY}
                                    </Label>
                                    <Col sm={8}>
                                      <p style={{ marginTop: "7px" }}>
                                        {values.firstCreatedBy}
                                      </p>
                                      {/* <p style={{ marginTop: "7px" }}>
                                        {values.createdBy}
                                        {","} {convertDate(values.createdAt)}
                                      </p> */}
                                    </Col>
                                  </FormGroup>
                                  <FormGroup row>
                                    <Label
                                      style={{
                                        textAlign: "right",
                                        fontWeight: "bold",
                                      }}
                                      htmlFor=""
                                      column
                                      sm={4}
                                    >
                                      {LASTMODIFIEDBY}
                                    </Label>
                                    <Col sm={8}>
                                      <p style={{ marginTop: "7px" }}>
                                        {values.lastModifiedBy}
                                      </p>
                                      {/* <p style={{ marginTop: "7px" }}>
                                        {values.updatedBy}
                                        {","} {convertDate(values.lastUpdated)}
                                      </p> */}
                                    </Col>
                                  </FormGroup>
                                </Row>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
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
                  onClick={() => {
                    setFieldValue("isPaymentMethodChange", true);
                    setFieldValue("isPriceChange", true);
                    setSupportCategoryChanged(true);
                  }}
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

export default AddPaymentVariationDetails;
