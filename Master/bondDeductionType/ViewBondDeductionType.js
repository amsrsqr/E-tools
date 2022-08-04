import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import Icon from "../../../../src/assets/Images/icon.png";
import Page from "../../../components/Page";

import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";
import ReactTable from "../../../components/ReactTable";

import {
  ACTION,
  ADD,
  BONDDESCRIPTION,
  BONDPAYMENTTYPE,
  BONDPERMENANT,
  BONDDEDUCTIONTYPE,
  DELETE,
  EDIT,
  PERMENANT,
  BONDDEDUCTIONTYPES,
  TYPE,
} from "../../../constant/FieldConstant";
import {
  ADDDEDUCTION,
  BONDPERMENANTTYPE,
  UPDATEDEDUCTION,
  DELETESUCCESSFUL
} from "../../../constant/MessageConstant";

import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import SuccessAlert from "../../../components/SuccessAlert";
import AddEditBondDeductionType from "./AddEditBondDeductionType";
import BondTypeServices from "../../../services/Master/bondAndRadRacType.service";
import ViewRadRacDeductionType from "./../radRacDeductionType/ViewRadRacDeductionType";
import WarningMessageModelAlert from "../../../components/WarningMessageModelAlert";
import { ButtonGroup, Dropdown } from "react-bootstrap";

const ViewBondDeductionType = () => {
  const [loading, setLoading] = useState(false);
  const [deductionTypeList, setDeductionTypeList] = useState([]);
  const [showAddEditForm, setShowAddEditForm] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState({});
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

  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [warningAlertOptions, setWarningAlertOptions] = useState({});
  useEffect(() => {
    getAllDeductionTypes();
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

  const getAllDeductionTypes = () => {
    setLoading(true);
    BondTypeServices.getAllBondDeductionType()
      .then((response) => {
        setLoading(false);
        setDeductionTypeList(response);
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
        msg: msg ? msg : actionType === EDIT ? ADDDEDUCTION : UPDATEDEDUCTION,
        callback: () => {
          setShowSuccessAlert(false);
          getAllDeductionTypes();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      BondTypeServices.deleteBondDeductionType(selectedRowData.id).then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: DELETESUCCESSFUL,
            callback: (value) => {
              setShowSuccessAlert(false);
              getAllDeductionTypes();
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
    header: BONDDEDUCTIONTYPE,
    message: BONDDEDUCTIONTYPE,
  });
  setSelectedRowData(item);
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
        <Dropdown.Item onClick={() => handleOnDelete(cell)}>
          <img src={Icon} className="icon" alt="#" />
          {DELETE}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
const columns = React.useMemo(
  () => [
    {
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "8.20%",
    },
    {
      Header: BONDDESCRIPTION,
      accessor: (d) => d.bondDeductionType,
      width: "43%",
    },
    {
      Header: BONDPAYMENTTYPE,
      accessor: (d) => d.deductionTypeName,
      width: "25%",
    },
    {
      Header: BONDPERMENANT,
      // Filter: false,
      disableSortBy: true,
      accessor: (d) => (d.permanent === false ? "" : BONDPERMENANT),
      width: "25%",
    },
  ],
  []
);

const viewDataList = React.useMemo(() => deductionTypeList);

return (
  <>
    {loading ? (
      <Loader></Loader>
    ) : (
      <Page title={BONDDEDUCTIONTYPE}>
        <div className="head mt-3">
          <img src={Icon} className="icon" />
          {BONDDEDUCTIONTYPES}
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
        <AddEditBondDeductionType
          type={actionType}
          data={selectedRowData}
          showModel={showAddEditForm}
          callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
        />
        <DeleteConfirmationModelAlert
          ShowDeleteModal={showDeleteConfirmationModal}
          Data={deleteConfirmationModalData}
          deleteConfirmationCallBack={deleteConfirmationCallBack}
          title={DELETE + " " + BONDDEDUCTIONTYPE}
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
          onClick={handleAddShowForm}
        >
          + {ADD} {TYPE}
        </Button>
        <ReactTable columns={columns} data={viewDataList} />

        <ViewRadRacDeductionType></ViewRadRacDeductionType>
      </Page>
    )}
  </>
);
};
export default ViewBondDeductionType;
