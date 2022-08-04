import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import Page from "../../../components/Page";
import {
  ACTION,
  ADD,
  CHARGE,
  CHARGESCREATEDBY,
  CHARGESPAYMENTDATE,
  CHARGESPAYMENTTYPE,
  DAPDACMAINTITLE,
  DELETE,
  EDIT,
  PAYMENTAMOUNT,
  RESIDENTID,
  TOTALDAPDACCHARGES,
  TOTALDAPDACOUTSTANDING,
  TOTALDAPDACRECEIPTS,
} from "../../../constant/FieldConstant";
import Icon from "../../../../src/assets/Images/icon.png";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";
import DapDacChargesAndReceipts from "../../../services/Master/dapDacChargesAndReceipts.service";
import ReactTable from "../../../components/ReactTable";
import moment from "moment";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import SuccessAlert from "../../../components/SuccessAlert";
const ViewDapDacChargesAndReciepts = () => {
  const [loading, setLoading] = useState(false);
  const [DapDacList, setDapDacList] = useState([]);
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

  useEffect(() => {
    getAllDapDacCharges();
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
  const getAllDapDacCharges = () => {
    setLoading(true);
    DapDacChargesAndReceipts.getDapDacReciptsAndCharges(RESIDENTID)
      .then((response) => {
        setLoading(false);
        setDapDacList(response.result);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      DapDacChargesAndReceipts.deleteDapDacReciptsAndCharges(
        selectedRowData.id,
        selectedRowData.residentId
      ).then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: response.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              getAllDapDacCharges();
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
      header: DAPDACMAINTITLE,
      message: DAPDACMAINTITLE,
    });
    setSelectedRowData(item);
  };

  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <UncontrolledButtonDropdown className="dropdownbtn">
        <DropdownToggle className="dropdown-toggle" color="light">
          <span className="tabledropdownaction"> {ACTION} </span>{" "}
          <span className="tabledropdownline"> </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
          <DropdownItem
            id="dropdownBorder"
            onClick={() => handleEditShowForm(cell)}
          >
            <img src={Icon} className="icon" alt="image" />
            {EDIT}
          </DropdownItem>
          <DropdownItem onClick={() => handleOnDelete(cell)}>
            <img src={Icon} className="icon" alt="image" />
            {DELETE}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    );
  }
  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "10%",
      },

      {
        Header: CHARGESPAYMENTDATE,
        accessor: (d) => {
          return moment(d.radRacPaymentDate)
            .local()
            .format("DD/MM/YYYY ");
        },
        width: "20%",
      },
      {
        Header: PAYMENTAMOUNT,
        accessor: (d) => d.radRacPaymentAmount,
        width: "25%",
      },
      {
        Header: CHARGESPAYMENTTYPE,
        accessor: "abcd",
        width: "25%",
      },
      {
        Header: CHARGESCREATEDBY,
        accessor: (d) => d.createdBy,
        width: "25%",
      },
    ],
    []
  );

  const viewDataList = React.useMemo(() => DapDacList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title={DAPDACMAINTITLE}>
          <div className="head mt-4">
            <img src={Icon} className="icon" />
            {DAPDACMAINTITLE}
          </div>
          <hr />
          <br />
          <div className="container">
            <div className="row justify-content-md-right">
              <div className="col col-lg-2">{TOTALDAPDACCHARGES}</div>
              <div className="col-md-auto">
                {" "}
                <input
                  type="number"
                  className="text-end"
                  placeholder="$0.00"
                  id="charges"
                  name="charges"
                  disabled
                />
              </div>
            </div>
            <br />
            <div className="row justify-content-md-right">
              <div className="col col-lg-2">{TOTALDAPDACRECEIPTS}</div>
              <div className="col-md-auto">
                {" "}
                <input
                  type="number"
                  className="text-end"
                  placeholder="$0.00"
                  id="receipts"
                  name="receipts"
                  disabled
                />
                <br />
              </div>
            </div>
            <br />
            <div className="row justify-content-md-right">
              <div className="col col-lg-2">{TOTALDAPDACOUTSTANDING}</div>
              <div className="col-md-auto">
                {" "}
                <input
                  type="number"
                  className="text-end"
                  placeholder="$0.00"
                  id="outstanding"
                  name="outstanding"
                  disabled
                />
                <br />
              </div>
            </div>
          </div>
          <br />
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
            title={DELETE + " " + DAPDACMAINTITLE}
          />
          <Button
            className="addbtn btnfix btn btn-primary m-2 btnright justify-content-end"
            onClick={handleAddShowForm}
          >
            + {ADD} {CHARGE}
          </Button>
          <ReactTable columns={columns} data={viewDataList} />
        </Page>
      )}
    </>
  );
};
export default ViewDapDacChargesAndReciepts;
