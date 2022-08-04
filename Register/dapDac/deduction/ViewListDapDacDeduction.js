import React, { useEffect, useState } from "react";
import {
  ACTION,
  ADD,
  CHARGESCREATEDBY,
  DAPDACDEDUCTIONMAIN,
  DAPDACDEDUCTIONTITLE,
  DELETE,
  EDIT,
} from "../../../../constant/FieldConstant";
import dapDacDeduction from "../../../../services/Resident/dapDacDeduction.service";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import Page from "../../../../components/Page";
import Loader from "../../../../components/Loader";
import ReactTable from "../../../../components/ReactTable";
import Icon from "../../../../../src/assets/Images/icon.png";
import SuccessAlert from "../../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../../components/DeleteConfirmationModelAlert";
import {
  DAPDACDEDUCTIONUPDATE,
  DAPDAPDEDUCTIONADD,
} from "../../../../constant/MessageConstant";
import { Button, Card, Input } from "reactstrap";
import moment from "moment";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import AddEditDapDacDeduction from "./AddEditDapDacDeduction";
import AmountFormat from "../../../../utils/AmountFormat";
import { convertHTMLToPlain } from "../../../../utils/Strings";

const ViewListDapDacDeduction = ({
  residentId,
  admissionDate,
  getCancelData2,
  handleIsAdded1,
}) => {
  const [loading, setLoading] = useState(false);
  const [deductionList, setDeductionList] = useState([]);
  const [deductionListCpy, setDeductionListCpy] = useState([]);
  const [currentRadRacBalance, setCurrentRadRacBalance] = useState(null);
  const [totalDapDacDeduction, setTotalDapDacDeduction] = useState(null);
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

  const [cancelData, setCancelData] = useState([]);

  useEffect(() => {
    if (createdResidentId) {
      getAllDapDacDeduction("firstCall");
    }
  }, [createdResidentId]);

  useEffect(() => {
    console.log("cancelData ViewListDapDacDeduction", cancelData);
    getCancelData2(cancelData);
  }, [cancelData]);

  useEffect(() => {
    console.log("useEffect deductionList", deductionList);
  }, [deductionList]);

  useEffect(() => {
    console.log("useEffect deductionListCpy", deductionListCpy);
  }, [deductionListCpy]);

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

  const getAllDapDacDeduction = (firstCall) => {
    let radId = localStorage.getItem("PaymentRadId");
    setLoading(true);
    dapDacDeduction
      .getAllDapDacDeduction(radId)
      .then((response) => {
        console.log("RESPONSE", response);
        setLoading(false);
        setDeductionList(response.dapDacReceiptsResponseModels);
        if (firstCall === "firstCall") {
          console.log("response.bondReceiptList", response.bondReceiptList);
          setDeductionListCpy(response.dapDacReceiptsResponseModels);
        }
        setCurrentRadRacBalance(response.currentRadRacBalance);
        setTotalDapDacDeduction(response.totalDapDacDeductions);
        setOldRadId(response.radId);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const UpdateCancelCallback = (updatedRecordID) => {
    console.log("deductionListCpy", deductionListCpy);
    console.log("UpdateCancelCallback updatedRecordID", updatedRecordID);
    if (deductionListCpy && deductionListCpy.length > 0) {
      const foundItem = deductionListCpy.find(
        (ob) => ob.id === updatedRecordID
      );
      if (foundItem) {
        delete foundItem.createdBy;
        delete foundItem.deductionType;
        delete foundItem.isUpdated;
        delete foundItem.modifiedBy;

        console.log("UpdateCancelCallback foundItem", foundItem);
        if (cancelData && cancelData.length > 0) {
          setCancelData([...cancelData, foundItem]);
        } else {
          setCancelData([foundItem]);
        }
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
          ? DAPDAPDEDUCTIONADD
          : DAPDACDEDUCTIONUPDATE,
        callback: () => {
          setShowSuccessAlert(false);
          getAllDapDacDeduction();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      dapDacDeduction
        .deleteDapDacDeduction(selectedRowData.id, selectedRowData.radId)
        .then(
          (response) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: response.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getAllDapDacDeduction();
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
      header: DAPDACDEDUCTIONTITLE,
      message: DAPDACDEDUCTIONTITLE,
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
  //   console.log('deduction',cell.deductionAmount)
  //   const newFormat=AmountFormat(cell.deductionAmount);
  //   return (
  //     <>
  //        {newFormat}
  //     </>
  //   );
  // };

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
        width: "5.65%",
      },

      {
        Header: "Deduction Date ",
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
        width: "12%",
      },
      {
        Header: "Deduction Amount ",
        // Filter: false,
        disableSortBy: true,
        accessor: getFee,
        width: "15%",
      },
      {
        Header: "Deduction Type",
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
  const viewDataList = React.useMemo(() => deductionList);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title={DAPDACDEDUCTIONMAIN}>
          <div className="head mt-4">
            <img src={Icon} className="icon" />
            {DAPDACDEDUCTIONMAIN}
          </div>
          <hr />
          <p>
            This section records the DAP / DAC Charges which will be deducted
            from the Resident’s current RAD / RAC Balance.
          </p>
          <Card className="col-4 mb-4 ml-1">
            <div className=" mt-3 mb-2 mr-2 ">
              <div className="d-flex">
                <div className="col-5 ">
                  <p className="offset-1 mt-2"> Current RAD / RAC Balance</p>
                </div>
                <div className="col-6">
                  <NumberFormat
                    thousandSeparator={true}
                    prefix={"$"}
                    placeholder="$0.00"
                    allowNegative={true}
                    name="currentRadRacBalance"
                    id="currentRadRacBalance"
                    // maxLength={17}
                    style={{ alignText: "right" }}
                    value={currentRadRacBalance ? currentRadRacBalance : ""}
                    fixedDecimalScale={2}
                    decimalScale={2}
                    decimalSeparator="."
                    className="form-control text-start"
                    disabled={true}
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="col-5 ">
                  <p className="offset-1 mt-2">Total DAP / DAC Deductions</p>
                </div>
                <div className="col-6">
                  <NumberFormat
                    thousandSeparator={true}
                    prefix={"$"}
                    placeholder="$0.00"
                    allowNegative={true}
                    name="totalDapDacDeduction"
                    id="totalDapDacDeduction"
                    // maxLength={17}
                    style={{ alignText: "right" }}
                    value={totalDapDacDeduction ? totalDapDacDeduction : ""}
                    fixedDecimalScale={2}
                    decimalScale={2}
                    decimalSeparator="."
                    className="form-control text-start"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </Card>
          <Button
            className="addbtn btnfix btn btn-primary m-2 btnright justify-content-end"
            onClick={handleAddShowForm}
          >
            + {"Add Deduction "}
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
            title={DELETE + " " + DAPDACDEDUCTIONTITLE}
          />
          <AddEditDapDacDeduction
            type={actionType}
            data={selectedRowData}
            showModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            oldRadId={oldRadId}
            admissionDate={admissionDate}
            UpdateCancelCallback={UpdateCancelCallback}
            handleIsAdded1={handleIsAdded1}
          />
          <div className="mt-4">
            <ReactTable columns={columns} data={viewDataList} />
          </div>
        </Page>
      )}
    </>
  );
};
export default ViewListDapDacDeduction;
