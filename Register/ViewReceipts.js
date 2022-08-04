import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import Icon from "../../../src/assets/Images/icon.png";
import SuccessAlert from "../../components/SuccessAlert";
import Loader from "../../components/Loader";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../components/NumberFormat";
import { Button, Row, Card } from "reactstrap";
import {
  AGREEDPORTION,
  PAIDTODATE,
  TOTALDEDUCTION,
  TOTALRADTOUP,
  OUTSTANDINGRADRAC,
  RADRACBALANCE,
  ACTION,
  ADD,
  DELETE,
  EDIT,
  PAYMENTDATE,
  PAYMENTAMT,
  PAYMENTTYPE,
  COMMENTS,
  CREATEDBY,
  RACDAC,
  PLUSSIGN,
} from "../../constant/FieldConstant";

import ReactTable from "../../components/ReactTable";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import radRacRecieptsservice from "../../services/Resident/radRacReciepts.service";
import AddEditReciepts from "./AddEditReciepts";

import DeleteConfirmationModelAlert from "../../components/DeleteConfirmationModelAlert";
import moment from "moment";
import AmountFormat from "../../utils/AmountFormat";
import { convertHTMLToPlain } from "../../utils/Strings";

const ViewReceipts = ({
  // getHeldByGovernmentChange,
  isContinue,
  heldByGovernmentValue,
  refundComplete,
  getCancelData,
  handleIsAdded,
  callbackIsUnsavedData,
  heldByGovernmentSaved,
}) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [radId, setRadID] = useState(undefined);
  const [reciepts, setReciepts] = useState([]);
  const [recieptsCpy, setRecieptsCpy] = useState([]);
  const [cancelData, setCancelData] = useState([]);

  const [radRacPaidToDate, setradRacPaidToDate] = useState(undefined);
  const [totalDeductionFromRadRac, settotalDeductionFromRadRac] = useState(
    undefined
  );
  const [totalRadTopUp, settotalRadTopUp] = useState(undefined);
  const [agreedRadRacPortion, setagreedRadRacPortion] = useState(undefined);
  const [outstandingRadRac, setoutstandingRadRac] = useState(undefined);
  const [radRacBalance, setradRacBalance] = useState(undefined);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [isPartiallySupported, setisPartiallySupported] = useState(false);
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const heldByGovValue = localStorage.getItem("FundHeldByGov");
  const [heldByGovernment, setheldByGovernment] = useState(
    Number(heldByGovValue) === 0 ? "" : heldByGovValue
  );
  const radID = localStorage.getItem("PaymentRadId");
  const [isUnsavedData, setIsUnsavedData] = useState(false);

  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});

  useEffect(() => {
    getallRadRacReciepts("firstCall");
    setheldByGovernment(Number(heldByGovValue) === 0 ? "" : heldByGovValue);
  }, []);

  useEffect(() => {
    setheldByGovernment(Number(heldByGovValue) === 0 ? "" : heldByGovValue);
  }, [heldByGovernmentSaved]);

  useEffect(() => {
    callbackIsUnsavedData(isUnsavedData);
  }, [isUnsavedData]);

  useEffect(() => {
    getCancelData(cancelData);
  }, [cancelData]);

  const getallRadRacReciepts = (firstCall) => {
    setIsUnsavedData(false);
    setheldByGovernment(Number(heldByGovValue) === 0 ? "" : heldByGovValue);
    const radId = localStorage.getItem("PaymentRadId");
    console.log("*****radId", radId);
    setLoading(true);
    radRacRecieptsservice
      .getRadRacReciepts(radId)
      .then((response) => {
        console.log("getRadRacReciepts response", response.result);
        setReciepts(response.result.radRacReceiptsResponseModelList);
        if (firstCall == "firstCall") {
          setRecieptsCpy(response.result.radRacReceiptsResponseModelList);
        }
        setLoading(false);
        setRadID(response.result.radId);
        setagreedRadRacPortion(response.result.agreedRadRacPortion);
        setradRacPaidToDate(response.result.radRacPaidToDate);
        settotalDeductionFromRadRac(response.result.totalDeductionFromRadRac);
        settotalRadTopUp(response.result.totalRadTopUp);
        setoutstandingRadRac(response.result.outstandingRadRac);
        setradRacBalance(response.result.radRacBalance);
        setisPartiallySupported(response.result.isPartiallySupported);
        localStorage.setItem("FundHeldByGovCpy", null);
        localStorage.setItem("FundHeldByGov", response.result.heldByGovernment);
        if (localStorage.getItem("FundHeldByGovCpy") === null) {
          setheldByGovernment(
            Number(response.result.heldByGovernment) === 0
              ? ""
              : response.result.heldByGovernment
          );
        } else {
          setheldByGovernment(
            Number(localStorage.getItem("FundHeldByGovCpy")) === 0
              ? ""
              : response.result.heldByGovernment
          );
        }
      })
      .catch((error) => {
        console.log("getRadRacReciepts error", error);
        setLoading(false);
      });
  };

  const DeleteAddtionalServices = (item) => {
    setType("DELETE");
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: "RAD / RAC Receipt",
      message: "RAD / RAC Receipt",
    });
    setSelectedRowData(item);
  };

  const deleteConfirmationCallBack = (childdata, success) => {
    setShowDeleteConfirmationModal(childdata);
    const radRacReceiptId = selectedRowData.id;
    if (success) {
      radRacRecieptsservice
        .deleteRadRacReciept(radRacReceiptId, radId)
        .then((response) => {
          console.log("deleteRadRacReciept response", response.result);
          callBackAddEditFormToViewForm(false, true, response.message);
        })
        .catch((error) => {
          console.log("deleteRadRacReciept error", error);
          callBackAddEditFormToViewForm(false, true, error.message);
        });
    }
  };

  const callBackAddEditFormToViewForm = (isFormVisible, success, msg) => {
    setShowAddEditForm(isFormVisible);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        //actionType:DELETE,
        actionType: type === "EDIT" ? EDIT : type === "ADD" ? ADD : DELETE,
        msg: msg,
        callback: () => {
          setShowSuccessAlert(false);
          getallRadRacReciepts();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const handleAddPayment = () => {
    setData({});
    setShow(true);
    setType("ADD");
  };

  const handleEditPayment = (cell) => {
    setShow(true);
    setType("EDIT");
    setData(cell);
  };

  const handleModalClose = () => {
    setShow(false);
    setData({});
  };

  const UpdateCancelCallback = (updatedRecordID) => {
    console.log("UpdateCancelCallback in Receipts", updatedRecordID);

    if (recieptsCpy && recieptsCpy.length > 0) {
      const foundItem = recieptsCpy.find((ob) => ob.id === updatedRecordID);
      console.log("foundItem", foundItem);

      foundItem.radId = parseInt(radID);
      foundItem.type = foundItem.typeId;
      foundItem.comment = foundItem.comments;

      delete foundItem.typeId;
      delete foundItem.createdBy;
      delete foundItem.comments;
      delete foundItem.isUpdated;
      delete foundItem.modifiedBy;

      console.log("foundItem", foundItem);

      if (cancelData && cancelData.length > 0) {
        setCancelData([...cancelData, foundItem]);
      } else {
        setCancelData([foundItem]);
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
            onClick={() => handleEditPayment(cell)}
          >
            <img src={Icon} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => DeleteAddtionalServices(cell)}>
            <img src={Icon} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  const getFee = (cell) => {
    const newFormat = AmountFormat(cell.paymentAmount);
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

  const columns = React.useMemo(() => [
    {
      Header: "",
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "6.10%",
    },
    {
      Header: PAYMENTDATE,
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
      width: "15%",
    },
    {
      Header: PAYMENTAMT,
      // Filter: false,
      disableSortBy: true,
      accessor: getFee,
      width: "15%",
    },
    {
      Header: PAYMENTTYPE,
      accessor: (d) => d.type,
      width: "18%",
    },
    {
      Header: COMMENTS,
      accessor: (d) => d.comments,
      Cell: GetDescription,
      width: "30%",
    },
    {
      Header: CREATEDBY,
      accessor: (d) => d.createdBy,
      width: "20%",
    },
  ]);

  const ReceiptsList = React.useMemo(() => reciepts);
  return (
    <div>
      {loading ? (
        <Loader></Loader>
      ) : (
        <>
          <Page title="">
            <div className="head mt-3">
              <img src={Icon} className="icon" />
              RAD / RAC Receipt Details
            </div>
            <hr className="headerBorder" />
            <p style={{ marginLeft: "10px" }}>
              This section records the RAD / RAC Transactions of the Resident
              towards the Facility.
            </p>
            <Row>
              <Card
                className="col-4 mb-4 "
                style={{
                  marginLeft: "1rem",
                  backgroundColor: refundComplete ? "#d3d3d378" : "",
                }}
              >
                <div className="head mt-2" style={{ marginLeft: "1rem" }}>
                  RAD / RAC Receipt Details
                </div>

                <div className="d-flex mt-2 mb-4 ">
                  <div className="col-4" style={{ marginRight: "1rem" }}>
                    <p className="mt-2 text-end">{AGREEDPORTION}</p>
                  </div>
                  <div className="col-7">
                    <NumberFormat
                      thousandSeparator={true}
                      prefix={"$"}
                      // maxLength={17}
                      fixedDecimalScale={2}
                      allowNegative={true}
                      decimalScale={2}
                      name="price"
                      id="entryFeeTxtt"
                      value={agreedRadRacPortion}
                      placeholder="$0.00"
                      // onBlur={handleBlur}
                      // onChange={onPriceChange}
                      className="text form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="d-flex mb-4" style={{ marginTop: "-1rem" }}>
                  <div className="col-4" style={{ marginRight: "1rem" }}>
                    <p className="mt-2 text-end"> {PAIDTODATE} </p>
                  </div>
                  <div className="col-7">
                    <NumberFormat
                      thousandSeparator={true}
                      value={radRacPaidToDate}
                      prefix={"$"}
                      // maxLength={17}
                      fixedDecimalScale={2}
                      allowNegative={true}
                      decimalScale={2}
                      name="price"
                      id="entryFeeTxtt"
                      placeholder="$0.00"
                      // onBlur={handleBlur}
                      // onChange={onPriceChange}
                      className="text form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="d-flex mb-4" style={{ marginTop: "-1rem" }}>
                  <div className="col-4" style={{ marginRight: "1rem" }}>
                    <p className="mt-2 text-end"> {TOTALDEDUCTION} </p>
                  </div>
                  <div className="col-7">
                    <NumberFormat
                      value={totalDeductionFromRadRac}
                      thousandSeparator={true}
                      prefix={"$"}
                      // maxLength={17}
                      fixedDecimalScale={2}
                      allowNegative={true}
                      decimalScale={2}
                      name="price"
                      id="entryFeeTxtt"
                      placeholder="$0.00"
                      // onBlur={handleBlur}
                      // onChange={onPriceChange}
                      className="text form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="d-flex mb-4" style={{ marginTop: "-1rem" }}>
                  <div className="col-4" style={{ marginRight: "1rem" }}>
                    <p className="mt-2 text-end"> {TOTALRADTOUP} </p>
                  </div>
                  <div className="col-7">
                    <NumberFormat
                      value={totalRadTopUp}
                      thousandSeparator={true}
                      prefix={"$"}
                      // maxLength={17}
                      fixedDecimalScale={2}
                      allowNegative={true}
                      decimalScale={2}
                      name="price"
                      id="entryFeeTxtt"
                      placeholder="$0.00"
                      // onBlur={handleBlur}
                      // onChange={onPriceChange}
                      className="text form-control"
                      disabled
                    />
                  </div>
                </div>

                <div
                  className="col-12"
                  style={{
                    // marginLeft: "-12px",
                    marginTop: "-2rem",
                    marginBottom: "-1rem",
                  }}
                >
                  <hr />
                </div>

                <div className="d-flex mb-4" style={{ marginTop: "1rem" }}>
                  <div className="col-4" style={{ marginRight: "1rem" }}>
                    <p className="mt-2 text-end" style={{ fontWeight: "bold" }}>
                      {" "}
                      {OUTSTANDINGRADRAC}
                    </p>
                  </div>
                  <div className="col-7">
                    <NumberFormat
                      thousandSeparator={true}
                      prefix={"$"}
                      // maxLength={17}
                      fixedDecimalScale={2}
                      allowNegative={true}
                      decimalScale={2}
                      name="price"
                      id="entryFeeTxtt"
                      value={outstandingRadRac}
                      placeholder="$0.00"
                      // onBlur={handleBlur}
                      // onChange={onPriceChange}
                      className="text form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="d-flex mb-4" style={{ marginTop: "-1rem" }}>
                  <div className="col-4" style={{ marginRight: "1rem" }}>
                    <p className="mt-2 text-end" style={{ fontWeight: "bold" }}>
                      {RADRACBALANCE}
                    </p>
                  </div>
                  <div className="col-7">
                    <NumberFormat
                      thousandSeparator={true}
                      prefix={"$"}
                      // maxLength={17}
                      fixedDecimalScale={2}
                      allowNegative={true}
                      decimalScale={2}
                      name="price"
                      id="entryFeeTxtt"
                      value={radRacBalance}
                      placeholder="$0.00"
                      // onBlur={handleBlur}
                      // onChange={onPriceChange}
                      className="text form-control"
                      disabled
                    />
                  </div>
                </div>
              </Card>

              <Card
                className="col-4 mb-4"
                style={{
                  marginLeft: "1.5rem",
                  height: "8rem",
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                  backgroundColor: refundComplete ? "#d3d3d378" : "",
                }}
              >
                <div className="head mt-2">Funds held by the Government</div>
                <div className="d-flex mt-2 mb-4 ">
                  <div className="col-5">
                    <p className="mt-2"> {RACDAC} </p>
                  </div>

                  <div className="col-7">
                    <NumberFormat
                      thousandSeparator={true}
                      prefix={"$"}
                      // maxLength={7}
                      // maxLength={parseFloat(heldByGovernment) == 0 ? 14 : 16}
                      fixedDecimalScale={2}
                      allowNegative={true}
                      decimalScale={2}
                      name="price"
                      id="entryFeeTxtt"
                      value={
                        heldByGovernment
                        // localStorage.getItem("FundHeldByGovCpy")
                        //   ? Number(localStorage.getItem("FundHeldByGovCpy")) ===
                        //     0
                        //     ? ""
                        //     : localStorage.getItem("FundHeldByGovCpy")
                        //   : localStorage.getItem("FundHeldByGov")
                      }
                      placeholder="$0.00"
                      onValueChange={(e) => {
                        // if (heldByGovernment !== Number(e.value)) {
                        localStorage.setItem("FundHeldByGovCpy", e.value);
                        setheldByGovernment(e.value);
                        if (heldByGovernment !== Number(e.value)) {
                          setIsUnsavedData(true);
                        } else {
                          setIsUnsavedData(false);
                        }
                        // } else {
                        //   setIsUnsavedData(false);
                        //   //callbackIsUnsavedData(false);
                        // }
                      }}
                      className="text form-control"
                    />
                  </div>
                </div>
              </Card>
            </Row>

            <div className="mt-2">
              <Button
                variant="light"
                className="addbtn btnfix btn btn-primary m-2 mt-2 btnright"
                style={{ marginRight: "130px" }}
                onClick={handleAddPayment}
              >
                {PLUSSIGN} Add Payment
              </Button>

              <Button
                variant="light"
                className="addbtn btnfix btn btn-primary btnright disabled mt-2"
                style={{ marginRight: "130px" }}
              >
                Print Receipt
              </Button>
            </div>

            <ReactTable
              columns={columns}
              data={ReceiptsList}
              rowProps={(row) => ({
                onClick: () => alert(JSON.stringify(row.values)),
                style: {
                  cursor: "pointer",
                },
              })}
            />

            {showSuccessAlert && (
              <SuccessAlert
                type={successAlertOptions.actionType}
                msg={successAlertOptions.msg}
                title={successAlertOptions.title}
                callback={successAlertOptions.callback}
              ></SuccessAlert>
            )}

            <AddEditReciepts
              actionType={type}
              Data={data}
              ShowModel={show}
              handleModalClose={handleModalClose}
              callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
              UpdateCancelCallback={UpdateCancelCallback}
              getallRadRacReciepts={getallRadRacReciepts}
              radId={radId}
              agreedRadRacPortion={agreedRadRacPortion}
              outstandingRadRac={outstandingRadRac}
              radRacBalance={radRacBalance}
              radRacPaidToDate={radRacPaidToDate}
              totalRadTopUp={totalRadTopUp}
              totalDeductionFromRadRac={totalDeductionFromRadRac}
              handleIsAdded={handleIsAdded}
            />

            <DeleteConfirmationModelAlert
              ShowDeleteModal={showDeleteConfirmationModal}
              Data={deleteConfirmationModalData}
              deleteConfirmationCallBack={deleteConfirmationCallBack}
              title={DELETE + " " + "Payment"}
            ></DeleteConfirmationModelAlert>
          </Page>
        </>
      )}
    </div>
  );
};

export default ViewReceipts;
