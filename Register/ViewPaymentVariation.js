import React, { useEffect, useState } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";

import Icon from "../../../src/assets/Images/icon.png";
import ReactTable from "../../components/ReactTable";

import { Button, ButtonGroup } from "reactstrap";

import { FormGroup, Label, Row, Col, Input } from "reactstrap";
import { Dropdown } from "react-bootstrap";

import {
  ACTION,
  ADD,
  BY,
  CURRENTPAYMENTMETHODDETAILS,
  CURRENTPAYMENTPRICEDETAILS,
  DACPORTION,
  DAILYEQUIVALENT,
  DAPPORTION,
  DELETE,
  DRAWDOWN,
  EDIT,
  EFFECTIVEDATE,
  EFFECTIVEFROM,
  LUMPSUMEQUIVALENTPAYMNT,
  MPIR,
  ORIGINALPAYMENTMETHODVALUES,
  PAYMENTDETAILSVARIATIONHISTORY,
  PAYMENTMETHOD,
  PAYMENTPRICE,
  PLUSSIGN,
  RACPORRTION,
  RADPORTION,
  SUPPORTEDCATEGORY,
  SUPPORTEDSTATUS,
} from "../../constant/FieldConstant";
import Page from "../../components/Page";
import { ORIGINALPAYMENTMSG } from "../../constant/MessageConstant";
import AddPaymentVariationDetails from "./AddEditPaymentVariationDetails";
import SuccessAlert from "../../components/SuccessAlert";
import paymentService from "../../services/Resident/payment.service";
import DeleteConfirmationModelAlert from "../../components/DeleteConfirmationModelAlert";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../components/NumberFormat";
const ViewPaymentVariation = ({
  bindingObject,
  residentId,
  parentCallBack,
  refundComplete,
  admissionDate,
  UpdateCancelCallback,
  handleIsAdded,
}) => {
  const [initialValues, setInitialValues] = useState({
    effectiveDate: "",
    mpir: "4.01",
  });
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [actionType, setActionType] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [variations, setVariations] = useState([]);
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

  const [finalisedDate, setFinalisedDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [secondEffectiveDate, setSecondEffectiveDate] = useState("");

  useEffect(() => {
    console.log("parent call back to data in view", bindingObject);
    if (bindingObject && bindingObject.variations) {
      setEffectiveDate(bindingObject.variations[0].effectiveDate);
      setSecondEffectiveDate(
        bindingObject.variations[1]
          ? bindingObject.variations[1]?.effectiveDate
          : bindingObject.variations[0].effectiveDate
      );
      setVariations(bindingObject.variations);
      setFinalisedDate(bindingObject.variations[0].effectiveDate);
    } else if (bindingObject && bindingObject.paymentDetails) {
      setFinalisedDate(bindingObject.paymentDetails.admissionDate);
    }
    if (bindingObject && bindingObject.paymentDetails) {
      bindingObject.paymentDetails.currentDailyEquivalent = (
        (bindingObject.paymentDetails.currentLumSumEquivalent *
          parseFloat(bindingObject.paymentDetails.currentMapir)) /
        36500
      ).toFixed(2);
      // bindingObject.paymentDetails.currentEffectiveFrom = convertDate(
      //   bindingObject.paymentDetails.currentEffectiveFrom
      // );
      bindingObject.paymentDetails.originalDrawdown =
        typeof bindingObject.paymentDetails.originalDrawdown === "boolean"
          ? bindingObject.paymentDetails.originalDrawdown
            ? "Yes"
            : "No"
          : bindingObject.paymentDetails.originalDrawdown;
      bindingObject.paymentDetails.currentDrawdown =
        typeof bindingObject.paymentDetails.currentDrawdown === "boolean"
          ? bindingObject.paymentDetails.currentDrawdown
            ? "Yes"
            : "No"
          : bindingObject.paymentDetails.currentDrawdown;
      setPaymentDetails(bindingObject.paymentDetails);
    }
  }, [bindingObject]);

  useEffect(() => {}, [residentId]);

  const handleShow = () => {
    setShowAddEditForm(true);
    setSelectedRowData({});
    setFinalisedDate(bindingObject.variations[0].effectiveDate);
    setActionType(ADD);
  };

  const editShow = (item) => {
    setShowAddEditForm(true);
    // setSelectedRowData({ paymentDetails, item });
    if (variations.length) {
      setFinalisedDate(admissionDate);
    } else {
      setFinalisedDate(bindingObject.variations[0]?.effectiveDate);
    }
    setSelectedRowData({ item });
    setActionType(EDIT);
  };

  const ParentCallBackToView = (childdata, success, msg = null) => {
    setShowAddEditForm(childdata);
    if (success) {
      // console
      setSuccessAlertOptions({
        title: "",
        actionType,
        msg: msg ? msg : actionType === EDIT ? "" : "",
        callback: () => {
          parentCallBack();
          setShowSuccessAlert(false);
        },
      });
      setShowSuccessAlert(true);
    }
  };
  const deleteConfirmationCallBack = (childdata, success) => {
    setShowDeleteConfirmationModal(childdata);
    console.log(itemForDelete);
    if (success) {
      setLoading(true);
      paymentService
        .deletePaymentDetails(itemForDelete.id, itemForDelete.radId)
        .then(
          (data) => {
            setLoading(false);
            setSuccessAlertOptions({
              title: "",
              actionType: DELETE,
              msg: data.message,
              callback: (value) => {
                setShowSuccessAlert(false);
                parentCallBack();
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

  const onDelete = (item) => {
    setShowDeleteConfirmationModal(true);
    let obj = {
      ...item,
      header: "Payment Variation",
      message: "Payment Variation",
    };
    setDeleteConfirmationModalData(obj);
    setItemForDelete(item);
  };

  function linkFormatter(cell, rowIndex, row, formatExtraData) {
    return (
      <Dropdown as={ButtonGroup} className="btn-group w-100">
        <Button
          disabled={rowIndex !== 0}
          // disabled={rowIndex !== 0 || variations.length === 1}
          className="dropdownAction"
        >
          {ACTION}
        </Button>
        <Dropdown.Toggle
          split
          variant=""
          id="dropdown-split-basic"
          disabled={rowIndex !== 0}
          style={rowIndex !== 0 ? { opacity: "0.3" } : {}}
          className={rowIndex !== 0 ? "disableColor" : ""}
          // disabled={rowIndex !== 0 || variations.length === 1}
        />
        {rowIndex !== 0 || variations.length === 1 ? (
          <>
            <Dropdown.Menu>
              <Dropdown.Item
                id="dropdownforedit"
                onClick={() => editShow(cell)}
              >
                <img src={Icon} className="icon" alt="#" />
                {EDIT}
              </Dropdown.Item>
              {/* <Dropdown.Item
              //   onClick={() => onDelete(cell)}
              >
                <img src={Icon} className="icon" alt="#" />
                {DELETE}
              </Dropdown.Item> */}
            </Dropdown.Menu>
          </>
        ) : (
          <>
            <Dropdown.Menu>
              <Dropdown.Item id="dropdownBorder" onClick={() => editShow(cell)}>
                <img src={Icon} className="icon" alt="#" />
                {EDIT}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onDelete(cell)}>
                <img src={Icon} className="icon" alt="#" />
                {DELETE}
              </Dropdown.Item>
            </Dropdown.Menu>
          </>
        )}
        {/* <Dropdown.Menu hidden={rowIndex === variations.length - 1}>
          <Dropdown.Item
            id="dropdownBorder"
            //  onClick={() => editShow(cell)}
          >
            <img src={Icon} className="icon" alt="#" />
            {EDIT}
          </Dropdown.Item>
          <Dropdown.Item
          //   onClick={() => onDelete(cell)}
          >
            <img src={Icon} className="icon" alt="#" />
            {DELETE}
          </Dropdown.Item>
        </Dropdown.Menu> */}
      </Dropdown>
    );
  }

  const convertDate = (dt) => {
    return `${(new Date(dt).getDate() < 10 ? "0" : "") +
      new Date(dt).getDate()}/${(new Date(dt).getMonth() < 10 ? "0" : "") +
      (new Date(dt).getMonth() + 1)}/${new Date(dt).getFullYear()}`;
  };

  const columns = React.useMemo(() => [
    {
      id: ACTION,
      Filter: false,
      disableSortBy: true,
      accessor: linkFormatter,
      width: "11.3%",
    },
    {
      Header: EFFECTIVEDATE,
      Filter: false,
      disableSortBy: true,
      accessor: (d, i) => {
        return (
          convertDate(d.effectiveDate) +
          (i === variations.length - 1 ? " (Original)" : "")
        );
        // .local()
        // .format("DD/MM/YYYY");
      },
      width: "50%",
    },
    {
      Header: "Origin",
      Filter: false,
      disableSortBy: true,
      accessor: (d) => "eRAD",
      width: "40%",
    },
  ]);
  const variationList = React.useMemo(() => variations);
  return (
    <Formik
      enableReinitialize
      //innerRef={ref}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({})}
      //validate={validateForm}
      validateOnChange={true}
      validateOnBlur={false}
      //onSubmit={savePaymentDetails}
    >
      {({ handleBlur, handleChange }) => (
        <>
          <Page title="">
            <Row className={"fieldStyle"}>
              <FormGroup row>
                <div className="d-flex" style={{ height: "fit-content" }}>
                  <div style={{ width: "55%", marginRight: "98px" }}>
                    <div className="head mt-3">
                      <img src={Icon} className="icon" />
                      {CURRENTPAYMENTPRICEDETAILS}
                    </div>
                    <hr className="headerBorder" />
                    <br />
                    <div style={{ marginLeft: "35px" }}>
                      <FormGroup row>
                        <Label sm={2} style={{ textAlign: "right" }}>
                          {BY}
                        </Label>
                        <Col sm={3}>
                          <FormGroup check>
                            <input
                              id="radio"
                              name="active"
                              type="radio"
                              style={{
                                // backgroundColor: "gray",
                                borderColor: "gray",
                                marginLeft: "-22px",
                              }}
                              checked={paymentDetails.currentIsLumSumEq}
                              // onChange={() => setIsLumpsum(true)}
                              disabled={true}
                            />{" "}
                            <Label style={{ marginLeft: "5px" }} sm={8}>
                              {LUMPSUMEQUIVALENTPAYMNT}
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col sm={6}>
                          <NumberFormat
                            thousandSeparator={true}
                            prefix={"$"}
                            // maxLength={17}
                            fixedDecimalScale={2}
                            allowNegative={false}
                            decimalScale={2}
                            // className="form-control"
                            name="currentLumSumEquivalent"
                            id="currentLumSumEquivalent"
                            value={paymentDetails.currentLumSumEquivalent}
                            placeholder="$0.00"
                            style={{
                              marginRight: "10px",
                              width: "60%",
                              height: "65%",
                              paddingLeft: "12px",
                              marginTop: "1%",
                              marginLeft: "-17%",
                            }}
                            disabled
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={2} style={{ textAlign: "right" }}>
                          {""}
                        </Label>
                        <Col sm={3} style={{ marginTop: "-6px" }}>
                          <FormGroup check>
                            <Input
                              id="radio"
                              name="active"
                              type="radio"
                              style={{
                                // backgroundColor: "gray",
                                borderColor: "gray",
                                marginLeft: "-22px",
                                marginTop: "10px",
                              }}
                              checked={!paymentDetails.currentIsLumSumEq}
                              // onChange={() => setIsLumpsum(false)}
                              disabled={true}
                            />{" "}
                            <Label sm={10}>{DAILYEQUIVALENT}</Label>
                          </FormGroup>
                        </Col>
                        <Col sm={6}>
                          <NumberFormat
                            thousandSeparator={true}
                            prefix={"$"}
                            // maxLength={17}
                            fixedDecimalScale={2}
                            allowNegative={false}
                            decimalScale={2}
                            name="currentDailyEquivalent"
                            id="currentDailyEquivalent"
                            // className="form-control"
                            value={paymentDetails.currentDailyEquivalent}
                            placeholder="$0.00"
                            style={{
                              marginRight: "10px",
                              width: "60%",
                              paddingLeft: "12px",
                              height: "75%",
                              marginLeft: "-17%",
                            }}
                            disabled
                          />
                        </Col>
                      </FormGroup>
                    </div>
                    <FormGroup row>
                      <Label
                        style={{ textAlign: "right", marginLeft: "30px" }}
                        htmlFor="mpir"
                        column
                        sm={2}
                      >
                        {MPIR}
                      </Label>
                      <Col sm={8}>
                        <NumberFormat
                          thousandSeparator={false}
                          suffix={"%"}
                          // maxLength={7}
                          fixedDecimalScale={2}
                          allowNegative={false}
                          decimalScale={2}
                          name="currentMapir"
                          id="currentMapir"
                          value={paymentDetails.currentMapir}
                          placeholder={"0.00%"}
                          style={{ width: "59%", paddingLeft: "12px" }}
                          disabled={true}
                        />
                        {/* <Field
                          name="mpir"
                          type="text"
                          value={paymentDetails.currentMapir}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={true}
                          style={{ width: '59%' }}
                        /> */}
                        {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                      </Col>
                    </FormGroup>
                    <div
                      className="head "
                      style={{ marginTop: "14%" }}
                      // class="head-style ps-5 mt-3"
                    >
                      <img src={Icon} className="icon" />
                      {PAYMENTDETAILSVARIATIONHISTORY}
                    </div>
                    <hr
                      className="headerBorder"
                      style={{ marginTop: "11px" }}
                    />
                    <br />
                    <div style={{ marginTop: "-27px" }}>
                      <Button
                        className="addbtn btn btn-primary m-2 btnright justify-content-end"
                        onClick={handleShow}
                        // style={{ marginTop: '55px' }}
                        disabled={refundComplete}
                      >
                        {PLUSSIGN} {ADD} {"Variation"}
                      </Button>
                      <ReactTable
                        columns={columns}
                        data={variationList}
                        showSecondHead={false}
                      />
                    </div>
                  </div>
                  {/* 1st 50% wala div ends */}
                  <div style={{ width: "40%" }}>
                    {" "}
                    <div style={{ height: "326px" }}>
                      <div className="head mt-3">
                        <img src={Icon} className="icon" />
                        {CURRENTPAYMENTMETHODDETAILS}
                      </div>
                      <div>
                        <hr className="headerBorder" />
                        <br />
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right", marginLeft: "-12%" }}
                            htmlFor=""
                            column
                            sm={4}
                          >
                            {EFFECTIVEFROM}
                          </Label>
                          <Col sm={8}>
                            <Field
                              name="effectiveFrom"
                              type="text"
                              // value={convertDate(
                              //   paymentDetails.currentEffectiveFrom
                              // )}
                              value={convertDate(
                                paymentDetails.currentEffectiveFrom
                              )}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              maxLength="250"
                              disabled={true}
                              style={{ width: "61%", paddingLeft: "12px" }}
                            />
                            {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right", marginLeft: "-12%" }}
                            htmlFor=""
                            column
                            sm={4}
                          >
                            {SUPPORTEDSTATUS}
                          </Label>
                          <Col sm={8}>
                            <Field
                              name="supportedStatus"
                              type="text"
                              value={paymentDetails.currentSupportedStatus}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              maxLength="250"
                              disabled={true}
                              style={{ width: "61%", paddingLeft: "12px" }}
                            />
                            {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                          </Col>
                        </FormGroup>
                        {paymentDetails.currentSupportedStatusId !== 1 ? (
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right", marginLeft: "-12%" }}
                              htmlFor="mpir"
                              column
                              sm={4}
                            >
                              {PAYMENTMETHOD}
                            </Label>
                            <Col sm={8}>
                              <Field
                                name="paymentMethod"
                                type="text"
                                value={paymentDetails.currentPaymentMethod}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                maxLength="250"
                                disabled={true}
                                style={{ width: "61%", paddingLeft: "12px" }}
                              />
                            </Col>
                          </FormGroup>
                        ) : (
                          <></>
                        )}
                        {paymentDetails &&
                        paymentDetails.currentPaymentMethod &&
                        (paymentDetails.currentPaymentMethod.replaceAll(
                          " ",
                          ""
                        ) === "RAC/DACCombination" ||
                          paymentDetails.currentPaymentMethod.replaceAll(
                            " ",
                            ""
                          ) === "RAD/DAPCombination") ? (
                          <>
                            <FormGroup row>
                              <Label
                                style={{
                                  textAlign: "right",
                                  marginLeft: "-12%",
                                }}
                                htmlFor=""
                                column
                                sm={4}
                              >
                                {paymentDetails.currentPaymentMethod.replaceAll(
                                  " ",
                                  ""
                                ) === "RAD/DAPCombination"
                                  ? RADPORTION
                                  : RACPORRTION}
                              </Label>
                              <Col sm={5}>
                                <NumberFormat
                                  thousandSeparator={true}
                                  prefix={"$"}
                                  // maxLength={17}
                                  fixedDecimalScale={2}
                                  allowNegative={false}
                                  decimalScale={2}
                                  name="currentRadPortion"
                                  id="currentRadPortion"
                                  value={paymentDetails.currentRadPortion}
                                  placeholder="$0.00"
                                  style={{ width: "100%", paddingLeft: "12px" }}
                                  disabled
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{
                                  textAlign: "right",
                                  marginLeft: "-12%",
                                }}
                                htmlFor=""
                                column
                                sm={4}
                              >
                                {paymentDetails.currentPaymentMethod.replaceAll(
                                  " ",
                                  ""
                                ) === "RAD/DAPCombination"
                                  ? DAPPORTION
                                  : DACPORTION}
                              </Label>
                              <Col sm={5}>
                                <NumberFormat
                                  thousandSeparator={true}
                                  prefix={"$"}
                                  // maxLength={17}
                                  fixedDecimalScale={2}
                                  allowNegative={false}
                                  decimalScale={2}
                                  name="currentDapPortion"
                                  id="currentDapPortion"
                                  value={paymentDetails.currentDapPortion}
                                  placeholder="$0.00"
                                  style={{ width: "100%", paddingLeft: "12px" }}
                                  disabled
                                />
                                {/* <Field
                                  name="paymentMethod"
                                  type="text"
                                  value={paymentDetails.currentDapPortion}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  maxLength="250"
                                  disabled={true}
                                  style={{ width: '50%' }}
                                /> */}
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label
                                style={{
                                  textAlign: "right",
                                  marginLeft: "-12%",
                                }}
                                htmlFor=""
                                column
                                sm={4}
                              >
                                {DRAWDOWN}
                              </Label>
                              <Col sm={5}>
                                <Field
                                  name="paymentMethod"
                                  type="text"
                                  value={paymentDetails.currentDrawdown}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  maxLength="250"
                                  disabled={true}
                                  style={{ width: "100%", paddingLeft: "12px" }}
                                />
                                {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                              </Col>
                            </FormGroup>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: "18px" }}>
                      <div className="head" style={{ marginBottom: "12px" }}>
                        <img src={Icon} className="icon" />
                        {ORIGINALPAYMENTMETHODVALUES}
                      </div>
                      <hr
                        className="headerBorder"
                        style={{ width: "80%", marginTop: "12px" }}
                      />

                      <div style={{ marginTop: "0px" }}>
                        {ORIGINALPAYMENTMSG}
                      </div>
                      <br />
                      <FormGroup row>
                        <Label
                          style={{ textAlign: "right" }}
                          htmlFor=""
                          column
                          sm={3}
                        >
                          {PAYMENTPRICE}
                        </Label>
                        <Col sm={8}>
                          {/* <Field
                            name="paymentPrice"
                            type="text"
                            value={paymentDetails.originalPaymentPrice}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            maxLength="250"
                            disabled={true}
                            style={{ width: '50%' }}
                          /> */}
                          {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                          <NumberFormat
                            thousandSeparator={true}
                            prefix={"$"}
                            // maxLength={17}
                            fixedDecimalScale={2}
                            allowNegative={false}
                            decimalScale={2}
                            name="originalPaymentPrice"
                            id="originalPaymentPrice"
                            value={paymentDetails.originalPaymentPrice}
                            placeholder="$0.00"
                            style={{ width: "50%", paddingLeft: "12px" }}
                            disabled
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          style={{ textAlign: "right" }}
                          htmlFor="mpir"
                          column
                          sm={3}
                        >
                          {MPIR}
                        </Label>
                        <Col sm={8}>
                          <NumberFormat
                            thousandSeparator={false}
                            suffix={"%"}
                            maxLength={7}
                            fixedDecimalScale={2}
                            allowNegative={false}
                            decimalScale={2}
                            name="originalMpir"
                            id="originalMpir"
                            value={paymentDetails.originalMpir}
                            placeholder={"0.00%"}
                            style={{ width: "50%", paddingLeft: "12px" }}
                            disabled={true}
                          />
                          {/* <Field
                            name="mpir"
                            type="text"
                            value={paymentDetails.originalMpir}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={true}
                            style={{ width: '50%' }}
                          /> */}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          style={{ textAlign: "right" }}
                          htmlFor="mpir"
                          column
                          sm={3}
                        >
                          {SUPPORTEDCATEGORY}
                        </Label>
                        <Col sm={8}>
                          <Field
                            name="supportedcategory"
                            type="text"
                            value={paymentDetails.originalSupportedCategory}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            maxLength="250"
                            disabled={true}
                            style={{ width: "50%", paddingLeft: "12px" }}
                          />
                        </Col>
                      </FormGroup>
                      {paymentDetails.originalSupportedCategoryId !== 1 ? (
                        <FormGroup row>
                          <Label
                            style={{ textAlign: "right" }}
                            htmlFor="mpir"
                            column
                            sm={3}
                          >
                            {PAYMENTMETHOD}
                          </Label>
                          <Col sm={8}>
                            <Field
                              name="paymentMethod"
                              type="text"
                              value={paymentDetails.originalPaymentMethod}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              maxLength="250"
                              disabled={true}
                              style={{ width: "50%", paddingLeft: "12px" }}
                            />
                          </Col>
                        </FormGroup>
                      ) : (
                        <></>
                      )}
                      {paymentDetails &&
                      paymentDetails.originalPaymentMethod &&
                      (paymentDetails.originalPaymentMethod.replaceAll(
                        " ",
                        ""
                      ) === "RAC/DACCombination" ||
                        paymentDetails.originalPaymentMethod.replaceAll(
                          " ",
                          ""
                        ) === "RAD/DAPCombination") ? (
                        <>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor=""
                              column
                              sm={3}
                            >
                              {paymentDetails.originalPaymentMethod.replaceAll(
                                " ",
                                ""
                              ) === "RAD/DAPCombination"
                                ? RADPORTION
                                : RACPORRTION}
                            </Label>
                            <Col sm={8}>
                              <NumberFormat
                                thousandSeparator={true}
                                prefix={"$"}
                                // maxLength={17}
                                fixedDecimalScale={2}
                                allowNegative={false}
                                decimalScale={2}
                                name="originalRADportion"
                                id="originalRADportion"
                                value={paymentDetails.originalRADportion}
                                placeholder="$0.00"
                                style={{ width: "50%", paddingLeft: "12px" }}
                                disabled
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor=""
                              column
                              sm={3}
                            >
                              {paymentDetails.originalPaymentMethod.replaceAll(
                                " ",
                                ""
                              ) === "RAD/DAPCombination"
                                ? DAPPORTION
                                : DACPORTION}
                            </Label>
                            <Col sm={8}>
                              <NumberFormat
                                thousandSeparator={true}
                                prefix={"$"}
                                // maxLength={17}
                                fixedDecimalScale={2}
                                allowNegative={false}
                                decimalScale={2}
                                name="originalDapPortion"
                                id="originalDapPortion"
                                value={paymentDetails.originalDapPortion}
                                placeholder="$0.00"
                                style={{ width: "50%", paddingLeft: "12px" }}
                                disabled
                              />
                              {/* <Field
                                  name="paymentMethod"
                                  type="text"
                                  value={paymentDetails.currentDapPortion}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  maxLength="250"
                                  disabled={true}
                                  style={{ width: '50%' }}
                                /> */}
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Label
                              style={{ textAlign: "right" }}
                              htmlFor=""
                              column
                              sm={3}
                            >
                              {DRAWDOWN}
                            </Label>
                            <Col sm={8}>
                              <Field
                                name="paymentMethod"
                                type="text"
                                value={paymentDetails.originalDrawdown}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                maxLength="250"
                                disabled={true}
                                style={{ width: "50%", paddingLeft: "12px" }}
                              />
                              {/* <ErrorMessage
                                name="rep_first_name"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                            </Col>
                          </FormGroup>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </FormGroup>
            </Row>
            {showAddEditForm && (
              <AddPaymentVariationDetails
                refundComplete={refundComplete}
                type={actionType}
                Data={selectedRowData}
                ShowModel={showAddEditForm}
                ParentCallBackToView={ParentCallBackToView}
                paymentDetails={paymentDetails}
                residentId={residentId}
                finalisedDate={finalisedDate}
                UpdateCancelCallback={UpdateCancelCallback}
                handleIsAdded={handleIsAdded}
                effectiveDate={effectiveDate}
                secondEffectiveDate={secondEffectiveDate}
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
              title={DELETE + " " + "Payment Variation"}
            ></DeleteConfirmationModelAlert>
          </Page>
        </>
      )}
    </Formik>
  );
};

export default ViewPaymentVariation;
