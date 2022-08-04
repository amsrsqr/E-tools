import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
  CLOSE,
  CANCEL,
  EMAILERROR,
  FIRSTLASTNAMEERROR,
  PRIMARYCONTACTMSG,
  SAVE,
  SAVESUCCESSFUL,
  VALIDEMAIL,
  VALIDNUMBER,
} from "../../../constant/MessageConstant";

import {
  InputGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Button,
  Row,
  Col,
  Form,
  Label,
} from "reactstrap";

import {
  ADD,
  ADMINISTRATOR,
  AUTHORIZEEMAIL,
  BILLINGCONTACT,
  CORRESPONDENCECONTACT,
  DATEOFBIRTH,
  EDIT,
  EMERGENCYCONTACT,
  FIRSTNAME,
  GUARDIAN,
  LASTNAME,
  MIDDLENAME,
  MOBILE,
  NONE,
  OTHER,
  PHONE,
  POWEROFATTORNEYMEDICAL,
  PRIMARYCONTACT,
  RELATIONSHIP,
  REPRESENTATIVECATEGORY,
  REPRESENTATIVEDETAILS,
  REPRESENTATIVEROLES,
  RESIDENTREPRESENTATIVE,
  STATETRUSTEE,
  TITLE,
} from "../../../constant/FieldConstant";
import ModalError from "../../../components/ModalError";
import { Input } from "reactstrap";
import residentRepresentativeService from "../../../services/Master/residentRepresentative.service";
import {
  AGREEMENTSIGNEE,
  POWEROFATTORNEY,
} from "./../../../constant/FieldConstant";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import AddEditRepresentativeCategories from "./AddEditRepresentativeCategories";
import SuccessAlert from "../../../components/SuccessAlert";

import MuiDatePicker from "../../../components/DatePicker/MaterialUi";

import { removeEmptySpaces } from "../../../utils/Strings";
import SingleSelect from "../../../components/MySelect/MySelect";

