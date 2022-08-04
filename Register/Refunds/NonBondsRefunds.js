import React, { useState, useEffect, useRef } from "react";
import Page from "../../../components/Page";
import Icon from "../../../../src/assets/Images/icon.png";
import { Row, Col, Card } from "reactstrap";
import MuiDatePicker from "../../../components/DatePicker/MaterialUi";
import { CKEditor } from "ckeditor4-react";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
import "../../../css/Refunds.css";
import { Form, Formik, useFormikContext } from "formik";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import {
  ACTUALAMOUNTDUE,
  ACTUALAMOUNTDUECONTENT,
  ADD,
  BONDREFUND,
  BONDREFUNDCONTENT,
  DEATHOFRESIDENT,
  DEATHOFRESIDENTCONTENT,
  EDIT,
  INFO,
  NOTIFICATION,
  NOTIFICATIONTITLE,
  REFUNDDATEOBLIGATED,
  REFUNDDATEOBLIGATEDCONTENT,
} from "../../../constant/FieldConstant";
import WarningMessageModelAlert from "../../../components/WarningMessageModelAlert";
import RefundsWarningModal from "../../../components/RefundsWarningModal";
import AddTransferTo from "./AddTransferTo";
import SuccessAlert from "../../../components/SuccessAlert";
import transferredFacilityService from "../../../services/Master/transferredFacility.service";
import residentRefundsService from "../../../services/Resident/residentRefunds.service";
import moment from "moment";
import DirtyWarningAlert from "../../../components/DirtyWarningAlert";
import BondRefundsWarning from "../../../components/BondRefundsWarning";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import WarningAlert from "../../../components/ModalWarning";
import SingleSelect from "../../../components/MySelect/MySelect";
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

