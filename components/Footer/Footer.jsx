import React from "react";
import etools from "../../assets/Images/logo@2x.png";
export default function Footer() {
  return (
    <div>
      <div className="d-flex justify-content-between footer">
        <div>
          <img src={etools} className="footericon" />
          <span className="website-title">
            {" "}
            © 2022 - e-Tools Software Pty Ltd.
          </span>
        </div>
        <div className="website-version">Version : {"1.0.0.9"}</div>
      </div>
    </div>
  );
}
