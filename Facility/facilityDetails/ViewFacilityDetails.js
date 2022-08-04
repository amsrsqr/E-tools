import { ErrorMessage, Field, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../../../components/Loader";
import Page from "../../../components/Page";
import * as Yup from "yup";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { SAVE } from "../../../constant/MessageConstant";
import DirtyWarningAlert from "../../../components/DirtyWarningAlert";
import Icon from "../../../assets/Images/icon.png";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import { ACTION, EDIT } from "../../../constant/FieldConstant";
import FacilityReactTable from "../../../components/FacilityReactTable";
import facilityDetailsService from "../../../services/Facility/facilityServiceFirstTab.services";
import SuccessAlert from "../../../components/SuccessAlert";
import UpdateExtraService from "./UpdateExtraService";
import AmountFormat from "../../../utils/AmountFormat";
import SingleSelect from "../../../components/MySelect/MySelect";

const ViewFacilityDetails = ({
  facilityId,
  StateSubrbCountry,
  getCallbackForFacilityName,
  getAllCallback,
  getCallbackSetPopUp,
}) => {
  const ref = useRef();
  const [tableExtra, setTableExtra] = useState([]);
  const [primaryTitleTypeList, setPrimaryTitleTypeList] = useState(null);
  const [secondaryTitleTypeList, setSecondaryTitleTypeList] = useState(null);
  const [selectedPrimaryTitle, setSelectedPrimaryTitle] = useState(null);
  const [selectedSecondaryTitle, setSelectedSecondaryTitle] = useState(null);
  const [errorArray, setErrorArray] = useState([]);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [isSecondSameAddress, setSecondSameAddress] = useState(false);
  const [selectedPostalCountry, setSelectedPostalCountry] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedPostalState, setSelectedPostalState] = useState(null);
  // const [PostalsuburbList, setPostalsuburbList] = useState([]);
  const [selectedPostalSuburb, setSelectedPostalSuburb] = useState(null);
  const [suburbList, setsuburbList] = useState([]);
  const [CPYsuburbList, setCPYsuburbList] = useState([]);
  const [PostalsuburbList, setPostalsuburbList] = useState([]);
  const [PostalstateList, setPostalstateList] = useState([]);
  const [ProviderStreetSuburbList, setProviderStreetSuburbList] = useState([]);
  const [ProviderPostalSuburbList, setProviderPostalSuburbList] = useState([]);

  const [ProviderStreetStateList, setProviderStreetStateList] = useState([]);
  const [ProviderPostalStateList, setProviderPostalStateList] = useState([]);

  const [preferredContactList, setPreferredContactList] = useState([]);
  const [
    preferredSecondaryContactList,
    setSecondaryPreferredContactList,
  ] = useState([]);
  const [
    selectedPrimaryPreferredContact,
    setSelectedPrimaryPreferredContact,
  ] = useState(null);
  const [
    selectedSecondaryPreferredContact,
    setSelectedSecondaryPreferredContact,
  ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  //isSameHeadOfficeStreetAddress
  const [stateList, setStateList] = useState([]);
  const [selectedStreetCountry, setSelectedStreetCountry] = useState(null);
  const [selectedStreetState, setSelectedStreetState] = useState(null);
  const [selectedStreetSuburb, setSelectedStreetSuburb] = useState(null);

  //setSelectedProviderPostalSuburb
  const [
    selectedProviderPostalSuburb,
    setSelectedProviderPostalSuburb,
  ] = useState(null);
  const [
    selectedProviderStreetSuburb,
    setSelectedProviderStreetSuburb,
  ] = useState(null);
  const [
    selectedProviderPostalState,
    setSelectedProviderPostalState,
  ] = useState(null);
  const [
    selectedProviderPostalCountry,
    setSelectedProviderPostalCountry,
  ] = useState(null);
  const [
    selectedProviderStreetCountry,
    setSelectedProviderStreetCountry,
  ] = useState(null);
  const [
    selectedProviderStreetState,
    setSelectedProviderStreetState,
  ] = useState(null);

  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [actionType, setActionType] = useState();
  const [updatedResponse, setUpdatedResponse] = useState({});

  const [initialValues, setInitialValues] = useState({
    facilityName: "",
    racsNumber: "",
    providerRepresentative: "",
    witness: "",
    primaryTitleId: 0,
    primaryFirstName: "",
    primarySurname: "",
    primaryPosition: "",
    primaryMobile: "",
    primaryPhone: "",
    primaryEmail: "",
    primaryAlternativeEmail: "",
    primaryPreferredContactId: 0,
    primaryContactableAfterHours: false,
    secondaryTitleId: 0,
    secondaryFirstName: "",
    secondarySurname: "",
    secondaryPosition: "",
    secondaryPhone: "",
    secondaryMobile: "",
    secondaryEmail: "",
    secondaryAlternativeEmail: "",
    secondaryPreferredContactId: 0,
    secondaryContactableAfterHours: false,
    streetAddressLine1: "",
    streetAddressLine2: "",
    streetSuburbId: 0,
    streetSuburb: "",
    streetStateId: 0,
    streetState: "",
    streetPostcode: "",
    streetCountryId: 0,
    isSameHeadOfficeFacilityPostalAddress: null,
    postalAddressLine1: "",
    postalAddressLine2: "",
    postalSuburbId: 0,
    postalSuburb: "",
    postalStateId: 0,
    postalState: "",
    postalPostcode: "",
    postalCountryId: 0,
    // abn: "",
    abnNumber: "",
    acnNumber: "",
    providerNumber: "",
    businessName: "",
    providerStreetAddressLine1: "",
    providerStreetAddressLine2: "",
    providerStreetSuburbId: 0,
    providerStreetSuburb: "",
    providerStreetStateId: 0,
    providerStreetState: "",
    providerStreetPostcode: "",
    providerStreetCountryId: 0,
    isSameHeadOfficeProviderPostalAddress: null,
    providerPostalAddressLine1: "",
    providerPostalAddressLine2: "",
    providerPostalSuburbId: 0,
    providerPostalSuburb: null,
    providerPostalStateId: 0,
    providerPostalState: null,
    providerPostalPostcode: "",
    providerPostalCountryId: 0,
  });

  useEffect(() => {
    if (facilityId) {
      getAllExtraSevrice();
      getAllListOfType();
    }
  }, [facilityId]);

  const getAllExtraSevrice = () => {
    facilityDetailsService
      .getAllExtraServiceDetails(facilityId)
      .then((response) => {
        setTableExtra(response);
      });
  };
  useEffect(() => {
    getPreferredContactNew();
    if (
      (CPYsuburbList && CPYsuburbList.length > 0) ||
      (StateSubrbCountry.suburbList && StateSubrbCountry.suburbList.length > 0)
    ) {
    } else {
      getAllSuburbList();
    }
  }, []);

  useEffect(() => {
    if (facilityId !== undefined) {
      if (facilityId) {
        setInitialValues({
          facilityName: "",
          racsNumber: "",
          providerRepresentative: "",
          witness: "",
          primaryTitleId: 0,
          primaryFirstName: "",
          primarySurname: "",
          primaryPosition: "",
          primaryMobile: "",
          primaryPhone: "",
          primaryEmail: "",
          primaryAlternativeEmail: "",
          primaryPreferredContactId: 0,
          primaryContactableAfterHours: false,
          secondaryTitleId: 0,
          secondaryFirstName: "",
          secondarySurname: "",
          secondaryPosition: "",
          secondaryPhone: "",
          secondaryMobile: "",
          secondaryEmail: "",
          secondaryAlternativeEmail: "",
          secondaryPreferredContactId: 0,
          secondaryContactableAfterHours: false,
          streetAddressLine1: "",
          streetAddressLine2: "",
          streetSuburbId: 0,
          streetSuburb: "",
          streetStateId: 0,
          streetState: "",
          streetPostcode: "",
          streetCountryId: 0,
          isSameHeadOfficeFacilityPostalAddress: null,
          postalAddressLine1: "",
          postalAddressLine2: "",
          postalSuburbId: 0,
          postalSuburb: "",
          postalStateId: 0,
          postalState: "",
          postalPostcode: "",
          postalCountryId: 0,
          abn: "",
          acn: "",
          providerNumber: "",
          businessName: "",
          providerStreetAddressLine1: "",
          providerStreetAddressLine2: "",
          providerStreetSuburbId: 0,
          providerStreetSuburb: "",
          providerStreetStateId: 0,
          providerStreetState: "",
          providerStreetPostcode: "",
          providerStreetCountryId: 0,
          isSameHeadOfficeProviderPostalAddress: null,
          providerPostalAddressLine1: "",
          providerPostalAddressLine2: "",
          providerPostalSuburbId: 0,
          providerPostalSuburb: null,
          providerPostalStateId: 0,
          providerPostalState: null,
          providerPostalPostcode: "",
          providerPostalCountryId: 0,
        });
        getFacilityServiceDetails(facilityId);
      }
    }
  }, [facilityId]);

  useEffect(() => {
    if (StateSubrbCountry) {
      if (
        StateSubrbCountry.stateList &&
        StateSubrbCountry.stateList.length > 0
      ) {
        setStateList(StateSubrbCountry.stateList);
      }
      if (
        StateSubrbCountry.countryList &&
        StateSubrbCountry.countryList.length > 0
      ) {
        setCountryList(StateSubrbCountry.countryList);
      }
      if (
        StateSubrbCountry.suburbList &&
        StateSubrbCountry.suburbList.length > 0
      ) {
        setCPYsuburbList(StateSubrbCountry.suburbList);
        setsuburbList(StateSubrbCountry.suburbList);
        setPostalsuburbList(StateSubrbCountry.suburbList);
        setProviderStreetSuburbList(StateSubrbCountry.suburbList);
        setProviderPostalSuburbList(StateSubrbCountry.suburbList);
      }
    }
  }, [StateSubrbCountry]);

  const getPreferredContactNew = () => {
    facilityDetailsService.getPreferredContactList().then((response) => {
      const result = response.map((x) => {
        x.label = x.name;
        x.value = x.name;
        return x;
      });
      setPreferredContactList(result);
      setSecondaryPreferredContactList(result);
    });
  };

  const getPreferredContact = (obj) => {
    facilityDetailsService.getPreferredContactList().then((response) => {
      let selectedPrimaryPreferredContactObj = {};
      let selectedSecondaryPreferredContactObj = {};
      if (selectedPrimaryPreferredContactObj !== null) {
        setSelectedPrimaryPreferredContact(selectedPrimaryPreferredContactObj);
      }
      if (selectedSecondaryPreferredContactObj) {
        setSelectedSecondaryPreferredContact(
          selectedSecondaryPreferredContactObj
        );
      }
    });
  };

  const getAllListOfType = () => {
    facilityDetailsService.GetAllTitleTypeList().then(
      (response) => {
        const result = response.map((x) => {
          x.label = x.title_type_desc;
          x.value = x.title_type_id;
          return x;
        });
        setPrimaryTitleTypeList(result);
        setSecondaryTitleTypeList(result);
        if (
          updatedResponse.primaryTitleId ||
          updatedResponse.secondaryTitleId
        ) {
          let SelectedPrimary = {},
            SelectedSecondary = {};
          result.forEach((r) => {
            if (r.title_type_id === updatedResponse.primaryTitleId) {
              SelectedPrimary = r;
            }
            if (r.title_type_id === updatedResponse.secondaryTitleId) {
              SelectedSecondary = r;
            }
          });
          setSelectedPrimaryTitle(SelectedPrimary);
          setSelectedSecondaryTitle(SelectedSecondary);
        }
      },
      () => {
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getAllListOfType();
    if (updatedResponse) {
      // All Country Below
      if (
        StateSubrbCountry?.countryList &&
        StateSubrbCountry.countryList.length > 0
      ) {
        if (updatedResponse.streetCountryId) {
          let streetCountry = {},
            postalCountry = {},
            providerStreetCountry = {},
            providerPostalCountry = {};
          StateSubrbCountry.countryList.forEach((cr) => {
            if (cr.id === updatedResponse.streetCountryId) {
              streetCountry = cr;
            }
            if (cr.id === updatedResponse.postalCountryId) {
              postalCountry = cr;
            }
            if (cr.id === updatedResponse.providerPostalCountryId) {
              providerPostalCountry = cr;
            }
            if (cr.id === updatedResponse.providerStreetCountryId) {
              providerStreetCountry = cr;
            }
          });
          setSelectedStreetCountry(streetCountry);
          setSelectedPostalCountry(postalCountry);
          setSelectedProviderStreetCountry(providerStreetCountry);
          setSelectedProviderPostalCountry(providerPostalCountry);
          ref.current.setFieldValue(
            "providerPostalCountryId",
            updatedResponse.providerPostalCountryId
          );
          ref.current.setFieldValue(
            "providerStreetCountryId",
            updatedResponse.providerStreetCountryId
          );
          ref.current.setFieldValue(
            "postalCountryId",
            updatedResponse.postalCountryId
          );
          ref.current.setFieldValue(
            "streetCountryId",
            updatedResponse.streetCountryId
          );
        } else {
          if (
            StateSubrbCountry?.countryList &&
            StateSubrbCountry.countryList.length > 0
          ) {
            const DefaultCountry = StateSubrbCountry.countryList.find(
              (d) => d.id === 14
            );
            if (DefaultCountry) {
              setSelectedStreetCountry(DefaultCountry);
              setSelectedPostalCountry(DefaultCountry);
              setSelectedProviderStreetCountry(DefaultCountry);
              setSelectedProviderPostalCountry(DefaultCountry);
              ref.current.setFieldValue("providerPostalCountryId", 14);
              ref.current.setFieldValue("providerStreetCountryId", 14);
              ref.current.setFieldValue("postalCountryId", 14);
              ref.current.setFieldValue("streetCountryId", 14);
            }
          }
        }
      }
      // All Suburb Below
      if (
        StateSubrbCountry?.suburbList &&
        StateSubrbCountry.suburbList.length > 0
      ) {
        if (
          updatedResponse.postalSuburbId ||
          updatedResponse.postalSuburbId ||
          updatedResponse.providerStreetSuburbId ||
          updatedResponse.providerPostalSuburbId
        ) {
          let streetSuburb,
            postalSuburb,
            providerStreetSuburb,
            providerPostalSuburb;
          const tmpStreetSubrbList = [],
            tmpPostalSubrbList = [],
            tmpProviderStreetSuburbList = [],
            tmpProviderPostalSuburb = [];

          StateSubrbCountry.suburbList.forEach((s) => {
            if (s.id === updatedResponse.streetSuburbId) {
              streetSuburb = s;
            }
            if (s.id === updatedResponse.postalSuburbId) {
              postalSuburb = s;
            }
            if (s.id === updatedResponse.providerStreetSuburbId) {
              providerStreetSuburb = s;
            }
            if (s.id === updatedResponse.providerPostalSuburbId) {
              providerPostalSuburb = s;
            }
            if (s.stateId === updatedResponse.streetStateId)
              tmpStreetSubrbList.push(s);
            if (s.stateId === updatedResponse.postalStateId)
              tmpPostalSubrbList.push(s);
            if (s.stateId === updatedResponse.providerStreetStateId)
              tmpProviderStreetSuburbList.push(s);
            if (s.stateId === updatedResponse.providerPostalStateId)
              tmpProviderPostalSuburb.push(s);
          });

          if (tmpStreetSubrbList && tmpStreetSubrbList.length > 0) {
            setsuburbList(tmpStreetSubrbList);
          }
          if (tmpPostalSubrbList && tmpPostalSubrbList.length > 0) {
            setPostalsuburbList(tmpPostalSubrbList);
          }
          if (
            tmpProviderStreetSuburbList &&
            tmpProviderStreetSuburbList.length > 0
          ) {
            setProviderStreetSuburbList(tmpProviderStreetSuburbList);
          }
          if (tmpProviderPostalSuburb && tmpProviderPostalSuburb.length > 0) {
            setProviderPostalSuburbList(tmpProviderPostalSuburb);
          }

          setSelectedStreetSuburb(
            streetSuburb ? { ...streetSuburb, label: streetSuburb.value } : null
          );
          setSelectedPostalSuburb(
            postalSuburb ? { ...postalSuburb, label: postalSuburb.value } : null
          );
          setSelectedProviderStreetSuburb(
            providerStreetSuburb
              ? { ...providerStreetSuburb, label: providerStreetSuburb.value }
              : null
          );
          setSelectedProviderPostalSuburb(
            providerPostalSuburb
              ? { ...providerPostalSuburb, label: providerPostalSuburb.value }
              : null
          );
        } else {
          setSelectedStreetSuburb(null);
          setSelectedPostalSuburb(null);
          setSelectedProviderStreetSuburb(null);
          setSelectedProviderPostalSuburb(null);
        }
      }

      // All Title Type

      ref.current.setFieldValue(
        "streetPostcode",
        updatedResponse.streetPostcode
      );
      ref.current.setFieldValue(
        "postalPostcode",
        updatedResponse.postalPostcode
      );
      ref.current.setFieldValue(
        "providerStreetPostcode",
        updatedResponse.providerStreetPostcode
      );
      ref.current.setFieldValue(
        "providerPostalPostcode",
        updatedResponse.providerPostalPostcode
      );
      let updatedListOfType = {};
      updatedListOfType =
        primaryTitleTypeList &&
        primaryTitleTypeList?.filter(
          (r) => r.title_type_id === updatedResponse.primaryTitleId
        );
      setSelectedPrimaryTitle(updatedListOfType);

      let updatedNewList =
        secondaryTitleTypeList &&
        secondaryTitleTypeList?.filter(
          (r) => r.title_type_id === updatedResponse.secondaryTitleId
        );
      setSelectedSecondaryTitle(updatedNewList);

      // All Contact Type

      let primaryContact = preferredContactList.filter(
        (n) => n.id === updatedResponse.primaryPreferredContactId
      );
      setSelectedPrimaryPreferredContact(primaryContact);

      let secondaryContact = preferredSecondaryContactList.filter(
        (n) => n.id === updatedResponse.secondaryPreferredContactId
      );
      setSelectedSecondaryPreferredContact(secondaryContact);

      // All State Below
      if (
        StateSubrbCountry?.stateList &&
        StateSubrbCountry.stateList.length > 0
      ) {
        if (
          updatedResponse.streetStateId ||
          updatedResponse.postalStateId ||
          updatedResponse.providerStreetStateId ||
          updatedResponse.providerPostalStateId
        ) {
          let streetState,
            postalState,
            providerStreetState,
            providerPostalState;

          StateSubrbCountry.stateList.forEach((s) => {
            if (s.state_id === updatedResponse.streetStateId) {
              streetState = s;
            }

            if (s.state_id === updatedResponse.postalStateId) {
              postalState = s;
            }
            if (s.state_id === updatedResponse.providerStreetStateId) {
              providerStreetState = s;
            }
            if (s.state_id === updatedResponse.providerPostalStateId) {
              providerPostalState = s;
            }
          });
          if (!selectedStreetState) {
            setSelectedStreetState(streetState ? streetState : null);
          }
          setSelectedPostalState(postalState ? postalState : null);
          setSelectedProviderStreetState(
            providerStreetState ? providerStreetState : null
          );
          setSelectedProviderPostalState(
            providerPostalState ? providerPostalState : null
          );
          console.log(
            "providerPostalStateId",
            updatedResponse.providerPostalStateId
          );
          ref.current.setFieldValue(
            "providerStreetStateId",
            updatedResponse.providerStreetStateId
          );
          ref.current.setFieldValue(
            "providerPostalStateId",
            updatedResponse.providerPostalStateId
          );
          ref.current.setFieldValue(
            "streetStateId",
            updatedResponse.streetStateId
          );
          ref.current.setFieldValue(
            "postalStateId",
            updatedResponse.postalStateId
          );
        } else {
          setSelectedStreetState(null);
          setSelectedPostalState(null);
          setSelectedProviderStreetState(null);
          setSelectedProviderPostalState(null);
          ref.current.setFieldValue("providerStreetStateId", null);
          ref.current.setFieldValue("providerPostalStateId", null);
          ref.current.setFieldValue("streetStateId", null);
          ref.current.setFieldValue("postalStateId", null);
        }
      }

      //next write
    }
  }, [updatedResponse, StateSubrbCountry]);

  const getFacilityServiceDetails = (facilityid) => {
    setLoading(true);
    facilityDetailsService.getAllFacilityServiceDetails(facilityid).then(
      (response) => {
        setLoading(false);
        if (response !== null) {
          setInitialValues(response);
          setUpdatedResponse(response);
          getCallbackForFacilityName(response.facilityName, facilityId);
        }
      },
      () => {}
    );
  };
  const getFacilityServiceDetailsAfterCallback = (facilityid) => {
    facilityDetailsService.getAllFacilityServiceDetails(facilityid).then(
      (response) => {
        if (response !== null) {
          setInitialValues(response);
          setUpdatedResponse(response);
          getCallbackForFacilityName(response.facilityName, facilityId);
        }
      },
      () => {}
    );
  };

  const getAllSuburbList = () => {
    facilityDetailsService.getAllSuburbList().then((response) => {
      setsuburbList(response);
      setPostalsuburbList(response);
      setProviderStreetSuburbList(response);
      setProviderPostalSuburbList(response);
      setCPYsuburbList(response);
    });
  };

  const getFee = (cell) => {
    const newFormat = AmountFormat(cell.extraServiceReduction);
    return newFormat && newFormat ? newFormat : "Not Set";
  };
  const getExtraServiceFee = (cell) => {
    const newFormat = AmountFormat(cell.extraServiceFee);
    return newFormat && newFormat ? newFormat : "Not Set";
  };
  const handleEditShowForm = (item) => {
    setShowAddEditForm(true);
    setSelectedRowData(item);
    setActionType(EDIT);
  };

  const callBackAddEditFormToViewForm = (
    isFormVisible,
    success,
    msg = null
  ) => {
    setShowAddEditForm(isFormVisible);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: msg
          ? msg
          : actionType === EDIT
          ? "Extra Service Charge added successfully"
          : "Extra Service Charge updated successfully",
        callback: () => {
          setShowSuccessAlert(false);
          getAllExtraSevrice();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const getEditButtonPopUp = (cell) => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          style={{
            background: "#3C8DBC",
            color: "white",
            border: "0",
            width: "75%",
            height: "50%",
          }}
          onClick={() => handleEditShowForm(cell)}
        >
          Edit
        </Button>
      </div>
    );
  };
  const GetDescription = (props) => {
    const [showMore, setShowMore] = useState(false);
    return (
      <div>
        {showMore ? (
          <span dangerouslySetInnerHTML={{ __html: `${props.value}` }}></span>
        ) : (
          <span
            dangerouslySetInnerHTML={{
              __html: `${props.value?.substring(0, 170)} `,
            }}
          ></span>
        )}
        <p
          style={{ color: "blue", cursor: "pointer", fontSize: "12px" }}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore
            ? "Show less"
            : props.value?.length > 170
            ? "Show more"
            : ""}
        </p>
      </div>
    );
  };
  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: getEditButtonPopUp,
        width: "10%",
      },
      {
        disableSortBy: true,
        Header: "Extra Service level",
        accessor: "extraServiceChargeLevel",
        width: "20%",
      },
      {
        disableSortBy: true,
        Header: "Extra Service Fee",
        accessor: getExtraServiceFee,
        width: "20%",
      },
      {
        Header: "Extra Service Reduction",
        disableSortBy: true,
        accessor: getFee,
        width: "20%",
      },
      {
        Header: "Description",
        disableSortBy: true,
        accessor: "description",
        Cell: GetDescription,
        width: "30%",
      },
    ],
    []
  );

  const viewDataList = React.useMemo(() => tableExtra);

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);

    if (values.facilityName === "" || values.facilityName.trim() === "") {
      errorObj.facilityName = "Facility Required";
      errorArr.push({ name: "Facility Required" });
    }
    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }

    return errorObj;
  };

  const setPostalAddress = (flag, setFieldFunction, fields) => {
    if (flag) {
      setFieldFunction(
        "postalAddressLine1",
        fields.streetAddressLine1 ? fields.streetAddressLine1 : ""
      );
      setFieldFunction(
        "postalAddressLine2",
        fields.streetAddressLine2 ? fields.streetAddressLine2 : ""
      );
      setFieldFunction("postalCountryId", fields.streetCountryId);
      setSelectedPostalCountry(
        countryList.find((x) => x.id === fields.streetCountryId)
      );
      setSelectedPostalState(
        stateList.find((x) =>
          x.state_id === fields.streetStateId ? fields.streetStateId : null
        )
      );
      setPostalsuburbList(suburbList);
      const tmpSubrb = suburbList.find((x) => x.id === fields.streetSuburbId);
      setSelectedPostalSuburb(
        tmpSubrb ? { ...tmpSubrb, label: tmpSubrb.value } : null
      );
      setFieldFunction("postalStateId", fields.streetStateId);
      setFieldFunction("postalState", fields.streetState);
      setFieldFunction("postalSuburbId", fields.streetSuburbId);
      setFieldFunction("postalSuburb", fields.streetSuburb);
      setFieldFunction("postalPostcode", fields.streetPostcode);
    }
  };
  useEffect(() => {}, [selectedPostalCountry]);
  const ChangeProviderPostalAddress = (flag, setFieldFunction, fields) => {
    if (flag) {
      setFieldFunction(
        "providerPostalAddressLine1",
        fields.providerStreetAddressLine1
      );
      setFieldFunction(
        "providerPostalAddressLine2",
        fields.providerStreetAddressLine2
      );
      setFieldFunction(
        "providerPostalCountryId",
        fields.providerStreetCountryId
      );
      setSelectedProviderPostalCountry(
        countryList.find((x) => x.id === fields.providerStreetCountryId)
      );
      setSelectedProviderPostalState(
        stateList.find((x) => x.state_id === fields.providerStreetStateId)
      );

      const tmpSubrb = ProviderPostalSuburbList.find(
        (x) => x.id === fields.providerStreetSuburbId
      );
      setSelectedProviderPostalSuburb(
        tmpSubrb ? { ...tmpSubrb, label: tmpSubrb.value } : null
      );
      setFieldFunction("providerPostalStateId", fields.providerStreetStateId);
      setFieldFunction("providerPostalState", fields.providerStreetState);
      setFieldFunction("providerPostalSuburbId", fields.providerStreetSuburbId);
      setFieldFunction("providerPostalSuburb", fields.providerStreetSuburb);
      setFieldFunction("providerPostalPostcode", fields.providerStreetPostcode);
    }
  };

  async function saveFacility(fields, { setStatus, setSubmitting }) {
    setStatus();
    let apiObj = { ...fields };

    apiObj.id = apiObj.id;
    apiObj.facilityId = facilityId;
    // Provider Entity
    apiObj.facilityName = apiObj.facilityName;
    apiObj.racsNumber = apiObj.racsNumber ? apiObj.racsNumber : null;
    // Defalt Signatories
    apiObj.providerRepresentative = apiObj.providerRepresentative
      ? apiObj.providerRepresentative
      : null;
    apiObj.witness = apiObj.witness ? apiObj.witness : null;

    // key contact primary
    apiObj.primaryTitleId = apiObj.primaryTitleId;
    apiObj.primaryFirstName = apiObj.primaryFirstName
      ? apiObj.primaryFirstName
      : null;
    apiObj.primarySurname = apiObj.primarySurname
      ? apiObj.primarySurname
      : null;
    apiObj.primaryPosition = apiObj.primaryPosition
      ? apiObj.primaryPosition
      : null;
    apiObj.primaryPhone = apiObj.primaryPhone;
    apiObj.primaryMobile = apiObj.primaryMobile;
    apiObj.primaryEmail = apiObj.primaryEmail;
    apiObj.primaryAlternativeEmail = apiObj.primaryAlternativeEmail;
    apiObj.primaryPreferredContactId = apiObj.primaryPreferredContactId
      ? apiObj.primaryPreferredContactId
      : selectedPrimaryPreferredContact.id;
    apiObj.primaryContactableAfterHours = apiObj.primaryContactableAfterHours;

    // key contact secondary
    apiObj.secondaryTitleId = apiObj.secondaryTitleId;
    apiObj.secondaryFirstName = apiObj.secondaryFirstName
      ? apiObj.secondaryFirstName
      : null;
    apiObj.secondarySurname = apiObj.secondarySurname
      ? apiObj.secondarySurname
      : null;
    apiObj.secondaryPosition = apiObj.secondaryPosition
      ? apiObj.secondaryPosition
      : null;
    apiObj.secondaryPhone = apiObj.secondaryPhone;
    apiObj.secondaryMobile = apiObj.secondaryMobile;
    apiObj.secondaryEmail = apiObj.secondaryEmail;
    apiObj.secondaryAlternativeEmail = apiObj.secondaryAlternativeEmail;
    apiObj.secondaryPreferredContactId = apiObj.secondaryPreferredContactId
      ? apiObj.secondaryPreferredContactId
      : selectedSecondaryPreferredContact.id;
    apiObj.secondaryContactableAfterHours =
      apiObj.secondaryContactableAfterHours;

    //  Facility street address
    apiObj.streetAddressLine1 = apiObj.streetAddressLine1
      ? apiObj.streetAddressLine1
      : null;
    apiObj.streetAddressLine2 = apiObj.streetAddressLine2
      ? apiObj.streetAddressLine2
      : null;
    apiObj.streetSuburbId = apiObj.streetSuburbId;
    apiObj.streetSuburb = apiObj.streetSuburb;
    apiObj.streetStateId = apiObj.streetStateId;
    apiObj.streetState = apiObj.streetState;
    apiObj.streetPostcode = apiObj.streetPostcode
      ? apiObj.streetPostcode
      : null;
    apiObj.streetCountryId = apiObj.streetCountryId;

    //  Facility postal address
    apiObj.isSameHeadOfficeFacilityPostalAddress = isSameAddress;
    // apiObj.isSameHeadOfficeFacilityPostalAddress;
    apiObj.postalAddressLine1 = apiObj.postalAddressLine1
      ? apiObj.postalAddressLine1
      : null;
    apiObj.postalAddressLine2 = apiObj.postalAddressLine2
      ? apiObj.postalAddressLine2
      : null;
    apiObj.postalSuburbId =
      isSameAddress === true
        ? apiObj.streetSuburbId
        : apiObj.postalSuburbId
        ? apiObj.postalSuburbId
        : null;
    apiObj.postalSuburb = apiObj.postalSuburb;
    apiObj.postalStateId =
      isSameAddress === true
        ? apiObj.streetStateId
        : apiObj.postalStateId
        ? apiObj.postalStateId
        : null;
    apiObj.postalState = apiObj.postalState;
    apiObj.postalPostcode = apiObj.postalPostcode
      ? apiObj.postalPostcode
      : null;

    apiObj.postalCountryId = apiObj.postalCountryId;

    // Provider details
    apiObj.abnNumber = apiObj.abnNumber ? apiObj.abnNumber : null;
    apiObj.acnNumber = apiObj.acnNumber ? apiObj.acnNumber : null;
    apiObj.providerNumber = apiObj.providerNumber
      ? apiObj.providerNumber
      : null;
    apiObj.businessName = apiObj.businessName ? apiObj.businessName : null;

    // Provider street address
    apiObj.providerStreetAddressLine1 = apiObj.providerStreetAddressLine1
      ? apiObj.providerStreetAddressLine1
      : null;
    apiObj.providerStreetAddressLine2 = apiObj.providerStreetAddressLine2
      ? apiObj.providerStreetAddressLine2
      : null;
    apiObj.providerStreetSuburbId = apiObj.providerStreetSuburbId;
    apiObj.providerStreetSuburb = apiObj.providerStreetSuburb;
    apiObj.providerStreetStateId = apiObj.providerStreetStateId
      ? apiObj.providerStreetStateId
      : null;
    apiObj.providerStreetState = apiObj.providerStreetState;
    apiObj.providerStreetPostcode = apiObj.providerStreetPostcode
      ? apiObj.providerStreetPostcode
      : null;
    apiObj.providerStreetCountryId = apiObj.providerStreetCountryId;

    // Provider postal address
    apiObj.isSameHeadOfficeProviderPostalAddress = isSecondSameAddress;
    // apiObj.isSameHeadOfficeProviderPostalAddress;
    apiObj.providerPostalAddressLine1 = apiObj.providerPostalAddressLine1
      ? apiObj.providerPostalAddressLine1
      : null;
    apiObj.providerPostalAddressLine2 = apiObj.providerPostalAddressLine2
      ? apiObj.providerPostalAddressLine2
      : null;
    apiObj.providerPostalSuburbId =
      isSecondSameAddress === true
        ? apiObj.providerStreetSuburbId
        : apiObj.providerPostalSuburbId
        ? apiObj.providerPostalSuburbId
        : null;
    apiObj.providerPostalSuburb = apiObj.providerPostalSuburb;
    apiObj.providerPostalStateId =
      isSecondSameAddress === true
        ? apiObj.providerStreetStateId
        : apiObj.providerPostalStateId
        ? apiObj.providerPostalStateId
        : null;
    apiObj.providerPostalState = apiObj.providerPostalState;

    apiObj.providerPostalPostcode = apiObj.providerPostalPostcode
      ? apiObj.providerPostalPostcode
      : null;
    apiObj.providerPostalCountryId = apiObj.providerPostalCountryId;

    setLoading(true);
    facilityDetailsService.updateFacilitiesServiceDetails(apiObj).then(
      (res) => {
        setLoading(false);
        setSuccessAlertOptions({
          title: "",
          actionType: EDIT,
          msg: res.message,

          callback: () => {
            setShowSuccessAlert(false);
            getFacilityServiceDetailsAfterCallback(facilityId);
            getCallbackSetPopUp(false);
          },
        });
        setShowSuccessAlert(true);
      },
      () => {
        setLoading(false);
      }
    );
    setSubmitting(false);
  }
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      innerRef={ref}
      validationSchema={Yup.object().shape({
        facilityName: Yup.string().required(),
        primaryMobile: Yup.string()
          .matches(phoneRegExp, "Mobile number is not valid")
          .max(13)
          .min(10),
        primaryPhone: Yup.string()
          .matches(phoneRegExp, "Phone number is not valid")
          .max(11)
          .min(8),
        secondaryMobile: Yup.string()
          .matches(phoneRegExp, "Mobile number is not valid")
          .max(13)
          .min(10),
        secondaryPhone: Yup.string()
          .matches(phoneRegExp, "Phone number is not valid")
          .max(11)
          .min(8),
        primaryEmail: Yup.string().matches(
          "^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$"
        ),
        primaryAlternativeEmail: Yup.string().matches(
          "^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$"
        ),
        secondaryEmail: Yup.string().matches(
          "^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$"
        ),
        secondaryAlternativeEmail: Yup.string().matches(
          "^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$"
        ),
        acnNumber: Yup.string()
          .max(9)
          .min(9),
        abnNumber: Yup.string()
          .max(11)
          .min(11),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveFacility}
    >
      {({
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        values,
        setFieldValue,
      }) => (
        <>
          {loading ? (
            <Loader></Loader>
          ) : (
            <Page title={"Facilities"}>
              <Form onSubmit={handleSubmit}>
                {showSuccessAlert && (
                  <SuccessAlert
                    type={successAlertOptions.actionType}
                    msg={successAlertOptions.msg}
                    title={successAlertOptions.title}
                    callback={successAlertOptions.callback}
                  ></SuccessAlert>
                )}
                <UpdateExtraService
                  type={actionType}
                  data={selectedRowData}
                  showModel={showAddEditForm}
                  tableExtra={tableExtra}
                  callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
                />
                <Button
                  type="submit"
                  className="addbtn btn btn-primary sm btnright justify-content-end"
                  style={{ marginTop: "5px", width: "90px" }}
                >
                  {SAVE}
                </Button>
                <DirtyWarningAlert
                  sourceName="Facility Service Details"
                  messageBody={
                    "Are you sure you want to exit to the Facility Service Details and discard these changes?"
                  }
                />
                <div
                  className="container"
                  style={{ maxWidth: "120%", marginTop: "10px" }}
                >
                  <div className="row">
                    {/* first */}
                    <div className="col-6">
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        {"Provider (Entity) & Service Details"}
                      </div>
                      <hr />
                      <Row style={{ marginLeft: "-60px" }}>
                        <Row className="mt-4 labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="facilityName"
                              column
                              sm={3}
                              className={
                                errors.facilityName && touched.facilityName
                                  ? " is-invalid-label required-field"
                                  : "required-field"
                              }
                            >
                              Facility Name
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="facilityName"
                                type="text"
                                value={values.facilityName}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                autoComplete="off"
                                // className="text form-control"
                                className={
                                  "text form-control" +
                                  (errors.facilityName && touched.facilityName
                                    ? " is-invalid"
                                    : "")
                                }
                                maxLength="250"
                                isvalid={
                                  touched.facilityName && !errors.facilityName
                                }
                              />
                              <InlineBottomErrorMessage
                                style={{ textAlign: "left" }}
                                name="facilityName"
                              />
                            </Col>
                          </FormGroup>
                        </Row>

                        <Row className="labelsize mt-2">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="racsNumber"
                              column
                              sm={3}
                            >
                              {"RACS Number"}
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="racsNumber"
                                type="text"
                                value={values.racsNumber}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                maxLength="250"
                                autoComplete="off"
                                className={"text form-control"}
                              />
                              <InlineBottomErrorMessage
                                style={{ textAlign: "left" }}
                                name="racsNumber"
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>
                      <br />
                    </div>
                    {/* second */}
                    <div className="col-6">
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        {"Default Signatories"}
                      </div>
                      <hr />
                      <Row style={{ marginTop: "40px" }}>
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="providerRepresentative"
                            column
                            sm={3}
                          >
                            Provider Representative
                          </Label>
                          <Col sm={9}>
                            <Field
                              name="providerRepresentative"
                              type="text"
                              value={values.providerRepresentative}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              autoComplete="off"
                              maxLength="250"
                              className="text form-control"
                            />
                            <InlineBottomErrorMessage
                              style={{ textAlign: "left" }}
                              name="providerRepresentative"
                            />
                          </Col>
                        </FormGroup>
                      </Row>

                      <Row className="labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="witness"
                            column
                            sm={3}
                          >
                            Witness
                          </Label>
                          <Col>
                            <Field
                              name="witness"
                              type="text"
                              value={values.witness}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              maxLength="250"
                              autoComplete="off"
                              className={"text form-control"}
                            />
                            <InlineBottomErrorMessage
                              style={{ textAlign: "left" }}
                              name="witness"
                            />
                          </Col>
                        </FormGroup>
                      </Row>
                      <br />
                    </div>
                    {/* Third */}
                    <div className="col-6">
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        {"Key Contact Details (Primary)"}
                      </div>
                      <hr />
                      <Row style={{ marginLeft: "-60px" }}>
                        <Row className="mt-4 labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor=" "
                              sm={3}
                            >
                              {"Title"}
                            </Label>
                            <Col sm={9}>
                              <SingleSelect
                                sm={7}
                                name="primaryTitleId"
                                id="primaryTitleId"
                                className="text-start"
                                onChange={(state) => {
                                  setFieldValue(
                                    "primaryTitleId",
                                    state.title_type_id
                                  );
                                  setSelectedPrimaryTitle(state);
                                  getAllCallback(true);
                                }}
                                placeholder="Select..."
                                options={primaryTitleTypeList}
                                value={selectedPrimaryTitle}
                              />
                            </Col>
                          </FormGroup>
                        </Row>

                        <Row className="text-end labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="primaryFirstName"
                              column
                              sm={3}
                            >
                              First Name
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="primaryFirstName"
                                type="text"
                                value={values.primaryFirstName}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                maxLength="250"
                                autoComplete="off"
                                className={"text form-control"}
                              />
                            </Col>
                          </FormGroup>
                        </Row>

                        <Row className="text-end labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="primarySurname"
                              column
                              sm={3}
                            >
                              Surname
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="primarySurname"
                                type="text"
                                value={values.primarySurname}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                maxLength="250"
                                autoComplete="off"
                                className={"text form-control"}
                              />
                            </Col>
                          </FormGroup>
                        </Row>

                        <Row className="text-end labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="primaryPosition"
                              column
                              sm={3}
                            >
                              Position
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="primaryPosition"
                                type="text"
                                value={values.primaryPosition}
                                onBlur={handleBlur}
                                maxLength="250"
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                autoComplete="off"
                                className={"text form-control"}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className=" labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="primaryPhone"
                              column
                              sm={3}
                              className={
                                errors.primaryPhone && touched.primaryPhone
                                  ? " is-invalid-label "
                                  : ""
                              }
                            >
                              Phone
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="primaryPhone"
                                type="text"
                                value={values.primaryPhone}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                max="11"
                                autoComplete="off"
                                className={
                                  "text form-control" +
                                  (errors.primaryPhone && touched.primaryPhone
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <InlineBottomErrorMessage
                                name="primaryPhone"
                                msg="Please input a valid number"
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="primaryMobile"
                              column
                              sm={3}
                              className={
                                errors.primaryMobile && touched.primaryMobile
                                  ? " is-invalid-label "
                                  : ""
                              }
                            >
                              Mobile
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="primaryMobile"
                                type="text"
                                value={values.primaryMobile}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                max="11"
                                autoComplete="off"
                                className={
                                  "text form-control" +
                                  (errors.primaryMobile && touched.primaryMobile
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <InlineBottomErrorMessage
                                name="primaryMobile"
                                msg="Please Input a valid number"
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="primaryEmail"
                              column
                              sm={3}
                              className={
                                errors.primaryEmail && touched.primaryEmail
                                  ? " is-invalid-label "
                                  : ""
                              }
                            >
                              Email
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="primaryEmail"
                                type="text"
                                value={values.primaryEmail}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                max="11"
                                autoComplete="off"
                                className={
                                  "text form-control" +
                                  (errors.primaryEmail && touched.primaryEmail
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <InlineBottomErrorMessage
                                name="primaryEmail"
                                msg="Please Input a valid email"
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className=" labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="primaryAlternativeEmail"
                              column
                              sm={3}
                              className={
                                errors.primaryAlternativeEmail &&
                                touched.primaryAlternativeEmail
                                  ? " is-invalid-label "
                                  : ""
                              }
                            >
                              Alternative Email
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="primaryAlternativeEmail"
                                type="text"
                                value={values.primaryAlternativeEmail}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                max="11"
                                autoComplete="off"
                                className={
                                  "text form-control" +
                                  (errors.primaryAlternativeEmail &&
                                  touched.primaryAlternativeEmail
                                    ? " is-invalid"
                                    : "")
                                }
                              />

                              <InlineBottomErrorMessage
                                name="primaryAlternativeEmail"
                                msg="Please Input a valid email"
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              // htmlFor=" "
                              sm={3}
                            >
                              Preferred Contact
                            </Label>
                            <Col sm={9}>
                              <SingleSelect
                                sm={7}
                                name="primaryPreferredContactId"
                                onChange={(state) => {
                                  setFieldValue(
                                    "primaryPreferredContactId",
                                    state.id
                                  );
                                  setSelectedPrimaryPreferredContact(state);
                                  getAllCallback(true);
                                }}
                                placeholder="Select..."
                                options={preferredContactList}
                                value={
                                  selectedPrimaryPreferredContact
                                  // &&
                                  // Object.keys(selectedPrimaryPreferredContact)
                                  //   .length > 0
                                  //   ? selectedPrimaryPreferredContact
                                  //   : null
                                }
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        <Row className="labelsize">
                          {" "}
                          <FormGroup row>
                            <Label sm={3} style={{ textAlign: "right" }}>
                              Contactable After Hours
                            </Label>
                            <Col sm={9}>
                              <FormGroup>
                                <Field
                                  name="primaryContactableAfterHours"
                                  type="checkbox"
                                  style={{
                                    marginTop: "10px",
                                  }}
                                  onChange={(e) => {
                                    handleChange(e);
                                    getAllCallback(true);
                                  }}
                                  checked={values.primaryContactableAfterHours}
                                />{" "}
                                <Label style={{ color: "gray" }} check>
                                  {values.primaryContactableAfterHours}
                                </Label>
                              </FormGroup>
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>
                      <br />
                    </div>
                    {/* Fourth */}
                    <div className="col-6">
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        {"Key Contact Details (Secondary)"}
                      </div>
                      <hr />
                      <Row className=" labelsize" style={{ marginTop: "40px" }}>
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor=" "
                            sm={3}
                          >
                            {"Title"}
                          </Label>
                          <Col sm={9}>
                            <SingleSelect
                              sm={7}
                              name="secondaryTitleId"
                              id="secondaryTitleId"
                              className="text-start"
                              onChange={(state) => {
                                setFieldValue(
                                  "secondaryTitleId",
                                  state.title_type_id
                                );
                                setSelectedSecondaryTitle(state);
                                getAllCallback(true);
                              }}
                              placeholder="Select..."
                              options={secondaryTitleTypeList}
                              isOptionSelected={(x) => {
                                return (
                                  selectedSecondaryTitle &&
                                  x.id === selectedSecondaryTitle.id
                                );
                              }}
                              value={selectedSecondaryTitle}
                            />
                          </Col>
                        </FormGroup>
                      </Row>

                      <Row className="text-end labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="secondaryFirstName"
                            column
                            sm={3}
                          >
                            First Name
                          </Label>
                          <Col sm={9}>
                            <Field
                              name="secondaryFirstName"
                              type="text"
                              value={values.secondaryFirstName}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              maxLength="250"
                              autoComplete="off"
                              className={"text form-control"}
                            />
                          </Col>
                        </FormGroup>
                      </Row>

                      <Row className="text-end labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="secondarySurname"
                            column
                            sm={3}
                          >
                            Surname
                          </Label>
                          <Col sm={9}>
                            <Field
                              name="secondarySurname"
                              type="text"
                              value={values.secondarySurname}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              maxLength="250"
                              autoComplete="off"
                              className={"text form-control"}
                            />
                          </Col>
                        </FormGroup>
                      </Row>

                      <Row className="text-end labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="secondaryPosition"
                            column
                            sm={3}
                          >
                            Position
                          </Label>
                          <Col sm={9}>
                            <Field
                              name="secondaryPosition"
                              type="text"
                              value={values.secondaryPosition}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              maxLength="250"
                              autoComplete="off"
                              className={"text form-control"}
                            />
                          </Col>
                        </FormGroup>
                      </Row>
                      <Row className="labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="secondaryPhone"
                            column
                            sm={3}
                            className={
                              errors.secondaryPhone && touched.secondaryPhone
                                ? " is-invalid-label "
                                : ""
                            }
                          >
                            Phone
                          </Label>
                          <Col sm={9}>
                            <Field
                              name="secondaryPhone"
                              type="text"
                              value={values.secondaryPhone}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              max="11"
                              autoComplete="off"
                              className={
                                "text form-control" +
                                (errors.secondaryPhone && touched.secondaryPhone
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <InlineBottomErrorMessage
                              name="secondaryPhone"
                              msg="Please Input a valid number"
                            />
                          </Col>
                        </FormGroup>
                      </Row>
                      <Row className="labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="secondaryMobile"
                            column
                            sm={3}
                            className={
                              errors.secondaryMobile && touched.secondaryMobile
                                ? " is-invalid-label "
                                : ""
                            }
                          >
                            Mobile
                          </Label>
                          <Col sm={9}>
                            <Field
                              name="secondaryMobile"
                              type="text"
                              value={values.secondaryMobile}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              max="11"
                              autoComplete="off"
                              className={
                                "text form-control" +
                                (errors.secondaryMobile &&
                                touched.secondaryMobile
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <InlineBottomErrorMessage
                              name="secondaryMobile"
                              msg="Please Input a valid number"
                            />
                          </Col>
                        </FormGroup>
                      </Row>
                      <Row className="labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="secondaryEmail"
                            column
                            sm={3}
                            className={
                              errors.secondaryEmail && touched.secondaryEmail
                                ? " is-invalid-label "
                                : ""
                            }
                          >
                            Email
                          </Label>
                          <Col sm={9}>
                            <Field
                              name="secondaryEmail"
                              type="text"
                              value={values.secondaryEmail}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              max="11"
                              autoComplete="off"
                              className={
                                "text form-control" +
                                (errors.secondaryEmail && touched.secondaryEmail
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <InlineBottomErrorMessage
                              name="secondaryEmail"
                              msg="Please Input a valid email"
                            />
                          </Col>
                        </FormGroup>
                      </Row>
                      <Row className="labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="secondaryAlternativeEmail"
                            column
                            sm={3}
                            className={
                              errors.secondaryAlternativeEmail &&
                              touched.secondaryAlternativeEmail
                                ? " is-invalid-label "
                                : ""
                            }
                          >
                            Alternative Email
                          </Label>
                          <Col sm={9}>
                            <Field
                              name="secondaryAlternativeEmail"
                              type="text"
                              value={values.secondaryAlternativeEmail}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              max="11"
                              autoComplete="off"
                              className={
                                "text form-control" +
                                (errors.secondaryAlternativeEmail &&
                                touched.secondaryAlternativeEmail
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <InlineBottomErrorMessage
                              name="secondaryAlternativeEmail"
                              msg="Please Input a valid email"
                            />
                          </Col>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor=" "
                            sm={3}
                          >
                            Preferred Contact
                          </Label>
                          <Col sm={9}>
                            <SingleSelect
                              sm={7}
                              name="secondaryPreferredContactId"
                              onChange={(state) => {
                                setFieldValue(
                                  "secondaryPreferredContactId",
                                  state.id
                                );
                                setSelectedSecondaryPreferredContact(state);
                                getAllCallback(true);
                              }}
                              placeholder="Select..."
                              options={preferredSecondaryContactList}
                              value={
                                selectedSecondaryPreferredContact &&
                                Object.keys(selectedSecondaryPreferredContact)
                                  .length > 0
                                  ? selectedSecondaryPreferredContact
                                  : null
                              }
                            />
                          </Col>
                        </FormGroup>
                      </Row>
                      <Row className="labelsize">
                        {" "}
                        <FormGroup row>
                          <Label sm={3} style={{ textAlign: "right" }}>
                            Contactable After Hours
                          </Label>
                          <Col sm={9}>
                            <FormGroup>
                              <Field
                                name="secondaryContactableAfterHours"
                                type="checkbox"
                                style={{
                                  marginTop: "10px",
                                }}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                checked={values.secondaryContactableAfterHours}
                              />{" "}
                              <Label style={{ color: "gray" }} check>
                                {values.secondaryContactableAfterHours}
                              </Label>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </Row>
                      <br />
                    </div>
                    {/* Fifth Table */}
                    <div className="col-12">
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        {"Default Extra Service Charge"}
                      </div>
                      <hr />
                      {/* React Table for Edit */}
                      <FacilityReactTable
                        columns={columns}
                        data={viewDataList}
                      ></FacilityReactTable>
                    </div>
                    {/* Sixth Street Add */}
                    <div className="w-100"></div>
                    <div className="col-6">
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        Facility Street Address
                      </div>
                      <hr />
                      <Row style={{ marginLeft: "-56px" }}>
                        <Row className="text-end mt-4 labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="streetAddressLine1"
                              column
                              sm={3}
                            >
                              Address Line 1
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="streetAddressLine1"
                                type="text"
                                value={values.streetAddressLine1}
                                onBlur={() => {
                                  if (isSameAddress) {
                                    setFieldValue(
                                      "postalAddressLine1",
                                      values.streetAddressLine1
                                    );
                                  }
                                }}
                                maxLength="250"
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                autoComplete="off"
                                className={"text form-control"}
                                isvalid={
                                  touched.streetAddressLine1 &&
                                  !errors.streetAddressLine1
                                }
                              />
                            </Col>
                          </FormGroup>
                        </Row>

                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="streetAddressLine2"
                              column
                              sm={3}
                            >
                              Address Line 2
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="streetAddressLine2"
                                type="text"
                                value={values.streetAddressLine2}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                maxLength="250"
                                onBlur={() => {
                                  if (isSameAddress) {
                                    setFieldValue(
                                      "postalAddressLine2",
                                      values.streetAddressLine2
                                    );
                                  }
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
                              style={{ textAlign: "right" }}
                              htmlFor="abn"
                              column
                              sm={3}
                            >
                              Suburb/ Town
                            </Label>
                            <Col sm={9}>
                              {selectedStreetCountry &&
                              selectedStreetCountry.description ===
                                "Australia" ? (
                                <>
                                  <SingleSelect
                                    name="Suburb"
                                    placeholder="Select..."
                                    onChange={(selected) => {
                                      setSelectedStreetSuburb({
                                        ...selected,
                                        label: selected.value,
                                      });
                                      getAllCallback(true);
                                      setFieldValue(
                                        "streetPostcode",
                                        selected.postcode
                                      );
                                      setFieldValue(
                                        "streetSuburbId",
                                        selected.id
                                      );
                                      setFieldValue(
                                        "streetStateId",
                                        selected.stateId
                                      );
                                      const tmpSltState = stateList.find(
                                        (ob) => ob.state_id === selected.stateId
                                      );
                                      setSelectedStreetState(
                                        tmpSltState ? tmpSltState : {}
                                      );
                                      if (isSameAddress) {
                                        setFieldValue(
                                          "postalPostcode",
                                          selected.postcode
                                        );
                                        setSelectedPostalSuburb({
                                          ...selected,
                                          label: selected.value,
                                        });
                                        setFieldValue(
                                          "streetStateId",
                                          selected.stateId
                                        );
                                        setSelectedPostalState(
                                          tmpSltState ? tmpSltState : {}
                                        );
                                      }
                                    }}
                                    options={suburbList}
                                    value={selectedStreetSuburb}
                                    defaultValue={selectedStreetSuburb}
                                  />
                                  <ErrorMessage
                                    name="rep_suburb"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </>
                              ) : (
                                <>
                                  <Field
                                    name="streetSuburb"
                                    type="text"
                                    value={values.streetSuburb}
                                    onBlur={() => {
                                      if (isSameAddress) {
                                        setFieldValue(
                                          "postalSuburb",
                                          values.streetSuburb
                                        );
                                      }
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      getAllCallback(true);
                                    }}
                                    className={
                                      "form-control" +
                                      (errors.rep_suburb && touched.rep_suburb
                                        ? " is-invalid"
                                        : "")
                                    }
                                    maxLength="250"
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
                              style={{ textAlign: "right" }}
                              htmlFor="streetStateId"
                              column
                              sm={3}
                            >
                              State
                            </Label>
                            <Col sm={9}>
                              {selectedStreetCountry &&
                              selectedStreetCountry.description ===
                                "Australia" ? (
                                <>
                                  <SingleSelect
                                    menuPlacement="top"
                                    name="state"
                                    placeholder="Select..."
                                    onChange={(selected) => {
                                      getAllCallback(true);
                                      setFieldValue(
                                        "streetStateId",
                                        selected.state_id
                                      );
                                      setSelectedStreetState(selected);
                                      // getSuburbList(
                                      //   null,
                                      //   selected.state_id,
                                      //   "street"
                                      // );
                                      setSelectedStreetSuburb(null);
                                      const tmfltrSub = CPYsuburbList.filter(
                                        (st) => st.stateId === selected.state_id
                                      );
                                      setsuburbList(tmfltrSub);
                                      if (isSameAddress) {
                                        setFieldValue(
                                          "postalStateId",
                                          selected.state_id
                                        );
                                        setSelectedPostalSuburb(null);
                                        setSelectedPostalState(selected);
                                        setPostalsuburbList(tmfltrSub);
                                      }
                                    }}
                                    options={stateList}
                                    isOptionSelected={(x) => {
                                      return selectedStreetState &&
                                        x.state_id ===
                                          selectedStreetState.state_id
                                        ? x
                                        : null;
                                    }}
                                    value={selectedStreetState}
                                    defaultValue={selectedStreetState}
                                  />
                                </>
                              ) : (
                                <>
                                  <Field
                                    name="streetState"
                                    type="text"
                                    value={values.streetState}
                                    onBlur={() => {
                                      if (isSameAddress) {
                                        setFieldValue(
                                          "postalState",
                                          values.streetState
                                        );
                                      }
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      getAllCallback(true);
                                    }}
                                    className={"text form-control"}
                                    maxLength="250"
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
                              htmlFor="streetPostcode"
                              column
                              sm={3}
                            >
                              Postcode
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="streetPostcode"
                                type="text"
                                value={values.streetPostcode}
                                onBlur={() => {
                                  if (isSameAddress) {
                                    setFieldValue(
                                      "postalPostcode",
                                      values.streetPostcode
                                    );
                                  }
                                }}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
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
                              style={{ textAlign: "right" }}
                              htmlFor="acn"
                              column
                              sm={3}
                            >
                              Country
                            </Label>
                            <Col sm={9}>
                              <>
                                <SingleSelect
                                  name="country"
                                  menuPlacement="auto"
                                  placeholder="Select..."
                                  onChange={(selected) => {
                                    getAllCallback(true);
                                    setFieldValue(
                                      "streetCountryId",
                                      selected.id
                                    );
                                    setSelectedStreetCountry(selected);
                                    setFieldValue("streetPostcode", "");
                                    setFieldValue("streetState", "");
                                    setFieldValue("streetSuburb", "");
                                    setFieldValue("streetAddressLine1", "");
                                    setFieldValue("streetAddressLine2", "");
                                    setSelectedStreetState(null);
                                    setSelectedStreetSuburb(null);
                                    if (isSameAddress) {
                                      setFieldValue(
                                        "postalCountryId",
                                        selected.id
                                      );
                                      setSelectedPostalCountry(selected);
                                      setFieldValue("postalPostcode", "");
                                      setFieldValue("postalState", "");
                                      setFieldValue("postalSuburb", "");
                                      setFieldValue("postalAddressLine1", "");
                                      setFieldValue("postalAddressLine2", "");
                                      setSelectedPostalState(null);
                                      setSelectedPostalSuburb(null);
                                    }
                                  }}
                                  options={countryList}
                                  value={selectedStreetCountry}
                                  defaultValue={selectedStreetCountry}
                                />
                              </>
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>
                      <br />
                    </div>
                    {/* seveth Post Add */}
                    <div className="col-6">
                      <div className="d-flex">
                        <div className="head mt-3">
                          <img src={Icon} className="icon" />
                          Facility Postal Address
                        </div>
                        <Field
                          name="isSameHeadOfficeFacilityPostalAddress"
                          type="checkbox"
                          style={{
                            marginTop: "17px",
                            marginLeft: "10px",
                          }}
                          maxLength="250"
                          checked={isSameAddress}
                          onChange={() => {
                            getAllCallback(true);
                            setIsSameAddress(!isSameAddress);
                            setFieldValue(
                              "isSameHeadOfficeFacilityPostalAddress",
                              !isSameAddress
                            );
                            setPostalAddress(
                              !isSameAddress,
                              setFieldValue,
                              values
                            );
                          }}
                        />
                        <label
                          style={{
                            marginTop: "20px",
                            marginLeft: "10px",
                          }}
                        >
                          Postal Address is same as Facility Address
                        </label>
                      </div>
                      <hr />
                      <Row className="text-end mt-4 labelsize">
                        <FormGroup row style={{ marginTop: "8px" }}>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="postalAddressLine1"
                            column
                            sm={3}
                          >
                            Address Line 1
                          </Label>
                          <Col sm={9}>
                            <Field
                              disabled={isSameAddress}
                              name="postalAddressLine1"
                              type="text"
                              value={values.postalAddressLine1}
                              onBlur={handleBlur}
                              maxLength="250"
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              autoComplete="off"
                              className={"text form-control"}
                              // style={
                              //   isSameAddress === true ? { color: "gray" } : {}
                              // }
                              // isvalid={touched.entityName && !errors.entityName}
                            />
                            <ErrorMessage
                              name="entityName"
                              component="div"
                              style={{ textAlign: "left" }}
                              className="invalid-feedback"
                            />
                          </Col>
                        </FormGroup>
                      </Row>

                      <Row className="labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="postalAddressLine2"
                            column
                            sm={3}
                          >
                            Address Line 2
                          </Label>
                          <Col sm={9}>
                            <Field
                              disabled={isSameAddress}
                              name="postalAddressLine2"
                              type="text"
                              value={values.postalAddressLine2}
                              onBlur={handleBlur}
                              maxLength="250"
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              autoComplete="off"
                              className={"text form-control"}
                              // style={
                              //   isSameAddress === true ? { color: "gray" } : {}
                              // }
                            />
                          </Col>
                        </FormGroup>
                      </Row>

                      <Row className="labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="abn"
                            column
                            sm={3}
                          >
                            Suburb / Town
                          </Label>
                          <Col sm={9}>
                            {selectedPostalCountry &&
                            selectedPostalCountry.description ===
                              "Australia" ? (
                              <>
                                <SingleSelect
                                  disabled={isSameAddress}
                                  name="postalSuburbId"
                                  placeholder="Select..."
                                  onChange={(selected) => {
                                    getAllCallback(true);
                                    setFieldValue(
                                      "postalPostcode",
                                      selected.postcode
                                    );
                                    setFieldValue(
                                      "postalSuburbId",
                                      selected.id
                                    );
                                    setSelectedPostalSuburb({
                                      ...selected,
                                      label: selected.value,
                                    });
                                    setFieldValue(
                                      "postalStateId",
                                      selected.stateId
                                    );
                                    setSelectedPostalState(
                                      stateList.find(
                                        (ob) => ob.state_id === selected.stateId
                                      )
                                    );
                                  }}
                                  options={PostalsuburbList}
                                  isDisabled={isSameAddress}
                                  value={selectedPostalSuburb}
                                />
                                <ErrorMessage
                                  name="rep_suburb"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </>
                            ) : (
                              <>
                                <Field
                                  disabled={isSameAddress}
                                  name="postalSuburb"
                                  type="text"
                                  value={values.postalSuburb}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    handleChange(e);
                                    getAllCallback(true);
                                  }}
                                  maxLength="250"
                                  className={"text form-control"}
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
                            style={{ textAlign: "right" }}
                            htmlFor="postalStateId"
                            column
                            sm={3}
                          >
                            State
                          </Label>
                          <Col sm={9}>
                            {selectedPostalCountry &&
                            selectedPostalCountry.description ===
                              "Australia" ? (
                              <>
                                <SingleSelect
                                  isDisabled={isSameAddress}
                                  name="state"
                                  placeholder="Select..."
                                  onChange={(selected) => {
                                    getAllCallback(true);
                                    setFieldValue(
                                      "postalStateId",
                                      selected.state_id
                                    );
                                    setSelectedPostalState(selected);
                                    // getSuburbList(
                                    //   null,
                                    //   selected.state_id,
                                    //   "postal"
                                    // );
                                    setSelectedPostalSuburb(null);
                                    setPostalsuburbList(
                                      CPYsuburbList.filter(
                                        (st) => st.stateId === selected.state_id
                                      )
                                    );
                                  }}
                                  options={stateList}
                                  isOptionSelected={(x) => {
                                    return selectedPostalState &&
                                      x.state_id ===
                                        selectedPostalState.state_id
                                      ? x
                                      : null;
                                  }}
                                  value={selectedPostalState}
                                  defaultValue={selectedPostalState}
                                />
                              </>
                            ) : (
                              <>
                                <Field
                                  disabled={isSameAddress}
                                  name="postalState"
                                  type="text"
                                  value={values.postalState}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    handleChange(e);
                                    getAllCallback(true);
                                  }}
                                  className={"text form-control"}
                                  maxLength="250"
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
                            htmlFor="postalPostcode"
                            column
                            sm={3}
                          >
                            Postcode
                          </Label>
                          <Col sm={9}>
                            <Field
                              disabled={isSameAddress}
                              name="postalPostcode"
                              type="text"
                              value={values.postalPostcode}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
                              }}
                              autoComplete="off"
                              className={"text form-control "}
                              // style={
                              //   isSameAddress === true ? { color: "gray" } : {}
                              // }
                            />
                          </Col>
                        </FormGroup>
                      </Row>
                      <Row className="labelsize">
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="acn"
                            column
                            sm={3}
                          >
                            Country
                          </Label>
                          <Col sm={9}>
                            <>
                              <SingleSelect
                                isDisabled={isSameAddress}
                                className="select-disable"
                                name="country"
                                placeholder="Select..."
                                onChange={(selected) => {
                                  getAllCallback(true);
                                  setFieldValue("postalCountryId", selected.id);
                                  setSelectedPostalCountry(selected);
                                  setFieldValue("postalPostcode", "");
                                  setFieldValue("postalState", "");
                                  setFieldValue("postalSuburb", "");
                                  setFieldValue("postalAddressLine1", "");
                                  setFieldValue("postalAddressLine2", "");
                                  setSelectedPostalState(null);
                                  setSelectedPostalSuburb(null);
                                }}
                                options={countryList}
                                value={selectedPostalCountry}
                                defaultValue={selectedPostalCountry}
                              />
                            </>
                          </Col>
                        </FormGroup>
                      </Row>

                      <br />
                    </div>
                    {/* Eigth Provider */}

                    <div className="col-6">
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        {"Provider Details"}
                      </div>
                      <hr />
                      <Row style={{ marginLeft: "-56px" }}>
                        <Row className="mt-4 labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="abnNumber"
                              column
                              sm={3}
                              className={
                                errors.abnNumber && touched.abnNumber
                                  ? " is-invalid-label "
                                  : ""
                              }
                            >
                              ABN Number
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="abnNumber"
                                maxLength="11"
                                type="text"
                                value={values.abnNumber}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                autoComplete="off"
                                className={
                                  "text form-control" +
                                  (errors.abnNumber && touched.abnNumber
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <InlineBottomErrorMessage
                                name="abnNumber"
                                msg="Please input valid ABN number"
                              />
                            </Col>
                          </FormGroup>
                        </Row>

                        <Row className="mt-2 labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="acnNumber"
                              column
                              sm={3}
                              className={
                                errors.acnNumber && touched.acnNumber
                                  ? " is-invalid-label "
                                  : ""
                              }
                            >
                              ACN Number
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="acnNumber"
                                type="text"
                                maxLength="9"
                                value={values.acnNumber}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                autoComplete="off"
                                className={
                                  "text form-control" +
                                  (errors.acnNumber && touched.acnNumber
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <InlineBottomErrorMessage
                                name="acnNumber"
                                msg="Please input valid ACN number"
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>
                      <Row style={{ marginLeft: "-60px" }}>
                        <Row className="mt-2 labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="providerNumber"
                              column
                              sm={3}
                            >
                              Provider Number
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="providerNumber"
                                type="text"
                                value={values.providerNumber}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                autoComplete="off"
                                className="text form-control"
                              />
                              <InlineBottomErrorMessage
                                style={{ textAlign: "left" }}
                                name="providerNumber"
                              />
                            </Col>
                          </FormGroup>
                        </Row>

                        <Row className="mt-2 labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="businessName"
                              column
                              sm={3}
                            >
                              Business Name
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="businessName"
                                type="text"
                                value={values.businessName}
                                onBlur={handleBlur}
                                maxLength="250"
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                autoComplete="off"
                                className="text form-control"
                              />
                              <InlineBottomErrorMessage
                                style={{ textAlign: "left" }}
                                name="businessName"
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>
                    </div>
                    <div className="col-6"></div>
                    {/* Nineth  Street address */}
                    <div className="col-6">
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        Provider Street Address
                      </div>
                      <hr />
                      <Row style={{ marginLeft: "-56px" }}>
                        <Row className="text-end mt-4 labelsize">
                          <FormGroup row style={{ marginTop: "8px" }}>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="providerStreetAddressLine1"
                              column
                              sm={3}
                            >
                              Address Line 1
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="providerStreetAddressLine1"
                                type="text"
                                value={values.providerStreetAddressLine1}
                                onBlur={() => {
                                  if (isSecondSameAddress) {
                                    setFieldValue(
                                      "providerPostalAddressLine1",
                                      values.providerStreetAddressLine1
                                    );
                                  }
                                }}
                                maxLength="250"
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                autoComplete="off"
                                className={"text form-control"}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>
                      <Row style={{ marginLeft: "-56px" }}>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="providerStreetAddressLine2"
                              column
                              sm={3}
                            >
                              Address Line 2
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="providerStreetAddressLine2"
                                type="text"
                                value={values.providerStreetAddressLine2}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                maxLength="250"
                                onBlur={() => {
                                  if (isSecondSameAddress) {
                                    setFieldValue(
                                      "providerPostalAddressLine2",
                                      values.providerStreetAddressLine2
                                    );
                                  }
                                }}
                                autoComplete="off"
                                className={"text form-control"}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>
                      <Row style={{ marginLeft: "-56px" }}>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="abn"
                              column
                              sm={3}
                            >
                              Suburb / Town
                            </Label>
                            <Col sm={9}>
                              {selectedProviderStreetCountry &&
                              selectedProviderStreetCountry.description ===
                                "Australia" ? (
                                <>
                                  <SingleSelect
                                    menuPlacement="top"
                                    name="providerStreetSuburbId"
                                    placeholder="Select..."
                                    className="select-disable"
                                    onChange={(selected) => {
                                      getAllCallback(true);
                                      setFieldValue(
                                        "providerStreetPostcode",
                                        selected.postcode
                                      );
                                      setFieldValue(
                                        "providerStreetSuburbId",
                                        selected.id
                                      );
                                      setFieldValue(
                                        "providerStreetStateId",
                                        selected.stateId
                                      );
                                      setSelectedProviderStreetSuburb({
                                        ...selected,
                                        label: selected.value,
                                      });
                                      const tmpSelectedState = stateList.find(
                                        (ob) => ob.state_id === selected.stateId
                                      );
                                      setSelectedProviderStreetState(
                                        tmpSelectedState ? tmpSelectedState : {}
                                      );
                                      if (isSecondSameAddress) {
                                        setFieldValue(
                                          "providerPostalPostcode",
                                          selected.postcode
                                        );
                                        setSelectedProviderPostalSuburb({
                                          ...selected,
                                          label: selected.value,
                                        });
                                        setFieldValue(
                                          "providerPostalStateId",
                                          selected.stateId
                                        );
                                        setSelectedProviderPostalState(
                                          tmpSelectedState
                                            ? tmpSelectedState
                                            : {}
                                        );
                                      }
                                    }}
                                    options={ProviderStreetSuburbList}
                                    isOptionSelected={(x) => {
                                      return selectedProviderStreetSuburb &&
                                        x.id === selectedProviderStreetSuburb.id
                                        ? x
                                        : null;
                                    }}
                                    value={selectedProviderStreetSuburb}
                                    defaultValue={selectedProviderStreetSuburb}
                                  />
                                  <ErrorMessage
                                    name="rep_suburb"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </>
                              ) : (
                                <>
                                  <Field
                                    name="providerStreetSuburb"
                                    type="text"
                                    value={values.providerStreetSuburb}
                                    onBlur={() => {
                                      if (isSecondSameAddress) {
                                        setFieldValue(
                                          "providerPostalSuburb",
                                          values.providerStreetSuburb
                                        );
                                      }
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      getAllCallback(true);
                                    }}
                                    maxLength="250"
                                    className={
                                      "form-control" +
                                      (errors.rep_suburb && touched.rep_suburb
                                        ? " is-invalid"
                                        : "")
                                    }
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
                      </Row>
                      <Row style={{ marginLeft: "-56px" }}>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="providerStreetStateId"
                              column
                              sm={3}
                            >
                              State
                            </Label>
                            <Col sm={9}>
                              {selectedProviderStreetCountry &&
                              selectedProviderStreetCountry.description ===
                                "Australia" ? (
                                <>
                                  <SingleSelect
                                    name="state"
                                    menuPlacement="top"
                                    placeholder="Select..."
                                    onChange={(selected) => {
                                      getAllCallback(true);
                                      setFieldValue(
                                        "providerStreetStateId",
                                        selected.state_id
                                      );
                                      setSelectedProviderStreetState(selected);
                                      // getSuburbList(
                                      //   null,
                                      //   selected.state_id,
                                      //   "street"
                                      // );
                                      setSelectedProviderStreetSuburb(null);
                                      const tmpSubrbLst = CPYsuburbList.filter(
                                        (st) => st.stateId === selected.state_id
                                      );
                                      setProviderStreetSuburbList(tmpSubrbLst);

                                      if (isSecondSameAddress) {
                                        setFieldValue(
                                          "providerPostalStateId",
                                          selected.state_id
                                        );
                                        setSelectedProviderPostalState(
                                          selected
                                        );
                                        setProviderPostalSuburbList(
                                          tmpSubrbLst
                                        );
                                        setSelectedProviderPostalSuburb(null);
                                      }
                                    }}
                                    options={stateList}
                                    isOptionSelected={(x) => {
                                      return selectedProviderStreetState &&
                                        x.state_id ===
                                          selectedProviderStreetState.state_id
                                        ? x
                                        : null;
                                    }}
                                    value={selectedProviderStreetState}
                                    defaultValue={selectedProviderStreetState}
                                  />
                                </>
                              ) : (
                                <>
                                  <Field
                                    name="providerStreetState"
                                    type="text"
                                    value={values.providerStreetState}
                                    onBlur={() => {
                                      if (isSecondSameAddress) {
                                        setFieldValue(
                                          "providerPostalState",
                                          values.providerStreetState
                                        );
                                      }
                                    }}
                                    onChange={(e) => {
                                      handleChange(e);
                                      getAllCallback(true);
                                    }}
                                    className={"text form-control"}
                                    maxLength="250"
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
                      </Row>
                      <Row style={{ marginLeft: "-56px" }}>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              htmlFor="providerStreetPostcode"
                              style={{ textAlign: "right" }}
                              column
                              sm={3}
                            >
                              Postcode
                            </Label>
                            <Col sm={9}>
                              <Field
                                name="providerStreetPostcode"
                                type="text"
                                value={values.providerStreetPostcode}
                                onBlur={() => {
                                  if (isSecondSameAddress) {
                                    setFieldValue(
                                      "providerPostalPostcode",
                                      values.providerStreetPostcode
                                    );
                                  }
                                }}
                                onChange={(e) => {
                                  handleChange(e);
                                  getAllCallback(true);
                                }}
                                className={"text form-control"}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>
                      <Row style={{ marginLeft: "-56px" }}>
                        <Row className="labelsize">
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="acn"
                              column
                              sm={3}
                            >
                              Country
                            </Label>
                            <Col sm={9}>
                              <>
                                <SingleSelect
                                  menuPlacement="top"
                                  name="providerStreetCountryId"
                                  placeholder="Select..."
                                  onChange={(selected) => {
                                    getAllCallback(true);
                                    setFieldValue(
                                      "providerStreetCountryId",
                                      selected.id
                                    );
                                    setSelectedProviderStreetCountry(selected);
                                    setFieldValue(
                                      "providerStreetAddressLine1",
                                      ""
                                    );
                                    setFieldValue(
                                      "providerStreetAddressLine2",
                                      ""
                                    );
                                    setFieldValue("providerStreetPostcode", "");
                                    setFieldValue("providerStreetState", "");
                                    setFieldValue("providerStreetSuburb", "");
                                    setSelectedProviderPostalState(null);
                                    setSelectedProviderStreetSuburb(null);
                                    if (isSecondSameAddress) {
                                      setFieldValue(
                                        "providerPostalCountryId",
                                        selected.id
                                      );
                                      setSelectedProviderPostalCountry(
                                        selected
                                      );
                                      setFieldValue(
                                        "providerPostalPostcode",
                                        ""
                                      );
                                      setFieldValue("providerPostalState", "");
                                      setFieldValue("providerPostalSuburb", "");
                                      setFieldValue(
                                        "providerPostalAddressLine1",
                                        ""
                                      );
                                      setFieldValue(
                                        "providerPostalAddressLine2",
                                        ""
                                      );
                                      setSelectedProviderPostalState(null);
                                      setSelectedProviderPostalSuburb(null);
                                    }
                                  }}
                                  options={countryList}
                                  value={selectedProviderStreetCountry}
                                  defaultValue={selectedProviderStreetCountry}
                                />
                              </>
                              {/* ) : (
                              <></>
                            )} */}
                            </Col>
                          </FormGroup>
                        </Row>
                      </Row>

                      <br />
                    </div>
                    {/* tenth Postal  address */}
                    <div className="col-6">
                      <div className="d-flex">
                        <div className="head mt-3">
                          <img src={Icon} className="icon" />
                          Provider Postal Address
                        </div>
                        <Field
                          name="isSameHeadOfficeProviderPostalAddress"
                          type="checkbox"
                          style={{
                            marginTop: "17px",
                            marginLeft: "10px",
                          }}
                          checked={isSecondSameAddress}
                          onChange={() => {
                            getAllCallback(true);
                            setSecondSameAddress(!isSecondSameAddress);
                            setFieldValue(
                              "isSameHeadOfficeProviderPostalAddress",
                              !isSecondSameAddress
                            );
                            ChangeProviderPostalAddress(
                              !isSecondSameAddress,
                              setFieldValue,
                              values
                            );
                          }}
                        />
                        <label
                          style={{
                            marginTop: "20px",
                            marginLeft: "10px",
                          }}
                        >
                          Postal Address is same as Provider Address
                        </label>
                      </div>
                      <hr />
                      <Row className="text-end mt-4 labelsize">
                        <FormGroup row style={{ marginTop: "24px" }}>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="providerPostalAddressLine1"
                            column
                            sm={3}
                          >
                            Address Line 1
                          </Label>
                          <Col sm={9}>
                            <Field
                              disabled={isSecondSameAddress}
                              name="providerPostalAddressLine1"
                              type="text"
                              value={values.providerPostalAddressLine1}
                              onBlur={handleBlur}
                              maxLength="250"
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
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
                            style={{ textAlign: "right" }}
                            htmlFor="providerPostalAddressLine2"
                            column
                            sm={3}
                          >
                            Address Line 2
                          </Label>
                          <Col sm={9}>
                            <Field
                              disabled={isSecondSameAddress}
                              name="providerPostalAddressLine2"
                              type="text"
                              value={values.providerPostalAddressLine2}
                              onBlur={handleBlur}
                              maxLength="250"
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
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
                            style={{ textAlign: "right" }}
                            htmlFor="abn"
                            column
                            sm={3}
                          >
                            Suburb / Town
                          </Label>
                          <Col sm={9}>
                            {selectedProviderPostalCountry &&
                            selectedProviderPostalCountry.description ===
                              "Australia" ? (
                              <>
                                <SingleSelect
                                  menuPlacement="top"
                                  isDisabled={isSecondSameAddress}
                                  className="select-disable"
                                  name="providerPostalsuburbId  "
                                  placeholder="Select..."
                                  onChange={(selected) => {
                                    setSelectedProviderPostalSuburb({
                                      ...selected,
                                      label: selected.value,
                                    });
                                    getAllCallback(true);
                                    setFieldValue(
                                      "providerPostalPostcode",
                                      selected.postcode
                                    );
                                    setFieldValue(
                                      "providerPostalSuburbId",
                                      selected.id
                                    );
                                    // setFieldValue(
                                    //   "providerStreetSuburbId",
                                    //   selected.id
                                    // );
                                    setFieldValue(
                                      "providerPostalStateId",
                                      selected.stateId
                                    );

                                    setSelectedProviderPostalState(
                                      stateList.find(
                                        (ob) => ob.state_id === selected.stateId
                                      )
                                    );
                                  }}
                                  options={ProviderPostalSuburbList}
                                  // isOptionSelected={(x) => {
                                  //   return selectedProviderPostalSuburb &&
                                  //     x.id === selectedProviderPostalSuburb.id
                                  //     ? x
                                  //     : null;
                                  // }}
                                  value={selectedProviderPostalSuburb}
                                />
                                <ErrorMessage
                                  name="rep_suburb"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </>
                            ) : (
                              <>
                                <Field
                                  disabled={isSecondSameAddress}
                                  name="providerPostalSuburb"
                                  type="text"
                                  value={values.providerPostalSuburb}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    setFieldValue("providerPostalSuburb", e);
                                    handleChange(e);
                                    getAllCallback(true);
                                  }}
                                  class="text form-control"
                                  maxLength="250"
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
                            style={{ textAlign: "right" }}
                            htmlFor="providerPostalStateId"
                            column
                            sm={3}
                          >
                            State
                          </Label>
                          <Col sm={9}>
                            {selectedProviderPostalCountry &&
                            selectedProviderPostalCountry.description ===
                              "Australia" ? (
                              <>
                                <SingleSelect
                                  menuPlacement="top"
                                  isDisabled={isSecondSameAddress}
                                  name="providerPostalStateId"
                                  placeholder="Select..."
                                  onChange={(selected) => {
                                    getAllCallback(true);
                                    setFieldValue(
                                      "providerPostalStateId",
                                      selected.state_id
                                    );
                                    setSelectedProviderPostalState(selected);
                                    // getSuburbList(
                                    //   null,
                                    //   selected.state_id,
                                    //   "postal"
                                    // );
                                    setSelectedProviderPostalSuburb(null);
                                    const tmSubrbLst = CPYsuburbList.filter(
                                      (st) => st.stateId === selected.state_id
                                    );
                                    setProviderPostalSuburbList(tmSubrbLst);
                                  }}
                                  options={stateList}
                                  isOptionSelected={(x) => {
                                    return selectedProviderPostalState &&
                                      x.state_id ===
                                        selectedProviderPostalState.state_id
                                      ? x
                                      : null;
                                  }}
                                  value={selectedProviderPostalState}
                                  defaultValue={selectedProviderPostalState}
                                />
                              </>
                            ) : (
                              <>
                                <Field
                                  disabled={isSecondSameAddress}
                                  name="providerPostalState"
                                  type="text"
                                  value={values.providerPostalState}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    handleChange(e);
                                    getAllCallback(true);
                                  }}
                                  className={"text form-control"}
                                  maxLength="250"
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
                            htmlFor="providerPostalPostcode"
                            column
                            sm={3}
                          >
                            Postcode
                          </Label>
                          <Col sm={9}>
                            <Field
                              disabled={isSecondSameAddress}
                              name="providerPostalPostcode"
                              type="text"
                              value={values.providerPostalPostcode}
                              onBlur={handleBlur}
                              onChange={(e) => {
                                handleChange(e);
                                getAllCallback(true);
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
                            style={{ textAlign: "right" }}
                            htmlFor="acn"
                            column
                            sm={3}
                          >
                            Country
                          </Label>
                          <Col sm={9}>
                            <>
                              <SingleSelect
                                isDisabled={isSecondSameAddress}
                                menuPlacement="top"
                                name="ProviderPostalCountryId"
                                placeholder="Select..."
                                onChange={(selected) => {
                                  getAllCallback(true);
                                  setFieldValue(
                                    "ProviderPostalCountryId",
                                    selected.id
                                  );
                                  setSelectedProviderPostalCountry(selected);
                                  setFieldValue("providerPostalPostcode", "");
                                  setFieldValue("providerPostalState", "");
                                  setFieldValue("providerPostalSuburb", "");
                                  setFieldValue(
                                    "providerPostalAddressLine1",
                                    ""
                                  );
                                  setFieldValue(
                                    "providerPostalAddressLine2",
                                    ""
                                  );
                                  setSelectedProviderPostalState(null);
                                  setSelectedProviderPostalSuburb(null);
                                }}
                                options={countryList}
                                value={selectedProviderPostalCountry}
                                defaultValue={selectedProviderPostalCountry}
                              />
                            </>
                            {/* ) : (
                              <></>
                            )} */}
                          </Col>
                        </FormGroup>
                      </Row>
                      <br />
                    </div>
                    {/* from above end div */}
                  </div>
                </div>
              </Form>
            </Page>
          )}
        </>
      )}
    </Formik>
  );
};
export default ViewFacilityDetails;
