import React, { useEffect, useState } from "react";
import Icon from "../../../assets/Images/icon.png";
import { NOTESANDLINKS } from "../../../constant/FieldConstant";
import { NOTES1, NOTES2, NOTES3 } from "../../../constant/MessageConstant";
import commonServices from "../../../services/Common/common.services";

const ViewNotesAndLinks = () => {
  const [loading, setLoading] = useState(false);
  const [notesList, setNotesList] = useState([]);

  const getNotesAndLinks = () => {
    setLoading(true);
    commonServices
      .getNotesAndLinks()
      .then((response) => {
        setLoading(false);
        setNotesList(response);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getNotesAndLinks();
  }, []);

  return (
    <div  style={{paddingBottom:"30px "}}>
      <div className="head mt-3">
        <img src={Icon} className="icon" alt="#" />
        {NOTESANDLINKS}
        <hr className="headerBorder" />
      </div>

      <div className="ps-2 ">
        <div style={{width:"95%"}}>{NOTES1}</div>
 
      </div>
      <br />
      {notesList.map((x) => {
        return (
          <>
            <div className="row notesnlinks">
              <span className="col-4" style={{ marginRight: "15px" }}>
                <b> {x.name}</b>
              </span>
              <span className="col">
                <a href={x.link} target="_blank">{x.link}</a>
              </span>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ViewNotesAndLinks;
