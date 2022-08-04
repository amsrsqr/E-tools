import Loader from "../../../components/Loader";
import Icon from "../../../../src/assets/Images/icon.png";
import Page from "../../../components/Page";
import ReactTable from "../../../components/ReactTable";
import React, { useEffect, useState } from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import Select from "react-select";

import {
  ACTION,
  ADD,
  ADDITIONALPERIODRULES,
  DELETE,
  DOCUMENTTYPE,
  EDIT,
  PLUSSIGN,
  OPTIONAL,
  ADDRULE,
  SHOWING,
  COLONSIGN,
  ADDITIONALPERIODRULE,
} from "../../../constant/FieldConstant";

import { Button } from "reactstrap";
import radRacDeductionRuleService from "../../../services/Resident/additionalPeriodRules.service";
import SuccessAlert from "../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import AddEditAdditionalPeriodRules from "./AddEditAdditionalPeriodRules";
import moment from "moment";
import AmountFormat from "./../../../utils/AmountFormat";
import { convertHTMLToPlain } from "../../../utils/Strings";

const ViewAdditionalPeriodRules = ({
  residentId,
  getCancelData,
  handleIsAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [additionalPeriodRulesList, setAdditionalPeriodRulesList] = useState(
    []
  );
  const [
    additionalPeriodRulesListCpy,
    setAdditionalPeriodRulesListCpy,
  ] = useState([]);
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
  const [createdResidentId, setCreatedResidentId] = useState(null);
  const [racRuleStatuses, setRacRuleStatuses] = useState([]);
  const [ruleStatuses, setRuleStatuses] = useState(null);
  // const radId = localStorage.getItem("PaymentRadId");
  const radId = Number(localStorage.getItem("PaymentRadId"));

  const [cancelData, setCancelData] = useState([]);

  useEffect(() => {
    if (createdResidentId) {
      getAllAdditionalPeriodRulesList(createdResidentId, "firstCall");
    }
  }, [createdResidentId]);

  useEffect(() => {
    console.log("cancelData", cancelData);
    getCancelData(cancelData);
  }, [cancelData]);

  useEffect(() => {
    setCreatedResidentId(residentId);
  }, [residentId]);

  useEffect(() => {
    console.log(
      "additionalPeriodRulesListCpy in useEffect",
      additionalPeriodRulesListCpy
    );
  }, [additionalPeriodRulesListCpy]);

  const getAllAdditionalPeriodRulesList = (id, firstCall) => {
    const radId = Number(localStorage.getItem("PaymentRadId"));
    console.log("radId", radId);
    setLoading(true);
    if (radId) {
      radRacDeductionRuleService
        .GetListOfRadRacDeductionRule(radId)
        .then((response1) => {
          //setLoading(false);
          radRacDeductionRuleService
            .GetListOfRadRacRuleStatuses()
            .then((response) => {
              setLoading(false);
              const result = response.result.map((x, index) => {
                x.label = x.name;
                x.value = x.id;
                return x;
              });
              setRacRuleStatuses(result);
              setRuleStatuses(result[0]);
              const resultnew = Array.from(response1.result).filter(
                (m) => m.status === result[0].name
              );
              setAdditionalPeriodRulesList(resultnew);

              if (firstCall === "firstCall") {
                setAdditionalPeriodRulesListCpy(resultnew);
              }
            })
            .catch(() => {
              setLoading(false);
            });
        })
        .catch(() => {
          setLoading(false);
        });
    }
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
  const DeleteRule = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: ADDITIONALPERIODRULE,
      message: ADDITIONALPERIODRULE,
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
          <Dropdown.Item onClick={() => DeleteRule(cell)}>
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
      radRacDeductionRuleService.deleteDeductionRule(selectedRowData.id).then(
        (data) => {
          setLoading(false);
          setSuccessAlertOptions({
            title: "",
            actionType: DELETE,
            msg: data.message,
            callback: (value) => {
              setShowSuccessAlert(false);
              getAllAdditionalPeriodRulesList();
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
          ? "Additional Period Rule details Update"
          : "Additional Period Rule details added",
        callback: () => {
          setShowSuccessAlert(false);
          getAllAdditionalPeriodRulesList();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const UpdateCancelCallback = (updatedRecordID) => {
    console.log("UpdateCancelCallback updatedRecordID", updatedRecordID);

    // additionalPeriodRulesListCpy

    if (
      additionalPeriodRulesListCpy &&
      additionalPeriodRulesListCpy.length > 0
    ) {
      const foundItem = additionalPeriodRulesListCpy.find(
        (ob) => ob.id === updatedRecordID
      );

      if (foundItem !== null || foundItem !== undefined) {
        delete foundItem.deductionType;
        delete foundItem.isUpdated;
        delete foundItem.status;
      }

      //console.log("UpdateCancelCallback foundItem", foundItem);

      if (cancelData && cancelData.length > 0) {
        setCancelData([...cancelData, foundItem]);
      } else {
        setCancelData([foundItem]);
      }
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
            // marginTop: "-10px",
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
  const changeFilter = (selectedStatus) => {
    console.log("filter ", selectedStatus.name);
    setLoading(true);
    radRacDeductionRuleService
      .GetListOfRadRacDeductionRule(radId)
      .then((response) => {
        setLoading(false);
        if (selectedStatus.name === "All") {
          setAdditionalPeriodRulesList(response.result);
        } else {
          const resultnew = Array.from(response.result).filter(
            (m) => m.status === selectedStatus.name
          );
          setAdditionalPeriodRulesList(resultnew);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  function getFileStatus(cell) {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Button
          className={
            cell.status == "Current"
              ? "text-white form-control activebtn btn btn-success btn-sm "
              : " bg-danger form-control successbtn btn btn-danger btn-sm"
          }
          //bg-danger form-control activebtn btn btn-success btn-sm
        >
          {cell.status}
        </Button>
      </div>
    );
  }

  const getFee = (cell) => {
    const newFormat = AmountFormat(cell.amount);
    return newFormat;
  };

  const columns = React.useMemo(() => [
    {
      Header: "",
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "6.10%",
    },
    {
      Header: "Rule Type",
      accessor: (d) => d.deductionType,
      width: "20%",
    },
    {
      Header: "Start Date",
      Filter: false,
      accessor: (d) => moment(d.startDate).format("MM/DD/YYYY"),
      Cell: ({ cell: { value } }) => (
        <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
      ),
      width: "10%",
    },
    {
      Header: "End Date",
      Filter: false,
      accessor: (d) => moment(d.endDate).format("MM/DD/YYYY"),
      Cell: ({ cell: { value } }) => (
        <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
      ),
      width: "10%",
    },
    {
      Header: "Amount",
      // Filter: false,
      disableSortBy: true,
      accessor: getFee,
      // accessor: (d) => `$` + d.amount,
      width: "13%",
    },
    {
      Header: "Status",
      Filter: false,
      disableSortBy: true,
      accessor: getFileStatus,
      width: "10%",
    },
    {
      Header: "User Comment",
      accessor: "comment",
      Cell: GetDescription,
      width: "571px",
    },
  ]);
  const additionalRulesList = React.useMemo(() => additionalPeriodRulesList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {ADDITIONALPERIODRULES} ({OPTIONAL})
          </div>
          <hr className="headerBorder" />
          <div style={{ fontSize: "14px", paddingBottom: "25px" }}>
            This section allows you to add reoccurring calculations to the EoP
            (End of Period).
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

          <AddEditAdditionalPeriodRules
            type={actionType}
            Data={data}
            ShowModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            UpdateCancelCallback={UpdateCancelCallback}
            handleIsAdded={handleIsAdded}
          />

          <div className="showingdropdown">
            <div className="p-2">
              {SHOWING}
              {COLONSIGN}
            </div>
            <Select
              name="select"
              id="exampleSelect"
              options={racRuleStatuses}
              value={ruleStatuses}
              onChange={(selected) => {
                setRuleStatuses(selected);
                changeFilter(selected);
              }}
              isSearchable={racRuleStatuses.length < 5 ? false : true}
              //defaultValue={selectedStatus}
            />
          </div>
          <Button
            className="addbtn btnfix btn btn-primary m-3 btnright"
            onClick={handleShow}
          >
            {PLUSSIGN}
            {ADDRULE}
          </Button>
          <ReactTable columns={columns} data={additionalRulesList} />
        </Page>
      )}
    </>
  );
};
export default ViewAdditionalPeriodRules;
