import React, { useEffect, useState } from "react";
import moment from "moment";
import Loader from "../../../components/Loader";
import { Label, Button, Row, Input } from "reactstrap";
import EOPTable from "../../../components/EOPTable";
import {
  NO,
  EOPRESIDENTID,
  EOPFIRSTNAME,
  EOPLASTNAME,
  EOPTYPE,
  EOPDEDUCTIONTYPE,
  EOPSTARTDATE,
  EOPENDDATE,
  EOPDAILYAMT,
  EOPOVERRIDEAMOUNT,
  EOPAMOUNT,
  INFO,
  FINALISED,
  SAVECHANGESFINALISED,
} from "../../../constant/FieldConstant";
import Page from "../../../components/Page";
import "../../../css/EndOfPeriodTableView.css";
import EndOfPeriodservices from "../../../services/EndOfPeriod/EndOfPeriod.services";
import {
  ENDOFPERIOD,
  MONTHLYRETENTIONS,
} from "../../../constant/MessageConstant";
// import EOPWarningMesaageModalAlert from "../../../components/EOPWarningMesaageModalAlert";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
// import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import AmountFormat from "../../../utils/AmountFormat";
import SuccessAlert from "../../../components/SuccessAlert";
import EopInfoModal from "../../../components/EopInfoModal";
// import ArchiveConfirmationModelAlert from "../../../components/EopInfoModal";
import BasicDailyFeesWarning from "../../../components/BasicDailyFeesWarning";
import DirtyWarningAlert from "../../../components/DirtyWarningAlert";
import WarningMessageModelAlert from "../../../components/WarningMessageModelAlert";
import { SortArrayOfObjs } from "../../../utils/ArrayFun";

const IsUpdateConfirmedCheckbox = ({ cell, isUpdatedConfirmCallback }) => {
  const [isChecked, setIsChecked] = useState(cell.updateConfirmed);

  useEffect(() => {
    setIsChecked(cell.updateConfirmed);
  }, [cell]);

  return (
    <>
      <Input
        className=""
        style={{ display: "flex", margin: "auto" }}
        type="checkbox"
        value={isChecked}
        onChange={(e) => {
          setIsChecked(e.currentTarget.checked);
          isUpdatedConfirmCallback(e.currentTarget.checked, cell.id);
        }}
        disabled={cell.isFinalised ? true : false}
        checked={isChecked}
      ></Input>
    </>
  );
};

const OverRideAmountComponent = ({
  cell,
  callBackOverRideAmount,
  isFinalised,
  callBackOverRideAmountIsChecked,
  isFinalisedInvoice,
}) => {
  const [isChecked, setIsChecked] = useState(cell.isOverRideChecked);
  const [changeValue, setChangeValue] = useState(cell.overRideAmount);

  useEffect(() => {
    setChangeValue(cell.overRideAmount ? cell.overRideAmount : null);
    setIsChecked(cell.isOverRideChecked);
  }, [cell]);

  useEffect(() => {
    // if (!isChecked) {
    setChangeValue(changeValue);
    setIsChecked(isChecked);
    // }
  }, [isChecked]);

  return (
    <>
      <div
        className={
          isFinalisedInvoice
            ? "  d-flex justify-content-center  align-items-center"
            : "  d-flex justify-content-center  align-items-center"
        }
      >
        <Input
          type="checkbox"
          name="isOverridePrice"
          onChange={(e) => {
            setIsChecked(e.currentTarget.checked);
            // console.log("inn  checked....", e.currentTarget.checked);
            callBackOverRideAmountIsChecked(e.currentTarget.checked, cell);
          }}
          disabled={cell.isFinalised}
          style={{ width: "1.5em" }}
          checked={isChecked}
        />
        <Label
          style={{ width: "8px", marginTop: "-14px", marginRight: "-7px" }}
          column
          sm={2}
          className={
            cell.isOverRideAmountValid ? "" : "is-invalid-label required-field"
          }
        ></Label>

        <NumberFormat
          name="overridePrice"
          id="overridePrice"
          placeholder="$0.00"
          thousandSeparator={true}
          prefix={"$"}
          // maxLength={17}
          allowNegative={true}
          disabled={
            isChecked === true && isFinalised !== "Finalised" ? false : true
          }
          fixedDecimalScale={2}
          decimalScale={2}
          value={changeValue ? changeValue : ""}
          className={
            "text form-control w-75" +
            (cell.isOverRideAmountValid ? "" : " is-invalid")
          }
          onValueChange={(values) => {
            const { formattedValue, value } = values;
            setChangeValue(value);
            callBackOverRideAmount(value, cell);
          }}
          style={{
            display: "flex",
            marginLeft: "10px",
            height: "2rem",
            width: "7rem",
            marginTop: "4px",
          }}
        />
      </div>
    </>
  );
};

