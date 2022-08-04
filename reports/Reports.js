import React, { useState } from "react";

import { Row, Col, Card, CardBody } from "reactstrap";
import Icon from "../../assets/Images/icon.png";
import "./Reports.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  FacilityDetailsFilter,
  FacilityDetailsReport,
} from "./overview/FacilityDetails";
import {
  FacilitySummaryFilter,
  FacilitySummaryReport,
} from "./overview/FacilitySummary";

const Reports = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const [reportData, setReportData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(1);
  const [activeTab, setActiveTab] = useState("1");
  const [totalServices, setTotalServices] = useState([]);
  const [totalServicesOnAd, setTotalServicesOnAd] = useState([]);

  const showFilterComponent = () => {
    switch (selectedReport) {
      case 1:
        return <FacilitySummaryFilter setReportData={setReportData} />;
        break;
      case 2:
        return <FacilityDetailsFilter setReportData={setReportData} />;
        break;
      default:
        break;
    }
  };
  const showDataComponent = () => {
    switch (selectedReport) {
      case 1:
        return <FacilitySummaryReport ReportData={reportData} />;
        break;
      case 2:
        return <FacilityDetailsReport ReportData={reportData} />;
        break;
      default:
        break;
    }
  };

  const handleTabClick = (active, selectedReport) => {
    console.log("active selectedReport", active, selectedReport);
    setTotalServicesOnAd([]);
    setTotalServices([]);
    setReportData([]);
    setSelectedReport(selectedReport);
    setActiveTab(`${active}`);
  };

  return (
    <>
      {/* Sehrish */}
      <Navbar
        className="w-100 "
        light
        expand="md"
        style={{ backgroundColor: "#ede9f1 " }}
      >
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav navbar>
            <div>
              <div
                className="d-flex reportNavbarmenu "
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "#eeeeee",
                }}
              >
                <UncontrolledDropdown
                  className={activeTab == "1" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    caret
                    id="pj2r"
                    className={activeTab == "1" ? "text-black" : ""}
                  >
                    <img src={Icon} className="icon" />
                    Overview
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(1, 1);
                      }}
                    >
                      Facility Summary
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(1, 2);
                      }}
                    >
                      Facility Detail
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "2" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    className={activeTab == "2" ? "text-black" : ""}
                    onClick={(e) => {
                      handleTabClick(2, 5);
                    }}
                  >
                    <img src={Icon} className="icon" />
                    Receipts
                  </DropdownToggle>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "3" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    className={activeTab == "3" ? "text-black" : ""}
                    onClick={(e) => {
                      handleTabClick(3, 6);
                    }}
                  >
                    <img src={Icon} className="icon" />
                    Monthly Summary
                  </DropdownToggle>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "4" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    caret
                    id="pj2r"
                    className={activeTab == "4" ? "text-black" : ""}
                  >
                    <img src={Icon} className="icon" />
                    Combined RADs/RACs/Bonds
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(4, 7);
                      }}
                    >
                      Unpaid RADs/RACs/Bonds & Charges
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(4, 8);
                      }}
                    >
                      RADs/RACs/Bonds Refunded
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(4, 9);
                      }}
                    >
                      RADs/RACs/Bonds to be Refunded
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "5" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    className={activeTab == "5" ? "text-black" : ""}
                    onClick={(e) => {
                      handleTabClick(5, 10);
                    }}
                  >
                    <img src={Icon} className="icon" /> Resident Detail
                    Transaction
                  </DropdownToggle>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "6" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    className={activeTab == "6" ? "text-black" : ""}
                    onClick={(e) => {
                      handleTabClick(6, 11);
                    }}
                  >
                    <img src={Icon} className="icon" />
                    Refund Statement
                  </DropdownToggle>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "7" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    caret
                    id="pj2r"
                    className={activeTab == "7" ? "text-black" : ""}
                  >
                    <img src={Icon} className="icon" />
                    Post 1st July 2014
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(7, 12);
                      }}
                    >
                      Active DAP/DAC Schedule
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(7, 13);
                      }}
                    >
                      DAP/DAC Receipts By Date
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(7, 14);
                      }}
                    >
                      RAD/RAC Other Deductions
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "8" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    caret
                    id="pj2r"
                    className={activeTab == "8" ? "text-black" : ""}
                  >
                    <img src={Icon} className="icon" />
                    Bond Reports (Pre 1st July 2014)
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(8, 15);
                      }}
                    >
                      Bond Retentions
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(8, 16);
                      }}
                    >
                      Bond Interest
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(8, 17);
                      }}
                    >
                      Bond Periodic Payment
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(8, 18);
                      }}
                    >
                      Bond Other Deductions & Charges
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              <div
                className="d-flex "
                style={{
                  justifyContent: "space-between",
                  width: "55%",
                  backgroundColor: "#eeeeee",
                  fontWeight: "600",
                }}
              >
                <UncontrolledDropdown
                  className={activeTab == "9" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    className={activeTab == "9" ? "text-black" : ""}
                    onClick={(e) => {
                      handleTabClick(9, 19);
                    }}
                  >
                    <img src={Icon} className="icon" />
                    Month End Report
                  </DropdownToggle>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "10" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    className={activeTab == "10" ? "text-black" : ""}
                    onClick={(e) => {
                      handleTabClick(10, 20);
                    }}
                  >
                    <img src={Icon} className="icon" />
                    Prudential Journal
                  </DropdownToggle>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "11" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    caret
                    id="pj2r"
                    className={activeTab == "11" ? "text-black" : ""}
                  >
                    <img src={Icon} className="icon" />
                    Department Compliance
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(11, 21);
                      }}
                    >
                      Bond Holdings
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(11, 22);
                      }}
                    >
                      Refunds
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(11, 23);
                      }}
                    >
                      Bond Schedule
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown
                  className={activeTab == "12" ? "dropDownBg" : "noHover"}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    nav
                    caret
                    id="pj2r"
                    className={activeTab == "12" ? "text-black" : ""}
                  >
                    <img src={Icon} className="icon" />
                    Resident Compliance
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(12, 24);
                      }}
                    >
                      BOND/RAD/RAC Summary
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        handleTabClick(12, 25);
                      }}
                    >
                      Resident Letters
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
          </Nav>
        </Collapse>
      </Navbar>

      <div style={{ backgroundColor: "#ede9f1" }}>
        <Row>
          <Col md="3">
            <Card
              className="mt-4 sideCard"
              style={{ height: "100%", borderTop: "3px solid #896cc4" }}
            >
              <CardBody>{showFilterComponent()}</CardBody>
            </Card>
          </Col>
          <Col md="9">
            <Card
              className="mt-4"
              style={{ height: "100%", borderTop: "3px solid #896cc4" }}
            >
              <CardBody>{showDataComponent()}</CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Reports;
