import Loader from "../../../components/Loader";
import Icon from "../../../../src/assets/Images/icon.png";
import Page from "../../../components/Page";
import ReactTable from "../../../components/ReactTable";
import React, { useEffect, useState } from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";

import {
  ACTION,
  ADD,
  DELETE,
  DESCRIPTION,
  DOCUMENTTYPE,
  DOCUMENTTYPES,
  EDIT,
  NEWTYPE,
  PLUSSIGN,
} from "../../../constant/FieldConstant";

import { Button } from "reactstrap";
import documentTypeService from "../../../services/Master/documentType.service";
import AddEditDocumnetType from "./AddEditDocumnetType";
import {
  ADDDOCUMENTTYPE,
  UPDATDOCUMENTTYPE,
} from "../../../constant/MessageConstant";
import SuccessAlert from "../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import { convertHTMLToPlain } from "../../../utils/Strings";

const ViewDocumentType = () => {
  const [loading, setLoading] = useState(false);
  const [DocumentTypeList, setDocumentTypeList] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [data, setData] = useState({});
  const [actionType, setActionType] = useState();
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});

  useEffect(() => {
    getAlldocumentTypesList();
  }, []);

  const getAlldocumentTypesList = () => {
    setLoading(true);
    documentTypeService
      .getAlldocumentTypes()
      .then((response) => {
        setLoading(false);
        setDocumentTypeList(response);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleShow = () => {
    setShowAddEditForm(true);
    setData({});
    setActionType(ADD);
  };
  const EditDocumentType = (item) => {
    setShowAddEditForm(true);
    setData({ item });
    setActionType(EDIT);
  };
  const DeleteDocumentType = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: DOCUMENTTYPE,
      message: DOCUMENTTYPE,
    });
    setSelectedRowData(item);
  };

  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Dropdown as={ButtonGroup} className="btn-group w-100">
        <Button className="dropdownAction">{ACTION}</Button>
        <Dropdown.Toggle split variant="" id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item
            id="dropdownBorder"
            onClick={() => EditDocumentType(cell)}
          >
            <img src={Icon} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => DeleteDocumentType(cell)}>
            <img src={Icon} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  const deleteConfirmationCallBack = (childdata, success) => {
    setShowDeleteConfirmationModal(childdata);
    if (success) {
      setLoading(true);
      documentTypeService.deleteDocumentType(selectedRowData.id).then(
        (data) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: data.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              getAlldocumentTypesList();
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
    setShowAddEditForm(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: msg
          ? msg
          : actionType === EDIT
          ? ADDDOCUMENTTYPE
          : UPDATDOCUMENTTYPE,
        callback: () => {
          setShowSuccessAlert(false);
          getAlldocumentTypesList();
        },
      });
      setShowSuccessAlert(true);
    }
  };
  const GetDescription = (props) => {
    const [showMore, setShowMore] = useState(false);
    return (
      <div>
        {showMore ? (
          <span dangerouslySetInnerHTML={{ __html: `${props.value}` }}></span>
        ) : (
          <span
            dangerouslySetInnerHTML={{
              __html: `${convertHTMLToPlain(props.value)?.substring(0, 170)}`,
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
  const columns = React.useMemo(() => [
    {
      Header: "",
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "8.20%",
    },
    {
      Header: DOCUMENTTYPE,
      accessor: (d) => d.name,
      width: "43%",
    },
    {
      Header: DESCRIPTION,
      accessor: (d) => d.description,
      Cell: GetDescription,
      width: "50%",
    },
  ]);
  const documentTypeList = React.useMemo(() => DocumentTypeList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="" style={{ width: "77% !important" }}>
          <div className="head mt-3 ">
            <img src={Icon} className="icon" />
            {DOCUMENTTYPES}
          </div>
          <hr className="headerBorder" />
          <div style={{ fontSize: "14px" }}>
            This sections allows you to add new Document Types for your Document
            & Logo.
          </div>
          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.actionType}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}
          <DeleteConfirmationModelAlert
            ShowDeleteModal={showDeleteConfirmationModal}
            Data={deleteConfirmationModalData}
            deleteConfirmationCallBack={deleteConfirmationCallBack}
            title={DELETE + " " + DOCUMENTTYPE}
          ></DeleteConfirmationModelAlert>

          <AddEditDocumnetType
            type={actionType}
            Data={data}
            ShowModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
          />

          <Button
            className="addbtn btnfix btn btn-primary m-3 btnright"
            onClick={handleShow}
          >
            {PLUSSIGN} {NEWTYPE}
          </Button>

          <ReactTable
            columns={columns}
            data={documentTypeList}
            rowProps={(row) => ({
              onClick: () => alert(JSON.stringify(row.values)),
              style: {
                cursor: "pointer",
              },
            })}
          />
        </Page>
      )}
    </>
  );
};
export default ViewDocumentType;