const EndOfPeriodTableView = ({
  selectedFacilityId,
  selectedPeriod,
  selectedFacility,
  setSomthingChanged,
  checkisFinalizedCallBack,
}) => {
  const [loading, setLoading] = useState(false);
  const [inVoiceList, setInVoiceList] = useState([]);
  const [tempArray, setTempArray] = useState([]);
  const [deductionTotals, setDeductionTotals] = useState([]);
  const [isFinalisedInvoice, setIsFinalisedInvoice] = useState(undefined);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [title, setTitle] = useState([]);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFinaliseConfirm, setShowFinaliseConfirm] = useState(false);
  const [cannotFinalizeError, setCannotFinalizeError] = useState(false);
  const [warningAlertOptions, setWarningAlertOptions] = useState({});
  const [checkerAll, setCheckerAll] = useState(false);
  // const [checkingFinalize, setCheckingFinalize] = useState(false);
  const [IsUpdated, setIsUpdated] = useState(false);
  const [type, setType] = useState();
  useEffect(() => {
    if (selectedFacilityId !== undefined && selectedPeriod !== undefined) {
      getEOMList();
    }
  }, [selectedFacilityId, selectedPeriod]);

  useEffect(() => {
    if (JSON.stringify(inVoiceList) === JSON.stringify(tempArray)) {
      setSomthingChanged(false);
      setIsUpdated(false);
    } else {
      setSomthingChanged(true);
      setIsUpdated(true);
    }
  }, [inVoiceList, tempArray]);

  const getEOMList = () => {
    // console.log("Calling Api getEOMList in table view");
    setLoading(true);
    let facilityId = selectedFacilityId;
    let startDate = selectedPeriod.startDate;
    let endDate = selectedPeriod.endDate;
    let numberIncremntal = 0;
    EndOfPeriodservices.getEopAsPerFacility(facilityId, startDate, endDate)
      .then((response) => {
        setLoading(false);
        if (response && response.result.eoMLists) {
          const addIsChecked = SortArrayOfObjs(
            response.result.eoMLists,
            "id",
            "asc"
          ).map((z, i) => {
            const tmpObj = { ...z };
            tmpObj.srNo = i + 1;
            tmpObj.updateConfirmed = tmpObj.updateConfirmed
              ? tmpObj.updateConfirmed
              : false;
            tmpObj.isOverRideChecked = tmpObj.isOverRideChecked ? true : false;
            tmpObj.overRideAmount = tmpObj.overRideAmount
              ? tmpObj.overRideAmount
              : 0;
            tmpObj.isUpdated = undefined;
            tmpObj.isOverRideAmountValid =
              tmpObj.isOverRideChecked && tmpObj.overRideAmount === 0
                ? false
                : true;
            tmpObj.cpyResidentId = z.residentId;
            tmpObj.cpyLastName = z.lastName;
            tmpObj.cpyFirstName = z.firstName;

            if (i === 0) {
              numberIncremntal = i + 1;
              tmpObj.RowColorNo = numberIncremntal;
            } else {
              if (
                tmpObj.residentId ===
                response.result.eoMLists[i - 1]?.residentId
              ) {
                tmpObj.RowColorNo = numberIncremntal;
              } else {
                numberIncremntal = numberIncremntal + 1;
                tmpObj.RowColorNo = numberIncremntal;
              }
            }

            tmpObj.RowColor = "";

            if (tmpObj.updateConfirmed && tmpObj.isFinalised == false) {
              tmpObj.RowColor = "white";
            } else {
              if (tmpObj.isFinalised) {
                if (tmpObj.RowColorNo % 2 === 0) tmpObj.RowColor = "#bdd0bf";
                else tmpObj.RowColor = "#c7dbc9";
              } else {
                if (tmpObj.RowColorNo % 2 === 0) tmpObj.RowColor = "#f1b6c1";
                else tmpObj.RowColor = "#fec0cb";
              }
            }
            if (tmpObj.id === response.result.eoMLists[i - 1]?.id) {
              tmpObj.cpyFirstName = "";
              tmpObj.cpyLastName = "";
              tmpObj.cpyResidentId = "";
            }
            return tmpObj;
          });

          console.log("addIsChecked", addIsChecked);
          setInVoiceList(addIsChecked);
          setTempArray(JSON.parse(JSON.stringify(addIsChecked)));
          setLoading(false);
          setDeductionTotals(response.result.deductionTotals);
          setIsFinalisedInvoice(response.result.isFinalised);
        } else {
          setInVoiceList([]);
          setTempArray([]);
          setDeductionTotals([]);
          setIsFinalisedInvoice(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setInVoiceList([]);
        setTempArray([]);
        setDeductionTotals([]);
        setIsFinalisedInvoice(false);
      });
  };

  const postEOMList = (updatedArray) => {
    setLoading(true);
    EndOfPeriodservices.finailizeEopAsPerFacility(updatedArray)
      .then((response) => {
        // console.log("response from finalied ", response);
        setSuccessAlertOptions({
          title: "",
          actionType: FINALISED,
          msg: "Your End of Period has been finalised successfully",
          callback: () => {
            setShowSuccessAlert(false);
          },
        });
        checkisFinalizedCallBack(selectedPeriod);
        getEOMList();
        setShowSuccessAlert(true);
        setLoading(false);
        setIsUpdated(false);
        setSomthingChanged(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const saveChanges = () => {
    if (inVoiceList.length > 0) {
      setType(SAVECHANGESFINALISED);
      let Obj = inVoiceList.map((invoice) => {
        let updatedObj = {
          id: invoice.guidId,
          radId: invoice.radId,
          residentId: invoice.id,
          deedVariationId: invoice.deedVariationId,
          deductionTypeId: invoice.deductionTypeId,
          startDate: invoice.startDate,
          endDate: invoice.endDate,
          amount: invoice.amount,
          dailyAmount: invoice.dailyAmount,
          overRideAmount: invoice.overRideAmount ? invoice.overRideAmount : 0,
          supportedCategoryId: invoice.supportedCategoryId,
          isFinalised: false,
          type: invoice.type,
          deductionType: invoice.deductionType,
          isUpdateConfirmed: invoice.updateConfirmed,
          dailyCareFeeId: invoice.dailyCareFeeId,
          radRacReceiptId: invoice.radRacReceiptId,
          otherDeductionId: invoice.otherDeductionId,
          dapDacChargesId: invoice.dapDacChargesId,
          dacDacDeductionId: invoice.dacDacDeductionId,
          additionalRuleId: invoice.additionalRuleId,
          isBond: invoice.isBond,
        };

        return updatedObj;
      });

      let checker = (arr) => arr.every((v) => v === true);
      var isOverRideAmountValid = inVoiceList.map((invoice) => {
        if (invoice.isOverRideAmountValid === true) {
          return true;
        } else {
          return false;
        }
      });

      if (checker(isOverRideAmountValid)) {
        setLoading(true);
        EndOfPeriodservices.finailizeEopAsPerFacility(Obj)
          .then((response) => {
            setSuccessAlertOptions({
              title: "",
              actionType: SAVECHANGESFINALISED,
              msg: "Your data has been saved successfully.",
              callback: () => {
                setShowSuccessAlert(false);
                setIsUpdated(false);
                setSomthingChanged(false);
              },
            });
            setShowSuccessAlert(true);
            getEOMList();
            setLoading(false);
            // setIsUpdated(false);
            // setSomthingChanged(false);
          })
          .catch((error) => {
            setLoading(false);
          });
      }
    } else {
    }
  };

  const finaliseConfrimationCallback = () => {
    setShowFinaliseConfirm(false);
    var checking = inVoiceList.map((invoice) => {
      if (invoice.updateConfirmed || invoice.isOverRideChecked) {
        var updatedObj = {
          id: invoice.guidId,
          radId: invoice.radId,
          residentId: invoice.id,
          deedVariationId: invoice.deedVariationId,
          deductionTypeId: invoice.deductionTypeId,
          startDate: invoice.startDate,
          endDate: invoice.endDate,
          amount: invoice.amount,
          slotStartDate: selectedPeriod.startDate,
          slotEndDate: selectedPeriod.endDate,
          dailyAmount: invoice.dailyAmount,
          overRideAmount: parseInt(invoice.overRideAmount),
          supportedCategoryId: invoice.supportedCategoryId,
          isFinalised: true,
          type: invoice.type,
          deductionType: invoice.deductionType,
          isUpdateConfirmed: true,
          dailyCareFeeId: invoice.dailyCareFeeId,
          radRacReceiptId: invoice.radRacReceiptId,
          otherDeductionId: invoice.otherDeductionId,
          dapDacChargesId: invoice.dapDacChargesId,
          dacDacDeductionId: invoice.dacDacDeductionId,
          additionalRuleId: invoice.additionalRuleId,
          isBond: invoice.isBond,
        };
      }
      return updatedObj;
    });

    setType(FINALISED);
    postEOMList(checking);
  };

  const handleIsFinalized = () => {
    if (inVoiceList.length > 0) {
      // setCheckingFinalize(true);
      let checker = (arr) => arr.every((v) => v === true);
      if (checkerAll && checker(checkerAll)) {
        setShowFinaliseConfirm(true);
      } else {
        setCannotFinalizeError(true);
        setWarningAlertOptions({
          title: "Error",
          msg: (
            <p className="text-center">
              You cannot finalise Period that contains unconfirmed updates.
              Please confirm them before continue
            </p>
          ),
          callback: (value) => {
            setCannotFinalizeError(false);
          },
        });
      }
    } else {
    }
  };

  const isUpdatedConfirmCallback = (value, cellData) => {
    const tmpInvoiceList = [...inVoiceList];
    let index = tmpInvoiceList.findIndex((m) => m.guidId === cellData.guidId);
    tmpInvoiceList[index].updateConfirmed = value ? true : false;

    //isFinalised
    if (tmpInvoiceList[index].isFinalised) {
      if (value) {
        tmpInvoiceList[index].RowColor =
          tmpInvoiceList[index].RowColorNo % 2 === 0 ? "lightgray" : "white";
      } else {
        tmpInvoiceList[index].RowColor =
          tmpInvoiceList[index].RowColorNo % 2 === 0 ? "#bdd0bf" : "#c7dbc9";
      }
    } else {
      if (value) {
        tmpInvoiceList[index].RowColor =
          tmpInvoiceList[index].RowColorNo % 2 === 0 ? "lightgray" : "white";
      } else {
        tmpInvoiceList[index].RowColor =
          tmpInvoiceList[index].RowColorNo % 2 === 0 ? "#f1b6c1" : "#fec0cb";
      }
    }

    setInVoiceList(tmpInvoiceList);
    // setIsUpdated(true);
    // setSomthingChanged(true);

    const isAllUpdatedConfirm = tmpInvoiceList.map((invoice) => {
      if (invoice.updateConfirmed === true) {
        return true;
      } else {
        return false;
      }
    });
    setCheckerAll(isAllUpdatedConfirm);
  };

  const getUpdatedConfirm = (cell) => {
    return (
      <div>
        <IsUpdateConfirmedCheckbox
          cell={cell}
          isUpdatedConfirmCallback={(val, celID) =>
            isUpdatedConfirmCallback(val, cell)
          }
        />
      </div>
    );
  };

  const getIsFinalised = (cell) => {
    return (
      <div>
        {cell.srNo}
        {!cell.isFinalised && !cell.updateConfirmed ? (
          <i
            class="fa fa-exclamation-triangle fa-error"
            aria-hidden="true"
            style={{ fontSize: "18px", marginLeft: "8px" }}
            data-toggle="tooltip"
            data-placement="right"
            title="Please Confirm Changes"
          ></i>
        ) : (
          ""
        )}
      </div>
    );
  };

  const callBackOverRideAmount = (value, cellData) => {
    const tmpinvoiceList = [...inVoiceList];
    let index = tmpinvoiceList.findIndex((m) => m.guidId === cellData.guidId);
    if (value) {
      tmpinvoiceList[index].overRideAmount = value;
      tmpinvoiceList[index].isOverRideAmountValid = value === 0 ? false : true;
      setInVoiceList(tmpinvoiceList);
      // setIsUpdated(true);
      // setSomthingChanged(true);
    } else {
      if (tmpinvoiceList[index].isOverRideChecked === true) {
        let index = tmpinvoiceList.findIndex(
          (m) => m.guidId === cellData.guidId
        );
        tmpinvoiceList[index].isOverRideAmountValid = false;
        setInVoiceList(tmpinvoiceList);
      }
    }
  };

  const callBackOverRideAmountIsChecked = (value, cellData) => {
    const tmpinvoiceList = [...inVoiceList];
    let index = tmpinvoiceList.findIndex((m) => m.guidId === cellData.guidId);
    tmpinvoiceList[index].isOverRideChecked = value;
    if (tmpinvoiceList[index].isOverRideChecked) {
      tmpinvoiceList[index].isOverRideAmountValid =
        value && cellData.overRideAmount === 0 && false;
    } else {
      tmpinvoiceList[index].isOverRideAmountValid = value === false && true;
      tmpinvoiceList[index].overRideAmount = 0;
    }
    console.log("tmpinvoiceList", tmpinvoiceList);
    setInVoiceList(tmpinvoiceList);
    // setIsUpdated(value);
    // setSomthingChanged(value);
  };

  const getOverRideAmount = (cell, Finalised) => {
    return (
      <OverRideAmountComponent
        cell={cell}
        isFinalised={Finalised}
        callBackOverRideAmount={callBackOverRideAmount}
        callBackOverRideAmountIsChecked={callBackOverRideAmountIsChecked}
        isFinalisedInvoice={isFinalisedInvoice}
      />
    );
  };

  const getDailyAmount = (cell) => {
    const newFormat = AmountFormat(cell.dailyAmount);
    return (
      <>
        {!cell.isFinalised && !cell.updateConfirmed ? (
          <div className={cell.isFinalised ? "" : "colorRed"}>{newFormat}</div>
        ) : (
          <div>{newFormat}</div>
        )}
      </>
    );
  };

  const getAmount = (cell) => {
    const newFormat = AmountFormat(cell.amount);
    return newFormat;
  };

  const viewInvoiceList = inVoiceList;

  const columns1 = [
    {
      Header: NO,
      Filter: false,
      disableSortBy: true,
      accessor: getIsFinalised,
      className: "bold",
      width: "6%",
    },
    {
      Header: EOPRESIDENTID,
      disableSortBy: true,
      accessor: (d) => d.cpyResidentId,
      width: "7%",
    },
    {
      Header: EOPFIRSTNAME,
      disableSortBy: true,
      accessor: (d) => d.cpyFirstName,
      width: "10%",
    },
    {
      Header: EOPLASTNAME,
      disableSortBy: true,
      accessor: (d) => d.cpyLastName,
      width: "10%",
    },
    {
      Header: EOPTYPE,
      disableSortBy: true,
      accessor: (d) => d.type,
      width: "10%",
    },
    {
      Header: EOPDEDUCTIONTYPE,
      disableSortBy: true,
      accessor: (d) => d.deductionType,
      width: "10%",
    },
    {
      Header: EOPSTARTDATE,
      Filter: false,
      disableSortBy: true,
      accessor: (d) =>
        moment(d.startDate)
          .local()
          .format("MM/DD/YYYY"),
      Cell: ({ cell: { value } }) => (
        <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
      ),
      width: "7%",
    },
    {
      Header: EOPENDDATE,
      Filter: false,
      disableSortBy: true,
      accessor: (d) =>
        moment(d.endDate)
          .local()
          .format("MM/DD/YYYY"),
      Cell: ({ cell: { value } }) => (
        <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
      ),
      width: "7%",
    },
    {
      Header: EOPDAILYAMT,
      disableSortBy: true,
      accessor: getDailyAmount,
      width: "9%",
    },
    {
      Header: EOPAMOUNT,
      disableSortBy: true,
      accessor: getAmount,
      width: "10%",
    },
    {
      Header: EOPOVERRIDEAMOUNT,
      disableSortBy: true,
      accessor: (cell) => getOverRideAmount(cell, "Finalised"),
      width: "13%",
    },
  ];

  const columns = [
    {
      Header: NO,
      Filter: false,
      disableSortBy: true,
      accessor: getIsFinalised,
      className: "bold",
      width: "6%",
    },
    {
      Header: EOPRESIDENTID,
      disableSortBy: true,
      accessor: (d) => d.cpyResidentId,
      width: "7%",
    },
    {
      Header: EOPFIRSTNAME,
      disableSortBy: true,
      accessor: (d) => d.cpyFirstName,
      width: "10%",
    },
    {
      Header: EOPLASTNAME,
      disableSortBy: true,
      accessor: (d) => d.cpyLastName,
      width: "10%",
    },
    {
      Header: EOPTYPE,
      disableSortBy: true,
      accessor: (d) => d.type,
      width: "10%",
    },
    {
      Header: EOPDEDUCTIONTYPE,
      disableSortBy: true,
      accessor: (d) => d.deductionType,
      width: "10%",
    },
    {
      Header: EOPSTARTDATE,
      Filter: false,
      disableSortBy: true,
      accessor: (d) =>
        moment(d.startDate)
          .local()
          .format("MM/DD/YYYY"),
      Cell: ({ cell: { value } }) => (
        <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
      ),
      width: "7%",
    },
    {
      Header: EOPENDDATE,
      Filter: false,
      disableSortBy: true,
      accessor: (d) =>
        moment(d.endDate)
          .local()
          .format("MM/DD/YYYY"),
      Cell: ({ cell: { value } }) => (
        <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
      ),
      width: "7%",
    },
    {
      Header: EOPDAILYAMT,
      disableSortBy: true,
      accessor: getDailyAmount,
      width: "7%",
    },
    {
      Header: EOPAMOUNT,
      disableSortBy: true,
      accessor: getAmount,
      width: "9%",
    },
    {
      Header: EOPOVERRIDEAMOUNT,
      disableSortBy: true,
      accessor: getOverRideAmount,
      width: "12%",
    },
    {
      Header: "Update Confirmed",
      Filter: false,
      disableSortBy: true,
      accessor: getUpdatedConfirm,
      width: "5%",
    },
  ];

  const onHandleMessage = (type, title, content) => {
    setShowWarningAlert(!showWarningAlert);
    const setNewTitle = {
      warningType: type,
      header: title,
      msg: content,
    };
    setTitle(setNewTitle);
  };

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page>
          <div
            className=" bg-white"
            style={{ padding: "1rem", marginRight: "5px" }}
          >
            {!selectedFacility && !selectedPeriod ? (
              <></>
            ) : (
              <>
                {inVoiceList && (
                  <>
                    <div class="d-flex">
                      <div class="flex-fill">
                        <div className="head d-inline-flex">
                          {selectedFacility && selectedFacility.name} {"  "} [
                          {selectedPeriod && selectedPeriod.period}:{" "}
                          {selectedPeriod && selectedPeriod.slot}] -
                          {isFinalisedInvoice ? (
                            <div
                              className="colorGreen"
                              style={{ marginLeft: "5px" }}
                            >
                              Finalised
                            </div>
                          ) : (
                            <div
                              className="colorRed"
                              style={{ marginLeft: "5px" }}
                            >
                              Not Finalised
                            </div>
                          )}
                        </div>
                      </div>
                      <div class="flex-fill"></div>
                      <div
                        class="d-flex justify-content-end align-items-end"
                        style={{ marginBottom: "-10px" }}
                      >
                        <div
                          className="d-inline-flex"
                          style={{ marginBottom: "3px" }}
                        >
                          <i
                            className="fa fa-info-circle fa-sm"
                            style={{
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            onClick={() =>
                              onHandleMessage(
                                INFO,
                                ENDOFPERIOD,
                                MONTHLYRETENTIONS.TEXT
                              )
                            }
                          ></i>
                        </div>
                        <div> What is EoP?</div>
                      </div>
                    </div>
                  </>
                )}

                {inVoiceList && (
                  <>
                    <hr className="headerBorder" />
                    <div
                      className="mt-4"
                      style={{ marginLeft: "10px", marginBottom: "1rem" }}
                    >
                      <div>
                        *Daily Amount is an indicative figure only and will be
                        truncated.
                      </div>
                      <div className="mt-1">
                        **Amount is the EOP transaction amount. It is the result
                        of the full calculation and is a rounded figure.
                      </div>
                    </div>
                  </>
                )}

                {!isFinalisedInvoice && inVoiceList && (
                  <div
                    style={{
                      backgroundColor: "pink",
                      maxWidth: "20rem",
                      width: "auto",
                      fontSize: "14px",
                      color: "purple",
                      marginLeft: "1rem",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      padding: "5px",
                      marginBottom: "2rem",
                    }}
                  >
                    <i
                      class="fa fa-exclamation-triangle fa-error"
                      aria-hidden="true"
                      style={{ fontSize: "1rem" }}
                    ></i>
                    Rows have been updated since 01/03/2021
                  </div>
                )}

                {!isFinalisedInvoice && inVoiceList ? (
                  <>
                    <Button
                      className="addbtn btnfix btn btn-light "
                      style={{
                        marginRight: "120px",
                        fontSize: "14px",
                        marginTop: "7px",
                        height: "35px",
                        borderColor: "#69696994",
                        position: "absolute",
                        right: "200px",
                      }}
                      disabled={inVoiceList && inVoiceList.length == 0}
                      onClick={saveChanges}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="light"
                      className="addbtn btnfix btn btn-secondary"
                      style={{
                        marginRight: "237px",
                        fontSize: "13px",
                        marginTop: "7px",
                        height: "35px",
                      }}
                      disabled={inVoiceList && inVoiceList.length == 0}
                    >
                      Generate Report
                    </Button>

                    <Button
                      className="addbtn btnfix btn btn-primary"
                      style={{
                        marginTop: "7px",
                        height: "35px",
                        marginRight: "5px",
                        width: "106px",
                      }}
                      onClick={handleIsFinalized}
                      disabled={inVoiceList && inVoiceList.length == 0}
                    >
                      Finalise
                    </Button>
                  </>
                ) : (
                  <>
                    {inVoiceList && inVoiceList.length > 0 && (
                      <Button
                        variant="light"
                        className="addbtn btnfix btn btn-secondary"
                        style={{
                          marginRight: "14px",
                          fontSize: "14px",
                          marginTop: "8px",
                        }}
                      >
                        Generate Report
                      </Button>
                    )}
                  </>
                )}
              </>
            )}

            {inVoiceList &&
              // inVoiceList.length > 0 &&
              selectedFacility !== undefined &&
              selectedPeriod !== undefined && (
                <div
                  //  className="eopTable"
                  className={!isFinalisedInvoice ? "eopTable" : "eopTable1"}
                >
                  <EOPTable
                    columns={isFinalisedInvoice ? columns1 : columns}
                    data={viewInvoiceList}
                    isFinalisedInvoice={isFinalisedInvoice}
                    isScrolling={true}
                    style={{
                      height: "auto",
                      maxHeight: "350px",
                    }}
                    getCellProps={(cell) => ({
                      style: {
                        backgroundColor: cell.row.original.RowColor,
                      },
                    })}
                  />
                </div>
              )}

            {!selectedFacility && !selectedPeriod && (
              <div
                className="d-flex"
                style={{
                  height: "55vh",
                  marginTop: "10vh",
                }}
              >
                <p style={{ margin: "auto" }}>
                  Please select a facility from the sidebar to generate an EoP
                </p>
              </div>
            )}
          </div>

          <div
            className=" bg-white"
            style={{
              borderTop: "3px solid #896cc4",
              marginTop: "20px",
              padding: "1rem",
              marginRight: "5px",
            }}
          >
            <div style={{ margin: "8px" }}>
              <div class="head" style={{ marginBottom: "-8px" }}>
                Deduction Totals
              </div>
              <hr className="headerBorder" />
              <Row
                className="col-12"
                style={{
                  // margin: "8px",
                  fontSize: "15px",
                  marginBottom: "15px",
                }}
              >
                {deductionTotals &&
                  deductionTotals.length > 0 &&
                  deductionTotals.map((d, i) => {
                    return (
                      <div
                        className="row col-3"
                        key={i}
                        style={{
                          borderRight: "1px solid",
                          borderRightColor: "lightgray",
                          paddingTop: "4px",
                        }}
                      >
                        <tr>
                          <td key={i}>
                            <div class="row d-inline-flex">
                              <div
                                class="deductionTitle "
                                style={{
                                  width: "10rem",
                                  paddingLeft: "15px",
                                  textAlign: "right",
                                }}
                              >
                                {d.labelName}
                              </div>
                              <div
                                // class="deductionValues"
                                style={{ width: "3rem" }}
                              >
                                {AmountFormat(d.amount)}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </div>
                    );

                    {
                      /* <tr
                          style={{
                            borderRight: "1px solid",
                            borderRightColor: "lightgray",
                            marginTop: "4px",
                          }}
                        >
                          <td key={i} style={{ width: "20rem" }}>
                            <div class="row d-inline-flex">
                              <div
                                class="deductionTitle   "
                                style={{ width: "10rem", textAlign: "right" }}
                              >
                                {d.labelName}
                              </div>
                              <div
                                class="deductionValues "
                                style={{ width: "1rem" }}
                              >
                                ${d.amount}
                              </div>
                            </div>
                          </td>
                        </tr> */
                    }
                  })}
              </Row>
            </div>
          </div>
          {/* Footer */}

          {showFinaliseConfirm && (
            <EopInfoModal
              ShowDeleteModal={showFinaliseConfirm}
              archiveConfirmationCallBack={finaliseConfrimationCallback}
              Data=""
              title="title"
              setShowFinaliseConfirm={setShowFinaliseConfirm}
            ></EopInfoModal>
          )}
          {/* 
          {showWarningAlert && (
            <EOPWarningMesaageModalAlert
              warningType={title.warningType}
              header={title.header}
              msg={title.msg}
              showWarningAlert={showWarningAlert}
              setShowWarningAlert={setShowWarningAlert}
            />
          )} */}
          {showWarningAlert && (
            <WarningMessageModelAlert
              warningType={title.warningType}
              header={title.header}
              msg={title.msg}
              showWarningAlert={showWarningAlert}
              setShowWarningAlert={setShowWarningAlert}
            />
          )}

          {IsUpdated ? (
            <DirtyWarningAlert
              isBlocking={IsUpdated}
              sourceName={"End of Period"}
              messageBody={
                "Are you sure you want to exit and discard these changes?"
              }
            />
          ) : null}

          {cannotFinalizeError && (
            <BasicDailyFeesWarning
              title={warningAlertOptions.title}
              msg={warningAlertOptions.msg}
              fieldAlertWarning={cannotFinalizeError}
              setFieldAlertWarning={setCannotFinalizeError}
            />
          )}

          {showSuccessAlert && (
            <SuccessAlert
              type={type}
              msg={successAlertOptions.msg}
              title={successAlertOptions.actionType}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}
        </Page>
      )}
    </>
  );
};
export default EndOfPeriodTableView;
