import React, { useEffect, useState } from "react";
import Loader from "../../../../components/Loader";
import Page from "../../../../components/Page";
import Icon from "../../../../../src/assets/Images/icon.png";
import { Button, Card } from "reactstrap";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import {
  ACTION,
  ADD,
  BONDREC,
  BONDRECE,
  BONDRECEI,
  DELETE,
  EDIT,
  INFO,
} from "../../../../constant/FieldConstant";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import AmountFormat from "../../../../utils/AmountFormat";
import ReactTable from "../../../../components/ReactTable";
import BondReceipts from "../../../../services/Resident/bondReceipts.service";
import moment from "moment";
import WarningMessageModelAlert from "../../../../components/WarningMessageModelAlert";
import {
  ADDRECIEPT,
  BONDRECINFO,
  UPDATERECIEPT,
} from "../../../../constant/MessageConstant";
import SuccessAlert from "../../../../components/SuccessAlert";
import ModalError from "../../../../components/ModalError";
import DeleteConfirmationModelAlert from "../../../../components/DeleteConfirmationModelAlert";
import AddEditBondReceipts from "./AddEditBondReceipts";
import ViewAllCharges from "./ViewAllCharges";
import { convertHTMLToPlain } from "../../../../utils/Strings";

const ViewBondReceipts = ({
  residentId,
  admissionDate,
  getBondIdCallback,
  handleCancelInTabs,
  handleCancelInTabs1,
  bondIdAll,
  handleCancelOnAdd,
  handleCancelOnAdd1,
}) => {
  const [loading, setLoading] = useState(false);
  const [bondList, setBondList] = useState([]);
  const [agreedBond, setAgreedBond] = useState(null);
  const [lumpsum, setLumpsum] = useState(null);
  const [bondPaidToDate, setBondPaidToDate] = useState(null);
  const [outstandingBond, setOutstandingBond] = useState(null);
  const [isPeriodicPayment, setIsPeriodicPayment] = useState(false);
  const [title, setTitle] = useState([]);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [actionType, setActionType] = useState();
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showMPIRError, setShowMPIRError] = useState(false);
  const [mpirErrorMsg, setMpirErrorMsg] = useState("");

  const [bondTypeListCpy, setBondTypeListCpy] = useState([]);
  const [cancelData, setCancelData] = useState([]);

  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [oldBondId, setOldBondId] = useState(null);
  const [createdResidentId, setCreatedResidentId] = useState(null);
  useEffect(() => {
    if (createdResidentId) {
      getAllBondTypeReceipts("firstCall");
    }
  }, [createdResidentId]);

  useEffect(() => {
    setCreatedResidentId(residentId);
  }, [residentId]);

  useEffect(() => {
    setTitle(title);
  }, []);

  useEffect(() => {
    console.log("cancelData in view", cancelData);
    if (cancelData && cancelData.length > 0)
      handleCancelInTabs({
        listBondReceipt: cancelData,
        tab: "reciepts",
        table1: "listDeductionHistory",
      });
  }, [cancelData]);

  const handleAddShowForm = () => {
    if (isPeriodicPayment) {
      setMpirErrorMsg("");
      setShowMPIRError(true);
      setShowAddEditForm(false);
    } else {
      setShowAddEditForm(true);
    }
    setSelectedRowData({});
    setActionType(ADD);
  };

  const handleEditShowForm = (item) => {
    if (isPeriodicPayment) {
      setMpirErrorMsg("");
      setShowMPIRError(true);
      setShowAddEditForm(false);
    } else {
      setShowAddEditForm(true);
    }
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

  const getAllBondTypeReceipts = (firstCall) => {
    setLoading(true);
    BondReceipts.getAllBondReceipts(createdResidentId).then((response) => {
      setLoading(false);
      setBondList(response.bondReceiptList);
      setAgreedBond(response.agreedBond);
      setLumpsum(response.lumpSumComponent);
      setBondPaidToDate(response.bondPaidToDate);
      setOutstandingBond(response.outstandingBond);
      setOldBondId(response.bondId);
      setIsPeriodicPayment(response.isPeriodicPayment);
      getBondIdCallback(response.bondId);

      if (firstCall === "firstCall") {
        setBondTypeListCpy([...response.bondReceiptList]);
      }
    });
  };

  const UpdateCancelCallback = (updatedRecordID) => {
    if (bondTypeListCpy && bondTypeListCpy.length > 0) {
      const foundItem = bondTypeListCpy.find((ob) => ob.id === updatedRecordID);

      foundItem.bondId = bondIdAll;
      foundItem.bondPaymentAmount = foundItem.paymentAmount;
      foundItem.bondPaymentDate = foundItem.paymentDate;
      foundItem.comment = foundItem.comments;
      delete foundItem.createdBy;
      delete foundItem.modifiedBy;
      delete foundItem.paymentAmount;
      delete foundItem.paymentDate;
      delete foundItem.comments;

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
        msg: msg ? msg : actionType === EDIT ? ADDRECIEPT : UPDATERECIEPT,
        callback: () => {
          setShowSuccessAlert(false);
          getAllBondTypeReceipts();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const handleOnDelete = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: BONDRECE,
      message: BONDRECE,
    });
    setSelectedRowData(item);
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      BondReceipts.deleteAllBondReceipts(selectedRowData.id).then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: response.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              getAllBondTypeReceipts();
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
    const newFormat = AmountFormat(cell.paymentAmount);
    return newFormat;
  };
  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "5%",
      },

      {
        Header: "Payment Date",
        accessor: (d) => {
          if (d.paymentDate === null) {
            return;
          } else {
            return moment(d.paymentDate)
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
        Header: "Payment Amount",
        disableSortBy: true,
        accessor: getFee,
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
  const viewDataList = React.useMemo(() => bondList);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="Bond Receipts">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {"Bond Receipt Details"}
            &nbsp;
            <i
              className="fa fa-info-circle fa-sm mt-1"
              onClick={() => onHandleMessage(INFO, BONDREC, BONDRECINFO.TEXT)}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <hr className="headerBorder" />
          <p>
            This section records the Bond Transactions of the Resident towards
            the Facility.
          </p>
          <Card className="col-4 mb-4 ">
            <div className="col-4 mt-2 text-end">
              <p className="offset-1 fw-bold "> Bond Receipt Details</p>
            </div>
            <div className="d-flex mt-2 ">
              <div className="col-4 text-end mt-2">
                <p> Agreed Bond</p>
              </div>
              <div className="col-6" style={{ marginLeft: "20px" }}>
                <NumberFormat
                  thousandSeparator={true}
                  prefix={"$"}
                  placeholder="$0.00"
                  allowNegative={true}
                  name="agreedBond"
                  id="agreedBond"
                  // maxLength={17}
                  style={{ alignText: "right" }}
                  value={agreedBond ? agreedBond : ""}
                  fixedDecimalScale={2}
                  decimalScale={2}
                  decimalSeparator="."
                  className="form-control"
                  disabled={true}
                />
              </div>
            </div>
            <div className="d-flex  ">
              <div className="col-4 text-end">
                <p className="mt-2"> Lump Sum Component</p>
              </div>
              <div className="col-6 " style={{ marginLeft: "20px" }}>
                <NumberFormat
                  thousandSeparator={true}
                  prefix={"$"}
                  placeholder="$0.00"
                  allowNegative={true}
                  name="lumpsum"
                  id="lumpsum"
                  // maxLength={17}
                  style={{ alignText: "right" }}
                  value={lumpsum ? lumpsum : ""}
                  fixedDecimalScale={2}
                  decimalScale={2}
                  decimalSeparator="."
                  className="form-control"
                  disabled={true}
                />
              </div>
            </div>
            <div className="d-flex  ">
              <div className="col-4 text-end ">
                <p className="mt-2"> Bond Paid to Date</p>
              </div>
              <div className="col-6 " style={{ marginLeft: "20px" }}>
                <NumberFormat
                  thousandSeparator={true}
                  prefix={"$"}
                  placeholder="$0.00"
                  allowNegative={true}
                  name="bondPaidToDate"
                  id="bondPaidToDate"
                  // maxLength={17}
                  style={{ alignText: "left" }}
                  value={bondPaidToDate ? bondPaidToDate : ""}
                  fixedDecimalScale={2}
                  decimalScale={2}
                  decimalSeparator="."
                  className="form-control"
                  disabled={true}
                />
              </div>
            </div>
            <div className="col-11" style={{ marginLeft: "30px" }}>
              <hr />
            </div>
            <div className="d-flex mb-4">
              <div className="col-4 text-end">
                <p className=" mt-2 fw-bold"> Outstanding RAD / RAC</p>
              </div>
              <div className="col-6" style={{ marginLeft: "20px" }}>
                <NumberFormat
                  thousandSeparator={true}
                  prefix={"$"}
                  placeholder="$0.00"
                  allowNegative={true}
                  name="outstandingBond"
                  id="outstandingBond"
                  // maxLength={17}
                  style={{ alignText: "right" }}
                  value={outstandingBond ? outstandingBond : ""}
                  fixedDecimalScale={2}
                  decimalScale={2}
                  decimalSeparator="."
                  className="form-control fw-bold"
                  disabled={true}
                />
              </div>
            </div>
          </Card>
          <Button
            className="addbtn btnfix btn btn-primary m-2 btnright justify-content-end"
            onClick={handleAddShowForm}
          >
            +{" Add Payment "}
          </Button>
          <Button
            variant="light"
            className="addbtn btnfix btn btn-primary btnright disabled mt-2"
            style={{ marginRight: "130px" }}
          >
            {"Print Receipt"}
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
            title={DELETE + " " + BONDRECEI}
          ></DeleteConfirmationModelAlert>
          {isPeriodicPayment ? (
            <ModalError
              showErrorPopup={showMPIRError}
              fieldArray={[]}
              errorMessage={mpirErrorMsg}
              secondMsg={
                "Bond receipts cannot be stored for a periodic payment resident"
              }
              header={"Periodic Resident"}
              buttonType={"Ok"}
              handleErrorClose={() => {
                setShowMPIRError(false);
              }}
            ></ModalError>
          ) : (
            <AddEditBondReceipts
              type={actionType}
              data={selectedRowData}
              showModel={showAddEditForm}
              callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
              UpdateCancelCallback={UpdateCancelCallback}
              handleCancelOnAdd={handleCancelOnAdd}
              oldBondId={oldBondId}
              admissionDate={admissionDate}
            />
          )}

          <ReactTable columns={columns} data={viewDataList} />
          <ViewAllCharges
            oldBondId={oldBondId}
            handleCancelInTabs1={handleCancelInTabs1}
            handleCancelOnAdd1={handleCancelOnAdd1}
          />
        </Page>
      )}
    </>
  );
};
export default ViewBondReceipts;
