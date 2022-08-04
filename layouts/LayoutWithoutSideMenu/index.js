import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopHeader from "../../components/header/TopHeader";
import TopSecondHeader from "../../components/header/TopSecondHeader";

const LayoutWithoutSideMenu = () => {
  const [selectedMenue, setSelectedMenue] = React.useState("");
  const [selectedSideMenue, setSelectedSideMenue] = React.useState("");
  const callBackSelectedMenuName = (menuName) => {
    setSelectedMenue(menuName);
  };
  const callBackSelectedSideMenuName = (SideMenuName) => {
    setSelectedSideMenue(SideMenuName);
  };
  useEffect(() => {
    setSelectedMenue(window.sessionStorage.getItem("menuName"));
    setSelectedSideMenue(window.sessionStorage.getItem("sideMenuName"));
  }, []);
  // useEffect(() => {
  //   window.sessionStorage.setItem("menuName", selectedMenue);
  // }, [selectedMenue]);
  // useEffect(() => {
  //   window.sessionStorage.setItem("sideMenuName", selectedSideMenue);
  // }, [selectedSideMenue]);

  return (
    <div>
      <TopHeader callBackSelectedMenuName={callBackSelectedMenuName} />
      <TopSecondHeader
        callBackSelectedSideMenuName={callBackSelectedSideMenuName}
        parentName={selectedMenue}
      />
      <div className="col-sm-12 mt-1 pt-1 page-content bg-gradient-info">
        <div className="row col-sm-12 mt-2">
          <div className="col-sm-12 bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutWithoutSideMenu;
