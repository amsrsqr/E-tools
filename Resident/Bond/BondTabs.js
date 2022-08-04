import React, { useState, useEffect, useRef } from "react";
import ViewBondReceipts from "./Receipts/ViewBondReceipts";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ViewBondHistory from "./Deductions/ViewBondHistory";
import BondTypeServices from "../../../services/Master/bondAndRadRacType.service";
import { useNavigate } from "react-router-dom";

const BondTabs = ({
  admissionDate,
  residentId,
  isCancelling,
  handlIsUnSavedData,
  continueApiCall,
  isUnsavedData,
}) => {
  const [ActiveTab, setActiveTab] = useState(0);
  const [ActiveTabCpy, setActiveTabCpy] = useState();
  const [bondIdAll, setBondIdAll] = useState(null);
  const [table1Data, setTable1Data] = useState();
  const [table2Data, setTable2Data] = useState();
  const [tab, setTab] = useState();
  const [modal, setModal] = useState();
  const [screen, setScreen] = useState();
  const [screenTab, setScreenTab] = useState();
  const [isAdded, setIsAdded] = useState(false);

  let navigate = useNavigate();

  const prevCountRef = useRef();
  prevCountRef.current = ActiveTabCpy;

  useEffect(() => {
    localStorage.setItem("bondId", bondIdAll);
  }, [bondIdAll]);

  useEffect(() => {
    setTable2Data();
    setTable1Data();
    setTab();
    setModal();
    setActiveTabCpy(ActiveTab);
    const id = parseInt(localStorage.getItem("bondId"));
    if (prevCountRef.current === 0) {
      continueApiCall({ isBond: true, screenName: "reciepts", id: id });
    } else if (prevCountRef.current === 1) {
      continueApiCall({ isBond: true, screenName: "reciepts", id: id });
    }
  }, [ActiveTab]);

  const getBondIdCallback = (val) => {
    setBondIdAll(val);
  };

  useEffect(() => {
    if (isCancelling && isUnsavedData) {
      if (ActiveTab === 0) {
        const cancelObj = {
          screenName: "reciepts",
          isBond: true,
          isPermanent: false,
          id: bondIdAll,
          listBondReceipt: table1Data,
          listAllChargesReceipt: table2Data,
        };

        console.log("ActiveTab", cancelObj);

        BondTypeServices.cancelBondTab(cancelObj)
          .then((response) => {
            console.log("cancelBondTab response", response);

            navigate("/eRADWeb/viewResident", { replace: true });
          })
          .catch((errors) => {
            console.log("cancelBondTab error", errors.Message);
          });
      }

      if (ActiveTab === 1) {
        const cancelObj = {
          screenName: "bondDeduction",
          isBond: true,
          isPermanent: false,
          id: bondIdAll,
          listDeductionHistory: table1Data,
          listDeductionRule: table2Data,
        };
        console.log("ActiveTab", cancelObj);

        BondTypeServices.cancelBondTabDeduction(cancelObj)
          .then((response) => {
            console.log("cancelBondTab response", response);

            navigate("/eRADWeb/viewResident", { replace: true });
          })
          .catch((errors) => {});
      }

      if (isAdded) {
        if (ActiveTab === 0) {
          const cancelObj = {
            screenName: "reciepts",
            isBond: true,
            isPermanent: false,
            id: bondIdAll,
            listBondReceipt: null,
            listAllChargesReceipt: null,
          };
          console.log("ActiveTab", cancelObj);
          BondTypeServices.cancelBondTab(cancelObj)
            .then((response) => {
              console.log("cancelBondTab response", response);
            })
            .catch((errors) => {
              console.log("cancelBondTab error", errors.Message);

              navigate("/eRADWeb/viewResident", { replace: true });
            });
        } else if (ActiveTab === 1) {
          const cancelObj = {
            screenName: "bondDeduction",
            isBond: true,
            isPermanent: false,
            id: bondIdAll,
            listDeductionHistory: null,
            listDeductionRule: null,
          };
          console.log("ActiveTab", cancelObj);

          BondTypeServices.cancelBondTabDeduction(cancelObj)
            .then((response) => {
              console.log("cancelBondTab response", response);

              navigate("/eRADWeb/viewResident", { replace: true });
            })
            .catch((errors) => {
              console.log("cancelBondTabDeduction error", errors.Message);
            });
        }
      }
    }

    setIsAdded(false);
  }, [isCancelling, isUnsavedData, tab]);

  const handleCancelForFirstTable = (object) => {
    if (object) {
      if (object.tab === "reciepts") {
        setTable1Data(object.listBondReceipt);
      }
      if (object.tab === "bondDeduction") {
        setTable1Data(object.listDeductionHistory);
      }
      setTab(object.tab);
      setModal(object.table);

      handlIsUnSavedData(true);
    }
  };

  const handleCancelForSecondTable = (data) => {
    if (data && data.length > 0) {
      setTable2Data(data);
      setScreen(data.screen);
      setScreenTab(data.tab);
      handlIsUnSavedData(true);
    }
  };

  const handleCancelOnAdd = (data) => {
    console.log("handleCancelOnAdd", data);
    setIsAdded(true);
    handlIsUnSavedData(true);
    console.log("handlIsUnSavedData");
  };
  const handleCancelOnAdd1 = (data) => {
    console.log("handleCancelOnAdd1", data);
    handlIsUnSavedData(true);
    console.log("handlIsUnSavedData");
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
              fontWeight: "bold",
              backgroundColor: ActiveTab === 0 ? "#3e2a6e" : "#f2f2f2",
              color: ActiveTab === 0 ? "white" : "black",
              width: "9%",
              cursor: "pointer",
            }}
          >
            Receipts
          </Tab>
          <Tab
            className={"selectedTabClass"}
            style={{
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              fontWeight: "bold",
              backgroundColor: ActiveTab === 1 ? "#3e2a6e" : "#f2f2f2",
              color: ActiveTab === 1 ? "white" : "black",
              width: "9%",
              cursor: "pointer",
            }}
          >
            Bond Deductions
          </Tab>
        </TabList>

        <TabPanel>
          <ViewBondReceipts
            residentId={residentId}
            admissionDate={admissionDate}
            getBondIdCallback={getBondIdCallback}
            handleCancelInTabs={handleCancelForFirstTable}
            handleCancelInTabs1={handleCancelForSecondTable}
            handleCancelOnAdd={handleCancelOnAdd}
            handleCancelOnAdd1={handleCancelOnAdd1}
            bondIdAll={bondIdAll}
          />
        </TabPanel>
        <TabPanel>
          <ViewBondHistory
            admissionDate={admissionDate}
            bondIdAll={bondIdAll}
            handleCancelInTabs={handleCancelForFirstTable}
            handleCancelInTabs1={handleCancelForSecondTable}
            handleCancelOnAdd1={handleCancelOnAdd1}
            handleCancelOnAdd={handleCancelOnAdd}
          ></ViewBondHistory>
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default BondTabs;
