import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Button,
  Card,
  CardBody,
  Row,
  FormGroup,
  Label,
  Col,
  Input,
  CardTitle,
  InputGroup,
  Form,
} from "reactstrap";
import {
  ACTION,
  ACTIVE,
  TBR,
  ADD,
  ADDMISSIONDATE,
  ALL,
  ALLFACILTYRESGISTER,
  ARCHIVED,
  CONFIRMED,
  DELETE,
  DOB,
  EDIT,
  FACILTYNAME,
  FIRSTNAME,
  IMPORTCSV,
  LASTNAME,
  LUMPSUMEQUIVALENT,
  NOTCONFIRMED,
  PAYMENTDECISION,
  PLUSSIGN,
  REGISTERRESIDENTID,
  RESIDENT,
  STATUS,
  TYPE,
} from "../../../constant/FieldConstant";
import Icon from "../../../../src/assets/Images/icon.png";
import Loader from "../../../components/Loader";
import Page from "../../../components/Page";
import registerResident from "../../../services/Master/registerResident.service";
import residentFilters from "../../../services/Resident/resident.service";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import SuccessAlert from "../../../components/SuccessAlert";
import { Formik } from "formik";
import commonServices from "../../../services/Common/common.services";
import { MultiSelect } from "react-multi-select-component";
import ReactFilterTable from "../../../components/ReactFilterTable";
import { Link } from "react-router-dom";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import MuiDatePicker from "../../../components/DatePicker/MaterialUi";
import AmountFormat from "../../../utils/AmountFormat";
import ViewImportCSV from "../../Register/ImportCSV/ViewImportCSV";
import SingleSelect from "../../../components/MySelect/MySelect";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";

