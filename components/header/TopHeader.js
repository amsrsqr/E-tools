import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Images/eRAD_white_border.svg"; // eRAD.png";
import Profile from "../../assets/Images/user-avatar.png";
import GatewayIcon from "../../assets/Images/gateway-icon.png";
import {
  Navbar,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { TopHeaderData } from "./TopHeaderData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBuilding,
  faCog,
  faHeadset,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { SidebarData } from "./SidebarData";
import { encryptStorage } from "../../utils/EncryptStorage";
const TopHeader = ({
  callBackSelectedMenuName,
  callBackSelectedSideMenuName,
}) => {
  let navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState();
  useEffect(() => {
    setActive(encryptStorage.getItem("active"));
  }, []);
  useEffect(() => {
    encryptStorage.setItem("active", active);
  }, [active]);
  useEffect(() => {
    // const handleMenuClick = (menuName, isHavingSubMenues) => {
    const urlPath = TopHeaderData.filter(
      (n) => n.path.split("/").pop() === location.pathname?.split("/").pop()
    );
    // console.log("urlPath in useEffect", urlPath);
    if (urlPath.length > 0) {
      setActive(urlPath[0]?.id);
      //   handleMenuClick(urlPath[0]?.id);
      // }
      callBackSelectedMenuName(urlPath[0]);
    } else {
      const findParent = SidebarData.find(
        (ob) => ob.id === location.pathname?.split("/").pop()
      );
      // console.log("findParent", findParent);
      if (findParent) {
        setActive(findParent.parentId);
      } else {
        const setActiveSettings = location.pathname.split("/")[1];
        // console.log("setActiveSettings", setActiveSettings);
        if (setActiveSettings && setActiveSettings === "MainLayout") {
          handleMenuClick("Settings");
          setActive("Settings");
          navigate("eRADWeb/preferences", { replace: true });
          callBackSelectedSideMenuName("preferences");
        } else if (setActiveSettings && setActiveSettings === "facility") {
          handleMenuClick("Facility");
          setActive("Facility");
        }
      }
    }
    // };
  }, [location.pathname, active]);
  const handleMenuClick = (menuName, isHavingSubMenues) => {
    const urlPath = TopHeaderData.filter(
      (n) =>
        menuName === n.title &&
        n.screenName === location.pathname?.split("/").pop()
    );
    // console.log("hiii", location.pathname?.split("/").pop());
    if (urlPath && urlPath.length > 0) {
      callBackSelectedMenuName(urlPath[0]);
    }
  };
  return (
    <div>
      <Navbar id="topHeader" light expand="md">
        <div>
          <img src={Logo} className="navbarlogo" />
          <NavbarBrand
            className="text-white"
            style={{ fontSize: "16px", fontWeight: "bold" }}
          >
            e-Tools Refundable Accomodation Deposit
          </NavbarBrand>
        </div>
        <div className="col-6">
          <Nav className="collapse navbar-collapse justify-content-end" navbar>
            <div className="navlist">
              {TopHeaderData.map((item, index) => {
                // console.log("item in to header", item);
                // console.log("active menu", active, item.id);
                if (item.isHidden) {
                  return null;
                } else {
                  const tmp = item.hasSideMenu
                    ? item.hasSideMenu
                    : item.showSameActive;
                  return (
                    <li
                      key={index}
                      className={
                        active === item.id &&
                        (location.pathname
                          ?.split("/")
                          .pop()
                          .trim() === item.path?.split("/").pop() ||
                          active === tmp)
                          ? item.disabled == true
                            ? "nav-item topdata"
                            : "nav-item topdata active"
                          : item.disabled == true
                          ? "nav-item topdata"
                          : "nav-item topdata"
                      }
                      id={item.id}
                      onClick={() => {
                        setActive(item.id);
                      }}
                    >
                      <Link
                        className={item.cName}
                        to={item.path}
                        onClick={() => {
                          // handleMenuClick(item.id, item.isHavingSubMenues);
                        }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                }
              })}
            </div>
            <div className="text-white nav-icon d-flex">
              <FontAwesomeIcon
                icon={faCog}
                className="topnav-icons active"
                onClick={() => {
                  // handleMenuClick("Settings", true);
                  setActive("Settings");
                  navigate("MainLayout", { replace: true });
                }}
              />

              <FontAwesomeIcon
                icon={faBuilding}
                className="topnav-icons"
                onClick={() => {
                  handleMenuClick("Facility");
                  setActive("Facility");
                  navigate("eRADWeb/facility", { replace: true });
                }}
              />

              <div className="d-flex">
                <FontAwesomeIcon
                  icon={faBell}
                  className="topnav-icons"
                  onClick={() => {
                    handleMenuClick("Bell", false);
                    setActive("Bell");
                    // navigate("MainLayout", { replace: true });
                  }}
                />
                {/* <span className="notification-alert" /> */}
              </div>
            </div>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>
                <img src={Profile} className="profile-icon" />
              </DropdownToggle>
              <DropdownMenu className="topnav-dropdownmenu">
                <DropdownItem className="topnav-dropdownitem">
                  <FontAwesomeIcon icon={faHeadset} className="icons" />
                  <span className="ps-2"> Support </span>
                </DropdownItem>
                <DropdownItem
                  className="topnav-dropdownitem"
                  href="https://inteliment-neraweb.e-tools.com.au/eToolsGateway/UserDashboard"
                  style={{
                    textShadow: "none",
                    //borderBottomWidth: 'thin !important',
                  }}
                >
                  <img src={GatewayIcon} style={{ width: "18px" }} />
                  <span className="ps-2"> Gateway </span>
                </DropdownItem>
                <DropdownItem>
                  <FontAwesomeIcon icon={faSignOutAlt} className="icons" />
                  <span className="ps-2"> Log Out </span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </div>
      </Navbar>
    </div>
  );
};
export default TopHeader;
