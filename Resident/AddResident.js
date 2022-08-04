import React, { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import Icon from "../../../src/assets/Images/icon.png";
import Page from "../../components/Page";
import * as Yup from "yup";
import * as moment from "moment";
import {
  Button,
  Col,
  Form,
  FormGroup,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import residentService from "../../services/Resident/resident.service";
import { ErrorMessage, Field, Formik } from "formik";
import {
  ADD,
  FIRSTNAME,
  LASTNAME,
  TELEPHONE,
  MOBILE,
  ADDRESS1,
  ADDRESS2,
  POSTCODE,
  ISPREJULY201,
  INITIALENTRYDATE,
  ISTRANSFER,
  ADMISSIONDATE,
  CARECATEGORY,
  FACILITY,
  RECORDID,
  BONDAMOUNT,
  BONDPAYMENTTYPE,
  MPIR,
  FIRSTINSTALLMENT,
  SECONDINSTALLMENT,
  RETENTIONMONTHSTAKEN,
  INTERESTTYPE,
  RETENTIONTYPE,
  ISEXTRASERVICE,
  AUTHORIZEEMAIL,
  NOTE,
  INFO,
  DATEOFBIRTH,
  EDIT,
} from "../../constant/FieldConstant";
import SuccessAlert from "../../components/SuccessAlert";
import commonServices from "../../services/Common/common.services";
import ViewResidentRepresentative from "../Master/residentRepresentative/ViewResidentRepresentative";
import radRacRecieptsservice from "../../services/Resident/radRacReciepts.service";
import ViewResidentFees from "../Master/residentFees/viewResidentFees";
import WarningAlert from "../../components/ModalWarning";
import {
  RESIDENTBODY,
  RESIDENTHEAD,
  RESIDENTNOTE,
  VALIDEMAIL,
  VALIDNUMBER,
  BONDAMOUNTHEAD,
  BONDAMOUNTBODY,
} from "../../constant/MessageConstant";
import InlineBottomErrorMessage from "../../components/InlineBottomErrorMessage";
import DirtyWarningAlert from "../../components/DirtyWarningAlert";
import WarningMessageModelAlert from "../../components/WarningMessageModelAlert";
import { useNavigate } from "react-router-dom";
import ResidentNavigationBar from "../Master/ResidentNavigationStepbar";
import ViewPaymentDetails from "../Register/ViewPaymentDetails";
import RemoveImage from "../../components/RemoveImagePopup";
import ReceiptsDeduction from "../Register/ReceiptsDeduction/ReceiptsDeduction";
// import NumberFormat from "react-number-format";
import NumberFormat from "./../../components/NumberFormat";
import "../../css/AddResident.css";
import MuiDatePicker from "./../../components/DatePicker/MaterialUi";
import { removeEmptySpaces } from "../../utils/Strings";
import BondTabs from "./Bond/BondTabs";
// import BondRefunds from "../Register/Refunds/BondRefunds";
import NonBondsRefunds from "../Register/Refunds/NonBondsRefunds";
import RefundsWarningModal from "../../components/RefundsWarningModal";
import DirtyWarningAlertWithoutFormik from "../../components/DirtyWarningAlertWithoutFormik";

// import EopServices from "../../services/EndOfPeriod/EndOfPeriod.services";
import SingleSelect from "../../components/MySelect/MySelect";
const AddResident = () => {
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const ResidentFormRef = useRef();
  const profileRef = useRef();
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [stateList, setStateList] = useState(false);
  const [facilityList, setFacilityList] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [selectedPaymentTypeList, setSelectedPaymentTypeList] = useState(null);
  const [eopRetentionMethod, setEopRetentionMethod] = useState([]);
  const [selectedEopRetentionMethod, setSelectedEopRetentionMethod] = useState(
    null
  );
  const [eopInterestMethod, setEopInterestMethod] = useState([]);
  const [selectedEopInterestMethod, setSelectedEopInterestMethod] = useState(
    null
  );
  const [careTypeList, setCareTypeList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [suburbList, setsuburbList] = useState([]);
  const [CpysuburbList, setCpysuburbList] = useState([]);
  const [selectedStreetCountry, setSelectedStreetCountry] = useState(null);
  const [selectedStreetState, setSelectedStreetState] = useState(null);
  const [selectedStreetSuburb, setSelectedStreetSuburb] = useState(null);
  const [PartLumsumAmount, setPartLumsumAmount] = useState("");

  const [representativeArray, setRepresentativeArray] = useState([]);
  const [CPYRepresentativeArray, setCPYRepresentativeArray] = useState([]);
  const [residentId, setResidentId] = useState(-1);
  const [newAmount, setNewAmount] = useState(0);
  const [firstInstallmentAmount, setFirstInstallmentAmount] = useState(0);
  const [secondInstallmentAmount, setSecondInstallmentAmount] = useState(0);
  const [mpirField, setMPIR] = useState({ DbMPIR: 0, newMPIR: 0 });
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [heldByGovernmentSaved, setheldByGovernmentSaved] = useState(false);

  const [showUnSaveChangesAlert, setShowUnSaveChangesAlert] = useState(false);
  const [isUnsavedData, setIsUnsavedData] = useState(false);
  const [isBubbleClicked, setIsBubbleClicked] = useState(false);
  const [navigationToView, setNavigationToView] = useState(false);

  const [stepArray, setStepArray] = useState([
    {
      id: 1,
      status: "Resident Details",
    },
    {
      id: 2,
      status: "Payment Details",
    },
    {
      id: 3,
      status: "Resident Fees",
    },
    {
      id: 4,
      status: "Receipt and Deductions",
    },
    {
      id: 5,
      status: "RAD / RAC Refund",
    },
  ]);

  const [stepArray1, setStepArray1] = useState([
    {
      id: 1,
      status: "Resident Details",
    },
    {
      id: 2,
      status: "Resident Fees",
    },
    {
      id: 3,
      status: "Receipt & Deductions",
    },
    {
      id: 5,
      status: "Bond Refund",
    },
  ]);
  const [activeStep, setActiveStep] = useState(0);
  const [ResidentSaved, setResidentSaved] = useState(false);
  const [clickedStep, setClickedStep] = useState(0);
  const [bond, setBond] = useState(false);

  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [title, setTitle] = useState([]);
  const [feesFormSubmitting, setFeesFormSubmitting] = useState(false);
  const [AddResidentClickedScreen, setAddResidentClickedScreen] = useState("");

  const [initialValues, setInitialValues] = useState({
    TitleTypeId: 0,
    FirstName: "",
    LastName: "",
    DOBDate: "",
    Phone: "",
    Mobile: "",
    Email: "",
    Address1: "",
    Address2: "",
    SubUrb: "",
    StatedId: 0,
    postcode: "",
    Fax: "",
    IsPre1July2014: false,
    IsTransfer: false,
    InitialEntryDate: new Date().toJSON(),
    AdmissionDate: new Date().toJSON(),
    CareCategory: "Permanent",
    IsExtraService: false,
    facility_id: 0,
    Record_id: "",
    BondAmount: 0,
    BondPaymentTypeId: 0,
    MPIR: 0,
    partLumsumAmount: "",
    BondSettled: true,
    InstOneDate: new Date().toJSON(),
    InstOneAmount: 0,
    InstTwoDate: new Date().toJSON(),
    InstTwoAmount: 0,
    MonthlyRetention: 0,
    RetentionMonths: 60,
    RetentionMonthsTaken: 0,
    RefundDate: new Date().toJSON(),
    TransferDate: new Date().toJSON(),
    InterestType: 0,
    LumpSumPart: 0,
    RetentionType: 0,
    IsMale: true,
    countryId: 0,
    clientbillingid: "",
    episodeId: 0,
    streetState: "",
    streetsuburb: "",
    file: "",
  });

  const [templateData, setTemplateData] = useState({
    TitleTypeId: 0,
    FirstName: "",
    LastName: "",
    DOBDate: "",
    Phone: "",
    Mobile: "",
    Email: "",
    Address1: "",
    Address2: "",
    SubUrb: "",
    StatedId: 0,
    postcode: "",
    Fax: "",
    IsPre1July2014: false,
    IsTransfer: false,
    InitialEntryDate: new Date().toJSON(),
    AdmissionDate: new Date().toJSON(),
    CareCategory: "Permanent",
    IsExtraService: false,
    facility_id: 0,
    Record_id: "",
    BondAmount: 0,
    BondPaymentTypeId: 0,
    MPIR: 0,
    partLumsumAmount: "",
    BondSettled: true,
    InstOneDate: new Date().toJSON(),
    InstOneAmount: 0,
    InstTwoDate: new Date().toJSON(),
    InstTwoAmount: 0,
    MonthlyRetention: 0,
    RetentionMonths: 60,
    RetentionMonthsTaken: 0,
    RefundDate: new Date().toJSON(),
    TransferDate: new Date().toJSON(),
    InterestType: 0,
    LumpSumPart: 0,
    RetentionType: 0,
    IsMale: true,
    countryId: 0,
    clientbillingid: "",
    episodeId: 0,
    streetState: "",
    streetsuburb: "",
    file: "",
  });

  const [image, setImage] = useState({ preview: "", raw: "" });
  const [CpyImage, setCpyImage] = useState({ preview: "", raw: "" });
  const [imageData, setImageData] = useState({ preview: "", raw: "" });
  const [showImageConfirm, setShowImageConfirm] = useState(false);
  const [admissionDate, setAdmissionDate] = useState(new Date());
  const [heldByGovernmentValue, setheldByGovernmentValue] = useState(undefined);
  const [isContinue, setIsContinue] = useState(false);
  const [editData, setEditData] = useState(undefined);
  const [selectedCareTypeCategory, setSelectedCareTypeCategory] = useState(
    null
  );
  const [permenetCare, setPermenetCare] = useState({});
  const [
    residentRepresentativeModel,
    setResidentRepresentativeRModel,
  ] = useState(undefined);
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const blockInvalidCharMobile = (e) =>
    ["e", "E", "-"].includes(e.key) && e.preventDefault();
  const [isRefundTab, setIsRefundTab] = useState(false);
  const [isRefundTabContinue, setIsRefundTabContinue] = useState(false);
  const [showWarningAlert2, setShowWarningAlert2] = useState(false);
  const [refundComplete, setRefundComplete] = useState(false);
  const [isExtra, setIsExtra] = useState(false);

  const [maxActiveStep, setMaxActiveStep] = useState(0);
  const type = localStorage.getItem("residentActionType");

  const [editLoading, setEditLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSaveAndExit, setIsSaveAndExit] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [BeFoforeCheckData, setBeFoforeCheckData] = useState({});
  const [commingFacilities, setCommingFacilities] = useState([]);

  // useEffect(() => {
  //   setTitle(title);
  //   const currentResidentId = Number(localStorage.getItem("residentId"));
  //   if (currentResidentId && activeStep === 0) {
  //     getAllResidentEdit(currentResidentId);
  //   }
  // }, []);

  function Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    setTemplateData(initialValues);
  }, [
    selectedStreetCountry,
    selectedEopInterestMethod,
    mpirField,
    selectedEopRetentionMethod,
    bond,
  ]);

  useEffect(() => {
    handleContinueApiCall();
  }, [activeStep]);

  useEffect(() => {
    const currentResidentId = Number(localStorage.getItem("residentId"));
    // console.log("activeStep at useEffect", activeStep);
    if (activeStep === 0) {
      getEopInterestMethods();
      getSuburbList();
      getCountries();
      getStates();
      getTitles();
      getFacilities();
      getPaymentTypes();
      getEopRetentionMethods();

      getCareTypes();
      if (currentResidentId) {
        setTitle(title);
        setMonthlyAmount(0);
        getAllResidentEdit(currentResidentId);
      }
    }
    if (activeStep !== 4) {
      localStorage.setItem("FundHeldByGovCpy", "");
    }
  }, [activeStep]);

  // useEffect(() => {
  //   getTitles();
  //   getStates();
  //   getFacilities();
  //   getPaymentTypes();
  //   getEopRetentionMethods();
  //   getEopInterestMethods();
  //   getCountries();
  //   getCareTypes();
  //   getSuburbList();
  // }, []);

  useEffect(() => {
    if (editData !== undefined && editData.id) {
      // console.log("suburbList", suburbList);
      // console.log("editData", editData);
      const selectedSub = suburbList.find((val) => val.id == editData.subUrb);
      if (editData.statedId) {
        setsuburbList(
          CpysuburbList.filter((val) => val.stateId === editData.statedId)
        );
      }
      if (selectedSub) {
        // console.log("selectedSubt in subrb usseffect data", selectedSub);

        setSelectedStreetSuburb({ ...selectedSub, label: selectedSub.value });
      }
    }
  }, [CpysuburbList]);

  useEffect(() => {
    async function getData() {
      // setEditLoading(true);
      if (editData !== undefined && editData.id) {
        // setEditLoading(false);
        setResidentId(editData.id);
        setBond(editData.isPre1July2014);
        const tmpTitle = titles.find(
          (val) => val.title_type_id === editData.titleTypeId
        );
        setSelectedTitle(tmpTitle ? tmpTitle : null);

        const tmpFacility =
          facilityList &&
          facilityList.find((val) => val.facility_id === editData.facility_id);
        setSelectedFacility(tmpFacility ? tmpFacility : {});

        //   setStateList(arr);
        const selectedSubt = suburbList.find(
          (val) => val.id == editData.subUrb
        );
        if (selectedSubt) {
          // console.log("selectedSubt in edit data", selectedSubt);
          setSelectedStreetSuburb({
            ...selectedSubt,
            label: selectedSubt.value,
          });
        }

        if (stateList && stateList.length > 0) {
          const tmpStatet = stateList.find(
            (val) => val.state_id == editData.statedId
          );
          if (tmpStatet && CpysuburbList && CpysuburbList.length > 0) {
            setsuburbList(
              CpysuburbList.filter((val) => val.stateId === tmpStatet.state_id)
            );
          }
          setSelectedStreetState(tmpStatet ? tmpStatet : null);
        } else {
          getStates();
        }

        const filterBondPaymentType = paymentTypeList.filter(
          (val) => val.id === editData.bondPaymentTypeId
        );
        setSelectedPaymentTypeList(
          filterBondPaymentType.length > 0 ? filterBondPaymentType[0] : {}
        );

        const tmpRetentionMethod = eopRetentionMethod.find(
          (val) => val.id === editData.retentionType
        );
        setSelectedEopRetentionMethod(
          tmpRetentionMethod ? tmpRetentionMethod : {}
        );

        const tmpEopInterestMethod = eopInterestMethod.find(
          (val) => val.id === editData.interestType
        );
        setSelectedEopInterestMethod(
          tmpEopInterestMethod ? tmpEopInterestMethod : {}
        );

        const slctdCountry = countryList.find(
          (val) => val.id === editData.countryId
        );
        if (slctdCountry) {
          setSelectedStreetCountry(slctdCountry);

          ResidentFormRef.current.setFieldValue("countryId", slctdCountry.id);
        }
        if (editData.careCategory === 0) setSelectedCareTypeCategory(null);
        else {
          if (careTypeList.length > 0) {
            const careType = careTypeList.filter(
              (val) => val.care_type_id === editData.careCategory
            );
            if (careType && careType.length > 0) {
              setSelectedCareTypeCategory({
                id: careType[0].care_type_id,
                label: careType[0].care_type_desc,
              });
            }
          }
        }
        setImage({
          preview:
            editData.file &&
            editData.file !==
              "data:image;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
              ? editData.file
              : "",
        });
        setCpyImage({
          preview:
            editData.file &&
            editData.file !==
              "data:image;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
              ? editData.file
              : "",
        });
        setResidentRepresentativeRModel(
          editData.residentRepresentativeResponseModel
        );

        setRepresentativeArray(
          JSON.parse(
            JSON.stringify(editData.residentRepresentativeResponseModel)
          )
        );
        setCPYRepresentativeArray(
          JSON.parse(
            JSON.stringify(editData.residentRepresentativeResponseModel)
          )
        );

        setNewAmount(editData.bondAmount);
        setFirstInstallmentAmount(editData.instOneAmount);
        setSecondInstallmentAmount(editData.instTwoAmount);
        setMPIR({ ...mpirField, newMPIR: editData.mpir });
        setPartLumsumAmount(editData.lumpSumPart);
        // setMonthOfRetension(editData.retentionMonths);
        localStorage.setItem("FacilityId", editData.facility_id);
        setMonthlyAmount(editData.monthlyRetention);
        setInitialValues({
          TitleTypeId: editData.titleTypeId,
          FirstName: editData.firstName,
          LastName: editData.lastName,
          DOBDate: editData.dobDate,
          Phone: editData.phone,
          Mobile: editData.mobile,
          Email: editData.email ? editData.email : "",
          Address1: editData.address1 ? editData.address1 : "",
          Address2: editData.address2 ? editData.address2 : "",
          postcode: editData.postcode ? editData.postcode : "",
          Fax: editData.fax ? editData.fax : "",
          IsPre1July2014: editData.isPre1July2014,
          IsTransfer: editData.isTransfer,
          InitialEntryDate: editData.isTransfer
            ? editData.initialEntryDate
            : undefined,
          AdmissionDate: editData.admissionDate,
          CareCategory: editData.careCategory,
          IsExtraService: editData.isExtraService,
          facility_id: editData.facility_id,
          Record_id: editData.record_id,
          BondAmount: editData.bondAmount,
          BondPaymentTypeId: editData.bondPaymentTypeId,
          MPIR: editData.mpir,
          BondSettled: editData.bondSettled,
          InstOneDate: editData.instOneDate,
          InstOneAmount: editData.instOneAmount,
          InstTwoDate: editData.instTwoDate,
          InstTwoAmount: editData.instTwoAmount,
          MonthlyRetention: editData.monthlyRetention,
          RetentionMonths: editData.retentionMonths,
          RetentionMonthsTaken: editData.retentionMonthsTaken,
          RefundDate: editData.refundDate
            ? editData.refundDate
            : new Date().toJSON(),
          TransferDate: editData.transferDate
            ? editData.transferDate
            : new Date().toJSON(),
          InterestType: editData.interestType,
          LumpSumPart: editData.lumpSumPart,
          RetentionType: editData.retentionType,
          IsMale: editData.isMale,
          countryId: editData.countryId,
          clientbillingid: editData.client_billing_id,
          episodeId: editData.episodeId,
          streetState: editData.stateName
            ? editData.stateName
            : editData.statedId && editData.statedId > 0
            ? editData.statedId
            : "",
          statedId: editData.statedId ? editData.statedId : 0,
          streetsuburb:
            editData.subUrb && editData.subUrb !== "0" ? editData.subUrb : "",
          file: editData.file ? editData.file : "",
        });
        setTemplateData({
          TitleTypeId: editData.titleTypeId,
          FirstName: editData.firstName,
          LastName: editData.lastName,
          DOBDate: editData.dobDate,
          Phone: editData.phone,
          Mobile: editData.mobile,
          Email: editData.email ? editData.email : "",
          Address1: editData.address1 ? editData.address1 : "",
          Address2: editData.address2 ? editData.address2 : "",
          postcode: editData.postcode ? editData.postcode : "",
          Fax: editData.fax ? editData.fax : "",
          IsPre1July2014: editData.isPre1July2014,
          IsTransfer: editData.isTransfer,
          InitialEntryDate: editData.isTransfer
            ? moment(editData.initialEntryDate).format("YYYY-MM-DD")
            : "",
          AdmissionDate: editData.admissionDate,
          CareCategory: editData.careCategory,
          IsExtraService: editData.isExtraService,
          facility_id: editData.facility_id,
          Record_id: editData.record_id,
          BondAmount: editData.bondAmount,
          BondPaymentTypeId: editData.bondPaymentTypeId,
          MPIR: editData.mpir,
          BondSettled: editData.bondSettled,
          InstOneDate: editData.instOneDate ? editData.instOneDate : "",
          InstOneAmount: editData.instOneAmount,
          InstTwoDate: editData.instTwoDate ? editData.instTwoDate : "",
          InstTwoAmount: editData.instTwoAmount,
          MonthlyRetention: editData.monthlyRetention,
          RetentionMonths: editData.retentionMonths,
          RetentionMonthsTaken: editData.retentionMonthsTaken,
          RefundDate: editData.refundDate
            ? editData.refundDate
            : new Date().toJSON(),
          TransferDate: editData.transferDate
            ? editData.transferDate
            : new Date().toJSON(),
          InterestType: editData.interestType,
          LumpSumPart: editData.lumpSumPart,
          RetentionType: editData.retentionType,
          IsMale: editData.isMale,
          countryId: editData.countryId,
          clientbillingid: editData.client_billing_id,
          episodeId: editData.episodeId,
          streetState: editData.stateName
            ? editData.stateName
            : editData.statedId,
          statedId: editData.statedId ? editData.statedId : 0,
          streetsuburb: editData.subUrb,
          file: editData.file ? editData.file : "",
        });
        setAdmissionDate(editData.admissionDate);
      } else {
        setNewAmount(0);
        setMPIR({
          ...mpirField,
          newMPIR: 0,
        });
        getMPIR(
          moment(new Date())
            .format()
            .split("T")[0]
        );
        // setMonthOfRetension(0);
        let DeFaultCountry = {};
        if (countryList && countryList.length > 0) {
          DeFaultCountry = countryList.find(
            (val) => val.description.trim().toLowerCase() === "australia"
          );
          // console.log("DeFaultCountry", DeFaultCountry);
          setSelectedStreetCountry(DeFaultCountry);
          // ResidentFormRef.current.setFieldValue("countryId", deFaultCountry.id);
        }
        setSelectedCareTypeCategory(null);
        setMonthlyAmount(0);
        setFirstInstallmentAmount(0);
        setSecondInstallmentAmount(0);
        setInitialValues({
          TitleTypeId: 0,
          FirstName: "",
          LastName: "",
          DOBDate: "",
          Phone: "",
          Mobile: "",
          Email: "",
          Address1: "",
          Address2: "",
          SubUrb: "",
          StatedId: 0,
          postcode: "",
          Fax: "",
          IsPre1July2014: false,
          IsTransfer: false,
          InitialEntryDate: "",
          AdmissionDate: new Date().toJSON(),
          CareCategory: "Permanent",
          IsExtraService: false,
          facility_id: 0,
          Record_id: "",
          BondAmount: 0,
          BondPaymentTypeId: 0,
          MPIR: 0,
          partLumsumAmount: "",
          BondSettled: true,
          InstOneDate: new Date().toJSON(),
          InstOneAmount: 0,
          InstTwoDate: new Date().toJSON(),
          InstTwoAmount: 0,
          MonthlyRetention: 0,
          RetentionMonths: 60,
          RetentionMonthsTaken: 0,
          RefundDate: new Date().toJSON(),
          TransferDate: new Date().toJSON(),
          InterestType: 0,
          LumpSumPart: 0,
          RetentionType: 0,
          IsMale: true,
          countryId:
            DeFaultCountry && DeFaultCountry.id ? DeFaultCountry.id : 0,
          clientbillingid: "",
          episodeId: 0,
          streetState: "",
          streetsuburb: "",
          file: "",
        });
        setTemplateData({
          TitleTypeId: 0,
          FirstName: "",
          LastName: "",
          DOBDate: "",
          Phone: "",
          Mobile: "",
          Email: "",
          Address1: "",
          Address2: "",
          SubUrb: "",
          StatedId: 0,
          postcode: "",
          Fax: "",
          IsPre1July2014: false,
          IsTransfer: false,
          InitialEntryDate: "",
          AdmissionDate: new Date().toJSON(),
          CareCategory: "Permanent",
          IsExtraService: false,
          facility_id: 0,
          Record_id: "",
          BondAmount: 0,
          BondPaymentTypeId: 0,
          MPIR: 0,
          partLumsumAmount: "",
          BondSettled: true,
          InstOneDate: new Date().toJSON(),
          InstOneAmount: 0,
          InstTwoDate: new Date().toJSON(),
          InstTwoAmount: 0,
          MonthlyRetention: 0,
          RetentionMonths: 60,
          RetentionMonthsTaken: 0,
          RefundDate: new Date().toJSON(),
          TransferDate: new Date().toJSON(),
          InterestType: 0,
          LumpSumPart: 0,
          RetentionType: 0,
          IsMale: true,
          countryId:
            DeFaultCountry && DeFaultCountry.id ? DeFaultCountry.id : 0,
          clientbillingid: "",
          episodeId: 0,
          streetState: "",
          streetsuburb: "",
          file: "",
        });
      }
    }
    if (activeStep === 0) {
      getData();
    }
  }, [editData, activeStep]);

  const continueApiCall = (data, callComesFrom) => {
    // console.log("continueApiCall", data);
    const updatedObj = {
      screenName: data.screenName,
      isBond: data.isBond,
      isPermanent: true,
      id: data.id,
    };

    // console.log("updatedObj", updatedObj);
    residentService
      .continueApi(updatedObj)
      .then((response) => {
        // console.log("continueApiCall response", response);
        if (callComesFrom === "addResidentClick") {
          setSuccessAlertOptions({
            title: "",
            actionType: ADD,
            msg: response.message
              ? response.message
              : "Your data has been saved successfully",
            callback: () => {
              setShowSuccessAlert(false);
            },
          });
          setShowSuccessAlert(true);
        }
      })
      .catch((response) => {
        // console.log("continueApiCall response", response);
      });
    setIsUnsavedData(false);
  };

  const handleContinueApiCall = () => {
    // console.log("handleContinueApiCall", activeStep);
    if (!bond && activeStep == 4) {
      // NON BOND API CALL (RECEIPTS)
      const id = parseInt(localStorage.getItem("PaymentRadId"));
      continueApiCall({ isBond: false, screenName: "RAD/RACReceipts", id: id });
    }
    if (bond && activeStep == 4) {
      const id = parseInt(localStorage.getItem("bondId"));
      continueApiCall({ isBond: true, screenName: "reciepts", id: id });
    }

    if (!bond && activeStep === 2) {
      const id = parseInt(localStorage.getItem("PaymentRadId"));
      continueApiCall({ isBond: false, screenName: "PaymentDetails", id: id });
    }
  };
  const handleAddResidentClick = () => {
    // console.log("add resident button clicked", activeStep);
    if (!bond && activeStep === 1) {
      const id = parseInt(localStorage.getItem("PaymentRadId"));
      continueApiCall(
        { isBond: false, screenName: "PaymentDetails", id: id },
        "addResidentClick"
      );
    } else if ((!bond && activeStep === 2) || (bond && activeStep === 1)) {
      setAddResidentClickedScreen("ResidentFees");
      setFeesFormSubmitting(true);
    } else if (!bond && activeStep === 3) {
      handleHeldByGovernment("addResidentClick");
      const id = parseInt(localStorage.getItem("PaymentRadId"));
      continueApiCall(
        { isBond: false, screenName: "RAD/RACReceipts", id: id },
        "addResidentClick"
      );
    } else if (bond && activeStep === 2) {
      const id = parseInt(localStorage.getItem("bondId"));
      continueApiCall(
        { isBond: true, screenName: "reciepts", id: id },
        "addResidentClick"
      );
    } else if (activeStep === 4) {
      setAddResidentClickedScreen("RADRACRefund");
      setIsRefundTab(true);
      setIsRefundTabContinue(!isRefundTabContinue);
      setIsCancelling(true);
      setIsSaveAndExit(true);
    }
  };

  const handlIsUnSavedData = (data) => {
    if (data && Object.keys(data).length > 0) {
      setIsUnsavedData(true);
    }
    if (data === true) {
      setIsUnsavedData(true);
    }
  };

  const getAllResidentEdit = (currentResidentId) => {
    setLoading(true);
    residentService
      .getResidentById(currentResidentId)
      .then((response) => {
        setLoading(false);
        setEditData(response.result);
        setRefundComplete(response.result.refundComplete);
        if (type === "Edit")
          localStorage.setItem("PaymentRadId", Number(response.result.radId));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // const getHeldByGovernmentChange = (value) => {
  //   setheldByGovernmentValue(value);
  // };

  const checkIsFinalized = (value) => {
    setRefundComplete(value);
  };

  const handleHeldByGovernment = (callComesFrom) => {
    const copy = Number(localStorage.getItem("FundHeldByGovCpy"))
      ? Number(localStorage.getItem("FundHeldByGovCpy"))
      : Number(localStorage.getItem("FundHeldByGov"));
    const radId = Number(localStorage.getItem("PaymentRadId"));

    // console.log("API CALLING", copy);
    if (activeStep === 3 && copy !== undefined) {
      radRacRecieptsservice
        .addHeldByGovernment(radId, copy)
        .then((response) => {
          setSuccessAlertOptions({
            title: "",
            actionType: ADD,
            msg: response.message,
            callback: () => {
              setShowSuccessAlert(false);
            },
          });
          // setShowSuccessAlert(true);
          if (callComesFrom !== "addResidentClick") {
            setActiveStep(activeStep + 1);
          }
          localStorage.setItem("isSaved", true);
          setheldByGovernmentSaved(true);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const extFile = `${file.type}`.split("/")[0];
      if (extFile === "image") {
        setImageData(e.target.files[0]);

        setImage({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0],
        });
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    document.getElementById("upload-button").click();
    setIsUnsavedData(true);
  };

  const onRemoveImageConfirm = (flag) => {
    if (flag) {
      setIsUnsavedData(true);
      onRemoveImage();
    }
    setShowImageConfirm(false);
  };
  const onRemoveImage = () => {
    profileRef.current.value = null;
    setImage("");
    setImageData("");
  };

  const representativeDetailsCallback = (data) => {
    setRepresentativeArray(JSON.parse(JSON.stringify(data)));
  };

  let navigate = useNavigate();

  const submitForm = () => {
    if (activeStep === 1 && !bond) {
      setActiveStep(activeStep + 1);
    } else {
      setFeesFormSubmitting(true);
    }
  };

  const residentFeesCallaback = (data) => {
    setFeesFormSubmitting(data.submitFlag);
    if (data.submitFlag === false && data.successFlag === false) {
      setActiveStep(activeStep);
    } else {
      // console.log("AddResidentClickedScreen", AddResidentClickedScreen);
      if (AddResidentClickedScreen === "ResidentFees") {
        setAddResidentClickedScreen("");
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const getValueOfFacility = (val) => {
    if (val.length > 0) {
      setCommingFacilities(val);
    }
  };

  const getTitles = () => {
    setLoading(true);
    commonServices.getAllTitleList().then((response) => {
      setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.title_type_desc;
        x.value = x.title_type_id;
        return x;
      });
      setTitles(arr);
    });
  };
  const getStates = () => {
    setLoading(true);
    commonServices.getAllStateList().then((response) => {
      setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.state_code;
        x.value = x.state_id;
        return x;
      });
      setStateList(arr);
    });
  };
  const getMPIR = (addmissionDate) => {
    commonServices.getMpirFromEffectiveDate(addmissionDate).then((response) => {
      setMPIR({
        newMPIR: response && response.feePost ? response.feePost : 0,
        DbMPIR: response && response.feePost ? response.feePost : 0,
      });
      ResidentFormRef.current.setFieldValue(
        "MPIR",
        response && response.feePost ? response.feePost : 0
      );
      setInitialValues({
        ...initialValues,
        MPIR: response && response.feePost ? response.feePost : 0,
      });
      setTemplateData({
        ...templateData,
        MPIR: response && response.feePost ? response.feePost : 0,
      });
    });
  };

  const getFacilities = () => {
    commonServices.getAllFacilities().then((response) => {
      // console.log("********getAllFacilities response", response);
      setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.facility_name;
        x.value = x.facility_id;
        return x;
      });
      setFacilityList(arr);
    });
  };
  const getPaymentTypes = () => {
    commonServices.getAllPaymentTypes().then((response) => {
      setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.description;
        x.value = x.id;
        return x;
      });
      setPaymentTypeList(arr);
    });
  };
  const getEopRetentionMethods = () => {
    commonServices.getAllEopRetentionMethod().then((response) => {
      setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.name;
        x.value = x.id;
        return x;
      });
      setEopRetentionMethod(arr);
      if (arr && arr.length > 0) {
        const defaultEopRetentionM = arr.find(
          (ob) => ob.name === "Retention Deduct"
        );
        ResidentFormRef.current.setFieldValue(
          "RetentionType",
          defaultEopRetentionM.value
        );

        setInitialValues({
          ...initialValues,
          RetentionType: defaultEopRetentionM.value,
        });
        setTemplateData({
          ...templateData,
          RetentionType: defaultEopRetentionM.value,
        });
        setSelectedEopRetentionMethod(defaultEopRetentionM);
      }
    });
  };
  const getEopInterestMethods = () => {
    commonServices.getAllEopInterestMethod().then((response) => {
      setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.name;
        x.value = x.id;
        return x;
      });
      setEopInterestMethod(arr);
      if (arr && arr.length > 0) {
        const defaultEopInterestM = arr.find(
          (ob) => ob.name === "Interest Charge"
        );
        setInitialValues({
          ...initialValues,
          InterestType: defaultEopInterestM.value,
        });
        setTemplateData({
          ...templateData,
          InterestType: defaultEopInterestM.value,
        });

        ResidentFormRef.current.setFieldValue(
          "InterestType",
          defaultEopInterestM.value
        );

        setSelectedEopInterestMethod(defaultEopInterestM);
      }
    });
  };
  const navigateToView = () => {
    navigate("/eRADWeb/viewResident", { replace: true });
  };
  const getCountries = () => {
    commonServices.getAllCountryList().then((response) => {
      setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.description;
        x.value = x.id;
        return x;
      });
      setCountryList(arr);
      let deFaultCountry;
      if (arr && arr.length > 0) {
        deFaultCountry = arr.find(
          (val) => val.description.trim().toLowerCase() === "australia"
        );
        setSelectedStreetCountry(deFaultCountry);
        ResidentFormRef.current.setFieldValue("countryId", deFaultCountry.id);
      }
      setInitialValues({
        ...initialValues,
        countryId: deFaultCountry.id,
      });
      setTemplateData({
        ...templateData,
        countryId: deFaultCountry.id,
      });
    });
  };
  const getCareTypes = () => {
    commonServices.getAllCareTypeList().then((response) => {
      setLoading(false);
      let arr = [];
      response.result.forEach((x) => {
        if (x.care_type_name?.toLowerCase() === "permanent") {
          setPermenetCare(x);
        } else {
          x.label = x.care_type_desc;
          x.value = x.care_type_id;
          arr.push(x);
        }
      });

      setCareTypeList(arr);
    });
  };

  const getSuburbList = () => {
    setLoading(true);
    commonServices.getSuburbList().then((response) => {
      setLoading(false);
      const tmpsubrb = response.result.map((val, i) => {
        if (i === 0) {
        }
        return {
          ...val,
          id: val.id,
          value: val.value,
          label: val.label,
        };
      });
      setsuburbList(tmpsubrb);
      setCpysuburbList([...tmpsubrb]);
    });
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

  const handleSaveExit = (val) => {
    setAddResidentClickedScreen("");
    setIsRefundTab(true);
    setIsRefundTabContinue(!isRefundTabContinue);
    setIsCancelling(true);
    setIsSaveAndExit(true);
  };

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);
    //console.log("values.DOBDate.........", values.DOBDate);
    if (
      values.DOBDate === "" ||
      values.DOBDate === "Invalid date" ||
      values.DOBDate === null
    ) {
      if (values.DOBDate === null) {
        errorObj.DOBDate = "Invalid date";
      } else {
        errorObj.DOBDate = "Required Field";
      }
      errorArr.push({ name: "DOBDate" });
    }
    if (values.IsTransfer) {
      if (
        values.InitialEntryDate === null ||
        values.InitialEntryDate === "Invalid date"
      ) {
        errorObj.InitialEntryDate = "Invalid date";
      } else if (!values.InitialEntryDate) {
        errorObj.InitialEntryDate = "Required Field";
      }
      // if (values.InitialEntryDate === "") {
      //   errorObj.InitialEntryDate = "Required Field";
      errorArr.push({ name: "InitialEntryDate" });
      // }
    }
    //
    if (
      values.AdmissionDate === "" ||
      values.AdmissionDate === "Invalid date"
    ) {
      if (values.AdmissionDate === "Invalid date") {
        errorObj.AdmissionDate = "Invalid date";
      } else {
        errorObj.AdmissionDate = "Required Field";
      }
      // errorObj.AdmissionDate = "Required Field";
      errorArr.push({ name: "AdmissionDate" });
    }
    if (!values.clientbillingid || values.clientbillingid === "0") {
      errorObj.clientbillingid =
        values.clientbillingid === "0"
          ? "Client Billing ID cannot be a zero"
          : "Required Field";
      errorArr.push({ name: "clientbillingid" });
    }

    if (!values.Record_id || values.Record_id === "0") {
      errorObj.Record_id =
        values.Record_id === "0"
          ? "Resident ID cannot be a zero"
          : "Required Field";
      errorArr.push({ name: "Record_id" });
    }

    if (values.facility_id === 0) {
      errorObj.facility_id = "Facility is Required";
      errorArr.push({ name: "facility_id" });
    }
    if (values.IsPre1July2014 === true) {
      if (!newAmount) {
        errorObj.BondAmount = "Bond Amount is Required";
        errorArr.push({ name: "BondAmount" });
      }
      if (`${values.InstTwoDate}` === "Invalid date") {
        errorObj.InstTwoDate = "Invalid date";
        errorArr.push({ name: "InstTwoDate" });
      }
      if (`${values.InstOneDate}` === "Invalid date") {
        // if (`${values.InstOneDate}` === "Invalid date") {
        errorObj.InstOneDate = "Invalid date";
        // } else {
        // errorObj.InstOneDate = "Required Field";
        // }
        // errorObj.AdmissionDate = "Required Field";
        errorArr.push({ name: "InstOneDate" });
      }
      if (values.partLumsumAmount > newAmount) {
        errorObj.partLumsumAmount = "Should be less than Bond Amount";
        errorArr.push({ name: "partLumsumAmount" });
      }
      if (values.RetentionMonths === "" || values.RetentionMonths === 0) {
        errorObj.RetentionMonths = "Rentation Month is Required";
        errorArr.push({ name: "RetentionMonths" });
      }
      // console.log("mpirField", mpirField);
      // if (values.MPIR > mpirField.DbMPIR || !values.MPIR) {
      if (mpirField.newMPIR > mpirField.DbMPIR || !mpirField.newMPIR) {
        errorObj.MPIR = "Required and Should be less than MPIR%t";
        errorArr.push({ name: "MPIR" });
      }
      if (!monthlyAmount) {
        errorObj.MonthlyRetention = "Monthly Amount is Required";
        errorArr.push({ name: "MonthlyRetention" });
      }
      if (firstInstallmentAmount > newAmount) {
        errorObj.InstOneAmount = "First Installment Amount is greater";
        errorArr.push({ name: "InstOneAmount" });
      }

      if (secondInstallmentAmount > newAmount) {
        errorObj.InstTwoAmount = "Second Installment Amount is greater";
        errorArr.push({ name: "InstTwoAmount" });
      }
      if (values.CareCategory === "Permanent") {
        errorObj.CareCategory = "Required Field";
        errorArr.push({ name: "CareCategory" });
      }
    }

    //console.log("Error Array ", errorArr);
    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  async function saveResident(fields, { setSubmitting }, CancelCalled) {
    // console.log("fields", fields);
    //console.log("admissionDate", admissionDate);
    // console.log("InterestType at save", selectedEopInterestMethod);
    // console.log("RetentionType at save", selectedEopRetentionMethod);

    let formData = new FormData();
    formData.append("TitleTypeId", fields.TitleTypeId);
    formData.append("FirstName", fields.FirstName);
    formData.append("LastName", fields.LastName);
    formData.append("DOBDate", fields.DOBDate);
    formData.append("Phone", fields.Phone);
    formData.append("Mobile", fields.Mobile);
    formData.append("Email", fields.Email);
    formData.append("Address1", fields.Address1);
    formData.append("Address2", fields.Address2);
    formData.append(
      "SubUrb",
      fields.streetsuburb ? fields.streetsuburb : fields.SubUrb
    );
    formData.append(
      "StatedId",
      selectedStreetCountry.description === "Australia"
        ? fields.StatedId
          ? fields.StatedId
          : 0
        : fields.streetState
    );
    formData.append("postcode", fields.postcode);
    formData.append("Fax", fields.Fax);
    formData.append("IsPre1July2014", fields.IsPre1July2014);
    formData.append("IsTransfer", fields.IsTransfer);
    formData.append(
      "InitialEntryDate",
      fields.IsTransfer
        ? moment(fields.InitialEntryDate).format("YYYY-MM-DD")
        : ""
    );

    // formData.append("AdmissionDate", admissionDate);
    formData.append(
      "AdmissionDate",
      moment(admissionDate).format("YYYY-MM-DD")
    );

    // console.log("Bond and cate of non bond", bond, permenetCare);
    if (bond) {
      formData.append("CareCategory", fields.CareCategory);
      formData.append("LumpSumPart", PartLumsumAmount);
    }
    formData.append("IsExtraService", fields.IsExtraService);
    setIsExtra(fields.IsExtraService);
    formData.append("facility_id", fields.facility_id);
    formData.append("Record_id", fields.Record_id);
    formData.append("BondAmount", newAmount);
    formData.append("BondPaymentTypeId", fields.BondPaymentTypeId);
    formData.append("MPIR", mpirField.newMPIR);
    formData.append("BondSettled", fields.BondSettled);
    formData.append(
      "InstOneDate",
      fields.InstOneDate ? fields.InstOneDate : ""
    );
    formData.append("InstOneAmount", firstInstallmentAmount);
    formData.append(
      "InstTwoDate",
      fields.InstTwoDate ? fields.InstTwoDate : ""
    );
    formData.append("InstTwoAmount", secondInstallmentAmount);
    formData.append("MonthlyRetention", monthlyAmount);
    formData.append("RetentionMonths", fields.RetentionMonths);
    formData.append("RetentionMonthsTaken", fields.RetentionMonthsTaken);
    formData.append("RefundDate", fields.RefundDate);
    formData.append("TransferDate", fields.TransferDate);

    formData.append("LumpSumPart", fields.LumpSumPart);
    if (fields.RetentionType) {
      formData.append("RetentionType", fields.RetentionType);
    }
    if (fields.InterestType) {
      formData.append("InterestType", fields.InterestType);
    }
    formData.append("IsMale", fields.IsMale);
    formData.append(
      "countryId",
      fields.countryId ? fields.countryId : selectedStreetCountry.id
    );
    formData.append("clientbillingid", fields.clientbillingid);
    formData.append("episodeId", fields.episodeId);
    formData.append("file", imageData && imageData.name ? imageData : null);
    //let result = [];

    // var result1 = representativeArray.filter(function(o1) {
    //   return CPYRepresentativeArray.some(function(o2) {
    //     return o1.rep_id === o2.rep_id; // return the ones with equal id
    //   });
    // });

    // if you want to be more clever to find those in common:
    let result = representativeArray.filter(
      (o1) =>
        CPYRepresentativeArray.some((o2) => o1.rep_id === o2.rep_id) ||
        (!CPYRepresentativeArray.some((o2) => o1.rep_id === o2.rep_id) &&
          o1.isdeleted === false)
    );

    // To find those in 1 NOT in 2:
    // let result3 = representativeArray.filter(
    //   (o1) => !CPYRepresentativeArray.some((o2) => o1.rep_id === o2.rep_id)
    // );

    //console.log("get to be deleted from array object", result1);
    //console.log("get to be deleted from array object", result);
    //console.log("get to be deleted from array object", result3);

    result.forEach((obj, i) => {
      Object.keys(obj).forEach((key) => {
        // if ((key = "rep_Dob" && (obj[key] === null || obj[key] === undefined)))
        //   obj[key] = "";
        formData.append(
          `ResidentRepresentativeList[${i}].${key}`,
          key === "rep_Dob" && (obj[key] === null || obj[key] === undefined)
            ? ""
            : obj[key]
        );
      });
    });

    // EopServices.checkFinalisePeriod(
    //   fields.facility_id,
    //   moment(admissionDate).format("YYYY-MM-DD")
    // ).then((response) => {
    //   if (response && response.result) {
    //     setBeFoforeCheckData({
    //       ...formData,
    //       tmpType: editData.id ? "Edit" : "Add",
    //     });
    //     setShowErrorPopup(!showErrorPopup);
    //   } else {
    // console.log("representativeArray", representativeArray);
    // console.log("CPYRepresentativeArray", CPYRepresentativeArray);
    if (editData?.id || ResidentSaved) {
      if (
        JSON.stringify(fields) === JSON.stringify(initialValues) &&
        JSON.stringify(representativeArray) ===
          JSON.stringify(CPYRepresentativeArray) &&
        JSON.stringify(image) === JSON.stringify(CpyImage)
      ) {
        setResidentId(editData.id);
        if (CancelCalled === "CancelCalled") {
          navigateToView();
        } else if (CancelCalled === "onlySave") {
        } else {
          setActiveStep(1);
        }
        setLoading(false);
      } else {
        formData.append("id", ResidentSaved ? residentId : editData.id);
        if (JSON.stringify(image) !== JSON.stringify(CpyImage)) {
          formData.append("isUpdated", true);
        }
        setLoading(true);
        residentService
          .updateResident(formData)
          .then((response) => {
            // console.log(" after update resident id", response.result);
            setResidentId(response.result);
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: EDIT,
              msg: response.message,
              callback: () => {
                setShowSuccessAlert(false);
              },
            });
            if (CancelCalled === "CancelCalled") {
              navigateToView();
            } else if (CancelCalled === "onlySave") {
            } else {
              setActiveStep(1);
            }
            //setActiveStep(1);
            setShowSuccessAlert(true);
          })
          .catch(() => {
            setLoading(false);
            setResidentRepresentativeRModel(representativeArray);
          });
      }
      if (typeof setSubmitting === "function") {
        setSubmitting(false);
      }
    } else {
      setLoading(true);
      // console.log("formData before creating", formData);
      residentService
        .createResident(formData)
        .then((response) => {
          localStorage.setItem("residentId", response.result);
          setLoading(false);
          setResidentId(response.result);
          setSuccessAlertOptions({
            title: "",
            actionType: ADD,
            msg: response.message,
            callback: () => {
              setShowSuccessAlert(false);
            },
          });

          //setActiveStep(1);
          setShowSuccessAlert(true);
          if (CancelCalled === "CancelCalled") {
            navigateToView();
          } else if (CancelCalled === "onlySave") {
            setResidentSaved(true);
          } else {
            setActiveStep(1);
          }
        })
        .catch(() => {
          setLoading(false);
          setResidentRepresentativeRModel(representativeArray);
        });
      if (typeof setSubmitting === "function") {
        setSubmitting(false);
      }
    }
    // }
    // });
  }

  const handleonClickNavigation = (val, updatedValues) => {
    setIsBubbleClicked(true);
    setIsCancelling(false);
    const type = localStorage.getItem("residentActionType");
    let max = maxActiveStep + 1;

    let originalData = JSON.stringify({
      ...templateData,
      InitialEntryDate: templateData.InitialEntryDate
        ? moment(templateData.InitialEntryDate)
        : "",
    });
    let updatedData = JSON.stringify({
      ...updatedValues,
      InitialEntryDate: updatedValues.InitialEntryDate
        ? moment(updatedValues.InitialEntryDate)
        : "",
    });

    // editData.isTransfer
    //         ? editData.initialEntryDate
    //         : undefined,
    // console.log("JSON.stringify(templateData)", originalData);

    // console.log("JSOnN sddf", updatedData);
    if (activeStep === 0) {
      if (
        originalData === updatedData &&
        JSON.stringify(representativeArray) ===
          JSON.stringify(CPYRepresentativeArray)
      ) {
        if (type === "Add") {
          if (residentId !== -1 && val <= max) {
            setActiveStep(val);
          }
        }
        if (type === "Edit") {
          setActiveStep(val);
        }
      } else {
        if (type === "Add") {
          if (residentId !== -1 && val <= max) {
            // cancelSaveRepresentative();
            setClickedStep(val);
            // console.log("*** templateData", JSON.stringify(templateData));
            // console.log("*** initialValues", JSON.stringify(updatedValues));
            setShowUnSaveChangesAlert(true);
          }
        } else if (type === "Edit") {
          setClickedStep(val);
          setShowUnSaveChangesAlert(true);
        }
      }
    } else if (
      activeStep === 1 ||
      activeStep === 2 ||
      activeStep === 3 ||
      activeStep === 4
    ) {
      if (isUnsavedData) {
        setClickedStep(val);
        setShowUnSaveChangesAlert(true);
      } else {
        setActiveStep(val);
      }
    }
    // if (activeStep === 2 || activeStep === 3 || activeStep === 4) {
    //   if (type === "Edit") {
    //     setActiveStep(val);
    //   }
    // }
  };

  const callBackFromWarning = (re) => {
    if (re) {
      if (isBubbleClicked) {
        setIsUnsavedData(false);
        setIsCancelling(false);
        setActiveStep(clickedStep);
      } else {
        // console.log("activeStep", activeStep);
        if (activeStep === 0 || activeStep === 4) {
          saveResident(initialValues, false, "CancelCalled");
          //navigateToView();
          setNavigationToView(true);
        } else {
          setNavigationToView(true);
          //navigateToView();
        }
      }
      setShowUnSaveChangesAlert(false);
      setIsCancelling(true);
    } else {
      setIsCancelling(false);
      // console.log("Cancelling to false");
      setShowUnSaveChangesAlert(false);
    }
  };

  const handleCancel = () => {
    setIsBubbleClicked(false);
    if (activeStep === 0) {
      if (
        JSON.stringify(templateData) === JSON.stringify(initialValues) &&
        JSON.stringify(representativeArray) ===
          JSON.stringify(CPYRepresentativeArray)
      ) {
        navigateToView();
        // console.log("NAVIGATE");
      } else {
        // cancelSaveRepresentative();
        // console.log("*** templateData", JSON.stringify(templateData));
        // console.log("*** initialValues", JSON.stringify(initialValues));

        setShowUnSaveChangesAlert(true);
        setIsBubbleClicked(false);
      }
    }
    if (activeStep !== 0) {
      if (isUnsavedData) {
        // console.log("handleCancel 1");
        setShowUnSaveChangesAlert(true);
        setIsBubbleClicked(false);
      } else {
        setIsCancelling(false);
        navigateToView();
        // console.log("NAVIGATE else");
      }
    }

    // if (activeStep !== 0) {
    //   if (
    //     isUnsavedData &&
    //     ((!bond && activeStep !== 2) || (!bond && activeStep !== 1))
    //   ) {
    //     console.log("handleCancel 1");
    //     setShowUnSaveChangesAlert(true);
    //     setIsBubbleClicked(false);
    //   } else if (isUnsavedData && bond && activeStep === 2) {
    //     setShowUnSaveChangesAlert(true);
    //     setIsBubbleClicked(false);
    //     console.log("handleCancel 2");
    //   } else if (isUnsavedData && !bond && activeStep == 1) {
    //     setShowUnSaveChangesAlert(true);
    //     setIsBubbleClicked(false);
    //     console.log("handleCancel 3");
    //   } else if (isUnsavedData && !bond && activeStep == 3) {
    //     setShowUnSaveChangesAlert(true);
    //     setIsBubbleClicked(false);
    //     console.log("handleCancel 3");
    //   } else {
    //     setIsCancelling(false);
    //     navigateToView();
    //     console.log("NAVIGATE");
    //   }
    // }
  };

  const handleCancelFalse = () => {
    // setIsCancelling(false);
  };

  const onEopFinaliseContinue = () => {
    // console.log("BeFoforeCheckData", BeFoforeCheckData);
    setShowErrorPopup(!showErrorPopup);
    if (BeFoforeCheckData && Object.keys(BeFoforeCheckData).length > 0) {
      const cpyData = { ...BeFoforeCheckData };
      if (cpyData.tmpType === "Edit") {
        delete BeFoforeCheckData.tmpType;
        BeFoforeCheckData.id = editData.id;
      } else {
        delete BeFoforeCheckData.tmpType;
      }
    }
  };
  const onEopCancelClick = () => {
    setShowErrorPopup(false);
  };
  const callBackForUnsavedChanges = (value) => {
    setShowUnSaveChangesAlert(value);
  };

  const callbackIsUnsavedData = (data) => {
    setIsUnsavedData(data);
    // setIsUnsavedDataInReceipt(data);
    // handlIsUnSavedData(data);
  };

  const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          TitleTypeId: Yup.string(),
          FirstName: Yup.string().required(),
          LastName: Yup.string().required(),
          DOBDate: Yup.string(),
          Phone: Yup.string()
            .max(11, VALIDNUMBER)
            .min(8, VALIDNUMBER)
            .transform((value, originalValue) =>
              /\s/.test(originalValue) ? NaN : value
            ),
          // Mobile: Yup.string()
          //   .max(13, VALIDNUMBER)
          //   .min(10, VALIDNUMBER)
          //   .transform((value, originalValue) =>
          //     /\s/.test(originalValue) ? NaN : value
          //   ),

          // Mobile: Yup.string().when("Mobile", {
          //   is: initialValues.Mobile.length > 10,
          //   then: max(13),
          // }),

          Mobile: Yup.string()
            .matches(phoneRegExp, "Mobile number is not valid")
            .max(13)
            .min(10),
          Email: Yup.string().matches(
            "^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$",
            VALIDEMAIL
          ),
          Address1: Yup.string(),
          Address2: Yup.string(),
          SubUrb: Yup.string(),
          StatedId: Yup.string(),
          postcode: Yup.string(),
          Fax: Yup.string(),
          IsPre1July2014: Yup.boolean(),
          IsTransfer: Yup.boolean(),
          InitialEntryDate: Yup.string().nullable(),
          AdmissionDate: Yup.string(),
          CareCategory: Yup.string(),
          IsExtraService: Yup.string(),
          facility_id: Yup.string(),
          Record_id: Yup.string().required(),
          episodeId: Yup.string().required(),
          clientbillingid: Yup.string().required(),
          BondAmount: initialValues.IsPre1July2014 && Yup.string().required(),
          BondPaymentTypeId: Yup.string(),
          MPIR: initialValues.IsPre1July2014 && Yup.string().required(),
          BondSettled: Yup.string(),
          // InstOneDate: Yup.string(),
          InstOneAmount: Yup.string(),
          // InstTwoDate: Yup.string(),
          InstTwoAmount: Yup.string(),
          MonthlyRetention:
            initialValues.IsPre1July2014 && Yup.string().required(),
          RetentionMonths: Yup.string(),
          RetentionMonthsTaken: Yup.string(),
          RefundDate: Yup.string(),
          TransferDate: Yup.string(),
          InterestType: Yup.string(),
          LumpSumPart: Yup.string(),
          RetentionType: Yup.string(),
          IsMale: Yup.boolean(),
          countryId: Yup.string(),
          file: Yup.string(),
        })}
        validate={validateForm}
        validateOnChange={true}
        validateOnBlur={true}
        innerRef={ResidentFormRef}
        onSubmit={saveResident}
      >
        {({
          errors,
          handleSubmit,
          setSubmitting,
          handleChange,
          isSubmitting,
          setErrors,
          handleBlur,
          touched,
          values,
          setFieldValue,
          setFieldTouched,
          isValid,
          dirty,
        }) => (
          <>
            {loading || editLoading ? (
              <Loader></Loader>
            ) : (
              <Page title={"Add New Resident"}>
                <>
                  {editData !== undefined && (
                    <>
                      <label>
                        {image.preview ? (
                          <img
                            src={image.preview}
                            className="ms-3 mt-3"
                            alt="dummy"
                            width="54"
                            height="57.13"
                            style={{ borderRadius: "50%" }}
                          />
                        ) : (
                          <>
                            <div className="imgbox"></div>
                            <h5
                              className="text-center ms-3 mt-3"
                              style={{
                                width: "54px",
                                height: "57.13px",
                                backgroundColor: "lightgrey",
                                borderRadius: "50px",
                              }}
                            >
                              <div
                                style={{
                                  paddingTop: "21px",
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                {"Logo"}
                              </div>
                            </h5>
                          </>
                        )}
                      </label>
                      <Label
                        className="ms-4 residentname"
                        style={{
                          fontWeight: "bold",
                          position: "absolute",
                          marginTop: "25px",
                        }}
                      >
                        {values.FirstName || (editData && editData.firstName)}{" "}
                        {values.LastName || (editData && editData.lastName)}
                      </Label>
                      <br />
                      {editData &&
                        editData.statusName == "Active" &&
                        !refundComplete && (
                          <Row>
                            <Col sm={1} style={{ width: "1%" }}>
                              <Label
                                className="circle green"
                                style={{
                                  position: "absolute",
                                  marginLeft: "6.5rem",
                                  marginTop: "-22px",
                                }}
                              ></Label>
                            </Col>
                            <Col sm={1}>
                              <Label
                                className=""
                                style={{
                                  position: "absolute",
                                  marginLeft: "6rem",
                                  marginTop: "-28px",
                                }}
                              >
                                {editData.statusName}
                              </Label>
                            </Col>
                          </Row>
                        )}
                      {editData &&
                        editData.statusName == "To be Refunded" &&
                        !refundComplete && (
                          <Row>
                            <Col sm={1} style={{ width: "1%" }}>
                              <Label
                                className="circle grey"
                                style={{
                                  position: "absolute",
                                  marginLeft: "6.5rem",
                                  marginTop: "-24px",
                                }}
                              ></Label>
                            </Col>
                            <Col sm={1}>
                              <Label
                                className=""
                                style={{
                                  position: "absolute",
                                  marginLeft: "6rem",
                                  marginTop: "-30px",
                                }}
                              >
                                {editData.statusName}
                              </Label>
                            </Col>
                          </Row>
                        )}
                      {editData &&
                        (editData.statusName == "Refunded" ||
                          refundComplete) && (
                          <Row>
                            <Col sm={1} style={{ width: "1%" }}>
                              <Label
                                className="circle blue"
                                style={{
                                  position: "absolute",
                                  marginLeft: "6.5rem",
                                  marginTop: "-24px",
                                }}
                              ></Label>
                            </Col>
                            <Col sm={1}>
                              <Label
                                className=""
                                style={{
                                  position: "absolute",
                                  marginLeft: "6rem",
                                  marginTop: "-30px",
                                }}
                              >
                                {refundComplete
                                  ? "Refunded"
                                  : editData.statusName}
                              </Label>
                            </Col>
                          </Row>
                        )}
                      {editData &&
                        editData.statusName == "Archived" &&
                        !refundComplete && (
                          <Row>
                            <Col sm={1} style={{ width: "1%" }}>
                              <Label
                                className="circle orange"
                                style={{
                                  position: "absolute",
                                  marginLeft: "6.5rem",
                                  marginTop: "-24px",
                                }}
                              ></Label>
                            </Col>
                            <Col sm={1}>
                              <Label
                                className=""
                                style={{
                                  position: "absolute",
                                  marginLeft: "6rem",
                                  marginTop: "-30px",
                                }}
                              >
                                {editData.statusName}
                              </Label>
                            </Col>
                          </Row>
                        )}
                    </>
                  )}
                </>

                {type === "Add" && (
                  <div className="head mt-3">
                    <img src={Icon} className="icon" />
                    {!values.IsPre1July2014
                      ? "Add New Resident"
                      : "Add New Resident (Bonds)"}
                  </div>
                )}

                <div
                  className="d-flex justify-content-center"
                  style={{ height: "80px", marginBottom: "50px" }}
                >
                  <ResidentNavigationBar
                    stepArray={!bond ? stepArray : stepArray1}
                    currentStep={activeStep}
                    handleonClickNavigation={(indx) =>
                      handleonClickNavigation(indx, values)
                    }
                    maxActiveStep={maxActiveStep}
                    callBackForUnsavedChanges={callBackForUnsavedChanges}
                  ></ResidentNavigationBar>
                </div>
                <br />
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
                {showImageConfirm && (
                  <RemoveImage
                    showErrorPopup={showImageConfirm}
                    header={"Remove Profile Image"}
                    errorMessage={
                      "Are you sure you want to remove this Resident's profile image?"
                    }
                    handleErrorClose={onRemoveImageConfirm}
                  ></RemoveImage>
                )}
                {showErrorPopup ? (
                  <WarningAlert
                    isOpen={showErrorPopup}
                    continueClicked={onEopFinaliseContinue}
                    cancelClicked={onEopCancelClick}
                  ></WarningAlert>
                ) : null}

                <Form onSubmit={handleSubmit} autoComplete="off">
                  <div
                    style={{ float: "right" }}
                    className="d-flex justify-content-between "
                  >
                    <Button
                      type="button"
                      size="md"
                      style={{
                        marginTop: "-40px",
                        marginRight: "10px",
                        width: "120px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                      className="btn navbarbtnheight sm"
                      onClick={() => {
                        handleCancel();
                      }}
                    >
                      {"Cancel"}
                    </Button>

                    {activeStep === 0 ? (
                      <Button
                        size="md"
                        className="btn custom-disabled navbarbtnheight sm"
                        style={{
                          marginTop: "-40px",
                          marginRight: "10px",
                          width: "120px",
                          paddingTop: "4px",
                        }}
                        disabled
                        onClick={() => {}}
                      >
                        <span style={{ marginRight: "10px", marginTop: "2px" }}>
                          <i class="fa fa-chevron-left" aria-hidden="true"></i>
                        </span>
                        {"Back"}
                      </Button>
                    ) : (
                      <Button
                        size="md"
                        className="btn clsbtn navbarbtnheight sm"
                        style={{
                          marginTop: "-40px",
                          marginRight: "10px",
                          width: "120px",
                          color: "#797979",
                        }}
                        onClick={() => {
                          if (activeStep === 1) {
                            setEditData({});
                          }
                          if (activeStep === 4) {
                            setFeesFormSubmitting(false);
                            setActiveStep(activeStep - 1);
                          }
                          if (activeStep === 4 && bond) {
                            setActiveStep(activeStep - 2);
                          } else {
                            setActiveStep(activeStep - 1);
                          }
                        }}
                      >
                        <span style={{ marginRight: "10px", marginTop: "2px" }}>
                          <i class="fa fa-chevron-left" aria-hidden="true"></i>
                        </span>
                        {"Back"}
                      </Button>
                    )}
                    {activeStep === 0 ? (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="modalsave btn btn-primary navbarbtnheight"
                        size="md"
                        style={{
                          marginTop: "-40px",
                          marginRight: "10px",
                          minWidth: " 120px",
                        }}
                        onClick={() => {
                          setErrors({});

                          if (activeStep === 3) {
                            handleHeldByGovernment();
                          }
                          setIsContinue(true);
                          handleContinueApiCall();
                        }}
                      >
                        {"Continue"}
                        <span style={{ marginLeft: "10px", marginTop: "2px" }}>
                          <i class="fa fa-chevron-right" aria-hidden="true"></i>
                        </span>
                      </Button>
                    ) : (
                      <Button
                        disabled={
                          (!bond && activeStep === 4) ||
                          (bond && activeStep === 4)
                        }
                        className="modalsave btn btn-primary navbarbtnheight"
                        size="md"
                        style={{
                          marginTop: "-40px",
                          marginRight: "10px",
                          minWidth: " 120px",
                        }}
                        onClick={() => {
                          submitForm();
                          if (activeStep === 3) {
                            handleHeldByGovernment();
                          }
                          setIsContinue(true);
                          setMaxActiveStep(activeStep);
                          {
                            bond &&
                              activeStep === 2 &&
                              setActiveStep(activeStep + 2);
                          }
                        }}
                      >
                        {"Continue"}
                        <span style={{ marginLeft: "10px", marginTop: "2px" }}>
                          <i class="fa fa-chevron-right" aria-hidden="true"></i>
                        </span>
                      </Button>
                    )}

                    {/* {activeStep === 4 && (
                      <Button
                        // type="submit"
                        disabled={isSubmitting}
                        size="md"
                        className="modalsave btn btn-primary sm navbarbtnheight"
                        style={{
                          marginTop: "-40px",
                          marginRight: "10px",
                          width: "120px",
                        }}
                        onClick={handleSaveExit}
                      >
                        {"Save & Exit"}
                      </Button>
                    )} */}

                    <Button
                      size="md"
                      className="modalsave btn btn-primary sm navbarbtnheight"
                      style={{
                        marginTop: "-40px",
                        marginRight: "10px",
                        width: "120px",
                      }}
                      onClick={() => {
                        if (activeStep === 0) {
                          if (editData && editData.id && !dirty) {
                          } else {
                            if (Object.keys(errors).length > 0) {
                              // ResidentFormRef.current?.validateForm();
                              handleSubmit();
                              // setSubmitting(false);
                            } else {
                              saveResident(
                                values,
                                { setSubmitting },
                                "onlySave"
                              );
                            }
                          }
                        } else {
                          handleAddResidentClick();
                        }
                      }}
                    >
                      {"Add Resident"}
                    </Button>

                    {/* {activeStep === 4 && !bond && (
                      <>
                        <Button
                          // type="submit"
                          disabled={isSubmitting}
                          size="md"
                          className="modalsave btn btn-primary sm navbarbtnheight"
                          style={{
                            marginTop: "-40px",
                            marginRight: "10px",
                            width: "120px",
                          }}
                          onClick={handleSaveExit}
                        >
                          {"Save & Exit"}
                        </Button>
                      </>
                    )} */}

                    {activeStep === 4 && (
                      <>
                        <Button
                          // type="submit"
                          disabled={isSubmitting}
                          size="md"
                          className="modalsave btn btn-primary sm navbarbtnheight"
                          style={{
                            marginTop: "-40px",
                            marginRight: "10px",
                            width: "120px",
                          }}
                          onClick={handleSaveExit}
                        >
                          {"Save & Exit"}
                        </Button>
                      </>
                    )}
                  </div>

                  {activeStep === 0 &&
                  (JSON.stringify(initialValues) !== JSON.stringify(values) ||
                    dirty ||
                    JSON.stringify(representativeArray) !==
                      JSON.stringify(CPYRepresentativeArray)) ? (
                    // ||(activeStep === 1 && isUnsavedData)
                    <>
                      <DirtyWarningAlert
                        sourceName={
                          editData && editData.id
                            ? "Edit Resident"
                            : "Add New Resident"
                        }
                        isBlocking={isUnsavedData}
                        messageBody={
                          "Are you sure you want to exit to the Register and discard these changes?"
                        }
                      />
                    </>
                  ) : null}

                  {(activeStep === 0 &&
                    showUnSaveChangesAlert &&
                    (JSON.stringify(initialValues) !== JSON.stringify(values) ||
                      dirty)) ||
                  JSON.stringify(representativeArray) !==
                    JSON.stringify(CPYRepresentativeArray) ||
                  (activeStep === 1 &&
                    showUnSaveChangesAlert &&
                    isUnsavedData) ||
                  (activeStep === 2 &&
                    showUnSaveChangesAlert &&
                    isUnsavedData) ||
                  (activeStep === 3 &&
                    showUnSaveChangesAlert &&
                    isUnsavedData) ||
                  (activeStep === 4 &&
                    showUnSaveChangesAlert &&
                    isUnsavedData) ? (
                    <DirtyWarningAlertWithoutFormik
                      isBlocking={showUnSaveChangesAlert}
                      callBackResult={callBackFromWarning}
                      sourceName={
                        type == "Edit" ? "Edit Resident" : "Add Resident"
                      }
                      messageBody={
                        "Are you sure you want to exit and discard these changes?"
                      }
                    />
                  ) : null}

                  {activeStep === 3 ||
                  (activeStep === 2 && bond === true) ? null : (
                    <div
                      style={{
                        border: "1.3px solid #896cc4",
                        backgroundColor: "#896cc4",
                      }}
                    />
                  )}

                  {activeStep === 0 ? (
                    <div
                      className="row"
                      style={{
                        backgroundColor: refundComplete ? "#d3d3d378" : "",
                        pointerEvents: refundComplete ? "none" : "",
                      }}
                    >
                      <div className="col">
                        <div className="head mt-3">
                          <img src={Icon} className="icon" />
                          {"Resident Details"}{" "}
                          <i
                            className="fa fa-info-circle fa-sm"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              onHandleMessage(
                                INFO,
                                RESIDENTHEAD,
                                RESIDENTBODY.TEXT
                              )
                            }
                          ></i>{" "}
                          <Button
                            style={{ marginLeft: "4px" }}
                            className="addbtn  btn btn-primary  disabled ms-4"
                          >
                            {"Import Details"}
                          </Button>
                        </div>
                        <hr />
                        <br />
                        <div className="row">
                          <div
                            className="col-3"
                            style={{ textAlign: "center" }}
                          >
                            <label>
                              {image.preview ? (
                                <img
                                  src={image.preview}
                                  alt="dummy"
                                  width="141"
                                  height="161"
                                />
                              ) : (
                                <>
                                  <div className="imgbox">
                                    <h5
                                      className="text-center ms-3"
                                      style={{
                                        width: "141px",
                                        height: "161px",
                                        backgroundColor: "lightgrey",
                                        borderRadius: "5px",
                                        marginBottom: "-5px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          paddingTop: "70px",
                                          fontSize: "16px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {"Resident Image"}
                                      </div>
                                    </h5>
                                  </div>
                                </>
                              )}
                            </label>
                            <input
                              type="file"
                              id="upload-button"
                              ref={profileRef}
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={handleImageChange}
                              disabled={refundComplete}
                            />
                            <br />
                            <div style={{ marginLeft: "8px" }}>
                              <Button
                                className="modalsave btn btn-primary mt-2"
                                color="primary"
                                size="md"
                                onClick={handleUpload}
                                style={{ width: "80px" }}
                                disabled={refundComplete}
                              >
                                {image.preview ? "Edit" : "Upload"}
                              </Button>{" "}
                              <Button
                                color="light"
                                style={{
                                  border: "1px solid",
                                  borderColor: "darkgrey",
                                  width: "80px",
                                }}
                                className="clsbtn btn btn-secondary mt-2"
                                onClick={() => {
                                  setShowImageConfirm(true);
                                }}
                                disabled={image.preview ? false : true}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          <div className="col-9">
                            <Row className={"fieldstyle"}>
                              {editData && editData.id ? (
                                <FormGroup row>
                                  <Label
                                    style={{ textAlign: "right" }}
                                    htmlFor="NeRAResident"
                                    column
                                    sm={2}
                                  >
                                    {"NeRA Resident"}
                                  </Label>
                                  <Col sm={6}>
                                    <Label name="NeRAResident" className="mt-2">
                                      {editData.isNERA ? "Yes" : "No"}
                                    </Label>
                                  </Col>
                                </FormGroup>
                              ) : null}
                            </Row>
                            <Row>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right", height: "40px" }}
                                  htmlFor="TitleTypeId"
                                  column
                                  sm={2}
                                >
                                  {"Title"}
                                </Label>
                                <Col sm={6}>
                                  <SingleSelect
                                    isDisabled={refundComplete}
                                    name="TitleTypeId"
                                    placeholder="Select...."
                                    onChange={(selected) => {
                                      setFieldValue(
                                        "TitleTypeId",
                                        selected.title_type_id
                                      );
                                      setSelectedTitle(selected);
                                    }}
                                    options={titles}
                                    value={selectedTitle}
                                    disabled={refundComplete}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  column
                                  sm={2}
                                  className={
                                    errors.FirstName && touched.FirstName
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {FIRSTNAME}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    type="text"
                                    name="FirstName"
                                    value={values.FirstName}
                                    onChange={(e) => {
                                      const val = (
                                        e.target.value || ""
                                      ).replace(/\s+/gi, " ");
                                      setFieldValue(
                                        "FirstName",
                                        val.trimLeft()
                                      );
                                      handleBlur(val);
                                    }}
                                    style={{ alignText: "right" }}
                                    className={
                                      "text form-control" +
                                      (errors.FirstName && touched.FirstName
                                        ? " is-invalid"
                                        : "")
                                    }
                                    disabled={refundComplete}
                                  />
                                </Col>

                                <Col sm={4}>
                                  <InlineBottomErrorMessage name="FirstName" />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row className="row-md-2">
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="LastName"
                                  column
                                  sm={2}
                                  className={
                                    errors.LastName && touched.LastName
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {LASTNAME}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    type="text"
                                    name="LastName"
                                    value={values.LastName}
                                    style={{ alignText: "right" }}
                                    onChange={(e) => {
                                      const val = (
                                        e.target.value || ""
                                      ).replace(/\s+/gi, " ");
                                      setFieldValue("LastName", val.trimLeft());
                                      handleBlur(val);
                                    }}
                                    className={
                                      "text form-control" +
                                      (errors.LastName && touched.LastName
                                        ? " is-invalid"
                                        : "")
                                    }
                                    disabled={refundComplete}
                                  />
                                </Col>
                                <Col sm={4}>
                                  <InlineBottomErrorMessage name="LastName" />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  column
                                  sm={2}
                                  className={
                                    errors.DOBDate &&
                                    touched.DOBDate &&
                                    !values.DOBDate
                                      ? " is-invalid-label required-field"
                                      : "required-field"
                                  }
                                >
                                  {DATEOFBIRTH}
                                </Label>
                                <Col sm={6}>
                                  <InputGroup>
                                    <MuiDatePicker
                                      id="DOBDate"
                                      name="DOBDate"
                                      className={"text form-control"}
                                      selectedDate={
                                        (values.DOBDate &&
                                          new Date(values.DOBDate)) ||
                                        null
                                      }
                                      maxDate={new Date()}
                                      error={
                                        touched.DOBDate &&
                                        errors.DOBDate &&
                                        !values.DOBDate
                                      }
                                      getChangedDate={(val) => {
                                        if (val) {
                                          setFieldValue(
                                            "DOBDate",
                                            val.toJSON()
                                          );
                                          // setFieldValue(
                                          //   "AdmissionDate",
                                          //   moment(new Date()).format()
                                          // );
                                          // setAdmissionDate(
                                          //   moment(new Date()).format()
                                          // );
                                        } else {
                                          setFieldValue("DOBDate", "");
                                          // setFieldValue(
                                          //   "AdmissionDate",
                                          //   moment(new Date()).format()
                                          // );
                                          // setAdmissionDate(
                                          //   moment(new Date()).format()
                                          // );
                                        }
                                      }}
                                      disabled={refundComplete}
                                    />
                                  </InputGroup>
                                </Col>
                                <Col sm={4}>
                                  <InlineBottomErrorMessage
                                    name="DOBDate"
                                    msg={errors.DOBDate}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>

                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  column
                                  sm={2}
                                  className={
                                    errors.Phone && touched.Phone
                                      ? "is-invalid-label fw-bold"
                                      : null
                                  }
                                >
                                  {TELEPHONE}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    type="number"
                                    name="Phone"
                                    value={values.Phone}
                                    placeholder={"000-000-000"}
                                    style={{ alignText: "right" }}
                                    className={
                                      "text form-control" +
                                      (errors.Phone && touched.Phone
                                        ? " is-invalid"
                                        : "")
                                    }
                                    onKeyDown={blockInvalidChar}
                                    disabled={refundComplete}
                                  />
                                </Col>
                                <Col sm={4}>
                                  <InlineBottomErrorMessage
                                    name="Phone"
                                    msg={VALIDNUMBER}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  column
                                  sm={2}
                                  className={
                                    errors.Mobile && touched.Mobile
                                      ? "is-invalid-label fw-bold"
                                      : null
                                  }
                                >
                                  {MOBILE}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    type="number"
                                    name="Mobile"
                                    value={values.Mobile}
                                    onChange={(ev) => {
                                      setFieldValue(
                                        "Mobile",
                                        removeEmptySpaces(ev.target.value)
                                      );
                                      // console.log("Mobile", values.Mobile);
                                    }}
                                    style={{ alignText: "right" }}
                                    placeholder={"000-000-0000"}
                                    onKeyDown={blockInvalidCharMobile}
                                    className={
                                      "text form-control" +
                                      (errors.Mobile && touched.Mobile
                                        ? " is-invalid"
                                        : "")
                                    }
                                    disabled={refundComplete}
                                  />
                                </Col>
                                <Col sm={4}>
                                  <InlineBottomErrorMessage
                                    name="Mobile"
                                    msg={VALIDNUMBER}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="Email"
                                  column
                                  sm={2}
                                  className={
                                    errors.Email && touched.Email
                                      ? "is-invalid-label fw-bold"
                                      : null
                                  }
                                >
                                  {AUTHORIZEEMAIL}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    type="Email"
                                    name="Email"
                                    value={values.Email}
                                    onKeyDown={(e) => {
                                      if (e.key === " ") {
                                        e.preventDefault();
                                      }
                                    }}
                                    style={{ alignText: "right" }}
                                    className={
                                      "text form-control" +
                                      (errors.Email && touched.Email
                                        ? " is-invalid"
                                        : "")
                                    }
                                    disabled={refundComplete}
                                  />
                                </Col>
                                <Col sm={4}>
                                  <InlineBottomErrorMessage
                                    name="Email"
                                    msg={VALIDEMAIL}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div
                          className="head "
                          style={{
                            marginTop: "18px",
                          }}
                        >
                          <img src={Icon} className="icon" />
                          {"Resident Address"}
                        </div>
                        <hr style={{ marginTop: "22px" }} />
                        <br />
                        <Row className={"fieldstyle"}>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="Address1"
                              column
                              sm={3}
                            >
                              {ADDRESS1}
                            </Label>
                            <Col sm={6}>
                              <Field
                                type="text"
                                name="Address1"
                                value={values.Address1}
                                style={{ alignText: "right" }}
                                className={"text form-control"}
                                maxlength="250"
                                disabled={refundComplete}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className={"fieldstyle"}>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="Address2"
                              column
                              sm={3}
                            >
                              {ADDRESS2}
                            </Label>
                            <Col sm={6}>
                              <Field
                                type="text"
                                name="Address2"
                                value={values.Address2}
                                style={{ alignText: "right" }}
                                className={"text form-control"}
                                maxlength="250"
                                disabled={refundComplete}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right", height: "40px" }}
                              column
                              sm={3}
                            >
                              Suburb / Town
                            </Label>
                            <Col sm={6}>
                              {selectedStreetCountry &&
                              selectedStreetCountry.description ===
                                "Australia" ? (
                                <>
                                  <SingleSelect
                                    isDisabled={refundComplete}
                                    name="SubUrb"
                                    placeholder="Select...."
                                    onChange={(selected) => {
                                      setFieldValue(
                                        "postcode",
                                        selected.postcode
                                      );
                                      setFieldValue(
                                        "streetsuburb",
                                        selected.id
                                      );
                                      setFieldValue(
                                        "StatedId",
                                        selected.stateId
                                      );
                                      setSelectedStreetState(
                                        stateList.filter(
                                          (ob) =>
                                            ob.state_id === selected.stateId
                                        )
                                      );

                                      setSelectedStreetSuburb({
                                        ...selected,
                                        label: selected.value,
                                      });
                                    }}
                                    options={suburbList}
                                    value={selectedStreetSuburb}
                                  />
                                  <ErrorMessage
                                    name="SubUrb"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </>
                              ) : (
                                <>
                                  <Field
                                    name="streetsuburb"
                                    type="text"
                                    value={values.streetsuburb}
                                    onChange={handleChange}
                                    className={
                                      "form-control" +
                                      (errors.rep_suburb && touched.rep_suburb
                                        ? " is-invalid"
                                        : "")
                                    }
                                    maxLength="250"
                                    disabled={refundComplete}
                                  />
                                  <ErrorMessage
                                    name="rep_suburb"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </>
                              )}
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right", height: "40px" }}
                              htmlFor="StatedId"
                              column
                              sm={3}
                            >
                              State
                            </Label>
                            <Col sm={6}>
                              {selectedStreetCountry &&
                              selectedStreetCountry.description ===
                                "Australia" ? (
                                <>
                                  <SingleSelect
                                    isDisabled={refundComplete}
                                    name="state"
                                    placeholder="Select...."
                                    onChange={(selected) => {
                                      setFieldValue(
                                        "StatedId",
                                        selected.state_id
                                      );
                                      setSelectedStreetState(selected);
                                      setSelectedStreetSuburb(null);
                                      setsuburbList(
                                        CpysuburbList.filter(
                                          (val) =>
                                            val.stateId === selected.state_id
                                        )
                                      );
                                      setFieldValue("SubUrb", "");
                                      setFieldValue("postcode", "");
                                    }}
                                    options={stateList}
                                    value={
                                      selectedStreetState
                                        ? selectedStreetState
                                        : ""
                                    }
                                    // defaultValue={selectedStreetState}
                                  />
                                </>
                              ) : (
                                <>
                                  <Field
                                    name="streetState"
                                    type="text"
                                    value={values.streetState}
                                    onChange={handleChange}
                                    className={"text form-control"}
                                    maxLength="250"
                                    disabled={refundComplete}
                                  />
                                  <ErrorMessage
                                    name="rep_state_name"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </>
                              )}
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="postcode"
                              column
                              sm={3}
                            >
                              {POSTCODE}
                            </Label>
                            <Col sm={6}>
                              <input
                                disabled={refundComplete}
                                name="postcode"
                                type="text"
                                value={values.postcode}
                                maxLength={
                                  selectedStreetCountry &&
                                  selectedStreetCountry.label &&
                                  selectedStreetCountry.label.toLowerCase() ===
                                    "australia"
                                    ? 4
                                    : 10
                                }
                                //onBlur={handleBlur}
                                // onChange={handleChange}
                                onChange={(ev) => {
                                  setFieldValue(
                                    "postcode",
                                    removeEmptySpaces(ev.target.value)
                                  );
                                }}
                                autoComplete="off"
                                className={"text form-control"}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right", height: "40px" }}
                              htmlFor="acn"
                              column
                              sm={3}
                            >
                              Country
                            </Label>
                            <Col sm={6}>
                              <>
                                <SingleSelect
                                  disabled={refundComplete}
                                  name="country"
                                  onChange={(selected) => {
                                    setFieldValue("countryId", selected.id);
                                    setSelectedStreetCountry(selected);
                                    setFieldValue("postcode", "");
                                    setFieldValue("Address1", "");
                                    setFieldValue("Address2", "");
                                    setFieldValue("streetState", "");
                                    setFieldValue("streetsuburb", "");
                                    setSelectedStreetState({});
                                    setSelectedStreetSuburb({});
                                    setFieldValue("streetAddressLine1", "");
                                    setFieldValue("streetAddressLine2", "");
                                    setFieldValue("StatedId", 0);
                                    setFieldValue("SubUrb", 0);
                                    if (selected.description === "Australia") {
                                      setsuburbList([...CpysuburbList]);
                                    }
                                  }}
                                  options={countryList}
                                  value={selectedStreetCountry}
                                  defaultValue={selectedStreetCountry}
                                />
                              </>
                              {/* ) : (
                            <></>
                          )} */}
                            </Col>
                          </FormGroup>
                        </Row>
                      </div>
                      <div className="w-100"></div>
                      <div className="col">
                        <div className="head mt-3">
                          <img src={Icon} className="icon" />
                          {"Admission Details"}{" "}
                          <Field
                            className="m-2"
                            type="checkbox"
                            name="IsPre1July2014"
                            disabled={
                              (editData !== undefined && editData.id) ||
                              refundComplete
                                ? true
                                : false
                            }
                            onChange={(val) => {
                              setFieldValue(
                                "IsPre1July2014",
                                val.currentTarget.checked
                              );
                              if (mpirField.DbMPIR !== mpirField.newMPIR) {
                                setMPIR({ ...mpirField, newMPIR: 0 });
                              }
                              setPartLumsumAmount(0);
                              setBond(val.currentTarget.checked);
                            }}
                          />
                          <Label className="h6">{ISPREJULY201}</Label>
                        </div>

                        <hr />
                        <br />
                        <div className="row">
                          <div className="col">
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="IsTransfer"
                                  column
                                  sm={3}
                                  // className="fw-bold"
                                >
                                  {ISTRANSFER + "  "}
                                  <i
                                    className="fa fa-info-circle fa-sm"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      onHandleMessage2(INFO, NOTE, RESIDENTNOTE)
                                    }
                                  ></i>
                                </Label>
                                <Col sm={9}>
                                  <Field
                                    className="m-2"
                                    type="checkbox"
                                    name="IsTransfer"
                                    disabled={refundComplete}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  column
                                  sm={3}
                                  className={
                                    errors.InitialEntryDate &&
                                    touched.InitialEntryDate
                                      ? "is-invalid-label required-field fw-bold"
                                      : values.IsTransfer === true
                                      ? "required-field"
                                      : ""
                                  }
                                >
                                  {INITIALENTRYDATE}
                                </Label>

                                <Col sm={6}>
                                  <InputGroup>
                                    <MuiDatePicker
                                      id="InitialEntryDate"
                                      name="InitialEntryDate"
                                      maxDate={moment().subtract(1, "days")}
                                      disabled={
                                        values.IsTransfer === false ||
                                        refundComplete
                                          ? true
                                          : false
                                      }
                                      className={
                                        "form-control pr-0" +
                                        (errors.InitialEntryDate &&
                                        touched.InitialEntryDate
                                          ? " is-invalid invalidDate"
                                          : "")
                                      }
                                      selectedDate={
                                        (values.InitialEntryDate &&
                                          !values.IsTransfer == false &&
                                          new Date(values.InitialEntryDate)) ||
                                        null
                                      }
                                      error={
                                        touched.InitialEntryDate &&
                                        errors.InitialEntryDate
                                      }
                                      getChangedDate={(val) => {
                                        if (val) {
                                          setFieldValue(
                                            "InitialEntryDate",
                                            val.toJSON()
                                          );
                                        } else {
                                          setFieldValue("InitialEntryDate", "");
                                        }
                                      }}
                                    />
                                  </InputGroup>
                                </Col>
                                <Col sm={2}>
                                  <InlineBottomErrorMessage
                                    name="InitialEntryDate"
                                    msg={errors.InitialEntryDate}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  // htmlFor="AdmissionDate"
                                  column
                                  sm={3}
                                  className={
                                    errors.AdmissionDate &&
                                    touched.AdmissionDate
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {ADMISSIONDATE}
                                </Label>
                                <Col sm={6}>
                                  <InputGroup
                                    style={{
                                      paddingRight: "0px",
                                      backgroundColor: "yellow",
                                    }}
                                  >
                                    <MuiDatePicker
                                      id="AdmissionDate"
                                      name="AdmissionDate"
                                      minDate={
                                        values.IsTransfer
                                          ? values.InitialEntryDate
                                          : values.DOBDate
                                      }
                                      className={
                                        "form-control " +
                                        (errors.AdmissionDate &&
                                        touched.AdmissionDate
                                          ? " is-invalid invalidDate"
                                          : "")
                                      }
                                      selectedDate={
                                        (values.AdmissionDate &&
                                          moment(
                                            values.AdmissionDate
                                          ).format()) ||
                                        null
                                      }
                                      error={
                                        touched.AdmissionDate &&
                                        errors.AdmissionDate
                                      }
                                      getChangedDate={(val) => {
                                        if (val) {
                                          setFieldValue(
                                            "AdmissionDate",
                                            moment(val).format()
                                          );
                                          setAdmissionDate(
                                            moment(val).format()
                                          );

                                          if (
                                            val !== "Invalid date" &&
                                            values.IsPre1July2014
                                          ) {
                                            getMPIR(
                                              moment(val).format("YYYY-MM-DD")
                                            );
                                          }
                                        } else {
                                          setFieldValue("AdmissionDate", "");
                                          setAdmissionDate("");
                                          // setAdmissionDate("");
                                        }
                                      }}
                                      disabled={refundComplete}
                                    />
                                  </InputGroup>
                                </Col>
                                <Col sm={2}>
                                  <InlineBottomErrorMessage
                                    name="AdmissionDate"
                                    msg={errors.AdmissionDate}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                {bond ? (
                                  <Label
                                    style={{ textAlign: "right" }}
                                    htmlFor="caretypeId"
                                    column
                                    sm={3}
                                    className={
                                      touched.CareCategory &&
                                      errors.CareCategory
                                        ? "is-invalid-label required-field fw-bold"
                                        : "required-field"
                                    }
                                  >
                                    {" "}
                                    {CARECATEGORY}
                                  </Label>
                                ) : (
                                  <Label
                                    style={{ textAlign: "right" }}
                                    htmlFor="caretypeId"
                                    column
                                    sm={3}
                                  >
                                    {CARECATEGORY}
                                  </Label>
                                )}

                                <Col sm={6}>
                                  {bond ? (
                                    <SingleSelect
                                      isDisabled={refundComplete}
                                      name="caretypeId"
                                      placeholder="Select...."
                                      onChange={(selected) => {
                                        setSelectedCareTypeCategory({
                                          id: selected.care_type_id,
                                          label: selected.care_type_desc,
                                        });
                                        setFieldValue(
                                          "CareCategory",
                                          selected.care_type_id
                                        );
                                      }}
                                      error={
                                        touched.CareCategory &&
                                        errors.CareCategory
                                          ? true
                                          : false
                                      }
                                      options={careTypeList}
                                      value={selectedCareTypeCategory}
                                      defaultValue={selectedCareTypeCategory}
                                    />
                                  ) : (
                                    <Label
                                      type="text"
                                      name="CareCategory"
                                      placeholder="Permanent"
                                      className={"mt-2"}
                                    >
                                      {permenetCare?.care_type_name
                                        ? Capitalize(
                                            permenetCare?.care_type_name
                                          )
                                        : "Permenant"}
                                    </Label>
                                  )}
                                </Col>
                                <Col sm={3}>
                                  <InlineBottomErrorMessage name="CareCategory" />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="IsExtraService"
                                  column
                                  sm={3}
                                >
                                  {ISEXTRASERVICE}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    disabled={refundComplete}
                                    className="m-2"
                                    type="checkbox"
                                    name="IsExtraService"
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right", height: "40px" }}
                                  htmlFor="facility_id"
                                  column
                                  sm={3}
                                  className={
                                    errors.facility_id && touched.facility_id
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {FACILITY}
                                </Label>
                                <Col sm={6}>
                                  <SingleSelect
                                    isDisabled={refundComplete}
                                    name="facility_id"
                                    placeholder="Select...."
                                    onBlur={(selected) =>
                                      setFieldTouched(
                                        "facility_id",
                                        selected.facility_id
                                      )
                                    }
                                    onChange={(selected) => {
                                      setFieldValue(
                                        "facility_id",
                                        selected.facility_id
                                      );
                                      setSelectedFacility(selected);
                                      localStorage.setItem(
                                        "FacilityId",
                                        selected.facility_id
                                      );
                                    }}
                                    error={
                                      errors.facility_id && touched.facility_id
                                        ? true
                                        : false
                                    }
                                    className={
                                      errors.facility_id ? "is-invalid" : ""
                                    }
                                    options={facilityList}
                                    value={selectedFacility}
                                  />
                                </Col>
                                <Col sm={3}>
                                  <InlineBottomErrorMessage name="facility_id" />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="Record_id"
                                  column
                                  sm={3}
                                  className={
                                    errors.Record_id && touched.Record_id
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {RECORDID}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    type="text"
                                    name="Record_id"
                                    value={values.Record_id}
                                    onChange={(ev) => {
                                      setFieldValue(
                                        "Record_id",
                                        removeEmptySpaces(ev.target.value)
                                      );
                                    }}
                                    style={{ alignText: "right" }}
                                    className={
                                      "text form-control" +
                                      (errors.Record_id && touched.Record_id
                                        ? " is-invalid"
                                        : "")
                                    }
                                    disabled={refundComplete}
                                  />
                                </Col>
                                <Col sm={3}>
                                  <InlineBottomErrorMessage
                                    name="Record_id"
                                    msg={errors.Record_id}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="episodeId"
                                  column
                                  sm={3}
                                >
                                  {"Episode ID"}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    type="text"
                                    name="episodeId"
                                    value={values.episodeId}
                                    style={{ alignText: "right" }}
                                    className={"text form-control"}
                                    disabled
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="clientbillingid"
                                  column
                                  sm={3}
                                  className={
                                    errors.clientbillingid &&
                                    touched.clientbillingid
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {"Client Billing ID"}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    disabled={refundComplete}
                                    type="number"
                                    name="clientbillingid"
                                    value={values.clientbillingid}
                                    style={{ alignText: "right" }}
                                    className={
                                      "text form-control" +
                                      (errors.clientbillingid &&
                                      touched.clientbillingid
                                        ? " is-invalid"
                                        : "")
                                    }
                                    onChange={(ev) => {
                                      setFieldValue(
                                        "clientbillingid",
                                        removeEmptySpaces(ev.target.value)
                                      );
                                    }}
                                    onKeyDown={blockInvalidChar}
                                    maxLength={10}
                                    oninput={
                                      (values.clientbillingid = values.clientbillingid.slice(
                                        0,
                                        19
                                      ))
                                    }
                                  />
                                </Col>
                                <Col sm={3}>
                                  <InlineBottomErrorMessage
                                    name="clientbillingid"
                                    msg={errors.clientbillingid}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                          </div>
                        </div>
                      </div>
                      {!values.IsPre1July2014 ? (
                        <div className="col"></div>
                      ) : (
                        <div className="col" style={{ marginTop: "0.3rem" }}>
                          <div className="head mt-3">
                            <img src={Icon} className="icon" />
                            {"Bond Details"}
                          </div>
                          <hr />
                          <br />
                          <div style={{ marginLeft: "-113px" }}>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Col
                                  sm={3}
                                  style={{
                                    paddingTop: "7px",
                                    textAlign: "right",
                                  }}
                                >
                                  <Label
                                    style={{ textAlign: "right" }}
                                    column
                                    className={
                                      errors.BondAmount &&
                                      touched.BondAmount &&
                                      !newAmount
                                        ? "is-invalid-label required-field fw-bold"
                                        : "required-field"
                                    }
                                  >
                                    {BONDAMOUNT}
                                  </Label>
                                </Col>

                                <span
                                  style={{
                                    width: "0.01px",
                                    marginLeft: "-22px",
                                    marginTop: "7px",
                                  }}
                                >
                                  <i
                                    className="fa fa-info-circle fa-sm"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      onHandleMessage(
                                        INFO,
                                        BONDAMOUNTHEAD,
                                        BONDAMOUNTBODY.TEXT
                                      )
                                    }
                                  ></i>
                                </span>

                                <Col sm={6} style={{ marginLeft: "-2px" }}>
                                  <NumberFormat
                                    disabled={refundComplete}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    placeholder={"$0.00"}
                                    allowNegative={false}
                                    // maxLength={
                                    //   editData && editData.length > 0
                                    //     ? newAmount === 0
                                    //       ? 14
                                    //       : 16
                                    //     : newAmount === 0
                                    //     ? 14
                                    //     : 17
                                    // }
                                    name="BondAmount"
                                    id="BondAmount"
                                    style={{ alignText: "right" }}
                                    value={newAmount ? newAmount : ""}
                                    onBlur={handleBlur}
                                    onValueChange={(values) => {
                                      const { floatValue } = values;
                                      if (floatValue) {
                                        setNewAmount(floatValue);
                                        setFieldValue("BondAmount", floatValue);
                                        let month =
                                          (floatValue * 10) / 100 / 12;
                                        if (month < 197) {
                                          setMonthlyAmount(197);
                                        } else if (month > 381) {
                                          setMonthlyAmount(381);
                                        } else {
                                          setMonthlyAmount(month);
                                        }
                                      } else {
                                        setNewAmount(0);
                                        setFieldValue("BondAmount", floatValue);
                                      }
                                    }}
                                    fixedDecimalScale={2}
                                    decimalScale={2}
                                    className={
                                      "text form-control " +
                                      (errors.BondAmount &&
                                      touched.BondAmount &&
                                      !newAmount
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                </Col>
                                <Col sm={3}>
                                  {!newAmount ? (
                                    <InlineBottomErrorMessage
                                      name="BondAmount"
                                      msg={
                                        "Required field & should be greater than 0"
                                      }
                                    />
                                  ) : null}
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right", height: "40px" }}
                                  // htmlFor="BondPaymentTypeId"
                                  column
                                  sm={3}
                                >
                                  {BONDPAYMENTTYPE}
                                </Label>
                                <Col sm={6}>
                                  <SingleSelect
                                    isDisabled={refundComplete}
                                    name="BondPaymentTypeId"
                                    placeholder="Select...."
                                    onBlur={(selected) =>
                                      setFieldTouched(
                                        "BondPaymentTypeId",
                                        selected.id
                                      )
                                    }
                                    onChange={(selected) => {
                                      setSelectedPaymentTypeList(selected);
                                      setFieldValue(
                                        "BondPaymentTypeId",
                                        selected.id
                                      );
                                    }}
                                    error={
                                      errors.BondPaymentTypeId ? true : false
                                    }
                                    options={paymentTypeList}
                                    value={selectedPaymentTypeList}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>

                            {selectedPaymentTypeList?.name ===
                            "lumpsum_periodic" ? (
                              <Row className={"fieldstyle"}>
                                <FormGroup row>
                                  <Label
                                    style={{ textAlign: "right" }}
                                    column
                                    sm={3}
                                    className={
                                      errors.partLumsumAmount &&
                                      touched.partLumsumAmount
                                        ? "is-invalid-label  fw-bold"
                                        : ""
                                    }
                                  >
                                    {"Part Lumpsum Amount"}
                                  </Label>
                                  <Col sm={6}>
                                    <NumberFormat
                                      disabled={refundComplete}
                                      thousandSeparator={true}
                                      prefix={"$"}
                                      placeholder={"$0.00"}
                                      allowNegative={false}
                                      // maxLength={
                                      //   PartLumsumAmount === 0 ? 14 : 16
                                      // }
                                      name="partLumsumAmount"
                                      id="partLumsumAmount"
                                      style={{ alignText: "right" }}
                                      value={
                                        PartLumsumAmount ? PartLumsumAmount : ""
                                      }
                                      onBlur={handleBlur}
                                      onValueChange={(values) => {
                                        const { floatValue } = values;
                                        if (floatValue) {
                                          setFieldValue(
                                            "partLumsumAmount",
                                            floatValue
                                          );
                                          setPartLumsumAmount(floatValue);
                                          // if (floatValue > newAmount) {
                                          //   // setPartLumsumAmount(newAmount);
                                          //   setPartLumsumAmount(floatValue);
                                          // } else {
                                          //   setPartLumsumAmount(floatValue);
                                          // }
                                        } else {
                                          setFieldValue("partLumsumAmount", 0);
                                          setPartLumsumAmount(0);
                                        }
                                      }}
                                      fixedDecimalScale={2}
                                      decimalScale={2}
                                      className={
                                        "text form-control " +
                                        (errors.partLumsumAmount &&
                                        touched.partLumsumAmount
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                  </Col>
                                  <Col sm={3} className="mt-2">
                                    <InlineBottomErrorMessage
                                      name="partLumsumAmount"
                                      msg={errors.partLumsumAmount}
                                      // msg={"should be less than Bond Amount"}
                                    />
                                  </Col>
                                </FormGroup>
                              </Row>
                            ) : null}

                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  column
                                  sm={3}
                                  className={
                                    errors.MPIR && touched.MPIR
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {MPIR}
                                </Label>
                                <Col sm={6}>
                                  <NumberFormat
                                    disabled={refundComplete}
                                    suffix={"%"}
                                    placeholder={"0.00%"}
                                    allowNegative={false}
                                    // maxLength={
                                    //   editData && editData.length > 0
                                    //     ? mpirField.newMPIR === 0
                                    //       ? 14
                                    //       : 16
                                    //     : mpirField === 0
                                    //     ? 14
                                    //     : 17
                                    // }
                                    maxLength={6}
                                    name="MPIR"
                                    id="MPIR"
                                    // disabled={true}
                                    style={{ alignText: "right" }}
                                    value={
                                      mpirField.newMPIR ? mpirField.newMPIR : ""
                                    }
                                    onBlur={handleBlur}
                                    onValueChange={(values) => {
                                      const { floatValue } = values;
                                      if (floatValue) {
                                        setFieldValue("MPIR", floatValue);
                                        setMPIR({
                                          ...mpirField,
                                          newMPIR: floatValue,
                                        });
                                        // setFieldValue("MPIR", floatValue);
                                        // if (floatValue > mpirField.DbMPIR) {
                                        //   setMPIR({
                                        //     ...mpirField,
                                        //     newMPIR: floatValue, //mpirField.DbMPIR,
                                        //   });

                                        //   // errors.MPIR = "error";
                                        // } else {
                                        //   // delete errors.MPIR;
                                        //   setMPIR({
                                        //     ...mpirField,
                                        //     newMPIR: floatValue,
                                        //   });
                                        // }
                                      } else {
                                        setMPIR({
                                          ...mpirField,
                                          newMPIR: 0,
                                        });
                                        setFieldValue("MPIR", 0);
                                      }
                                    }}
                                    d
                                    fixedDecimalScale={2}
                                    decimalScale={2}
                                    className={
                                      "text form-control " +
                                      (errors.MPIR && touched.MPIR
                                        ? // &&
                                          // !mpirField.newMPIR
                                          "required-field is-invalid"
                                        : "required-field")
                                    }
                                  />
                                </Col>
                                <Col sm={3} className="mt-2">
                                  <InlineBottomErrorMessage
                                    name="MPIR"
                                    msg={`Should be less than ${mpirField.DbMPIR}%`}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  // htmlFor="InstOneDate"
                                  className={
                                    touched.InstOneDate && errors.InstOneDate
                                      ? "is-invalid-label  fw-bold"
                                      : ""
                                  }
                                  column
                                  sm={3}
                                >
                                  {FIRSTINSTALLMENT}
                                </Label>
                                <Col sm={6}>
                                  <InputGroup>
                                    <MuiDatePicker
                                      id="InstOneDate"
                                      name="InstOneDate"
                                      className={"text form-control"}
                                      minDate={admissionDate}
                                      selectedDate={
                                        (values.InstOneDate &&
                                          new Date(values.InstOneDate)) ||
                                        ""
                                      }
                                      error={
                                        touched.InstOneDate &&
                                        errors.InstOneDate
                                      }
                                      getChangedDate={(val) => {
                                        if (val) {
                                          setFieldValue(
                                            "InstOneDate",

                                            val.toJSON()
                                          );
                                        } else {
                                          setFieldValue("InstOneDate", "");
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
                                  <InlineBottomErrorMessage
                                    name="InstOneDate"
                                    msg={errors.InstOneDate}
                                  />
                                </Col>
                                <Col sm={3}>
                                  {/* <Field
                                  type="text"
                                  name="InstOneAmount"
                                  value={values.InstOneAmount}
                                  style={{ alignText: "right" }}
                                  className={"text form-control"}
                                /> */}
                                  <NumberFormat
                                    disabled={refundComplete}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    placeholder={"$0.00"}
                                    allowNegative={false}
                                    // maxLength={
                                    //   editData && editData.length > 0
                                    //     ? firstInstallmentAmount === 0
                                    //       ? 14
                                    //       : 16
                                    //     : firstInstallmentAmount === 0
                                    //     ? 14
                                    //     : 17
                                    // }
                                    name="InstOneAmount"
                                    id="InstOneAmount"
                                    style={{ alignText: "right" }}
                                    value={
                                      firstInstallmentAmount
                                        ? firstInstallmentAmount
                                        : ""
                                    }
                                    onValueChange={(values) => {
                                      const { floatValue } = values;
                                      if (floatValue) {
                                        setFirstInstallmentAmount(floatValue);
                                      } else {
                                        setFirstInstallmentAmount(0);
                                      }
                                    }}
                                    fixedDecimalScale={2}
                                    decimalScale={2}
                                    className={
                                      "text form-control " +
                                      (errors.InstOneAmount &&
                                      touched.InstOneAmount &&
                                      firstInstallmentAmount > newAmount
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  {firstInstallmentAmount > newAmount ? (
                                    <InlineBottomErrorMessage
                                      name="InstOneAmount"
                                      msg={"Amount is greater than Bond Amount"}
                                    />
                                  ) : null}
                                </Col>
                              </FormGroup>
                            </Row>

                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  // htmlFor="InstTwoDate"
                                  className={
                                    touched.InstTwoDate && errors.InstTwoDate
                                      ? "is-invalid-label  fw-bold"
                                      : ""
                                  }
                                  column
                                  sm={3}
                                >
                                  {SECONDINSTALLMENT}
                                </Label>
                                <Col sm={6}>
                                  <InputGroup>
                                    <MuiDatePicker
                                      id="InstTwoDate"
                                      name="InstTwoDate"
                                      className={"text form-control"}
                                      minDate={values.InstOneDate}
                                      selectedDate={
                                        values.InstTwoDate
                                          ? new Date(values.InstTwoDate)
                                          : ""
                                      }
                                      error={
                                        touched.InstTwoDate &&
                                        errors.InstTwoDate
                                      }
                                      getChangedDate={(val) => {
                                        if (val) {
                                          setFieldValue(
                                            "InstTwoDate",
                                            val.toJSON()
                                          );
                                        } else {
                                          setFieldValue("InstTwoDate", "");
                                        }
                                      }}
                                    />
                                    <InlineBottomErrorMessage
                                      name="InstTwoDate"
                                      msg={errors.InstTwoDate}
                                    />
                                  </InputGroup>
                                </Col>

                                <Col sm={3}>
                                  {/* <Field
                                  type="text"
                                  name="InstTwoAmount"
                                  value={values.InstTwoAmount}
                                  style={{ alignText: "right" }}
                                  className={"text form-control"}
                                /> */}
                                  <NumberFormat
                                    disabled={refundComplete}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    placeholder={"$0.00"}
                                    allowNegative={false}
                                    // maxLength={
                                    //   editData && editData.length > 0
                                    //     ? secondInstallmentAmount === 0
                                    //       ? 14
                                    //       : 16
                                    //     : secondInstallmentAmount === 0
                                    //     ? 14
                                    //     : 17
                                    // }
                                    name="InstTwoAmount"
                                    id="InstTwoAmount"
                                    style={{ alignText: "right" }}
                                    value={
                                      secondInstallmentAmount
                                        ? secondInstallmentAmount
                                        : ""
                                    }
                                    onValueChange={(values) => {
                                      const { floatValue } = values;
                                      if (floatValue) {
                                        setSecondInstallmentAmount(floatValue);
                                      } else {
                                        setSecondInstallmentAmount(0);
                                      }
                                    }}
                                    fixedDecimalScale={2}
                                    decimalScale={2}
                                    className={
                                      "text form-control " +
                                      (errors.InstTwoAmount &&
                                      touched.InstTwoAmount &&
                                      secondInstallmentAmount > newAmount
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  {secondInstallmentAmount > newAmount ? (
                                    <InlineBottomErrorMessage
                                      name="InstTwoAmount"
                                      msg={"Amount is greater than Bond Amount"}
                                    />
                                  ) : null}
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="RetentionMonthsTaken"
                                  column
                                  sm={3}
                                >
                                  {RETENTIONMONTHSTAKEN}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    type="text"
                                    name="RetentionMonthsTaken"
                                    value={values.RetentionMonthsTaken}
                                    style={{ alignText: "right" }}
                                    className={"text form-control"}
                                    disabled={
                                      values.IsTransfer === false ||
                                      refundComplete
                                        ? true
                                        : false
                                    }
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="RetentionMonths"
                                  column
                                  sm={3}
                                  className={
                                    errors.RetentionMonths &&
                                    touched.RetentionMonths
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {"Months of Retention Remaining"}
                                </Label>
                                <Col sm={6}>
                                  <Field
                                    disabled={refundComplete}
                                    type="number"
                                    name="RetentionMonths"
                                    value={values.RetentionMonths}
                                    style={{ alignText: "right" }}
                                    className={
                                      "form-control fontsize-14" +
                                      (errors.RetentionMonths &&
                                      touched.RetentionMonths
                                        ? " is-invalid"
                                        : "")
                                    }
                                    onKeyDown={blockInvalidChar}
                                  />
                                </Col>
                                <Col sm={3}>
                                  <InlineBottomErrorMessage name="RetentionMonths" />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right" }}
                                  htmlFor="MonthlyRetention"
                                  column
                                  sm={3}
                                  className={
                                    errors.MonthlyRetention &&
                                    touched.MonthlyRetention &&
                                    !monthlyAmount
                                      ? "is-invalid-label required-field fw-bold"
                                      : "required-field"
                                  }
                                >
                                  {"Monthly Amount"}
                                </Label>
                                <Col sm={6}>
                                  <NumberFormat
                                    disabled={refundComplete}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    placeholder={"$0.00"}
                                    allowNegative={false}
                                    // maxLength={
                                    //   editData && editData.length > 0
                                    //     ? monthlyAmount === 0
                                    //       ? 14
                                    //       : 16
                                    //     : monthlyAmount === 0
                                    //     ? 14
                                    //     : 17
                                    // }
                                    name="MonthlyRetention"
                                    id="MonthlyRetention"
                                    style={{ alignText: "right" }}
                                    value={monthlyAmount ? monthlyAmount : ""}
                                    onBlur={handleBlur}
                                    onValueChange={(values) => {
                                      const { floatValue } = values;
                                      if (floatValue) {
                                        setMonthlyAmount(floatValue);
                                      } else {
                                        setMonthlyAmount(0);
                                      }
                                    }}
                                    fixedDecimalScale={2}
                                    decimalScale={2}
                                    className={
                                      "text form-control " +
                                      (errors.MonthlyRetention &&
                                      touched.MonthlyRetention &&
                                      !monthlyAmount
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                </Col>
                                <Col sm={3}>
                                  {!monthlyAmount ? (
                                    <InlineBottomErrorMessage
                                      name="MonthlyRetention"
                                      msg={
                                        "Required field & should be greater than 0"
                                      }
                                    />
                                  ) : null}
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right", height: "40px" }}
                                  htmlFor="InterestType"
                                  column
                                  sm={3}
                                >
                                  {INTERESTTYPE}
                                </Label>
                                <Col sm={6}>
                                  <SingleSelect
                                    isDisabled={refundComplete}
                                    name="InterestType"
                                    placeholder="Select...."
                                    onBlur={(selected) =>
                                      setFieldTouched(
                                        "InterestType",
                                        selected.id
                                      )
                                    }
                                    onChange={(selected) => {
                                      setFieldValue(
                                        "InterestType",
                                        selected.id
                                      );
                                      setSelectedEopInterestMethod(selected);
                                    }}
                                    options={eopInterestMethod}
                                    value={selectedEopInterestMethod}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                            <Row className={"fieldstyle"}>
                              <FormGroup row>
                                <Label
                                  style={{ textAlign: "right", height: "40px" }}
                                  htmlFor="RetentionType"
                                  column
                                  sm={3}
                                >
                                  {RETENTIONTYPE}
                                </Label>
                                <Col sm={6}>
                                  <SingleSelect
                                    isDisabled={refundComplete}
                                    name="RetentionType"
                                    placeholder="Select...."
                                    onBlur={(selected) =>
                                      setFieldTouched(
                                        "RetentionType",
                                        selected.id
                                      )
                                    }
                                    onChange={(selected) => {
                                      setFieldValue(
                                        "RetentionType",
                                        selected.id
                                      );
                                      setSelectedEopRetentionMethod(selected);
                                    }}
                                    options={eopRetentionMethod}
                                    value={selectedEopRetentionMethod}
                                  />
                                </Col>
                              </FormGroup>
                            </Row>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </Form>
              </Page>
            )}
          </>
        )}
      </Formik>
      {loading || editLoading ? (
        <Loader></Loader>
      ) : (
        <div
          className={
            activeStep === 0
              ? "zeroTab"
              : activeStep === 1
              ? "firstTab"
              : activeStep === 2
              ? "secondTab"
              : activeStep === 3
              ? "thirdTab"
              : activeStep === 4
              ? "fourthTab"
              : ""
          }
          style={{
            backgroundColor: refundComplete ? "#d3d3d378" : "",
            pointerEvents: refundComplete ? "none" : "",
          }}
        >
          {activeStep === 0 ? (
            <ViewResidentRepresentative
              representativeDetailsCallback={representativeDetailsCallback}
              residentRepresentativeModel={residentRepresentativeModel}
              stateCountrySubrb={{
                subrb: [...CpysuburbList],
                country: countryList,
                states: stateList,
                titles: titles,
              }}
              residentId={residentId}
              handlIsUnSavedData={handlIsUnSavedData}
            ></ViewResidentRepresentative>
          ) : activeStep === 1 ? (
            !bond ? (
              <ViewPaymentDetails
                refundComplete={refundComplete}
                residentId={residentId}
                admissionDate={admissionDate}
                isCancelling={isCancelling}
                // handleCancelState={handleCancel}
                handlIsUnSavedData={handlIsUnSavedData}
                isUnsavedData={isUnsavedData}
                residentActionType={type}
                activeStep={activeStep}
                navigationToView={navigationToView}
              ></ViewPaymentDetails>
            ) : (
              <ViewResidentFees
                residentFeesCallaback={residentFeesCallaback}
                flag={feesFormSubmitting}
                residentId={residentId}
                selectedFacility={selectedFacility}
                refundComplete={refundComplete}
                isExtra={isExtra}
                editDataId={editData && editData.id}
                getValueOfFacility={getValueOfFacility}
                commingFacilities={commingFacilities}
                residentActionType={type}
                callbackHandleSave={handlIsUnSavedData}
                isCancelling={isCancelling}
                navigationToView={navigationToView}
              ></ViewResidentFees>
            )
          ) : activeStep === 2 ? (
            !bond ? (
              <ViewResidentFees
                residentFeesCallaback={residentFeesCallaback}
                flag={feesFormSubmitting}
                residentId={residentId}
                selectedFacility={selectedFacility}
                refundComplete={refundComplete}
                isExtra={isExtra}
                editDataId={editData && editData.id}
                getValueOfFacility={getValueOfFacility}
                commingFacilities={commingFacilities}
                residentActionType={type}
                // handleCancelState={handleCancel}
                callbackHandleSave={handlIsUnSavedData}
                isCancelling={isCancelling}
                navigationToView={navigationToView}
              ></ViewResidentFees>
            ) : (
              <BondTabs
                residentId={residentId}
                admissionDate={admissionDate}
                editDataId={editData && editData.id}
                isCancelling={isCancelling}
                continueApiCall={continueApiCall}
                isUnsavedData={isUnsavedData}
                handlIsUnSavedData={handlIsUnSavedData}
                handleCancelFalse={handleCancelFalse}
                residentActionType={type}
              ></BondTabs>
            )
          ) : activeStep === 3 ? (
            bond ? (
              <NonBondsRefunds
                isRefundTab={isRefundTab}
                isBond={true}
                AddResidentClickedScreen={AddResidentClickedScreen}
                isRefundTabContinue={isRefundTabContinue}
                refundComplete={refundComplete}
                checkIsFinalized={checkIsFinalized}
                editDataId={editData && editData.id}
                activeStep={activeStep}
                handlIsUnSavedData={handlIsUnSavedData}
                callbackIsUnsavedData={callbackIsUnsavedData}
                isCancelling={isCancelling}
                navigationToView={navigationToView}
                handleSaveExit={handleSaveExit}
                admissionDate={admissionDate}
              />
            ) : (
              <ReceiptsDeduction
                residentId={residentId}
                // getHeldByGovernmentChange={getHeldByGovernmentChange}
                heldByGovernmentValue={heldByGovernmentValue}
                isContinue={isContinue}
                admissionDate={admissionDate}
                refundComplete={refundComplete}
                isCancelling={isCancelling}
                // handleCancelState={handleCancel}
                handleCancelFalse={handleCancelFalse}
                handlIsUnSavedData={handlIsUnSavedData}
                isUnsavedData={isUnsavedData}
                continueApiCall={continueApiCall}
                ResidentActionType={type}
                heldByGovernmentSaved={heldByGovernmentSaved}
                navigationToView={navigationToView}
              ></ReceiptsDeduction>
            )
          ) : !bond && activeStep == 4 ? (
            <NonBondsRefunds
              isRefundTab={isRefundTab}
              isBond={false}
              AddResidentClickedScreen={AddResidentClickedScreen}
              isRefundTabContinue={isRefundTabContinue}
              refundComplete={refundComplete}
              checkIsFinalized={checkIsFinalized}
              editDataId={editData && editData.id}
              handleCancelFalse={handleCancelFalse}
              activeStep={activeStep}
              handlIsUnSavedData={handlIsUnSavedData}
              callbackIsUnsavedData={callbackIsUnsavedData}
              isCancelling={isCancelling}
              navigationToView={navigationToView}
              isSaveAndExit={isSaveAndExit}
              handleSaveExit={handleSaveExit}
              admissionDate={admissionDate}
            />
          ) : bond && activeStep == 3 ? (
            <NonBondsRefunds
              isRefundTab={isRefundTab}
              AddResidentClickedScreen={AddResidentClickedScreen}
              isBond={true}
              isRefundTabContinue={isRefundTabContinue}
              refundComplete={refundComplete}
              checkIsFinalized={checkIsFinalized}
              editDataId={editData && editData.id}
              activeStep={activeStep}
              handlIsUnSavedData={handlIsUnSavedData}
              residentActionType={type}
              callbackIsUnsavedData={callbackIsUnsavedData}
              isCancelling={isCancelling}
              navigationToView={navigationToView}
              isSaveAndExit={isSaveAndExit}
              handleSaveExit={handleSaveExit}
              admissionDate={admissionDate}
            />
          ) : (
            <NonBondsRefunds
              isRefundTab={isRefundTab}
              isBond={true}
              isRefundTabContinue={isRefundTabContinue}
              AddResidentClickedScreen={AddResidentClickedScreen}
              refundComplete={refundComplete}
              checkIsFinalized={checkIsFinalized}
              editDataId={editData && editData.id}
              activeStep={activeStep}
              handlIsUnSavedData={handlIsUnSavedData}
              residentActionType={type}
              callbackIsUnsavedData={callbackIsUnsavedData}
              isCancelling={isCancelling}
              navigationToView={navigationToView}
              isSaveAndExit={isSaveAndExit}
              handleSaveExit={handleSaveExit}
              admissionDate={admissionDate}
            />
          )}
        </div>
      )}
    </>
  );
};
export default AddResident;
