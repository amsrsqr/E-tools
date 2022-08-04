import React, { useEffect, useState } from "react";
import {
  ACTION,
  ADD,
  BONDHISTORY,
  DELETE,
  EDIT,
} from "../../../../constant/FieldConstant";
import {
  BONDDEDUCTIONHISTORYTEXT,
  BONDHISTORYADD,
  BONDHISTORYUPDATE,
} from "../../../../constant/MessageConstant";
import bondDeduction from "../../../../services/Resident/bondDeductionHistory.service";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { Button, Card } from "reactstrap";
import AmountFormat from "../../../../utils/AmountFormat";
import Icon from "../../../../../src/assets/Images/icon.png";
import moment from "moment";
import Loader from "../../../../components/Loader";
import Page from "../../../../components/Page";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import WarningMessageModelAlert from "../../../../components/WarningMessageModelAlert";
import SuccessAlert from "../../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../../components/DeleteConfirmationModelAlert";
import ReactTable from "../../../../components/ReactTable";
import AddEditBondHistory from "./AddEditBondHistory";
import ViewPeriodRules from "./ViewPeriodRules";
import { convertHTMLToPlain } from "../../../../utils/Strings";

const ViewBondHistory = ({
  bondIdAll,
  admissionDate,
  handleCancelInTabs,
  handleCancelInTabs1,
  handleCancelOnAdd,
  handleCancelOnAdd1,
}) => {
  const [loading, setLoading] = useState(false);
  const [bondDeductionList, setBondDeductionList] = useState([]);
  const [bondDeductionListCpy, setBondDeductionListCpy] = useState([]);
  const [title, setTitle] = useState([]);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [actionType, setActionType] = useState();
  const [selectedRowData, setSelectedRowData] = useState({});
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

  const [newBondId, setNewBondId] = useState(null);
  const [currentBondBalance, setCurrentBondBalanace] = useState(0);
  const [retentionAmount, setRetentionAmount] = useState(0);

  const [cancelData, setCancelData] = useState();

  useEffect(() => {
    handleCancelInTabs({
      listDeductionHistory: cancelData,
      tab: "bondDeduction",
      table1: "listDeductionHistory",
    });
  }, [cancelData]);

  useEffect(() => {
    if (newBondId) {
      getAllBondDeductionHistory("firstCall");
    }
  }, [newBondId]);

  useEffect(() => {
    setNewBondId(bondIdAll);
  }, [bondIdAll]);

  useEffect(() => {
    setTitle(title);
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

  const onHandleMessage = (type, title, content) => {
    setShowWarningAlert(!showWarningAlert);
    const setNewTitle = {
      warningType: type,
      header: title,
      msg: content,
    };
    setTitle(setNewTitle);
  };

  const getAllBondDeductionHistory = (firstCall) => {
    setLoading(true);
    bondDeduction.getAllBondDeductionHistory(newBondId).then((response) => {
      setLoading(false);
      setBondDeductionList(response.bondDeductionHistories);
      if (firstCall === "firstCall") {
        setBondDeductionListCpy(response.bondDeductionHistories);
      }
      setCurrentBondBalanace(response.currentBondBalance);
      setRetentionAmount(response.retentionAmount);
    });
  };

  const UpdateCancelCallback = (updatedRecordID) => {
    if (bondDeductionListCpy && bondDeductionListCpy.length > 0) {
      const foundItem = bondDeductionListCpy.find(
        (ob) => ob.id === updatedRecordID
      );
      foundItem.bondId = bondIdAll;
      foundItem.comment = foundItem.comments;
      foundItem.bondDeductionAmount = foundItem.deductionAmount;
      foundItem.bondDeductionDate = foundItem.deductionDate;

      delete foundItem.createdBy;
      delete foundItem.modifiedBy;
      delete foundItem.isUpdated;
      delete foundItem.deductionAmount;
      delete foundItem.deductionDate;
      delete foundItem.comments;
      delete foundItem.displayDeductionType;
      delete foundItem.isUpdated;

      if (cancelData && cancelData.length > 0) {
        setCancelData([...cancelData, foundItem]);
      } else {
        setCancelData([foundItem]);
      }
    }
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
          ? BONDHISTORYADD
          : BONDHISTORYUPDATE,
        callback: () => {
          setShowSuccessAlert(false);
          getAllBondDeductionHistory();
        },
      });
      setShowSuccessAlert(true);
      handleCancelOnAdd({
        screen: "bondDeduction",
        tab: "listDeductionHistory",
        data: [],
      });
    }
  };

  const handleOnDelete = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: BONDHISTORY,
      message: BONDHISTORY,
    });
    setSelectedRowData(item);
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      bondDeduction
        .deleteAllBondDeductionHistory(newBondId, selectedRowData.id)
        .then(
          (response) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: response.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getAllBondDeductionHistory();
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
            // marginTop: "-5px",
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

  const getFee = (cell) => {
    const newFormat = AmountFormat(cell.deductionAmount);
    return newFormat;
  };

  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "4.50%",
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
        width: "10%",
      },
      {
        Header: "Deduction Amount",
        disableSortBy: true,
        accessor: getFee,
        width: "10%",
      },
      {
        Header: "Deduction Type",
        accessor: "displayDeductionType",
        width: "10%",
      },

      {
        Header: "Comments",
        accessor: "comments",
        Cell: GetDescription,
        width: "30%",
      },
      {
        Header: "Created By",
        accessor: (d) => d.createdBy,
        width: "12%",
      },
    ],
    []
  );
  const viewDataList = React.useMemo(() => bondDeductionList);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="Bond Receipts">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {"Bond Deduction History"}
            &nbsp;
            <i
              className="fa fa-info-circle fa-sm mt-1"
              onClick={() =>
                onHandleMessage(
                  "info",
                  "Bond Deduction",
                  BONDDEDUCTIONHISTORYTEXT.TEXT
                )
              }
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <hr className="headerBorder" />
          <p>
            This section records the Service and Care fees which have been
            deducted from the Resident’s Bond Balance.
          </p>
          <Card className="col-3 mb-4">
            <div className="row" style={{ height: "75px" }}>
              <div className="col-4 text-end ">
                <p className="mt-4"> Current Bond Balance</p>
              </div>
              <div className="col-7 mt-3" style={{ marginLeft: "0px" }}>
                <NumberFormat
                  thousandSeparator={true}
                  prefix={"$"}
                  placeholder="$0.00"
                  allowNegative={true}
                  name="currentBondBalance"
                  id="currentBondBalance"
                  // maxLength={17}
                  style={{ alignText: "left" }}
                  value={currentBondBalance ? currentBondBalance : ""}
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
            +{" Add Deduction "}
          </Button>
          {showWarningAlert && (
            <WarningMessageModelAlert
              warningType={title.warningType}
              header={title.header}
              msg={title.msg}
              showWarningAlert={showWarningAlert}
              setShowWarningAlert={setShowWarningAlert}
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
            title={DELETE + " " + BONDHISTORY}
          ></DeleteConfirmationModelAlert>

          <AddEditBondHistory
            type={actionType}
            data={selectedRowData}
            showModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            UpdateCancelCallback={UpdateCancelCallback}
            newBondId={newBondId}
            admissionDate={admissionDate}
            retentionAmount={retentionAmount}
          />

          <ReactTable columns={columns} data={viewDataList} />
          <ViewPeriodRules
            bondId={bondIdAll}
            handleCancelInTabs1={handleCancelInTabs1}
            handleCancelOnAdd1={handleCancelOnAdd1}
          />
        </Page>
      )}
    </>
  );
};
export default ViewBondHistory;
