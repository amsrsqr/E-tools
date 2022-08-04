import Loader from "../../../../components/Loader";
import Icon from "../../../../../src/assets/Images/icon.png";
import Page from "../../../../components/Page";
import ReactTable from "../../../../components/ReactTable";
import React, { useEffect, useState } from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import Select from "react-select";

import {
  ACTION,
  ADD,
  DELETE,
  DOCUMENTTYPE,
  EDIT,
  PLUSSIGN,
  OPTIONAL,
  ADDRULE,
  SHOWING,
  COLONSIGN,
  ADDITIONALPERIODRULE,
} from "../../../../constant/FieldConstant";
import { Button } from "reactstrap";
import radRacDeductionRuleService from "../../../../services/Resident/bondDeductionPeriodRules.service";
import SuccessAlert from "../../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../../components/DeleteConfirmationModelAlert";
import AddEditPeriodRules from "./AddEditPeriodRules";
import moment from "moment";
import AmountFormat from "./../../../../utils/AmountFormat";
import WarningMessageModelAlert from "../../../../components/WarningMessageModelAlert";
import { BONDDEDUCTIONHISTORYTEXT } from "../../../../constant/MessageConstant";
import { convertHTMLToPlain } from "../../../../utils/Strings";

const ViewPeriodRules = ({
  bondId,
  handleCancelInTabs1,
  handleCancelOnAdd1,
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
  const [racRuleStatuses, setRacRuleStatuses] = useState([]);
  const [ruleStatuses, setRuleStatuses] = useState({
    id: 16,
    label: "Current",
  });
  const [selectedStatus, setselectedStatus] = useState(null);
  const [title, setTitle] = useState([]);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [cancelData, setCancelData] = useState();

  useEffect(() => {
    handleCancelInTabs1(cancelData);
  }, [cancelData]);

  useEffect(() => {
    const resultnew = getAllStatusList();
    getAllAdditionalPeriodRulesList(bondId, ruleStatuses.id, "firstCall");
  }, [bondId]);

  const getAllStatusList = async () => {
    await radRacDeductionRuleService
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
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAllAdditionalPeriodRulesList = (bondId, StatusId, firstCall) => {
    setLoading(true);

    radRacDeductionRuleService
      .GetListOfRadRacDeductionRule(bondId, StatusId)
      .then((response1) => {
        setLoading(false);
        setAdditionalPeriodRulesList(response1.result);
        if (firstCall === "firstCall") {
          setAdditionalPeriodRulesListCpy(response1.result);
        }
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
  const onHandleMessage = (type, title, content) => {
    setShowWarningAlert(!showWarningAlert);
    const setNewTitle = {
      warningType: type,
      header: title,
      msg: content,
    };
    setTitle(setNewTitle);
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
      radRacDeductionRuleService
        .deleteDeductionRule(bondId, selectedRowData.id)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getAllAdditionalPeriodRulesList(bondId, ruleStatuses.id);
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

  const UpdateCancelCallback = (updatedRecordID) => {
    if (
      additionalPeriodRulesListCpy &&
      additionalPeriodRulesListCpy.length > 0
    ) {
      const foundItem = additionalPeriodRulesListCpy.find(
        (ob) => ob.id === updatedRecordID
      );
      foundItem.bondId = bondId;
      delete foundItem.createdBy;
      delete foundItem.modifiedBy;
      delete foundItem.isUpdated;

      if (cancelData && cancelData.length > 0) {
        setCancelData([...cancelData, foundItem]);
      } else {
        setCancelData([foundItem]);
      }
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
          getAllAdditionalPeriodRulesList(bondId, ruleStatuses.id);
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

  const changeFilter = (selectedStatus) => {
    setLoading(true);
    radRacDeductionRuleService
      .GetListOfRadRacDeductionRule(bondId, selectedStatus.id)
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
      width: "7%",
    },
    {
      Header: "Rule Type",
      accessor: (d) => d.deductionType,
      width: "20%",
    },
    {
      Header: "Start Date",
      accessor: (d) => moment(d.startDate).format("MM/DD/YYYY"),
      Cell: ({ cell: { value } }) => (
        <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
      ),
      width: "10%",
    },
    {
      Header: "End Date",
      accessor: (d) => moment(d.endDate).format("MM/DD/YYYY"),
      Cell: ({ cell: { value } }) => (
        <div>{moment(value, "MM/DD/YYYY").format("DD/MM/YYYY")}</div>
      ),
      width: "10%",
    },
    {
      Header: "Amount",
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
            {"Bond Deduction Period Rules"} ({OPTIONAL}) &nbsp;
            <i
              className="fa fa-info-circle fa-sm mt-1"
              onClick={() =>
                onHandleMessage(
                  "info",
                  "Bond Deduction",
                  BONDDEDUCTIONHISTORYTEXT.TEXT
                )
              }
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <hr className="headerBorder" />
          <div style={{ fontSize: "14px", paddingBottom: "25px" }}>
            This section allows you to add reoccurring calculations to the EoP
            (End of Period).
          </div>
          {showWarningAlert && (
            <WarningMessageModelAlert
              warningType={title.warningType}
              header={title.header}
              msg={title.msg}
              showWarningAlert={showWarningAlert}
              setShowWarningAlert={setShowWarningAlert}
            />
          )}
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

          <AddEditPeriodRules
            type={actionType}
            Data={data}
            ShowModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            UpdateCancelCallback={UpdateCancelCallback}
            handleCancelOnAdd1={handleCancelOnAdd1}
            bondId={bondId}
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
export default ViewPeriodRules;
