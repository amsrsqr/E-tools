import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  FormGroup,
  Label,
  ModalFooter,
  Row,
} from "reactstrap";

import { MultiSelect } from "react-multi-select-component";
import commonServices from "../../../services/Common/common.services";
import reportsServices from "../../../services/Reports/Reports.Services";
import Icon from "../../../assets/Images/icon.png";
import Footlogo from "../../../assets/Images/eRAD.png";
import Footetoollogo from "../../../assets/Images/logo@2x.png";
import "../Reports.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Select from "react-select";
import ModalError from "../../../components/ModalError";
import { reactSelectTheme, selectStyle } from "../../../utils/ReactSelectTheme";
import MuiDatePicker from "../../../components/DatePicker/MaterialUi";
export function FacilityDetailsFilter({ setReportData }) {
  const [selectedFacility, setSelectedFacility] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [selectedCareCategory, setSelectedCareCategory] = useState([]);
  const [CareCategoryList, setCareCategoryList] = useState([]);
  const [selectedBondPaymentMethod, setSelectedBondPaymentMethod] = useState(
    []
  );
  const [BondPaymentMethodList, setBondPaymentMethodList] = useState([]);
  const [
    selectedRadRacPaymentMethod,
    setSelectedRadRacPaymentMethod,
  ] = useState([]);
  const [RadRacPaymentMethodList, setRadRacPaymentMethodList] = useState([]);
  const [selectedSortBy, setSelectedSortBy] = useState([]);
  const [SortByList, setSortByList] = useState([]);
  const [initialValues, setinitialValues] = useState({
    facility: [],
    datedAs: "",
    residentIDFrom: "",
    residentIDTo: "",
    careCategory: [],
    bondPaymentMethod: [],
    radRacPaymentMethod: [],
    sortBy: "",
    other: false,
    admissionDateFrom: "",
    admissionDateTo: "",
  });
  useEffect(() => {
    function getData() {
      getFacilities();
      getCareTypes();
      getPaymentTypes();
      getRadRacPaymentMethods();
      getSortByOptions();
      getfacilityDetailReport();
    }
    getData();
  }, []);
  const getFacilities = () => {
    commonServices.getAllFacilities().then((response) => {
      console.log("facility response", response);
      let arr = response.result.map((x) => {
        x.label = x.facility_name;
        x.value = x.facility_id;
        return x;
      });
      setFacilityList(arr);
      setSelectedFacility(arr);
    });
  };

  const getCareTypes = () => {
    commonServices.getAllCareTypeList().then((response) => {
      let arr = response.result.map((x) => {
        x.label = x.care_type_desc;
        x.value = x.care_type_id;
        return x;
      });

      console.log("care arr", arr);
      setCareCategoryList(arr);
      setSelectedCareCategory(arr);
    });
  };
  const getPaymentTypes = () => {
    commonServices.getAllPaymentTypes().then((response) => {
      // setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.description;
        x.value = x.id;
        return x;
      });
      setBondPaymentMethodList(arr);
      setSelectedBondPaymentMethod(arr);
    });
  };
  const getRadRacPaymentMethods = () => {
    commonServices.getRadRacPaymentMethods().then((response) => {
      // setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.name;
        x.value = x.id;
        return x;
      });
      setRadRacPaymentMethodList(arr);
      setSelectedRadRacPaymentMethod(arr);
    });
  };

  const getSortByOptions = () => {
    commonServices.getSortByOptions().then((response) => {
      // setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.name;
        x.value = x.id;
        return x;
      });
      // console.log("array of sort by", arr);
      setSortByList(arr);
      const findAddmissionOpt = arr.find((ob) => ob.label === "Admission Date");
      setSelectedSortBy(findAddmissionOpt);
    });
  };

  const getfacilityDetailReport = (dateAs) => {
    reportsServices.getfacilityDetailReport("2022-05-12").then((response) => {
      // setLoading(false);
      setReportData(response);
      console.log("Report Response", response);
    });
  };
  const handleFilter = (fields) => {
    console.log("fields", fields);
    console.log("selected", selectedFacility);
    // call getfacilityDetailReport this here
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={handleFilter}
    >
      {({
        handleReset,
        errors,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue,
        setFieldTouched,
      }) => (
        <Fragment>
          <Form onSubmit={handleSubmit}>
            <ModalError
            // showErrorPopup={showErrorPopup}
            // fieldArray={errorArray}
            // handleErrorClose={handleErrorClose}
            // errorMessage={BONDDEDUCTIONTYPE}
            ></ModalError>
            <div className="reportHeader">
              <img src={Icon} className="icon" />
              Filter
            </div>
            <Row className={"fieldstyle"}>
              <FormGroup row>
                <Label
                  style={{ textAlign: "left" }}
                  column
                  sm={4}
                  className={
                    errors.facility && touched.facility
                      ? " is-invalid-label "
                      : ""
                  }
                >
                  Facility
                </Label>
                <Col sm={8}>
                  <MultiSelect
                    options={facilityList}
                    value={selectedFacility}
                    onChange={setSelectedFacility}
                    labelledBy="Select"
                  />
                </Col>
              </FormGroup>
            </Row>

            <Row className={"fieldstyle"}>
              <FormGroup row>
                <Label
                  style={{ textAlign: "left" }}
                  column
                  sm={4}
                  className={
                    errors.datedAs && touched.datedAs && !values.datedAs
                      ? " is-invalid-label "
                      : ""
                  }
                >
                  Dated as
                </Label>
                <Col sm={8}>
                  <MuiDatePicker
                    id="datedAs"
                    name="datedAs"
                    className={"text form-control"}
                    selectedDate={
                      (values.datedAs && new Date(values.datedAs)) || null
                    }
                    maxDate={new Date()}
                    error={touched.datedAs && errors.datedAs && !values.datedAs}
                    getChangedDate={(val) => {
                      if (val) {
                        setFieldValue("datedAs", val.toJSON());
                      } else {
                        setFieldValue("datedAs", "");
                      }
                    }}
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row className={"fieldstyle"}>
              <FormGroup row>
                <Label
                  style={{ textAlign: "left" }}
                  column
                  sm={4}
                  className={
                    errors.residentIDFrom &&
                    touched.residentIDFrom &&
                    !values.residentIDFrom
                      ? " is-invalid-label "
                      : ""
                  }
                >
                  Resident ID From
                </Label>
                <Col sm={8}>
                  <div style={{ justifyContent: "space-between" }}>
                    <div className="d-flex align-items-center">
                      <div>
                        <Field
                          type="text"
                          className={"text form-control"}
                          name="residentIDFrom"
                        />
                      </div>
                      <div style={{ padding: "5px" }}>To</div>
                      <div>
                        <Field
                          type="text"
                          className={"text form-control"}
                          name="residentIDTo"
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </FormGroup>
            </Row>

            <Row>
              <FormGroup row>
                <Label
                  style={{ textAlign: "left" }}
                  column
                  sm={4}
                  className={
                    errors.facility && touched.facility
                      ? " is-invalid-label "
                      : ""
                  }
                >
                  Care Category
                </Label>
                <Col sm={8}>
                  <MultiSelect
                    options={CareCategoryList}
                    value={selectedCareCategory}
                    onChange={setSelectedCareCategory}
                    labelledBy="Select"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row className={"fieldstyle"}>
              <FormGroup row>
                <Label
                  style={{ textAlign: "left" }}
                  column
                  sm={4}
                  className={
                    errors.facility && touched.facility
                      ? " is-invalid-label "
                      : ""
                  }
                >
                  Bond Payment Method
                </Label>
                <Col sm={8}>
                  <MultiSelect
                    options={BondPaymentMethodList}
                    value={selectedBondPaymentMethod}
                    onChange={setSelectedBondPaymentMethod}
                    labelledBy="Select"
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row className={"fieldstyle"}>
              <FormGroup row>
                <Label
                  style={{ textAlign: "left" }}
                  column
                  sm={4}
                  className={
                    errors.facility && touched.facility
                      ? " is-invalid-label "
                      : ""
                  }
                >
                  RAD/RAC Payment Method
                </Label>
                <Col sm={8}>
                  <MultiSelect
                    options={RadRacPaymentMethodList}
                    value={selectedRadRacPaymentMethod}
                    onChange={setSelectedRadRacPaymentMethod}
                    labelledBy="Select"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row className={"fieldstyle"}>
              <FormGroup row>
                <Label
                  style={{ textAlign: "left" }}
                  column
                  sm={4}
                  className={
                    errors.typeId && touched.typeId ? "is-invalid-label " : ""
                  }
                >
                  Sort By
                </Label>
                <Col sm={8}>
                  <Select
                    name="sortBy"
                    placeholder="Select...."
                    onBlur={(selected) =>
                      setFieldTouched("sortBy", selected.id)
                    }
                    onChange={(selected) => {
                      setFieldValue("sortBy", selected.id);
                    }}
                    className={
                      errors.typeId ? "is-invalid fontsize-14" : "fontsize-14"
                    }
                    options={SortByList}
                    isOptionSelected={(x) => {
                      return selectedSortBy && x.id === selectedSortBy.id
                        ? x
                        : null;
                    }}
                    value={selectedSortBy}
                    theme={reactSelectTheme(errors.sortBy && touched.sortBy)}
                    styles={selectStyle}
                    isSearchable={SortByList.length < 5 ? false : true}
                  />
                  <ErrorMessage
                    name="typeId"
                    component="div"
                    className="invalid-feedback"
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row className={"fieldstyle"}>
              <FormGroup row>
                <Label
                  style={{ textAlign: "left" }}
                  column
                  sm={4}
                  className={
                    errors.other && touched.other ? "is-invalid-label " : ""
                  }
                >
                  Other
                </Label>
                <Col sm={8}>
                  <div className="d-flex align-items-center">
                    <div>
                      <Field type="checkbox" name="other" />
                    </div>

                    <Label style={{ marginLeft: "10px", marginTop: "4px" }}>
                      Hide Resident Names
                    </Label>
                  </div>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <Card style={{ marginBottom: "10px" }}>
                <div className="reportFilterFooter">Admission Date</div>

                <div className="d-flex" style={{ padding: "8px" }}>
                  <div className=" d-flex align-items-center">
                    <Label style={{ padding: "5px" }}>From</Label>
                    <div className="col-5">
                      <MuiDatePicker
                        name="admissionDateFrom"
                        className={"text form-control"}
                        selectedDate={
                          (values.admissionDateFrom &&
                            new Date(values.admissionDateFrom)) ||
                          null
                        }
                        maxDate={new Date()}
                        error={
                          touched.admissionDateFrom &&
                          errors.admissionDateFrom &&
                          !values.admissionDateFrom
                        }
                        getChangedDate={(val) => {
                          if (val) {
                            setFieldValue("admissionDateFrom", val.toJSON());
                          } else {
                            setFieldValue("admissionDateFrom", "");
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label style={{ padding: "5px", width: "25px" }}>
                        To
                      </Label>
                    </div>
                    <div className="col-5">
                      <MuiDatePicker
                        name="admissionDateTo"
                        className={"text form-control"}
                        selectedDate={
                          (values.admissionDateTo &&
                            new Date(values.admissionDateTo)) ||
                          null
                        }
                        maxDate={new Date()}
                        error={
                          touched.admissionDateTo &&
                          errors.admissionDateTo &&
                          !values.admissionDateTo
                        }
                        getChangedDate={(val) => {
                          if (val) {
                            setFieldValue("admissionDateTo", val.toJSON());
                          } else {
                            setFieldValue("admissionDateTo", "");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Row>
            <ModalFooter style={{ justifyContent: "center" }}>
              <Button
                type="reset"
                className="clsbtn btn btn-secondary"
                size="md"
                style={{ width: "100px" }}
                onClick={() => {
                  handleReset();
                }}
              >
                Reset Filter
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="md"
                style={{ width: "100px" }}
                className="modalsave btn btn-primary mr-2"
              >
                Generate
              </Button>
            </ModalFooter>
          </Form>
        </Fragment>
      )}
    </Formik>
  );
}

export function FacilityDetailsReport({ ReportData }) {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    if (ReportData && ReportData.length > 0) {
      console.log("ReportData", ReportData);
      setReportData(ReportData);
    } else {
      setReportData([]);
    }
  }, [ReportData]);

  const renderRowData = (data, renderKey) => {
    return (
      <>
        {data && data[renderKey] && data[renderKey].length > 0 ? (
          data[renderKey].map((field, i) => {
            return (
              <>
                <tr className="reportalign" key={i}>
                  <td>
                    {field.admissionDate
                      ? field.admissionDate.split("T")[0]
                      : ""}
                  </td>
                  <td className="reportname">{field.firstName}</td>
                  <td className="reportname">{field.lastName}</td>
                  <td colspan="2">{field.monthlyRetentionAmount}</td>
                  <td colspan="2">{field.noOfRetentions}</td>
                  <td>{field.agreedBond}</td>
                  <td colspan="2">{field.partLumpSumAmount}</td>
                  <td colspan="2">{field.totalPaymentAmount}</td>
                  <td>{field.lumpSumAmountOutstanding}</td>
                  <td colspan="2">{field.totalBondBalanceOutstanding}</td>
                  <td>{field.totalRetentionDeductions}</td>
                  <td>{field.totalInterestDeductions}</td>
                  <td>{field.totalOtherDeductions}</td>
                  <td colspan="2">{field.balance}</td>
                </tr>
                <tr>
                  <td
                    scope="row"
                    colspan="8"
                    className="reportbody"
                    style={{ wordSpacing: "5px" }}
                  >
                    Resident ID:{field.residentId} Cat:
                    {field.category} MPIR: {field.mpir} Payment Method:
                    {field.paymentMethod}
                    {"  "}
                    Transferred:{field.transferred}
                  </td>
                </tr>
              </>
            );
          })
        ) : (
          <tr></tr>
        )}
        {data ? (
          <tr className="totalBorders reportalign ">
            <th colspan="4" className="reportbody">
              {" "}
              Totals{" "}
            </th>
            <td colspan=""></td>
            <td>{data.agreedBondTotal}</td>
            <td>{data.partLumsumAmountTotal}</td>
            <td>{data.paymentAmountTotal}</td>
            <td>{data.lumsumAmountOutstandingTotal}</td>
            <td>{data.bondBalanceOutstandingTotal}</td>
            <td>{data.retentionDeductionsTotal}</td>
            <td>{data.interestDeductionTotal}</td>
            <td>{data.otherDeductionTotal}</td>
            <td>{data.balanceTotal}</td>
          </tr>
        ) : null}
        <tr
          className="reportfooter reportalign"
          // style={{ borderTop: "solid", marginTop: "22px", width: "100%" }}
        >
          <th colspan="11" style={{ textAlign: "left" }}>
            [{data[renderKey].length} ] Non Extra Service Residents Total
          </th>
          <td></td>
          <td>{data.nonExtraServiceResidentLumsumAmountTotal}</td>
          <td>{data.nonExtraServiceResidentBondBalanceTotal}</td>
          <td colspan="3"></td>
          <td></td>
          <td></td>
          <td colspan="3">{data.nonExtraServiceResidentBalanceTotal}</td>
        </tr>
        <tr className="reportfooter reportalign">
          <th colspan="11" style={{ textAlign: "left" }}>
            [ 0 ] Extra Service Residents Total
          </th>
          <td></td>
          <td>{data.extraServiceResidentLumsumAmountTotal}</td>
          <td>{data.extraServiceResidentBondBalanceTotal}</td>
          <td colspan="3"></td>
          <td></td>
          <td></td>
          <td colspan="3">{data.extraServiceResidentBalanceTotal}</td>
        </tr>
      </>
    );
  };
  const renderHeader = (type) => {
    return (
      <tr
        className="reportalign"
        style={{ backgroundColor: " #8c77b0", color: "white" }}
      >
        <th>Admn Date</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th colspan="2">Monthly Retention Amount</th>
        <th colspan="2">No. of Retentions [Total\Taken \Remaining]</th>
        <th>Agreed Bond</th>
        <th colspan="2">Part Lump Sum Amount</th>
        <th colspan="2">Total Payment Amount</th>
        <th>Lump Sum Amount Outstanding</th>
        <th colspan="2">Total Bond Balance Outstanding</th>
        <th>Total Retention Deductions</th>
        <th>Total Interest Deductions</th>
        <th>Total Other Deductions</th>
        <th colspan="2">Balance</th>
      </tr>
    );
  };
  const renderRadRacHeader = (type) => {
    return (
      <tr
        className="reportalign"
        style={{ backgroundColor: " #8c77b0", color: "white" }}
      >
        <th>Admn Date</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th colspan="2"></th>
        <th colspan="2"></th>
        <th>Agreed Price</th>
        <th colspan="2">Agreed RAD/RAC Portion</th>
        <th colspan="2">Total RAD/RAC Received</th>
        <th>Total RAD/RAC Outstanding</th>
        <th colspan="2">Agreed DAP/DAC Portion</th>
        <th>Total DAP/DAC Deductions</th>
        <th>Total Care Fee Deductions</th>
        <th>Total Other Deductions</th>
        <th colspan="2">Balance</th>
      </tr>
    );
  };
  const renderRAdRacRowData = (data, renderKey) => {
    return (
      <>
        {data && data[renderKey] && data[renderKey].length > 0 ? (
          data[renderKey].map((field, i) => {
            return (
              <>
                <tr className="reportalign" key={i}>
                  <td>
                    {field.admissionDate
                      ? field.admissionDate.split("T")[0]
                      : ""}
                  </td>
                  <td className="reportname">{field.firstName}</td>
                  <td className="reportname">{field.lastName}</td>
                  <td colspan="2"></td>
                  <td colspan="2"></td>
                  <td>{field.agreedPrice}</td>
                  <td colspan="2">{field.agreedRADRACPortion}</td>
                  <td colspan="2">{field.totalRADRACReceived}</td>
                  <td>{field.totalRADRACOutstanding}</td>
                  <td colspan="2">{field.agreedDAPDACPortion}</td>
                  <td>{field.totalDAPDACDeductions}</td>
                  <td>{field.totalCareFeeDeductions}</td>
                  <td>{field.totalOtherDeductions}</td>
                  <td colspan="2">{field.balance}</td>
                </tr>
                <tr>
                  <td
                    scope="row"
                    colspan="13"
                    className="reportbody"
                    style={{ wordSpacing: "5px" }}
                  >
                    Resident ID:{field.residentId} Extra Services:
                    {field.extraServices} MPIR: {field.mpir} Payment Method:
                    {field.paymentMethod} Payment Decision Date:
                    {field.paymentDecisionDate
                      ? field.paymentDecisionDate.split("T")[0]
                      : ""}{" "}
                    {"  "}
                    Transferred:{field.transferred}
                  </td>
                </tr>
              </>
            );
          })
        ) : (
          <tr></tr>
        )}
        {data ? (
          <tr className="totalBorders reportalign ">
            <th colspan="4" className="reportbody">
              {" "}
              Totals{" "}
            </th>
            <td colspan=""></td>
            <td>{data.agreedBondTotal}</td>
            <td>{data.partLumsumAmountTotal}</td>
            <td>{data.paymentAmountTotal}</td>
            <td>{data.radRacOutstandingTotal}</td>
            <td>{data.agreedDapDacPortionTotal}</td>
            <td>{data.retentionDeductionsTotal}</td>
            <td>{data.interestDeductionTotal}</td>
            <td>{data.otherDeductionTotal}</td>
            <td>{data.balanceTotal}</td>
          </tr>
        ) : null}
        <tr
          className="reportfooter reportalign"
          style={{ borderTop: "solid", marginTop: "22px", width: "100%" }}
        >
          <th colspan="5" style={{ textAlign: "left" }}>
            [{data[renderKey].length} ] Non Extra Service Residents Total
          </th>
          <td></td>
          <td>{data.nonExtraServiceResidentRadRacOutStandingTotal}</td>
          <td>{data.nonExtraServiceResidentDapDacPortionTotal}</td>
          <td colspan="2"></td>
          <td></td>
          <td></td>
          <td colspan="3">{data.nonExtraServiceResidentBalanceTotal}</td>
        </tr>
        <tr className="reportfooter reportalign">
          <th colspan="5" style={{ textAlign: "left" }}>
            [ 0 ] Extra Service Residents Total
          </th>
          <td></td>
          <td>{data.extraServiceResidentRadRacOutStandingTotal}</td>
          <td>{data.extraServiceResidentDapDacPortionTotal}</td>
          <td></td>
          <td></td>
          <td></td>
          <td colspan="3">{data.extraServiceResidentBalanceTotal}</td>
        </tr>
      </>
    );
  };
  return (
    <div>
      {/* <PDFViewer > */}
      {/* Start of the document*/}
      {/* <Document> */}
      {/* <Page size="A4" > */}
      <table style={{ pageBreakAfter: "always" }}>
        <td colspan="7">
          Printed Date: 4/05/2022; Last EoM: 31/03/2022; Sort by: Admission Date
        </td>
        {reportData && reportData.length > 0
          ? reportData.map((data, id) => {
              return (
                <tbody key={id} style={{ overflowx: "scroll", width: "500px" }}>
                  <tr>
                    <th colspan="9" className="reportheader">
                      {data.facilityName}
                    </th>
                  </tr>

                  <tr>
                    <th colspan="9">
                      Active Accommodation Bonds / Payment Schedule - Detail
                    </th>
                  </tr>
                  <tr>
                    <td colspan="9">As at 5/4/2022</td>
                  </tr>
                  <tr>
                    <th
                      colspan="9"
                      style={{
                        paddingTop: "22px",
                        fontSize: "16px !important",
                      }}
                    >
                      Pre 1 July 2014 Payment Arrangements [Bonds]
                    </th>
                  </tr>
                  <tr>
                    <td colspan="20">
                      Catagory(Cat) codes : L = Low care H = High care E = Extra
                      Services Payment Methods : LS = Lump Sum P = Periodic PLS
                      = Part Lump Sum / Part Periodic
                    </td>
                  </tr>
                  {renderHeader()}

                  {renderRowData(
                    data.paymentArrangementBond,
                    "paymentArrangementBondDetails"
                  )}

                  <tr>
                    <th
                      colspan="9"
                      style={{
                        paddingTop: "22px",
                        fontSize: "16px !important",
                      }}
                    >
                      Post 1 July 2014 Payment Arrangements [RADs/RACs]
                    </th>
                  </tr>
                  {renderRadRacHeader()}
                  {renderRAdRacRowData(
                    data.paymentArrangementRadRac,
                    "paymentArrangementRadRacDetails"
                  )}
                  <tr>
                    <td
                      colSpan="22"
                      style={{ background: "#EDE9F1", margin: "10px" }}
                    ></td>
                  </tr>
                </tbody>
              );
            })
          : null}
      </table>
      {/* </Page> */}
      {/* </Document> */}
      {/* </PDFViewer> */}

      <table
        className="kvk"
        colspan="15"
        style={{ borderTop: "solid", marginTop: "22px", width: "100%" }}
      >
        <tr className="reportfooter reportalign">
          <th colspan="5" style={{ textAlign: "left" }}>
            [ 2 ] Non Extra Service Residents Total
          </th>
          <td></td>
          <td>$95,000.00</td>
          <td>$95,000.00</td>
          <td colspan="2"></td>
          <td></td>
          <td></td>
          <td colspan="3">$0.00</td>
        </tr>
        <tr className="reportfooter reportalign">
          <th colspan="5" style={{ textAlign: "left" }}>
            [ 0 ] Extra Service Residents Total
          </th>
          <td></td>
          <td>$0.00</td>
          <td>$0.00</td>
          <td></td>
          <td></td>
          <td></td>
          <td colspan="3">$0.00</td>
        </tr>
        <tfoot>
          <tr className="reportfooter">
            <img
              src={Footlogo}
              className="reportfooterlogo"
              style={{ width: "71px" }}
            />
            <th scope="row" colspan="14" style={{ textAlign: "center" }}>
              Page 1 of 9
            </th>
            <td
              colspan="3"
              style={{
                textAlign: "right",
                fontSize: "25px !important",
                marginRight: "-170px",
              }}
            >
              <img src={Footetoollogo} className="reportfooteretoollogo" />
              <th>Powered By e-Tools Sowftware</th>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