const customStyles = {
  control: (base) => ({
    ...base,
    height: 41,
    // minHeight: 35
  }),
};
const ViewResident = () => {
  const [loading, setLoading] = useState(false);
  const [viewResidentList, setviewResidentList] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const refCalendar = useRef();
  const [selectedFacility, setSelectedFacility] = useState([]);
  const [facilityList, setFacilityList] = useState(false);
  const [paymentTypeList, setPaymentTypeList] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState([]);
  const [selectedPaymentDecision, setSelectedPaymentDecision] = useState(ALL);
  const [showArchivedFacilities, setShowArchivedFacilities] = useState(false);
  const [showAddEditForm, setShowAddEditForm] = useState(false);

  const [SearchFieldsValues, setSearchFieldsValues] = useState({});

  const navigate = useNavigate();
  const PaymentDecisionList = [
    { value: ALL, label: ALL },
    { value: NOTCONFIRMED, label: NOTCONFIRMED },
    { value: CONFIRMED, label: CONFIRMED },
  ];

  // Page Numbers states
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalEntries, settotalEntries] = useState(0);
  const [totalPages, settotalPages] = useState(0);
  const [admissionDate, setAdmissionDate] = useState(null);

  useEffect(() => {
    // getTitles();
    // getStates();
    // getCountries();
    // getSuburbList();
       getFacilities();
    getPaymentTypeList();
  }, []);

  useEffect(() => {
    if (Object.values(SearchFieldsValues).some((v) => v)) {
      searchFieldsCallback(
        { ...SearchFieldsValues, pageNumber: pageNumber, pageLimit: pageLimit },
        "",
        true
      );
    } else {
      getAllResidentFilter();
    }
  }, [pageNumber, pageLimit]);

  useEffect(() => {
    if (showArchivedFacilities) getFacilities();
  }, [showArchivedFacilities]);

  const getAllResidentFilter = (
    pageNum,
    _pageLimit,
    selectedFacilities,
    _admissionDate,
    selectedPaymentTypes,
    _selectedPaymentDecision
  ) => {
    const adDate = _admissionDate
      ? _admissionDate
      : admissionDate
      ? moment(admissionDate).format("MM/DD/YYYY")
      : "";
    console.log("adDate at filter", adDate);
    if (adDate && `${adDate}` === "Invalid date") {
      // setAdmissiondateError(true);
    } else {
      setLoading(true);
      registerResident
        .getResidentById(
          pageNum ? pageNum : pageNumber,
          _pageLimit ? _pageLimit : pageLimit,
          selectedFacilities
            ? selectedFacilities
            : selectedFacility.map((val) => val.value).join(","),
          _admissionDate === "reset" ? "" : adDate,
          selectedPaymentTypes
            ? selectedPaymentTypes
            : selectedPaymentType.map((val) => val.value).join(","),
          _selectedPaymentDecision
            ? _selectedPaymentDecision
            : selectedPaymentDecision
        )
        .then((response) => {
          //console.log("response of resident", response);
          const resultnew = response.result.residentFilterResponseModel.filter(
            (m) => m.status_name !== "Archived" && new Date(m.dob)
          );

          console.log("resident list response", resultnew);
          setviewResidentList(resultnew);
          settotalEntries(response.result.totalCount);
          settotalPages(response.result.totalPages);
          setTimeout(() => setLoading(false), 1000);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const searchFieldsCallback = (data, noSearch, calledFromPageChange) => {
    if (noSearch) {
      getAllResidentFilter();
    } else {
      if (calledFromPageChange) {
      } else {
        setSearchFieldsValues(data);
        setPageNumber(1);
      }
      residentFilters
        .residentfilter({
          ...data,
          admissionDate: admissionDate,
          type: selectedPaymentType.map(({ value }) => value),
          facilityId: selectedFacility.map(({ value }) => value),
          paymentDecision: selectedPaymentDecision,
        })
        .then((res) => {
          const resultnew = res.result.residentFilterResponseModel.filter(
            (m) => m.status_name !== "Archived" && new Date(m.dob)
          );
          console.log("resultnew", resultnew);
          setviewResidentList(resultnew);
          settotalEntries(res.result.totalCount);
          settotalPages(res.result.totalPages);
        });
    }
  };

  const handleEditShowForm = (item) => {
    //console.log("handleEditShowForm clicked", item);
    localStorage.setItem("residentId", item.id);
    localStorage.setItem("residentActionType", "Edit");
    localStorage.removeItem("FundHeldByGovCpy");
    localStorage.removeItem("FundHeldByGov");
    localStorage.setItem("isSaved", false);
    // localStorage.removeItem("ckEditorData");
    navigate(`/eRADWeb/addResident?id=${item.id}`);
  };

  const pageSizeChangeCallBack = (childdata, success) => {
    if (success) {
      setPageLimit(childdata);
      setPageNumber(1);
    }
  };
  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      registerResident.deleteResident(selectedRowData.id).then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: response.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              if (Object.values(SearchFieldsValues).some((v) => v)) {
                searchFieldsCallback(
                  {
                    ...SearchFieldsValues,
                    pageNumber: pageNumber,
                    pageLimit: pageLimit,
                  },
                  "",
                  true
                );
              } else {
                getAllResidentFilter();
              }
              // getAllResidentFilter();
            },
          });
          setShowSuccessAlert(true);
        },
        () => {
          setLoading(false);
        }
      );
    }
  };
  const onDelete = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: RESIDENT,
      message: RESIDENT,
    });
    setSelectedRowData(item);
  };

  const getResidentStatus = (cell) => {
    // console.log("cell status_name",cell.status_name)
    return (
      <Button
        style={{ pointerEvents: "none", border: "none" }}
        className={
          cell.status_name == ACTIVE
            ? "form-control btn-active btn-sm"
            : cell.status_name == TBR
            ? "form-control btn-TBR btn-sm"
            : cell.status_name == ARCHIVED
            ? "text-white form-control activebtn btn btn-archived btn-sm btn "
            : "form-control addbtn btn btn-refunded btn-sm "
        }
      >
        {cell.status_name}
      </Button>
    );
  };

  const getPaymentTypeList = () => {
    commonServices.getTypeList().then((response) => {
      let _arr = response.result.map((x) => {
        return {
          label: x.name,
          value: x.id,
        };
      });

      setPaymentTypeList(_arr);
    });
  };

  const getFacilities = () => {
    // setLoading(true);
    commonServices
      .getAllFacilitiesStatusWise(!showArchivedFacilities)
      .then((response) => {
        // setLoading(false);
        let _arr = response.result.map((x) => {
          return {
            label: x.facility_name,
            value: x.id,
          };
        });
        setFacilityList(_arr);

        setSelectedFacility(_arr);
      });
  };

  const getPaymentMethods = (participantId) => {
    commonServices.getPaymentMethod(participantId).then((response) => {
      if (response.length) {
        response.forEach((x) => {
          x.label = x.name;
        });
        //setSelectedRecovery(response[0]);
      }
      // setRecoveryList(response);
      // setDataPayment("paymentArray", response);
    });
  };

  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Dropdown as={ButtonGroup} className="btn-group w-100">
        <Button className="dropdownAction">{ACTION}</Button>
        <Dropdown.Toggle split variant="" id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item
            id="dropdownBorder"
            onClick={() => handleEditShowForm(cell)}
          >
            <img src={Icon} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onDelete(cell)}>
            <img src={Icon} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  const getFee = (cell) => {
    const newFormat = AmountFormat(cell.lumpSumEquivalent);
    return newFormat;
  };
  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "6%",
      },
      {
        Header: FIRSTNAME,
        accessor: (d) => d.resident_first_name,
        icon: `<BsSortUpAlt/>`,
        width: "10%",
      },
      {
        Header: LASTNAME,
        accessor: (d) => d.resident_last_name,
        width: "10%",
      },
      {
        Header: STATUS,
        Filter: false,
        disableSortBy: true,
        accessor: getResidentStatus,
        width: "8%",
      },
      {
        Header: DOB,
        sortType: "datetime",
        Filter: false,
        // accessor: (d) => d.dob,
        width: "7%",
        accessor: (d) =>
          new Date(moment(d.dob, "DD/MM/YYYY").format("MM/DD/YYYY")),
        Cell: ({ cell: { value } }) => (
          <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
        ),
      },
      {
        Header: REGISTERRESIDENTID,
        accessor: (d) => d.resident_id,
        width: "7%",
      },
      {
        Header: ADDMISSIONDATE,
        // accessor: (d) => d.admissionDate,
        Filter: false,
        width: "8%",
        accessor: (d) =>
          new Date(moment(d.admissionDate, "DD/MM/YYYY").format("MM/DD/YYYY")),
        Cell: ({ cell: { value } }) =>
          moment(value, "MM/DD/YYYY").format("DD/MM/YYYY"),
      },
      {
        Header: TYPE,
        accessor: (d) => d.type,
        width: "9%",
      },
      {
        Header: PAYMENTDECISION,
        accessor: (d) => d.paymentDecision,
        width: "9%",
      },
      {
        Header: LUMPSUMEQUIVALENT,
        // Filter: false,
        accessor: (d) => d.lumpSumEquivalent,
        disableSortBy: true,
        // accessor: getFee,
        Cell: ({ cell: { value } }) => AmountFormat(value),
        width: "10%",
      },
      {
        Header: FACILTYNAME,
        accessor: (d) => d.facility_name,
        width: "14%",
      },
    ],
    []
  );

  // Handle page change function
  const handlePageChange = (isNext) => {
    if (isNext) {
      if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
    } else {
      if (pageNumber > 1) setPageNumber(pageNumber - 1);
    }
  };

  const handleFacilityReset = () => {
    setSelectedFacility(facilityList);
    setPageNumber(1);
    setPageLimit(10);
    getAllResidentFilter(
      1,
      10,
      facilityList.map((val) => val.value).join(","),
      null,
      [],
      ""
    );
  };

  const handleFiltersReset = () => {
    setAdmissionDate(
      admissionDate && `${admissionDate}` === "Invalid Date" ? 0 : null
    );
    setSelectedPaymentType([]);
    setSelectedPaymentDecision(ALL);
    setPageNumber(1);
    setPageLimit(10);
    getAllResidentFilter(
      1,
      10,
      // facilityList.map((val) => val.value).join(","),
      [],
      "reset",
      [],
      ""
    );
    // }
  };

  const handleChangeDate = (date) => {
    setAdmissionDate(date);
  };

  const handleAddNewResident = () => {
    localStorage.removeItem("residentId");
    localStorage.setItem("residentActionType", "Add");
    localStorage.removeItem("FundHeldByGovCpy");
    localStorage.removeItem("FundHeldByGov");
    // localStorage.removeItem("ckEditorData1");
    localStorage.setItem("isSaved", false);
  };

  const openImportCSV = () => {
    setShowAddEditForm(true);
    setSelectedRowData({});
    //setActionType(ADD);
  };

  const callBackForClose = (isFormVisible, success, msg = null) => {
    setShowAddEditForm(isFormVisible);
  };

  const callbackImport = (isFormVisible, success, msg = null) => {
    debugger;
    if (success) {
      setShowAddEditForm(isFormVisible);
      setSuccessAlertOptions({
        title: "",
        actionType: ADD,
        msg: msg,
        callback: (value) => {
          setShowSuccessAlert(false);
          if (Object.values(SearchFieldsValues).some((v) => v)) {
            searchFieldsCallback(
              {
                ...SearchFieldsValues,
                pageNumber: pageNumber,
                pageLimit: pageLimit,
              },
              "",
              true
            );
          } else {
            getAllResidentFilter();
          }
          // getAllResidentFilter();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  //const viewDataList = React.useMemo(() => viewResidentList);
  const viewDataList = React.useMemo(() => viewResidentList, [
    viewResidentList,
  ]);
  return (
    <Formik
    // validate={validateForm}
    >
      {({ handleSubmit, handleReset, isSubmitting }) => (
        <>
          <Form onSubmit={handleSubmit}>
            <Card className="mt-2" style={{ border: "none" }}>
              <CardBody>
                <div className="row">
                  <div
                    className="col col-sm-3"
                    style={{
                      borderRight: "1px solid",
                      borderRightColor: "lightgray",
                    }}
                  >
                    <CardTitle>
                      <div className="head">Facility Filter</div>
                    </CardTitle>
                    <hr />
                    <Row style={{ marginTop: "45px" }}>
                      <FormGroup row>
                        <Label style={{ textAlign: "right" }} column sm={4}>
                          {"Select Facility"}
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
                    <Label htmlFor="facilityID" column sm={4}></Label>
                    <Input
                      type="checkbox"
                      name="archieved"
                      onChange={(e) => {
                        setShowArchivedFacilities(e.target.checked);
                      }}
                    />{" "}
                    <Label className="col-sm-7" check>
                      Show Archived Facility
                    </Label>
                    <br />
                    <div style={{ float: "right" }}>
                      <Button
                        type="reset"
                        className="clsbtn btn btn-secondary m-2"
                        size="md"
                        onClick={() => {
                          handleFacilityReset();
                          handleReset();
                        }}
                      >
                        {"Reset"}
                      </Button>
                      <Button
                        // type="submit"
                        onClick={() => {
                          setPageNumber(1);
                          getAllResidentFilter();
                        }}
                        disabled={isSubmitting}
                        size="md"
                        className="modalsave btn btn-primary mr-2"
                      >
                        Filter
                      </Button>
                    </div>
                  </div>
                  <div className="col col-9">
                    <CardTitle>
                      <div className="head">Resident Filter</div>
                    </CardTitle>
                    <hr />
                    <div className="row">
                      <div className="col col-4">
                        <Row className={"fieldstyle"}>
                          <FormGroup row>
                            <Label
                              column
                              className={
                                `${admissionDate}` === "Invalid Date"
                                  ? "is-invalid-label"
                                  : ""
                              }
                            >
                              {"Admission Date"}
                            </Label>
                            <Col>
                              <FormGroup>
                                <InputGroup>
                                  <MuiDatePicker
                                    ref={refCalendar}
                                    id="date"
                                    name="date"
                                    placeholder="DD/MM/YYYY"
                                    error={
                                      `${admissionDate}` === "Invalid Date"
                                        ? true
                                        : false
                                    }
                                    className="form-control"
                                    selectedDate={admissionDate}
                                    getChangedDate={handleChangeDate}
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
                            {`${admissionDate}` === "Invalid Date" ? (
                              <InlineBottomErrorMessage msg={"Invalid Date"} />
                            ) : null}
                          </FormGroup>
                        </Row>
                      </div>

                      <div className="col col-4">
                        <Row>
                          <FormGroup row className="col-sm-12">
                            <Label htmlFor="type" column>
                              {"Type"}
                            </Label>
                            <Col>
                              {/* <Select
                              placeholder="Select...."
                              options={paymentTypeList}
                              onChange={(state)=>{  
                                setSelectedPaymentType(state);
                              }} 
                              value={{ value: selectedPaymentType.value, label: selectedPaymentType.label }}
                            /> */}
                              <MultiSelect
                                options={paymentTypeList}
                                value={selectedPaymentType}
                                onChange={setSelectedPaymentType}
                                labelledBy="Select"
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                      </div>
                      <div className="col col-4">
                        <Row>
                          <FormGroup row className="col-sm-12">
                            <Label htmlFor="paymentDecision" column>
                              {"Payment Decision"}
                            </Label>
                            <Col>
                              <SingleSelect
                                // <Select
                                placeholder="Select...."
                                options={PaymentDecisionList}
                                styles={customStyles}
                                onChange={(state) => {
                                  setSelectedPaymentDecision(state.value);
                                }}
                                value={{
                                  value: selectedPaymentDecision,
                                  label: selectedPaymentDecision,
                                }}
                              />
                            </Col>
                          </FormGroup>
                        </Row>
                        {/* <Row>
                         
                            <Col>
                            <GlobalFilter />
                            </Col>
                         </Row> */}

                        {/* <Row>

                        <FormGroup row className="col-sm-12 mt-5">
                          <Label
                            htmlFor="facilityID"
                            column
                            className="mt-3"
                          >
                            {"Sort By"}
                          </Label>
                          <Col>
                          <Select
                placeholder="Select Option"
                options={SortByList}
                onChange={(state)=>{  
                  setSelectedSortBy(state.value);
                }} 
                value={{ value: selectedSortBy, label: selectedSortBy }}
                
              />
                          </Col>
                        </FormGroup>
            </Row> */}

                        <div style={{ float: "right", marginTop: "31.5px" }}>
                          <Button
                            type="reset"
                            className="clsbtn btn btn-secondary m-2"
                            size="md"
                            onClick={() => {
                              handleFiltersReset();
                              handleReset();
                            }}
                          >
                            {"Reset"}
                          </Button>
                          <Button
                            // type="submit"
                            onClick={() => {
                              setPageNumber(1);
                              getAllResidentFilter();
                              //console.log("OnCLick getAllResidentFilter");
                              //getAllResidentFilter(1, 10, [], startDate, '', '');
                            }}
                            disabled={isSubmitting}
                            size="md"
                            className="modalsave btn btn-primary mr-2"
                          >
                            Filter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Form>
          <div className="divderline" />
          <Page title={ALLFACILTYRESGISTER}>
            <div className="head mt-3">
              {selectedFacility.length == 0 ||
              facilityList.length === selectedFacility.length
                ? ALLFACILTYRESGISTER
                : selectedFacility.length == 1
                ? `${selectedFacility[0].label} Register`
                : "Register"}
            </div>

            <hr />
            {loading ? <Loader></Loader> : null}
            {/* <div
            className="row"
            style={{ position: "relative", left: "200px", top: "52px" }}
          >
            <div className="col-sm-1">
              <div className="p-2">{SHOWING}{COLONSIGN}</div>
            </div>
            <div className="col-sm-2">
              <Select
                placeholder="Select Option"
                options={statusList}
                onChange={(state)=>{  
                  setSelectedStatus(state.value);
                  getAllResidentFilter(state.value);
                }} 
                defaultValue={{ value: selectedStatus, label: selectedStatus }}
                className="w-75"
              />
            </div>
          </div> */}
            {showAddEditForm && (
              <ViewImportCSV
                // lastCommencementDate={lastCommencementDate}
                // type={actionType}
                // Data={selectedRowData}
                showModel={showAddEditForm}
                callBackForClose={callBackForClose}
                setShowAddEditForm={setShowAddEditForm}
                // supplierId={createdSupplierId}
                callbackImport={callbackImport}
              />
            )}

            {showSuccessAlert && (
              <SuccessAlert
                type={successAlertOptions.actionType}
                msg={successAlertOptions.msg}
                title={successAlertOptions.title}
                callback={successAlertOptions.callback}
              ></SuccessAlert>
            )}
            <DeleteConfirmationModelAlert
              ShowDeleteModal={showDeleteConfirmationModal}
              Data={deleteConfirmationModalData}
              deleteConfirmationCallBack={deleteConfirmationCallBack}
              title={DELETE + " " + RESIDENT}
            ></DeleteConfirmationModelAlert>
            <Link to="/eRADWeb/addResident">
              <Button
                className="addbtn btnfix btn btn-primary m-2 mt-2 btnright"
                onClick={handleAddNewResident}
              >
                {PLUSSIGN} {ADD} {RESIDENT}
              </Button>
            </Link>

            <Button
              variant="light"
              className="addbtn btnfix btn btn-primary btnright mt-2"
              style={{ marginRight: "130px" }}
              onClick={openImportCSV}
            >
              {IMPORTCSV}
            </Button>

            <ReactFilterTable
              columns={columns}
              data={viewDataList}
              handlePageChange={handlePageChange}
              pageNumber={pageNumber}
              pageLimit={pageLimit}
              totalPages={totalPages}
              totalEntries={totalEntries}
              searchFieldsCallback={searchFieldsCallback}
              setPageLimit={setPageLimit}
              pageSizeChangeCallBack={pageSizeChangeCallBack}
            />
          </Page>
        </>
      )}
    </Formik>
  );
};
export default ViewResident;
