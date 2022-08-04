import React, { useEffect, useState } from "react";
import {
  ACTION,
  ADD,
  CHARGESCREATEDBY,
  CHARGESPAYMENTDATE,
  CHARGESPAYMENTTYPE,
  DAPDACDELETETITLE,
  DAPDACMAINTITLE,
  DELETE,
  EDIT,
  PAYMENTAMOUNT,
} from "../../../../constant/FieldConstant";
import Icon from "../../../../../src/assets/Images/icon.png";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { Button, Card } from "reactstrap";
import DapDacChargesAndReceipts from "../../../../services/Master/dapDacChargesAndReceipts.service";
import moment from "moment";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import DeleteConfirmationModelAlert from "../../../../components/DeleteConfirmationModelAlert";
import Loader from "../../../../components/Loader";
import Page from "../../../../components/Page";
import ReactTable from "../../../../components/ReactTable";
import SuccessAlert from "../../../../components/SuccessAlert";
import {
  DAPDACCHARGESADD,
  DAPDACCHARGESUPDATE,
} from "../../../../constant/MessageConstant";
import AddEditChargesAndReciepts from "./AddEditChargesAndReciepts";
import ViewListDapDacDeduction from "../deduction/ViewListDapDacDeduction";
import AmountFormat from "../../../../utils/AmountFormat";
import { convertHTMLToPlain } from "../../../../utils/Strings";

