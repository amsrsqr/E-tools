import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Page from "../../components/Page";
import Icon from "../../../src/assets/Images/icon.png";
import {
  ADD,
  CURRENTPAYMENTPRICEDETAILS,
  EDIT,
  PAYMENTDETAILSANDVARIATIONS,
  PLUSSIGN,
} from "../../constant/FieldConstant";
import {
  CURRENTPAYMENTPRICEDETAILSMSG,
  PAYMENTDETAILSANDVARIATIONSMSG,
} from "../../constant/MessageConstant";
import { Formik, Field, ErrorMessage } from "formik";

import * as Yup from "yup";
import {
  ModalBody,
  FormGroup,
  Label,
  Button,
  Row,
  Col,
  Form,
  Card,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import AddPaymentDetails from "./AddPaymentDetails";
import moment from "moment";
import paymentService from "../../services/Resident/payment.service";
import ViewPaymentVariation from "./ViewPaymentVariation";
import SuccessAlert from "../../components/SuccessAlert";
import commonServices from "../../services/Common/common.services";
import DirtyWarningAlert from "../../components/DirtyWarningAlert";
const ViewPaymentDetails = ({
  admissionDate,
  residentId,
  effectiveDate,
  refundComplete,
  isCancelling,
  handlIsUnSavedData,
  isUnsavedData,
  residentActionType,
  activeStep,
  navigationToView,
}) => {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    AdmissionDate: "",
  });
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [actionType, setActionType] = useState();
  const [admissionDt, setAdmissionDt] = useState();
  const [effectiveDt, setEffectiveDt] = useState();
  const [projectedDecisionDate, setProjectedDecisionDate] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [paymentList, setPaymentList] = useState(null);
  const [bindingObject, setBindingObject] = useState({});
  const [paymentDetailsVariationCpy, setPaymentDetailsVariationCpy] = useState(
    []
  );
  const [isAdded, setIsAdded] = useState(true);
  const [cancelData, setCancelData] = useState([]);
  const [mpirValue, setMpirValue] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    if (navigationToView) {
      navigate("/eRADWeb/viewResident", { replace: true });
    }
  }, [navigationToView]);

  useEffect(() => {
    if (isCancelling && isUnsavedData && activeStep === 1) {
      console.log("here");
      const updatedObj = {
        screenName: "PaymentDetails",
        isBond: false,
        isPermanent: false,
        id: parseInt(localStorage.getItem("PaymentRadId")),
        listPaymentDetails: cancelData,
      };

      paymentService
        .cancelDataInPaymentDetails(updatedObj)
        .then((response) => {
          // console.log("cancelDataInPaymentDetails response", response);
          // if (isCancelling) {
          //   navigate("/eRADWeb/viewResident", { replace: true });
          // }
        })
        .catch((error) => {
          // console.log("cancelDataInPaymentDetails error", error);
        });
    }

    if (isCancelling && isAdded && activeStep === 1) {
      console.log("here");
      const updatedObj = {
        screenName: "PaymentDetails",
        isBond: false,
        isPermanent: false,
        id: parseInt(localStorage.getItem("PaymentRadId")),
        listPaymentDetails: null,
      };

      console.log("isAdded updatedObj", updatedObj);

      paymentService
        .cancelDataInPaymentDetails(updatedObj)
        .then((response) => {
          console.log("cancelDataInPaymentDetails response", response);
          // navigate("/eRADWeb/viewResident", { replace: true });
        })
        .catch((error) => {
          console.log("cancelDataInPaymentDetails error", error);
        });
    }
  }, [isCancelling]);

  useEffect(() => {
    getPaymentDetails("firstCall");
    getMpirValue();
  }, [residentId]);

  useEffect(() => {
    console.log("cancelData in useEffect", cancelData);
    if (cancelData && cancelData.length > 0) {
      handlIsUnSavedData(true);
    }
  }, [cancelData]);

  const handleIsAdded = () => {
    console.log("SETTING ADDED TO TRUE");
    setIsAdded(true);
    handlIsUnSavedData(true);
  };

  const getMpirValue = () => {
    commonServices.getMPIR(new Date().toJSON()).then((response) => {
      console.log("MPIR===>", response.result.feePost);
      paymentService.setMpir(
        response.result.feePost ? response.result.feePost : 0
      );
      setMpirValue(response.result.feePost ? response.result.feePost : 0);
    });
    // feesAndChargesServices.getAllfeesAndCharges().then((response) => {
    //   console.log("MPIR===>", response);
    //   paymentService.setMpir(response.length ? response[0].mpir : 0);
    // });
  };
  const getPaymentDetails = (firstCall) => {
    if (residentId !== -1) {
      setLoading(true);
      paymentService.getAllPayment(residentId).then((response) => {
        setLoading(false);
        localStorage.setItem("PaymentRadId", response.paymentDetails?.radId);
        console.log(response);
        console.log(paymentList);
        if (response.variations) {
          setBindingObject(response);

          if (firstCall == "firstCall")
            setPaymentDetailsVariationCpy(response.variations);
        }
        setPaymentList(response);
        //setPaymentList([]);
        //setPaymentList([1]);
      });
    }
  };

  const convertDate = (dt) => {
    console.log(dt);
    let altDate = new Date();
    dt = dt ? dt : altDate;
    return `${(new Date(dt).getDate() < 10 ? "0" : "") +
      new Date(dt).getDate()}/${(new Date(dt).getMonth() < 10 ? "0" : "") +
      (new Date(dt).getMonth() + 1)}/${new Date(dt).getFullYear()}`;
  };

  const handleShow = () => {
    setShowAddEditForm(true);
    setSelectedRowData({});
    setActionType(ADD);
  };

  useEffect(() => {
    setEffectiveDt(
      moment(effectiveDate)
        .local()
        .format("DD/MM/YYYY")
    );
  }, [effectiveDate]);

  useEffect(() => {
    setAdmissionDt(
      moment(admissionDate)
        .local()
        .format("DD/MM/YYYY ")
    );
    let projectedDate = new Date(
      new Date(admissionDate).setDate(new Date(admissionDate).getDate() + 28)
    );
    setProjectedDecisionDate(
      moment(projectedDate)
        .local()
        .format("DD/MM/YYYY ")
    );
  }, [admissionDate]);

  const ParentCallBackToView = (childdata, success, msg = null) => {
    setShowAddEditForm(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: msg ? msg : actionType === EDIT ? "updated" : "saved",
        callback: () => {
          setShowSuccessAlert(false);
          getPaymentDetails();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const UpdateCancelCallback = (updatedRecordID) => {
    if (updatedRecordID) {
      handlIsUnSavedData(true);
    }
    console.log("updatedRecordID in PaymentVariation ", updatedRecordID);
    if (paymentDetailsVariationCpy && paymentDetailsVariationCpy.length > 0) {
      const foundItem = paymentDetailsVariationCpy.find(
        (ob) => ob.id === updatedRecordID
      );
      if (foundItem && Object.keys(foundItem).length > 0) {
        foundItem.radId = parseInt(localStorage.getItem("PaymentRadId"));
        foundItem.residentId = parseInt(localStorage.getItem("residentId"));
        foundItem.mpir = mpirValue;
        foundItem.effectiveDate = moment(foundItem.effectiveDate).format();
        delete foundItem.dapdacPortion;
        delete foundItem.facilityId;
        delete foundItem.firstCreatedBy;
        delete foundItem.isUpdated;
        delete foundItem.lastModifiedBy;

        console.log("foundItem", foundItem);

        if (cancelData && cancelData.length > 0) {
          setCancelData([...cancelData, foundItem]);
        } else {
          setCancelData([foundItem]);
        }
      }
    }
  };
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {PAYMENTDETAILSANDVARIATIONS}
          </div>
          <hr className="headerBorder" />
          <div>{PAYMENTDETAILSANDVARIATIONSMSG}</div>
          <br />

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              newType: Yup.string().required(),
            })}
            //validate={validateForm}
            validateOnChange={true}
            validateOnBlur={false}
            //onSubmit={saveRadRacDeductionType}
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
            }) => (
              <>
                {loading ? <Loader></Loader> : null}

                <Form onSubmit={handleSubmit}>
                  {(isUnsavedData || unsavedChanges) && !isCancelling ? (
                    <>
                      <DirtyWarningAlert
                        sourceName={
                          residentActionType === "Edit"
                            ? "Edit Resident"
                            : "Add New Resident"
                        }
                        isBlocking={
                          (isUnsavedData || unsavedChanges) && !isCancelling
                        }
                        messageBody={
                          "Are you sure you want to exit to the Register and discard these changes?"
                        }
                      />
                    </>
                  ) : null}
                  <ModalBody>
                    <div
                      style={{ width: "60%" }}
                      className="d-flex justify-content-around"
                    >
                      <Card
                        className="col-5  ml-1"
                        style={{
                          height: "40%",
                          backgroundColor: refundComplete ? "#d3d3d378" : "",
                        }}
                      >
                        <div className=" mt-4 mb-2 mr-2 ">
                          {/* <div className="paymentdetailouterbox"> */}
                          <Row className={"fieldStyle"}>
                            <FormGroup row>
                              <Label
                                style={{
                                  textAlign: "right",
                                  paddingTop: "4px",
                                }}
                                htmlFor="AdmissionDate"
                                column
                                sm={4}
                              >
                                {"Admission Date"}
                              </Label>
                              <Col sm={8}>
                                <Field
                                  name="AdmissionDate"
                                  type="text"
                                  value={admissionDt}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  style={{
                                    fontSize: "14px",
                                    width: "90%",
                                    paddingLeft: "12px",
                                  }}
                                  disabled={true}
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{
                                  textAlign: "right",
                                  marginTop: "-11px",
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
                                {"Projected Payment Decision Date "}
                              </Label>
                              <Col sm={8}>
                                <Field
                                  name="newType"
                                  type="text"
                                  value={projectedDecisionDate}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  style={{
                                    fontSize: "14px",
                                    width: "90%",
                                    paddingLeft: "12px",
                                  }}
                                  disabled={true}
                                />
                              </Col>
                            </FormGroup>
                          </Row>
                        </div>
                      </Card>
                      <Card
                        className="col-5 mb-3 ml-1"
                        style={{
                          maxHeight: "90%",
                          backgroundColor: refundComplete ? "#d3d3d378" : "",
                        }}
                      >
                        <div className=" mt-5 mb-4 mr-2 ">
                          {/* <div className="paymentdetailouterbox"> */}
                          <Row className={"fieldStyle"}>
                            <FormGroup row>
                              <Label
                                htmlFor="newType"
                                column
                                sm={4}
                                style={{
                                  textAlign: "right",
                                  marginTop: "-13px",
                                }}
                              >
                                {"Actual Payment Decision Date"}
                              </Label>
                              <Col sm={8}>
                                <Field
                                  name="actualPaymentDecisionDate"
                                  type="text"
                                  value={
                                    (bindingObject &&
                                      bindingObject.paymentDetails &&
                                      bindingObject.paymentDetails
                                        .actualPaymentDecisionDate &&
                                      convertDate(
                                        bindingObject.paymentDetails
                                          .actualPaymentDecisionDate
                                      )) ||
                                    "N/A"
                                  }
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  style={{
                                    fontSize: "14px",
                                    width: "90%",
                                    paddingLeft: "12px",
                                  }}
                                  disabled={true}
                                />
                                <ErrorMessage
                                  name="newType"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </Col>
                            </FormGroup>
                          </Row>
                        </div>
                      </Card>
                    </div>
                  </ModalBody>
                </Form>

                {/* </Modal> */}
              </>
            )}
          </Formik>

          <br />

          {paymentList &&
          paymentList.variations &&
          paymentList.variations.length ? (
            <>
              {
                <ViewPaymentVariation
                  refundComplete={refundComplete}
                  bindingObject={bindingObject}
                  residentId={residentId}
                  parentCallBack={getPaymentDetails}
                  admissionDate={admissionDate}
                  UpdateCancelCallback={UpdateCancelCallback}
                  handleIsAdded={handleIsAdded}
                />
              }
            </>
          ) : (
            <>
              <div className="head mt-3">
                <img src={Icon} className="icon" />
                {CURRENTPAYMENTPRICEDETAILS}
              </div>
              <hr className="headerBorder" />
              <div
                className="d-flex align-items-center"
                style={{ marginBottom: "15px" }}
              >
                <div style={{ color: "#BBBBBB" }}>
                  {CURRENTPAYMENTPRICEDETAILSMSG}
                </div>
                <Button
                  className="addbtn btn btn-primary m-2 btnleft "
                  onClick={handleShow}
                  disabled={refundComplete}
                >
                  {PLUSSIGN} {ADD} {"Details"}
                </Button>
              </div>
            </>
          )}
          <br />
          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.actionType}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}
          <AddPaymentDetails
            refundComplete={refundComplete}
            type={actionType}
            Data={selectedRowData}
            ShowModel={showAddEditForm}
            ParentCallBackToView={ParentCallBackToView}
            residentId={residentId}
            admissionDate={admissionDate}
            handleIsAdded={handleIsAdded}
          />
        </Page>
      )}
    </>
  );
};

export default ViewPaymentDetails;
