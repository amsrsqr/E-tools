import React, { useState, useEffect } from "react";
import {
  ACTION,
  ADD,
  ALLCHARGEREC,
  DELETE,
  EDIT,
  INFO,
} from "../../../../constant/FieldConstant";
import {
  ADDALLCHARGE,
  ALLCHARGEDESC,
  UPDATEALLCHARGE,
} from "../../../../constant/MessageConstant";
import getAllList from "../../../../services/Resident/allCharges.service";
import Icon from "../../../../../src/assets/Images/icon.png";
import Loader from "../../../../components/Loader";
import Page from "../../../../components/Page";
import WarningMessageModelAlert from "../../../../components/WarningMessageModelAlert";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import { Card, Button } from "reactstrap";
import Select from "react-select";
import ReactTable from "../../../../components/ReactTable";
import AmountFormat from "../../../../utils/AmountFormat";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import moment from "moment";
import AddEditAllCharges from "./AddEditAllCharges";
import SuccessAlert from "../../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../../components/DeleteConfirmationModelAlert";
import { convertHTMLToPlain } from "../../../../utils/Strings";

const ViewAllCharges = ({
  oldBondId,
  handleCancelInTabs1,
  handleCancelOnAdd1,
}) => {
  const [loading, setLoading] = useState(false);
  const [allCharge, setAllCharge] = useState([]);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [actionType, setActionType] = useState();
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [typeList, setTypeList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    id: 257,
    label: "Interest Charge",
  });
  const [DisplayInfo, setDisplayInfo] = useState("Interest");

  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [newBondId, setNewBondId] = useState(0);
  const [title, setTitle] = useState([]);
  const [totalCharge, setTotalCharge] = useState(0);
  const [chargePaid, setChargePaid] = useState(0);
  const [totalOutStanding, setTotalOutstanding] = useState(0);

  const [totalXCharge, setTotalXCharge] = useState(0);
  const [chargeXPaid, setChargeXPaid] = useState(0);
  const [totalXOutStanding, setTotalXOutstanding] = useState(0);
  const [retentionAmount, setretentionAmount] = useState(0);

  const [bondTypeListCpy, setBondTypeListCpy] = useState([]);
  const [cancelData, setCancelData] = useState([]);

  useEffect(() => {
    handleCancelInTabs1(cancelData);
  }, [cancelData]);

  useEffect(() => {
    setNewBondId(oldBondId);
  }, [oldBondId]);

  useEffect(() => {
    if (newBondId) {
      getAllCharges(
        newBondId,
        selectedCategory.id,
        selectedCategory.label,
        "firstCall"
      );
    }
  }, [newBondId]);

  useEffect(() => {
    getAllList
      .getDeductionType()
      .then((response) => {
        const result1 = response.filter((val) => val.deductionTypeId == 5);
        const result = result1.map((x) => {
          x.label = x.bondDeductionType;
          x.value = x.id;
          return x;
        });
        setTypeList(result);
      })
      .catch(() => {});

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

  const getAllCharges = (
    bondId,
    deductionTypeId,
    typeofcharge,
    isFirstCall
  ) => {
    getAllList
      .getAllChargesReceipts(bondId, deductionTypeId)
      // .getAllChargesReceipts(166, 25)
      .then((response) => {
        setLoading(false);
        setDisplayInfo(typeofcharge);
        setAllCharge(response.bondAllChargesList);

        setTotalCharge(response.totalCharges);
        setChargePaid(response.totalChargesPaid);
        setTotalOutstanding(response.totalChargesOutstanding);

        setTotalXCharge(response.charges);
        setChargeXPaid(response.chargesPaid);
        setTotalXOutstanding(response.outstandingCharges);

        setretentionAmount(response.retentionAmount);

        if (isFirstCall == "firstCall") {
          setBondTypeListCpy([...response.bondAllChargesList]);
        }
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
        msg: msg ? msg : actionType === EDIT ? ADDALLCHARGE : UPDATEALLCHARGE,
        callback: () => {
          setShowSuccessAlert(false);
          getAllCharges(newBondId, selectedCategory.id, selectedCategory.label);
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const handleOnDelete = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: ALLCHARGEREC,
      message: ALLCHARGEREC,
    });
    setSelectedRowData(item);
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      setLoading(true);
      getAllList.deleteCharge(newBondId, selectedRowData.id).then(
        (response) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: response.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              getAllCharges(
                newBondId,
                selectedCategory.id,
                selectedCategory.label
              );
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

  // "id": 0,
  //     "bondId": 0,
  //     "paymentTypeId": 0,
  //     "transactionCount": 0,
  //     "paymentAmount": 0,
  //     "paymentDate": "2022-06-01T14:21:49.507Z",
  //     "comment": "string"

  const UpdateCancelCallback = (updatedRecordID) => {
    if (bondTypeListCpy && bondTypeListCpy.length > 0) {
      const foundItem = bondTypeListCpy.find((ob) => ob.id === updatedRecordID);

      foundItem.bondId = newBondId;
      foundItem.paymentTypeId = foundItem.paymentTypeId;
      foundItem.transactionCount = foundItem.transactionCount;
      foundItem.paymentAmount = foundItem.paymentAmount;
      foundItem.paymentDate = foundItem.paymentDate;
      foundItem.comment = foundItem.comments;

      delete foundItem.createdBy;
      delete foundItem.modifiedBy;
      delete foundItem.isUpdated;
      delete foundItem.paymentType;
      delete foundItem.comments;

      if (cancelData && cancelData.length > 0) {
        setCancelData([...cancelData, foundItem]);
      } else {
        setCancelData([foundItem]);
      }
    }
  };

  const selectStyle = {
    control: (base, state) => ({
      ...base,
      //border: 1,
      // This line disable the blue border
      // boxShadow: state.isFocused ? "0px 0px 0px 5px #c2dbfe !important" : 0,
      //   '&:hover': {
      //     border: 0,
      //     boxShadow: "0px 0px 0px 5px #c2dbfe !important"
      //  },
    }),
  };
  const reactSelectTheme = (error) => (theme) => {
    const errorStyling = error
      ? {
          neutral50: "#dc3545",
          neutral30: "#dc3545",
          neutral20: "#dc3545",
          neutral60: "#dc3545",
        }
      : {};

    return {
      ...theme,
      colors: {
        ...theme.colors,
        ...errorStyling,
      },
    };
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

  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "7%",
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
        width: "20%",
      },
      {
        Header: "Payment Amount",
        disableSortBy: true,
        accessor: getFee,
        width: "20%",
      },
      {
        Header: "Payment Type",
        accessor: (d) => d.paymentType,
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

  const viewDataList = React.useMemo(() => allCharge);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="All Charge">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {" All Charges Receipt Details "}
            &nbsp;
            <i
              className="fa fa-info-circle fa-sm mt-1"
              onClick={() =>
                onHandleMessage(INFO, "Deduction Rules ", ALLCHARGEDESC.TEXT)
              }
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <hr className="headerBorder" />
          <p>
            This section records the Bond Transactions of the Resident towards
            the Facility.
          </p>
          <div className="row ">
            <Card className="col-4 " style={{ height: "5%" }}>
              <div className="col-4 mt-2 text-end">
                <p className="offset-1 fw-bold "> Charges Receipt Details</p>
              </div>
              <div className="d-flex mt-2 ">
                <div className="col-4 text-end mt-2">
                  <p> Total Charges</p>
                </div>
                <div className="col-6" style={{ marginLeft: "20px" }}>
                  <NumberFormat
                    thousandSeparator={true}
                    prefix={"$"}
                    placeholder="$0.00"
                    allowNegative={true}
                    name="totalCharges"
                    id="totalCharges"
                    // maxLength={17}
                    style={{ alignText: "right" }}
                    value={totalCharge ? totalCharge : ""}
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
                  <p className="mt-2"> Total Charges Paid</p>
                </div>
                <div className="col-6 " style={{ marginLeft: "20px" }}>
                  <NumberFormat
                    thousandSeparator={true}
                    prefix={"$"}
                    placeholder="$0.00"
                    allowNegative={true}
                    name="chargePaid"
                    id="chargePaid"
                    // maxLength={17}
                    style={{ alignText: "right" }}
                    value={chargePaid ? chargePaid : ""}
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
                  <p className=" mt-2 fw-bold">Total Charges Outstanding</p>
                </div>
                <div className="col-6" style={{ marginLeft: "20px" }}>
                  <NumberFormat
                    thousandSeparator={true}
                    prefix={"$"}
                    placeholder="$0.00"
                    allowNegative={true}
                    name="totalOutStanding"
                    id="totalOutStanding"
                    // maxLength={17}
                    style={{ alignText: "right" }}
                    value={totalOutStanding ? totalOutStanding : ""}
                    fixedDecimalScale={2}
                    decimalScale={2}
                    decimalSeparator="."
                    className="form-control fw-bold"
                    disabled={true}
                  />
                </div>
              </div>
            </Card>
            <Card className="col-4 mb-4 " style={{ marginLeft: "6%" }}>
              <div className="col-4 mt-2 text-end">
                <p className="offset-1 fw-bold "> Other Charge Details</p>
              </div>
              <div className="d-flex mt-2 ">
                <div className="col-4 text-end mt-2">
                  <p> Display Info On</p>
                </div>
                <div className="col-6" style={{ marginLeft: "20px" }}>
                  <Select
                    name="deductionTypeId"
                    placeholder="Select...."
                    options={typeList}
                    isOptionSelected={(x) => {
                      return selectedCategory && x.id === selectedCategory.id
                        ? x
                        : null;
                    }}
                    onChange={(selected) => {
                      getAllCharges(newBondId, selected.id, selected.label);
                      setSelectedCategory({
                        id: selected.id,
                        label: selected.label,
                      });
                    }}
                    defaultValue={selectedCategory}
                    styles={selectStyle}
                    isSearchable={typeList.length < 5 ? false : true}
                  />
                </div>
              </div>
              <div className="d-flex  ">
                <div className="col-4 text-end">
                  <p className="mt-2"> Total {DisplayInfo}</p>
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
                    value={totalXCharge ? totalXCharge : ""}
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
                  <p className="mt-2"> Total {DisplayInfo} Paid</p>
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
                    value={chargeXPaid ? chargeXPaid : ""}
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
                  <p className=" mt-2 fw-bold"> Outstanding {DisplayInfo}</p>
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
                    value={totalXOutStanding ? totalXOutStanding : ""}
                    fixedDecimalScale={2}
                    decimalScale={2}
                    decimalSeparator="."
                    className="form-control fw-bold"
                    disabled={true}
                  />
                </div>
              </div>
            </Card>
          </div>
          <div className="mt-2">
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
          </div>

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
            title={DELETE + " " + ALLCHARGEREC}
          ></DeleteConfirmationModelAlert>

          <AddEditAllCharges
            type={actionType}
            data={selectedRowData}
            showModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            UpdateCancelCallback={UpdateCancelCallback}
            handleCancelOnAdd1={handleCancelOnAdd1}
            BondId={newBondId}
            retentionAmount={retentionAmount}
          />
          <ReactTable columns={columns} data={viewDataList} />
        </Page>
      )}
    </>
  );
};
export default ViewAllCharges;
