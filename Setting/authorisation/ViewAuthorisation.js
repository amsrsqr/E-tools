import React, { useState, useEffect } from "react";
import Loader from "../../../components/Loader";
import Icon from "../../../assets/Images/icon.png";
import Page from "../../../components/Page";
import Select from "react-select";
import {
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Label,
  Input,
  Col,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import ReactTable from "../../../components/ReactTable";
import {
  ACTION,
  ADD,
  AUTHORIZENAME,
  AUTHORIZEEMAIL,
  AUTHORIZATION,
  DELETE,
  EDIT,
  TYPE,
  USER,
} from "../../../constant/FieldConstant";
import {
  ADDAUTHORIZATION,
  UPDATEAUTHORIZATION,
} from "../../../constant/MessageConstant";
import authorisationServices from "../../../services/Setting/authorisation.services";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import SuccessAlert from "../../../components/SuccessAlert";
import AddEditAuthorisation from "./AddEditAuthorisation";
import { Dropdown, ButtonGroup } from "react-bootstrap";

const ViewAuthorisation = () => {
  const [authorisationList, setAuthorisationList] = useState([]);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [actionType, setActionType] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [loading, setLoading] = useState(false);

  const options = [
    { value: "Active", label: "Active" },
    { value: "Archived", label: "Archived" },
    { value: "All", label: "All" },
  ];

  useEffect(() => {
    getAllAuthorisations();
  }, []);

  const handleAddShowForm = () => {
    setShowAddEditForm(true);
    setSelectedRowData({});
    setActionType(ADD);
  };

  const handleEditShowForm = (item) => {
    setShowAddEditForm(true);
    setSelectedRowData(item);
    setActionType(EDIT);
  };
  const getAllAuthorisations = () => {
    setLoading(true);
    authorisationServices
      .getAllAuthorisation()
      .then((response) => {
        setLoading(false);
        const resultnew = Array.from(response).filter(
          (m) =>
            m.isinactive ===
            (selectedStatus.toString() === "Active" ? true : false)
        );
        setAuthorisationList(resultnew);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAllAuthorisationsWithFilter = (selectedStatus) => {
    setLoading(true);
    authorisationServices
      .getAllAuthorisation()
      .then((response) => {
        setLoading(false);
        console.log("selectedStatus.toString()", selectedStatus.toString());
        if (selectedStatus.toString() === "All") {
          setAuthorisationList(response);
        } else {
          const resultnew = Array.from(response).filter(
            (m) =>
              m.isinactive ===
              (selectedStatus.toString() === "Active" ? true : false)
          );
          setAuthorisationList(resultnew);
        }
      })
      .catch(() => {
        setLoading(false);
      });
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
          ? ADDAUTHORIZATION
          : UPDATEAUTHORIZATION,
        callback: () => {
          setShowSuccessAlert(false);
          getAllAuthorisations();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      authorisationServices.deleteAuthorisation(selectedRowData.id).then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: response.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              getAllAuthorisations();
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

  const handleOnDelete = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: AUTHORIZATION,
      message: AUTHORIZATION,
    });
    setSelectedRowData(item);
  };

  // function linkFormatter(cell, row, rowIndex, formatExtraData) {
  //   return (
  //     <UncontrolledButtonDropdown className="dropdownbtn">
  //       <DropdownToggle className="dropdown-toggle" color="light">
  //         <span className="tabledropdownaction"> {ACTION} </span>
  //         <span className="tabledropdownline"> </span>
  //       </DropdownToggle>
  //       <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
  //         <DropdownItem
  //           id="dropdownBorder"
  //           onClick={() => handleEditShowForm(cell)}
  //         >
  //           <img src={Icon} className="icon" alt="image" />
  //           {EDIT}
  //         </DropdownItem>
  //         <DropdownItem onClick={() => handleOnDelete(cell)}>
  //           <img src={Icon} className="icon" alt="image" />
  //           {DELETE}
  //         </DropdownItem>
  //       </DropdownMenu>
  //     </UncontrolledButtonDropdown>
  //   );
  // }

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
          <Dropdown.Item onClick={() => handleOnDelete(cell)}>
            <img src={Icon} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function getFileStatus(cell) {
    return (
      <Button
        style={{ pointerEvents: "none" }}
        className={
          cell.isinactive == true
            ? "text-white form-control activebtn btn btn-success btn-sm"
            : "text-white form-control archievedbtn btn btn-warning btn-sm"
        }
      >
        {cell.isinactive ? "Active" : "Archived"}
      </Button>
    );
  }

  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "5.67%",
      },
      {
        Header: AUTHORIZENAME,
        accessor: "name",
        width: "36%",
      },
      {
        Header: "Status",
        Filter: false,
        disableSortBy: true,
        accessor: getFileStatus,
        width: "9%",
      },
      {
        Header: AUTHORIZEEMAIL,
        accessor: "email",
        width: "42%",
      },
    ],
    []
  );

  const authorisationperson = React.useMemo(() => authorisationList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title={AUTHORIZATION}>
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {AUTHORIZATION}
          </div>
          <hr className="headerBorder" />
          {/* <Card className="col-md-7">
            <CardTitle className="p-2">
              <h6>
                <b> Bond Notification Settings</b>
              </h6>
            </CardTitle>
            <CardBody>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" /> Send an email notification when a
                  bond deduction is updated
                </Label>
              </FormGroup>
              <FormGroup row>
                <Label for="exampleEmail" className="text-end" sm={5} disabled>
                  Outgoing Email Server (SMTP)
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    className="text form-group"
                    name="email"
                    id="exampleEmail"
                    placeholder="with a placeholder"
                    disabled
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="exampleEmail" sm={5} className="text-end" disabled>
                  From Address
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    className="text form-group"
                    name="email"
                    id="exampleEmail"
                    placeholder="with a placeholder"
                    disabled
                  />
                </Col>
              </FormGroup>
            </CardBody>
          </Card>
          <br /> */}
          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.actionType}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}
          <AddEditAuthorisation
            type={actionType}
            data={selectedRowData}
            showModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
          />
          <DeleteConfirmationModelAlert
            ShowDeleteModal={showDeleteConfirmationModal}
            Data={deleteConfirmationModalData}
            deleteConfirmationCallBack={deleteConfirmationCallBack}
            title={DELETE + " " + AUTHORIZATION}
          ></DeleteConfirmationModelAlert>

          <div
            className="text"
            style={{ position: "absolute", left: "230px", marginTop: "17px" }}
          >
            Showing:
          </div>
          <div
            style={{ position: "absolute", left: "300px", marginTop: "8px" }}
          >
            <Select
              name="select"
              id="exampleSelect"
              onChange={(state) => {
                setSelectedStatus(state.value);
                getAllAuthorisationsWithFilter(state.value);
              }}
              options={options}
              defaultValue={{ value: selectedStatus, label: selectedStatus }}
              isSearchable={options.length < 5 ? false : true}
            ></Select>
          </div>
          <div>
            <Button
              className="addbtn btnfix btn btn-primary m-2 btnright justify-content-end"
              onClick={handleAddShowForm}
            >
              + {ADD} {USER}
            </Button>
          </div>
          <ReactTable columns={columns} data={authorisationperson} />
        </Page>
      )}
    </>
  );
};

export default ViewAuthorisation;
