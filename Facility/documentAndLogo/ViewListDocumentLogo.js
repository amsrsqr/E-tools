import React, { useState, useEffect } from "react";
import {
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Page from "../../../components/Page";
import ReactTable from "../../../components/ReactTable";
import ArchiveConfirmationModelAlert from "../../../components/ArchiveConfirmationModelAlert";
import Select from "react-select";
import {
  ACTION,
  ADD,
  EDIT,
  DELETE,
  STATUS,
  TYPE,
  COMMENT,
  LASTMODIFIEDBY,
  PLUSSIGN,
  ARCHIVE,
  //NAMECAP,
  //EDITDOCUMENT,
  ACTIVE,
  ARCHIVED,
  NAMECAP,
} from "../../../constant/FieldConstant";
import Logo from "../../../assets/Images/icon.png";

import {
  ADDDOCUMENT,
  DOCUMENT,
  DOCUMENTNAME,
  EDITDOCUMENT,
  NEW,
} from "../../../constant/MessageConstant";
import SuccessAlert from "../../../components/SuccessAlert";
//import headOfficeDocumentLogoServices from "../../../services/Master/headOfficeDocumentLogo.services";
//import facilityServiceDetailsServices from "../../../services/Facility/facilityServiceDetails.services";
import AddEditDocumentLogo from "../documentAndLogo/AddEditDocumentLogo";
import moment from "moment";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import Loader from "../../../components/Loader";
import facilityServiceDetailsServices from "../../../services/Facility/facilityServiceDetails.services";
import { convertHTMLToPlain } from "../../../utils/Strings";

const ViewListDocumentLogo = ({ facilityId }) => {
  const [documentLogo, setDocumentLogo] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedRowDataForArchive, setSelectedRowDataForArchive] = useState(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [showResidentModel, setShowResidentModel] = useState(false);
  const [data, setData] = useState({});
  const [type, setType] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [facilityid, setFacilityId] = useState("");
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
  const [selectedStatus, setSelectedStatus] = useState({
    value: "Active",
    label: "Active",
  });

  const options = [
    { value: "Active", label: "Active" },
    { value: "Archived", label: "Archived" },
    { value: "All", label: "All" },
  ];

  useEffect(() => {
    console.log("facilityId....", facilityId);
    if (facilityId) {
      setFacilityId(facilityId);
      setSelectedStatus({ value: "Active", label: "Active" });
      getAllFacilityDocumentLogo(facilityId, selectedStatus.value);
    }
  }, [facilityId]);

  useEffect(() => {
    getAllFacilityDocumentLogo(facilityId, selectedStatus.value);
  }, [selectedStatus]);

  const archievDocumentLogo = (item) => {
    setShowArchiveConfirmationModal(true);
    setArchiveConfirmationModelData({
      header: ARCHIVE,
      message: DOCUMENTNAME,
    });
    setSelectedRowDataForArchive(item);
  };

  const archiveConfirmationCallBack = (childdata, success) => {
    setShowArchiveConfirmationModal(childdata);
    if (success) {
      setLoading(true);

      if (selectedRowDataForArchive) {
        facilityServiceDetailsServices
          .archieveFacilityDocumentLogo(selectedRowDataForArchive.id)
          .then(
            (data) => {
              setLoading(false);
              setSuccessAlertOptions({
                title: "",
                type: ARCHIVE,
                msg: data,
                callback: (value) => {
                  setShowSuccessAlert(false);
                  getAllFacilityDocumentLogo(facilityid, selectedStatus.value);
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
      facilityServiceDetailsServices
        .deleteFacilityDocumentLogo(selectedRowData.id)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              type: "Delete",
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getAllFacilityDocumentLogo(facilityId, selectedStatus.value);
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

  const getDocumentLogoListWithFilter = (selectedStatus) => {
    setLoading(true);

    getAllFacilityDocumentLogo(facilityid, selectedStatus);
  };

  const callBackAddEditFormToViewForm = (childdata, success, msg = null) => {
    debugger;
    setShowResidentModel(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        type,
        msg: msg ? msg : type === "Edit" ? ADDDOCUMENT : EDITDOCUMENT,
        callback: () => {
          setShowSuccessAlert(false);
          setSelectedStatus({ value: "Active", label: "Active" });
          getAllFacilityDocumentLogo(facilityid, selectedStatus.value);
        },
      });
      setShowSuccessAlert(true);
    }
  };
  const deleteDocument = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: DOCUMENTNAME,
      message: DOCUMENTNAME,
    });
    setSelectedRowData(item);
  };

  const getAllFacilityDocumentLogo = (facilityid, type) => {
    setLoading(true);
    setDocumentLogo([]);
    facilityServiceDetailsServices.getAllFacilityDocumentLogo(facilityid).then(
      (response) => {
        setLoading(false);
        let arr = JSON.parse(JSON.stringify(response));
        console.log(arr);
        if (type === "All") {
          setDocumentLogo(arr);
        } else {
          let filteredArr = arr.filter((obj) => {
            return obj.status === type;
          });
          console.log("filteredArr", filteredArr);
          setDocumentLogo(filteredArr);
        }
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  function AddDocumentLogo() {
    setShowResidentModel(true);
    setData({});
    setType(ADD);
  }
  const EditDocumentLogo = (item) => {
    setShowResidentModel(true);
    setData({ item });
    setType(EDIT);
  };

  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Dropdown as={ButtonGroup} className="btn-group w-100">
        <Button className="dropdownAction">{ACTION}</Button>
        <Dropdown.Toggle split variant="" id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item
            id="dropdownBorder"
            onClick={() => EditDocumentLogo(cell)}
          >
            <img src={Logo} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          {cell.status === "Active" ? (
            <Dropdown.Item
              id="dropdownBorder"
              onClick={() => archievDocumentLogo(cell)}
            >
              <img src={Logo} className="icon" alt="#" />
              {ARCHIVE}
            </Dropdown.Item>
          ) : null}
          <Dropdown.Item onClick={() => deleteDocument(cell)}>
            <img src={Logo} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  function downloadFileFromServer(cell) {
    setLoading(true);
    facilityServiceDetailsServices.getDownloadedFile(cell.fileName).then(
      (data) => {
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  }

  const getDownloadFile = (props) => {
    return (
      <a
        style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
        onClick={() => {
          downloadFileFromServer(props.cell.row.original);
        }}
      >
        {props.cell.row.original.displayFileName}
      </a>
    );
  };

  function getFileStatus(cell) {
    return (
      <Button
        className={
          cell.status == "Active"
            ? "text-white form-control activebtn btn btn-success btn-sm "
            : "text-white form-control archievedbtn btn btn-warning btn-sm "
        }
        style={{ pointerEvents: "none", margin: "auto" }}
      >
        {cell.status === "Active" ? "Active" : "Archived"}
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
            fontSize: "12px", // marginTop: "-5px",
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
  function getLastModified(cell) {
    if (cell.lastUpdated !== null) {
      const tempDateCreatedBy = moment(cell.lastUpdated).format("DD/MM/YYYY");
      const tempTimeCreatedBy = moment(cell.lastUpdated).format("hh:mm a");
      return (
        <div>
          <span>{cell.updatedBy}</span>
          <br />
          <span className="">
            {tempDateCreatedBy}, {tempTimeCreatedBy}
          </span>
        </div>
      );
    } else {
      const tempDateCreatedBy = "";
      const tempTimeCreatedBy = "";
      return (
        <div>
          <span>{cell.updatedBy}</span>
          <br />
          <span className="">
            {tempDateCreatedBy}
            {tempTimeCreatedBy}
          </span>
        </div>
      );
    }
  }

  const columns = React.useMemo(
    () => [
      {
        id: ACTION,
        Header: " ",
        Filter: false,
        accessor: linkFormatter,
        disableSortBy: true,
        width: "8%",
      },

      {
        Header: STATUS,
        Filter: false,
        disableSortBy: true,
        accessor: getFileStatus,
        width: "8%",
      },
      {
        Header: TYPE,
        accessor: "type",
        width: "16%",
      },
      {
        Header: NAMECAP,
        accessor: (d) => d.fileName,
        Cell: getDownloadFile,
        width: "22%",
      },
      {
        Header: COMMENT,
        accessor: (d) => (d.comment ? d.comment : ""),
        Cell: GetDescription,
        width: "31%",
      },
      {
        Header: LASTMODIFIEDBY,
        Filter: false,
        disableSortBy: true,
        accessor: getLastModified,
        width: "15%",
      },
    ],
    []
  );
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: 140,
    }),
  };
  const documentLogoList = React.useMemo(() => documentLogo);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title={""}>
          <br />

          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.type}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}

          <AddEditDocumentLogo
            Type={type}
            Data={data}
            ShowModel={showResidentModel}
            facilityid={facilityid ? facilityid : ""}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
          />
          <DeleteConfirmationModelAlert
            ShowDeleteModal={showDeleteConfirmationModal}
            Data={deleteConfirmationModalData}
            deleteConfirmationCallBack={deleteConfirmationCallBack}
            title={DELETE + " " + DOCUMENTNAME}
          ></DeleteConfirmationModelAlert>

          <div className="active-archivebtndocument labelsize">
            <div style={{ padding: "9px", fontSize: "14px", marginTop: "5px" }}>
              {" "}
              Showing :
            </div>
            <div style={{ fontSize: "14px", marginTop: "6px" }}>
              <Select
                styles={customStyles}
                name="select"
                id="exampleSelect"
                onChange={(state) => {
                  console.log(state);
                  setSelectedStatus(state);
                  if (state.value !== selectedStatus.value) {
                    getDocumentLogoListWithFilter(state.value);
                  }
                }}
                options={options}
                defaultValue={selectedStatus}
                isSearchable={options.length < 5 ? false : true}
              ></Select>
            </div>
          </div>

          <ArchiveConfirmationModelAlert
            ShowDeleteModal={showArchiveConfirmationModal}
            Data={archiveConfirmationModalData}
            archiveConfirmationCallBack={archiveConfirmationCallBack}
            title={DELETE + " " + DOCUMENT}
          ></ArchiveConfirmationModelAlert>

          <Button
            className="addbtn btn btn-primary btnright justify-content-end btnfix"
            style={{ marginTop: "14px" }}
            onClick={AddDocumentLogo}
          >
            {PLUSSIGN} {NEW} {DOCUMENTNAME}
          </Button>
          <ReactTable columns={columns} data={documentLogoList} />
        </Page>
      )}
    </>
  );
};

export default ViewListDocumentLogo;
