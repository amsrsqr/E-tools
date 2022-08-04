import React, { useState, useEffect } from "react";
import { Button, Input, Row, UncontrolledTooltip, Col } from "reactstrap";
import Loader from "../../../components/Loader";
import ReactTableImportCSV from "../../../components/ReactTableImportCSV";
import SuccessAlert from "../../../components/SuccessAlert";
import MuiDatePicker from "../../../components/DatePicker/MaterialUi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { GoAlert } from "react-icons/go";
import commonServices from "../../../services/Common/common.services";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
import Select from "react-select";
import { Formik } from "formik";
import importCSV from "../../../services/Resident/importCSV.service";
import moment from "moment";
import { findPos, Get_Offset_From_CurrentView } from "../../../utils/Strings";

const MapCSVFields = ({
  callSave,
  callBackActiveStep,
  maplist,
  uniqueId,
  residentType,
}) => {
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState(maplist);
  const [type, setType] = useState();
  const [
    showDeleteConfirmationModelAlert,
    setShowDeleteConfirmationModelAlert,
  ] = useState(false);
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [itemForDelete, setItemForDelete] = useState({});
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [careTypeList, setCareTypeList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [suburbList, setsuburbList] = useState([]);
  const [titles, setTitles] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [recoveryList, setRecoveryList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [data, setData] = React.useState(maplist);
  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [uniqueGuid, setUniqueGuid] = useState(uniqueId);
  const [totalError, setTotalError] = useState(0);
  const [activeError, setActiveError] = useState(0);
  const [column, setColumn] = useState({
    SelectedTitle: { value: 1, label: "Title" },
    SelectedFirstName: { value: 2, label: "First Name" },
    SelectedLastName: { value: 3, label: "Last Name" },
    SelectedAddress: { value: 4, label: "Address" },

    SelectedSuburb: { value: 5, label: "Suburb" },
    SelectedPostcode: { value: 6, label: "Post code" },
    SelectedState: { value: 7, label: "State" },
    SelectedDateofBirth: { value: 8, label: "Date of Birth" },
    SelectedAdmissionDate: { value: 9, label: "Admission Date" },
    SelectedInitialAdmissionDate: {
      value: 10,
      label: "Initially Entered Aged Care",
    },
    SelectedCareType: { value: 11, label: "Care Type" },
    SelectedExtraService: { value: 12, label: "Extra Service" },
    SelectedFacility: { value: 13, label: "Facility" },
    SelectedResidentId: { value: 14, label: "Resident Id" },
    SelectedClientBillingId: { value: 15, label: "Client Billing Id" },
    SelectedProjectedPaymentDecisionDate: {
      value: 16,
      label: " Projected Payment Decision Date (Admission Date+28 days)",
    },
    SelectedTotalAgreedAccomodationPrice: {
      value: 17,
      label: "Total Agreed Accomodation Price",
    },
    SelectedPriceFormat: { value: 18, label: "Price Format" },
    SelectedPayment: { value: 19, label: "Payment Type" },
    SelectedMpir: { value: 20, label: "MPIR" },
    SelectedAgreedRADRACPortion: {
      value: 21,
      label: "Agreed RAD/RAC Portion",
    },
    SelectedDrawdown: { value: 22, label: "Drawdown" },
    SelectedRecovery: { value: 23, label: "Recovery" },
    SelectedCategory: { value: 24, label: "Category" },
    SelectedAgreedRADRACPaid: { value: 25, label: "Agreed RAD/RAC Paid" },
    SelectedTotalRADRACTopUp: { value: 26, label: "Total RAD/RAC top-up" },
    SelectedExtraServiceFeesDeducted: {
      value: 27,
      label: "Extra Service Fees Deducted",
    },
    SelectedCapitalisedCareFeesDeducted: {
      value: 28,
      label: "Capitalised CareFees Deducted",
    },
    SelectedAdditionalServiceFeesDeducted: {
      value: 29,
      label: "Additional ServiceFees Deducted",
    },
    SelectedDapDacCharge: { value: 30, label: "DAP/DAC Charge" },
    SelectedDapDacChargeReceipt: { value: 31, label: "DAP/DAC Charge Receipt" },
    SelectedDapDacDeduction: { value: 32, label: "DAP/DAC Charge Deduction" },
    SelectedBalance: { value: 33, label: "Balance" },
  });
  const [selectedId, setSelectedId] = React.useState(-1);
  const [columnStyle, setColumnStyle] = React.useState(-1);
  const [errorList, setErrorList] = useState([]);
  const [newKey, setNewKey] = useState();

  const columnList = [
    { value: 1, label: "Title" },
    { value: 2, label: "First Name" },
    { value: 3, label: "Last Name" },
    { value: 4, label: "Address" },

    { value: 5, label: "Suburb" },
    { value: 6, label: "Post code" },
    { value: 7, label: "State" },
    { value: 8, label: "Date of Birth" },
    { value: 9, label: "Admission Date" },
    { value: 10, label: "Initially Entered Aged Care" },
    { value: 11, label: "Care Type" },
    { value: 12, label: "Extra Service" },
    { value: 13, label: "Facility" },
    { value: 14, label: "Resident Id" },
    { value: 15, label: "Client Billing Id" },
    {
      value: 16,
      label: " Projected Payment Decision Date (Admission Date+28 days)",
    },
    { value: 17, label: "Total Agreed Accomodation Price" },
    { value: 18, label: "Price Format" },
    { value: 19, label: "Payment Type" },
    { value: 20, label: "MPIR" },
    { value: 21, label: "Agreed RAD/RAC Portion" },
    { value: 22, label: "Drawdown" },
    { value: 23, label: "Recovery" },
    { value: 24, label: "Category" },
    { value: 25, label: "Agreed RAD/RAC Paid" },
    { value: 26, label: "Total RAD/RAC top-up" },
    { value: 27, label: "Extra Service Fees Deducted" },
    { value: 28, label: "Capitalised CareFees Deducted" },
    { value: 29, label: "Additional ServiceFees Deducted" },
    { value: 30, label: "DAP/DAC Charge" },
    { value: 31, label: "DAP/DAC Charge Receipt" },
    { value: 32, label: "DAP/DAC Charge Deduction" },
    { value: 33, label: "Balance" },
  ];

  useEffect(() => {
    console.log(residentType, "hahahaha");
  }, [residentType]);

  useEffect(() => {
    if (callSave) {
      saveDataCheckValidation();
    }
  }, [callSave]);

  useEffect(() => {
    setData(maplist);
    getAllData();
  }, [maplist]);

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  useEffect(() => {
    getTotalError();
  }, [data]);

  const getTotalError = () => {
    let totalErrors = 0;
    let tmperrArray = [];
    data.map((z, i) => {
      totalErrors =
        z.titleIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "title",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.firstNameError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "firstName",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.lastNameError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({ column: "lastName", row: i, isActive: false }))
          : totalErrors;

      totalErrors =
        z.suburbIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "suburb",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.stateIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "state",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.dateOfBirthError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "dateOfBirth",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.admissionDateError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "admissionDate",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.initiallyEnteredAgedCareError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "initiallyEnteredAgedCare",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.careTypeIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "careType",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.facilityError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({ column: "facility", row: i, isActive: false }))
          : totalErrors;

      totalErrors =
        z.residentIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "residentId",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.paymentMethodIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "paymentType",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.recoveryTypeIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({ column: "recovery", row: i, isActive: false }))
          : totalErrors;

      totalErrors =
        z.supportedCategoryIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "category",
              row: i,
              isActive: false,
            }))
          : totalErrors;

      totalErrors =
        z.clientBillingIdError === "1"
          ? (totalErrors + 1,
            tmperrArray.push({
              column: "clientBillingId",
              row: i,
              isActive: false,
            }))
          : totalErrors;
    });
    // console.log("error called", totalErrors);
    console.log("TotalError called", tmperrArray);
    //debugger;
    if (tmperrArray && tmperrArray.length > 0) {
      setActiveError(1);
      tmperrArray[0].isActive = true;
      callBackCellStyle(tmperrArray[0].row, tmperrArray[0].column);
      setErrorList(tmperrArray);
    }
    setTotalError(totalErrors);
    // if (tmperrArray.length > 0) {
    //   setSelectedId(tmperrArray[0].row);
    //   setColumnStyle(tmperrArray[0].column);
    // }
  };

  const getPaymentMethod = (participantId) => {
    commonServices.getPaymentMethod(participantId).then((response) => {
      if (response.length) {
        response.forEach((x) => {
          x.label = x.name;
        });
        //setSelectedRecovery(response[0]);
      }
      setRecoveryList(response);
    });
  };

  const getAllData = () => {
    if (maplist) {
      let totalErrors = 0;
      let tmperrArray = [];
      setData(maplist);
      const addIsChecked = maplist.map((z, i) => {
        const tmpObj = { ...z };

        tmpObj.id = z.id;
        tmpObj.title = z.title;
        tmpObj.titleId = z.titleId;
        tmpObj.titleIdError = z.titleIdError;
        tmpObj.firstName = z.firstName;
        tmpObj.firstNameError = z.firstNameError;
        tmpObj.lastName = z.lastName;
        tmpObj.lastNameError = z.lastNameError;
        tmpObj.address = z.address;
        tmpObj.suburb = z.suburb;
        tmpObj.suburbId = z.suburbId;
        tmpObj.suburbIdError = z.suburbIdError;
        tmpObj.postcode = z.postcode;
        tmpObj.state = z.state;
        tmpObj.stateId = z.stateId;
        tmpObj.stateIdError = z.stateIdError;
        tmpObj.dateOfBirth = moment(z.dateOfBirth).format("DD/MM/YYYY");
        tmpObj.dateOfBirthError = z.dateOfBirthError;
        tmpObj.admissionDate = moment(z.admissionDate).format("DD/MM/YYYY");
        tmpObj.admissionDateError = z.admissionDateError;
        tmpObj.initiallyEnteredAgedCare = moment(
          z.initiallyEnteredAgedCare
        ).format("DD/MM/YYYY");
        tmpObj.initiallyEnteredAgedCareError = z.initiallyEnteredAgedCareError;
        tmpObj.careType = z.careType;
        tmpObj.careTypeId = z.careTypeId;
        tmpObj.careTypeIdError = z.careTypeIdError;
        tmpObj.extraService = z.extraService;
        tmpObj.facility = z.facility;
        tmpObj.facilityId = z.facilityId;
        tmpObj.facilityError = z.facilityError;
        tmpObj.residentId = z.residentId;
        tmpObj.residentIdError = z.residentIdError;
        tmpObj.clientBillingId = z.clientBillingId;
        tmpObj.clientBillingIdError = z.clientBillingIdError;
        tmpObj.projectedPaymentDecisionDate = moment(
          z.projectedPaymentDecisionDate
        ).format("DD/MM/YYYY");
        tmpObj.totalAgreedAccommodationPrice = z.totalAgreedAccommodationPrice;
        tmpObj.priceFormat = z.priceFormat;
        tmpObj.paymentType = z.paymentType;
        tmpObj.paymentMethodId = z.paymentMethodId;
        tmpObj.paymentMethodIdError = z.paymentMethodIdError;
        tmpObj.mpir = z.mpir;
        tmpObj.agreedRadRacPortion = z.agreedRadRacPortion;
        tmpObj.drawdown = z.drawdown;
        tmpObj.recovery = z.recovery;
        tmpObj.recoveryTypeId = z.recoveryTypeId;
        tmpObj.recoveryTypeIdError = z.recoveryTypeIdError;
        tmpObj.category = z.category;
        tmpObj.supportedCategoryId = z.supportedCategoryId;
        tmpObj.supportedCategoryIdError = z.supportedCategoryIdError;
        tmpObj.agreedRadRacPaid = z.agreedRadRacPaid;
        tmpObj.totalRadRacTopUp = z.totalRadRacTopUp;
        tmpObj.extraServiceFeesDeducted = z.extraServiceFeesDeducted;
        tmpObj.capitalisedCareFeesDeducted = z.capitalisedCareFeesDeducted;
        tmpObj.additionalServiceFeesDeducted = z.additionalServiceFeesDeducted;
        tmpObj.dapDacCharge = z.dapDacCharge;
        tmpObj.dapDacChargeReceipt = z.dapDacChargeReceipt;
        tmpObj.dapDacDeduction = z.dapDacDeduction;
        tmpObj.balance = z.balance;
        tmpObj.uniqueId = z.uniqueId;

        //#f49fa4 --->Red color
        //f2d098 ---> Orange for row

        totalErrors =
          z.titleIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "title",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.firstNameError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "firstName",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.lastNameError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({ column: "lastName", row: i, isActive: false }))
            : totalErrors;

        totalErrors =
          z.suburbIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "suburb",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.stateIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "state",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.dateOfBirthError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "dateOfBirth",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.admissionDateError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "admissionDate",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.initiallyEnteredAgedCareError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "initiallyEnteredAgedCare",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.careTypeIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "careType",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.facilityError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({ column: "facility", row: i, isActive: false }))
            : totalErrors;

        totalErrors =
          z.residentIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "residentId",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.paymentMethodIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "paymentType",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.recoveryTypeIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({ column: "recovery", row: i, isActive: false }))
            : totalErrors;

        totalErrors =
          z.supportedCategoryIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "category",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        totalErrors =
          z.clientBillingIdError === "1"
            ? (totalErrors + 1,
              tmperrArray.push({
                column: "clientBillingId",
                row: i,
                isActive: false,
              }))
            : totalErrors;

        tmpObj.RowColor =
          tmpObj.residentIdError === "1" ||
          tmpObj.firstNameError === "1" ||
          tmpObj.lastNameError === "1" ||
          tmpObj.dateOfBirthError === "1" ||
          tmpObj.facilityError === "1" ||
          tmpObj.titleIdError === "1" ||
          tmpObj.suburbIdError === "1" ||
          tmpObj.stateIdError === "1" ||
          tmpObj.admissionDateError === "1" ||
          tmpObj.initiallyEnteredAgedCareError === "1" ||
          tmpObj.careTypeIdError === "1" ||
          tmpObj.paymentMethodIdError === "1" ||
          tmpObj.recoveryTypeIdError === "1" ||
          tmpObj.supportedCategoryIdError === "1" ||
          tmpObj.clientBillingIdError === "1"
            ? "#f2d098"
            : "white";
        setTotalError(totalErrors);
        console.log("This is error in table inside", tmperrArray);
        if (tmperrArray.length > 0) {
          tmperrArray[0].isActive = true;
        }

        return tmpObj;
      });
      console.log("This is error in table", tmperrArray);
      if (tmperrArray.length > 0) {
        setSelectedId(tmperrArray[0].row);
        setColumnStyle(tmperrArray[0].column);
        setActiveError(1);
      }

      setErrorList(tmperrArray);
      setData(addIsChecked);
    }
  };

  const getTitle = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.titleIdError === "1" && cell.column.id == "title" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getFirstNametEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.firstNameError === "1" &&
        cell.column.id == "firstName" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getLastNameEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.lastNameError === "1" &&
        cell.column.id == "lastName" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getAddresstEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
      </div>
    );
  };
  const getSuburb = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.suburbIdError === "1" &&
        cell.column.id == "suburb" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getPostcodeEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
      </div>
    );
  };
  const getState = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.stateIdError === "1" && cell.column.id == "state" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getDateOfBirth = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.dateOfBirthError === "1" &&
        cell.column.id == "dateOfBirth" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getAddmissionDate = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.admissionDateError === "1" &&
        cell.column.id == "admissionDate" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getInitialAdmissionDate = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.initiallyEnteredAgedCareError === "1" &&
        cell.column.id == "initiallyEnteredAgedCare" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };

  const getCareTypeEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.careTypeIdError === "1" &&
        cell.column.id == "careType" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };

  const getExtraServiceEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
      </div>
    );
  };
  const getFacility = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.facilityError === "1" &&
        cell.column.id == "facility" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getResidentIdEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.residentIdError === "1" &&
        cell.column.id == "residentId" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getTotalAgreedAccommodationPrice = (cell) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };
  const getpriceFormat = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
      </div>
    );
  };

  const getMpir = (cell) => {
    return <PercentageCell cell={cell} updateMyData={updateMyData} />;
  };
  const getPayment = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.paymentMethodIdError === "1" &&
        cell.column.id == "paymentType" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };

  const getAgreedLumpSumPortion = (cell, row, rowIndex, formatExtraData) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };

  const getDrawdown = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
      </div>
    );
  };

  const getRecovery = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.recoveryTypeIdError === "1" &&
        cell.column.id == "recovery" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };

  const getCategory = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.supportedCategoryIdError === "1" &&
        cell.column.id == "category" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };

  const getClientBillingIdEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
        {cell.row.original.clientBillingIdError === "1" &&
        cell.column.id == "clientBillingId" ? (
          <ExclamationTriangle
            columnName={cell.column.id}
            id="invalidFieldIcon"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  const getProjectedPaymentDecisionDateEdiTableCell = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
      </div>
    );
  };
  const getAgreedRadRacPaid = (cell) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };
  const getBalance = (cell) => {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <EditableCell cell={cell} updateMyData={updateMyData} />
      </div>
    );
  };

  const getRadRacPaid = (cell) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };
  const getExtraServiceFeesDeducted = (cell) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };
  const getCapitalisedCareFeesDeducted = (cell) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };
  const getAdditionalServiceFeesDeducted = (cell) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };
  const getDapDacCharge = (cell, row, rowIndex, formatExtraData) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };
  const getDapDacChargeReceipt = (cell, row, rowIndex, formatExtraData) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };
  const getDapDacDeduction = (cell, row, rowIndex, formatExtraData) => {
    return <PriceCell cell={cell} updateMyData={updateMyData} />;
  };

  function ColumnHeader(cell, columnName) {
    let hasError = false;
    cell.rows.map((item) => {
      if (
        columnName === "First Name" &&
        item.original?.firstNameError === "1"
      ) {
        hasError = true;
      }
      if (columnName === "Last Name" && item.original?.lastNameError === "1") {
        hasError = true;
      }
      if (
        columnName === "Date of Birth" &&
        item.original?.dateOfBirthError === "1"
      ) {
        hasError = true;
      }
      if (columnName === "Facility" && item.original?.facilityError === "1") {
        hasError = true;
      }
      if (
        columnName === "Resident Id" &&
        item.original?.residentIdError === "1"
      ) {
        hasError = true;
      }
      if (columnName === "Title" && item.original?.titleIdError === "1") {
        hasError = true;
      }
      if (columnName === "Suburb" && item.original?.suburbIdError === "1") {
        hasError = true;
      }

      if (columnName === "State" && item.original?.stateIdError === "1") {
        hasError = true;
      }
      if (
        columnName === "Admission Date" &&
        item.original?.admissionDateError === "1"
      ) {
        hasError = true;
      }
      if (
        columnName === "Initially Entered Aged Care" &&
        item.original?.initiallyEnteredAgedCareError === "1"
      ) {
        hasError = true;
      }
      if (
        columnName === "Payment Type" &&
        item.original?.paymentMethodIdError === "1"
      ) {
        hasError = true;
      }
      if (
        columnName === "Care Type" &&
        item.original?.careTypeIdError === "1"
      ) {
        hasError = true;
      }
      if (
        columnName === "Recovery" &&
        item.original?.recoveryTypeIdError === "1"
      ) {
        hasError = true;
      }
      if (
        columnName === "Category" &&
        item.original?.supportedCategoryIdError === "1"
      ) {
        hasError = true;
      }
      if (
        columnName === "Client Billing ID" &&
        item.original?.clientBillingIdError === "1"
      ) {
        hasError = true;
      }
    });
    return (
      <>
        <span style={{ float: "left" }}>{columnName}</span>
        <span style={{ float: "right" }}>
          {hasError ? (
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ width: "15px", height: "20px" }}
            />
          ) : (
            ""
          )}
        </span>
      </>
    );
  }

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    console.log("onblur  calloed");
    setSkipPageReset(true);
    let newDataArr = {};
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          let Error = "";
          let columnError = "";

          if (columnId === "firstName") {
            columnError = "firstNameError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "lastName") {
            columnError = "lastNameError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "dateOfBirth") {
            columnError = "dateOfBirthError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "facility") {
            columnError = "facilityError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "residentId") {
            columnError = "residentIdError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "title") {
            columnError = "titleIdError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "clientBillingId") {
            columnError = "clientBillingIdError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "suburb") {
            columnError = "suburbIdError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "state") {
            columnError = "stateIdError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "initiallyEnteredAgedCare") {
            columnError = "initiallyEnteredAgedCareError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "admissionDate") {
            columnError = "admissionDateError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "careType") {
            columnError = "careTypeIdError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "paymentType") {
            columnError = "paymentMethodIdError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "recovery") {
            columnError = "recoveryTypeIdError";
            Error = value === "" ? "1" : "";
          } else if (columnId === "category") {
            columnError = "supportedCategoryIdError";
            Error = value === "" ? "1" : "";
          }

          let newarray = {
            ...old[rowIndex],
            [columnId]: value,
            [columnError]: Error,
          };

          let RowColor =
            newarray.firstNameError === "1" ||
            newarray.lastNameError === "1" ||
            newarray.residentIdError === "1" ||
            newarray.facilityError === "1" ||
            newarray.dateOfBirthError === "1" ||
            newarray.titleIdError === "1" ||
            newarray.suburbIdError === "1" ||
            newarray.stateIdError === "1" ||
            newarray.admissionDateError === "1" ||
            newarray.initiallyEnteredAgedCareError === "1" ||
            newarray.careTypeIdError === "1" ||
            newarray.clientBillingIdError === "1" ||
            newarray.paymentMethodIdError === "1" ||
            newarray.recoveryTypeIdError === "1" ||
            newarray.supportedCategoryIdError === "1"
              ? "#f2d098"
              : "white";

          console.log("This is array", newarray);

          return {
            ...newarray,
            ["RowColor"]: RowColor,
          };
        }
        newDataArr = row;
        return row;
      })
    );
    console.log("newDataArr", newDataArr);
  };

  const columns = React.useMemo(() => [
    {
      Header: (cell) => ColumnHeader(cell, "Title"),
      width: "2%",
      accessor: "title",
      Cell: getTitle,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "First Name"),
      width: "3%",
      accessor: "firstName",
      Cell: getFirstNametEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Last Name"),
      width: "3%",
      accessor: "lastName",
      Cell: getLastNameEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Address"),
      accessor: "address",
      width: "4%",
      Cell: getAddresstEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Suburb"),
      accessor: "suburb",
      width: "4%",
      Cell: getSuburb,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Postcode"),
      accessor: "postcode",
      width: "2%",
      Cell: getPostcodeEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "State"),
      accessor: "state",
      width: "3%",
      Cell: getState,
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Date of Birth"),
      accessor: "dateOfBirth",
      width: "3%",
      Cell: getDateOfBirth,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Admission Date"),
      width: "3%",
      accessor: "admissionDate",
      Cell: getAddmissionDate,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Initially Entered Aged Care"),
      width: "3%",
      accessor: "initiallyEnteredAgedCare",
      Cell: getInitialAdmissionDate,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Care Type"),
      width: "3%",
      accessor: "careType",
      Cell: getCareTypeEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Extra Service"),
      width: "2%",
      accessor: "extraService",
      Cell: getExtraServiceEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Facility"),
      width: "4%",
      accessor: "facility",
      Cell: getFacility,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Resident Id"),
      width: "2%",
      accessor: "residentId",
      Cell: getResidentIdEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Client Billing ID"),
      width: "2%",
      accessor: "clientBillingId",
      Cell: getClientBillingIdEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) =>
        ColumnHeader(
          cell,
          "Projected Payment Decision Date (Admission Date+28 days)"
        ),
      width: "3%",
      accessor: "projectedPaymentDecisionDate",
      Cell: getProjectedPaymentDecisionDateEdiTableCell,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Total Agreed Accomodation Price"),
      width: "4%",
      accessor: "totalAgreedAccommodationPrice",
      Cell: getTotalAgreedAccommodationPrice,
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Price Format"),
      width: "3%",
      accessor: "priceFormat",
      Cell: getpriceFormat,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Payment Type"),
      accessor: "paymentType",
      width: "2%",
      Cell: getPayment,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "MPIR"),
      accessor: "mpir",
      width: "2%",
      Cell: getMpir,
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Agreed RAD/RAC Portion"),
      accessor: "agreedRadRacPortion",
      width: "3%",
      Cell: getAgreedLumpSumPortion,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Drawdown"),
      accessor: "drawdown",
      width: "3%",
      Cell: getDrawdown,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Recovery"),
      accessor: "recovery",
      width: "3%",
      Cell: getRecovery,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Category"),
      accessor: "category",
      width: "4%",
      Cell: getCategory,
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Agreed RAD / RAC Paid"),
      accessor: "agreedradRacPaid",
      width: "3%",
      Cell: getAgreedRadRacPaid,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Total RAD / RAC Top-up"),
      accessor: "totalRadRacTopUp",
      width: "3%",
      Cell: getRadRacPaid,
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Extra Service Fees Deducted"),
      accessor: "extraServiceFeesDeducted",
      width: "3%",
      Cell: getExtraServiceFeesDeducted,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Capitalised CareFees Deducted"),
      accessor: "capitalisedCareFeesDeducted",
      width: "4%",
      Cell: getCapitalisedCareFeesDeducted,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Additional ServiceFees Deducted"),
      accessor: "additionalServiceFeesDeducted",
      width: "4%",
      Cell: getAdditionalServiceFeesDeducted,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "DAP / DAC Charge"),
      accessor: "dapDacCharge",
      width: "3%",
      Cell: getDapDacCharge,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "DAP / DAC Charge Receipt"),
      accessor: "dapDacChargeReceipt",
      width: "3%",
      Cell: getDapDacChargeReceipt,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "DAP / DAC Deduction"),
      accessor: "dapDacDeduction",
      width: "3%",
      Cell: getDapDacDeduction,
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Balance"),
      accessor: "balance",
      width: "3%",
      Cell: getBalance,
      Filter: false,
      disableSortBy: true,
    },
  ]);

  async function saveDataCheckValidation() {
    setLoading(true);
    var checking = data.map((item) => {
      var updatedObj = {
        title: item.title,
        titleId: null,
        firstName: item.firstName,
        lastName: item.lastName,
        address: item.address,
        suburb: item.suburb,
        suburbId: null,
        postcode: item.postcode,
        state: item.state,
        stateId: null,
        dateOfBirth: moment(item.dateOfBirth, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
        admissionDate: moment(item.admissionDate, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
        initiallyEnteredAgedCare: moment(
          item.initiallyEnteredAgedCare,
          "DD-MM-YYYY"
        ).format("YYYY-MM-DD"),
        careType: item.careType,
        careTypeId: null,
        extraService: item.extraService,
        facility: item.facility,
        facilityId: null,
        residentId: item.residentId,
        clientBillingId: item.clientBillingId,
        projectedPaymentDecisionDate: moment(
          item.projectedPaymentDecisionDate,
          "DD-MM-YYYY"
        ).format("YYYY-MM-DD"),
        totalAgreedAccommodationPrice: item.totalAgreedAccommodationPrice,
        priceFormat: item.priceFormat,
        paymentType: item.paymentType,
        paymentMethodId: null,
        mpir: item.mpir,
        agreedRadRacPortion: item.agreedRadRacPortion,
        drawdown: item.drawdown,
        recovery: item.recovery,
        recoveryTypeId: null,
        category: item.category,
        supportedCategoryId: null,
        agreedRadRacPaid: item.agreedRadRacPaid,
        totalRadRacTopUp: item.totalRadRacTopUp,
        extraServiceFeesDeducted: item.extraServiceFeesDeducted,
        capitalisedCareFeesDeducted: item.capitalisedCareFeesDeducted,
        additionalServiceFeesDeducted: item.additionalServiceFeesDeducted,
        dapDacCharge: item.dapDacCharge,
        dapDacChargeReceipt: item.dapDacChargeReceipt,
        dapDacDeduction: item.dapDacDeduction,
        balance: item.balance,
      };
      return updatedObj;
    });

    let obj = {
      importResidentModels: checking,
      uniqueId: uniqueGuid,
      residentType: residentType,
    };

    importCSV[residentType === "2" ? "MapCSVcontinuBond" : "MapCSVFields"](
      obj
    ).then(
      (data) => {
        setLoading(false);
        if (data.message === "Error") {
          callBackActiveStep(false, data.result);
        } else {
          callBackActiveStep(true, data.result);
        }

        // setShow(false);
      },
      () => {
        setLoading(false);
      }
    );
  }

  const callBackCellStyle = (id, j) => {
    //alert("On click of cell");
    // setCellValue((cellvalue) =>
    //   cellvalue === "blue" ? (cellvalue = "red") : (cellvalue = "blue")
    // );

    setSelectedId(Number(id));
    setColumnStyle(j);
  };
  const outsider = document.getElementById("new-scroll");

  useEffect(() => {
    let currentActive = errorList.filter((item) => item.isActive === true);
    currentActive.map((m) => {
      setNewKey(m.column);
      const newInd = columnList.findIndex((f) => {
        let convertName = f.label.replace(/ +/g, "");
        let startOne = convertName.toLowerCase();
        let secondWord;
        if (currentActive[0].column === -1) {
          return;
        } else {
          secondWord = currentActive[0].column.toLowerCase();
        }
        if (startOne === secondWord) {
          return f.value;
        }
      });
      const distance = Math.round(newInd * 180);
      outsider.scrollTo(distance, 0);
    });

  }, [errorList]);

  const highlightNext = () => {
    let currentActiveIndex = errorList.findIndex(
      (item) => item.isActive === true
    );
    if (currentActiveIndex >= 0 && errorList.length - 2 >= currentActiveIndex) {
      errorList[currentActiveIndex].isActive = false;
      errorList[currentActiveIndex + 1].isActive = true;
      setErrorList(errorList);
      setActiveError(activeError + 1);

      let currentActive = errorList.filter((item) => item.isActive === true);
      currentActive.map((m) => {
        setNewKey(m.column);
        const newInd = columnList.findIndex((f) => {
          let convertName = f.label.replace(/ +/g, "");
          let startOne = convertName.toLowerCase();
          let secondWord;
          if (currentActive[0].column === -1) {
            return;
          } else {
            secondWord = currentActive[0].column.toLowerCase();
          }
          if (startOne === secondWord) {
            return f.value;
          }
        });
        const distance = Math.round(newInd * 180);
        outsider.scrollTo(distance, 0);
      });
      callBackCellStyle(currentActive[0].row, currentActive[0].column);
    }
  };

  const highlightPrevious = () => {
    let currentActiveIndex = errorList.findIndex(
      (item) => item.isActive === true
    );
    if (currentActiveIndex > 0) {
      errorList[currentActiveIndex].isActive = false;
      errorList[currentActiveIndex - 1].isActive = true;
      setErrorList(errorList);
      let currentActive = errorList.filter((item) => item.isActive === true);
      currentActive.map((m) => {
        setNewKey(m.column);

        const newInd = columnList.findIndex((f) => {
          let convertName = f.label.replace(/ +/g, "");
          let startOne = convertName.toLowerCase();
          let secondWord;
          if (currentActive[0].column === -1) {
            return;
          } else {
            secondWord = currentActive[0].column.toLowerCase();
          }
          if (startOne === secondWord) {
            return f.value;
          }
        });
        const distancetwo = Math.round(newInd * 180);
        outsider.scrollTo(distancetwo, 0);
      });
      callBackCellStyle(currentActive[0].row, currentActive[0].column);
      setActiveError(activeError - 1);
    } else {
    }
  };
  const mapCSVList = React.useMemo(() => data, [data]);
  return (
    <>
      <Formik
        enableReinitialize
        //innerRef={ref}
        //initialValues={initialValues}
        // validationSchema={Yup.object().shape({
        //   vaccineTypeId: Yup.string().required(),
        //   lastVaccinationDate: Yup.string().required(),
        //   dosesRequired: Yup.string().required(),
        // })}
        //validate={validateForm}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={saveDataCheckValidation}
      >
        {({
          errors,
          setErrors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue,
          setFieldTouched,
        }) => (
          <>
            {showSuccessAlert && (
              <SuccessAlert
                type={successAlertOptions.actionType}
                msg={successAlertOptions.msg}
                title={successAlertOptions.title}
                callback={successAlertOptions.callback}
              ></SuccessAlert>
            )}
            {loading ? <Loader></Loader> : ""}
            <Row style={{ marginTop: "40px", padding: "40px" }}>
              <Row className={"fieldstyle"}>
                <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Step 2: Map CSV Fields
                </p>
              </Row>

              <Row className={"fieldstyle"}>
                <Col sm={6}>
                  <Row>
                    <Col sm={1}>
                      <div
                        className=""
                        style={{
                          borderRadius: "50%",
                          border: "1px solid #a8e0e4",
                          boxShadow: "0 2px 0px 0 #a8e0e4",
                          width: 45,
                          height: 45,
                          color: "black",
                          fontWeight: "bold",

                          backgroundColor: "white",
                        }}
                      >
                        <p
                          style={{
                            marginTop: "8px",
                            marginLeft: "16px",
                            fontSize: "16px",
                          }}
                        >
                          1
                        </p>
                      </div>
                    </Col>
                    <Col sm={11}>
                      <p style={{ marginTop: "10px" }}>
                        Please confirm or/and map out the CSV Header columns
                      </p>
                      <Row className="d-flex">
                        <Col sm={12}>
                          <input type="checkbox" /> CSV File has a header row
                        </Col>

                        {/* <Col sm={6}>
                  <input type="checkbox" /> Pre 1st July 2019 Bond Residents
                </Col> */}
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col sm={12}></Col>
                <Col
                  id="new-scroll"
                  sm={12}
                  style={{
                    overflow: "scroll",
                    marginTop: "25px",
                    height: "300px",
                    //position:"fixed"
                  }}
                >
                  <Row>
                    <Col className="d-flex">
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="title"
                          name="title"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({ ...column, SelectedTitle: selected });
                          }}
                          options={columnList}
                          value={column.SelectedTitle}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="firstname"
                          name="firstname"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedFirstName: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedFirstName}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="lastname"
                          name="lastname"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedLastName: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedLastName}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="address"
                          name="address"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({ ...column, SelectedAddress: selected });
                          }}
                          options={columnList}
                          value={column.SelectedAddress}
                        />
                      </div>

                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="suburb"
                          name="suburb"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({ ...column, SelectedSuburb: selected });
                          }}
                          options={columnList}
                          value={column.SelectedSuburb}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="postcode"
                          name="TitleTypeId"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedPostcode: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedPostcode}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="state"
                          name="state"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({ ...column, SelectedState: selected });
                          }}
                          options={columnList}
                          value={column.SelectedState}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="dateofbirth"
                          name="dateofbirth"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedDateofBirth: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedDateofBirth}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="admissiondate"
                          name="admissiondate"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedAdmissionDate: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedAdmissionDate}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="initialadmissiondate"
                          name="initialadmissiondate"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedInitialAdmissionDate: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedInitialAdmissionDate}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="caretype"
                          name="caretype"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedCareType: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedCareType}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="extraservice"
                          name="extraservice"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedExtraService: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedExtraService}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="facility"
                          name="facility"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedFacility: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedFacility}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="residentid"
                          name="residentid"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedResidentId: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedResidentId}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="clientbillingid"
                          name="clientbillingid"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedClientBillingId: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedClientBillingId}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="projectedpaymentdecision"
                          name="projectedpaymentdecision"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedProjectedPaymentDecisionDate: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedProjectedPaymentDecisionDate}
                        />
                      </div>

                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="totalagreedaccomodationprice"
                          name="totalagreedaccomodationprice"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedTotalAgreedAccomodationPrice: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedTotalAgreedAccomodationPrice}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="priceformat"
                          name="priceformat"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedPriceFormat: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedPriceFormat}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="payment"
                          name="payment"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({ ...column, SelectedPayment: selected });
                          }}
                          options={columnList}
                          value={column.SelectedPayment}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="mpir"
                          name="mpir"
                          classNamePrefix="%"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({ ...column, SelectedMpir: selected });
                          }}
                          options={columnList}
                          value={column.SelectedMpir}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="agreedRADRACPortion"
                          name="agreedRADRACPortion"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedAgreedRADRACPortion: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedAgreedRADRACPortion}
                        />
                      </div>
                      {/* 

                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="agreedlumpsumportion"
                          name="agreedlumpsumportion"
                          placeholder="Select...."
                          width="320px"
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedAgreedLumpSumPortion: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedAgreedLumpSumPortion}
                        />
                      </div> */}
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="drawdown"
                          name="drawdown"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedDrawdown: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedDrawdown}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="recovery"
                          name="recovery"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedRecovery: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedRecovery}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="category"
                          name="category"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedCategory: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedCategory}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="agreedRADRACPaid"
                          name="agreedRADRACPaid"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedAgreedRADRACPaid: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedAgreedRADRACPaid}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="totalradractopup"
                          name="totalradractopup"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedTotalRADRACTopUp: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedTotalRADRACTopUp}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="extraservicefeesdeducted"
                          name="extraservicefeesdeducted"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedExtraServiceFeesDeducted: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedExtraServiceFeesDeducted}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="capitalisedcarefeesdeducted"
                          name="capitalisedcarefeesdeducted"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedCapitalisedCareFeesDeducted: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedCapitalisedCareFeesDeducted}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="additionalservicefeesdeducted"
                          name="additionalservicefeesdeducted"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedAdditionalServiceFeesDeducted: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedAdditionalServiceFeesDeducted}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="dapdaccharge"
                          name="dapdaccharge"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedDapDacCharge: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedDapDacCharge}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="dapdacchargereceipt"
                          name="dapdacchargereceipt"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedDapDacChargeReceipt: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedDapDacChargeReceipt}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="dapdacdeduction"
                          name="dapdacdeduction"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedDapDacDeduction: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedDapDacDeduction}
                        />
                      </div>
                      <div style={{ margin: "1.5px" }}>
                        <Select
                          id="balance"
                          name="balance"
                          placeholder="Select...."
                          onChange={(selected) => {
                            setColumn({
                              ...column,
                              SelectedBalance: selected,
                            });
                          }}
                          options={columnList}
                          value={column.SelectedBalance}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <ReactTableImportCSV
                      columns={columns}
                      data={data}
                      showSecondHead={false}
                      updateMyData={updateMyData}
                      callBackCellStyle={callBackCellStyle}
                      skipPageReset={skipPageReset}
                      getRowProps={(cellInfo) => ({
                        style: {
                          backgroundColor: cellInfo.original.RowColor,
                        },
                      })}
                      // getCellProps={cellInfo => ({
                      //   style: {
                      //     backgroundColor: `hsl(${120 * ((120 - cellInfo.value) / 120) * -1 +
                      //       120}, 100%, 67%)`,
                      //   },
                      // })}
                      getCellProps={(cellInfo) => ({
                        style: {
                          backgroundColor:
                            (cellInfo.column.id === "firstName" &&
                            cellInfo.row.original.firstNameError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "lastName" &&
                            cellInfo.row.original.lastNameError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "facility" &&
                            cellInfo.row.original.facilityError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "dateOfBirth" &&
                            cellInfo.row.original.dateOfBirthError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "residentId" &&
                            cellInfo.row.original.residentIdError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "title" &&
                            cellInfo.row.original.titleIdError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "state" &&
                            cellInfo.row.original.stateIdError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "suburb" &&
                            cellInfo.row.original.suburbIdError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "careType" &&
                            cellInfo.row.original.careTypeIdError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "admissionDate" &&
                            cellInfo.row.original.admissionDateError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id ===
                              "initiallyEnteredAgedCare" &&
                            cellInfo.row.original
                              .initiallyEnteredAgedCareError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "clientBillingId" &&
                            cellInfo.row.original.clientBillingIdError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "paymentType" &&
                            cellInfo.row.original.paymentMethodIdError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "recovery" &&
                            cellInfo.row.original.recoveryTypeIdError === "1"
                              ? "#f49fa4"
                              : "") ||
                            (cellInfo.column.id === "category" &&
                            cellInfo.row.original.supportedCategoryIdError ===
                              "1"
                              ? "#f49fa4"
                              : ""),
                          border:
                            selectedId === Number(cellInfo.row.id) &&
                            cellInfo.column.id === columnStyle
                              ? "3px solid blue"
                              : "",
                        },
                      })}
                    />
                  </Row>
                </Col>
                <Col sm={6} style={{ marginTop: "40px" }}>
                  <Row>
                    <Col sm={1}>
                      <div
                        className=""
                        style={{
                          borderRadius: "50%",
                          border: "1px solid #a8e0e4",
                          boxShadow: "0 2px 0px 0 #a8e0e4",
                          width: 45,
                          height: 45,
                          color: "black",
                          fontWeight: "bold",

                          backgroundColor: "white",
                        }}
                      >
                        <p
                          style={{
                            marginTop: "8px",
                            marginLeft: "16px",
                            fontSize: "16px",
                          }}
                        >
                          2
                        </p>
                      </div>
                    </Col>
                    <Col sm={11}>
                      <p style={{ marginTop: "10px" }}>
                        Please fix the errors (indicated by &nbsp;
                        <GoAlert
                          //id={`personnel${cell.id}`}
                          style={{
                            outline: "none",
                            cursor: "pointer",
                            width: "16px",
                            height: "16px",
                            color: "red",
                            fontSize: "16px",
                            outline: "none",
                            marginBottom: "3px",
                          }}
                        />
                        &nbsp;)
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={2}></Col>

                    <Col sm={3}>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Errors:</span>{" "}
                        {totalError === 0 ? 0 : activeError} out of {totalError}{" "}
                        errors
                      </p>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex">
                        <Button
                          className="addbtn btn btn-primary  justify-content-end "
                          disabled={
                            totalError === 0 && activeError === 1 ? true : false}
                            onClick={() => {
                            highlightPrevious();
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faAngleLeft}
                            style={{ width: "15px" }}
                          />{" "}
                          <span style={{ marginBottom: "5px" }}>
                            Highlight Previous
                          </span>
                        </Button>

                        <Button
                          className="addbtn btn btn-primary ml-2  justify-content-end "
                          disabled={ activeError === totalError || totalError < 1  ? true : false}
                          style={{ height: "39px", marginLeft: "12px" }}
                          onClick={() => {
                            highlightNext();
                          }}
                        >
                          Highlight Next
                          <FontAwesomeIcon
                            icon={faAngleRight}
                            style={{ width: "15px" }}
                          />{" "}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          </>
        )}
      </Formik>
    </>
  );
};

