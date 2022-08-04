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
  EDIT,
  FACILITYNAME,
  NEWFACILITY,
  PLUSSIGN,
  TRANSFERREDFACILITIES,
  TRANSFERREDFACILITY,
} from "../../../constant/FieldConstant";

import { Button } from "reactstrap";
import transferredFacilityService from "../../../services/Master/transferredFacility.service";
import {
  ADDTRANSFERREDFACILITY,
  UPDATTRANSFERREDFACILITY,
} from "../../../constant/MessageConstant";
import SuccessAlert from "../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import AddEditTransferredFacility from "./AddEditTransferredFacility";
import { convertHTMLToPlain } from "../../../utils/Strings";

const ViewTransferredFacilities = () => {
  const [loading, setLoading] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
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
    getAlltransferredFacilityList();
  }, []);

  const getAlltransferredFacilityList = () => {
    setLoading(true);
    transferredFacilityService
      .getAlltransferredFacility()
      .then((response) => {
        setLoading(false);
        setFacilityList(response);
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
  const EditTransferredFacility = (item) => {
    setShowAddEditForm(true);
    setData({ item });
    setActionType(EDIT);
  };
  const DeleteTransferredFacility = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: TRANSFERREDFACILITY,
      message: TRANSFERREDFACILITY,
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
            onClick={() => EditTransferredFacility(cell)}
          >
            <img src={Icon} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => DeleteTransferredFacility(cell)}>
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
      transferredFacilityService
        .deletetransferredFacility(selectedRowData.id)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getAlltransferredFacilityList();
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
          ? ADDTRANSFERREDFACILITY
          : UPDATTRANSFERREDFACILITY,
        callback: () => {
          setShowSuccessAlert(false);
          getAlltransferredFacilityList();
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
      Header: FACILITYNAME,
      accessor: (d) => d.name,
      width: "43%",
    },
    {
      Header: DESCRIPTION,
      accessor: (d) => (d.description === null ? "" : d.description),
      Cell: GetDescription,
      width: "50%",
    },
  ]);
  const facilityTypeList = React.useMemo(() => facilityList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {TRANSFERREDFACILITIES}
          </div>
          <hr className="headerBorder" />
          <div style={{ fontSize: "14px" }}>
            This section allows you to record Facilities which your Residents
            transfer to when doing a Resident Refund.
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
            title={DELETE + " " + TRANSFERREDFACILITY}
          ></DeleteConfirmationModelAlert>

          <AddEditTransferredFacility
            type={actionType}
            Data={data}
            ShowModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
          />

          <Button
            className="addbtn btnfix btn btn-primary m-3 btnright"
            onClick={handleShow}
          >
            {PLUSSIGN} {NEWFACILITY}
          </Button>

          <ReactTable
            columns={columns}
            data={facilityTypeList}
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
export default ViewTransferredFacilities;
