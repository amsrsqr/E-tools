import React, { useEffect, useState, useRef } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { CKEditor } from "ckeditor4-react";
import Loader from "../../../components/Loader";

import {
  Modal,
  ModalBody,
  InputGroup,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Label,
  Button,
  Row,
  Col,
} from "reactstrap";
import {
  ADD,
  AMOUNT,
  CANCLE,
  COMMENTS,
  DATE,
  DESCRIPTION,
  EDIT,
  PAYEE,
} from "../../../constant/FieldConstant";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
import { CLOSE, SAVE } from "../../../constant/MessageConstant";
import prudentialBankPaymentChargesService from "../../../services/PrudentialRequirement/prudentialBankPaymentCharges.service";
import MuiDatePicker from "../../../components/DatePicker/MaterialUi";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import commonServices from "../../../services/Common/common.services";
import SingleSelect from "../../../components/MySelect/MySelect";

const AddBankPaymentCharges = ({
  ShowModel,
  Data,
  type,
  callBackAddEditFormToViewForm,
  facility,
}) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(ShowModel);
  const [id, setId] = useState(0);
  const [description, setDescription] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState(null);

  const ref = useRef();
  const [ckEditorData, setckEditorData] = useState("");
  const [initialValues, setInitialValues] = useState({
    date: "",
    payee: "",
    amount: "",
    description: "",
    comments: "",
  });
  // useEffect(() => {
  //   if (show) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "unset";
  //   }
  // }, [show]);

  useEffect(() => {
    setShow(ShowModel);
  }, [ShowModel]);

  useEffect(() => {
    console.log(Data);
    if (type === EDIT && Data && Data.item) {
      setInitialValues(Data.item);
      setckEditorData(Data.item.comment);
      let desc = description.find((x) => x.id === Data.item.description);
      if (desc) {
        setSelectedDescription(desc);
        ref.current.setFieldValue("description", desc.id);
      }
    }
  }, [Data, description]);

  useEffect(() => {}, [facility]);

  const getDescription = () => {
    setLoading(true);
    commonServices.getNonBondDescription().then((response) => {
      setLoading(false);
      response.map((x) => {
        x.label = x.name;
        x.value = x.name;
        // x.id = x.title_type_id;
      });
      setDescription(response);
      return response;
    });
  };

  useEffect(() => {
    getDescription();
  }, []);

  const validateForm = (values) => {
    let errors = {};
    if (values.amount === undefined || parseFloat(values.amount) === 0) {
      errors.amount = "Error";
      ref && ref.current && ref.current.setFieldTouched("amount", true);
    }

    return errors;
  };

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    setShow(!show);
    setId(0);
    // setckEditorData("");
  };

  const handleChangeDate = (date) => {
    // console.log("date....", date);
    ref && ref.current && ref.current.setFieldValue("date", date);
  };

  const editorConfiguration = {
    removePlugins:
      "specialCharacters,elementspath,blockquote,save,flash,iframe,pagebreak,templates,about,showblocks,newpage,language,print,div",
    extraPlugins: ["font", "justify"],
    removeButtons:
      "Undo,Redo,SpecialChar,HorizontalRule,PasteText,Scayt,Styles,HorizontalLine,Subscript,Superscript,Link,Cut,Copy,Unlink,Paste,Indent,Outdent,Format,Table,Image,Source,Anchor,PasteFromWord,Insert Special Character,Save,Print,Preview,Find,About,Maximize,ShowBlocks",
    height: 160,
    innerWidth: 200,
  };
  const handleEditorChange = (event) => {
    let ckEditorData = event.editor.getData();
    setckEditorData(ckEditorData);
  };

  async function saveBankPaymentCharges(fields, { setStatus, setSubmitting }) {
    if (type == EDIT) {
      setLoading(true);
      prudentialBankPaymentChargesService
        .updateBankPaymentCharges({
          ...fields,
          comments: ckEditorData,
          facilityId: facility.facility_id,
        })
        .then((res) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, res.message);
          setShow(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      prudentialBankPaymentChargesService
        .createBankPaymentCharges({
          ...fields,
          comments: ckEditorData,
          facilityId: facility.facility_id,
        })
        .then((res) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, res.message);
          setShow(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    setSubmitting(false);
  }
  return (
    <Formik
      enableReinitialize
      innerRef={ref}
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        date: Yup.date().required(),
        payee: Yup.string().required(),
        amount: Yup.number().required(),
        description: Yup.string().required(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={saveBankPaymentCharges}
    >
      {({
        errors,
        handleReset,
        handleSubmit,
        isSubmitting,
        setErrors,
        touched,
        setFieldValue,
        values,
        handleBlur,
        handleChange,
        setFieldTouched,
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
            <ModalHeader
              toggle={() => {
                handleClose(values, false);
                handleReset();
              }}
            >
              {type} {"Bank Payment / Charge Details"}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <Row className={"fieldStyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right", marginLeft: "-8%" }}
                      htmlFor="date"
                      className={
                        errors.date && touched.date
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                      column
                      sm={4}
                    >
                      {DATE}
                    </Label>
                    <Col sm={7}>
                      <InputGroup style={{ width: "100% !important" }}>
                        <MuiDatePicker
                          id="date"
                          name="date"
                          selectedDate={values.date}
                          // ref={refCalendar}
                          error={touched.date && errors.date}
                          className="w-100"
                          dateFormat="dd/MM/yyyy"
                          getChangedDate={handleChangeDate}
                          //   className={"datepickerwidth"}
                        />
                      </InputGroup>

                      <InlineBottomErrorMessage
                        name="date"
                        msg={
                          values.date == "Invalid Date"
                            ? "Invalid date"
                            : "Required Field"
                        }
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="payee"
                      column
                      sm={3}
                      className={
                        errors.payee && touched.payee
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {PAYEE}
                    </Label>
                    <Col sm={7}>
                      <Field
                        name="payee"
                        type="text"
                        value={values.payee}
                        onChange={(e) => {
                          const val = (e.target.value || "").replace(
                            /\s+/gi,
                            " "
                          );
                          setFieldValue("payee", val.trimLeft());
                          handleBlur(val);
                        }}
                        className={
                          "form-control" +
                          (errors.payee && touched.payee ? " is-invalid" : "")
                        }
                      />
                      <InlineBottomErrorMessage name="payee" />
                    </Col>
                  </FormGroup>
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
                      htmlFor=""
                      column
                      sm={3}
                      className={
                        errors.amount && touched.amount
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {AMOUNT} hii
                    </Label>
                    <Col sm={7}>
                      <NumberFormat
                        thousandSeparator={true}
                        prefix={"$"}
                        // maxLength={values.amount === 0 ? 14 : 16}
                        fixedDecimalScale={2}
                        allowNegative={false}
                        decimalScale={2}
                        name="amount"
                        id="amount"
                        value={values.amount}
                        placeholder="$0.00"
                        style={{ width: "100%" }}
                        className={
                          "text form-control" +
                          (errors.amount && touched.amount ? " is-invalid" : "")
                        }
                        onValueChange={(x) => {
                          ref &&
                            ref.current &&
                            ref.current.setFieldValue("amount", x.floatValue);
                        }}
                      />
                      <InlineBottomErrorMessage
                        name="amount"
                        msg="Required field & should be greater than 0"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      style={{
                        textAlign: "right",
                        height: "40px",
                      }}
                      htmlFor="description"
                      column
                      sm={3}
                      className={
                        errors.description && touched.description
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {DESCRIPTION}
                    </Label>
                    <Col sm={7}>
                      <SingleSelect
                        name="description"
                        placeholder="Select...."
                        onBlur={(selected) =>
                          setFieldTouched("description", selected.id)
                        }
                        onChange={(selected) => {
                          setFieldValue("description", selected.id);
                          setSelectedDescription(selected);
                        }}
                        error={
                          errors.description && touched.description
                            ? true
                            : false
                        }
                        className={
                          errors.description && touched.description
                            ? "is-invalid"
                            : ""
                        }
                        options={description}
                        isOptionSelected={(x) => {
                          return selectedDescription &&
                            x.id === selectedDescription.id
                            ? x
                            : null;
                        }}
                        value={selectedDescription}
                      />
                      <InlineBottomErrorMessage name="description" />

                      {/* <ErrorMessage
                                name="title_type_id"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label style={{ textAlign: "right" }} sm={3}>
                      {COMMENTS}
                    </Label>
                    <Col sm={7}>
                      <CKEditor
                        config={editorConfiguration}
                        id="comments"
                        name="comments"
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

export default AddBankPaymentCharges;
