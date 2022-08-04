import React, { useState, useEffect } from "react";
import {
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Page from "../../../components/Page";
import Icon from "../../../../src/assets/Images/icon.png";
import ReactTable from "../../../components/ReactTable";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import ArchiveConfirmationModelAlert from "../../../components/ArchiveConfirmationModelAlert";
import {
  NAME,
  ACTION,
  ADD,
  EDIT,
  RESIDENTLETTER,
  DELETE,
  STATUS,
  DESCRIPTION,
  DOWNLOAD,
  COLONSIGN,
  SHOWING,
  LETTER,
  PLUSSIGN,
  ARCHIVE,
  RESIDENTLETTERS,
} from "../../../constant/FieldConstant";
import Logo from "../../../assets/Images/icon.png";
import Loader from "../../../components/Loader";
import residentLetterServices from "../../../services/Master/residentLetter.services";
import AddResidentLetter from "./AddResidentLetter";
import {
  ADDRESIDENTLETTER,
  UPDATERESIDENTLETTER,
} from "../../../constant/MessageConstant";
import SuccessAlert from "../../../components/SuccessAlert";
import Select from "react-select";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { convertHTMLToPlain } from "../../../utils/Strings";

const ViewResidentLetter = () => {
  const [residentLetters, setResidentLetter] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedRowDataForArchive, setSelectedRowDataForArchive] = useState(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [showResidentModel, setShowResidentModel] = useState(false);
  const [data, setData] = useState({});
  const [type, setType] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [
    showArchiveConfirmationModal,
    setShowArchiveConfirmationModal,
  ] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [
    archiveConfirmationModalData,
    setArchiveConfirmationModelData,
  ] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("Active");

  const statusList = [
    { value: "Active", label: "Active" },
    { value: "Archived", label: "Archived" },
    { value: "All", label: "All" },
  ];
  const getAllResidentLetters = (status) => {
    setLoading(true);
    residentLetterServices.getAllResidentLetters(status).then(
      (response) => {
        setLoading(false);
        //setResidentLetter(response);
        const resultnew = Array.from(response).filter(
          (m) => m.status === selectedStatus.toString()
        );
        setResidentLetter(resultnew);
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  const getAllResidentLettersWithFilter = (status, selectedStatus) => {
    setLoading(true);
    console.log("status", status);
    residentLetterServices.getAllResidentLetters(status).then(
      (response) => {
        setLoading(false);
        //setResidentLetter(response);
        if (status === null) {
          setResidentLetter(response);
        } else {
          const resultnew = Array.from(response).filter(
            (m) => m.status === selectedStatus.toString()
          );
          setResidentLetter(resultnew);
        }
      },
      (error) => {
        setLoading(false);
      }
    );
  };
  const deleteResidentLetter = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: RESIDENTLETTER,
      message: RESIDENTLETTER,
    });
    setSelectedRowData(item);
  };
  const archievResidentLetter = (item) => {
    setShowArchiveConfirmationModal(true);
    setArchiveConfirmationModelData({
      header: RESIDENTLETTER,
      message: RESIDENTLETTER,
    });
    setSelectedRowDataForArchive(item);
  };
  const archiveConfirmationCallBack = (childdata, success) => {
    setShowArchiveConfirmationModal(childdata);
    if (success) {
      setLoading(true);

      if (selectedRowDataForArchive) {
        residentLetterServices
          .archieveResidentLetterTemplate(selectedRowDataForArchive.id)
          .then(
            (data) => {
              setLoading(false);
              setSuccessAlertOptions({
                title: "",
                type: "Archived",
                msg: data,
                callback: (value) => {
                  setShowSuccessAlert(false);
                  getAllResidentLetters(
                    selectedStatus === "Active" ? true : false
                  );
                },
              });
              setShowSuccessAlert(true);
            },
            (error) => {
              setLoading(false);
            }
          );
      }
    }
  };

  const deleteConfirmationCallBack = (childdata, success) => {
    setShowDeleteConfirmationModal(childdata);
    if (success) {
      setLoading(true);

      residentLetterServices
        .deleteResidentLetterTemplate(selectedRowData.id)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              type: "Delete",
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getAllResidentLetters(
                  selectedStatus === "Active" ? true : false
                );
              },
            });
            setShowSuccessAlert(true);
          },
          (error) => {
            setLoading(false);
          }
        );
    }
  };
  const callBackAddEditFormToViewForm = (childdata, success, msg = null) => {
    setShowResidentModel(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        type,
        msg: msg
          ? msg
          : type === "Edit"
          ? ADDRESIDENTLETTER
          : UPDATERESIDENTLETTER,
        callback: () => {
          setShowSuccessAlert(false);
          getAllResidentLetters();
          getAllResidentLetters(selectedStatus === "Active" ? true : false);
        },
      });
      setShowSuccessAlert(true);
    }
  };

  useEffect(() => {
    getAllResidentLetters(selectedStatus === "Active" ? true : false);
  }, []);

  function AddResidentLetterTemplate() {
    setShowResidentModel(true);
    setData({});
    setType(ADD);
  }
  const EditResidentLetterTemplate = (item) => {
    setShowResidentModel(true);
    setData({ item });
    setType(EDIT);
  };

  function getActiveResidentLetterList() {
    getAllResidentLetters(true);
  }
  function getArchivedResidentLetterList() {
    getAllResidentLetters(false);
  }

  const handleSelectChange = (selected) => {
    if (selected.value == "Active") {
      getActiveResidentLetterList();
      setSelectedStatus(selected.value);
    }
    if (selected.value == "Archived") {
      getArchivedResidentLetterList();
      setSelectedStatus(selected.value);
    }
  };

  // function linkFormatter(cell, row, rowIndex, formatExtraData) {

  // let selectedStatus1=selectedStatus;
  //   return (
  //     <UncontrolledButtonDropdown className="dropdownbtn">
  //       <DropdownToggle className="dropdown-toggle" color="light">
  //         <span className="tabledropdownaction"> Action </span>{" "}
  //         <span className="tabledropdownline"> </span>
  //       </DropdownToggle>
  //       <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
  //         <DropdownItem
  //           id="dropdownBorder"
  //           onClick={() => EditResidentLetterTemplate(cell)}
  //         >
  //           <img src={Logo} className="icon" alt="#" />
  //           {EDIT}
  //         </DropdownItem>
  //         <DropdownItem  id={cell.status === "Active"?"dropdownBorder":"dropdownBorder1"} onClick={() => deleteResidentLetter(cell)}>
  //           <img src={Logo} className="icon" alt="#" />
  //           {DELETE}
  //         </DropdownItem>
  //        <DropdownItem onClick={() => archievResidentLetter(cell)} style={{display:cell.status != "Active"?'none':'block'}}>
  //           <img src={Logo} className="icon" alt="#" />
  //            {ARCHIVE}
  //         </DropdownItem>
  //       </DropdownMenu>
  //     </UncontrolledButtonDropdown>
  //   );
  // }

  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Dropdown as={ButtonGroup} className="btn-group w-100">
        <Button className="dropdownAction">{ACTION}</Button>
        <Dropdown.Toggle split variant="" id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item
            id="dropdownBorder"
            onClick={() => EditResidentLetterTemplate(cell)}
          >
            <img src={Logo} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          <Dropdown.Item
            id={cell.status === "Active" ? "dropdownBorder" : "dropdownBorder1"}
            onClick={() => deleteResidentLetter(cell)}
          >
            <img src={Logo} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => archievResidentLetter(cell)}
            style={{ display: cell.status != "Active" ? "none" : "block" }}
          >
            <img src={Logo} className="icon" alt="#" />
            {ARCHIVE}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function downloadFileFromServer(cell) {
    setLoading(true);
    residentLetterServices
      .getDownloadedFile(cell.fileName, cell.displayFileName)
      .then(
        (data) => {
          setLoading(false);
        },
        (error) => {
          setLoading(false);
        }
      );
  }

  function downloadFile(cell) {
    return (
      <Button
        className="form-control addbtn btn btn-primary"
        onClick={() => {
          downloadFileFromServer(cell);
        }}
      >
        Download
      </Button>
    );
  }

  function getFileStatus(cell) {
    return (
      <Button
        style={{ pointerEvents: "none" }}
        className={
          cell.status == "Active"
            ? "text-white form-control activebtn btn btn-success btn-sm"
            : "text-white form-control archievedbtn btn btn-warning btn-sm"
        }
      >
        {cell.status}
      </Button>
    );
  }

  const GetDescription = (props) => {
    const [showMore, setShowMore] = useState(false);
    return (
      <div>
        {showMore ? (
          <span dangerouslySetInnerHTML={{ __html: `${props.value}` }}></span>
        ) : (
          <span
            dangerouslySetInnerHTML={{
              __html: `${convertHTMLToPlain(props.value)?.substring(0, 170)} `,
            }}
          ></span>
        )}
        <p
          style={{
            color: "blue",
            cursor: "pointer",
            fontSize: "12px",
            // marginTop: "-5px",
            marginBottom: "0rem",
            textAlign: "right",
          }}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore
            ? "Show less"
            : props.value?.length > 170
            ? "Show more"
            : ""}
        </p>
      </div>

      // <div dangerouslySetInnerHTML={{ __html: `<p>${props.value}</p>` }} />
    );
  };

  function getHistory(cell) {
    return (
      <div>
        Uploded By : {cell.createdBy}
        <br></br>
        Last Modified : {cell.modifiedBy}
      </div>
    );
  }

  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Filter: false,
        disableSortBy: true,
        accessor: linkFormatter,
        width: "8.20%",
      },
      {
        Header: NAME.charAt(0).toUpperCase() + NAME.substr(1).toLowerCase(),
        accessor: NAME,
        width: "30%",
      },
      {
        Header: STATUS,
        Filter: false,
        disableSortBy: true,
        accessor: getFileStatus,
        width: "10%",
      },
      {
        Header: DESCRIPTION,
        accessor: "description",
        Cell: GetDescription,
        width: "23%",
      },
      {
        Header: "History",
        //accessor: "description",
        accessor: getHistory,
        width: "20%",
      },
      {
        Header: DOWNLOAD,
        Filter: false,
        disableSortBy: true,
        accessor: downloadFile,
        width: "10%",
      },
    ],
    []
  );

  const residentLetterList = React.useMemo(() => residentLetters);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title={RESIDENTLETTERS}>
          <div className="head mt-3">
          <img src={Icon} className="icon" />
            {RESIDENTLETTERS}</div>
          <hr className="headerBorder" />

          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.type}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}

          <AddResidentLetter
            Type={type}
            Data={data}
            ShowModel={showResidentModel}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
          />
          <DeleteConfirmationModelAlert
            ShowDeleteModal={showDeleteConfirmationModal}
            Data={deleteConfirmationModalData}
            deleteConfirmationCallBack={deleteConfirmationCallBack}
            title={DELETE + " " + RESIDENTLETTER}
          ></DeleteConfirmationModelAlert>

          <ArchiveConfirmationModelAlert
            ShowDeleteModal={showArchiveConfirmationModal}
            Data={archiveConfirmationModalData}
            archiveConfirmationCallBack={archiveConfirmationCallBack}
            title={DELETE + " " + RESIDENTLETTER}
          ></ArchiveConfirmationModelAlert>

          <div className="active-archivebtn" style={{ left: "15%" }}>
            <div className="p-2">
              {SHOWING}
              {COLONSIGN}
            </div>
            <Select
              name="select"
              id="exampleSelect"
              options={statusList}
              onChange={(selected) => {
                setSelectedStatus(selected.value);
                if (selected.value !== selectedStatus) {
                  getAllResidentLettersWithFilter(
                    selected.value == "Active"
                      ? true
                      : selected.value === "Archived"
                      ? false
                      : null,
                    selected.value
                  );
                }
              }}
              defaultValue={{ value: selectedStatus, label: selectedStatus }}
              isSearchable={statusList.length < 5 ? false : true}
            />
          </div>
          <Button
            className="addbtn btnfix btn btn-primary  m-2 btnright justify-content-end"
            onClick={AddResidentLetterTemplate}
          >
            {PLUSSIGN} {ADD} {LETTER}
          </Button>
          <ReactTable columns={columns} data={residentLetterList} />
        </Page>
      )}
    </>
  );
};

export default ViewResidentLetter;
