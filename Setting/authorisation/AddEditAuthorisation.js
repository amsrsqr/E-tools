import React, { Fragment, useEffect, useState } from "react";
import { Field, Formik } from "formik";
import Loader from "../../../components/Loader";
import * as Yup from "yup";
import {
  CLOSE,
  NAMEERRORMESSAGE,
  EMAILERRORMESSAGE,
  SAVE,
  EMAILINCORRECT,
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
  AUTHORIZATION,
  EDIT,
  AUTHORIZENAME,
  AUTHORIZEEMAIL,
  NAME,
  EMAIL,
  AUTHORIZATIONPERSON,
  CANCLE,
} from "../../../constant/FieldConstant";
import authorisationServices from "../../../services/Setting/authorisation.services";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";

const AddEditAuthorisation = ({
  showModel,
  callBackAddEditFormToViewForm,
  type,
  data,
}) => {
  const [show, setShow] = useState(showModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    isInactive: true,
  });
  useEffect(() => {
    setShow(showModel);
  }, [showModel]);

  useEffect(() => {
    if (data.id) {
      setInitialValues({
        id: data.id ? data.id : 0,
        name: data.name,
        email: data.email,
        isInactive: data.isinactive,
      });
    } else {
      setInitialValues({
        id: 0,
        name: "",
        email: "",
        isInactive: true,
      });
    }
  }, [data]);

  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    values.name = type === ADD ? "" : data.name;
    values.email = type === ADD ? "" : data.email;
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
      errorObj.name = NAMEERRORMESSAGE;
      errorArr.push({ name: NAME });
    }
    if (!values.email) {
      errorObj.email = EMAILERRORMESSAGE;
      errorArr.push({ name: EMAIL });
    }
    // if (values.email !== "") {
    //   errorObj.email = "The Email address is incorrectly formatted";
    //   errorArr.push({ name: EMAIL });
    // }

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
      authorisationServices
        .updateAuthorisation(
          fields.id,
          fields.name,
          fields.email,
          fields.isInactive
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
    } else {
      setLoading(true);
      authorisationServices
        .createAuthorisation(fields.name, fields.email, fields.isInactive)
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
    }
    setSubmitting(false);
  }
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(NAMEERRORMESSAGE),
        email: Yup.string()
          .trim()
          .required(EMAILERRORMESSAGE)
          .matches(
            "^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$",
            EMAILINCORRECT
          ),
        isInactive: Yup.string(),
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
        setErrors,
        touched,
        setFieldValue,
        handleBlur,
        values,
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
              {type} {AUTHORIZATIONPERSON}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={AUTHORIZATION}
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
                          ? "is-invalid-label required-field fw-bold"
                          : "required-field"
                      }
                    >
                      {AUTHORIZENAME}
                    </Label>
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
                        style={{ alignText: "right" }}
                        className={
                          "text form-control" +
                          (errors.name && touched.name ? " is-invalid" : "")
                        }
                      />
                      <InlineBottomErrorMessage name="name" />
                      {/* <ErrorMessage
                        name="name"
                        component="div"
                        className="invalid-feedback"
                      /> */}
                    </Col>
                  </FormGroup>
                </Row>
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="email"
                      column
                      sm={3}
                      className={
                        errors.email && touched.email
                          ? " is-invalid-label required-field fw-bold"
                          : "required-field"
                      }
                    >
                      {AUTHORIZEEMAIL}
                    </Label>
                    <Col sm={8}>
                      <Field
                        type="email"
                        name="email"
                        value={values.email}
                        style={{ alignText: "right" }}
                        className={
                          "text form-control" +
                          (errors.email && touched.email ? " is-invalid" : "")
                        }
                      />
                      <InlineBottomErrorMessage
                        name="email"
                        msg={
                          !values.email
                            ? "Required Field"
                            : "Please input a valid email"
                        }
                      />
                      {/* <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      /> */}
                    </Col>
                  </FormGroup>
                </Row>
                <Row className="text-center">
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right", marginLeft: "-5px" }}
                      sm={3}
                    >
                      Active
                    </Label>
                    <Col sm={8}>
                      <FormGroup check>
                        <Field
                          name="isInactive"
                          type="checkbox"
                          style={{ marginLeft: "-278px", marginTop: "10px" }}
                          checked={values.isInactive}
                        />{" "}
                        <Label style={{ color: "gray" }} check>
                          {values.isInactive}
                        </Label>
                      </FormGroup>
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
export default AddEditAuthorisation;
