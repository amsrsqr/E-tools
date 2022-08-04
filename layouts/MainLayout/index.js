import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopHeader from "../../components/header/TopHeader";
import TopSecondHeader from "../../components/header/TopSecondHeader";
import Sidebar from "../../components/header/Sidebar";
import { SidebarData } from "../../components/header/SidebarData";
import Footer from "../../components/Footer/Footer";
import { encryptStorage } from "../../utils/EncryptStorage";
const MainLayout = () => {
  const [selectedMenue, setSelectedMenue] = React.useState("");
  const [selectedSideMenue, setSelectedSideMenue] = React.useState("");
  const [activeSidebar, setActiveSidebar] = React.useState("");
  const callBackSelectedMenuName = (menu) => {
    setSelectedMenue(menu.id);
    if (menu.isHavingSubMenues === false) setSelectedSideMenue("");
    if (menu.hasSideMenu) {
      setSelectedSideMenue(menu.id);
    } else {
      setSelectedSideMenue("");
    }
  };
  const callBackSelectedSideMenuName = (SideMenuName) => {
    setSelectedSideMenue(SideMenuName);
    setActiveSidebar("");
  };

  const callBackSelectedSideMenuNameinTop = (SideMenuName) => {
    setSelectedSideMenue(SideMenuName);
    setActiveSidebar("");
  };

  const callBackSelectedSideBarMenuName = (SideMenuName) => {
    setActiveSidebar(SideMenuName);
  };
  useEffect(() => {
    setSelectedMenue(encryptStorage.getItem("menuName"));
    setSelectedSideMenue(encryptStorage.getItem("sideMenuName"));
    setActiveSidebar(encryptStorage.getItem("activeSidebar"));
  }, []);
  useEffect(() => {
    encryptStorage.setItem("menuName", selectedMenue);
  }, [selectedMenue]);
  useEffect(() => {
    encryptStorage.setItem("sideMenuName", selectedSideMenue);
  }, [selectedSideMenue]);
  useEffect(() => {
    encryptStorage.setItem("activeSidebar", activeSidebar);
  }, [activeSidebar]);
  return (
    // console
    <div>
      <TopHeader
        callBackSelectedMenuName={callBackSelectedMenuName}
        callBackSelectedSideMenuName={callBackSelectedSideMenuNameinTop}
      />
      <TopSecondHeader
        callBackSelectedSideMenuName={callBackSelectedSideMenuName}
        parentName={selectedMenue}
        selectedSideMenue={selectedSideMenue}
      />
      <div className="col-sm-12 page-content bg-gradient-info">
        <div className="row col-sm-12 ">
          <div className="col-sm-3 headeralignment">
            <Sidebar
              parentId={selectedSideMenue}
              callBackSelectedSideBarMenuName={callBackSelectedSideBarMenuName}
            />
          </div>
          <div
            className={
              SidebarData.find((m) => m.parentId === selectedSideMenue)
                ? "col-sm-9 bg-white rightsidebar"
                : `col-sm-12 ${
                    selectedMenue === "eop"
                      ? ""
                      : selectedMenue === "facility"
                      ? ""
                      : "bg-white eopalignment"
                  }`
            }
          >
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