const ViewChargesAndReciepts = ({
  residentId,
  admissionDate,
  getCancelData,
  getCancelData2,
  handleIsAdded,
  handleIsAdded1,
}) => {
  const [loading, setLoading] = useState(false);
  const [DapDacList, setDapDacList] = useState([]);
  const [DapDacListCpy, setDapDacListCpy] = useState([]);
  const [totalDapDacCharges, setTotalDapDacCharges] = useState(null);
  const [dapDacPaidtoDate, setDapDacPaidtoDate] = useState(null);
  const [totalDapDacOutstandng, setTotalDapDacOutstandng] = useState(null);
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
  const [createdResidentId, setCreatedResidentId] = useState(null);
  const [oldRadId, setOldRadId] = useState(0);
  const [cancelData, setCancelData] = useState();

  useEffect(() => {
    if (createdResidentId) {
      getAllDapDacCharges("firstCall");
    }
  }, [createdResidentId]);

  useEffect(() => {
    setCreatedResidentId(residentId);
  }, [residentId]);

  useEffect(() => {
    console.log("cancelData useEffect", cancelData);
    getCancelData(cancelData);
  }, [cancelData]);

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
  const getAllDapDacCharges = (firstCall) => {
    let radId = localStorage.getItem("PaymentRadId");
    setLoading(true);
    DapDacChargesAndReceipts.getDapDacReciptsAndCharges(radId)
      .then((response) => {
        setLoading(false);
        setDapDacList(response.dapDacReceiptResponseModel);
        if ((firstCall = "firstCall")) {
          setDapDacListCpy(response.dapDacReceiptResponseModel);
        }
        setTotalDapDacCharges(response.totalDapDacCharges);
        setDapDacPaidtoDate(response.dapDacPaidtoDate);
        setTotalDapDacOutstandng(response.totalDapDacOutstandng);
        setOldRadId(radId);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const UpdateCancelCallback = (updatedRecordID) => {
    // console.log("UpdateCancelCallback updatedRecordID", updatedRecordID);

    const radId = localStorage.getItem("PaymentRadId");
    if (DapDacListCpy && DapDacListCpy.length > 0) {
      const foundItem = DapDacListCpy.find((ob) => ob.id === updatedRecordID);

      foundItem.radId = parseInt(radId);

      delete foundItem.createdBy;
      delete foundItem.deductionType;
      delete foundItem.isUpdated;
      delete foundItem.modifiedBy;

      // console.log("foundItem", foundItem);

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
          ? DAPDACCHARGESADD
          : DAPDACCHARGESUPDATE,
        callback: () => {
          setShowSuccessAlert(false);
          getAllDapDacCharges();
        },
      });
      setShowSuccessAlert(true);
    }
  };
  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      DapDacChargesAndReceipts.deleteDapDacReciptsAndCharges(
        selectedRowData.id,
        selectedRowData.radId
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
      header: DAPDACDELETETITLE,
      message: DAPDACDELETETITLE,
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
            marginTop: "-5px",
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

  // const getFee = (cell) => {
  //   console.log("reciepts", cell.chargeAmount);
  //   const newFormat = AmountFormat(cell.chargeAmount);
  //   return <>{newFormat}</>;
  // };
  const getFee = (cell) => {
    const newFormat = AmountFormat(cell.chargeAmount);
    return newFormat;
  };

  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "5.65%",
      },

      {
        Header: CHARGESPAYMENTDATE,
        accessor: (d) => {
          if (d.chargeDate === null) {
            return;
          } else {
            return moment(d.chargeDate)
              .local()
              .format("MM/DD/YYYY");
          }
        },
        Cell: ({ cell: { value } }) => (
          <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
        ),
        width: "12%",
      },
      {
        Header: PAYMENTAMOUNT,
        // Filter: false,
        disableSortBy: true,
        accessor: getFee,
        width: "15%",
      },
      {
        Header: CHARGESPAYMENTTYPE,
        accessor: (d) => d.deductionType,
        width: "20%",
      },
      {
        Header: "Comments",
        accessor: "comment",
        Cell: GetDescription,
        width: "20%",
      },
      {
        Header: CHARGESCREATEDBY,
        accessor: (d) => d.createdBy,
        width: "20%",
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
          <p className="mt-2">
            This section records the DAP / DAC Charges to the Resident.
          </p>
          <Card style={{ width: "32%" }} className="mb-4 mt-2">
            <div className=" mt-3 mb-2  ">
              <div className="d-flex ">
                <div className="col-4">
                  <p className="offset-1 mt-2"> Total DAP / DAC Charges</p>
                </div>
                <div className="col-7">
                  <NumberFormat
                    thousandSeparator={true}
                    prefix={"$"}
                    placeholder="$0.00"
                    allowNegative={true}
                    name="totalDapDacCharges"
                    id="totalDapDacCharges"
                    // maxLength={17}
                    style={{ alignText: "right" }}
                    value={totalDapDacCharges ? totalDapDacCharges : ""}
                    fixedDecimalScale={2}
                    decimalScale={2}
                    decimalSeparator="."
                    className="form-control text-start"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="col-4 ">
                  <p className="offset-1 mt-2"> DAP / DAC Paid to Date</p>
                </div>
                <div className="col-7">
                  <NumberFormat
                    thousandSeparator={true}
                    prefix={"$"}
                    placeholder="$0.00"
                    allowNegative={true}
                    name="dapDacPaidtoDate"
                    id="dapDacPaidtoDate"
                    // maxLength={17}
                    style={{ alignText: "right" }}
                    value={dapDacPaidtoDate ? dapDacPaidtoDate : ""}
                    fixedDecimalScale={2}
                    decimalScale={2}
                    decimalSeparator="."
                    className="form-control text-start"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="col-11" style={{ marginLeft: "30px" }}>
                <hr style={{ marginLeft: "-1rem" }} />
              </div>
              <div className="d-flex">
                <div className="col-4 ">
                  <p className="offset-1 mt-2 fw-bold">
                    {" "}
                    Total DAP / DAC Outstanding
                  </p>
                </div>
                <div className="col-7">
                  <NumberFormat
                    thousandSeparator={true}
                    prefix={"$"}
                    placeholder="$0.00"
                    allowNegative={true}
                    name="totalDapDacOutstandng"
                    id="totalDapDacOutstandng"
                    // maxLength={17}
                    style={{ alignText: "right" }}
                    value={totalDapDacOutstandng ? totalDapDacOutstandng : ""}
                    fixedDecimalScale={2}
                    decimalScale={2}
                    decimalSeparator="."
                    className="form-control text-start fw-bold"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Button
            className="addbtn btnfix btn btn-primary m-2 btnright justify-content-end"
            onClick={handleAddShowForm}
            style={{ marginTop: "25%" }}
          >
            + {"Add Charge / Payment "}
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
            title={DELETE + " " + DAPDACDELETETITLE}
          />
          <AddEditChargesAndReciepts
            type={actionType}
            data={selectedRowData}
            showModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            oldRadId={oldRadId}
            admissionDate={admissionDate}
            UpdateCancelCallback={UpdateCancelCallback}
            handleIsAdded={handleIsAdded}
          />
          <div className="mt-4">
            {" "}
            <ReactTable columns={columns} data={viewDataList} />
          </div>

          <ViewListDapDacDeduction
            residentId={residentId}
            admissionDate={admissionDate}
            getCancelData2={getCancelData2}
            handleIsAdded1={handleIsAdded1}
          />
        </Page>
      )}
    </>
  );
};
export default ViewChargesAndReciepts;