const AddEditResidentRepresentative = ({
  ShowModel,
  ParentCallBackToView,
  type,
  Data,
  StateCountrySubrb,
  existingPrimaryContactPersonDetails,
}) => {
  const getInitValues = () => {
    return {
      is_poa: false,
      relationship_type_id: 0,
      is_trustee: false,
      is_res_representative: false,
      is_billing: false,
      is_correspondence: false,
      is_other: false,
      other_desc: "",
      agreement_signatory_id: 0,
      rep_title_type_id: 0,
      rep_first_name: "",
      rep_middle_name: "",
      rep_last_name: "",
      rep_address1: "",
      rep_address2: "",
      rep_address: "",
      rep_suburb: "",
      rep_postcode: "",
      rep_state: 0,
      rep_phone: "",
      rep_mobile: "",
      rep_fax: "",
      rep_email: "",
      rep_organisation: "",
      is_emergency_contact: false,
      is_poa_medical: false,
      is_guardian: false,
      is_fin_admin: false,
      is_gp: false,
      is_fin_manager: false,
      active: true,
      rep_license: "",
      representativeCategory: "",
      representative_categoryId: 0,
      episodeId: 0,
      registerId: 0,
      is_primarycontact: false,
      isdeleted: false,
      rep_state_name: "",
      rep_country_id: 0,
      rep_Dob: undefined,
    };
  };
  const [show, setShow] = useState(ShowModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSuburb, setSelectedSuburb] = useState(null);
  const [selectedAgreementSignee, setSelectedAgreementSignee] = useState(null);
  const [selectedRelationshipType, setSelectedRelationshipType] = useState(
    null
  );
  const [
    selectedRepresentativeCategories,
    setSelectedRepresentativeCategories,
  ] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [suburbList, setsuburbList] = useState([]);
  const [SubrbCpy, setSubrCpy] = useState([]);
  const [states, setStates] = useState([]);
  const [titles, setTitles] = useState([]);
  const [agreementSignee, setAgreementSignee] = useState([]);
  const [relationshipType, setRelationshipType] = useState([]);
  const [representativeCategories, setRepresentativeCategories] = useState([]);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [actionType, setActionType] = useState();
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [noneChecked, setNoneChecked] = useState(false);
  const [initialValues, setInitialValues] = useState(getInitValues());
  const [selectedPrimaryContact, setSelectedPrimaryContact] = useState({});

  const handleShow = () => {
    setShowAddEditForm(true);
    setSelectedRowData({});
    setActionType(ADD);
  };
  const ParentCallBackToRepresentativeView = (
    childdata,
    success,
    msg = null
  ) => {
    setShowAddEditForm(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: msg ? msg : actionType === EDIT ? SAVESUCCESSFUL : SAVESUCCESSFUL,
        callback: () => {
          getRepresentativeCategories();
          setShowSuccessAlert(false);
        },
      });
      setShowSuccessAlert(true);
    }
    setSelectedRowData({});
  };

  useEffect(() => {
    setShow(ShowModel);
  }, [ShowModel]);

  useEffect(() => {
    setSelectedPrimaryContact(existingPrimaryContactPersonDetails);
  }, [existingPrimaryContactPersonDetails]);

  useEffect(() => {
    console.log("StateCountrySubrb at add reprtesentative", StateCountrySubrb);
    if (StateCountrySubrb) {
      if (StateCountrySubrb.states && StateCountrySubrb.states.length > 0) {
        setStates(StateCountrySubrb.states);
        if (type === EDIT) {
          const tmpselectedState = StateCountrySubrb.states.find(
            (ob) => ob.state_id === Data.rep_state
          );
          if (tmpselectedState) setSelectedState(tmpselectedState);
        }
      } else {
        getStates();
      }
      if (StateCountrySubrb.country && StateCountrySubrb.country.length > 0) {
        setCountryList(StateCountrySubrb.country);
        if (type === EDIT) {
          if (Data.rep_country_id) {
            const tmpSlcCountry = StateCountrySubrb.country.find(
              (ob) => ob.id === Data.rep_country_id
            );
            if (tmpSlcCountry) {
              setSelectedCountry(tmpSlcCountry);
            }
          }
        } else {
          const tmpSlcCount = StateCountrySubrb.country.find(
            (ob) => ob.id === 14
          );
          if (tmpSlcCount) {
            setSelectedCountry(tmpSlcCount);
          }
        }
      } else {
        getCountries();
      }
      if (StateCountrySubrb.subrb && StateCountrySubrb.subrb.length > 0) {
        if (type === EDIT) {
          const selectedSubrb = StateCountrySubrb.subrb.find(
            (ob) => ob.label === Data.rep_suburb
          );
          if (selectedSubrb) {
            setSelectedSuburb({ ...selectedSubrb, label: selectedSubrb.value });
            const filteredList = StateCountrySubrb.subrb.filter(
              (obj) => obj.stateId === selectedSubrb.stateId
            );
            setsuburbList(filteredList);
          }
        } else {
          setsuburbList(StateCountrySubrb.subrb);
        }
        setSubrCpy(StateCountrySubrb.subrb);
      } else {
        getSuburbList();
      }
      if (StateCountrySubrb.titles && StateCountrySubrb.titles.length > 0) {
        setTitles(StateCountrySubrb.titles);
        if (type === EDIT && StateCountrySubrb.titles.length > 0) {
          let tmpselectedTitle = StateCountrySubrb.titles.find(
            (x) => x.title_type_id === Data.rep_title_type_id
          );
          setSelectedTitle(tmpselectedTitle ? tmpselectedTitle : null);
        }
      } else {
        getTitles();
      }
    } else {
      getTitles();
      getStates();
      getCountries();
      getSuburbList();
    }
    getAgreementSigneeList();
    getRelationshipTypeList();
    getRepresentativeCategories();
  }, []);

  useEffect(() => {
    if (type === EDIT) {
      console.log("edit data in useEffect", Data);
      setInitialValues({ ...Data });
    } else {
      if (agreementSignee && agreementSignee.length > 0) {
        const defaultAssign = agreementSignee.filter(
          (x) => x.id === 6 || x.name === "None"
        );
        setSelectedAgreementSignee(defaultAssign);
      }
      setInitialValues(getInitValues());
    }
  }, [Data]);

  const getRepresentativeCategories = () => {
    // setLoading(true);
    residentRepresentativeService
      .getRepresentativeCategories()
      .then((response) => {
        // setLoading(false);
        response.map((x) => {
          x.label = x.name;
          x.value = x.id;
          // x.id = x.title_type_id;
        });
        setRepresentativeCategories(response);

        if (type === EDIT && response.length > 0) {
          let selectedRepresentative = response.find(
            (x) => x.id === Data.representative_categoryId
          );
          setSelectedRepresentativeCategories(
            selectedRepresentative ? selectedRepresentative : null
          );
        }
      });
  };

  const getTitles = () => {
    // setLoading(true);
    residentRepresentativeService.getTitles().then((response) => {
      // setLoading(false);
      response.map((x) => {
        x.label = x.title_type_code;
        // x.id = x.title_type_id;
      });

      setTitles(response);
      if (type === EDIT && response.length > 0) {
        let tmpselectedTitle = response.find(
          (x) => x.title_type_id === Data.rep_title_type_id
        );

        setSelectedTitle(tmpselectedTitle ? tmpselectedTitle : null);
      }
    });
  };
  const getAgreementSigneeList = () => {
    // setLoading(true);
    residentRepresentativeService.getAgreementSigneeList().then((response) => {
      // setLoading(false);
      response.map((x) => {
        x.label = x.name;
        x.value = x.id;
      });
      setAgreementSignee(response);
      if (response.length > 0) {
        if (type === EDIT && Data) {
          let selectedAgreementSignee = response.find(
            (x) => x.id === Data.agreement_signatory_id
          );
          if (selectedAgreementSignee) {
            setSelectedAgreementSignee(selectedAgreementSignee);
          }
        } else {
          const defaultAssignee = response.filter((x) => x.id === 6);

          setSelectedAgreementSignee(defaultAssignee[0]);
        }
      }
    });
  };

  const getRelationshipTypeList = () => {
    // setLoading(true);
    residentRepresentativeService.getRelationshipTypeList().then((response) => {
      // setLoading(false);
      response.map((x) => {
        x.label = x.relationship_type_name;
        x.value = x.relationship_type_id;
      });
      setRelationshipType(response);
      if (response.length > 0) {
        if (type === EDIT && Data) {
          const selectedRelationship = response.find(
            (x) => x.relationship_type_id === Data.relationship_type_id
          );
          setSelectedRelationshipType(
            selectedRelationship ? selectedRelationship : null
          );
        }
      }
    });
  };

  const getCountries = () => {
    // setLoading(true);
    residentRepresentativeService.getCountries().then((response) => {
      // setLoading(false);
      let arr = response.map((x, index) => {
        x.label = x.description;
        x.value = x.id;
        return x;
      });
      setCountryList(arr);
      let ausObj = {};

      arr.forEach((x) => {
        if (x.id === 14) ausObj = Object.assign({}, x);
        if (type === EDIT && x.id === Data.rep_country_id) {
          setSelectedCountry(x);
        } else {
          setSelectedCountry(ausObj);
        }
      });
    });
  };

  const getSuburbList = () => {
    // setLoading(true);
    residentRepresentativeService.getSuburbList().then((response) => {
      // setLoading(false);
      if (type === EDIT) {
        const selectedSubrb = response.find(
          (ob) => ob.label === Data.rep_suburb
        );
        if (selectedSubrb) {
          setSelectedSuburb({ ...selectedSubrb, label: selectedSubrb.value });
          const filteredList = response.filter(
            (obj) => obj.stateId === selectedSubrb.stateId
          );
          setsuburbList(filteredList);
        }
      } else {
        setsuburbList(response);
      }
      setSubrCpy(response);
    });
  };

  const getStates = () => {
    // setLoading(true);
    residentRepresentativeService.getStates().then((response) => {
      // setLoading(false);
      response.map((x) => {
        x.label = x.state_code;
      });
      setStates(response);

      if (type === EDIT) {
        const selectedState = response.find(
          (ob) => ob.state_id === Data.rep_state
        );
        if (selectedState) setSelectedState(selectedState);
      }
    });
  };

  const selectStyle = {
    control: (base, state) => ({
      ...base,
      //border: 1,
      // This line disable the blue border
      // boxShadow: state.isFocused ? "0px 0px 0px 5px #c2dbfe !important" : 0,
      width: "100%",
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

  const validateForm = (values) => {
    let errors = {};
    Object.keys(values).forEach((x) => {
      switch (x) {
        case "rep_email":
          if (
            values[x] !== "" &&
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values[x])
          ) {
            errors[x] = EMAILERROR;
          }
          break;
        case "rep_first_name":
          if (values[x] === "") {
            errors[x] = FIRSTLASTNAMEERROR;
          }
          break;
        case "rep_Dob":
          console.log("values[x]", values[x]);
          if (values.rep_Dob?.toString() === "Invalid Date") {
            errors[x] = "Invalid date";
          }
          break;
        case "rep_last_name":
          if (values[x] === "") {
            errors[x] = FIRSTLASTNAMEERROR;
          }
          break;
        case "rep_phone":
          if (
            values[x] !== "" &&
            (values[x].length < 8 || values[x].length > 11)
          ) {
            errors[x] = VALIDNUMBER;
          }
          break;
        case "rep_mobile":
          if (
            values[x] !== "" &&
            (values[x].length < 10 || values[x].length > 13)
          ) {
            errors[x] = VALIDNUMBER;
          }
          break;
        case "is_other":
          if (values.is_other && !selectedRepresentativeCategories) {
            errors[x] = "Error";
          }
          break;
        default:
      }
    });
    return errors;
  };

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const handleClose = (values) => {
    ParentCallBackToView(!show, false);
    setSelectedState(null);
    setSelectedSuburb(null);
    setSelectedAgreementSignee(null);
    setSelectedRelationshipType(null);
    setSelectedTitle(null);
    setInitialValues(getInitValues());
    setNoneChecked(false);
    setShow(!show);
    setId(0);
  };

  const resetAllCategory = (values) => {
    values.is_poa = false;
    values.is_trustee = false;
    values.is_res_representative = false;
    values.is_guardian = false;
    values.is_fin_admin = false;
    setInitialValues(values);
    setNoneChecked(true);
  };

  async function saveResidentRepresentative(
    fields,
    { setStatus, setSubmitting }
  ) {
    // setStatus();
    // console.log(existingPrimaryContactPersonDetails);
    // if (
    //   selectedPrimaryContact &&
    //   selectedPrimaryContact.is_primarycontact &&
    //   fields.is_primarycontact === true
    // ) {
    //   setLoading(true);
    //   selectedPrimaryContact.is_primarycontact = false;
    //   // existingPrimaryContactPersonDetails.rep_first_name =
    //   //   existingPrimaryContactPersonDetails.rep_first_name + 'updated';
    //   residentRepresentativeService
    //     .updateResidentRepresentative(selectedPrimaryContact)
    //     .then(
    //       (res) => {
    //         setLoading(false);
    //         saveResidentConfirm(fields);
    //       },
    //       (errors) => {
    //         setLoading(false);
    //         selectedPrimaryContact.is_primarycontact = true;
    //       }
    //     );
    // } else {
    fields.agreement_signee =
      (selectedAgreementSignee && selectedAgreementSignee.name) || "";
    console.log("selectedCountry", selectedCountry);
    fields.rep_country_id =
      selectedCountry && selectedCountry.description === "Australia"
        ? selectedCountry.id
        : fields.rep_country_id;
    saveResidentConfirm(fields);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedSuburb(null);
    setSelectedAgreementSignee(null);
    setSelectedRelationshipType(null);
    setSelectedTitle(null);
    // }
  }

  const saveResidentConfirm = (fields) => {
    if (type == EDIT) {
      // setLoading(true);
      ParentCallBackToView(false, true, fields);
      // residentRepresentativeService.updateResidentRepresentative(fields).then(
      //   (res) => {
      //     setLoading(false);
      //     ParentCallBackToView(false, true, res.message);
      //     setShow(false);
      //   },
      //   (errors) => {
      //     setLoading(false);
      //   }
      // );
    } else {
      // setLoading(true);
      // console.log(fields);
      console.log("fields in ad edit", fields);
      ParentCallBackToView(false, true, fields);

      // residentRepresentativeService
      //   .createResidentRepresentative({ ...initialValues, ...fields })
      //   .then(
      //     (res) => {
      //       setLoading(false);
      //       ParentCallBackToView(false, true, res.message);
      //       setShow(false);
      //     },
      //     (errors) => {
      //       setLoading(false);
      //     }
      //   );
    }
  };
  console.log("");
  return (
    <>
      {showSuccessAlert && (
        <SuccessAlert
          type={successAlertOptions.actionType}
          msg={successAlertOptions.msg}
          title={successAlertOptions.title}
          callback={successAlertOptions.callback}
        ></SuccessAlert>
      )}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          rep_first_name: Yup.string().required(),
          rep_last_name: Yup.string().required(),
          // rep_email: Yup.string()
          //   .required()
          //   .matches('^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$'),
        })}
        validate={validateForm}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={saveResidentRepresentative}
        autoComplete="off"
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
        }) => (
          <>
            <Modal
              centered
              isOpen={show}
              className="resident-modal"
              toggle={() => {
                setErrors({});
                handleClose(values);
              }}
            >
              <ModalHeader
                toggle={() => {
                  setErrors({});
                  handleClose(values);
                }}
              >
                {type} {RESIDENTREPRESENTATIVE}
              </ModalHeader>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <ModalBody>
                  <ModalError
                    showErrorPopup={showErrorPopup}
                    fieldArray={errorArray}
                    handleErrorClose={handleErrorClose}
                    errorMessage={"Resident Representative"}
                  ></ModalError>

                  <Row className={"fieldStyle"}>
                    <FormGroup row>
                      <div className="d-flex">
                        <div style={{ width: "55%", marginRight: 10 }}>
                          <div style={{ height: "30%" }}>
                            <div class="head-style mb-2 ps-5">
                              {REPRESENTATIVEROLES}
                            </div>
                            <br />

                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right", height: "40px" }}
                                htmlFor="rep_agreement_signee"
                                column
                                sm={3}
                                //   className={
                                //     errors.rep_agreement_signee && touched.rep_agreement_signee
                                //       ? ' is-invalid-label required-field'
                                //       : 'required-field'
                                //   }
                              >
                                {AGREEMENTSIGNEE}
                              </Label>
                              <Col sm={7}>
                                <SingleSelect
                                  placeholder="Select...."
                                  onChange={(selected) => {
                                    setFieldValue(
                                      "agreement_signatory_id",
                                      selected.id
                                    );
                                    setSelectedAgreementSignee(selected);
                                  }}
                                  className={
                                    errors.agreement_signatory_id
                                      ? "is-invalid"
                                      : ""
                                  }
                                  options={agreementSignee}
                                  isOptionSelected={(x) => {
                                    return selectedAgreementSignee &&
                                      x.id === selectedAgreementSignee.id
                                      ? x
                                      : null;
                                  }}
                                  value={selectedAgreementSignee}
                                />

                                <ErrorMessage
                                  name="rep_agreement_signee"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                sm={3}
                                style={{
                                  textAlign: "right",
                                  paddingTop: "0",
                                }}
                              >
                                {PRIMARYCONTACT}
                              </Label>
                              <Col sm={7}>
                                <FormGroup check>
                                  <Input
                                    id="checkbox2"
                                    type="checkbox"
                                    checked={values.is_primarycontact}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_primarycontact",
                                        !values.is_primarycontact
                                      );
                                    }}
                                  />{" "}
                                  <Label
                                    style={{ color: "red" }}
                                    className="danger-label"
                                    check
                                  >
                                    {PRIMARYCONTACTMSG}
                                  </Label>
                                </FormGroup>
                              </Col>
                            </FormGroup>
                            <FormGroup row className="mt-4">
                              {/* <div
                                style={{ width: '25%', height: '100%' }}
                                class="mb-2"
                              >
                                {'Representative Category'}
                              </div> */}
                              <Label
                                sm={3}
                                style={{
                                  textAlign: "right",
                                  paddingTop: "0",
                                }}
                              >
                                {REPRESENTATIVECATEGORY}
                              </Label>
                              <div style={{ width: "33%", height: "66%" }}>
                                <FormGroup check>
                                  <Input
                                    id="checkbox3"
                                    type="checkbox"
                                    checked={values.is_poa_medical}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_poa_medical",
                                        !values.is_poa_medical
                                      );
                                    }}
                                  />
                                  {POWEROFATTORNEYMEDICAL}
                                </FormGroup>
                                <FormGroup check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={values.is_emergency_contact}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_emergency_contact",
                                        !values.is_emergency_contact
                                      );
                                    }}
                                  />
                                  {EMERGENCYCONTACT}
                                </FormGroup>
                              </div>
                              <div style={{ width: "33%", height: "66%" }}>
                                <FormGroup check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={values.is_correspondence}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_correspondence",
                                        !values.is_correspondence
                                      );
                                    }}
                                  />
                                  {CORRESPONDENCECONTACT}
                                </FormGroup>
                                <FormGroup check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={values.is_billing}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_billing",
                                        !values.is_billing
                                      );
                                    }}
                                  />
                                  {BILLINGCONTACT}
                                </FormGroup>
                              </div>
                              <div style={{ width: "25%" }}></div>
                              <div
                                className="d-flex justify-content-between"
                                style={{ width: "66%", height: "33%" }}
                              >
                                <FormGroup check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={values.is_other}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_other",
                                        !values.is_other
                                      );
                                      if (values.is_other) {
                                        setFieldValue(
                                          "representative_categoryId",
                                          ""
                                        );
                                        setFieldValue("representativeCategory");
                                        setSelectedRepresentativeCategories(
                                          null
                                        );
                                      }
                                    }}
                                  />
                                  {OTHER}
                                </FormGroup>
                                <Col sm={6} style={{ height: "40px" }}>
                                  <div>
                                    <SingleSelect
                                      hideSelectedOptions={!values.is_other}
                                      placeholder="Select...."
                                      isDisabled={!values.is_other}
                                      onChange={(selected) => {
                                        setSelectedRepresentativeCategories(
                                          selected
                                        );
                                        setTimeout(() => {
                                          setFieldValue(
                                            "representative_categoryId",
                                            selected.id
                                          );
                                          setFieldValue(
                                            "representativeCategory",
                                            selected.name
                                          );
                                        }, 500);
                                      }}
                                      className={
                                        errors.representative_categoryId
                                          ? "is-invalid other-select"
                                          : ""
                                      }
                                      options={representativeCategories}
                                      // className="mt"
                                      isOptionSelected={(x) => {
                                        return selectedRepresentativeCategories &&
                                          x.id ===
                                            selectedRepresentativeCategories.id
                                          ? x
                                          : null;
                                      }}
                                      value={selectedRepresentativeCategories}
                                      theme={reactSelectTheme(
                                        errors.is_other && touched.is_other
                                      )}
                                      styles={selectStyle}
                                    />
                                  </div>
                                  <InlineBottomErrorMessage name="is_other" />
                                </Col>
                                <Col
                                  sm={3}
                                  className="mt-2"
                                  style={{ marginLeft: "-52px" }}
                                >
                                  <div
                                    style={{
                                      color: !values.is_other ? "grey" : "blue",
                                      cursor: !values.is_other
                                        ? "default"
                                        : "pointer",
                                      textDecorationLine: "underline",
                                      // cursor: "pointer",
                                      width: "fit-content",
                                    }}
                                    onClick={
                                      !values.is_other ? () => {} : handleShow
                                    }
                                  >
                                    Add New
                                  </div>
                                </Col>
                              </div>
                            </FormGroup>
                          </div>
                          <div style={{ height: "70%" }}>
                            <div
                              class="head-style ps-5 mt-3"
                              style={{ marginBottom: "10px" }}
                            >
                              {REPRESENTATIVEDETAILS}
                            </div>
                            <br />
                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right", height: "40px" }}
                                htmlFor="rep_title_type_id"
                                column
                                sm={3}
                              >
                                {TITLE}
                              </Label>
                              <Col sm={7}>
                                <SingleSelect
                                  placeholder="Select...."
                                  onChange={(selected) => {
                                    setFieldValue(
                                      "rep_title_type_id",
                                      selected.title_type_id
                                    );
                                    setSelectedTitle(selected);
                                  }}
                                  className={
                                    errors.rep_title_type_id ? "is-invalid" : ""
                                  }
                                  options={titles}
                                  isOptionSelected={(x) => {
                                    return selectedTitle &&
                                      x.title_type_id ===
                                        selectedTitle.title_type_id
                                      ? x
                                      : null;
                                  }}
                                  value={selectedTitle}
                                />
                                <ErrorMessage
                                  name="title_type_id"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor="rep_first_name"
                                column
                                sm={3}
                                className={
                                  errors.rep_first_name &&
                                  touched.rep_first_name
                                    ? " is-invalid-label required-field"
                                    : "required-field"
                                }
                              >
                                {FIRSTNAME}
                              </Label>
                              <Col sm={7}>
                                <Field
                                  name="rep_first_name"
                                  type="text"
                                  value={values.rep_first_name}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    const val = (e.target.value || "").replace(
                                      /\s+/gi,
                                      " "
                                    );
                                    setFieldValue(
                                      "rep_first_name",
                                      val.trimLeft()
                                    );
                                    handleBlur(val);
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.rep_first_name &&
                                    touched.rep_first_name
                                      ? " is-invalid"
                                      : "")
                                  }
                                  maxLength="250"
                                />
                                <InlineBottomErrorMessage name="rep_first_name" />
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
                                htmlFor="rep_middle_name"
                                column
                                sm={3}
                              >
                                {MIDDLENAME}
                              </Label>
                              <Col sm={7}>
                                <Field
                                  name="rep_middle_name"
                                  type="text"
                                  value={values.rep_middle_name}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  className={
                                    "form-control" +
                                    (errors.rep_middle_name &&
                                    touched.rep_middle_name
                                      ? " is-invalid"
                                      : "")
                                  }
                                  maxLength="250"
                                />
                                <ErrorMessage
                                  name="rep_middle_name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor="rep_last_name"
                                column
                                sm={3}
                                className={
                                  errors.rep_last_name && touched.rep_last_name
                                    ? " is-invalid-label required-field"
                                    : "required-field"
                                }
                              >
                                {LASTNAME}
                              </Label>
                              <Col sm={7}>
                                <Field
                                  name="rep_last_name"
                                  type="text"
                                  value={values.rep_last_name}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    const val = (e.target.value || "").replace(
                                      /\s+/gi,
                                      " "
                                    );
                                    setFieldValue(
                                      "rep_last_name",
                                      val.trimLeft()
                                    );
                                    handleBlur(val);
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.rep_last_name &&
                                    touched.rep_last_name
                                      ? " is-invalid"
                                      : "")
                                  }
                                  maxLength="250"
                                />{" "}
                                <InlineBottomErrorMessage name="rep_last_name" />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right", height: "40px" }}
                                htmlFor="rep_relationships"
                                column
                                sm={3}
                                //   className={
                                //     errors.rep_relationships && touched.rep_relationships
                                //       ? ' is-invalid-label required-field'
                                //       : 'required-field'
                                //   }
                              >
                                {RELATIONSHIP}
                              </Label>
                              <Col sm={7}>
                                <SingleSelect
                                  name="typeId"
                                  placeholder="Select...."
                                  minMenuHeight={300}
                                  onChange={(selected) => {
                                    setFieldValue(
                                      "relationship_type_id",
                                      selected.relationship_type_id
                                    );
                                    setSelectedRelationshipType(selected);
                                  }}
                                  // errors={}
                                  className={
                                    errors.relationship_type_id
                                      ? "is-invalid"
                                      : ""
                                  }
                                  options={relationshipType}
                                  isOptionSelected={(x) => {
                                    return selectedRelationshipType &&
                                      x.relationship_type_id ===
                                        selectedRelationshipType.relationship_type_id
                                      ? x
                                      : null;
                                  }}
                                  value={selectedRelationshipType}
                                />
                                <ErrorMessage
                                  name="rep_relationships"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right" }}
                                // htmlFor="rep_Dob"
                                column
                                sm={3}
                                className={
                                  errors.rep_Dob && touched.rep_Dob
                                    ? //&& values.rep_Dob.toString() === "Invalid Date"
                                      " is-invalid-label "
                                    : ""
                                }
                              >
                                {DATEOFBIRTH}
                              </Label>
                              <Col sm={7}>
                                <InputGroup>
                                  <MuiDatePicker
                                    id="rep_Dob"
                                    name="rep_Dob"
                                    className={
                                      "form-control" +
                                      (values.rep_Dob?.toString() ===
                                      "Invalid Date"
                                        ? " is-invalid"
                                        : "")
                                    }
                                    // shouldCloseOnSelect={false}
                                    onBlur={handleBlur}
                                    selectedDate={values.rep_Dob}
                                    maxDate={new Date()}
                                    error={errors.rep_Dob && touched.rep_Dob}
                                    getChangedDate={(val) => {
                                      console.log("val.toJSON()", val);
                                      if (val) {
                                        setFieldValue("rep_Dob", val);
                                      } else {
                                        setFieldValue("rep_Dob", "");
                                      }
                                    }}
                                  />
                                  {/*  <DatePicker
                                    id="rep_Dob"
                                    name="rep_Dob"
                                    autoComplete="off"
                                    dateFormat="dd/MM/yyyy"
                                    selected={
                                      (values.rep_Dob &&
                                        new Date(values.rep_Dob)) ||
                                      null
                                    }
                                    onChange={(val) => {
                                      // setStartDate(val);
                                      setFieldValue("rep_Dob", val.toJSON());
                                    }}
                                    className={
                                      "form-control" +
                                      (errors.rep_Dob && touched.rep_Dob
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <div
                                    // onClick={openDatePicker}
                                    // className="input-group-text"
                                    className={
                                      "text form-control" +
                                      (errors.rep_Dob && touched.rep_Dob
                                        ? " is-invalid"
                                        : "")
                                    }
                                    style={{
                                      right: "0px",
                                      position: "absolute",
                                      paddingRight: "24px",
                                      color: "#F0F0F0",
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                  </div> */}
                                </InputGroup>
                                {errors.rep_Dob && touched.rep_Dob ? (
                                  <InlineBottomErrorMessage
                                    //name="rep_Dob"
                                    msg={"Invalid Date"}
                                  />
                                ) : (
                                  ""
                                )}

                                {/* <div
                                  style={{
                                    color: "#dc3545",
                                    fontSize: ".875em",
                                  }}
                                >
                                  {values.rep_Dob === "Invalid date"
                                    ? errors.rep_Dob
                                    : ""}
                                </div> */}
                              </Col>
                            </FormGroup>

                            <FormGroup row className="mt-5">
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor="rep_phone"
                                column
                                sm={3}
                                className={
                                  errors.rep_phone && touched.rep_phone
                                    ? "is-invalid-label fw-bold"
                                    : null
                                }
                              >
                                {PHONE}
                              </Label>
                              <Col sm={7}>
                                <Field
                                  name="rep_phone"
                                  type="text"
                                  value={values.rep_phone}
                                  placeholder={"000-000-000"}
                                  onChange={(ev) => {
                                    setFieldValue(
                                      "rep_phone",
                                      removeEmptySpaces(ev.target.value)
                                    );
                                  }}
                                  //  onBlur={handleBlur}
                                  //  onChange={handleChange}
                                  className={
                                    "form-control" +
                                    (errors.rep_phone && touched.rep_phone
                                      ? " is-invalid"
                                      : "")
                                  }
                                  maxLength="250"
                                />
                                <InlineBottomErrorMessage
                                  name="rep_phone"
                                  msg={VALIDNUMBER}
                                />

                                {/* <ErrorMessage
                                name="rep_phone"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor="rep_mobile"
                                column
                                sm={3}
                                className={
                                  errors.rep_mobile && touched.rep_mobile
                                    ? "is-invalid-label fw-bold"
                                    : null
                                }
                              >
                                {MOBILE}
                              </Label>
                              <Col sm={7}>
                                <Field
                                  name="rep_mobile"
                                  type="text"
                                  value={values.rep_mobile}
                                  placeholder={"000-000-0000"}
                                  onChange={(ev) => {
                                    setFieldValue(
                                      "rep_mobile",
                                      removeEmptySpaces(ev.target.value)
                                    );
                                  }}
                                  // onBlur={handleBlur}
                                  // onChange={handleChange}
                                  className={
                                    "form-control" +
                                    (errors.rep_mobile && touched.rep_mobile
                                      ? " is-invalid"
                                      : "")
                                  }
                                  maxLength="250"
                                />
                                <InlineBottomErrorMessage
                                  name="rep_mobile"
                                  msg={VALIDNUMBER}
                                />

                                {/* <ErrorMessage
                                name="rep_mobile"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                              </Col>
                            </FormGroup>
                            <FormGroup row className="row-md-2">
                              <Label
                                style={{ textAlign: "right" }}
                                htmlFor="rep_email"
                                column
                                sm={3}
                                className={
                                  errors.rep_email && touched.rep_email
                                    ? "is-invalid-label fw-bold"
                                    : null
                                }
                              >
                                {AUTHORIZEEMAIL}
                              </Label>
                              <Col sm={7}>
                                <Field
                                  name="rep_email"
                                  type="text "
                                  value={values.rep_email}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  onKeyDown={(e) => {
                                    if (e.key === " ") {
                                      e.preventDefault();
                                    }
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.rep_email && touched.rep_email
                                      ? " is-invalid"
                                      : "")
                                  }
                                  maxLength="250"
                                />
                                <InlineBottomErrorMessage
                                  name="rep_email"
                                  msg={VALIDEMAIL}
                                />
                              </Col>
                            </FormGroup>
                          </div>
                        </div>
                        {/* 1st 50% wala div ends */}
                        <div style={{ width: "45%" }}>
                          <div style={{ height: "12%" }}>
                            <div class="head-style mb-2">
                              {"Contact Category"}
                            </div>
                            <br />
                            <FormGroup
                              style={{
                                marginLeft: "20px",
                              }}
                              row
                            >
                              <div style={{ width: "45%" }}>
                                <FormGroup style={{ alignSelf: "right" }} check>
                                  <Input
                                    id="checkbox3"
                                    type="checkbox"
                                    checked={values.is_poa}
                                    onChange={() => {
                                      setFieldValue("is_poa", !values.is_poa);
                                    }}
                                  />
                                  {POWEROFATTORNEY}
                                </FormGroup>
                                <FormGroup check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={values.is_guardian}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_guardian",
                                        !values.is_guardian
                                      );
                                    }}
                                  />
                                  {GUARDIAN}
                                </FormGroup>
                                <FormGroup check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={values.is_res_representative}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_res_representative",
                                        !values.is_res_representative
                                      );
                                    }}
                                  />
                                  {RESIDENTREPRESENTATIVE}
                                </FormGroup>
                              </div>
                              <div style={{ width: "45%" }}>
                                <FormGroup style={{ alignSelf: "right" }} check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={values.is_trustee}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_trustee",
                                        !values.is_trustee
                                      );
                                    }}
                                  />
                                  {STATETRUSTEE}
                                </FormGroup>
                                <FormGroup check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={values.is_fin_admin}
                                    onChange={() => {
                                      setFieldValue(
                                        "is_fin_admin",
                                        !values.is_fin_admin
                                      );
                                    }}
                                  />
                                  {ADMINISTRATOR}
                                </FormGroup>
                                <FormGroup check>
                                  <Input
                                    id="checkbox4"
                                    type="checkbox"
                                    className="ml-2"
                                    checked={
                                      !values.is_poa &&
                                      !values.is_trustee &&
                                      !values.is_res_representative &&
                                      !values.is_guardian &&
                                      !values.is_fin_admin
                                        ? true
                                        : false
                                    }
                                    onChange={() => {
                                      resetAllCategory(values);
                                    }}
                                  />
                                  {NONE}
                                </FormGroup>
                              </div>
                            </FormGroup>
                          </div>

                          <div
                            style={{ marginTop: "159px", marginBottom: "2px" }}
                            class="head-style "
                          >
                            {"Representative Address"}
                          </div>
                          <br />
                          <FormGroup row className="mt-2">
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="rep_address1"
                              column
                              sm={3}
                            >
                              {"Address Line 1"}
                            </Label>
                            <Col sm={8}>
                              <Field
                                name="rep_address1"
                                type="text"
                                value={values.rep_address1}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={
                                  "form-control" +
                                  (errors.rep_address1 && touched.rep_address1
                                    ? " is-invalid"
                                    : "")
                                }
                                maxLength="250"
                              />
                              <ErrorMessage
                                name="rep_address1"
                                component="div"
                                className="invalid-feedback"
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="rep_address2"
                              column
                              sm={3}
                            >
                              {"Address Line 2"}
                            </Label>
                            <Col sm={8}>
                              <Field
                                name="rep_address2"
                                type="text"
                                value={values.rep_address2}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={
                                  "form-control" +
                                  (errors.rep_address2 && touched.rep_address2
                                    ? " is-invalid"
                                    : "")
                                }
                                maxLength="250"
                              />
                              <ErrorMessage
                                name="rep_address2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right", height: "40px" }}
                              htmlFor="rep_suburb"
                              column
                              sm={3}
                            >
                              {"Suburb / Town"}
                            </Label>
                            <Col sm={8}>
                              {selectedCountry &&
                              selectedCountry.description === "Australia" ? (
                                <>
                                  <SingleSelect
                                    name="Suburb"
                                    placeholder="Select...."
                                    onChange={(selected) => {
                                      values.rep_postcode = selected.postcode;
                                      setFieldValue(
                                        "rep_suburb",
                                        selected.label
                                      );
                                      // console.log("selected subrbb", selected);
                                      setSelectedSuburb({
                                        ...selected,
                                        label: selected.value,
                                      });
                                      setFieldValue(
                                        "rep_state",
                                        selected.stateId
                                      );
                                      const tmpselctState = states.find(
                                        (ob) => ob.state_id === selected.stateId
                                      );
                                      setSelectedState(tmpselctState);
                                      setFieldValue(
                                        "rep_state_name",
                                        tmpselctState.state_desc
                                      );
                                    }}
                                    className={
                                      errors.rep_suburb ? "is-invalid" : ""
                                    }
                                    options={suburbList}
                                    value={selectedSuburb}
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
                                    name="rep_suburb"
                                    type="text"
                                    value={values.rep_suburb}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
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
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="rep_state_name"
                              column
                              sm={3}
                            >
                              {"State"}
                            </Label>
                            <Col sm={8}>
                              {selectedCountry &&
                              selectedCountry.description === "Australia" &&
                              selectedCountry.description === "Australia" ? (
                                <>
                                  <SingleSelect
                                    name="state"
                                    placeholder="Select...."
                                    onChange={(selected) => {
                                      // console.log("selected state", selected);
                                      setFieldValue(
                                        "rep_state",
                                        selected.state_id
                                      );
                                      setFieldValue(
                                        "rep_state_name",
                                        selected.state_desc
                                      );
                                      setSelectedState(selected);
                                      setSelectedSuburb(null);
                                      setsuburbList(
                                        SubrbCpy.filter(
                                          (val) =>
                                            val.stateId === selected.state_id
                                        )
                                      );
                                      setFieldValue("rep_suburb", "");
                                      setFieldValue("rep_postcode", "");
                                    }}
                                    className={
                                      errors.rep_state ? "is-invalid" : ""
                                    }
                                    options={states}
                                    isOptionSelected={(x) => {
                                      return selectedState &&
                                        x.state_id === selectedState.state_id
                                        ? x
                                        : null;
                                    }}
                                    value={selectedState}
                                  />
                                  <ErrorMessage
                                    name="rep_state"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </>
                              ) : (
                                <>
                                  <Field
                                    name="rep_state_name"
                                    type="text"
                                    value={values.rep_state_name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    className={
                                      "form-control" +
                                      (errors.rep_state_name &&
                                      touched.rep_state_name
                                        ? " is-invalid"
                                        : "")
                                    }
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
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="rep_postcode"
                              column
                              sm={3}
                            >
                              {"Postcode"}
                            </Label>
                            <Col sm={8}>
                              <input
                                name="rep_postcode"
                                type="text"
                                value={values.rep_postcode}
                                onBlur={handleBlur}
                                // onChange={handleChange}
                                onChange={(ev) => {
                                  setFieldValue(
                                    "rep_postcode",
                                    removeEmptySpaces(ev.target.value)
                                  );
                                }}
                                className={
                                  "form-control" +
                                  (errors.rep_postcode && touched.rep_postcode
                                    ? " is-invalid"
                                    : "")
                                }
                                // maxLength="250"
                                maxLength={
                                  selectedCountry &&
                                  selectedCountry.label &&
                                  selectedCountry.label.toLowerCase() ===
                                    "australia"
                                    ? 4
                                    : 10
                                }
                              />
                              <ErrorMessage
                                name="rep_postcode"
                                component="div"
                                className="invalid-feedback"
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor="rep_country_id"
                              column
                              sm={3}
                              //   className={
                              //     errors.newType && touched.newType
                              //       ? ' is-invalid-label required-field'
                              //       : 'required-field'
                              //   }
                            >
                              {"Country"}
                            </Label>
                            <Col sm={8}>
                              <SingleSelect
                                name="country"
                                minMenuHeight={300}
                                placeholder="Select...."
                                onChange={(selected) => {
                                  setFieldValue("rep_country_id", selected.id);
                                  setSelectedCountry(selected);
                                  if (selected.description === "Australia") {
                                    setsuburbList(SubrbCpy);
                                  }
                                }}
                                className={
                                  errors.rep_country_id ? "is-invalid" : ""
                                }
                                options={countryList}
                                isOptionSelected={(x) => {
                                  return selectedCountry &&
                                    x.id === selectedCountry.id
                                    ? x
                                    : null;
                                }}
                                value={selectedCountry}
                              />
                              <ErrorMessage
                                name="rep_country_id"
                                component="div"
                                className="invalid-feedback"
                              />
                            </Col>
                          </FormGroup>
                        </div>
                      </div>
                    </FormGroup>
                  </Row>
                </ModalBody>
                <ModalFooter className="mt-4">
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
                      setErrors({});
                      handleClose(values);
                    }}
                    color="secondary"
                    className="clsbtn btn btn-secondary"
                  >
                    {type === ADD ? CLOSE : CANCEL}
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
          </>
        )}
      </Formik>
      <AddEditRepresentativeCategories
        type={ADD}
        Data={{}}
        ShowModel={showAddEditForm}
        ParentCallBackToRepresentativeView={ParentCallBackToRepresentativeView}
      />
    </>
  );
};

export default AddEditResidentRepresentative;
