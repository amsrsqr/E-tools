import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
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
} from "reactstrap";

import { CLOSE, SAVE } from "../../../constant/MessageConstant";
import { ADD } from "../../../constant/FieldConstant";
import Loader from "../../../components/Loader";
import { CERTIFICATE } from "./../../../constant/MessageConstant";
import ModalError from "../../../components/ModalError";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import residentRepresentativeService from "../../../services/Master/residentRepresentative.service";

const AddEditRepresentativeCategories = ({
  ShowModel,
  ParentCallBackToRepresentativeView,
  type,
  Data,
}) => {
  const [show, setShow] = useState(ShowModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  // const [errorArray, setErrorArray] = useState([{ name: CERTIFICATETYPE }]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
  });

  useEffect(() => {
    setShow(ShowModel);
  }, [ShowModel]);

  useEffect(() => {
    if (Data.id) {
      setId(Data.id);
      setInitialValues({
        name: Data.name,
      });
    } else {
      setId(0);
      setInitialValues({
        name: "",
      });
    }
  }, [Data]);

  //alert(show);
  // Close button
  const handleClose = () => {
    ParentCallBackToRepresentativeView(!show, false);

    setShow(!show);
    setId(0);
    if (type === ADD) setId(0);
    if (type === ADD) {
      setInitialValues({
        name: "",
      });
    }
  };

  async function saveRepresentativeCategories(
    fields,
    { setStatus, setSubmitting }
  ) {
    setStatus();

    setLoading(true);
    residentRepresentativeService
      .createRepresentativeCategories(id, fields.name)
      .then(
        (res) => {
          setLoading(false);
          ParentCallBackToRepresentativeView(false, true, res.message);
          setShow(false);
          fields.name = "";
        },
        (errors) => {
          setLoading(false);
          //childToParent(true, false);
        }
      );

    // setId(0);
    // setInitialValues({
    //   certificateType: "",
    // });

    setSubmitting(false);
  }
  const validateForm = (values) => {
    if (values.name === "" || values.name.trim() === "") {
      return { name: "abc" };
    }
    return {};
  };
  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveRepresentativeCategories} 
    >
      {({
        errors,
        setErrors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values,
      }) => (
        <>
          {" "}
          {loading ? <Loader></Loader> : null}
          <Modal
            isOpen={show}
            centered
            toggle={() => {
              setErrors({});
              handleClose(values);
            }}
          >
            <ModalHeader
              toggle={() => {
                setErrors({});
                handleClose(values);
              }}
            >
              {type} Representative Category   
            </ModalHeader>
            <Form onSubmit={handleSubmit}  autoComplete="off">
              <ModalBody>
                {/* <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={CERTIFICATETYPE}
                ></ModalError> */}
                <Row className={"fieldstyle"}>
                  <FormGroup row>
                    <Label
                      style={{
                        textAlign: "right",
                      }}
                      htmlFor="name"
                      column
                      sm={4}
                      className={
                        errors.name && touched.name
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      New Category  
                    </Label>
                    <Col sm={8}>
                      <Field
                        name="name"
                        type="text"
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
                          "form-control" +
                          (errors.name && touched.name ? " is-invalid" : "")
                        } 
                      />
                      <InlineBottomErrorMessage name="name" />
                    </Col>
                  </FormGroup>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="modalsave btn btn-primary mr-2"
                  color="primary"
                  size="md"
                >
                  {ADD}
                </Button>
                <Button
                  onClick={() => {
                    setErrors({});
                    handleClose(values);
                  }}
                  color="secondary"
                  className="clsbtn btn btn-secondary"
                >
                  {CLOSE}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default AddEditRepresentativeCategories;
