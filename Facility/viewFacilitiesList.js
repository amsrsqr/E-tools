import "react-tabs/style/react-tabs.css";
import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Input, Card, CardBody, Button } from "reactstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import commonServices from "../../services/Common/common.services";
import { ListGroup, ListGroupItem } from "reactstrap";
import ViewListDocumentLogo from "./documentAndLogo/ViewListDocumentLogo";
import ViewFacilityDetails from "./facilityDetails/ViewFacilityDetails";
import facilityDetailsService from "../../services/Facility/facilityServiceFirstTab.services";
import Loader from "../../components/Loader";
import DirtyWarningAlertWithoutFormik from "../../components/DirtyWarningAlertWithoutFormik";

const ViewFacilitiesList = () => {
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allFacilities, setAllFacilities] = useState([]);
  const [facilityId, setFacilityId] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [suburbList, setsuburbList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [ActiveTab, setActiveTab] = useState(0);
  const [step, setStep] = useState(0);
  const [stepForTabSecond, setStepForTabSecond] = useState(0);
  const [show, setShow] = useState(false);
  const [newVal, setNewVal] = useState();
  useEffect(() => {
    getFacilitiesList();
  }, []);

  const getFacilitiesList = () => {
    setLoading(true);
    commonServices.getAllFacilities().then((response) => {
      setLoading(false);
      setStep(0);
      setAllFacilities(response.result);
      setFacilityId(response.result[0]?.facility_id);
      setFacilityName(response.result[0]?.facility_name);
    });
  };

  useEffect(() => {
    setStep(step);
  }, [step]);

  const getFacilityId = (item) => {
    setNewVal(item);
    if (step === 1) {
      setShow(true);
      setStep(0);
    } else {
      setShow(false);
      setActiveTab(0);
      setFacilityId(item.facility_id);
      setFacilityName(item.facility_name);
    }
  };

  useEffect(() => {
    getAllCountry();
    getAllState();
    getAllSuburb();
  }, []);

  const getCallbackForFacilityName = (val, id) => {
    const cpyallFacilities = [...allFacilities];
    const slctFcltIndx = cpyallFacilities.findIndex(
      (fl) => fl.facility_id === id
    );
    if (slctFcltIndx >= 0) {
      cpyallFacilities[slctFcltIndx].facility_name = val;
      setFacilityId(id);
      setFacilityName(val);
    }
    setAllFacilities(cpyallFacilities);
  };

  const getAllCountry = () => {
    facilityDetailsService.getCountries().then((response) => {
      response.map((x) => {
        x.label = x.description;
        x.value = x.id;
      });
      setCountryList(response);
    });
  };
  const getAllState = () => {
    facilityDetailsService.getStates().then((response) => {
      let arr = response.result.map((x) => {
        x.label = x.state_code;
        x.value = x.state_id;
        return x;
      });
      setStateList(arr);
    });
  };
  const getAllSuburb = () => {
    facilityDetailsService.getAllSuburbList().then((response) => {
      setsuburbList(response);
    });
  };
  const getAllCallback = (val) => {
    if (val === true) {
      setStep(1);
      setStepForTabSecond(1);
    } else {
      setStep(0);
      setStepForTabSecond(0);
    }
  };
  const newCallback = (val) => {
    if (val) {
      if (stepForTabSecond !== 0 && step === 0) {
        getFacilityId(newVal);
      }
      if (stepForTabSecond === 0) {
        setActiveTab(1);
        setShow(false);
      }
    } else {
      setShow(false);
    }
    setStep(0);
    setStepForTabSecond(0);
  };

  const handleTabChange = (item) => {
    if (stepForTabSecond === 1) {
      setShow(true);
      setStepForTabSecond(0);
    } else {
      setShow(false);
      setActiveTab(item);
    }
  };
  const getCallbackSetPopUp = (val) => {
    setShow(val);
    setStepForTabSecond(0);
    setStep(0);
  };
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Row
          style={{
            background: "#EDE9F1",
            marginTop: "-25px",
            marginLeft: 0,
            marginRight: "-25px",
          }}
        >
          {show ? (
            <DirtyWarningAlertWithoutFormik
              isBlocking={show}
              callBackResult={newCallback}
              sourceName="Facility Service Details"
              messageBody={
                "Are you sure you want to exit and discard these changes?"
              }
            />
          ) : null}
          <Col md="3" style={{ paddingLeft: 0 }}>
            <Card
              className="mt-4 mb-2 sideCard"
              style={{ borderTop: "3px solid #896cc4 " }}
            >
              <CardBody style={{ padding: "0px" }}>
                <div
                  className="headforheadoffice mt-2 p-2 fw-bold "
                  style={{ marginLeft: "10px", fontSize: "18px" }}
                >
                  {"Facilities"}
                </div>
                {allFacilities.map((item) => (
                  <ListGroup>
                    <ListGroupItem
                      style={{
                        border: "none",
                        backgroundColor:
                          item.facility_id === facilityId ? "#dfd4ec" : "",
                        borderRadius: "0rem",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight:
                          item.facility_id === facilityId ? "700" : "",
                      }}
                      tag="a"
                      action
                      onClick={() => getFacilityId(item)}
                    >
                      {item.facility_name}
                    </ListGroupItem>
                  </ListGroup>
                ))}
              </CardBody>
            </Card>
          </Col>
          <Col md="9" style={{ padding: 0 }}>
            <Card
              className="mt-4"
              style={{
                borderTop: "3px solid #896cc4 ",
                marginTop: "10px",
                maxWidth: "100%",
              }}
            >
              <CardBody>
                <div
                  className="fw-bold"
                  style={{ fontSize: "18px", padding: "5px" }}
                >
                  {facilityName}
                </div>
                <Tabs
                  selectedIndex={ActiveTab}
                  onSelect={(index) => {
                    handleTabChange(index);
                  }}
                >
                  <TabList
                    style={{
                      borderBottomColor: "rgb(89, 62, 142)",
                      borderBottomWidth: 3,
                      paddingBottom: "0px",
                      display: "flex",
                      marginLeft: "-16px",
                    }}
                  >
                    <Tab
                      className={"selectedTabClass"}
                      style={{
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                        fontWeight: "bold",
                        backgroundColor:
                          ActiveTab === 0 ? "rgb(89, 62, 142)" : "#f2f2f2",
                        color: ActiveTab === 0 ? "white" : "black",
                        width: "12%",
                        cursor: "pointer",
                      }}
                    >
                      {"Facility Details"}
                    </Tab>
                    <Tab
                      className={"selectedTabClass"}
                      style={{
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                        fontWeight: "bold",
                        backgroundColor:
                          ActiveTab === 1 ? "rgb(89, 62, 142)" : "#f2f2f2",
                        color: ActiveTab === 1 ? "white" : "black",
                        width: "12%",
                        cursor: "pointer",
                      }}
                    >
                      {"Documents & Logo"}
                    </Tab>
                  </TabList>

                  <TabPanel>
                    <ViewFacilityDetails
                      StateSubrbCountry={{
                        stateList: stateList,
                        countryList: countryList,
                        suburbList: suburbList,
                      }}
                      facilityId={facilityId}
                      getCallbackForFacilityName={getCallbackForFacilityName}
                      getAllCallback={getAllCallback}
                      getCallbackSetPopUp={getCallbackSetPopUp}
                    ></ViewFacilityDetails>
                  </TabPanel>
                  <TabPanel>
                    <ViewListDocumentLogo
                      facilityId={facilityId}
                    ></ViewListDocumentLogo>
                  </TabPanel>
                </Tabs>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ViewFacilitiesList;
