import React, { useState, useEffect } from "react";
import {
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import Icon from "../../../../assets/Images/icon.png";
import Loader from "../../../../components/Loader";
import SuccessAlert from "../../../../components/SuccessAlert";
import {
  ACTION,
  ADD,
  DELETE,
  EDIT,
  PLUSSIGN,
} from "../../../../constant/FieldConstant";
import prudentialReceiptsService from "../../../../services/PrudentialRequirement/prudentialReceipts.service";
import { SAVESUCCESSFUL } from "../../../../constant/MessageConstant";
import Page from "../../../../components/Page";
import ReactTable from "../../../../components/ReactTable";
import AddReceipts from "../../PrudentialRequirements/Receipts/AddEditReceipts";
import DeleteConfirmationModelAlert from "../../../../components/DeleteConfirmationModelAlert";
import AddBankReceipts from "./AddEditBankReceipts";
import prudentialBankReceiptsService from "../../../../services/PrudentialRequirement/prudentialBankReceipts.service";
import AmountFormat from "../../../../utils/AmountFormat";
import { convertHTMLToPlain } from "../../../../utils/Strings";

const ViewBankReceipts = ({ selectedFacility }) => {
  const [bankReceipts, setBankReceipts] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [actionType, setActionType] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);

  useEffect(() => {
    if (selectedFacility && selectedFacility.facility_id) {
      getBankReceipts();
    }
  }, [selectedFacility]);

  const getBankReceipts = () => {
    setLoading(true);
    prudentialBankReceiptsService
      .getPrudentialBankReceipts(selectedFacility.facility_id)

      .then((response) => {
        setLoading(false);
        setBankReceipts(response);
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
  const EditShow = (item) => {
    setShowAddEditForm(true);
    setData({ item });
    setActionType(EDIT);
  };

  // const getComments = (props) => {
  //   return (
  //     <div dangerouslySetInnerHTML={{ __html: `<p>${props.value}</p>` }} />
  //   );
  //   // return (
  //   //  console.log("This is description cell",props.value)
  //   // );
  // };

  const GetComments = (props) => {
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

  const callBackAddEditFormToViewForm = (childdata, success, msg = null) => {
    setShowAddEditForm(childdata);
    if (success) {
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: msg ? msg : actionType === EDIT ? SAVESUCCESSFUL : SAVESUCCESSFUL,
        callback: () => {
          setShowSuccessAlert(false);
          getBankReceipts();
        },
      });
      setShowSuccessAlert(true);
    }
  };

  const deleteConfirmationCallBack = (childdata, success) => {
    setShowDeleteConfirmationModal(childdata);
    if (success) {
      setLoading(true);
      prudentialReceiptsService
        .deletePrudentialReceipts(selectedRowData.id)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                getBankReceipts();
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

  const deleteReceipts = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: "Bank Receipt",
      message: "Bank Receipt",
    });
    setSelectedRowData(item);
  };

  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Dropdown as={ButtonGroup} className="btn-group w-100">
        <Button className="dropdownAction">{ACTION}</Button>
        <Dropdown.Toggle split variant="" id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item id="dropdownBorder" onClick={() => EditShow(cell)}>
            <img src={Icon} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => deleteReceipts(cell)}>
            <img src={Icon} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  const convertDate = (dt) => {
    console.log(dt);
    let altDate = new Date();
    dt = dt ? dt : altDate;
    return `${(new Date(dt).getDate() < 10 ? "0" : "") +
      new Date(dt).getDate()}/${(new Date(dt).getMonth() < 10 ? "0" : "") +
      (new Date(dt).getMonth() + 1)}/${new Date(dt).getFullYear()}`;
  };
  const columns = React.useMemo(() => [
    {
      Header: "",
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "6.25%",
    },
    {
      Header: "Date",
      accessor: (d) => {
        return convertDate(d.date);
      },
      disableSortBy: true,
      width: "8%",
    },
    {
      Header: "Payer",
      accessor: (d) => d.payer,
      disableSortBy: true,
      width: "12%",
    },
    {
      Header: "Amount",
      accessor: (d) => {
        return AmountFormat(d.amount);
      },
      disableSortBy: true,
      width: "10%",
    },

    {
      Header: "Comments",
      accessor: (d) => d.comments,
      Cell: GetComments,
      disableSortBy: true,
      width: "40%",
    },
  ]);

  const prudentialBankReceiptsList = React.useMemo(() => bankReceipts);

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3" style={{ fontSize: "16px" }}>
            {selectedFacility.facility_name}
          </div>
          <Button
            className="addbtn btnfix btn btn-primary m-3 btnright"
            onClick={handleShow}
          >
            {PLUSSIGN} {ADD} {"Receipt"}
          </Button>

          <ReactTable columns={columns} data={prudentialBankReceiptsList} />
          {showAddEditForm && (
            <AddBankReceipts
              facility={selectedFacility}
              type={actionType}
              Data={data}
              ShowModel={showAddEditForm}
              callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
            />
          )}

          <DeleteConfirmationModelAlert
            ShowDeleteModal={showDeleteConfirmationModal}
            Data={deleteConfirmationModalData}
            deleteConfirmationCallBack={deleteConfirmationCallBack}
            title={"Receipts"}
          ></DeleteConfirmationModelAlert>
          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.actionType}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}
        </Page>
      )}
    </>
  );
};

export default ViewBankReceipts;
