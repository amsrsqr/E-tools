import React, { useState, useEffect } from "react";
import {
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  ACTION,
  ADD,
  DELETE,
  EDIT,
  PAYMENT,
  PAYMENTAMT,
  PLUSSIGN,
} from "../../../../constant/FieldConstant";
import prudentialRequirementService from "../../../../services/PrudentialRequirement/prudentialRequirement.service";
import Page from "../../../../components/Page";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import Loader from "../../../../components/Loader";
import Icon from "../../../../../src/assets/Images/icon.png";
import ReactTable from "../../../../components/ReactTable";
import { SAVESUCCESSFUL } from "../../../../constant/MessageConstant";
import AddPaymentCharges from "./AddEditPaymentCharges";
import SuccessAlert from "../../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../../components/DeleteConfirmationModelAlert";
import AmountFormat from "../../../../utils/AmountFormat";

const ViewPaymentCharges = ({ selectedFacility, enableTab }) => {
  const [paymentCharges, setPaymentCharges] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [actionType, setActionType] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  useEffect(() => {
    if (selectedFacility && selectedFacility.facility_id) {
      getPaymentChargesList();
    }
  }, [selectedFacility]);

  useEffect(() => {}, [enableTab]);

  const getPaymentChargesList = () => {
    setLoading(true);
    prudentialRequirementService
      .getPaymentCharges(selectedFacility.facility_id)

      .then((response) => {
        setLoading(false);
        setPaymentCharges(response);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleShow = () => {
    setShowAddEditForm(true);
    setData({});
    setActionType(ADD);
  };
  const EditShow = (item) => {
    setShowAddEditForm(true);
    setData({ item });
    setActionType(EDIT);
  };

  const deleteConfirmationCallBack = (childdata, success) => {
    setShowDeleteConfirmationModal(childdata);
    if (success) {
      setLoading(true);
      prudentialRequirementService
        .deletePaymentCharges(selectedRowData.id)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getPaymentChargesList();
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

  const deletePaymentCharges = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: "Payment / Charges",
      message: "Payment / Charges",
    });
    setSelectedRowData(item);
  };

  const callBackAddEditFormToViewForm = (childdata, success, msg = null) => {
    setShowAddEditForm(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: msg ? msg : actionType === EDIT ? SAVESUCCESSFUL : SAVESUCCESSFUL,
        callback: () => {
          setShowSuccessAlert(false);
          getPaymentChargesList();
        },
      });
      setShowSuccessAlert(true);
    }
  };
  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Dropdown as={ButtonGroup} className="btn-group w-100">
        <Button className="dropdownAction">{ACTION}</Button>
        <Dropdown.Toggle split variant="" id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item id="dropdownBorder" onClick={() => EditShow(cell)}>
            <img src={Icon} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => deletePaymentCharges(cell)}>
            <img src={Icon} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  const convertDate = (dt) => {
    console.log(dt);
    let altDate = new Date();
    dt = dt ? dt : altDate;
    return `${(new Date(dt).getDate() < 10 ? "0" : "") +
      new Date(dt).getDate()}/${(new Date(dt).getMonth() < 10 ? "0" : "") +
      (new Date(dt).getMonth() + 1)}/${new Date(dt).getFullYear()}`;
  };

  const columns = React.useMemo(() => [
    {
      Header: "",
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "6.70%",
    },
    {
      Header: "Date",
      accessor: (d) => {
        return convertDate(d.date);
      },

      disableSortBy: true,

      width: "8%",
    },
    {
      Header: "Payee",
      accessor: (d) => d.payee,

      disableSortBy: true,
      width: "14%",
    },
    {
      Header: "Amount",
      accessor: (d) => {
        return AmountFormat(d.amount);
      },

      disableSortBy: true,
      width: "10%",
    },

    {
      Header: "Description",
      accessor: (d) => d.displayDescription,

      disableSortBy: true,
      width: "27%",
    },
    {
      Header: "Authorised By",
      accessor: (d) => d.authorisedBy,

      disableSortBy: true,
      width: "16%",
    },
  ]);
  const paymentChargesList = React.useMemo(() => paymentCharges);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : enableTab ? (
        <>
          <Page title="">
            <div className="head mt-3" style={{fontSize:"16px"}} >{selectedFacility.facility_name}</div>
            <Button
              className="addbtn btnfix btn btn-primary m-3 btnright"
              onClick={handleShow}
            >
              {PLUSSIGN} {ADD} {PAYMENT}
            </Button>

            <ReactTable columns={columns} data={paymentChargesList} />
            {showAddEditForm && (
              <AddPaymentCharges
                facility={selectedFacility}
                type={actionType}
                Data={data}
                ShowModel={showAddEditForm}
                callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
              />
            )}
            <DeleteConfirmationModelAlert
              ShowDeleteModal={showDeleteConfirmationModal}
              Data={deleteConfirmationModalData}
              deleteConfirmationCallBack={deleteConfirmationCallBack}
              title={" Payment Charges"}
            ></DeleteConfirmationModelAlert>
            {showSuccessAlert && (
              <SuccessAlert
                type={successAlertOptions.actionType}
                msg={successAlertOptions.msg}
                title={successAlertOptions.title}
                callback={successAlertOptions.callback}
              ></SuccessAlert>
            )}
          </Page>
        </>
      ) : (
        <>
          <br />
          <p color="#7E7E7E">
            Select a Facility in the filter above first in order to view
            Prudential Requirements for that Facility.
          </p>
        </>
      )}
    </>
  );
};
export default ViewPaymentCharges;
