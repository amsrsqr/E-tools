import { Form, Formik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Loader from "../../../components/Loader";
import { CANCLE, TYPE } from "../../../constant/FieldConstant";
import { ADD, CLOSE, SAVE } from "../../../constant/MessageConstant";
import * as Yup from "yup";
import updateFacilityExtra from "../../../services/Facility/facilityServiceFirstTab.services";
import ModalError from "../../../components/ModalError";
import Select from "react-select";
import SingleSelect from "../../../components/MySelect/MySelect";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";

const UpdateExtraService = ({
  showModel,
  callBackAddEditFormToViewForm,
  type,
  data,
  tableExtra,
}) => {
  const [show, setShow] = useState(showModel);
  const [typeList, setTypeList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [selectData, setSelectData] = useState(tableExtra);
  const [extraServiceAmount, setExtraServiceAmount] = useState(0);
  const [extraReductionAmount, setExtraReductionAmount] = useState(0);
  const [ckEditorData, setckEditorData] = useState("");
  const [initialValues, setInitialValues] = useState({
    id: 0,
    facilityId: 0,
    extraServiceFee: 0,
    extraServiceReduction: 0,
    description: "",
  });
  useEffect(() => {
    setSelectData(tableExtra);
  }, [tableExtra]);

  useEffect(() => {
    setShow(showModel);
  }, [showModel]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [show]);

  useEffect(() => {
    if (data.id) {
      setSelectedType({ id: data.id, label: data.extraServiceChargeLevel });
      setExtraServiceAmount(data.extraServiceFee ? data.extraServiceFee : 0);
      setckEditorData(data.description);
      setExtraReductionAmount(
        data.extraServiceReduction ? data.extraServiceReduction : 0
      );
      setInitialValues({
        id: data.id ? data.id : 0,
        facilityId: data.facilityId,
        extraServiceFee: data.extraServiceFee ? data.extraServiceFee : 0,
        extraServiceReduction: data.extraServiceReduction
          ? data.extraServiceReduction
          : 0,
        description: data.description ? data.description : "",
      });
    }
  }, [data]);

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    setShow(!show);
  };
  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  async function saveProduct(fields, { setStatus, setSubmitting }) {
    setStatus();
    setLoading(true);
    updateFacilityExtra
      .updateExistingExtraService(
        fields.id,
        fields.facilityId,
        extraServiceAmount,
        extraReductionAmount,
        fields.description
      )
      .then(
        (data) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, data.message);
          setShow(false);
        },
        () => {
          setLoading(false);
        }
      );
    setSubmitting(false);
  }

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

  const editorConfiguration = {
    removePlugins:
      "specialCharacters,elementspath,blockquote,save,flash,iframe,pagebreak,templates,about,showblocks,newpage,language,print,div",
    extraPlugins: ["font", "justify"],
    removeButtons:
      "Undo,Redo,SpecialChar,HorizontalRule,PasteText,Scayt,Styles,HorizontalLine,Subscript,Superscript,Link,Cut,Copy,Unlink,Paste,Indent,Outdent,Format,Table,Image,Source,Anchor,PasteFromWord,Insert Special Character,Save,Print,Preview,Find,About,Maximize,ShowBlocks",
    height: 100,
    innerWidth: 100,
    autoGrow_maxHeight: 600,
  };
  const handleEditorChange = (event, func) => {
    let ckEditorData = event.editor.getData();
    func(ckEditorData);
  };
  const validateForm = (values) => {
    let plainText = values.description.replace(/<\/?[^>]+(>|$)/g, "");
    plainText = plainText.replace("/\n\n/g", "").replace(/\&nbsp;/g, "");
    plainText = plainText.replace(/<style([\s\S]*?)<\/style>/gi, "");
    plainText = plainText.replace(/<script([\s\S]*?)<\/script>/gi, "");
    plainText = plainText.replace(/<\/div>/gi, "\n");
    plainText = plainText.replace(/<\/li>/gi, "\n");
    plainText = plainText.replace(/<li>/gi, "  *  ");
    plainText = plainText.replace(/<\/ul>/gi, "\n");
    plainText = plainText.replace(/<\/p>/gi, "\n");
    plainText = plainText.replace(/<br\s*[\/]?>/gi, "\n");
    plainText = plainText.replace(/<[^>]+>/gi, "");

    var errorObj = {},
      errorArr = [];
    setErrorArray([]);

    if (extraServiceAmount == 0 || extraServiceAmount === " ") {
      errorObj.extraServiceFee = "extraServiceAmount error";
      errorArr.push({ name: "extraServiceAmount error" });
    }
    if (extraReductionAmount == 0 || extraReductionAmount === " ") {
      errorObj.extraServiceReduction = "extraReductionAmount error";
      errorArr.push({ name: "extraReductionAmount error" });
    }

    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({})}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveProduct}
    >
      {({
        handleReset,
        errors,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        handleChange,
        setFieldValue,
        setFieldTouched,
        handleBlur,
      }) => (
        <Fragment>
          {loading ? <Loader></Loader> : null}
          <Modal
            isOpen={show}
            size="lg"
            centered
            toggle={() => {
              handleClose(values);
              handleReset();
            }}
          >
            <ModalHeader
              toggle={() => {
                handleClose(values);
                handleReset();
              }}
            >
              {"Extra Service Charge - Edit"}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={"Extra Service Facility"}
                ></ModalError>
              </ModalBody>
              <Row className={"fieldstyle"}>
                <FormGroup row>
                  <Label
                    style={{ textAlign: "right" }}
                    htmlFor="facilityId"
                    column
                    sm={3}
                  >
                    {TYPE}
                  </Label>
                  <Col sm={9}>
                    <SingleSelect
                      isDisabled={true}
                      name="facilityId"
                      placeholder="Select...."
                      onBlur={(selected) =>
                        setFieldTouched("facilityId", selected.id)
                      }
                      onChange={(selected) => {
                        setFieldValue("facilityId", selected.id);
                      }}
                      error={errors.facilityId ? true : false}
                      options={typeList}
                      // isOptionSelected={(x) => {
                      //   return selectedType && x.id === selectedType.id
                      //     ? x
                      //     : null;
                      // }}
                      value={selectedType}
                      defaultValue={selectedType}
                    />
                  </Col>
                </FormGroup>
              </Row>
              <Row className={"fieldstyle"}>
                <FormGroup
                  row
                  className={
                    errors.extraServiceFee && touched.extraServiceFee
                      ? "invaildPlaceholders"
                      : ""
                  }
                >
                  <Label
                    style={{ textAlign: "right" }}
                    htmlFor="name"
                    column
                    sm={3}
                    className={
                      errors.extraServiceFee &&
                      touched.extraServiceFee &&
                      !extraServiceAmount
                        ? " is-invalid-label required-field"
                        : "required-field"
                    }
                  >
                    Extra Service Fee
                  </Label>
                  <Col sm={9}>
                    <NumberFormat
                      thousandSeparator={true}
                      prefix={"$"}
                      placeholder={"$0.00"}
                      allowNegative={false}
                      name="extraServiceFee"
                      id="extraServiceFee"
                      // maxLength={parseFloat(extraServiceAmount) == 0 ? 14 : 17}
                      style={{ alignText: "right" }}
                      value={extraServiceAmount ? extraServiceAmount : ""}
                      onBlur={handleBlur}
                      onValueChange={(values) => {
                        const { formattedValue, value, floatValue } = values;
                        if (floatValue) {
                          setExtraServiceAmount(floatValue);
                        } else {
                          setExtraServiceAmount(0);
                        }
                      }}
                      fixedDecimalScale={2}
                      decimalScale={2}
                      className={
                        "text form-control " +
                        (errors.extraServiceFee &&
                        touched.extraServiceFee &&
                        !extraServiceAmount
                          ? " is-invalid"
                          : "")
                      }
                    />
                    {!extraServiceAmount ? (
                      <InlineBottomErrorMessage
                        name="extraServiceFee"
                        msg={"Required field & should be greater than 0"}
                      />
                    ) : null}
                  </Col>
                </FormGroup>
              </Row>
              <Row className={"fieldstyle"}>
                <FormGroup
                  row
                  className={
                    errors.extraServiceReduction &&
                    touched.extraServiceReduction
                      ? "invaildPlaceholders"
                      : ""
                  }
                >
                  <Label
                    style={{ textAlign: "right" }}
                    htmlFor="name"
                    column
                    sm={3}
                    className={
                      errors.extraServiceReduction &&
                      touched.extraServiceReduction &&
                      !extraReductionAmount
                        ? " is-invalid-label required-field"
                        : "required-field"
                    }
                  >
                    Extra Service Reduction
                  </Label>
                  <Col sm={9}>
                    <NumberFormat
                      thousandSeparator={true}
                      prefix={"$"}
                      placeholder={"$0.00"}
                      allowNegative={false}
                      name="extraServiceReduction"
                      id="extraServiceReduction"
                      // maxLength={
                      //   parseFloat(extraReductionAmount) == 0 ? 14 : 17
                      // }
                      style={{ alignText: "right" }}
                      value={extraReductionAmount ? extraReductionAmount : ""}
                      onBlur={handleBlur}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        if (floatValue) {
                          setExtraReductionAmount(floatValue);
                        } else {
                          setExtraReductionAmount(0);
                        }
                      }}
                      fixedDecimalScale={2}
                      decimalScale={2}
                      className={
                        "text form-control " +
                        (errors.extraServiceReduction &&
                        touched.extraServiceReduction &&
                        !extraReductionAmount
                          ? " is-invalid"
                          : "")
                      }
                    />
                    {!extraReductionAmount ? (
                      <InlineBottomErrorMessage
                        name="extraServiceReduction"
                        msg={"Required field & should be greater than 0"}
                      />
                    ) : null}
                  </Col>
                </FormGroup>
              </Row>
              <Row className={"fieldstyle"}>
                <FormGroup row>
                  <Label
                    style={{ textAlign: "right" }}
                    htmlFor="comment"
                    column
                    sm={3}
                  >
                    Description
                  </Label>
                  <Col sm={9}>
                    {/* <CKEditor
                      config={editorConfiguration}
                      id="description"
                      name="description"
                      initData={ckEditorData}
                      onChange={($event) => {
                        handleEditorChange($event, setckEditorData);
                        setFieldValue("description", $event.editor.getData());
                      }}
                    /> */}

                    <textarea
                      name="description"
                      type="text"
                      value={values.description}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className={
                        "form-control" +
                        (errors.description && touched.description
                          ? " is-invalid"
                          : "")
                      }
                      //maxLength="250"
                    />
                  </Col>
                </FormGroup>
              </Row>

              <ModalFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="md"
                  className="modalsave btn btn-primary mr-2"
                >
                  {type === ADD ? ADD : SAVE}
                </Button>
                <Button
                  type="reset"
                  className="clsbtn btn btn-secondary"
                  size="md"
                  onClick={() => {
                    handleClose(values);
                    handleReset();
                  }}
                >
                  {type === ADD ? CLOSE : CANCLE}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </Fragment>
      )}
    </Formik>
  );
};
export default UpdateExtraService;
