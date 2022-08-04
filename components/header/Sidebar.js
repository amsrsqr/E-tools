import { Link, NavLink } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { useEffect, useState } from "react";

const Sidebar = ({ parentId, callBackSelectedSideBarMenuName }) => {
  const [activeSidebar, setActiveSidebar] = useState("");

  // useEffect(() => {
  //   setActiveSidebar(window.sessionStorage.getItem("activeSidebar"));
  // }, []);

  // useEffect(() => {
  //   setActiveSidebar(window.sessionStorage.getItem("activeSidebar"));
  // }, [window.sessionStorage.getItem("activeSidebar")]);

  // const handleMenuClick = (sideMenuName) => {
  //   callBackSelectedSideBarMenuName(sideMenuName);
  // };
  return (
    <div>
      {SidebarData.find((m) => m.parentId === parentId) !== undefined ? (
        <nav
          className="navbar-light navw300 position-absolute text-black"
          style={{ borderTop: "3px solid #896cc4" }}
        >
          {SidebarData.filter((m) => m.parentId === parentId).map(
            (item, index) => {
              return (
                <NavLink
                  key={index}
                  id={index.id}
                  end
                  to={item.path}
                  className={item.cName}
                >
                  {item.title}
                </NavLink>
              );
            }
          )}
          {/* 
         <ul className="drawer-nav list-unstyled">
            {SidebarData.filter((m) => m.parentId === parentId).map(
              (item, index) => { 
                return (
                  
                  <li
                    key={index}
                    className={
                      activeSidebar===item.id
                        ? 'sidenav nav-link text-secondary text-left active'
                        : 'sidenav nav-link text-secondary text-left'
                    }
                     id={item.id}                   
                  >
                    <Link className={item.cName} to={item.path}  onClick={() => {
                      setActiveSidebar(item.id);
                      handleMenuClick(item.id);
                    }}>
                      {item.title}
                    </Link>
                  </li>
                );
              }
            )}
          </ul> */}
          {/* <ul className="drawer-nav list-unstyled">
            {SidebarData.filter((m) => m.parentId === parentId).map(
              (item, index) => { 
                return (
                  
                  <li
                    key={index}
                    className={
                      activeSidebar===item.id
                        ? 'sidenav nav-link text-secondary text-left active'
                        : 'sidenav nav-link text-secondary text-left'
                    }
                     id={item.id}                   
                  >
                    <Link className={item.cName} to={item.path}  onClick={() => {
                      setActiveSidebar(item.id);
                      handleMenuClick(item.id);
                    }}>
                      {item.title}
                    </Link>
                  </li>
                );
              }
            )}
          </ul> */}
          <br />
        </nav>
      ) : (
        <div></div>
      )}{" "}
    </div>
  );
};

export default Sidebar;
