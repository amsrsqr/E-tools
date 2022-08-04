import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import {
  ACTION,
  ADD,
  DEDUCTIONHISTORY,
  DELETE,
  DELETEOTHER,
  EDIT,
  OTHERDEDUCTIONTYPE,
} from "../../../constant/FieldConstant";
import Icon from "../../../../src/assets/Images/icon.png";
import Page from "../../../components/Page";
import { Button, Card } from "reactstrap";
import otherDecution from "../../../services/Resident/otherDeduction.service";
import ReactTable from "../../../components/ReactTable";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import AddEditOtherDeduction from "./AddEditOtherDeduction";
import {
  ADDOTHERDEDUCTION,
  UPDATEOTHERDEDUCTION,
} from "../../../constant/MessageConstant";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import SuccessAlert from "../../../components/SuccessAlert";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
import moment from "moment";
import AmountFormat from "../../../utils/AmountFormat";
import { convertHTMLToPlain } from "../../../utils/Strings";

const ViewOtherDeduction = ({
  residentId,
  admissionDate,
  getCancelData,
  handleIsAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [otherDeductionType, setOtherDeductionType] = useState([]);
  const [otherDeductionTypeCpy, setOtherDeductionTypeCpy] = useState([]);
  const [radRacBalance, setRadRacBalance] = useState(null);
  const [oldRadId, setOldRadId] = useState(0);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [actionType, setActionType] = useState();
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [createdResidentId, setCreatedResidentId] = useState(null);
  const [cancelData, setCancelData] = useState([]);

  const radId = Number(localStorage.getItem("PaymentRadId"));

  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);

  useEffect(() => {
    if (createdResidentId) {
      getAllOtherDeductionTypes("firstCall");
    }
  }, [createdResidentId]);

  useEffect(() => {
    console.log("cancelData in useEfect", cancelData);
    getCancelData(cancelData);
  }, [cancelData]);

  useEffect(() => {
    setCreatedResidentId(residentId);
  }, [residentId]);

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

  const getAllOtherDeductionTypes = (firstCall) => {
    const radId = localStorage.getItem("PaymentRadId");
    setLoading(true);
    otherDecution
      .getAllOtherDedutionType(radId)
      .then((response) => {
        setLoading(false);
        setOtherDeductionType(response.radRacDeductionHistoryResponseModel);
        if (firstCall == "firstCall") {
          setOtherDeductionTypeCpy(
            response.radRacDeductionHistoryResponseModel
          );
        }
        setRadRacBalance(response.currentRADRACBalance);
        setOldRadId(radId);
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
          ? ADDOTHERDEDUCTION
          : UPDATEOTHERDEDUCTION,
        callback: () => {
          setShowSuccessAlert(false);
          getAllOtherDeductionTypes();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const handleOnDelete = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: DELETEOTHER,
      message: DELETEOTHER,
    });
    setSelectedRowData(item);
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      otherDecution.deleteOtherDeductionType(selectedRowData.id).then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: response.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              getAllOtherDeductionTypes();
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

  const UpdateCancelCallback = (updatedRecordID) => {
    console.log("UpdateCancelCallback updatedRecordID", updatedRecordID);
    // otherDeductionTypeCpy

    if (otherDeductionTypeCpy && otherDeductionTypeCpy.length > 0) {
      const foundItem = otherDeductionTypeCpy.find(
        (ob) => ob.id === updatedRecordID
      );
      if (foundItem) {
        foundItem.radId = parseInt(radId);
        delete foundItem.createdBy;
        delete foundItem.isUpdated;
        delete foundItem.modifiedBy;
        delete foundItem.radDeductionType;

        if (cancelData && cancelData.length > 0) {
          setCancelData([...cancelData, foundItem]);
        } else {
          setCancelData([foundItem]);
        }
      }
    }
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

  const getFee = (cell) => {
    const newFormat = AmountFormat(cell.deductionAmount);
    return newFormat;
  };
  const GetDescription = (props) => {
    const [showMore, setShowMore] = useState(false);
    return (
      <div>
        {showMore ? (
          <span dangerouslySetInnerHTML={{ __html: `${props.value}` }}></span>
        ) : (
          <span
            dangerouslySetInnerHTML={{
              __html: `${convertHTMLToPlain(props.value)?.substring(0, 170)} `,
            }}
          ></span>
        )}
        <p
          style={{
            color: "blue",
            cursor: "pointer",
            fontSize: "12px",
            marginBottom: "0rem",
            textAlign: "right",
          }}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore
            ? "Show less"
            : props.value?.length > 170
            ? "Show more"
            : ""}
        </p>
      </div>

      // <div dangerouslySetInnerHTML={{ __html: `<p>${props.value}</p>` }} />
    );
  };
  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "6.10%",
      },
      {
        Header: "Deduction Date",
        accessor: (d) => {
          if (d.deductionDate === null) {
            return;
          } else {
            return moment(d.deductionDate)
              .local()
              .format("MM/DD/YYYY");
          }
        },
        Cell: ({ cell: { value } }) => (
          <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
        ),

        width: "20%",
      },
      {
        Header: "Deduction Amount",
        // Filter: false,
        disableSortBy: true,
        accessor: getFee,
        width: "20%",
      },
      {
        Header: "Deduction Type",
        accessor: (d) => d.radDeductionType,
        width: "20%",
      },
      {
        Header: "Comments",
        accessor: "comments",
        Cell: GetDescription,
        width: "20%",
      },
      {
        Header: "Created By",
        accessor: (d) => d.createdBy,
        width: "25%",
      },
    ],
    []
  );

  const viewDataList = React.useMemo(() => otherDeductionType);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {DEDUCTIONHISTORY}
          </div>
          <hr className="headerBorder" />
          <p>
            This section records the Service and Care fees which have been
            deducted from the Resident’s RAD / RAC Balance.
          </p>
          <Card className="col-4 mb-4 ">
            <div className="d-flex mt-4 mb-4 ">
              <div className="col-4 ">
                <p className="offset-1 mt-2"> Current RAD / RAC Balance</p>
              </div>
              <div className="col-7">
                <NumberFormat
                  thousandSeparator={true}
                  prefix={"$"}
                  placeholder="$0.00"
                  allowNegative={true}
                  name="radRacBalance"
                  id="radRacBalance"
                  // maxLength={17}
                  style={{ alignText: "right" }}
                  value={radRacBalance ? radRacBalance : ""}
                  fixedDecimalScale={2}
                  decimalScale={2}
                  decimalSeparator="."
                  className="form-control"
                  disabled={true}
                />
              </div>
            </div>
          </Card>
          <Button
            className="addbtn btnfix btn btn-primary m-2 btnright justify-content-end"
            onClick={handleAddShowForm}
          >
            + {ADD} {" Deduction"}
          </Button>
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
            title={DELETE + " " + OTHERDEDUCTIONTYPE}
          ></DeleteConfirmationModelAlert>

          <AddEditOtherDeduction
            type={actionType}
            data={selectedRowData}
            showModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            oldRadId={oldRadId}
            radRacBalance={radRacBalance}
            admissionDate={admissionDate}
            UpdateCancelCallback={UpdateCancelCallback}
            handleIsAdded={handleIsAdded}
          />
          <ReactTable columns={columns} data={viewDataList} />
        </Page>
      )}
    </>
  );
};
export default ViewOtherDeduction;
