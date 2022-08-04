import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Loader from "../../../components/Loader";
import {
  ADDITIONSERVICESADD,
  DEFAULTPRICE,
  EDIT,
  OVERRIDEPRICE,
  SELECTED,
  SERVICENAME,
} from "../../../constant/FieldConstant";
import {
  ADDTIIONALTEXT,
  SAVE,
  BASICWARNINGTITLE,
} from "../../../constant/MessageConstant";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
import ReactAdditionalPopup from "../../../components/ReactAdditionalPopup";
import "../../../css/AdditionalService.css";
import updateResident from "../../../services/Master/residentFees.service";
import SuccessAlert from "../../../components/SuccessAlert";
import BasicDailyFeesWarning from "../../../components/BasicDailyFeesWarning";
import { SortArrayOfObjs } from "../../../utils/ArrayFun";
const CheckBoxColumn = ({
  cell,
  rowIndex,
  row,
  getPriceCallback,
  getValidationCallback,
}) => {
  const [isChecked, setIsChecked] = useState(cell.isOverridePrice);
  const [changeValue, setChangeValue] = useState();
  useEffect(() => {
    if (!isChecked) {
      setChangeValue(null);
      getValidationCallback(null, cell.additionalServiceId, isChecked);
    } else {
      setChangeValue(cell.overridePrice);
      getValidationCallback(changeValue, cell.additionalServiceId, isChecked);
    }
  }, [isChecked]);

  function onChange(e, rowIndex, cell) {
    let value;
    if (rowIndex && cell.isActive === true) {
      value = isChecked;
    } else {
      value = false;
    }
    setIsChecked(!value);
    getPriceCallback(!isChecked, cell.additionalServiceId, changeValue, cell);
  }
  useEffect(() => {
    getValidationCallback(
      changeValue,
      cell.additionalServiceId,
      isChecked,
      cell.isActive
    );
  }, [changeValue]);

  useEffect(() => {
    if (cell.isActive) {
      setChangeValue(cell.overridePrice);
    } else {
      setChangeValue(null);
    }
  }, [cell.overridePrice]);

  return (
    <>
      <div
        className={
          "d-flex  justify-content-around " +
          ((changeValue === "" ||
            changeValue === undefined ||
            changeValue === "0.00" ||
            changeValue === null) &&
          isChecked === true &&
          cell.isActive == true
            ? " invaildPlaceholders"
            : "")
        }
      >
        <Input
          type="checkbox"
          name="isOverridePrice"
          disabled={cell.isActive == true ? false : true}
          checked={cell.isActive === true ? isChecked : false}
          defaultChecked={rowIndex.original.isOverridePrice}
          onClick={(e) => onChange(e, rowIndex, cell)}
          style={{
            width: "20px",
            height: "20px",
            marginTop: "7px",
          }}
        />
        <Label
          style={{ width: "8px", marginTop: "-5px", marginRight: "1px" }}
          column
          sm={2}
          className={
            (changeValue === "" ||
              changeValue === undefined ||
              changeValue === "0.00" ||
              changeValue === null) &&
            isChecked === true &&
            cell.isActive == true
              ? "is-invalid-label required-field "
              : ""
          }
        ></Label>
        <NumberFormat
          name="overridePrice"
          id="overridePrice"
          placeholder="$0.00"
          thousandSeparator={true}
          // maxLength={changeValue === 0 ? 14 : 16}
          prefix={"$"}
          allowNegative={false}
          disabled={isChecked === true && cell.isActive == true ? false : true}
          fixedDecimalScale={2}
          decimalScale={2}
          value={changeValue || ""}
          className={
            "form-control  w-75 " +
            ((changeValue === "" ||
              changeValue === undefined ||
              changeValue === "0.00" ||
              changeValue === null) &&
            isChecked === true &&
            cell.isActive == true
              ? " is-invalid"
              : "")
          }
          onValueChange={(values) => {
            const { formattedValue, value } = values;
            setChangeValue(value);
            getPriceCallback(isChecked, cell.additionalServiceId, value, cell);
          }}
        />
      </div>
    </>
  );
};

