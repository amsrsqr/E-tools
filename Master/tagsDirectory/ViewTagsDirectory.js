import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import Icon from "../../../../src/assets/Images/icon.png";
import Page from "../../../components/Page";
import ReactTable from "../../../components/ReactTable";
import { TAGSDIRECTORY } from "../../../constant/FieldConstant";
import tagsDirectoryServices from "../../../services/Master/tagsDirectory.services";
import { DESCRIPTION, EXAMPLE, TAG } from "./../../../constant/FieldConstant";
import {
  TAGDIRECTORYMESSAGLINETWO,
  TAGDIRECTORYMESSAGLINEONE,
  TAGDIRECTORYMESSAGLINETHREE,
} from "../../../constant/MessageConstant";

const ViewTagsDirectory = () => {
  const [loading, setLoading] = useState(false);
  const [tagsDirectoryList, settagsDirectoryList] = useState([]);

  useEffect(() => {
    getAlltagsDirectoryList();
  }, []);

  const getAlltagsDirectoryList = () => {
    setLoading(true);
    tagsDirectoryServices
      .getAlltagsDirectory()
      .then((response) => {
        setLoading(false);
        settagsDirectoryList(response);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: TAG,
        accessor: (d) => d.tag,
        width: "30%",
      },
      {
        Header: DESCRIPTION,
        accessor: (d) => d.description,
        width: "40%",
      },
      {
        Header: EXAMPLE,
        Filter: false,
        disableSortBy: true,
        accessor: (d) => d.example,
        width: "30%",
      },
    ],
    []
  );

  const viewDataList = React.useMemo(() => tagsDirectoryList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title={TAGSDIRECTORY}>
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {TAGSDIRECTORY}
          </div>
          <hr className="headerBorder" />
          <div className="ps-2">
            <div>{TAGDIRECTORYMESSAGLINEONE}</div> <br />
            <div>{TAGDIRECTORYMESSAGLINETWO}  </div>
            <br></br>
            <div>{TAGDIRECTORYMESSAGLINETHREE}</div>
            <br />
          </div>
          <ReactTable columns={columns} data={viewDataList} />
        </Page>
      )}
    </>
  );
};
export default ViewTagsDirectory;
