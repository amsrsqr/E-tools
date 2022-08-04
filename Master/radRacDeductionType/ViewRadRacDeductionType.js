import React, { useState, useEffect } from "react";

import {
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
} from "reactstrap";
import Page from "../../../components/Page";
import Icon from "../../../../src/assets/Images/icon.png";
import ReactTable from "../../../components/ReactTable";
import SuccessAlert from "../../../components/SuccessAlert";

import {
  NAME,
  ACTION,
  NEWTYPE,
  PERMENANT,
  BONDPERMENANT,
  EDIT,
  DELETE,
  DESCRIPTION,
  RADRACDEDUCTIONTYPE,
  ADD,
} from "../../../constant/FieldConstant";
import Logo from "../../../assets/Images/icon.png";
import Loader from "../../../components/Loader";
import AddEditRadRacDeductionType from "./AddEditRadRacDeductionType";
import BondTypeServices from "../../../services/Master/bondAndRadRacType.service";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import {
  ADDRADRACdEDUCTION,
  BONDPERMENANTTYPE,
  UPDATERADRACDEDUCTIONTYPE,
} from "../../../constant/MessageConstant";
import WarningMessageModelAlert from "../../../components/WarningMessageModelAlert";
import { TYPE, PLUSSIGN } from "./../../../constant/FieldConstant";
import { Dropdown } from "react-bootstrap";

const ViewRadRacDeductionType = () => {
  const [radRacDeductionType, setRadRacDeductionType] = useState([]);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [actionType, setActionType] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [itemForDelete, setItemForDelete] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [warningAlertOptions, setWarningAlertOptions] = useState({});

  const handleShow = () => {
    setShowAddEditForm(true);
    setSelectedRowData({});
    setActionType(ADD);
  };

  const editShow = (item) => {
    setShowAddEditForm(true);
    setSelectedRowData(item);
    setActionType(EDIT);
  };

  const getRadRacDeductionType = () => {
    setLoading(true);
    BondTypeServices.getAllRadRacDeductionType()
      .then((response) => {
        response.forEach((obj) => {
          obj.permanent = obj.permanent === true ? BONDPERMENANT : "";
        });
        setLoading(false);

        setRadRacDeductionType(response);
      })
      .catch(() => {});
  };

  const ParentCallBackToView = (childdata, success, msg = null) => {
    setShowAddEditForm(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: msg
          ? msg
          : actionType === EDIT
          ? ADDRADRACdEDUCTION
          : UPDATERADRACDEDUCTIONTYPE,
        callback: () => {
          getRadRacDeductionType();
          setShowSuccessAlert(false);
        },
      });
      setShowSuccessAlert(true);
    }
  };

  useEffect(() => {
    getRadRacDeductionType();
  }, []);

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      if (itemForDelete.permanent === "Permanent") {
        setWarningAlertOptions({
          msg: BONDPERMENANTTYPE,
          callback: (value) => {
            setShowWarningAlert(false);
          },
        });
        setShowWarningAlert(true);
        return;
      }
      setLoading(true);
      BondTypeServices.deleteRadRacDeductionType(itemForDelete.id).then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: response.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              getRadRacDeductionType();
            },
          });
          setShowSuccessAlert(true);
        },
        (error) => {
          setLoading(false);
        }
      );
    }
  };

  const onDelete = (item) => {
    setShowDeleteConfirmationModal(true);
    let obj = {
      ...item,
      header: RADRACDEDUCTIONTYPE,
      message: RADRACDEDUCTIONTYPE,
    };
    setDeleteConfirmationModalData(obj);
    setItemForDelete(item);
  };

  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Dropdown as={ButtonGroup} className="btn-group w-100">
        <Button className="dropdownAction">{ACTION}</Button>
        <Dropdown.Toggle split variant="" id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item id="dropdownBorder" onClick={() => editShow(cell)}>
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
  const columns = React.useMemo(() => [
    {
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "8.20%",
    },
    {
      Header: DESCRIPTION,
      accessor: (d) => d.name,
      width: "43%",
    },

    {
      Header: BONDPERMENANT,
      // Filter: false,
      disableSortBy: true,
      accessor: (d) => d.permanent,
      width: "50%",
    },
  ]);
  const radRacDeductiontypelist = React.useMemo(() => radRacDeductionType);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="Rad/Rac DeductionType">
          <div class="head mt-3">
            <img src={Icon} className="icon" />
            {RADRACDEDUCTIONTYPE}
          </div>
          <hr className="headerBorder" />

          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.actionType}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}

          <AddEditRadRacDeductionType
            type={actionType}
            Data={selectedRowData}
            ShowModel={showAddEditForm}
            ParentCallBackToView={ParentCallBackToView}
          />
          <DeleteConfirmationModelAlert
            ShowDeleteModal={showDeleteConfirmationModal}
            Data={deleteConfirmationModalData}
            deleteConfirmationCallBack={deleteConfirmationCallBack}
          ></DeleteConfirmationModelAlert>
          {showWarningAlert && (
            <WarningMessageModelAlert
              msg={warningAlertOptions.msg}
              showWarningAlert={showWarningAlert}
              setShowWarningAlert={setShowWarningAlert}
            />
          )}
          <Button
            className="addbtn btnfix btn btn-primary m-2 btnright justify-content-end"
            onClick={handleShow}
          >
            {PLUSSIGN} {ADD} {TYPE}
          </Button>
          <ReactTable columns={columns} data={radRacDeductiontypelist} />
        </Page>
      )}
    </>
  );
};

export default ViewRadRacDeductionType;