const NonBondRefunds = ({
  refundComplete,
  isRefundTab,
  isBond,
  isRefundTabContinue,
  checkIsFinalized,
  AddResidentClickedScreen,
  editDataId,
  activeStep,
  callbackIsUnsavedData,
  isCancelling,
  isSaveAndExit,
  handleSaveExit,
  navigationToView,
  admissionDate,
}) => {
  const [initialValues, setInitialValues] = useState({
    dateOfDeath: "",
    probateDate: "",
    refundDate: "",
    comment: "",
    notificationDate: "",
    reasonOfTransfer: "",
    transferTo: "",
    transferDate: "",
  });
  const [dDeath, setDDeath] = useState();
  const [pDeath, setPDeath] = useState();
  const [rDeath, setRDeath] = useState();
  const [errorArray, setErrorArray] = useState([]);
  const [isRefunds, setIsRefunds] = useState(false);
  const [isRefundsReason, setIsRefundsReason] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showWarningAlert2, setShowWarningAlert2] = useState(false);
  const [title, setTitle] = useState([]);
  const [reasonOfTransferList, setReasonOfTransferList] = useState([]);
  const [selectedReasonOfTransfer, setSelectedReasonOfTransfer] = useState();

  const [transferToList, setTransferToList] = useState([]);
  const [transferTo, setTransferTo] = useState();

  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [actionType, setActionType] = useState();
  const [data, setData] = useState({});

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});

  const [warningAlertOptions, setWarningAlertOptions] = useState({});

  const [loading, setLoading] = useState(false);

  const [notificationDate, setNotificationDate] = useState();
  const [transferDate, setTransferDate] = useState();

  const [refundDetails, setRefundDetails] = useState();

  const [intrestAmtObligated, setIntrestAmtObligated] = useState();
  const [totalRefundAmt, setTotalRefundAmt] = useState();
  const [radRacPayableAmt, setRadRacPayableAmt] = useState();

  const [intrestMPIRCpy, setIntrestMPIRCpy] = useState();

  const [totalRefundAmtCpy, setTotalRefundAmtCpy] = useState();
  const [radRacPayableAmtCpy, setRadRacPayableAmtCpy] = useState();
  const [ckEditorData, setckEditorData] = useState("");

  const [showFinallzeAlert, setShowFinallzeAlert] = useState(false);

  const form1 = useRef();

  const [selectTransferId, setSelectTransferId] = useState();

  const [apiType, setApiType] = useState(null);
  // const [selectedRowData, setSelectedRowData] = useState({});
  const [obligedDate, setObligatedDate] = useState();
  const [isFinalized, setIsFinalized] = useState(false);

  const [intrestBIRCpy, setIntrestBIRCpy] = useState();

  const [validationArray, setValidationArray] = useState();
  const [showFinalizeErrorPopup, setShowFinalizeErrorPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState([]);
  const [mpir, setMpir] = useState();
  const [bir, setBir] = useState();
  const [warningPopupCount, setWarningPopupCount] = useState(0);
  const [navigateTo, setNavigateTo] = useState(false);
  const [finalDiff, setFinalDiff] = useState();
  const [templateData, setTemplateData] = useState();
  const [tempId, setTempId] = useState(undefined);
  const [commentData, setCommentData] = useState(
    localStorage.getItem("ckEditorData", ckEditorData) !== null &&
      localStorage.getItem("ckEditorData", ckEditorData)
  );
  const [isValidating, setIsValidating] = useState(false);

  let navigate = useNavigate();
  useEffect(() => {
    if (navigationToView) {
      navigate("/eRADWeb/viewResident", { replace: true });
    }
  }, [navigationToView]);

  useEffect(() => {
    getAllRefundsDetails();
    getAlltransferredFacilityList();
    getAllReasonOfTransferList();
    var initialComment = localStorage.getItem("ckEditorData", ckEditorData);
    if (initialComment !== null) {
      setckEditorData(localStorage.getItem("ckEditorData"));
      setCommentData(localStorage.getItem("ckEditorData", ckEditorData));
    }
  }, []);

  useEffect(() => {
    const check = localStorage.getItem("ckEditorData");
    var initialComment = localStorage.getItem("ckEditorData", ckEditorData);
    if (initialComment !== null) {
      setCommentData(initialComment ? initialComment : "");
    }
  }, [activeStep]);

  const handlIsUnSavedDataFormik = (data) => {
    callbackIsUnsavedData(data);
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

  useEffect(() => {
    const formattedRDate = new Date(rDeath).toJSON();
    if (formattedRDate) {
      getMpirBirValues(formattedRDate);
    }
  }, [rDeath, notificationDate]);

  useEffect(() => {
    if (isRefundTab) {
      // form1.current.dispatchEvent(
      //   new Event("submit", { bubbles: true, cancelable: true })
      // );
      form1.current.validateForm();
      if (errorArray.length == 0 && isValidating) {
        navigate("/eRADWeb/viewResident", { replace: true });
        console.log("BAD NAVIGATING");
      }
      setApiType(null);

      if (refundComplete) {
        navigate("/eRADWeb/viewResident", { replace: true });
      }
    }
  }, [isRefundTab, isRefundTabContinue]);

  useEffect(() => {
    if (!isRefundsReason) {
      setObligatedDate(moment(pDeath, "YYYY-MM-DD").add(14, "days"));
    } else {
      setObligatedDate(moment(notificationDate, "YYYY-MM-DD").add(14, "days"));
    }
  }, [notificationDate, pDeath, refundDetails, isRefundsReason]);

  useEffect(() => {
    if (!isRefundsReason) {
      setIntrestAmtObligated(moment(obligedDate).diff(moment(dDeath), "days"));
    } else {
      setIntrestAmtObligated(
        moment(obligedDate).diff(moment(transferDate), "days") + 1
      );
    }
  }, [dDeath, obligedDate, notificationDate, transferDate]);

  useEffect(() => {
    const payableAmt = refundDetails && refundDetails.radRacPayable;
    const mpirVal =
      refundDetails &&
      ((refundDetails.radRacPayable * mpir) / 36500) *
        moment(rDeath).diff(moment(obligedDate), "days");

    const birVal =
      refundDetails &&
      ((refundDetails.radRacPayable * bir) / 36500) * intrestAmtObligated;

    setTotalRefundAmt(payableAmt + mpirVal + birVal);
  }, [
    refundDetails,
    bir,
    mpir,
    rDeath,
    obligedDate,
    intrestAmtObligated,
    notificationDate,
  ]);

  const currentintrestdiff = moment(obligedDate).diff(moment(rDeath), "days");
  const penaltydifference = moment(rDeath).diff(moment(obligedDate), "days");

  useEffect(() => {
    const diffBtwm = moment(rDeath).diff(moment(obligedDate), "days");
    setFinalDiff(diffBtwm);

    const penaltyDate1 =
      refundDetails &&
      ((refundDetails.radRacPayable * mpir) / 36500) * finalDiff;
  }, [obligedDate, rDeath, pDeath, mpir]);

  useEffect(() => {
    if (isFinalized) {
      checkIsFinalized(isFinalized);
    }
  }, [isFinalized]);

  useEffect(() => {
    const result = reasonOfTransferList.filter((x) => x.id === tempId);
    if (result && result.length > 0) {
      setSelectedReasonOfTransfer(result);
    }
  }, [tempId]);

  const resetFields = () => {
    setInitialValues({
      dateOfDeath: null,
      probateDate: null,
      refundDate: null,
      comment: "",
      commentdeath: "",
      notificationDate: null,
      reasonOfTransfer: "",
      transferTo: "",
      transferDate: null,
    });
    setDDeath();
    setPDeath();
    setRDeath();
    setNotificationDate();
    setTransferDate();
    setObligatedDate("");
    setSelectedReasonOfTransfer(null);
    //setSelectedReasonOfTransfer("");
    console.log("SETTING TO EMPTY");
    setIsValidating(false);
  };

  const handleEditorChange = (event) => {
    let Data = event.editor.getData();
    setckEditorData(Data);
  };

  const handleCloseModal = () => {
    setApiType(null);
  };

  const getAlltransferredFacilityList = () => {
    setLoading(true);
    transferredFacilityService
      .getAlltransferredFacility()
      .then((response) => {
        console.log("getAlltransferredFacilityList", response);
        const result = response.map((x, index) => {
          x.value = x.id;
          x.label = x.name;
          x.id = x.id;
          return x;
        });
        setTransferToList(result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getMpirBirValues = (formattedRDate) => {
    if (formattedRDate) {
      residentRefundsService
        .getRefundsMpirBir(formattedRDate)
        .then((response) => {
          setLoading(false);
          setMpir(response.result.mpir);
          setBir(response.result.bir);
          console.log("getMpirBirValues response", response);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const getAllReasonOfTransferList = () => {
    setLoading(true);
    residentRefundsService
      .getReasonOfTransfer()
      .then((response) => {
        console.log("getAllReasonOfTransferList", response);
        const result = response.result.map((x, index) => {
          x.id = x.id;
          x.label = x.name;
          return x;
        });
        setReasonOfTransferList(result.splice(1));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAllRefundsDetails = (bond) => {
    setLoading(true);
    var residentId = localStorage.getItem("residentId");

    residentRefundsService
      .getRefundsDetails(residentId, isBond)
      .then((response) => {
        console.log("getAllRefundsDetails response", response);

        setRefundDetails(response.result);
        setDDeath(response.result.dateOfDeath);
        setPDeath(response.result.probateDateSighted);
        setRDeath(response.result.refundDateActual);
        setNotificationDate(response.result.notificationDate);
        setTransferDate(response.result.transferDate);
        setIsFinalized(response.result.isFinalised);

        if (response.result.comments !== null) {
          setInitialValues({ comments: response.result.comments });
          localStorage.setItem("ckEditorData", response.result.comments);
          setckEditorData(response.result.comments);
          setCommentData(response.result.comments);
        } else {
          setInitialValues({ comments: "" });
          localStorage.removeItem("ckEditorData");
          setckEditorData("");
          setCommentData("");
        }

        setInitialValues({
          dateOfDeath: response.result.dateOfDeath,
          probateDate: response.result.probateDateSighted,
          refundDate: response.result.refundDateActual,
          comment: response.result.comments,
          notificationDate: response.result.notificationDate,
          reasonOfTransfer: {
            id: response.result.transferReasonId,
            name: response.result.transferReason,
            key: response.result.transferReason,
            label: response.result.transferReason,
          },
          transferTo: {
            id: response.result.transferToId,
            name: response.result.transferTo,
            key: response.result.transferToId,
            label: response.result.transferTo,
          },
          transferDate: response.result.transferDate,
        });

        setTemplateData({
          dateOfDeath: response.result.dateOfDeath,
          probateDate: response.result.probateDateSighted,
          refundDate: response.result.refundDateActual,
          comment: response.result.comments,
          notificationDate: response.result.notificationDate,
          reasonOfTransfer: {
            id: response.result.transferReasonId,
            name: response.result.transferReason,
            key: response.result.transferReason,
            label: response.result.transferReason,
          },
          transferTo: {
            id: response.result.transferToId,
            name: response.result.transferTo,
            key: response.result.transferToId,
            label: response.result.transferTo,
          },
          transferDate: response.result.transferDate,
        });

        setSelectTransferId({
          id: response.result.transferReasonId,
          name: response.result.transferReason,
          key: response.result.transferReason,
          label: response.result.transferReason,
        });
        setSelectedReasonOfTransfer({
          id: response.result.transferReasonId,
          name: response.result.transferReason,
          key: response.result.transferReason,
          label: response.result.transferReason,
        });

        if (transferTo !== null) {
          setTransferTo({
            id: response.result.transferToId,
            name: response.result.transferTo,
            key: response.result.transferToId,
            label: response.result.transferTo,
          });
        } else {
          setTransferTo(null);
        }
        if (
          response.result.transferReasonId == 1 ||
          response.result.transferReasonId == 0
        ) {
          // setIsRefunds(false);
          setIsRefundsReason(false);
          setSelectTransferId(response.result.transferReasonId);
        } else {
          // setIsRefunds(true);
          setIsRefundsReason(true);
        }

        if (response.result.transferReasonId > 0) {
          setIsRefunds(true);
        } else {
          setIsRefunds(false);
        }

        setTemplateData({
          dateOfDeath: response.result.dateOfDeath,
          probateDate: response.result.probateDateSighted,
          refundDate: response.result.refundDateActual,
          comment: response.result.comments,
          notificationDate: response.result.notificationDate,
          reasonOfTransfer: {
            id: response.result.transferReasonId,
            name: response.result.transferReason,
            key: response.result.transferReason,
            label: response.result.transferReason,
          },
          transferTo: {
            id: response.result.transferToId,
            name: response.result.transferTo,
            key: response.result.transferToId,
            label: response.result.transferTo,
          },
          transferDate: response.result.transferDate,
        });

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAllRefundsValidation = () => {
    var residentId = localStorage.getItem("residentId");
    var date = isRefundsReason
      ? new Date(transferDate).toJSON()
      : new Date(pDeath).toJSON();
    const refunddate = new Date(rDeath).toJSON();
    //setLoading(true);
    residentRefundsService
      .getRefundsValidation(residentId, isBond, date, refunddate)
      .then((response) => {
        if (response.result && response.result.length > 0) {
          const filteredArrors = response.result.filter(
            (ob) => ob.message && ob.message.length > 2
          );
          if (filteredArrors && filteredArrors.length > 0) {
            setValidationArray(filteredArrors);
            setErrorPopup(filteredArrors[0]);
            var noOfPopups = filteredArrors.length;
            onContinueEop();
          }
        } else {
          setShowFinalizeErrorPopup(false);
        }
      })
      .catch((response) => {
        setLoading(false);
      });
  };

  const onContinueEop = () => {
    setShowFinalizeErrorPopup(!showFinalizeErrorPopup);
    let popUp = validationArray.length;
    if (validationArray) {
      if (popUp > warningPopupCount) {
        setWarningAlertOptions({
          header: validationArray[warningPopupCount]?.header,
          messageBody: validationArray[warningPopupCount]?.message,
        });
        setShowFinalizeErrorPopup(true);
      } else {
        updatedDetailsApiCall(apiType);
      }
      setWarningPopupCount(warningPopupCount + 1);
    }
  };
  const onEopCancelClick = () => {
    setShowFinalizeErrorPopup(!showFinalizeErrorPopup);
  };

  const callBackAddEditFormToViewForm = (childdata, success, msg = null) => {
    setShowAddEditForm(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        actionType: EDIT,
        msg: msg,
        callback: () => {
          setShowSuccessAlert(false);
          getAlltransferredFacilityList();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const onHandleMessage = (type, title, content) => {
    setShowWarningAlert(!showWarningAlert);
    const setNewTitle = {
      warningType: type,
      header: title,
      msg: content,
    };
    setTitle(setNewTitle);
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

  const handleCopy = () => {
    setIntrestBIRCpy(
      !isRefundsReason
        ? penaltydifference < 0
          ? refundDetails &&
            ((refundDetails.radRacPayable * bir) / 36500) * currentintrestdiff
          : refundDetails &&
            ((refundDetails.radRacPayable * bir) / 36500) * intrestAmtObligated
        : penaltydifference > 0
        ? refundDetails &&
          ((refundDetails.radRacPayable * bir) / 36500) * intrestAmtObligated
        : refundDetails &&
          ((refundDetails.radRacPayable * bir) / 36500) *
            moment(rDeath).diff(moment(transferDate), "days")
    );
    setIntrestMPIRCpy(
      isRefundsReason
        ? penaltydifference > 0
          ? refundDetails &&
            ((refundDetails.radRacPayable * mpir) / 36500) * finalDiff
          : 0
        : penaltydifference > 0
        ? refundDetails &&
          ((refundDetails.radRacPayable * mpir) / 36500) * penaltydifference
        : 0
    );
    setTotalRefundAmtCpy(totalRefundAmt);
    setRadRacPayableAmtCpy(refundDetails && refundDetails.radRacPayable);
  };

  const handleShow = () => {
    setShowAddEditForm(true);
    // setSelectedRowData({});
    setActionType(ADD);
  };

  const updatedDetailsApiCall = (clickType) => {
    var residentId = localStorage.getItem("residentId");
    let comment = "";
    const updatedObj = {
      residentId: Number(residentId),
      isBond: isBond,
      isDeathOfResident: isRefundsReason ? false : true,
      dateOfDeath: dDeath ? moment(dDeath).format() : "",
      refundDateActual: rDeath ? moment(rDeath).format() : "",
      probateDateSighted: pDeath ? moment(pDeath).format() : "",
      transferReasonId: !isRefundsReason
        ? 1
        : selectedReasonOfTransfer
        ? selectedReasonOfTransfer.id
        : null,
      transferTo: transferTo ? transferTo.id : null,
      notificationDate: notificationDate
        ? moment(notificationDate).format()
        : null,
      transferDate: transferDate ? moment(transferDate).format() : "",
      comments: comment,
      interestAmount: totalRefundAmt ? totalRefundAmt : 0,
      interestBIR: intrestBIRCpy ? intrestBIRCpy : 0,
      interestMPIR: intrestMPIRCpy ? intrestMPIRCpy : 0,
      radRacPayable: radRacPayableAmt ? radRacPayableAmt : 0,
      comment: ckEditorData && ckEditorData !== "" ? ckEditorData : "",
    };
    if (isValidating && isRefunds) {
      // setLoading(true);
      residentRefundsService
        .updateRefundDetails(updatedObj)
        .then((response) => {
          // console.log("updateRefundDetails response", response);
          getAllRefundsDetails();
          if (AddResidentClickedScreen !== "RADRACRefund") {
            setSuccessAlertOptions({
              title: "",
              actionType: EDIT,
              msg: response.message,
              callback: () => {
                setShowSuccessAlert(false);
              },
            });
          }

          if (apiType) {
            setShowFinallzeAlert(true);
          }
          // setLoading(false);

          if (
            !apiType &&
            isRefundTabContinue &&
            AddResidentClickedScreen !== "RADRACRefund"
          ) {
            navigate("/eRADWeb/viewResident", { replace: true });
          }
        })
        .catch((e) => {
          // setLoading(false);
        });
    }
    if (!clickType && isRefunds) {
      residentRefundsService
        .updateRefundDetails(updatedObj)
        .then((response) => {
          // console.log("***updateRefundDetails response", response);
          if (
            !apiType &&
            isRefundTabContinue &&
            AddResidentClickedScreen !== "RADRACRefund"
          ) {
            navigate("/eRADWeb/viewResident", { replace: true });
          } else if (AddResidentClickedScreen === "RADRACRefund") {
            setSuccessAlertOptions({
              title: "",
              actionType: ADD,
              msg: "Your data has been saved successfully",
              callback: () => {
                setShowSuccessAlert(false);
              },
            });
            setShowSuccessAlert(true);
          }
        })
        .catch((e) => {
          // setLoading(false);
        });
    }
    if (
      !apiType &&
      isRefundTabContinue &&
      AddResidentClickedScreen !== "RADRACRefund"
    ) {
      navigate("/eRADWeb/viewResident", { replace: true });
    }
  };

  const finalizeRefundCallBack = (childdata, success) => {
    setShowFinallzeAlert(childdata);
    if (success) {
      setLoading(true);
      handleFinalizeRefund();
    }
  };

  const handleFinalizeRefund = () => {
    var residentId = localStorage.getItem("residentId");
    const finalizeObj = {
      residentId: residentId,
      isRefundFinalised: true,
    };
    setLoading(true);
    residentRefundsService
      .finalizeRefund(finalizeObj)
      .then((response) => {
        console.log("finalizeRefund response", response);
        setLoading(false);
        callBackAddEditFormToViewForm(false, true, response.message);
        getAllRefundsDetails();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const saveRefundOnFinalize = async (clickType) => {
    setIsValidating(true);
    console.log("saveRefundOnFinalize");
    setNavigateTo(false);
    if (errorArray === {} || errorArray === []) {
      var residentId = localStorage.getItem("residentId");

      if (isFinalized === false) {
        if (apiType) {
          await getAllRefundsValidation();
          await updatedDetailsApiCall(clickType);
        } else {
          updatedDetailsApiCall(null);
        }
      }
    }
  };

  const saveRefund = async (clickType) => {
    setIsValidating(true);
    setNavigateTo(true);
    var residentId = localStorage.getItem("residentId");
    if (isFinalized === false) {
      if (apiType === "finalize") {
        await getAllRefundsValidation();
        await updatedDetailsApiCall(clickType);
      } else {
        updatedDetailsApiCall(null);
      }
    }
  };

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];

    if (isRefundsReason && isRefunds) {
      if (!selectedReasonOfTransfer) {
        errorObj.reasonOfTransfer = "Required Field";
        errorArr.push({ name: "reasonOfTransfer" });
      }

      if (!notificationDate) {
        errorObj.notificationDate = "Required Field";
        errorArr.push({ name: "notificationDate" });
      }

      if (!transferDate) {
        errorObj.transferDate = "Required Field";
        errorArr.push({ name: "transferDate" });
      }
      if (!rDeath) {
        errorObj.refundDate = "Required Field";
        errorArr.push({ name: "refundDate" });
      }
      if (
        selectedReasonOfTransfer &&
        selectedReasonOfTransfer.id == 7 &&
        values.transferTo == null
      ) {
        errorObj.transferTo = "Required Field";
        errorArr.push({ name: "transferTo" });
      }
    }

    if (!isRefundsReason && isRefunds) {
      if (!dDeath || dDeath > moment()) {
        errorObj.dateOfDeath = !dDeath
          ? "Required Field"
          : "Date of Death Cannot Be Future Date";
        errorArr.push({ name: "dateOfDeath" });
      }

      if (!pDeath) {
        errorObj.probateDate = "Required Field";
        errorArr.push({ name: "probateDate" });
      }

      if (!rDeath) {
        errorObj.refundDate = "Required Field";
        errorArr.push({ name: "refundDate" });
      }

      if (rDeath && !rDeath > pDeath) {
        errorObj.refundDate =
          "The refund date must be later than or the same as the probate date.";
        errorArr.push({ name: "refundDate" });
      }
    }

    if (Object.keys(errorObj).length === 0) {
      saveRefund(null);
    }
    setErrorArray(errorObj);
    if (errorObj.length) {
      setErrorArray(errorObj);
      handleSaveExit(true);
    }
    return errorObj;
  };

  const handleErrorOk = (tmpData) => {
    setShowFinalizeErrorPopup(false);
    // const CpyValidationArray=[...validationArray]
    const indx = validationArray.findIndex((ob) => ob.id === tmpData.id);
    if (indx >= 0) {
      validationArray.splice(indx, 1);
    }
    if (validationArray && validationArray.length > 0) {
      setErrorPopup(validationArray[0]);
      setShowFinalizeErrorPopup(true);
    } else {
      setShowFinalizeErrorPopup(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <>
          <Page
            title=""
            style={{
              // margin: "1rem",
              pointerEvents: refundComplete ? "none" : "",
            }}
            className={isFinalized ? "fourthTab" : ""}
          >
            <Row>
              <Col sm={6}>
                <div className="head pb-0" style={{ marginTop: "10px" }}>
                  <img src={Icon} className="icon" />
                  RAD / RAC Refund
                </div>
                <hr className="headerBorder" />
                <div className="col-8" style={{ marginLeft: "1rem" }}>
                  <div className="d-flex mt-2">
                    <div className="col-4" style={{ marginRight: "1rem" }}>
                      <p className="mt-2 text-end">
                        Is the Resident being Refunded?
                      </p>
                    </div>
                    <div
                      class="form-check"
                      style={{
                        marginTop: "10px",
                        marginLeft: "-12px",
                        fontSize: "10px",
                      }}
                    >
                      <input
                        type="radio"
                        checked={isRefunds ? true : false}
                        onChange={() => {
                          setIsRefunds(!isRefunds);
                        }}
                      />
                      <label
                        class="form-check-label"
                        for="flexRadioDefault1"
                        style={{ marginLeft: "10px" }}
                      >
                        Yes
                      </label>
                    </div>

                    <div
                      class="form-check"
                      style={{
                        marginTop: "10px",
                        marginLeft: "-12px",
                        fontSize: "10px",
                      }}
                    >
                      <input
                        type="radio"
                        checked={isRefunds ? false : true}
                        onChange={() => {
                          setIsRefunds(!isRefunds);
                          setSelectedReasonOfTransfer(null);
                          resetFields();
                        }}
                      />
                      <label
                        class="form-check-label"
                        for="flexRadioDefault1"
                        style={{ marginLeft: "10px" }}
                      >
                        No
                      </label>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="col-4" style={{ marginRight: "-4px" }}>
                      <p className="mt-2 text-end">
                        Refund Reason
                        <i
                          className="fa fa-info-circle fa-sm"
                          style={{
                            cursor: "pointer",
                            marginLeft: "6px",
                            fontSize: "15px",
                          }}
                          onClick={() =>
                            onHandleMessage2(
                              INFO,
                              BONDREFUND,
                              BONDREFUNDCONTENT.TEXT
                            )
                          }
                        ></i>
                      </p>
                    </div>

                    <div class="form-check m-2">
                      <input
                        type="radio"
                        checked={isRefundsReason ? false : true}
                        onChange={() => {
                          setIsRefundsReason(!isRefundsReason);
                          resetFields();
                        }}
                        disabled={!isRefunds}
                      />
                      <label
                        class="form-check-label"
                        for="flexRadioDefault1"
                        style={{ marginLeft: "10px" }}
                        disabled={!isRefunds}
                      >
                        Death of Resident
                      </label>
                    </div>

                    <div class="form-check m-2">
                      <input
                        type="radio"
                        checked={isRefundsReason ? true : false}
                        onChange={() => {
                          setIsRefundsReason(!isRefundsReason);
                          resetFields();
                        }}
                        disabled={!isRefunds}
                      />
                      <label
                        class="form-check-label"
                        for="flexRadioDefault1"
                        style={{ marginLeft: "10px" }}
                        disabled={!isRefunds}
                      >
                        Transfer / Cease Care
                      </label>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Col sm={12}>
              <div className="head pb-0" style={{ marginTop: "10px" }}>
                <img src={Icon} className="icon" />
                Refund Details
              </div>
              <hr className="headerBorder" />
            </Col>
            <Row>
              <Col sm={4}>
                <Formik
                  enableReinitialize
                  innerRef={form1}
                  initialValues={initialValues}
                  validate={validateForm}
                  validateOnChange={false}
                  validateOnBlur={false}
                  // onSubmit={saveRefund}
                >
                  {({
                    errors,
                    handleSubmit,
                    handleChange,
                    isSubmitting,
                    setErrors,
                    touched,
                    values,
                    setFieldValue,
                    setFieldTouched,
                    handleBlur,
                    dirty,
                  }) => (
                    <Form onSubmit={handleSubmit} innerRef={form1}>
                      <AutoSubmitToken
                        handlIsUnSavedDataFormik={handlIsUnSavedDataFormik}
                      />
                      {/* {JSON.stringify(templateData) !== JSON.stringify(initialValues) && */}
                      {dirty && !isCancelling && !isSaveAndExit ? (
                        <DirtyWarningAlert
                          isBlocking={dirty && !isCancelling}
                          sourceName={
                            editDataId ? "Edit Resident" : "Add New Resident"
                          }
                          messageBody={
                            "Are you sure you want to exit to the Register and discard these changes?"
                          }
                        />
                      ) : null}

                      {isRefundsReason ? (
                        <>
                          <div className="d-flex mt-2">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            >
                              <p
                                className={
                                  (isValidating &&
                                    errors.reasonOfTransfer &&
                                    touched.reasonOfTransfer &&
                                    !selectedReasonOfTransfer &&
                                    isRefunds) ||
                                  (isRefundTab &&
                                    !selectedReasonOfTransfer &&
                                    isRefunds)
                                    ? "mt-2 text-end is-invalid-label required-field fw-bold"
                                    : "mt-2 text-end required-field"
                                }
                              >
                                Reason of Transfer
                              </p>
                            </div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              <SingleSelect
                                name="reasonOfTransfer"
                                placeholder="Select...."
                                isDisabled={!isRefunds}
                                onBlur={(selected) =>
                                  setFieldTouched(
                                    "reasonOfTransfer",
                                    selected.id
                                  )
                                }
                                onChange={(selected) => {
                                  setFieldValue(
                                    "reasonOfTransfer",
                                    selected.id
                                  );
                                  setSelectedReasonOfTransfer(selected);
                                  if (selected !== 7) {
                                    setTransferTo(null);
                                    setFieldValue("transferTo", null);
                                  }
                                }}
                                value={selectedReasonOfTransfer}
                                error={
                                  errors.reasonOfTransfer && isValidating
                                    ? true
                                    : false
                                }
                                options={reasonOfTransferList}
                              />
                            </div>
                          </div>

                          <div className="d-flex">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            ></div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              {(isValidating &&
                                errors.reasonOfTransfer &&
                                touched.reasonOfTransfer &&
                                !selectedReasonOfTransfer &&
                                isRefunds) ||
                              (isRefundTab &&
                                !selectedReasonOfTransfer &&
                                isRefunds) ? (
                                <InlineBottomErrorMessage
                                  msg={errorArray.reasonOfTransfer}
                                />
                              ) : null}
                              {/* here */}
                            </div>
                          </div>

                          {selectedReasonOfTransfer &&
                          selectedReasonOfTransfer.id === 7 ? (
                            <>
                              <div className="d-flex mt-2">
                                <div
                                  className="col-3"
                                  style={{
                                    marginRight: "1rem",
                                  }}
                                >
                                  <p
                                    className={
                                      (isValidating &&
                                        errors.transferTo &&
                                        touched.transferTo &&
                                        !transferTo &&
                                        isRefunds) ||
                                      (isRefundTab && !transferTo && isRefunds)
                                        ? "mt-2 text-end fw-bold is-invalid-label required-field"
                                        : "mt-2 text-end required-field"
                                    }
                                  >
                                    Transfer To
                                  </p>
                                </div>

                                <div
                                  className="col-6"
                                  style={{ marginRight: "1rem" }}
                                >
                                  <SingleSelect
                                    name="transferTo"
                                    placeholder="Select...."
                                    onBlur={(selected) =>
                                      setFieldTouched("transferTo", selected.id)
                                    }
                                    onChange={(selected) => {
                                      setFieldValue("transferTo", selected.id);
                                      setTransferTo(selected);
                                    }}
                                    error={
                                      (isValidating &&
                                        errors.transferTo &&
                                        touched.transferTo &&
                                        !transferTo &&
                                        isRefunds) ||
                                      (isRefundTab && !transferTo && isRefunds)
                                        ? true
                                        : false
                                    }
                                    options={transferToList}
                                    // isOptionSelected={(x) => {
                                    //   return transferTo &&
                                    //     x.id === transferTo.id
                                    //     ? x
                                    //     : null;
                                    // }}
                                    value={transferTo}
                                    // isSearchable={
                                    //   transferToList.length <= 6 ? false : true
                                    // }

                                    isDisabled={!isRefunds}
                                  />
                                </div>
                                <div
                                  className="col-6 AddNew"
                                  style={{
                                    marginRight: "1rem",
                                    marginTop: "10px",
                                    color: "blue",
                                    textDecorationLine: "underline",
                                    cursor: "pointer",
                                    width: "fit-content",
                                    paddingLeft: "30px",
                                  }}
                                  onClick={handleShow}
                                >
                                  Add New
                                </div>
                              </div>

                              <div className="d-flex">
                                <div
                                  className="col-3"
                                  style={{ marginRight: "1rem" }}
                                ></div>

                                <div
                                  className="col-6"
                                  style={{
                                    marginRight: "1rem",
                                    marginBottom: "8px",
                                    marginTop: "4px",
                                  }}
                                >
                                  {(isValidating &&
                                    errors.transferTo &&
                                    touched.transferTo &&
                                    !transferTo &&
                                    isRefunds) ||
                                  (isRefundTab && !transferTo && isRefunds) ? (
                                    <InlineBottomErrorMessage msg="Required field" />
                                  ) : null}
                                </div>
                                <div
                                  className="col-6"
                                  style={{
                                    marginRight: "1rem",
                                    marginTop: "10px",
                                    color: "blue",
                                    textDecorationLine: "underline",
                                    cursor: "pointer",
                                    width: "fit-content",
                                  }}
                                  onClick={handleShow}
                                ></div>
                              </div>
                            </>
                          ) : (
                            <div></div>
                          )}

                          <div
                            className={
                              selectedReasonOfTransfer &&
                              selectedReasonOfTransfer.id === 7
                                ? "d-flex"
                                : "d-flex mt-2"
                            }
                          >
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            >
                              <p
                                className={
                                  (isValidating &&
                                    errors.notificationDate &&
                                    touched.notificationDate &&
                                    !notificationDate &&
                                    isRefunds) ||
                                  (isRefundTab &&
                                    !notificationDate &&
                                    isRefunds)
                                    ? "mt-2 text-end is-invalid-label required-field"
                                    : "mt-2 text-end required-field"
                                }
                              >
                                Notification Date
                                <i
                                  className="fa fa-info-circle fa-sm"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "6px",
                                    fontSize: "15px",
                                  }}
                                  onClick={() =>
                                    onHandleMessage(
                                      INFO,
                                      NOTIFICATIONTITLE,
                                      NOTIFICATION.TEXT
                                    )
                                  }
                                ></i>
                              </p>
                            </div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              <MuiDatePicker
                                id="notificationDate"
                                name="notificationDate"
                                handleBlur={handleBlur}
                                className="text form-control"
                                selectedDate={notificationDate}
                                error={
                                  (isValidating &&
                                    errors.notificationDate &&
                                    touched.notificationDate &&
                                    !notificationDate &&
                                    isRefunds) ||
                                  (isRefundTab &&
                                    !notificationDate &&
                                    isRefunds)
                                }
                                getChangedDate={(val) => {
                                  setFieldValue("notificationDate", val);
                                  setNotificationDate(val);
                                }}
                                disabled={!isRefunds}
                              />
                            </div>
                          </div>

                          <div className="d-flex">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            ></div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              {(isValidating &&
                                errors.notificationDate &&
                                touched.notificationDate &&
                                !notificationDate &&
                                isRefunds) ||
                              (isRefundTab &&
                                !notificationDate &&
                                isRefunds) ? (
                                <InlineBottomErrorMessage
                                  msg={errorArray.notificationDate}
                                />
                              ) : null}
                            </div>
                          </div>

                          <div className="d-flex mt-2">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            >
                              <p
                                className={
                                  (isValidating &&
                                    errors.transferDate &&
                                    touched.transferDate &&
                                    !transferDate &&
                                    isRefunds) ||
                                  (isRefundTab && !transferDate && isRefunds)
                                    ? "mt-2 text-end is-invalid-label required-field"
                                    : "mt-2 text-end required-field"
                                }
                              >
                                Transfer / Cease Date
                              </p>
                            </div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              <MuiDatePicker
                                id="transferDate"
                                name="transferDate"
                                handleBlur={handleBlur}
                                className="text form-control"
                                selectedDate={transferDate}
                                minDate={admissionDate}
                                error={
                                  (isValidating &&
                                    errors.transferDate &&
                                    touched.transferDate &&
                                    !transferDate &&
                                    isRefunds) ||
                                  (isRefundTab && !transferDate && isRefunds)
                                }
                                getChangedDate={(val) => {
                                  setFieldValue("transferDate", val);
                                  setTransferDate(val);
                                }}
                                disabled={!isRefunds}
                              />
                            </div>
                          </div>

                          <div className="d-flex">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            ></div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              {(isValidating &&
                                errors.transferDate &&
                                touched.transferDate &&
                                !transferDate &&
                                isRefunds) ||
                              (isRefundTab && !transferDate && isRefunds) ? (
                                <InlineBottomErrorMessage
                                  msg={errorArray.transferDate}
                                />
                              ) : null}
                            </div>
                          </div>

                          <div className="d-flex mt-2">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            >
                              <p
                                className={
                                  (isValidating &&
                                    errors.refundDate &&
                                    touched.refundDate &&
                                    !rDeath &&
                                    isRefunds) ||
                                  (isRefundTab && !rDeath && isRefunds)
                                    ? "mt-2 text-end is-invalid-label required-field"
                                    : "mt-2 text-end required-field"
                                }
                              >
                                Refund Date (Actual)
                              </p>
                            </div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              <MuiDatePicker
                                id="refundDate"
                                name="refundDate"
                                handleBlur={handleBlur}
                                className="text form-control"
                                selectedDate={rDeath}
                                // minDate={pDeath}
                                error={
                                  (isValidating &&
                                    errors.refundDate &&
                                    touched.refundDate &&
                                    !rDeath &&
                                    isRefunds) ||
                                  (isRefundTab && !rDeath && isRefunds)
                                }
                                getChangedDate={(val) => {
                                  setFieldValue("refundDate", val);
                                  setRDeath(val);
                                }}
                                disabled={!isRefunds}
                              />
                            </div>
                          </div>

                          <div className="d-flex">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            ></div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              {(isValidating &&
                                errors.refundDate &&
                                touched.refundDate &&
                                !rDeath &&
                                isRefunds) ||
                              (isRefundTab && !rDeath && isRefunds) ? (
                                <InlineBottomErrorMessage
                                  msg={errorArray.refundDate}
                                />
                              ) : null}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="d-flex mt-2">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            >
                              <p
                                className={
                                  (isValidating &&
                                    errors.dateOfDeath &&
                                    touched.dateOfDeath &&
                                    !dDeath &&
                                    isRefunds) ||
                                  (isRefundTab && !dDeath && isRefunds)
                                    ? "mt-2 text-end is-invalid-label required-field"
                                    : "mt-2 text-end required-field"
                                }
                              >
                                Date of Death
                                <i
                                  className="fa fa-info-circle fa-sm"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "6px",
                                    fontSize: "15px",
                                  }}
                                  onClick={() =>
                                    onHandleMessage(
                                      INFO,
                                      DEATHOFRESIDENT,
                                      DEATHOFRESIDENTCONTENT.TEXT
                                    )
                                  }
                                ></i>
                              </p>
                            </div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              <MuiDatePicker
                                id="dateOfDeath"
                                name="dateOfDeath"
                                handleBlur={handleBlur}
                                className="text form-control"
                                selectedDate={dDeath}
                                error={
                                  (isValidating &&
                                    errors.dateOfDeath &&
                                    touched.dateOfDeath &&
                                    !dDeath &&
                                    isRefunds) ||
                                  (isRefundTab && !dDeath && isRefunds)
                                }
                                getChangedDate={(val) => {
                                  setFieldValue("dateOfDeath", val);
                                  setDDeath(val);
                                }}
                                disabled={!isRefunds}
                                maxDate={moment()}
                                minDate={admissionDate}
                              />
                            </div>
                          </div>
                          <div className="d-flex">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            ></div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              {(isValidating &&
                                errors.dateOfDeath &&
                                touched.dateOfDeath &&
                                !dDeath &&
                                isRefunds) ||
                              (isRefundTab && !dDeath && isRefunds) ? (
                                <InlineBottomErrorMessage
                                  msg={errorArray.dateOfDeath}
                                />
                              ) : null}
                            </div>
                          </div>
                          <div className="d-flex mt-2">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            >
                              <p
                                className={
                                  (isValidating &&
                                    errors.probateDate &&
                                    touched.probateDate &&
                                    !pDeath &&
                                    isRefunds) ||
                                  (isRefundTab && !pDeath && isRefunds)
                                    ? "mt-2 text-end is-invalid-label required-field"
                                    : "mt-2 text-end required-field"
                                }
                              >
                                Probate Date (Sighted)
                              </p>
                            </div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              <MuiDatePicker
                                id="probateDate"
                                name="probateDate"
                                handleBlur={handleBlur}
                                className="text form-control"
                                selectedDate={pDeath}
                                // minDate={pDeath}
                                error={
                                  (isValidating &&
                                    errors.probateDate &&
                                    touched.probateDate &&
                                    !pDeath &&
                                    isRefunds) ||
                                  (isRefundTab && !pDeath && isRefunds)
                                }
                                getChangedDate={(val) => {
                                  setFieldValue("probateDate", val);
                                  setPDeath(val);
                                }}
                                disabled={!isRefunds}
                              />
                            </div>
                          </div>
                          <div className="d-flex">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            ></div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              {(isValidating &&
                                errors.probateDate &&
                                touched.probateDate &&
                                !pDeath &&
                                isRefunds) ||
                              (isRefundTab && !pDeath && isRefunds) ? (
                                <InlineBottomErrorMessage
                                  msg={errorArray.probateDate}
                                />
                              ) : null}
                            </div>
                          </div>

                          <div className="d-flex mt-2">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            >
                              <p
                                className={
                                  (isValidating &&
                                    errors.refundDate &&
                                    touched.refundDate &&
                                    !rDeath &&
                                    isRefunds) ||
                                  (isRefundTab && !rDeath && isRefunds)
                                    ? "mt-2 text-end is-invalid-label required-field"
                                    : "mt-2 text-end required-field"
                                }
                              >
                                Refund Date (Actual)
                              </p>
                            </div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              <MuiDatePicker
                                id="refundDate"
                                name="refundDate"
                                handleBlur={handleBlur}
                                className="text form-control"
                                selectedDate={rDeath}
                                minDate={pDeath}
                                error={
                                  (isValidating &&
                                    errors.refundDate &&
                                    touched.refundDate &&
                                    !rDeath &&
                                    isRefunds) ||
                                  (isRefundTab && !rDeath && isRefunds)
                                }
                                getChangedDate={(val) => {
                                  setFieldValue("refundDate", val);
                                  setRDeath(val);
                                }}
                                disabled={!isRefunds}
                              />
                            </div>
                          </div>
                          <div className="d-flex">
                            <div
                              className="col-3"
                              style={{ marginRight: "1rem" }}
                            ></div>

                            <div
                              className="col-8"
                              style={{ marginRight: "1rem" }}
                            >
                              {(isValidating &&
                                errors.refundDate &&
                                touched.refundDate &&
                                !rDeath &&
                                isRefunds) ||
                              (isValidating &&
                                isRefundTab &&
                                !rDeath &&
                                isRefunds) ? (
                                <InlineBottomErrorMessage
                                  msg={errorArray.refundDate}
                                />
                              ) : null}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="d-flex mt-2">
                        <div className="col-3" style={{ marginRight: "1rem" }}>
                          <p className="mt-2 text-end">Comments</p>
                        </div>

                        <div className="col-8" style={{ marginRight: "1rem" }}>
                          <CKEditor
                            config={editorConfiguration}
                            id="comment"
                            name="comment"
                            initData={ckEditorData}
                            onChange={(event) => {
                              handleEditorChange(event);
                              setFieldValue("comment", event.editor.getData());
                            }}
                            readOnly={!isRefunds}
                          />
                        </div>
                      </div>

                      <div
                        class="d-flex flex-row bd-highlight mb-3 justify-content-center"
                        style={{ marginTop: "1rem" }}
                      >
                        <button
                          className="btn btn-primary "
                          style={{
                            backgroundColor: "#3c8dbc",
                            fontSize: "14px",
                          }}
                          type="submit"
                          onClick={() => {
                            setApiType("finalize");
                            saveRefundOnFinalize("finalize");
                            setIsValidating(true);
                          }}
                          disabled={!isRefunds}
                        >
                          <i
                            class="fa fa-lock"
                            aria-hidden="true"
                            style={{ fontSize: "14px", paddingRight: "10px" }}
                          ></i>
                          Finalise Refund
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{
                            marginLeft: "1rem",
                            borderColor: "lightgrey",
                            backgroundColor: "#8080801a",
                            fontSize: "14px",
                          }}
                          disabled={!isRefunds}
                        >
                          Print Statement
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Col>
              <Col sm={4}>
                <Col xs={12}>
                  <Card
                    className="col-12 mb-4"
                    style={{
                      marginLeft: "1.5rem",
                      height: "27rem",
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                      backgroundColor: refundComplete ? "#d3d3d378" : "",
                    }}
                  >
                    <div className="head mt-3">Forecast Details</div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">
                          Refund Date (Obliged)
                          <i
                            className="fa fa-info-circle fa-sm"
                            style={{
                              cursor: "pointer",
                              marginLeft: "6px",
                              fontSize: "15px",
                            }}
                            onClick={() =>
                              onHandleMessage(
                                INFO,
                                REFUNDDATEOBLIGATED,
                                REFUNDDATEOBLIGATEDCONTENT.TEXT
                              )
                            }
                          ></i>
                        </p>
                      </div>
                      <div className="col-7">
                        <MuiDatePicker
                          id="refundDate"
                          name="refundDate"
                          className="text form-control"
                          selectedDate={obligedDate}
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">
                          Interest Amount (At Obliged){" "}
                        </p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="price"
                          id="entryFeeTxtt"
                          // BIR FORMULA
                          // 1. RAD/RAC Payable X BIR (government issued) / 365 days X number of days from date of death to Refund date (obliged)
                          // 2. RAD/RAC Payable X MPIR (government issued) / 365 days X number of days from date of transfer to Refund date (obliged)
                          value={
                            refundDetails &&
                            ((refundDetails.radRacPayable * bir) / 36500) *
                              intrestAmtObligated
                          }
                          // value={
                          //   refundDetails &&
                          //   ((refundDetails.radRacPayable * 3.75) /
                          //     36500) *
                          //     intrestAmtObligated
                          // }
                          placeholder="$0.00"
                          className="text form-control"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">
                          Interest Amount (Current)
                        </p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="price"
                          id="entryFeeTxtt"
                          // BIR FORMULA
                          // 1. RAD/RAC Payable X BIR (government issued) / 365 days X number of days from date of death to Refund date (obliged)
                          // 2. RAD/RAC Payable X MPIR (government issued) / 365 days X number of days from date of transfer to Refund date (obliged)
                          value={
                            !isRefundsReason
                              ? penaltydifference < 0
                                ? refundDetails &&
                                  ((refundDetails.radRacPayable * bir) /
                                    36500) *
                                    currentintrestdiff
                                : refundDetails &&
                                  ((refundDetails.radRacPayable * bir) /
                                    36500) *
                                    intrestAmtObligated
                              : penaltydifference > 0
                              ? refundDetails &&
                                ((refundDetails.radRacPayable * bir) / 36500) *
                                  intrestAmtObligated
                              : refundDetails &&
                                ((refundDetails.radRacPayable * bir) / 36500) *
                                  moment(rDeath).diff(
                                    moment(transferDate),
                                    "days"
                                  )
                          }
                          // value={
                          //   refundDetails &&
                          //   ((refundDetails.radRacPayable * 3.75) /
                          //     36500) *
                          //     intrestAmtObligated
                          // }
                          placeholder="$0.00"
                          className="text form-control"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">
                          Interest Amount (Penalty)
                        </p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="price"
                          id="entryFeeTxtt"
                          // FORMULA radRacPayable * mpir / 365 days * number of days from Obliged Refund Date up to Actual Refund Date.
                          //  RAD/RAC Payable X MPIR (government issued) / 365 days X number of days from Refund date (obliged) until Actual Refund Date
                          value={
                            isRefundsReason
                              ? penaltydifference > 0
                                ? refundDetails &&
                                  ((refundDetails.radRacPayable * mpir) /
                                    36500) *
                                    finalDiff
                                : 0
                              : penaltydifference > 0
                              ? refundDetails &&
                                ((refundDetails.radRacPayable * mpir) / 36500) *
                                  penaltydifference
                              : 0
                          }
                          placeholder="$0.00"
                          className="text form-control"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">
                          {isBond ? "Bond Payable" : "RAD / RAC Payable"}{" "}
                        </p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="price"
                          id="entryFeeTxtt"
                          value={
                            refundDetails && refundDetails.radRacPayable
                              ? refundDetails.radRacPayable
                              : null
                          }
                          placeholder="$0.00"
                          className="text form-control"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">Total Refund Amount </p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="price"
                          id="entryFeeTxtt"
                          // value={
                          //   refundDetails && refundDetails.radRacPayable + bir + mpir
                          // }
                          value={totalRefundAmt}
                          placeholder="$0.00"
                          className="text form-control"
                          disabled
                        />
                      </div>
                    </div>
                  </Card>
                </Col>

                <div class="d-flex flex-row bd-highlight mb-3 justify-content-center">
                  <button
                    className="btn btn-outline"
                    style={{
                      marginLeft: "1rem",
                      borderColor: "lightgrey",
                      backgroundColor: "#8080801a",
                      marginBottom: "1rem",
                      fontSize: "14px",
                    }}
                    onClick={handleCopy}
                    disabled={!isRefunds}
                  >
                    Copy Forecast Values to Actual Values
                  </button>
                </div>
                <Col xs={12}>
                  <Card
                    className="col-12 mb-4"
                    style={{
                      marginLeft: "1.5rem",
                      height: "18rem",
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                      backgroundColor: refundComplete ? "#d3d3d378" : "",
                    }}
                  >
                    <div className="head mt-3">Actual Amount Due </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">
                          {isBond ? "Bond Payable" : "RAD / RAC Payable"}
                          <i
                            className="fa fa-info-circle fa-sm"
                            style={{
                              cursor: "pointer",
                              marginLeft: "6px",
                              fontSize: "15px",
                            }}
                            onClick={() =>
                              onHandleMessage(
                                INFO,
                                ACTUALAMOUNTDUE,
                                ACTUALAMOUNTDUECONTENT.TEXT
                              )
                            }
                          ></i>
                        </p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="price"
                          id="entryFeeTxtt"
                          value={radRacPayableAmtCpy}
                          placeholder="$0.00"
                          className="text form-control"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">Interest BIR </p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="price"
                          id="entryFeeTxtt"
                          value={intrestBIRCpy}
                          placeholder="$0.00"
                          className="text form-control"
                          disabled={true}
                          // onValueChange={(e) => {
                          //   if (intrestBIRCpy !== Number(e.value)) {
                          //     setIsUnsavedData(true);
                          //   } else {
                          //     setIsUnsavedData(false);
                          //     //callbackIsUnsavedData(false);
                          //   }
                          // }}
                        />
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2 text-end">Interest MPIR</p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="price"
                          id="entryFeeTxtt"
                          value={intrestMPIRCpy}
                          placeholder="$0.00"
                          className="text form-control"
                          disabled={true}
                          // onValueChange={(e) => {
                          //   if (intrestMPIRCpy !== Number(e.value)) {
                          //     setIsUnsavedData(true);
                          //   } else {
                          //     setIsUnsavedData(false);
                          //   }
                          // }}
                        />
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <div className="col-4" style={{ marginRight: "1rem" }}>
                        <p className="mt-2  text-end">Total Refund Amount</p>
                      </div>
                      <div className="col-7">
                        <NumberFormat
                          thousandSeparator={true}
                          className="text form-control"
                          prefix={"$"}
                          // maxLength={17}
                          fixedDecimalScale={2}
                          allowNegative={true}
                          decimalScale={2}
                          name="totalRefunAmount"
                          id="entryFeeTxtt"
                          value={totalRefundAmtCpy}
                          placeholder="$0.00"
                          disabled
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              </Col>
            </Row>

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

            <AddTransferTo
              type={actionType}
              Data={data}
              ShowModel={showAddEditForm}
              callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            />

            {showSuccessAlert && (
              <SuccessAlert
                type={successAlertOptions.actionType}
                msg={successAlertOptions.msg}
                title={successAlertOptions.title}
                callback={successAlertOptions.callback}
              ></SuccessAlert>
            )}

            {showFinallzeAlert && (
              <BondRefundsWarning
                ShowDeleteModal={showFinallzeAlert}
                archiveConfirmationCallBack={finalizeRefundCallBack}
                Data=""
                title="title"
                handleCloseModal={handleCloseModal}
              ></BondRefundsWarning>
            )}

            <WarningAlert
              header={warningAlertOptions.header}
              messageBody={warningAlertOptions.messageBody}
              isOpen={showFinalizeErrorPopup}
              continueClicked={onContinueEop}
              cancelClicked={onEopCancelClick}
            ></WarningAlert>
          </Page>
        </>
      )}
    </>
  );
};

export default NonBondRefunds;