const EditableCell = ({
  cell,
  // value: initialValue,
  // row: { index },
  // column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(cell.value);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(cell.cell.row.index, cell.column.id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(cell.value);
  }, [cell.value]);

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="number-fieldtransparent"
      style={{ border: "none", width: "90%", backgroundColor: "transparent" }}
    />
  );
};

const ExclamationTriangle = (field) => {
  return (
    <div
      style={{
        paddingTop: "10px",
        paddingLeft: "10px",
        marginRight: "-10px",
      }}
    >
      <span style={{ float: "right" }}>
        <FontAwesomeIcon
          id={field.id}
          icon={faExclamationTriangle}
          style={{ width: "15px", height: "20px" }}
        />
      </span>
      <UncontrolledTooltip
        autohide={true}
        placement="bottom"
        target="invalidFieldIcon"
        innerClassName="inner-tooltip"
        style={{
          color: "black",
        }}
      >
        <div className="d-flex align-top text-nowrap ">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="icontooltip"
          />
          Item Name Missing
        </div>
      </UncontrolledTooltip>
    </div>
  );
};

const SelectCell = ({
  cell,
  data,
  selectList,
  selectedOption,
  isValid,
  columnId,
  // value: initialValue,
  // row: { index },
  // column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  const [selectedValue, setSelectedValue] = useState(selectedOption);

  React.useEffect(() => {
    let selectedtitle = selectList.filter((val) => val.value === cell.value);
    if (selectedtitle.length > 0) {
      setSelectedValue({
        label: selectedtitle[0].label,
        value: selectedtitle[0].value,
      });
    }
  }, [cell.value]);

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <Select
        id="TitleTypeId"
        className="select-widthtable"
        name="TitleTypeId"
        placeholder="Select...."
        options={selectList}
        onChange={(selected) => {
          setSelectedValue({
            label: selected.label,
            value: selected.value,
          });
          updateMyData(
            cell.cell.row.index,
            cell.cell.column.id,
            selected.value
          );
        }}
        value={selectedValue}
        // isOptionSelected={(x) => {
        //   return x.title_type_id === Number(selectedValue.value) ? x : null;
        // }}
        defaultValue={selectedValue}
      />
    </div>
  );
};

