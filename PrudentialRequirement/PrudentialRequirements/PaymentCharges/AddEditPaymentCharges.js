import React, { useEffect, useState, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CKEditor } from "ckeditor4-react";
import Loader from "../../../../components/Loader";
import Select from "react-select";

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
  PAYMENTCHARGES,
} from "../../../../constant/FieldConstant";
import MuiDatePicker from "../../../../components/DatePicker/MaterialUi";
import InlineBottomErrorMessage from "../../../../components/InlineBottomErrorMessage";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../../components/NumberFormat";
import commonServices from "../../../../services/Common/common.services";
import prudentialRequirementService from "../../../../services/PrudentialRequirement/prudentialRequirement.service";
import { CLOSE, INSTRUCTMSG, SAVE } from "../../../../constant/MessageConstant";
import SingleSelect from "../../../../components/MySelect/MySelect";

const AddPaymentCharges = ({
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
  const [authorisedList, setAuthorisedList] = useState([]);
  const [selectedAuthorisedPerson, setSelectedAuthorisedPerson] = useState(
    null
  );
  const ref = useRef();
  const refCalendar = useRef();
  const [ckEditorData, setckEditorData] = useState("");
  const [initialValues, setInitialValues] = useState({
    date: "",
    payee: "",
    amount: "",
    description: "",
    comments: "",
    authorisedPersonId: "",
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
      setckEditorData(Data.item.comment);

      setInitialValues(Data.item);
      let desc = description.find((x) => x.id === Data.item.description);
      if (desc) {
        setSelectedDescription(desc);
        ref.current.setFieldValue("description", desc.id);
      }

      let auth = authorisedList.find(
        (x) => x.id === Data.item.authorisedPersonId
      );
      if (auth) {
        setSelectedAuthorisedPerson(auth);
        ref.current.setFieldValue("authorisedPersonId", auth.id);
      }
    }
  }, [Data, description, authorisedList]);

  useEffect(() => {}, [facility]);

  const getDescription = () => {
    setLoading(true);
    commonServices.getDescription().then((response) => {
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

  const getAuthorisedData = () => {
    setLoading(true);
    prudentialRequirementService.getAuthorisedData().then((response) => {
      setLoading(false);
      response.map((x) => {
        x.label = x.name;
        x.value = x.name;
        // x.id = x.title_type_id;
      });
      setAuthorisedList(response);
    });
  };

  useEffect(() => {
    getDescription();
    getAuthorisedData();
  }, []);

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    setShow(!show);
    setId(0);
    // setckEditorData("");
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

  const validateForm = (values) => {
    let errors = {};
    if (values.amount === undefined || parseFloat(values.amount) === 0) {
      errors.amount = "Error";
      ref && ref.current && ref.current.setFieldTouched("amount", true);
    }
    return errors;
  };

  const handleChangeDate = (date) => {
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

  async function savePaymentCharges(fields, { setStatus, setSubmitting }) {
    if (type == EDIT) {
      setLoading(true);
      prudentialRequirementService
        .updatePaymentCharges({
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
      prudentialRequirementService
        .createPaymentCharges({
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
        authorisedPersonId: Yup.string().required(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={savePaymentCharges}
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
              {type} {PAYMENTCHARGES}
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
                        // className={errors.description && touched.description ? "is-invalid" : ""}
                        options={description}
                        isOptionSelected={(x) => {
                          return selectedDescription &&
                            x.id === selectedDescription.id
                            ? x
                            : null;
                        }}
                        value={selectedDescription}
                        theme={reactSelectTheme(
                          errors.description && touched.description
                        )}
                        styles={selectStyle}
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
                        id="comment"
                        name="comment"
                        initData={ckEditorData}
                        onChange={handleEditorChange}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      style={{
                        textAlign: "right",
                        height: "40px",
                      }}
                      htmlFor="authorisedPersonId"
                      column
                      sm={3}
                      className={
                        errors.authorisedPersonId && touched.authorisedPersonId
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {"Authorisation"}
                    </Label>
                    <Col sm={7}>
                      <SingleSelect
                        name="authorisedPersonId"
                        menuPlacement="top"
                        placeholder="Select...."
                        onBlur={(selected) =>
                          setFieldTouched("authorisedPersonId", selected.id)
                        }
                        onChange={(selected) => {
                          setFieldValue("authorisedPersonId", selected.id);
                          setSelectedAuthorisedPerson(selected);
                        }}
                        error={
                          errors.authorisedPersonId &&
                          touched.authorisedPersonId
                            ? true
                            : false
                        }
                        options={authorisedList}
                        // isOptionSelected={(x) => {
                        //   console.log("x",x);
                        //   return selectedAuthorisedPerson &&
                        //     x.id === selectedAuthorisedPerson.id
                        //     ? x
                        //     : null;
                        // }}
                        value={selectedAuthorisedPerson}
                        theme={reactSelectTheme(
                          errors.authorisedPersonId &&
                            touched.authorisedPersonId
                        )}
                        styles={selectStyle}
                      />
                      <InlineBottomErrorMessage name="authorisedPersonId" />

                      {/* <ErrorMessage
                                name="title_type_id"
                                component="div"
                                className="invalid-feedback"
                              /> */}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      style={{
                        textAlign: "right",
                        height: "40px",
                      }}
                      column
                      sm={3}
                    ></Label>
                    <Col sm={7}>
                      <p style={{ fontStyle: "italic" }}>{INSTRUCTMSG}</p>
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

export default AddPaymentCharges;
