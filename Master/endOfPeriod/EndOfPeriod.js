import React, { useState } from "react";
import PeriodTables from "./PeriodTables";
import EndOfPeriodTableView from "./EndOfPeriodTableView";
import "../../../css/style.css";
function EndOfPeriod() {
  const [selectedFacilityId, setSelectedFacilityId] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [selectedFacility, setSelectedFacility] = useState();
  const [checkisFinalized, setCheckisFinalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [IsUpdated, setIsUpdated] = useState(false);
  const getFacility = (selected) => {
    // console.log("getPeriod selected",selected.value);
    setIsUpdated(false);
    setSelectedFacilityId(selected.id);
    setSelectedFacility(selected);
  };

  const getPeriod = (selected) => {
    // console.log("getPeriod selected",selected);
    setIsUpdated(false);
    setSelectedPeriod(selected);
  };

  const checkisFinalizedCallBack = (finaliedFirstID) => {
    setIsUpdated(false);
    setCheckisFinalized(finaliedFirstID);
  };

  return (
    <div className="d-flex">
      <div className="col-3 bg-white navw300 text-black">
        <PeriodTables
          getFacility={getFacility}
          getPeriod={getPeriod}
          setLoading={setLoading}
          somthingChanged={IsUpdated}
          loading={loading}
          checkisFinalized={checkisFinalized}
        />
      </div>
      <div
        className="col-9  "
        style={{
          marginLeft: "15px",
          width: "77% ",
        }}
      >
        <EndOfPeriodTableView
          selectedFacilityId={selectedFacilityId}
          setSomthingChanged={setIsUpdated}
          selectedPeriod={selectedPeriod}
          setLoading={setLoading}
          selectedFacility={selectedFacility}
          checkisFinalizedCallBack={checkisFinalizedCallBack}
        />
      </div>
    </div>
  );
}

export default EndOfPeriod;
