import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import Icon from "../../../../src/assets/Images/icon.png";
import Page from "../../../components/Page";
import * as Yup from "yup";
import { Button, Col, Form, FormGroup, Label } from "reactstrap";
import preferencesServices from "../../../services/Setting/preferences.services";
import { ErrorMessage, Field, Formik } from "formik";
import { PREFERENCES, ADD, EDIT } from "../../../constant/FieldConstant";
import SuccessAlert from "../../../components/SuccessAlert";
import {
  NUMBEROFDAYS,
  PREFERENCEDAYSERROR,
} from "../../../constant/MessageConstant";
import Select from "react-select";
import DirtyWarningAlert from "../../../components/DirtyWarningAlert";
import { blockInvalidChar } from "../../../utils/Strings";
import SingleSelect from "../../../components/MySelect/MySelect";

const ViewPreference = () => {
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [selectedEOP, setSelectedEOP] = useState(null);
  const [selectedAmountDisplay, setSelectedAmountDisplay] = useState(null);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const List = [
    { value: "Monthly", label: "Monthly" },
    { value: "Fortnightly", label: "Fortnightly" },
  ];
  const [selectedStatus, setSelectedStatus] = useState({});
  // JSON.parse(localStorage.getItem("list"))
  // { value: "Monthly", label: "Monthly" }

  const handleChangeSelect = (selected) => {
    setSelectedDDEODValue(selected.value);
    // localStorage.setItem("list", JSON.stringify(selected));
    setSelectedStatus(selected);
  };
  const [selectedDDEODValue, setSelectedDDEODValue] = useState(null);
  const [initialValues, setInitialValues] = useState({
    isinclude_day_of_admission: true,
    isinclude_payment_receipt: true,
    is_end_of_period_monthly: true,
    end_of_period_selected: "",
    is_end_of_period_fortnightly: true,
    day_frequency: 0,
    is_multiply_display_amount: true,
    is_truncate_cents_after_two_decimals: true,
    is_round_to_nearest_cent: true,
  });
  // console.log("selectedStatus", selectedStatus);
  useEffect(() => {
    getAllPreferences();
    setSelectedStatus({ value: "Monthly", label: "Monthly" });
  }, []);

  const getAllPreferences = () => {
    setLoading(true);
    preferencesServices
      .getAllPreference()
      .then((response) => {
        setLoading(false);
        setInitialValues(response);
        // console.log("response at preferances eop", response);
        if (response.day_frequency > 0) setSelectedEOP("day_frequency");
        else setSelectedEOP("ddEopSelect");

        if (response.is_round_to_nearest_cent)
          setSelectedAmountDisplay("is_round_to_nearest_cent");
        else setSelectedAmountDisplay("is_truncate_cents_after_two_decimals");
        if (response.is_end_of_period_monthly) {
          setSelectedDDEODValue("Monthly");
          setSelectedStatus({ value: "Monthly", label: "Monthly" });
        }
        if (response.is_end_of_period_fortnightly) {
          // console.log("in fortnighty", response.is_end_of_period_fortnightly);
          setSelectedDDEODValue("Fortnightly");
          setSelectedStatus({ value: "Fortnightly", label: "Fortnightly" });
        }
        //setSelectedType({ id: response.id, label: response. });
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);
    if (selectedEOP === "day_frequency") {
      if (values.day_frequency === "") {
        errorObj.day_frequency = NUMBEROFDAYS;
        errorArr.push({ name: "day_frequency" });
      }
    }

    if (values.day_frequency > 31) {
      errorObj.day_frequency = PREFERENCEDAYSERROR;
      errorArr.push({ name: "day_frequency" });
    }

    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
      // setShowErrorPopup(true);
    }

    return errorObj;
  };

  async function savePreference(fields, { setStatus, setSubmitting }) {
    setStatus();
    setLoading(true);
    preferencesServices
      .updatePreferences(
        fields.isinclude_day_of_admission,
        fields.isinclude_payment_receipt,
        selectedEOP === "day_frequency"
          ? false
          : selectedDDEODValue === "Monthly"
          ? true
          : false,
        selectedEOP === "day_frequency" ? fields.day_frequency : 0,
        selectedEOP === "day_frequency"
          ? false
          : selectedDDEODValue === "Fortnightly"
          ? true
          : false,
        fields.is_multiply_display_amount,
        selectedAmountDisplay === "is_round_to_nearest_cent" ? true : false,
        selectedAmountDisplay === "is_round_to_nearest_cent" ? false : true
      )
      .then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: EDIT,
            msg: response.message,
            callback: () => {
              setShowSuccessAlert(false);
              setSelectedStatus({ value: "Monthly", label: "Monthly" }); //JSON.parse(localStorage.getItem("list")
              getAllPreferences();
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

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        isinclude_day_of_admission: Yup.boolean(),
        isinclude_payment_receipt: Yup.boolean(),
        is_end_of_period_monthly: Yup.boolean(),
        is_end_of_period_fortnightly: Yup.boolean(),
        day_frequency: Yup.string(),
        is_multiply_display_amount: Yup.boolean(),
        is_truncate_cents_after_two_decimals: Yup.boolean(),
        is_round_to_nearest_cent: Yup.boolean(),
      })}
      validate={validateForm}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={savePreference}
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
      }) => (
        <>
          {loading ? (
            <Loader></Loader>
          ) : (
            <Page title={PREFERENCES}>
              <div className="head mt-3">
                <img src={Icon} className="icon" />
                {PREFERENCES}
              </div>

              <DirtyWarningAlert
                sourceName="Preferences"
                messageBody={
                  "Are you sure you want to exit to the preferences and discard these changes?"
                }
              />
              {showSuccessAlert && (
                <SuccessAlert
                  type={successAlertOptions.actionType}
                  msg={successAlertOptions.msg}
                  title={successAlertOptions.title}
                  callback={successAlertOptions.callback}
                ></SuccessAlert>
              )}
              <Form onSubmit={handleSubmit} autoComplete="off">
                <Button
                  type="submit"
                  className="addbtn btn btn-primary sm btnright justify-content-end"
                  style={{ marginTop: "-45px" }}
                >
                  Save
                </Button>
                <hr className="headerBorder" />
                <div className="headone" style={{ marginBottom: "14px" }}>
                  Interest Calculations
                </div>
                <FormGroup style={{ marginTop: "0.5rem" }}>
                  <Field type="checkbox" name="isinclude_day_of_admission" />{" "}
                  <Label style={{ paddingLeft: "1rem", marginBottom: "0rem" }}>
                    Include day of Admission as a part of Interest Calculations
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Field type="checkbox" name="isinclude_payment_receipt" />{" "}
                  <Label style={{ paddingLeft: "1rem" }}>
                    Include date of Payment Receipt and day of Discharge as a
                    part of Interest Calculations
                  </Label>
                </FormGroup>
                <div
                  className="head mt-3 headone"
                  style={{ marginBottom: "10px" }}
                >
                  End of Period (EoP)
                </div>
                <FormGroup row>
                  <Label className="fw-bold" sm={1}>
                    End of Period
                  </Label>
                  <Col className="mt-2" sm={1} style={{ width: "1%" }}>
                    <Field
                      type="radio"
                      name="ddEopSelect"
                      // value="ddEopSelect"
                      checked={selectedEOP === "ddEopSelect" ? true : false}
                      onChange={(state) => {
                        setFieldValue("ddEopSelect", state.target.checked);
                        if (state.target.checked) {
                          setSelectedEOP("ddEopSelect");
                          setSelectedDDEODValue(
                            selectedStatus.value
                            // JSON.parse(localStorage.getItem("list")).value
                          );
                        } else {
                          setSelectedEOP("day_frequency");
                        }
                      }}
                    />{" "}
                  </Col>
                  <Col sm={4}>
                    <SingleSelect
                      placeholder="Select Option"
                      onChange={(selected) => {
                        handleChangeSelect(selected);
                        setFieldValue("end_of_period_selected", selected.value);
                      }}
                      value={selectedStatus}
                      isSearchable={List.length < 5 ? false : true}
                      options={List}
                      isDisabled={selectedEOP === "ddEopSelect" ? false : true}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label className="fw-bold" sm={1}></Label>
                  <Col className="mt-2" sm={1} style={{ width: "6%" }}>
                    <Field
                      type="radio"
                      name="day_frequency"
                      // value="day_frequency"
                      checked={selectedEOP === "day_frequency" ? true : false}
                      onChange={(state) => {
                        setFieldValue("day_frequency", state.target.checked);
                        state.target.checked
                          ? setSelectedEOP("day_frequency")
                          : setSelectedEOP("ddEopSelect");
                      }}
                    />
                    <span className="ps-2">Every</span>
                  </Col>
                  <Col sm={2}>
                    <Field
                      type="number"
                      name="day_frequency"
                      placeholder="0"
                      onKeyDown={blockInvalidChar}
                      value={values.day_frequency ? values.day_frequency : ""}
                      className={
                        "text form-control" +
                        (errors.day_frequency && touched.day_frequency
                          ? " is-invalid"
                          : "")
                      }
                      style={{
                        color: selectedEOP !== "day_frequency" && "grey",
                      }}
                      disabled={selectedEOP === "day_frequency" ? false : true}
                    />
                    <ErrorMessage
                      name="day_frequency"
                      component="div"
                      className="invalid-feedback"
                    />
                  </Col>
                  <Col className="mt-2" sm={4}>
                    <span> Days (Max 31 Days, or a Month)</span>
                  </Col>
                </FormGroup>
                {/* <FormGroup check>
                  <Field type="checkbox" name="is_multiply_display_amount" />{" "}
                  <Label check>
                    Multiply displayed Daily Amount by number of Days to get
                    final EoP value
                  </Label>
                </FormGroup> */}
                <div className="head headone">Amount Display</div>
                <FormGroup>
                  <div className="px-3 mt-2">
                    <Field
                      type="radio"
                      name="amountdisplay"
                      value="is_truncate_cents_after_two_decimals"
                      checked={
                        selectedAmountDisplay ===
                        "is_truncate_cents_after_two_decimals"
                          ? true
                          : false
                      }
                      onChange={(state) => {
                        setFieldValue("amountdisplay", state.target.checked);
                        state.target.checked
                          ? setSelectedAmountDisplay(
                              "is_truncate_cents_after_two_decimals"
                            )
                          : setSelectedAmountDisplay(
                              "is_round_to_nearest_cent"
                            );
                      }}
                    />
                    <span className="ps-2">
                      {" "}
                      Truncate Cents after two decimals
                    </span>

                    <Field
                      style={{ marginLeft: "10px" }}
                      type="radio"
                      name="amountdisplay1"
                      value="is_round_to_nearest_cent"
                      checked={
                        selectedAmountDisplay === "is_round_to_nearest_cent"
                          ? true
                          : false
                      }
                      onChange={(state) => {
                        setFieldValue("amountdisplay1", state.target.checked);
                        state.target.checked
                          ? setSelectedAmountDisplay("is_round_to_nearest_cent")
                          : setSelectedAmountDisplay(
                              "is_truncate_cents_after_two_decimals"
                            );
                      }}
                    />
                    <span className="ps-2">Round to nearest Cent</span>
                  </div>
                </FormGroup>
              </Form>
            </Page>
          )}
        </>
      )}
    </Formik>
  );
};
export default ViewPreference;