const AttachedCheckBoxColumn = ({
  cell,
  getSelectedCheckboxes,
  rowIndex,
  row,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  function onChange(e, i, cell) {
    let value = isChecked;
    setIsChecked(!value);
    getSelectedCheckboxes(e.target.checked, cell.additionalServiceId, cell);
  }
  return (
    <>
      <Input
        type="checkbox"
        name="isActive"
        checked={isChecked[rowIndex]}
        defaultChecked={rowIndex.original.isActive}
        onClick={(e) => onChange(e, rowIndex, cell)}
        style={{ width: "20px", height: "20px", marginTop: "-5px" }}
      />
    </>
  );
};

const AdditionalServices = ({
  additionalService,
  callBackAddition,
  setAdditionalService,
  updateOverrideTotal,
  updateAttachedChecbox,
  handleCancelCallback,
  facilities,
  residentId,
  setUpdatedFacilities,
}) => {
  const [show, setShow] = useState(additionalService);
  const [loading, setLoading] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [fieldAlertWarning, setFieldAlertWarning] = useState(false);
  const [warningAlertOptions, setWarningAlertOptions] = useState({});

  const [searchField, setSearchField] = useState("");
  const [initialValue, setInitialValue] = useState({});
  const [isChecked, setIsChecked] = useState([]);
  const [facilityList, setFacilityList] = useState(facilities);
  const [getSelectedCheck, setGetSelectedCheck] = useState([]);
  const [facilitiesUpdate, setFacilitiesUpdate] = useState([]);
  const [stopSubmit, setStopSubmit] = useState(false);
  const [fieldAmount, setFieldAmount] = useState(false);
  const [newPrice, setPrice] = useState(0);

  const handleClose = () => {
    setAdditionalService(!additionalService);
  };
  useEffect(() => {
    setFacilitiesUpdate(facilities);
  }, [facilities]);

  useEffect(() => {
    setUpdatedFacilities(facilities);
  }, [facilities]);

  let newCheck = [];
  useEffect(() => {
    facilities &&
      facilities.map((m) => {
        if (m.isActive === true) {
          newCheck.push(m.additionalServiceId);
        }
      });
    setGetSelectedCheck(newCheck);
  }, [facilities]);

  useEffect(() => {
    setShow(additionalService);
  }, [additionalService]);

  const getSelectedCheckboxes = (value, id, cell) => {
    newCheck = [];
    const items = [...facilities];
    const objIndex = items.findIndex((obj) => obj.additionalServiceId === id);
    if (objIndex >= 0) {
      items[objIndex].isActive = value;
      if (value) {
        items[objIndex].isOverridePrice = cell.isOverridePrice;
        items[objIndex].overridePrice = cell.overridePrice;
      } else {
        items[objIndex].isOverridePrice = false;
        items[objIndex].overridePrice = null;
      }
    }

    setFacilitiesUpdate(items);
  };
  const getPriceCallback = (isOverride, id, override, cell) => {
    if (Number(override) > Number(cell.price) && cell.isActive) {
      setPrice(cell.price);
      setFieldAmount(true);
    } else {
      setFieldAmount(false);
    }
    const kmn = [...facilities];
    let newIndx = kmn.findIndex((m) => m.additionalServiceId === id);
    if (newIndx >= 0) {
      kmn[newIndx].overridePrice = override;
      kmn[newIndx].isOverridePrice = isOverride;
    }
    setFacilitiesUpdate(kmn);
  };
  const getValidationCallback = (val, id, isChecked, isActive) => {
    if (
      (val === "" || val === undefined || val === "0.00") &&
      isChecked &&
      isActive
    ) {
      setStopSubmit(true);
    } else if (val !== "") {
      const abc = [...facilities];
      const validatedArr = abc.filter(
        (m) =>
          m.isOverridePrice &&
          m.isActive &&
          (m.overridePrice === "" ||
            m.overridePrice === undefined ||
            m.overridePrice === "0.00" ||
            m.overridePrice === null)
      );

      if (validatedArr && validatedArr.length > 0) {
        setStopSubmit(true);
      } else {
        setStopSubmit(false);
      }
    } else {
      setStopSubmit(false);
    }
  };

  function getOverridePrice(cell, row, rowIndex) {
    return (
      <div
        className="d-flex checkboxClass"
        style={{ justifyContent: "space-around" }}
      >
        <CheckBoxColumn
          cell={cell}
          rowIndex={rowIndex}
          row={row}
          getPriceCallback={getPriceCallback}
          getValidationCallback={getValidationCallback}
        />
      </div>
    );
  }

  function getSelected(cell, row, rowIndex) {
    return (
      <div className="checkboxClass">
        <AttachedCheckBoxColumn
          cell={cell}
          rowIndex={rowIndex}
          row={row}
          getSelectedCheckboxes={getSelectedCheckboxes}
        />
      </div>
    );
  }

  function currencyFormat(num) {
    return (
      "$" +
      Number(num)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    );
  }

  const columns = React.useMemo(
    () => [
      {
        Header: SELECTED,
        Filter: false,
        accessor: getSelected,
        width: "10%",
      },
      {
        Header: SERVICENAME,
        Filter: false,
        accessor: "name",
        width: "40%",
        Cell: (props) => {
          return <div style={{ marginTop: "-9px" }}>{props.value}</div>;
        },
      },
      {
        Header: DEFAULTPRICE,
        Filter: false,
        accessor: "price",
        width: "25%",
        Cell: (props) => {
          return (
            <div style={{ marginTop: "-6px" }}>
              {currencyFormat(props.value)}
            </div>
          );
        },
      },
      {
        Header: OVERRIDEPRICE,
        Filter: false,
        accessor: getOverridePrice,
        width: "30%",
      },
    ],
    []
  );
  useEffect(() => {
    let cpyFacilit = [...facilitiesUpdate];
    cpyFacilit.find((f) => {
      if (Number(f.overridePrice) > Number(f.price) && f.isActive) {
        setPrice(f.price);
        setFieldAmount(true);
      }
    });
  }, [facilitiesUpdate]);

  async function SaveData({ setStatus, setSubmitting }) {
    let sendObj = [];
    let cpyFacilityNew = [...facilitiesUpdate];
    cpyFacilityNew.filter((m) => {
      if (m.isActive === true) {
        sendObj.push({
          id: m.id,
          residentId: residentId,
          additionalServiceId: m.additionalServiceId,
          isOverridePrice: m.isOverridePrice,
          overridePrice: m.overridePrice,
        });
      }
    });

    if (stopSubmit === false) {
      if (fieldAmount === true) {
        setFieldAlertWarning(true);
        setAdditionalService(true);
        setWarningAlertOptions({
          title: BASICWARNINGTITLE,
          msg: (
            <p className="text-center">
              The Additional Services Fee cannot exceed ${newPrice}. <br />{" "}
              Please try again. <br /> <br />
              For more details on these Fees, please check Admin {">"} Fees &
              Charges.
            </p>
          ),
          callback: () => {
            setFieldAlertWarning(false);
            setFieldAmount(false);
          },
        });
      } else if (sendObj.length > 0) {
        callBackAddition();
        setLoading(true);
        updateResident.updateResidentFeesPopUp(sendObj).then(
          (response) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: EDIT,
              msg: "Record Updated Successfully",
              callback: () => {
                setShowSuccessAlert(false);
                handleClose();
              },
            });
            setShowSuccessAlert(true);
          },
          () => {
            setLoading(false);
          }
        );
      } else {
        handleClose();
      }
    }
  }

  const newFacilityOrder = SortArrayOfObjs(facilityList, "name");
  const filteredPersons = Array.from(newFacilityOrder).filter((p) => {
    return p.name.toLowerCase().includes(searchField?.toLowerCase());
  });

  const handleChange = (e) => {
    setSearchField(e.target.value);
  };
  const viewDataList = React.useMemo(() => filteredPersons, [filteredPersons]);

  return (
    <Fragment>
      {loading ? <Loader></Loader> : null}

      <Modal
        scrollable={true}
        isOpen={show}
        centered
        size="lg"
        toggle={() => {
          handleClose();
          handleCancelCallback();
        }}
      >
        <ModalHeader
          toggle={() => {
            handleClose();
            handleCancelCallback();
          }}
        >
          {ADDITIONSERVICESADD}
        </ModalHeader>
        <ModalBody>
          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.actionType}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}
          {fieldAlertWarning && (
            <BasicDailyFeesWarning
              title={warningAlertOptions.title}
              msg={warningAlertOptions.msg}
              fieldAlertWarning={fieldAlertWarning}
              setFieldAlertWarning={setFieldAlertWarning}
            />
          )}
          <p>{ADDTIIONALTEXT}</p>
          <div class="input-group col-md-4 w-80 ">
            <Input
              class="form-control border-right-0 border"
              type="search"
              placeholder="Search..."
              id="example-search-input"
              autoComplete="off"
              onChange={handleChange}
            />

            <span class="input-group-append"></span>
          </div>
          <div style={{ marginLeft: "0px", marginBottom: "-16px" }}>
            <ReactAdditionalPopup
              columns={columns}
              data={viewDataList}
            ></ReactAdditionalPopup>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              size="md"
              className="modalsave btn btn-primary mr-2"
              onClick={SaveData}
            >
              {SAVE}
            </Button>
            <Button
              type="reset"
              className="clsbtn btn btn-secondary offset-1"
              size="md"
              onClick={() => {
                handleClose();
                handleCancelCallback();
              }}
            >
              {"Cancel"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};
export default AdditionalServices;
