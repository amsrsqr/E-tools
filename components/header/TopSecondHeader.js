import React, { useState, useEffect } from "react";
import "../../css/style.css";
import { Link, useLocation } from "react-router-dom";
import Icon from "../../assets/Images/icon.png";
import { Navbar } from "reactstrap";
import { TopSecondHeaderData } from "./TopSecondHeaderData";
import { SidebarData } from "./SidebarData";
import { encryptStorage } from "../../utils/EncryptStorage";
const TopSecondHeader = ({
  parentName,
  callBackSelectedSideMenuName,
  selectedSideMenue,
}) => {
  const [activeMenu, setActiveMenu] = useState();
  const location = useLocation();
  useEffect(() => {
    setActiveMenu(encryptStorage.getItem("sideMenuName"));
  }, []);

  const handleMenuClick = (sideMenuName) => {
    callBackSelectedSideMenuName(sideMenuName);
  };
  useEffect(() => {
    // console.log("selectedSideMenue top second header", selectedSideMenue);
    if (activeMenu || selectedSideMenue) {
      const urlPath = TopSecondHeaderData.filter(
        (m) => m.pName === parentName
      ).filter(
        (n) => n.path.split("/").pop() === location.pathname?.split("/").pop()
      );
      // console.log("location.pathname", location.pathname?.split("/").pop());
      // console.log("urlPath", urlPath);
      if (urlPath.length > 0) {
        setActiveMenu(urlPath[0]?.id);
        handleMenuClick(urlPath[0]?.id);
      } else {
        const findParent = SidebarData.find(
          (ob) => ob.id === location.pathname?.split("/").pop()
        );
        if (findParent) {
          setActiveMenu(findParent.parentId);
        } else if (
          location.pathname?.split("/").pop() ===
          ("MainLayout" || "preferences")
        ) {
          setActiveMenu("preferences");
        }
        // console.log("findParent", findParent);
      }
    }
  }, [location.pathname, activeMenu, selectedSideMenue]);

  return (
    <div>
      {TopSecondHeaderData.find((m) => m.pName === parentName) !== undefined ? (
        <Navbar id="secondHeader" className="w-100" light expand="md">
          {TopSecondHeaderData.filter((m) => m.pName === parentName).map(
            (item, index) => {
              return (
                <li
                  key={index}
                  style={{ width: "160px", textAlign: "center" }}
                  className={
                    activeMenu === item.id &&
                    (location.pathname
                      ?.split("/")
                      .pop()
                      .trim() === item.path?.split("/").pop() ||
                      item.isSideBar)
                      ? item.disabled === true
                        ? "fontsize nav-item1 m-1 text-secondary text-black active"
                        : "fontsize nav-item m-1 text-secondary text-black active"
                      : item.disabled === true
                      ? "fontsize nav-item1 m-1 text-secondary text-black"
                      : "fontsize nav-item m-1 text-secondary text-black"
                  }
                  id={item.id}
                >
                  <Link
                    className={item.cName}
                    to={item.path}
                    onClick={() => {
                      setActiveMenu(item.id);
                      // console.log(
                      //   "at click",
                      //   location.pathname
                      //     ?.split("/")
                      //     .pop()
                      //     .trim()
                      // );
                      // handleMenuClick(item.id);
                    }}
                  >
                    <img src={Icon} className="icon" /> {item.title}
                  </Link>
                </li>
              );
            }
          )}
        </Navbar>
      ) : (
        <div>{TopSecondHeaderData.find((m) => m.pName === parentName)}</div>
      )}
    </div>
  );
};
export default TopSecondHeader;