const DatePicker = ({
  cell,
  data,
  selectList,
  date,
  isValid,
  columnId,
  // value: initialValue,
  // row: { index },
  // column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  const [selectedDate, setSelectedDate] = useState(
    cell.value
    //Date.parse(cell.value)
    // cell.value.toJSON()
    //moment(cell.value).format("DD/MM/YYYY")
  );

  useEffect(() => {
    setSelectedDate(moment(cell.value).format("dd/MM/yyyy"));
  }, [cell.value]);

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <MuiDatePicker
        name="date"
        autoComplete="off"
        selectedDate={selectedDate}
        dateFormat="dd/MM/yyyy"
        getChangedDate={(date) => {
          setSelectedDate(date);
        }}
        className={"datepickerwidth-100"}
      />

      {/* {cell.row.original.ResidentTitleTypeIdCellColor === "#f49fa4" &&
      cell.column.id == "resident_first_name" ? (
        <ExclamationTriangle columnName={cell.column.id} />
      ) : (
        ""
      )} */}
      {/* {cell.row.original.ResidentTitleTypeIdCellColor === "#f49fa4" ? (
        <div
          style={{
            paddingTop: "10px",
            paddingLeft: "10px",
            marginRight: "-10px",
          }}
        >
          <span style={{ float: "right" }}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ width: "15px", height: "20px" }}
            />
          </span>
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
};

const PriceCell = ({
  cell,
  data,
  selectList,
  date,
  isValid,
  columnId,
  // value: initialValue,
  // row: { index },
  // column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  const [amount, setAmount] = useState(
    cell.value
    //Date.parse(cell.value)
    // cell.value.toJSON()
    //moment(cell.value).format("DD/MM/YYYY")
  );

  useEffect(() => {
    setAmount(cell.value);
  }, [cell.value]);

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <NumberFormat
        thousandSeparator={true}
        //prefix={"$"}
        // maxLength={amount === 0 ? 14 : 16}
        fixedDecimalScale={2}
        allowNegative={false}
        decimalScale={2}
        name="amount"
        id="amount"
        value={amount}
        placeholder="$0.00"
        style={{
          width: "100%",
          background: "tranparent",
          backgroundColor: "tranparent",
          border: "transparent",
        }}
        className="number-fieldtransparent "
        onValueChange={(x) => {
          setAmount(x.floatValue);
        }}
      />
    </div>
  );
};

const PercentageCell = ({
  cell,
  data,
  selectList,
  date,
  isValid,
  columnId,
  // value: initialValue,
  // row: { index },
  // column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  const [percentage, setPercentage] = useState(
    cell.value
    //Date.parse(cell.value)
    // cell.value.toJSON()
    //moment(cell.value).format("DD/MM/YYYY")
  );

  useEffect(() => {
    setPercentage(cell.value);
  }, [cell.value]);

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <NumberFormat
        className="number-fieldtransparent"
        thousandSeparator={false}
        suffix={"%"}
        maxLength={7}
        fixedDecimalScale={2}
        allowNegative={false}
        decimalScale={2}
        name="Mpir"
        id="Mpir"
        value={percentage}
        placeholder={"0.00%"}
        disabled={false}
        style={{ width: "68.7%", paddingLeft: "12px", border: "transparent" }}
      />
      {/* {cell.row.original.ResidentTitleTypeIdCellColor === "#f49fa4" &&
      cell.column.id == "resident_first_name" ? (
        <ExclamationTriangle columnName={cell.column.id} />
      ) : (
        ""
      )} */}
      {/* {cell.row.original.ResidentTitleTypeIdCellColor === "#f49fa4" ? (
        <div
          style={{
            paddingTop: "10px",
            paddingLeft: "10px",
            marginRight: "-10px",
          }}
        >
          <span style={{ float: "right" }}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ width: "15px", height: "20px" }}
            />
          </span>
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
};

const CheckboxCell = ({
  cell,
  data,
  selectList,
  date,
  isValid,
  columnId,
  // value: initialValue,
  // row: { index },
  // column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  const [isCheck, setIsCheck] = useState(cell.value);

  useEffect(() => {
    setIsCheck(moment(cell.value).format("dd/MM/yyyy"));
  }, [cell.value]);

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <Input
        className=""
        style={{ display: "flex", margin: "auto" }}
        type="checkbox"
        value={isCheck}
        onChange={(e) => {
          setIsCheck(e.currentTarget.checked);
          updateMyData(
            cell.cell.row.index,
            cell.cell.column.id,
            e.currentTarget.checked
          );
          //isUpdatedConfirmCallback(e.currentTarget.checked, cell.id);
        }}
        checked={isCheck}
      ></Input>
      {/* {cell.row.original.ResidentTitleTypeIdCellColor === "#f49fa4" &&
      cell.column.id == "resident_first_name" ? (
        <ExclamationTriangle columnName={cell.column.id} />
      ) : (
        ""
      )} */}
      {/* {cell.row.original.ResidentTitleTypeIdCellColor === "#f49fa4" ? (
        <div
          style={{
            paddingTop: "10px",
            paddingLeft: "10px",
            marginRight: "-10px",
          }}
        >
          <span style={{ float: "right" }}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ width: "15px", height: "20px" }}
            />
          </span>
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default MapCSVFields;
