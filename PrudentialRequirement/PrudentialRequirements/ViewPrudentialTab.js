import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Icon from "../../../assets/Images/icon.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormGroup, Label, Button, Row, Col } from "reactstrap";
import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";

import {
  BANKPAYMENTCHARGES,
  BANKRECEIPTS,
  FACILITY,
  PAYMENTCHARGES,
  PRUDENTIALREQUIREMENTS,
  RECEIPTS,
  SELECTFACILITY,
} from "../../../constant/FieldConstant";
import "../../../css/style.css";
import commonServices from "../../../services/Common/common.services";
import ViewPaymentCharges from "./PaymentCharges/ViewPaymentCharges";
import ViewReceipts from "./Receipts/ViewReceipts";
import ViewBankReceipts from "./BankReceipts/ViewBankReceipts";
import ViewBankPaymentCharges from "../BankPaymentCharges/ViewBankPaymentCharges";
import SingleSelect from "../../../components/MySelect/MySelect";

const ViewPrudentialTab = () => {
  const [loading, setLoading] = useState(false);
  const [ActiveTab, setActiveTab] = useState(0);
  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [enableTab, setEnableTab] = useState(false);

  const getFacilities = () => {
    commonServices.getAllFacilities().then((response) => {
      setLoading(false);
      let arr = response.result.map((x) => {
        x.label = x.facility_name;
        x.value = x.facility_id;
        return x;
      });
      setFacilityList(arr);
    });
  };

  useEffect(() => {
    getFacilities();
  }, []);

  return (
    <div>
      <div className="head mt-3">
        <img src={Icon} className="icon" alt="#" />
        {PRUDENTIALREQUIREMENTS}
        <hr className="headerBorder" />
      </div>

      <Formik
        enableReinitialize
        // initialValues={initialValues}
        // validationSchema={Yup.object().shape({
        //   name: Yup.string(),
        //   description: Yup.string(),
        // })}
        // validate={validateForm}
        validateOnChange={true}
        validateOnBlur={false}
        // onSubmit={saveDocumentType}
      >
        {({
          errors,
          handleReset,
          handleSubmit,
          isSubmitting,
          setErrors,
          touched,
          values,
          setFieldTouched,
          setFieldValue,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div style={{ width: "50%" }} className=" row d-flex">
                <FormGroup row>
                  <Label
                    style={{ textAlign: "right", height: "40px" }}
                    htmlFor="facility_id"
                    column
                    sm={3}
                    // className="modal-title"
                    // className={
                    //   errors.facility_id && touched.facility_id
                    //     ? "is-invalid-label required-field fw-bold"
                    //     : "required-field"
                    // }
                  >
                    {SELECTFACILITY}
                  </Label>
                  <Col sm={6}>
                    <SingleSelect
                      name="facility_id"
                      // placeholder="Select...."
                      // onBlur={(selected) =>
                      //   setFieldTouched("facility_id", selected.facility_id)
                      // }
                      onChange={(selected) => {
                        // setFieldValue("facility_id", selected.facility_id);
                        setSelectedFacility(selected);
                      }}
                      className={errors.facility_id ? "is-invalid" : ""}
                      options={facilityList}
                      isOptionSelected={(x) => {
                        return selectedFacility &&
                          x.facility_id === selectedFacility.facility_id
                          ? x
                          : null;
                      }}
                      value={selectedFacility}
                      // theme={reactSelectTheme(
                      //   errors.facility_id && touched.facility_id
                      // )}
                    />
                    {/* <MultiSelect
                      options={facilityList}
                      value={selectedFacility}
                      onChange={setSelectedFacility}
                      labelledBy="Select"
                    /> */}
                  </Col>
                  {/* <Col sm={3}> */}
                  <Button
                    style={{ width: "20%", marginTop: "-2px", height: "38px" }}
                    type="reset"
                    className="clsbtn btn btn-secondary"
                    size="md"
                    onClick={() => {
                      if (selectedFacility) {
                        setEnableTab(true);
                      }
                    }}
                    disabled={!selectedFacility}
                  >
                    {"View Details"}
                  </Button>
                  <Button
                    className="addbtn btnfix btn btn-primary "
                    style={{
                      width: "fit-content",
                      marginTop: "-2px",
                      height: "38px",
                      marginRight: "390px",
                      borderColor: "lightgray ",
                    }}
                    disabled
                    onClick={() => {}}
                  >
                    {"Generate Liquidity Strategy "}
                  </Button>
                  {/* </Col> */}
                  {/* <Col sm={3}>
                    <InlineBottomErrorMessage name="facility_id" />
                  </Col> */}
                </FormGroup>
              </div>
            </Form>
            <br />

            <div>
              <Tabs
                selectedIndex={ActiveTab}
                onSelect={(index) => setActiveTab(index)}
              >
                <TabList
                  style={{
                    borderBottomColor: "#593e8e",
                    borderBottomWidth: 3,
                    paddingBottom: "0px",
                    display: "flex",
                    marginLeft: "-10px",
                  }}
                >
                  <Tab
                    className={"selectedTabClass"}
                    style={{
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                      backgroundColor:
                        ActiveTab === 0 && selectedFacility !== null
                          ? "#593e8e"
                          : ActiveTab === 0 && selectedFacility === null
                          ? "#c8c8c8"
                          : "#f2f2f2",
                      color:
                        ActiveTab === 0 && selectedFacility !== null
                          ? "white"
                          : ActiveTab === 0 && selectedFacility === null
                          ? "#7e7e7e"
                          : "black",
                      fontWeight: ActiveTab === 0 ? "bold" : "",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {PAYMENTCHARGES}
                  </Tab>
                  <Tab
                    disabled={!selectedFacility || !enableTab}
                    className={"selectedTabClass"}
                    style={{
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                      cursor: "pointer",
                      fontWeight: ActiveTab === 1 ? "bold" : "",
                      backgroundColor: ActiveTab === 1 ? "#593e8e" : "#f2f2f2",
                      color: ActiveTab === 1 ? "white" : "black",
                      fontWeight: 600,
                    }}
                  >
                    {RECEIPTS}
                  </Tab>
                  <Tab
                    disabled={!selectedFacility || !enableTab}
                    className={"selectedTabClass"}
                    style={{
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                      cursor: "pointer",
                      fontWeight: ActiveTab === 2 ? "bold" : "",
                      backgroundColor: ActiveTab === 2 ? "#593e8e" : "#f2f2f2",
                      color: ActiveTab === 2 ? "white" : "black",
                      fontWeight: 600,
                    }}
                  >
                    {BANKPAYMENTCHARGES}
                  </Tab>
                  <Tab
                    disabled={!selectedFacility || !enableTab}
                    className={"selectedTabClass"}
                    style={{
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                      cursor: "pointer",
                      backgroundColor: ActiveTab === 3 ? "#593e8e" : "#f2f2f2",
                      color: ActiveTab === 3 ? "white" : "black",
                      fontWeight: ActiveTab === 3 ? "bold" : "",
                      fontWeight: 600,
                    }}
                  >
                    {BANKRECEIPTS}
                  </Tab>
                </TabList>

                <TabPanel disabled={!selectedFacility || !enableTab}>
                  <ViewPaymentCharges
                    selectedFacility={selectedFacility}
                    enableTab={enableTab}
                  />
                </TabPanel>
                <TabPanel>
                  <ViewReceipts selectedFacility={selectedFacility} />
                </TabPanel>
                <TabPanel>
                  <ViewBankPaymentCharges selectedFacility={selectedFacility} />
                </TabPanel>
                <TabPanel>
                  <ViewBankReceipts selectedFacility={selectedFacility} />
                </TabPanel>
              </Tabs>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default ViewPrudentialTab;
