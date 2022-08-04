import React, { useEffect, useState } from "react";
import { Collapse } from "reactstrap";
import { FACILITY } from "../../../constant/FieldConstant";
import EopServices from "../../../services/EndOfPeriod/EndOfPeriod.services";
import "../../../css/Eop.css";
import { FaCalendar } from "react-icons/fa";
import Loader from "../../../components/Loader";
import DirtyWarningAlertWithoutFormik from "../../../components/DirtyWarningAlertWithoutFormik";
import SingleSelect from "../../../components/MySelect/MySelect";
// import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

function PeriodTables({
  getFacility,
  getPeriod,
  checkisFinalized,
  setLoading,
  loading,
  somthingChanged,
}) {
  const [FacilityList, setFAcilityList] = useState([]);
  const [SelectedFacility, SetSelectedFacility] = useState(undefined);
  const [SelectedFacilityCpy, SetSelectedFacilityCpy] = useState(undefined);
  const [PeriodSlotList, SetPeriodSlotList] = useState([]);
  const [SelectedPeriod, SetSelectedPeriod] = useState({});
  const [SelectedTmpPeriod, SetSelectedTmpPeriod] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  // const [unConfirmedFacilities, setUnConfirmedFacilities] = useState(undefined);
  // const [unFinalizedPeriod, setUnFinalizedPeriod] = useState(undefined);
  // const [facilityLoading, setFacilityLoading] = useState(false);
  const [IsUpdated, setIsUpdated] = useState(false);
  const [ShowWarning, setShowWarning] = useState(false);

  const [currentPeriod, setCurrentPeriod] = useState(undefined);

  useEffect(() => {
    function getItems() {
      getEopFacilitiesList(0, false);
    }
    getItems();
  }, []);

  useEffect(() => {
    // console.log("somthingChanged in periods slots", somthingChanged);
    setIsUpdated(somthingChanged);
  }, [somthingChanged]);

  useEffect(() => {
    // console.log("checkisFinalized in periods slots", checkisFinalized);
    if (SelectedFacility && checkisFinalized) {
      getPeriodsSlotsByFacity(SelectedFacility.id, "doesNotReset");
    }
  }, [checkisFinalized]);

  function getEopFacilitiesList(facID = "", isShow = false) {
    setLoading(true);
    EopServices.getEopFacility(facID, isShow).then((response) => {
      // setUnConfirmedFacilities(response.unConfirmedFacilities);
      // setUnFinalizedPeriod(response.unfinalisedPeriods);
      if (response && response.length > 0) {
        const result = response.map((x) => {
          const obj = {
            // label: (
            //   <span key={x.id}>
            //     {x.name}{" "}
            //     {/* <span style={{ color: "#F01414" }}>
            //       {x.unConfirmedPeriods ? `(${x.unConfirmedPeriods}) ` : ""}
            //     </span> */}
            //   </span>
            // ),
            // label:
            label: x.facility_name,
            value: x.facility_name,
            name: x.facility_name,
            id: x.facility_id,
            // unConfirmedPeriods: x.unConfirmedPeriods,
          };
          return obj;
        });
        setFAcilityList(result);

        // const firstFacility = response?.faclities[0];

        // if (firstFacility) {
        //   const obj1 = {
        //     label: (
        //       <span key={firstFacility.id}>
        //         {firstFacility.name}{" "}
        //         {/* <span style={{ color: "#F01414" }}>
        //           {firstFacility.unConfirmedPeriods
        //             ? `(${firstFacility.unConfirmedPeriods}) `
        //             : ""}
        //         </span> */}
        //       </span>
        //     ),
        //     value: firstFacility.id,
        //     name: firstFacility.name,
        //     id: firstFacility.id,
        //     unConfirmedPeriods: firstFacility.unConfirmedPeriods,
        //   };
        //   getFacility(obj1);
        //   SetSelectedFacility(obj1);
        //   getPeriodsSlotsByFacity(firstFacility.id);
        // }

        setLoading(false);
      } else {
        setFAcilityList([]);
        SetSelectedFacility({});
        setLoading(false);
      }
    });
  }

  function getPeriodsSlotsByFacity(facID = null, tmpAction) {
    setLoading(true);
    EopServices.getPeriodsSlots(facID).then((data) => {
      if (data && Object.keys(data).length > 0) {
        const currentObj = {
          currentPeriod: data.currentPeriod,
          endDate: data.endDate,
          period: data.period,
          slot: data.currentPeriod,
          startDate: data.startDate,
          year: data.startDate?.split("-")[0],
        };
        setCurrentPeriod(currentObj); //data[0].slot.length - 1
        SetPeriodSlotList(data.eoMPeriods);
        if (tmpAction === "doesNotReset") {
          // console.log("checkisFinalized at get slots", checkisFinalized);
          setIsOpen(Number(checkisFinalized.year));
          const foundYear = data.eoMPeriods.find(
            (b) => b.year === Number(checkisFinalized.year)
          );
          if (foundYear) {
            const slctd = foundYear.slot.find((nm) => {
              if (
                nm.period === checkisFinalized.period &&
                nm.startDate === checkisFinalized.startDate &&
                nm.endDate === checkisFinalized.endDate
              ) {
                return nm;
              }
            });
            // console.log("slctd slot", slctd);
            if (slctd) {
              SetSelectedPeriod(slctd);
            }
          }
        } else {
          getPeriod(currentObj);
          SetSelectedPeriod(currentObj);
        }
      }
      setLoading(false);
    });
  }

  const handleToggle = (yr) => {
    if (isOpen === yr) {
      setIsOpen("");
    } else {
      setIsOpen(yr);
    }
  };
  const CurrentPeriodClicked = () => {
    if (currentPeriod && currentPeriod.period && currentPeriod.startDate) {
      getPeriod(currentPeriod);
      SetSelectedPeriod(currentPeriod);
    }
  };
  const handleFacilitySelect = (slected) => {
    if (IsUpdated) {
      SetSelectedFacilityCpy({ selectedFaci: slected, facilityClicked: true });
      setShowWarning(IsUpdated);
    } else {
      SetSelectedFacilityCpy(undefined);
      SetSelectedFacility(slected);
      getPeriodsSlotsByFacity(slected.id);
      getFacility(slected);
    }
  };

  const handlePeriodClick = (periodSlot) => {
    //open pop up to check something changed
    if (IsUpdated) {
      SetSelectedTmpPeriod(periodSlot);
      setShowWarning(IsUpdated);
    } else {
      SetSelectedTmpPeriod(undefined);
      SetSelectedPeriod(periodSlot);
      getPeriod(periodSlot);
    }
  };

  const callBackFromWarning = (res) => {
    if (res) {
      if (SelectedFacilityCpy && SelectedFacilityCpy.facilityClicked) {
        SetSelectedFacility(SelectedFacilityCpy.selectedFaci);
        getPeriodsSlotsByFacity(SelectedFacilityCpy.selectedFaci.id);
        getFacility(SelectedFacilityCpy.selectedFaci);
        setShowWarning(false);
      } else {
        SetSelectedPeriod(SelectedTmpPeriod);
        getPeriod(SelectedTmpPeriod);
        setShowWarning(false);
        SetSelectedTmpPeriod(undefined);
      }
    } else {
      setShowWarning(false);
      SetSelectedTmpPeriod(undefined);
      SetSelectedFacilityCpy(undefined);
    }
  };
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div className="p-3">
          {ShowWarning ? (
            <DirtyWarningAlertWithoutFormik
              isBlocking={ShowWarning}
              callBackResult={callBackFromWarning}
              sourceName={"End of Period"}
              messageBody={
                "Are you sure you want to exit and discard these changes?"
              }
            />
          ) : null}
          {/* <p className="period-title">Periods</p> */}
          <p className=" fw-bold fs-5" style={{ marginBottom: "8px" }}>
            {FACILITY}
          </p>
          <hr />
          {/* As per meeting disscussion on 6th of may */}
          {/* <div className="row " style={{ marginTop: "-15px" }}>
        <div
          style={{ background: "#f3c3c3", marginTop: "6px" }}
          className="text-center fw-bold mt-3 col-6 finalise-unconfirmed1"
        >
          Unfinalised <br />
          Periods <br /> (this Facility) <br />
          <span
            style={{ color: "#F01414" }}
            className="d-flex justify-content-center"
          >
            {unFinalizedPeriod ? unFinalizedPeriod : 0}
          </span>
        </div>

        <div
          style={{ background: "#dcebf4" }}
          className=" fw-bold mt-3 col-6 finalise-unconfirmed"
        >
          <div
            className="d-flex justify-content-center"
            style={{ paddingTop: "10px" }}
          >
            Unconfirmed
          </div>
          <div className="d-flex justify-content-center"> Facilities</div>

          <span
            style={{ color: "#F01414" }}
            className="d-flex justify-content-center"
          >
            {unConfirmedFacilities ? unConfirmedFacilities : 0}
          </span>
        </div>
      </div> */}

          <div>
            {/* <p className=" fw-bold mt-3 fs-5" style={{ marginBottom: "8px" }}>
          {FACILITY}
        </p> */}

            <SingleSelect
              value={SelectedFacility ? SelectedFacility : ""}
              onChange={handleFacilitySelect}
              options={FacilityList}
              isSearchable={true}
              placeholder="Select..."
            />

            {/* raidlog No 147 discussed with mark and cindy */}
            {/* <div
          className=" d-flex "
          style={{ marginBottom: "4px", marginTop: "14px", marginLeft: "1px" }}
        >
          <div className="col-1 mt-1 ">
            <input
              className="show-unfinalied-facility_checkbox"
              type={"checkbox"}
              onClick={showUnfinaliedPeriods}
            />
          </div>
          <div className="col-11 checkBox-Description">
            Only show Facilities with Unfinalised Periods
          </div>
        </div> */}

            <div className="row" style={{ marginTop: "8px" }}>
              <div className="col-1 mt-1 ">
                <FaCalendar style={{ fontSize: "17px", color: "red" }} />
              </div>
              <div className="col-9 fw-bold">
                <h5 className="currentHeading">
                  Current Period ({currentPeriod?.year})
                </h5>
              </div>
              <div className="col-1"></div>
            </div>
            <div className="row">
              <div className="col-1 mt-1"></div>
              <div
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    SelectedPeriod &&
                    currentPeriod &&
                    SelectedPeriod.currentPeriod ===
                      currentPeriod.currentPeriod &&
                    SelectedPeriod.endDate === currentPeriod.endDate &&
                    SelectedPeriod.period === currentPeriod.period &&
                    SelectedPeriod.startDate === currentPeriod.startDate
                      ? "#dcebf4"
                      : "",
                }}
                className="col-10 fs-6  fw-bold currentDescription"
                onClick={CurrentPeriodClicked}
              >
                {currentPeriod && currentPeriod.period}{" "}
                <span style={{ marginLeft: "2.5rem", fontSize: "16px" }}>
                  {currentPeriod && currentPeriod.currentPeriod}
                </span>
              </div>
            </div>
          </div>

          {PeriodSlotList && PeriodSlotList.length > 0
            ? PeriodSlotList.map((ob, index) => {
                return (
                  <>
                    <div
                      key={index}
                      onClick={() => handleToggle(ob.year)}
                      className="border-0 bg-transparent mt-2"
                    >
                      <div className="row">
                        <div className="col-1 mt-1 ">
                          <FaCalendar style={{ fontSize: "17px" }} />
                        </div>
                        <div
                          className="col-9 fw-bold"
                          style={{ marginLeft: "-7px", fontSize: "18px" }}
                        >
                          {ob.year}
                        </div>
                        <div className="col-1" style={{ marginLeft: "2rem" }}>
                          {isOpen === ob.year ? (
                            // <IoIosArrowDown size={14} />
                            <i
                              class="fa fa-angle-down"
                              style={{ fontSize: "30px" }}
                            ></i>
                          ) : (
                            // <IoIosArrowUp size={14}/>
                            <i
                              class="fa fa-angle-up"
                              style={{ fontSize: "30px" }}
                            ></i>
                          )}
                        </div>
                      </div>
                    </div>
                    <Collapse
                      isOpen={isOpen === ob.year}
                      style={{
                        maxheight: "30vh",
                        height: "auto",
                        overflowY: "scroll",
                        overflowX: "hidden",
                      }}
                    >
                      {ob.slot && ob.slot.length > 0
                        ? ob.slot.map((slt) => {
                            {
                              /* if (slt.isFinalised) { */
                            }
                            return (
                              <div
                                onClick={() => handlePeriodClick(slt)}
                                style={{
                                  borderLeft: "2px solid #bfbaba", //#f5f5f5
                                  marginLeft: "8px",
                                  paddingBottom: "32px",
                                  height: "30px",
                                  color:
                                    SelectedPeriod &&
                                    slt.id === SelectedPeriod.id
                                      ? "black"
                                      : "#bfbaba",
                                  fontWeight:
                                    SelectedPeriod &&
                                    slt.id === SelectedPeriod.id
                                      ? "bolder"
                                      : "500",
                                  background:
                                    SelectedPeriod &&
                                    slt.id === SelectedPeriod.id
                                      ? "#DCEBF4"
                                      : "",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                }}
                                key={slt.id}
                                className="row inside-Collaps-container"
                              >
                                <p
                                  className="col-2"
                                  style={{
                                    marginLeft: "12px",
                                    marginTop: "4px",
                                  }}
                                >
                                  {slt.period}
                                </p>
                                <p
                                  className="col-8"
                                  style={{ marginTop: "4px" }}
                                >
                                  {slt.slot}
                                </p>
                              </div>
                            );
                            {
                              /* } */
                            }
                          })
                        : null}
                    </Collapse>
                  </>
                );
              })
            : null}
        </div>
      )}
    </>
  );
}

export default PeriodTables;
