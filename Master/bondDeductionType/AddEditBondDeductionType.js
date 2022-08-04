import React, { Fragment, useEffect, useState } from "react";
import { ErrorMessage, Field, Formik } from "formik";
import Loader from "../../../components/Loader";
import * as Yup from "yup";
import Select from "react-select";
import {
  CLOSE,
  NEWTYPEMESSAGE,
  SAVE,
  TYPESELECTMESSAGE,
} from "../../../constant/MessageConstant";
import {
  Button,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Col,
  Row,
  FormGroup,
} from "reactstrap";
import ModalError from "../../../components/ModalError";
import {
  ADD,
  BONDDEDUCTIONTYPE,
  CANCLE,
  EDIT,
  NEWTYPE,
  TYPE,
} from "../../../constant/FieldConstant";
import BondTypeServices from "../../../services/Master/bondAndRadRacType.service";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import SingleSelect from "../../../components/MySelect/MySelect";

const AddEditBondDeductionType = ({
  showModel,
  callBackAddEditFormToViewForm,
  type,
  data,
}) => {
  const [show, setShow] = useState(showModel);
  const [typeList, setTypeList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [initialValues, setInitialValues] = useState({
    id: 0,
    name: "",
    typeId: 0,
  });
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    }else {
      document.body.style.overflow = 'unset';
    }
  }, [show])

  useEffect(() => {
    setShow(showModel);
    setSelectedType(typeList[0])
  }, [showModel]);

  useEffect(()=>{
    if(selectedType === null) {
    setSelectedType(typeList[1])
    }
  },[selectedType])

  useEffect(() => { 
    if (data.id) { 
      setInitialValues({
        id: data.id ? data.id : 0,
        name: data.bondDeductionType,
        typeId: data.deductionTypeId ? data.deductionTypeId : 0,
      });
      setSelectedType({ id: data.deductionTypeId, label: data.deductionTypeName });
    } else {
      setSelectedType(null);
      setInitialValues({
        id: 0,
        name: "",
        typeId: 0,
      });
    }
  }, [data]);

  useEffect(() => {
    BondTypeServices.getDropdownBondDeductionType(false, true)
      .then((response) => {
        const sortedResult = response.result.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        });
        const result = sortedResult.map((x) => {
          x.label = x.name;
          x.value = x.id;
          return x;
        }); 
        setTypeList(result);
        setSelectedType(result[0]);
      })
      .catch(() => {});
  }, []);

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    values.name = type === ADD ? "" : data.bondDeductionType;
    values.typeId = type === ADD ? "" : data.deductionTypeId;
    setShow(!show);
  };

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];

    setErrorArray([]);
    if (values.name === "" || values.name.trim() === "") {
      errorObj.name = "Required Field";
      errorArr.push({ name: NEWTYPE });
    }
    if (!values.typeId && !selectedType) {
      errorObj.typeId = "Required Field";
      errorArr.push({ name: TYPE });
    }
    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  async function saveProduct(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (type == EDIT) {
      setLoading(true);
      BondTypeServices.updateBondDeductionType(
        fields.id,
        fields.name,
        selectedType.id
      ).then(
        (data) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, data.message);
          setShow(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(true);
      BondTypeServices.createBondDeductionType(fields.name, selectedType.id).then(
        (data) => {
          setLoading(false);
          callBackAddEditFormToViewForm(false, true, data.message);
          setShow(false);
        },
        () => {
          setLoading(false);
        }
      );
    }
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

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string().required("Required Field"),
        typeId: Yup.string().required("Required Field"),
      })}
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
        setFieldValue,
        setFieldTouched,
        handleBlur,
      }) => (
        <Fragment>
          {loading ? <Loader></Loader> : null}
          <Modal
            isOpen={show}
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
              {type} {BONDDEDUCTIONTYPE}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={BONDDEDUCTIONTYPE}
                ></ModalError>

                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="name"
                      column
                      sm={3}
                      className={
                        errors.name && touched.name
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {NEWTYPE}
                    </Label>
                    {/* {values.name} */}
                    <Col sm={8}>
                      <Field
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={(e) => {
                          const val = (e.target.value || "").replace(
                            /\s+/gi,
                            " "
                          );
                          setFieldValue("name", val.trimLeft());
                          handleBlur(val);
                        }}
                        className={
                          "form-control fontsize-14" +
                          (errors.name && touched.name ? " is-invalid" : "")
                        }
                      />
                      <InlineBottomErrorMessage name="name" />
                    </Col>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="typeId"
                      column
                      sm={3}
                      className={
                        errors.typeId && touched.typeId && !selectedType
                          ? "is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {TYPE}
                    </Label>
                    <Col sm={8}>
                      <SingleSelect
                        name="typeId"
                        placeholder="Select...."
                        onBlur={(selected) =>
                          setFieldTouched("typeId", selected.id)
                        }
                        onChange={(selected) => {
                          setFieldValue("typeId", selected.id);
                        }}
                        error={errors.typeId && touched.typeId && !selectedType? true : false}
                        className={
                          errors.typeId && !selectedType
                            ? "is-invalid fontsize-14"
                            : "fontsize-14"
                        }
                        options={typeList}
                        isOptionSelected={(x) => {
                          return selectedType && x.id === selectedType.id
                            ? x
                            : null;
                        }}
                        defaultValue={selectedType}
                        theme={reactSelectTheme(
                          errors.typeId && touched.typeId
                        )}
                        styles={selectStyle}
                        isSearchable={typeList.length < 5 ? false : true}
                      />
                      <InlineBottomErrorMessage name="typeId" />
                      {/* <ErrorMessage
                        name="typeId"
                        component="div"
                        className="invalid-feedback"
                      /> */}
                    </Col>
                  </FormGroup>
                </Row>
              </ModalBody>
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
export default AddEditBondDeductionType;
