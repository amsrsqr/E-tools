import React, { useEffect, useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
//import ModalError from "../../../components/ModalError";
import { CKEditor } from "ckeditor4-react";
import Loader from "../../../../components/Loader";
import InlineBottomErrorMessage from "../../../../components/InlineBottomErrorMessage";
import { CLOSE, SAVE } from "../../../../constant/MessageConstant";
import radRacDeductionRuleService from "../../../../services/Resident/bondDeductionPeriodRules.service";
import EopServices from "../../../../services/EndOfPeriod/EndOfPeriod.services";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import moment from "moment";

import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Label,
  Button,
  Row,
  Col,
  InputGroup,
} from "reactstrap";

import {
  ADD,
  CANCLE,
  COMMENT,
  EDIT,
  PERIODRULE,
  RULETYPE,
} from "../../../../constant/FieldConstant";
import Select from "react-select";
import MuiDatePicker from "../../../../components/DatePicker/MaterialUi";
import WarningAlert from "../../../../components/ModalWarning";

const AddEditPeriodRules = ({
  ShowModel,
  Data,
  type,
  callBackAddEditFormToViewForm,
  UpdateCancelCallback,
  bondId,
  handleCancelOnAdd1,
}) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(ShowModel);
  const [id, setId] = useState(0);
  const [ckEditorData, setckEditorData] = useState("");

  const [errorArray, setErrorArray] = useState([]);
  const [amountValue, setAmountValue] = useState(0);
  const ref = useRef();

  const [initialValues, setInitialValues] = useState({
    ruleTypeId: 0,
    description: "",
    amount: 0,
    EffectiveDate: "",
    ExpiryDate: "",
  });
  const [ruleType, setRuleType] = useState([]);
  const [selectedRuleType, setSelectedRuleType] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  const [showEopErrorPopup, setShowEopErrorPopup] = useState(false);
  const [BeFoforeEopCheckData, setBeFoforeEopCheckData] = useState({});
  const editorConfiguration = {
    removePlugins:
      "specialCharacters,elementspath,blockquote,save,flash,iframe,pagebreak,templates,about,showblocks,newpage,language,print,div",
    extraPlugins: ["font", "justify"],
    removeButtons:
      "Undo,Redo,SpecialChar,HorizontalRule,PasteText,Scayt,Styles,HorizontalLine,Subscript,Superscript,Link,Cut,Copy,Unlink,Paste,Indent,Outdent,Format,Table,Image,Source,Anchor,PasteFromWord,Insert Special Character,Save,Print,Preview,Find,About,Maximize,ShowBlocks",
    height: 160,
    innerWidth: 200,
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [show]);

  useEffect(() => {
    setShow(ShowModel);
  }, [ShowModel]);

  useEffect(() => {
    getRadRacDeductionRuleTypeList();
  }, []);

  useEffect(() => {
    console.log(Data.item);
    if (Data && Data.item) {
      setStartDate(new Date(moment(Data.item.startDate)));
      setEndDate(new Date(moment(Data.item.endDate)));
      setId(Data.item.id);
      setAmountValue(Data.item.amount);
      setckEditorData(Data.item.comment);
      //radRacDeductionTypeId

      setInitialValues({
        ruleTypeId: Data.item.deductionTypeId,
        description: Data.item.comment,
        amount: Data.item.amount,
        EffectiveDate: new Date(moment(Data.item.startDate)),
        ExpiryDate: new Date(moment(Data.item.endDate)),
      });
      setSelectedRuleType({
        id: Data.item.deductionTypeId,
        label: Data.item.deductionType,
      });
      //console.log("selectedRuleType", selectedRuleType);
    } else {
      setckEditorData("");
      setAmountValue(0);
      setId(0);
      setStartDate(new Date());
      setEndDate(null);
      setInitialValues({
        ruleTypeId: 0,
        description: "",
        amount: 0,
        EffectiveDate: "",
        ExpiryDate: "",
      });
      setSelectedRuleType(null);
    }
  }, [Data]);

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    setShow(!show);
    setckEditorData("");
    setAmountValue(0);
    setStartDate(null);
    setEndDate(null);
    setSelectedRuleType(null);
  };

  const getRadRacDeductionRuleTypeList = () => {
    setLoading(true);
    radRacDeductionRuleService
      .GetRadRacDeductionRuleType()
      .then((response) => {
        setLoading(false);
        console.log("This is result response", response);
        //const resultnew = response.result.filter((m) => m.permanent === true);
        const result = response.result.map((x) => {
          x.value = x.id;
          x.label = x.bondDeductionType;
          return x;
        });
        console.log("This is result dropdown", result);
        setRuleType(result);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);
    if (values.ruleTypeId === 0) {
      errorObj.ruleTypeId = "ruleType is Required";
      errorArr.push({ name: "ruleType" });
    }
    if (values.EffectiveDate === "" && startDate == null) {
      errorObj.EffectiveDate = "EFFECTIVEDATE ERROR";
      errorArr.push({ name: "EFFECTIVEDATE" });
    }

    if (values.ExpiryDate === "" && endDate == null) {
      errorObj.ExpiryDate = "EpiryDateERROR";
      errorArr.push({ name: "EpiryDate" });
    }

    if (!amountValue) {
      errorObj.amount = "amount error";
      errorArr.push({ name: "amount error" });
    }

    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  async function saveAddtionalRule(fields, { setStatus, setSubmitting }) {
    const FacilityId = localStorage.getItem("FacilityId");
    const tmpStartDate = fields.EffectiveDate
      ? fields.EffectiveDate.toJSON()
      : startDate.toJSON();
    EopServices.checkFinalisePeriod(FacilityId, tmpStartDate).then(
      (response) => {
        if (response && response.result) {
          setBeFoforeEopCheckData(
            type == EDIT
              ? {
                  id: id,
                  bondId: bondId,
                  deductionTypeId: selectedRuleType
                    ? selectedRuleType.id
                    : fields.ruleTypeId,
                  startDate: fields.EffectiveDate
                    ? moment(fields.EffectiveDate).format()
                    : moment(startDate).format(),
                  endDate: fields.ExpiryDate
                    ? moment(fields.ExpiryDate).format()
                    : "",
                  amount: amountValue,
                  comment: ckEditorData,
                }
              : {
                  bondId: bondId,
                  deductionTypeId: fields.ruleTypeId,
                  startDate: fields.EffectiveDate
                    ? moment(fields.EffectiveDate).format()
                    : moment(startDate).format(),
                  endDate: fields.ExpiryDate
                    ? moment(fields.ExpiryDate).format()
                    : "",
                  amount: amountValue,
                  comment: ckEditorData,
                }
          );
          setShowEopErrorPopup(!showEopErrorPopup);
        } else {
          if (type === EDIT) {
            const data = {
              id: id,
              bondId: bondId,
              deductionTypeId: selectedRuleType
                ? selectedRuleType.id
                : fields.ruleTypeId,
              startDate: fields.EffectiveDate
                ? moment(fields.EffectiveDate).format()
                : moment(startDate).format(),
              endDate: fields.ExpiryDate
                ? moment(fields.ExpiryDate).format()
                : "",
              amount: amountValue,
              comment: ckEditorData,
            };
            console.log("edit..", data);
            radRacDeductionRuleService
              .updateDeductionRule(data)
              .then((response) => {
                setLoading(false);
                console.log(response.result);
                callBackAddEditFormToViewForm(false, true, response.message);
                setShow(false);
              })
              .catch((err) => {
                setLoading(false);
              });
          } else {
            console.log("Date", fields.EffectiveDate);
            console.log("Date....New", new Date(fields.EffectiveDate));
            console.log(
              "Date....New with moment...",
              moment(fields.EffectiveDate).format()
            );

            const data = {
              bondId: bondId,
              deductionTypeId: fields.ruleTypeId,
              startDate: fields.EffectiveDate
                ? moment(fields.EffectiveDate).format()
                : moment(startDate).format(),
              endDate: fields.ExpiryDate
                ? moment(fields.ExpiryDate).format()
                : "",
              amount: amountValue,
              comment: ckEditorData,
            };

            setLoading(true);
            radRacDeductionRuleService
              .AddDeductionRule(data)
              .then((response) => {
                setLoading(false);
                console.log(response.result);
                callBackAddEditFormToViewForm(false, true, response.message);
                handleCancelOnAdd1({
                  screen: "bondDeduction",
                  tab: "listDeductionRule",
                  data: [],
                });
                setShow(false);
              })
              .catch((err) => {
                setLoading(false);
              });
          }
        }
      }
    );
    UpdateCancelCallback(id);
    setSubmitting(false);
  }

  const onContinueEop = () => {
    setShowEopErrorPopup(!showEopErrorPopup);
    if (BeFoforeEopCheckData && Object.keys(BeFoforeEopCheckData).length > 0) {
      if (type == EDIT) {
        setLoading(true);
        radRacDeductionRuleService
          .updateDeductionRule(BeFoforeEopCheckData)
          .then((response) => {
            setLoading(false);
            console.log(response.result);
            callBackAddEditFormToViewForm(false, true, response.message);
            setShow(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      } else {
        setLoading(true);
        radRacDeductionRuleService
          .AddDeductionRule(BeFoforeEopCheckData)
          .then((response) => {
            setLoading(false);
            console.log(response.result);
            callBackAddEditFormToViewForm(false, true, response.message);
            setShow(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    }
  };
  const onEopCancelClick = () => {
    setShowEopErrorPopup(!showEopErrorPopup);
  };

  const handleEditorChange = (event) => {
    let ckEditorData = event.editor.getData();
    setckEditorData(ckEditorData);
  };

  const handleChangeDate = (date) => {
    ref.current.setFieldValue("EffectiveDate", date);
    console.log(date);
    setStartDate(date);
  };
  const handleChangeDateForEndDate = (date) => {
    ref.current.setFieldValue("ExpiryDate", date);
    setEndDate(date);
  };
  const reactSelectTheme = (error) => (theme) => {
    const errorStyling = error
      ? {
          neutral50: "#dc3545",
          neutral30: "#dc3545",
          neutral20: "#dc3545",
          neutral60: "#dc3545",
        }
      : {};

    return {
      ...theme,
      colors: {
        ...theme.colors,
        ...errorStyling,
      },
    };
  };
  const selectStyle = {
    control: (base, state) => ({
      ...base,
      //border: 1,
      // This line disable the blue border
      // boxShadow: state.isFocused ? "0px 0px 0px 5px #c2dbfe !important" : 0,
      //   '&:hover': {
      //     border: 0,
      //     boxShadow: "0px 0px 0px 5px #c2dbfe !important"
      //  },
    }),
  };
  return (
    <Formik
      enableReinitialize
      innerRef={ref}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        ruleTypeId: Yup.string(),
        description: Yup.string(),
        amount: Yup.string().required(),
        EffectiveDate: Yup.string(),
        ExpiryDate: Yup.string(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveAddtionalRule}
    >
      {({
        errors,
        handleReset,
        handleSubmit,
        isSubmitting,
        setErrors,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        touched,
        values,
      }) => (
        <>
          {loading ? <Loader></Loader> : null}
          <Modal
            centered
            isOpen={show}
            size="lg"
            toggle={() => {
              handleClose(values, false);
              handleReset();
            }}
          >
            <WarningAlert
              isOpen={showEopErrorPopup}
              continueClicked={onContinueEop}
              cancelClicked={onEopCancelClick}
            ></WarningAlert>
            <ModalHeader
              toggle={() => {
                handleClose(values, false);
                handleReset();
              }}
            >
              {type} {PERIODRULE}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="ruleTypeId"
                      column
                      sm={2}
                      className={
                        errors.ruleTypeId && touched.ruleTypeId
                          ? "is-invalid-label required-field fw-bold"
                          : "required-field"
                      }
                    >
                      {RULETYPE}
                    </Label>

                    <Col sm={10}>
                      <Select
                        name="ruleTypeId"
                        options={ruleType}
                        placeholder="Select...."
                        onBlur={(selected) =>
                          setFieldTouched("ruleTypeId", selected.id)
                        }
                        onChange={(selected) => {
                          setFieldValue("ruleTypeId", selected.id);
                          setSelectedRuleType(selected);
                        }}
                        isOptionSelected={(x) => {
                          return selectedRuleType &&
                            x.id === selectedRuleType.id
                            ? x
                            : null;
                        }}
                        className={
                          "text form-control" + errors.ruleTypeId
                            ? "is-invalid"
                            : ""
                        }
                        defaultValue={selectedRuleType}
                        theme={reactSelectTheme(
                          errors.ruleTypeId && touched.ruleTypeId
                        )}
                        isSearchable={ruleType.length <= 6 ? false : true}
                        styles={selectStyle}
                      />
                      <InlineBottomErrorMessage name="ruleTypeId" />
                    </Col>
                  </FormGroup>
                </Row>

                <Row>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      // htmlFor="EffectiveDate"
                      className={
                        errors.EffectiveDate && touched.EffectiveDate
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                      column
                      sm={2}
                    >
                      Start Date
                    </Label>
                    <Col sm={10}>
                      <InputGroup>
                        <MuiDatePicker
                          id="EffectiveDate"
                          name="EffectiveDate"
                          className={"text form-control"}
                          selectedDate={startDate}
                          maxDate={endDate}
                          error={errors.EffectiveDate && touched.EffectiveDate}
                          getChangedDate={handleChangeDate}
                        />
                      </InputGroup>

                      <InlineBottomErrorMessage name="EffectiveDate" />
                    </Col>
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      // htmlFor="ExpiryDate"
                      column
                      className={
                        errors.ExpiryDate && touched.ExpiryDate
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                      sm={2}
                    >
                      End Date
                    </Label>
                    <Col sm={10}>
                      <InputGroup>
                        <MuiDatePicker
                          id="ExpiryDate"
                          name="ExpiryDate"
                          className={"text form-control"}
                          selectedDate={endDate}
                          error={errors.ExpiryDate && touched.ExpiryDate}
                          minDate={startDate}
                          getChangedDate={handleChangeDateForEndDate}
                        />
                      </InputGroup>
                      <InlineBottomErrorMessage name="ExpiryDate" />
                    </Col>
                  </FormGroup>
                </Row>

                <Row>
                  <FormGroup
                    row
                    className={
                      errors.amount && touched.amount
                        ? "invaildPlaceholders"
                        : ""
                    }
                  >
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="amount"
                      column
                      sm={2}
                      className={
                        errors.amount && touched.amount
                          ? "is-invalid-label required-field fw-bold"
                          : "required-field"
                      }
                    >
                      Amount
                    </Label>
                    <Col sm={5}>
                      <NumberFormat
                        thousandSeparator={true}
                        prefix="$"
                        placeholder="$0.00"
                        // maxLength={parseFloat(amountValue) == 0 ? 14 : 16}
                        fixedDecimalScale={2}
                        allowNegative={false}
                        decimalScale={2}
                        name="amount"
                        id="amount"
                        // value={values.amount ? values.amount : ""}
                        value={amountValue ? amountValue : ""}
                        onBlur={handleBlur}
                        onValueChange={(ev) => {
                          const { floatValue } = ev;

                          if (floatValue) {
                            setAmountValue(floatValue);
                            // setFieldValue('amount',floatValue);
                          } else {
                            setAmountValue(0);
                          }
                        }}
                        //style={{ alignText: "left" }}
                        className={
                          "text form-control" +
                          (errors.amount && touched.amount ? " is-invalid" : "")
                        }
                      />
                      <InlineBottomErrorMessage
                        name="amount"
                        msg="Required field & should be greater than 0"
                      />
                    </Col>{" "}
                    <Col sm={1} className="mt-2">
                      Daily
                    </Col>
                  </FormGroup>
                </Row>
                <Row className="text-end">
                  <FormGroup row>
                    <Label sm={2}>{COMMENT}</Label>
                    <Col sm={10}>
                      <CKEditor
                        config={editorConfiguration}
                        id="firstEditor"
                        name="description"
                        initData={ckEditorData}
                        onChange={handleEditorChange}
                      />
                    </Col>
                  </FormGroup>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="md"
                  className="modalsave btn btn-primary mr-2 "
                >
                  {type === ADD ? ADD : SAVE}
                </Button>
                <Button
                  type="reset"
                  className="clsbtn btn btn-secondary"
                  size="md"
                  onClick={() => {
                    setErrors({});
                    handleClose(values);
                  }}
                >
                  {type === ADD ? CLOSE : CANCLE}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default AddEditPeriodRules;
