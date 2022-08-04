import React, { useState, useEffect } from "react";
import {
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  FormGroup,
  Label,
  Col,
} from "reactstrap";
import Page from "../../../components/Page";
import Loader from "../../../components/Loader";
import ReactTableImportCSV from "../../../components/ReactTableImportCSV";
import SuccessAlert from "../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
//import Icon from "../../assets/Images/icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { ACTION, ADD, DELETE, EDIT } from "../../../constant/FieldConstant";
import { GoAlert } from "react-icons/go";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import importCSV from "../../../services/Resident/importCSV.service";

const PreviewAndConfirm = ({
  callSave,
  callBackActiveStep,
  uniqueId,
  maplist,
  residentType,
}) => {
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [type, setType] = useState();
  const [data, setData] = useState(maplist);
  const [
    showDeleteConfirmationModelAlert,
    setShowDeleteConfirmationModelAlert,
  ] = useState(false);
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [itemForDelete, setItemForDelete] = useState({});
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [uniqueGuid, setUniqueGuid] = useState(uniqueId);

  useEffect(() => {
    if (callSave) {
      console.log("inside useeffect");
      saveImport();
    }
  }, [callSave]);

  async function saveImport(fields) {
    setLoading(true);
    let uniqueId = uniqueGuid;
    //let residentType = residentType;

    importCSV.importResident(uniqueId, residentType).then(
      (data) => {
        setLoading(false);
        console.log("This is data of last import", data.result);
        callBackActiveStep(false, true, data.result);
        // setShow(false);
      },
      () => {
        setLoading(false);
      }
    );
  }

  const ColumnHeader = (cell, columnName) => {
    return (
      <>
        <span style={{ float: "left" }}>{columnName}</span>
        {/* <span style={{ float: "right" }}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            style={{ width: "15px", height: "20px" }}
          />
        </span> */}
      </>
    );
  };

  const categoryList = React.useMemo(() => data);

  const columns = React.useMemo(() => [
    {
      Header: (cell) => ColumnHeader(cell, "Title"),
      width: "2%",
      accessor: "title",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "First Name"),
      width: "3%",
      accessor: "firstName",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Last Name"),
      width: "3%",
      accessor: "lastName",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Address"),
      accessor: "address",
      width: "4%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Suburb"),
      accessor: "suburb",
      width: "4%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Postcode"),
      accessor: "postcode",
      width: "2%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "State"),
      accessor: "state",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Date of Birth"),
      accessor: "dateOfBirth",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Admission Date"),
      width: "3%",
      accessor: "admissionDate",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Initially Entered Aged Care"),
      width: "3%",
      accessor: "initiallyEnteredAgedCare",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Care Type"),
      width: "3%",
      accessor: "careType",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Extra Service"),
      width: "2%",
      accessor: "extraService",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Facility"),
      width: "4%",
      accessor: "facility",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Resident Id"),
      width: "2%",
      accessor: "residentId",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Client Billing ID"),
      width: "2%",
      accessor: "clientBillingId",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) =>
        ColumnHeader(
          cell,
          "Projected Payment Decision Date (Admission Date+28 days)"
        ),
      width: "3%",
      accessor: "projectedPaymentDecisionDate",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Total Agreed Accomodation Price"),
      width: "4%",
      accessor: "totalAgreedAccommodationPrice",
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Price Format"),
      width: "3%",
      accessor: "priceFormat",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Payment Type"),
      accessor: "paymentType",
      width: "2%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "MPIR"),
      accessor: "mpir",
      width: "2%",
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Agreed RAD/RAC Portion"),
      accessor: "agreedRadRacPortion",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Drawdown"),
      accessor: "drawdown",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Recovery"),
      accessor: "recovery",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Category"),
      accessor: "category",
      width: "4%",
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Agreed RAD / RAC Paid"),
      accessor: "agreedradRacPaid",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Total RAD / RAC Top-up"),
      accessor: "totalRadRacTopUp",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },

    {
      Header: (cell) => ColumnHeader(cell, "Extra Service Fees Deducted"),
      accessor: "extraServiceFeesDeducted",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Capitalised CareFees Deducted"),
      accessor: "capitalisedCareFeesDeducted",
      width: "4%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Additional ServiceFees Deducted"),
      accessor: "additionalServiceFeesDeducted",
      width: "4%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "DAP / DAC Charge"),
      accessor: "dapDacCharge",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "DAP / DAC Charge Receipt"),
      accessor: "dapDacChargeReceipt",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "DAP / DAC Deduction"),
      accessor: "dapDacDeduction",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
    {
      Header: (cell) => ColumnHeader(cell, "Balance"),
      accessor: "balance",
      width: "3%",
      Filter: false,
      disableSortBy: true,
    },
  ]);
  const callBackCellStyle = (id, j) => {};

  //const categoryList = React.useMemo(() => checklistList);

  return (
    <>
      <Formik
        enableReinitialize
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={saveImport}
      >
        {({
          errors,
          setErrors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue,
          setFieldTouched,
        }) => (
          <>
            {showSuccessAlert && (
              <SuccessAlert
                type={successAlertOptions.actionType}
                msg={successAlertOptions.msg}
                title={successAlertOptions.title}
                callback={successAlertOptions.callback}
              ></SuccessAlert>
            )}
            {loading ? <Loader></Loader> : ""}
            <Row style={{ marginTop: "40px", padding: "40px" }}>
              <Row className={"fieldstyle"}>
                <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Step 3: Map CSV Fields
                </p>
              </Row>

              <Row className={"fieldstyle"}>
                <Col sm={6}>
                  <Row>
                    <Col sm={12}>
                      <p>
                        The rows below will be imported.Please confirm before
                        finalizing the report
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col sm={12} style={{ overflow: "scroll", height: "495px" }}>
                  <Row>
                    <ReactTableImportCSV
                      columns={columns}
                      data={categoryList}
                      showSecondHead={false}
                      callBackCellStyle={callBackCellStyle}
                      rowProps={(row) => ({
                        onClick: () => alert(JSON.stringify(row.values)),
                        style: {
                          cursor: "pointer",
                        },
                      })}
                    />
                  </Row>
                </Col>
              </Row>
            </Row>
          </>
        )}
      </Formik>
    </>
  );
};

export default PreviewAndConfirm;
