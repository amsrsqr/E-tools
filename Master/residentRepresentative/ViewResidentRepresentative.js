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
import { ButtonGroup, Dropdown } from "react-bootstrap";
import ReactTable from "../../../components/ReactTable";
import SuccessAlert from "../../../components/SuccessAlert";
import Logo from "../../../assets/Images/icon.png";
import Loader from "../../../components/Loader";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
import {
  ADD,
  DELETE,
  EDIT,
  RESIDENTREPRESENTATIVE,
  RESIDENTREPRESENTATIVES,
} from "../../../constant/FieldConstant";
import { ACTION } from "./../../../constant/FieldConstant";
import ResidentRepresentativeServices from "../../../services/Master/residentRepresentative.service";
import AddEditResidentRepresentative from "./AddEditResidentRepresentative";
import residentRepresentativeService from "../../../services/Master/residentRepresentative.service";
import WarningMessageModelAlert from "../../../components/WarningMessageModelAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  AD,
  BGC,
  BILL,
  CORR,
  CRC,
  DELETESUCCESSFUL,
  EC,
  GRD,
  INFOMESSAGEREPRESENTATIVE,
  INFOMESSAGEREPRESENTATIVEONE,
  INFOMESSAGEREPRESENTATIVETHREE,
  INFOMESSAGEREPRESENTATIVETWO,
  OTHER,
  POA,
  POAM,
  REP,
  SAVESUCCESSFUL,
  ST,
} from "../../../constant/MessageConstant";
import ResidentNavigationBar from "../ResidentNavigationStepbar";

