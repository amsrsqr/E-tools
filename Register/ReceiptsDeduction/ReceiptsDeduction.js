import React, { useEffect, useState, useRef } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ViewAdditionalPeriodRules from "./ViewAdditionalPeriodRules";
import ViewOtherDeduction from "../otherDeduction/ViewOtherDeduction";
import ViewChargesAndReciepts from "../dapDac/chargesAndReciepts/ViewChargesAndReciepts";
import ViewReceipts from "../ViewReceipts";
import "../../../css/style.css";
import radRacRecieptsservice from "../../../services/Resident/radRacReciepts.service";
import otherDecution from "../../../services/Resident/otherDeduction.service";
import DapDacChargesAndReceipts from "../../../services/Master/dapDacChargesAndReceipts.service";
import radRacDeductionRuleService from "../../../services/Resident/additionalPeriodRules.service";
import { useNavigate } from "react-router-dom";
import DirtyWarningAlert from "../../../components/DirtyWarningAlert";

function ReceiptsDeduction({
  residentId,
  // getHeldByGovernmentChange,
  admissionDate,
  isContinue,
  heldByGovernmentValue,
  refundComplete,
  isCancelling,
  handlIsUnSavedData,
  isUnsavedData,
  handleCancelFalse,
  continueApiCall,
  ResidentActionType,
  heldByGovernmentSaved,
  navigationToView,
}) {
  const [ActiveTab, setActiveTab] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdded1, setIsAdded1] = useState(false);
  const radID = localStorage.getItem("PaymentRadId");
  const [activeStepCpy, setActiveStepCpy] = useState();
  const [showUnSaveChangesAlert, setShowUnSaveChangesAlert] = useState(false);
  const [residentActionType, setResidentActionType] = useState(
    ResidentActionType
  );
  const [isUnsavedDataInReceipt, setIsUnsavedDataInReceipt] = useState(false);

  let navigate = useNavigate();
  const prevCountRef = useRef();
  prevCountRef.current = activeStepCpy;

  useEffect(() => {
    debugger;
    handlIsUnSavedData(isUnsavedDataInReceipt);
  }, [isUnsavedDataInReceipt]);

  useEffect(() => {
    if (navigationToView) {
      navigate("/eRADWeb/viewResident", { replace: true });
    }
  }, [navigationToView]);

  useEffect(() => {
    if (isCancelling && isUnsavedData) {
      if (ActiveTab === 0) {
        if (tableData && tableData.length > 0) {
          const updatedObj = {
            screenName: "RAD/RACReceipts",
            isBond: false,
            isPermanent: false,
            id: parseInt(radID),
            listRadRacReceipt: tableData,
          };

          radRacRecieptsservice
            .cancelDataInReceipts(updatedObj)
            .then((response) => {
              console.log("Calling Api response", response.result);
              navigate("/eRADWeb/viewResident", { replace: true });
            })
            .catch((error) => {
              console.log(" Calling Api error", error);
            });
        }

        if (isAdded) {
          const updatedObj = {
            screenName: "RAD/RACReceipts",
            isBond: false,
            isPermanent: false,
            id: parseInt(radID),
            listRadRacReceipt: null,
          };

          radRacRecieptsservice
            .cancelDataInReceipts(updatedObj)
            .then((response) => {
              console.log("Calling Api  response", response.result);
              navigate("/eRADWeb/viewResident", { replace: true });
            })
            .catch((error) => {
              console.log("Calling Api error", error);
              setIsAdded(false);
              setIsUnsavedDataInReceipt(false);
              //handlIsUnSavedData(data);
              //handlIsUnSavedData(false);
            });
        }
      }

      if (ActiveTab === 1) {
        if (tableData && tableData.length > 0) {
          const updatedObj = {
            screenName: "OtherDeductions",
            isBond: false,
            isPermanent: false,
            id: parseInt(radID),
            listOtherDeductions: tableData,
          };

          otherDecution
            .cancelDataInOtherDeduction(updatedObj)
            .then((response) => {
              console.log("Calling Api1 response", response);
              navigate("/eRADWeb/viewResident", { replace: true });
            })
            .catch((error) => {
              console.log("Calling Api1 error", error);
            });
        }

        if (isAdded) {
          const updatedObj = {
            screenName: "OtherDeductions",
            isBond: false,
            isPermanent: false,
            id: parseInt(radID),
            listOtherDeductions: null,
          };

          otherDecution
            .cancelDataInOtherDeduction(updatedObj)
            .then((response) => {
              console.log("OtherDeductions response", response);
              navigate("/eRADWeb/viewResident", { replace: true });
            })
            .catch((error) => {
              console.log("OtherDeductions error", error);
            });
        }
      }

      if (ActiveTab === 2) {
        const updatedObj = {
          screenName: "DAP/DACs",
          isBond: false,
          isPermanent: false,
          id: parseInt(radID),
          listDapDacReceipt: tableData,
          listDeduction: tableData2,
        };

        DapDacChargesAndReceipts.cancelIsDapDacReciptsAndCharges(updatedObj)
          .then((response) => {
            console.log("cancelIsDapDacReciptsAndCharges response", response);
            navigate("/eRADWeb/viewResident", { replace: true });
          })
          .catch((error) => {
            console.log("cancelIsDapDacReciptsAndCharges error", error);
          });

        if (isAdded || isAdded1) {
          const updatedObj = {
            screenName: "DAP/DACs",
            isBond: false,
            isPermanent: false,
            id: parseInt(radID),
            listDapDacReceipt: null,
            listDeduction: null,
          };

          DapDacChargesAndReceipts.cancelIsDapDacReciptsAndCharges(updatedObj)
            .then((response) => {
              console.log("cancelIsDapDacReciptsAndCharges response", response);
              navigate("/eRADWeb/viewResident", { replace: true });
            })
            .catch((error) => {
              console.log("cancelIsDapDacReciptsAndCharges error", error);
            });
        }
      }

      if (ActiveTab === 3) {
        const updatedObj = {
          screenName: "AdditionalPeriodRules",
          isBond: false,
          isPermanent: false,
          id: parseInt(radID),
          listDapDacRule: tableData,
        };

        radRacDeductionRuleService
          .cancelDataInAddionalPeriodicRules(updatedObj)
          .then((response) => {
            console.log("cancelDataInAddionalPeriodicRules response", response);
            navigate("/eRADWeb/viewResident", { replace: true });
          })
          .catch((err) => {
            console.log("cancelDataInAddionalPeriodicRules err", err);
          });
      }
      // console.log("Setting All to True");
      // setIsAdded(false);
      // handlIsUnSavedData(false);
      // handleCancelFalse();
    }
  }, [isCancelling, isUnsavedData]);

  useEffect(() => {
    const id = parseInt(localStorage.getItem("PaymentRadId"));
    if (prevCountRef.current === 0) {
      continueApiCall({ isBond: false, screenName: "RAD/RACReceipts", id: id });
    } else if (prevCountRef.current === 1) {
      continueApiCall({ isBond: false, screenName: "RAD/RACReceipts", id: id });
    } else if (prevCountRef.current === 2) {
      continueApiCall({ isBond: false, screenName: "RAD/RACReceipts", id: id });
    } else if (prevCountRef.current === 3) {
      continueApiCall({
        isBond: false,
        screenName: "RAD/RACReceipts",
        id: id,
      });
    }
    setActiveStepCpy(ActiveTab);
  }, [ActiveTab]);

  const getCancelData = (data) => {
    console.log("getCancelData", data);
    if (data && data.length > 0) {
      console.log("handlIsUnSavedData to true", data);
      setIsUnsavedDataInReceipt(data);
      //handlIsUnSavedData(data);
      //handlIsUnSavedData(true);
      setTableData(data);
    }
  };

  const getCancelData2 = (data) => {
    console.log("getCancelData2", data);
    if (data && data.length > 0) {
      console.log("handlIsUnSavedData to true", data);
      setIsUnsavedDataInReceipt(data);
      //handlIsUnSavedData(data);
      //handlIsUnSavedData(true);
      setTableData2(data);
    }
  };

  const handleIsAdded = () => {
    setIsAdded(true);
    setIsUnsavedDataInReceipt(true);
    //handlIsUnSavedData(data);    //handlIsUnSavedData(true);
    console.log("handlIsUnSavedData to true");
  };

  const handleIsAdded1 = () => {
    setIsAdded1(true);
    setIsUnsavedDataInReceipt(true);
    //handlIsUnSavedData(data);
    console.log("handlIsUnSavedData to true");
  };

  const callbackIsUnsavedData = (data) => {
    debugger;
    setIsUnsavedDataInReceipt(data);
    //handlIsUnSavedData(data);
  };

  return (
    <div>
      <Tabs selectedIndex={ActiveTab} onSelect={(index) => setActiveTab(index)}>
        <TabList
          style={{
            borderBottomColor: "#3e2a6e",
            borderBottomWidth: 3,
            paddingBottom: "0px",
            display: "flex",
            marginLeft: "-16px",
          }}
        >
          <Tab
            className={"selectedTabClass"}
            style={{
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              backgroundColor: ActiveTab === 0 ? "#3e2a6e" : "#f2f2f2",
              color: ActiveTab === 0 ? "white" : "black",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            RAD / RAC Receipts
          </Tab>
          <Tab
            className={"selectedTabClass"}
            style={{
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              cursor: "pointer",
              backgroundColor: ActiveTab === 1 ? "#3e2a6e" : "#f2f2f2",
              color: ActiveTab === 1 ? "white" : "black",
              fontWeight: "600",
            }}
          >
            Other Deductions
          </Tab>
          <Tab
            className={"selectedTabClass"}
            style={{
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              cursor: "pointer",
              backgroundColor: ActiveTab === 2 ? "#3e2a6e" : "#f2f2f2",
              color: ActiveTab === 2 ? "white" : "black",
              fontWeight: "600",
            }}
          >
            DAP / DACs
          </Tab>
          <Tab
            className={"selectedTabClass"}
            style={{
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              cursor: "pointer",
              backgroundColor: ActiveTab === 3 ? "#3e2a6e" : "#f2f2f2",
              color: ActiveTab === 3 ? "white" : "black",
              fontWeight: "600",
            }}
          >
            Additional Period Rules
          </Tab>
        </TabList>

        <TabPanel>
          <ViewReceipts
            residentId={residentId}
            // getHeldByGovernmentChange={getHeldByGovernmentChange}
            isContinue={isContinue}
            heldByGovernmentValue={heldByGovernmentValue}
            refundComplete={refundComplete}
            getCancelData={getCancelData}
            handleIsAdded={handleIsAdded}
            callbackIsUnsavedData={callbackIsUnsavedData}
            heldByGovernmentSaved={heldByGovernmentSaved}
          />
        </TabPanel>
        <TabPanel>
          <ViewOtherDeduction
            residentId={residentId}
            admissionDate={admissionDate}
            getCancelData={getCancelData}
            handleIsAdded={handleIsAdded}
          />
        </TabPanel>
        <TabPanel>
          <ViewChargesAndReciepts
            residentId={residentId}
            admissionDate={admissionDate}
            getCancelData={getCancelData}
            getCancelData2={getCancelData2}
            handleIsAdded={handleIsAdded}
            handleIsAdded1={handleIsAdded1}
          />
        </TabPanel>
        <TabPanel>
          <ViewAdditionalPeriodRules
            residentId={residentId}
            getCancelData={getCancelData}
            handleIsAdded={handleIsAdded}
          ></ViewAdditionalPeriodRules>
        </TabPanel>
      </Tabs>
      {isUnsavedDataInReceipt && !isCancelling ? (
        <DirtyWarningAlert
          isBlocking={isUnsavedDataInReceipt && !isCancelling}
          //callBackResult={callBackFromWarning}
          sourceName={
            residentActionType == "Edit" ? "Edit Resident" : "Add Resident"
          }
          messageBody={
            "Are you sure you want to exit and discard these changes?"
          }
        />
      ) : null}
    </div>
  );
}

export default ReceiptsDeduction;
