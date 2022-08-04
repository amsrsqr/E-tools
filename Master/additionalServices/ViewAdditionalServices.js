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
  ADDITIONALSERVICE,
  ADDITIONALSERVICES,
  ADDSERVICE,
  ATTACHED,
  COLONSIGN,
  DELETE,
  DESCRIPTION,
  DOCUMENTTYPE,
  DOCUMENTTYPES,
  EDIT,
  NEWTYPE,
  PLUSSIGN,
  PRICE,
  SERVICENAME,
  SHOWING,
} from "../../../constant/FieldConstant";

import { Button, Col, Input } from "reactstrap";
import {
  ADDDOCUMENTTYPE,
  UPDATDOCUMENTTYPE,
} from "../../../constant/MessageConstant";
import SuccessAlert from "../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import additionalServicesService from "../../../services/Master/additionalServices.service";
import AddEditAddtionalServices from "./AddEditAddtionalServices";
import AmountFormat from "../../../utils/AmountFormat";
import { convertHTMLToPlain } from "../../../utils/Strings";
import { SortArrayOfObjs } from "../../../utils/ArrayFun";

const ViewAdditionalServices = () => {
  const [loading, setLoading] = useState(false);
  const [AddtionalServicesList, setAddtionalServicesList] = useState([]);
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
  const [firstFacility, setFirstFacility] = useState(null);
  const [facilitiesById, setFacilitiesById] = useState(null);

  const facility = [
    { value: "All", label: "All" },
    { value: true, label: "Attached" },
    { value: false, label: "Not Attached" },
  ];
  useEffect(() => {
    getAllFacilityList();
  }, []);

  const getListAddtionalServices = () => {
    additionalServicesService
      .getAllAddtionalServices()
      .then((response2) => {
        setLoading(false);
        console.log(response2);
        setAddtionalServicesList(response2);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAllFacilityList = () => {
    setLoading(true);
    additionalServicesService
      .getAllFacility()
      .then((response) => {
        setLoading(false);
        const result = response.map((x) => {
          const obj = { label: "", value: "" };
          obj.label = x.facility_name;
          obj.value = x.id;
          return obj;
        });
        const obj = { label: "Non Attached", value: 0 };
        result.unshift(obj);
        setFacilityList(result);
        console.log(result[1]);
        setFirstFacility(result[1]);
        additionalServicesService
          .getAllAddtionalServicesForFacility(result[1].value)
          .then((response2) => {
            setLoading(false);
            console.log(response2);
            const newFacilityOrder = SortArrayOfObjs(response2, "serviceName");
            setAddtionalServicesList(newFacilityOrder);
          })
          .catch(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAllFacilityListWithId = (selected) => {
    console.log(selected);
    setLoading(true);
    additionalServicesService
      .getAllFacility()
      .then((response) => {
        setLoading(false);
        const result = response.map((x) => {
          const obj = { label: "", value: "" };
          obj.label = x.facility_name;
          obj.value = x.id;
          return obj;
        });
        const obj = { label: "Non Attached", value: 0 };
        result.unshift(obj);
        setFacilityList(result);
        additionalServicesService
          .getAllAddtionalServicesForFacility(selected.value)
          .then((response2) => {
            setLoading(false);
            setAddtionalServicesList(response2);
          })
          .catch(() => {
            setLoading(false);
          });
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

  const EditDocumentType = async (item) => {
    await additionalServicesService
      .getAddtionalServicesById(item.id)
      .then((dataitem) => {
        setFacilitiesById(dataitem);
      });
    setData({ item });
    await setActionType(EDIT);
    await setShowAddEditForm(true);
  };

  const DeleteAddtionalServices = (item) => {
    setShowDeleteConfirmationModal(true);
    setDeleteConfirmationModalData({
      header: ADDITIONALSERVICE,
      message: ADDITIONALSERVICE,
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
          <Dropdown.Item onClick={() => DeleteAddtionalServices(cell)}>
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
      additionalServicesService
        .deleteAddtionalServices(selectedRowData.id)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                if (!firstFacility) {
                  getAllFacilityList();
                  //getAllListAddtionalServices();
                } else {
                  getAllFacilityListWithId(firstFacility);
                }
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
          if (!firstFacility) {
            getAllListAddtionalServices();
          } else {
            getAllFacilityListWithId(firstFacility);
          }
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
  function getAttached(cell) {
    return (
      <Input
        className=""
        style={{ display: "flex", margin: "auto", cursor: "default" }}
        type="checkbox"
        checked={cell.attached}
      ></Input>
    );
  }

  const getAllListAddtionalServices = () => {
    setLoading(true);
    additionalServicesService
      .getAllAddtionalServices(firstFacility ? firstFacility : 0)
      .then((response) => {
        setLoading(false);
        console.log(response);
        setAddtionalServicesList(response);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAllListAddtionalServicesWithFilter = (selected) => {
    const selectedStatus = selected.value;
    setFirstFacility(null);
    additionalServicesService.getAllAddtionalServices().then((response) => {
      if (selected.value !== "All") {
        const result = Array.from(response).filter(
          (m) => m.attached === selectedStatus
        );
        console.log(result);
        setFirstFacility(null);
        setAddtionalServicesList(result);
      } else {
        setFirstFacility(null);
        setAddtionalServicesList(response);
      }
    });
  };

  const getAddtionalServicesFacilityFilter = (selected) => {
    console.log(selected);
    additionalServicesService
      .getAllAddtionalServicesForFacility(selected.value)
      .then((response) => {
        console.log(response);
        setAddtionalServicesList(response);
      });
  };
  const getFee = (cell) => {
    // console.log("reciepts", cell.chargeAmount);
    const newFormat = AmountFormat(cell.price);
    return newFormat;
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
      Header: SERVICENAME,
      accessor: (d) => d.serviceName,
      width: "23%",
    },
    //  {
    //     Header: PRICE,
    //     accessor: (d) => parseFloat(d.price).toFixed(2),
    //     width: '20%',
    //  },
    {
      Header: PRICE,
      disableSortBy: true,
      accessor: getFee,
      width: "20%",
    },
    {
      Header: DESCRIPTION,
      accessor: (d) => d.description,
      Cell: GetDescription,
      width: "40%",
    },
    {
      Header: ATTACHED,
      Filter: false,
      disableSortBy: true,
      accessor: getAttached,
      width: "10%",
    },
  ]);
  const servicesList = React.useMemo(() => AddtionalServicesList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {ADDITIONALSERVICES}
          </div>
          <hr className="headerBorder" />

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

          <div className="d-flex mb-4">
            <div
              className="p-2 headtwo"
              style={{ fontSize: "14px !important" }}
            >
              Facility Selected{" "}
            </div>
            <Col sm={4}>
              <Select
                name="facility"
                id="facility"
                options={facilityList}
                onChange={(selected) => {
                  setFirstFacility(selected);
                  getAddtionalServicesFacilityFilter(selected);
                }}
                isSearchable={facilityList.length < 5 ? false : true}
                value={firstFacility}
              />
            </Col>
          </div>
          {/* <div className="active-archivebtn" style={{left: "15%"}}>
            <div className="p-2">
              {SHOWING}
              {COLONSIGN}
            </div>
            <Select
              name="select"
              id="exampleSelect"
              options={facility}
              defaultValue={{ value: 0, label: "All" }}
              onChange={(selected) => {
                getAllListAddtionalServicesWithFilter(selected);
              }}
              isSearchable={facility.length < 5 ? false : true}
            />
          </div> */}
          <Button
            className="addbtn btnfix btn btn-primary m-2 btnright justify-content-end"
            onClick={handleShow}
          >
            {PLUSSIGN} {ADDSERVICE}
          </Button>
          <AddEditAddtionalServices
            type={actionType}
            Data={data}
            Facilities={facilitiesById}
            ShowModel={showAddEditForm}
            callBackAddEditFormToViewForm={callBackAddEditFormToViewForm}
          />
          <ReactTable
            columns={columns}
            data={servicesList}
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
export default ViewAdditionalServices;