const ViewResidentRepresentative = ({
  residentId,
  representativeDetailsCallback,
  stateCountrySubrb,
  residentRepresentativeModel,
  handlIsUnSavedData,
}) => {
  const [residentRepresentative, setResidentRepresentative] = useState([]);

  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [actionType, setActionType] = useState();
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showWarningInfoAlert, setShowWarningInfoAlert] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState(-1);
  const [agreementSignee, setAgreementSignee] = useState([]);
  const [StateCountrySubrb, setStateCountrySubrb] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  const [itemForDelete, setItemForDelete] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [showRepresentative, setShowRepresentative] = useState([]);

  const relationShortForms = {
    is_primarycontact: "Primary Contact",
    is_fin_admin: "AD",
    is_billing: "BGC",
    is_correspondence: "CRC",
    is_emergency_contact: "EC",
    is_guardian: "GRD",
    is_other: "Other",
    is_poa: "POA",
    is_poa_medical: "POAM",
    is_res_representative: "REP",
    is_trustee: "ST",
  };

  const shortFormMapping = {
    Power_of_Attorney: "POA",
    State_Trustee: "ST",
    Administrator: "AD",
    Guardian: "GRD",
    Resident_Representative: "REP",
    None: "",
  };
  const handleShow = () => {
    setShowAddEditForm(true);
    setSelectedRowData({});
    setSelectedRowIndex(-1);
    setActionType(ADD);
  };

  const editShow = (item, index) => {
    setShowAddEditForm(true);
    setSelectedRowData(item);
    setSelectedRowIndex(index);
    setActionType(EDIT);
    // setSelectedItem(item);
    // residentRepresentative.forEach((x) => {
    //   if (x.is_primarycontact) {
    //     setSelectedItem(x);
    //   }
    // });
  };

  useEffect(() => {
    setSelectedResidentId(residentId);
    if (residentId && residentId > 0) {
      getResidentRepresentative(residentId);
    }
  }, [residentId]);

  const getAgreementSigneeList = () => {
    setLoading(true);
    residentRepresentativeService.getAgreementSigneeList().then((response) => {
      setLoading(false);
      response.map((x) => {
        x.label = x.name;
        // x.id = x.title_type_id;
      });
      setAgreementSignee(response);
    });
  };

  const getResidentRepresentative = (residentId) => {
    setLoading(true);
    ResidentRepresentativeServices.getAllResidentRepresentative(residentId)
      .then((response) => {
        setLoading(false);
        let primaryIndex = -1;
        response.forEach((x, i) => {
          x.full_name = x.rep_first_name + " " + x.rep_last_name;
          let str = "";
          Object.keys(relationShortForms).forEach((relations) => {
            str = str.concat(
              x[relations] ? relationShortForms[relations] + "," : ""
            );
          });
          let key = x.agreement_signatory
            ? x.agreement_signatory.replaceAll(" ", "_").trim()
            : "None";
          str += shortFormMapping[key.trim()] || "None";
          x.relations = str.slice(0, str.length);
          if (x.is_primarycontact) {
            primaryIndex = i;
          }
        });
        if (primaryIndex > -1) {
          response.unshift(response[primaryIndex]); // Adding primary obj in 1st position of arr
          response.splice(primaryIndex + 1, 1); // Deletingn the original obj
          setSelectedItem(0);
        } else {
          setSelectedItem(-1);
        }

        setResidentRepresentative(JSON.parse(JSON.stringify(response)));
        setShowRepresentative(JSON.parse(JSON.stringify(response)));
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    // getResidentRepresentative();
    setStateCountrySubrb(stateCountrySubrb);
  }, [stateCountrySubrb]);
  useEffect(() => {
    // getResidentRepresentative();
    getAgreementSigneeList();
    // if (residentId) {
    //   getResidentRepresentative(residentId);
    // }
  }, []);

  useEffect(() => {
    if (residentRepresentativeModel && residentRepresentativeModel !== {}) {
      let primaryIndex = -1;
      residentRepresentativeModel.forEach((obj, i) => {
        let str = "";
        Object.keys(relationShortForms).forEach((rel) => {
          if (obj[rel]) {
            str = str.concat(relationShortForms[rel] + ", ");
          }
        });
        // obj.relations = str;
        if (obj.agreement_signee) {
          let key = obj.agreement_signee
            ? obj.agreement_signee.replaceAll(" ", "_")
            : "None";
          str += shortFormMapping[key.trim()] || "";
        }
        obj.relations = str.slice(
          0,
          obj.agreement_signee ? str.length : str.length - 2
        );
        if (obj.is_primarycontact) {
          primaryIndex = i;
        }
      });
      if (primaryIndex > -1) {
        setSelectedItem(0);
      } else {
        setSelectedItem(-1);
      }
      setResidentRepresentative(
        JSON.parse(JSON.stringify(residentRepresentativeModel))
      );
      setShowRepresentative(
        JSON.parse(JSON.stringify(residentRepresentativeModel))
      );
      console.log(
        "********residentRepresentativeModel",
        residentRepresentativeModel
      );
    }
  }, [residentRepresentativeModel]);

  const ParentCallBackToView = (childdata, success, payload = null) => {
    setShowAddEditForm(childdata);
    let arr = [];
    if (success) {
      if (actionType === ADD) {
        arr = [...residentRepresentative, payload];
      } else {
        arr = residentRepresentative.slice();
        arr[selectedRowIndex] = { ...payload };
      }
      if (
        payload.is_primarycontact &&
        selectedItem === 0 &&
        selectedRowIndex !== 0
      ) {
        arr[0].is_primarycontact = false;
      }
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: actionType === EDIT ? SAVESUCCESSFUL : SAVESUCCESSFUL,
        callback: () => {
          // getResidentRepresentative();
          let primaryIndex = -1;
          // let arr = residentRepresentative.slice();
          arr.forEach((x, i) => {
            x.full_name = x.rep_first_name + " " + x.rep_last_name;
            let str = "";
            Object.keys(relationShortForms).forEach((relations) => {
              str = str.concat(
                x[relations] ? relationShortForms[relations] + ", " : ""
              );
            });
            if (x.agreement_signee) {
              let key = x.agreement_signee
                ? x.agreement_signee.replaceAll(" ", "_")
                : "None";
              str += shortFormMapping[key.trim()] || "";
            }
            x.relations = str.slice(
              0,
              x.agreement_signee ? str.length : str.length - 2
            );
            if (x.is_primarycontact) {
              primaryIndex = i;
            }
          });
          if (primaryIndex > -1) {
            arr.unshift(arr[primaryIndex]); // Adding primary obj in 1st position of arr
            arr.splice(primaryIndex + 1, 1); // Deletingn the original obj
            setSelectedItem(0);
          } else {
            setSelectedItem(-1);
          }

          setShowRepresentative(
            JSON.parse(
              JSON.stringify(arr.filter((obj) => obj.isdeleted === false))
            )
          );
          setResidentRepresentative(JSON.parse(JSON.stringify(arr)));
          representativeDetailsCallback(arr);
          handlIsUnSavedData(true);
          setShowSuccessAlert(false);
        },
      });
      setShowSuccessAlert(true);
    }
    setSelectedRowData({});
  };

  const deleteConfirmationCallBack = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      let arr = showRepresentative.slice();
      arr.splice(selectedRowIndex, 1);
      setShowRepresentative([...arr]);

      console.log("itemForDelete", itemForDelete.rep_id);
      console.log("residentRepresentative", residentRepresentative);
      console.log("residentRepresentative arr", arr);
      residentRepresentative.map((obj) => {
        if (itemForDelete.rep_id) {
          if (obj.rep_id === itemForDelete.rep_id) {
            obj["isdeleted"] = true;
          }
        } else {
          residentRepresentative.splice(selectedRowIndex, 1);
        }
      });
      representativeDetailsCallback(residentRepresentative);
      handlIsUnSavedData(true);
      setSuccessAlertOptions({
        title: "",
        actionType: DELETE,
        msg: DELETESUCCESSFUL, //response.message,
        callback: (value) => {
          setShowSuccessAlert(false);
          //getResidentRepresentative();
        },
      });

      setResidentRepresentative(residentRepresentative);
      setShowSuccessAlert(true);
      // setLoading(true);
      // residentRepresentativeService
      //   .deleteResidentRepresentative(itemForDelete.rep_id)
      //   .then(
      //     (response) => {
      //       setLoading(false);
      //       setSuccessAlertOptions({
      //         title: '',
      //         actionType: DELETE,
      //         msg: response.message,
      //         callback: (value) => {
      //           setShowSuccessAlert(false);
      //           getResidentRepresentative();
      //         },
      //       });
      //       setShowSuccessAlert(true);
      //     },
      //     (error) => {
      //       setLoading(false);
      //     }
      //   );
    }
  };
  const onDelete = (item, index) => {
    setShowDeleteConfirmationModal(true);
    let obj = {
      ...item,
      header: RESIDENTREPRESENTATIVE,
      message: RESIDENTREPRESENTATIVE,
    };
    setDeleteConfirmationModalData(obj);
    setSelectedRowIndex(index);
    setItemForDelete(item);
  };

  function linkFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <>
        <div className="d-flex">
          {cell.is_primarycontact ? (
            <FontAwesomeIcon
              icon={faStar}
              style={{
                width: "24px",
                height: "21px",
                marginTop: "3px",
                marginRight: "6px",
              }}
            />
          ) : (
            ""
          )}
          <Dropdown
            as={ButtonGroup}
            className="btn-group w-100"
            style={
              cell.is_primarycontact
                ? { marginLeft: "0px" }
                : { marginLeft: "29px" }
            }
          >
            <Button className="dropdownAction">{ACTION}</Button>
            <Dropdown.Toggle split variant="" id="dropdown-split-basic" />
            <Dropdown.Menu>
              <Dropdown.Item
                id="dropdownBorder"
                onClick={() => editShow(cell, row)}
              >
                <img src={Icon} className="icon" alt="#" />
                {EDIT}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onDelete(cell, row)}>
                <img src={Icon} className="icon" alt="#" />
                {DELETE}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </>
    );
  }
  const columns = React.useMemo(() => [
    {
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "4%",
    },
    {
      Header: "Name",
      Filter: false,
      disableSortBy: true,
      accessor: (d) => d.full_name,
      width: "20%",
    },

    {
      Header: "Relationship",
      Filter: false,
      disableSortBy: true,
      accessor: (d) => d.relations,
      width: "20%",
    },
  ]);
  const residentRepresentativelist = React.useMemo(() => showRepresentative, [
    showRepresentative,
  ]);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="Resident representative">
          <div class="d-flex head mt-3">
            <img src={Icon} className="icon" />
            {RESIDENTREPRESENTATIVES}
            <div
              style={{ marginLeft: 4 }}
              onClick={() => {
                setShowWarningInfoAlert(true);
              }}
            >
              <i
                class="fa fa-info-circle ml-2 "
                aria-hidden="true"
                style={{ fontSize: "14px", cursor: "pointer" }}
              ></i>
            </div>
          </div>

          <hr className="headerBorder" />
          {/* <div style={{ fontSize: '14px' }}>
            This sections allows you to add new categories for your Residents
            Representatives.
          </div> */}
          {showWarningInfoAlert && (
            <>
              <WarningMessageModelAlert
                warningType={"info"}
                header={"Resident Representative Details"}
                setShowWarningAlert={() => {
                  setShowWarningInfoAlert(false);
                }}
                msg={
                  <>
                    {/* <div style={{ textAlign: 'left' }}>
                      {INFOMESSAGEREPRESENTATIVE}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div>{POA}</div>
                    </div> */}
                    <div style={{ textAlign: "left" }}>
                      {INFOMESSAGEREPRESENTATIVEONE}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      {INFOMESSAGEREPRESENTATIVETWO}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      {INFOMESSAGEREPRESENTATIVETHREE}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div>{POA}</div>
                      <div>{ST}</div>
                      <div>{REP}</div>
                      <div>{BILL}</div>
                      <div>{CORR}</div>
                      {/* <div>{EC}</div>
                      <div>{BGC}</div>
                      <div>{POAM}</div>
                      <div>{CRC}</div>
                      <div>{OTHER}</div> */}
                    </div>
                  </>
                }
                showWarningAlert={showWarningInfoAlert}
              ></WarningMessageModelAlert>
            </>
          )}
          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.actionType}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}
          {showAddEditForm ? (
            <AddEditResidentRepresentative
              type={actionType}
              Data={selectedRowData}
              ShowModel={showAddEditForm}
              StateCountrySubrb={StateCountrySubrb}
              ParentCallBackToView={ParentCallBackToView}
              existingPrimaryContactPersonDetails={selectedItem}
            />
          ) : null}
          <DeleteConfirmationModelAlert
            ShowDeleteModal={showDeleteConfirmationModal}
            Data={deleteConfirmationModalData}
            deleteConfirmationCallBack={deleteConfirmationCallBack}
          ></DeleteConfirmationModelAlert>

          <Button
            className="addbtn btnfixrep btn btn-primary btnright mt-2"
            style={{ marginRight: "150px", position: "absolute" }}
            onClick={handleShow}
          >
            + Add Representative
          </Button>

          <ReactTable
            columns={columns}
            data={residentRepresentativelist}
            showSecondHead={false}
            customTableWidth={true}
          />
        </Page>
      )}
    </>
  );
};

export default ViewResidentRepresentative;
