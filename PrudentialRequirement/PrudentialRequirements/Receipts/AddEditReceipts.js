import React, { useEffect, useState, useRef } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { CKEditor } from "ckeditor4-react";
import Loader from "../../../../components/Loader";

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
import prudentialReceiptsService from "../../../../services/PrudentialRequirement/prudentialReceipts.service";
import {
  ADD,
  AMOUNT,
  CANCLE,
  COMMENTS,
  DATE,
  EDIT,
  PAYER,
  RECEIPT,
} from "../../../../constant/FieldConstant";
import { CLOSE, SAVE } from "../../../../constant/MessageConstant";
import MuiDatePicker from "../../../../components/DatePicker/MaterialUi";
import InlineBottomErrorMessage from "../../../../components/InlineBottomErrorMessage";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";

const AddReceipts = ({
  ShowModel,
  Data,
  type,
  callBackAddEditFormToViewForm,
  facility,
}) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(ShowModel);
  const [id, setId] = useState(0);
  const ref = useRef();

  const [ckEditorData, setckEditorData] = useState("");
  const [initialValues, setInitialValues] = useState({
    date: "",
    payer: "",
    amount: "",
    comments: "",
  });

  // useEffect(() => {
  //   if (!show) {
  //     document.body.style.overflow = "scroll";
  //   } else {
  //     document.body.style.overflow = "hidden";
  //   }
  // }, [show]);

  useEffect(() => {
    setShow(ShowModel);
  }, [ShowModel]);

  useEffect(() => {}, [facility]);
  useEffect(() => {
    console.log(Data);
    if (type === EDIT && Data && Data.item) {
      setInitialValues(Data.item);
      setckEditorData(Data.item.comments);
    }
  }, [Data]);

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    setShow(!show);
    setId(0);
    // setckEditorData("");
  };

  const handleChangeDate = (date) => {
    ref && ref.current && ref.current.setFieldValue("date", date);
  };
  const validateForm = (values) => {
    let errors = {};
    if (values.amount === undefined || parseFloat(values.amount) === 0) {
      errors.amount = "Error";
      ref && ref.current && ref.current.setFieldTouched("amount", true);
    }
    return errors;
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

  async function savePrudentialReceipts(fields, { setStatus, setSubmitting }) {
    if (type == EDIT) {
      setLoading(true);
      prudentialReceiptsService
        .updatePrudentialReceipts({
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
      prudentialReceiptsService
        .createPrudentialReceipts({
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
        payer: Yup.string().required(),
        amount: Yup.number().required(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={savePrudentialReceipts}
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
              {type} {RECEIPT}
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
                        errors.payer && touched.payer
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {PAYER}
                    </Label>
                    <Col sm={7}>
                      <Field
                        name="payer"
                        type="text"
                        value={values.payer}
                        onChange={(e) => {
                          const val = (e.target.value || "").replace(
                            /\s+/gi,
                            " "
                          );
                          setFieldValue("payer", val.trimLeft());
                          handleBlur(val);
                        }}
                        className={
                          "form-control" +
                          (errors.payer && touched.payer ? " is-invalid" : "")
                        }
                      />
                      <InlineBottomErrorMessage name="payer" />
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
                      {AMOUNT}
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
                    <Label style={{ textAlign: "right" }} sm={3}>
                      {COMMENTS}
                    </Label>
                    <Col sm={7}>
                      <CKEditor
                        config={editorConfiguration}
                        id="comment"
                        name="comment"
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

export default AddReceipts;
