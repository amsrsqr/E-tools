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
  PLUSSIGN,
  PAYMENTCHARGES,
} from "../../../constant/FieldConstant";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import Loader from "../../../components/Loader";
import Icon from "../../../assets/Images/icon.png";
import { SAVESUCCESSFUL } from "../../../constant/MessageConstant";

import prudentialBankPaymentChargesService from "../../../services/PrudentialRequirement/prudentialBankPaymentCharges.service";
import AddBankPaymentCharges from "./AddEditBankPaymentCharges";
import ReactTable from "../../../components/ReactTable";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import SuccessAlert from "../../../components/SuccessAlert";
import Page from "../../../components/Page";
import AmountFormat from "../../../utils/AmountFormat";

const ViewBankPaymentCharges = ({ selectedFacility }) => {
  const [bankPaymentCharges, setBankPaymentCharges] = useState([]);
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
      getBankPaymentChargesList();
    }
  }, [selectedFacility]);

  const getBankPaymentChargesList = () => {
    setLoading(true);
    prudentialBankPaymentChargesService
      .getBankPaymentCharges(selectedFacility.facility_id)
      .then((response) => {
        setLoading(false);
        setBankPaymentCharges(response);
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
      prudentialBankPaymentChargesService
        .deleteBankPaymentCharges(selectedRowData.id)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getBankPaymentChargesList();
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

  const deleteBankPaymentCharges = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: "Bank Payment / Charges",
      message: "Bank Payment / Charges",
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
          getBankPaymentChargesList();
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
          <Dropdown.Item onClick={() => deleteBankPaymentCharges(cell)}>
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
      width: "6.25%",
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
      width: "12%",
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
      width: "40%",
    },
  ]);
  const bankPaymentChargesList = React.useMemo(() => bankPaymentCharges);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3" style={{fontSize:"16px"}} >{selectedFacility.facility_name}</div>
          <Button
            className="addbtn btnfix btn btn-primary m-3 btnright"
            onClick={handleShow}
          >
            {PLUSSIGN} {ADD} {"Payment / Charge"}
          </Button>

          <ReactTable columns={columns} data={bankPaymentChargesList} />
          {showAddEditForm && (
            <AddBankPaymentCharges
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
            title={"Bank Payment Charges"}
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
      )}
    </>
  );
};
export default ViewBankPaymentCharges;
