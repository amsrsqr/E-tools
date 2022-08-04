import React, { useEffect, useState } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/Loader";

import {
  RADRACTYPEMESSAGE,
  CLOSE,
  SAVE,
} from "../../../constant/MessageConstant";

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
  Form,
} from "reactstrap";
import BondTypeServices from "../../../services/Master/bondAndRadRacType.service";

import {
  ADD,
  EDIT,
  NEWTYPE,
  RADRACDEDUCTIONTYPE,
} from "../../../constant/FieldConstant";
import ModalError from "../../../components/ModalError";
import { CANCLE } from "./../../../constant/FieldConstant";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";

const AddEditRadRacDeductionType = ({
  ShowModel,
  ParentCallBackToView,
  type,
  Data,
}) => {
  const [show, setShow] = useState(ShowModel);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorArray, setErrorArray] = useState([{ name: NEWTYPE }]);

  const [initialValues, setInitialValues] = useState({
    newType: "",
  });

  useEffect(() => {
    setShow(ShowModel);
  }, [ShowModel]);

  useEffect(() => {
    if (Data.id) {
      setId(Data.id);
      Field.newType = Data.name;
      setInitialValues({
        newType: Data.name,
      });
    } else {
      setId(0);
      setInitialValues({
        newType: "",
      });
    }
  }, [Data]);

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const handleClose = (values) => {
    ParentCallBackToView(!show, false);
    values.newType = type === ADD ? "" : Data.name;
    setShow(!show);
    if (type === ADD) setId(0);
    if (type === ADD) {
      setInitialValues({
        newType: "",
      });
    }
  };

  const validateForm = (values) => {
    if (values.newType === "" || values.newType.trim() === "") {
      //setShowErrorPopup(true);
      return { newType: RADRACTYPEMESSAGE };
    }
    return {};
  };

  async function saveRadRacDeductionType(fields, { setStatus, setSubmitting }) {
    setStatus();

    if (type == EDIT) {
      setLoading(true);
      BondTypeServices.updateRadRacDeductionType(id, fields.newType).then(
        (res) => {
          setLoading(false);
          ParentCallBackToView(false, true, res.message);
          setShow(false);
        },
        (errors) => {
          setLoading(false);
        }
      );
    } else {
      setLoading(true);
      BondTypeServices.createRadRacDeductionType(id, fields.newType).then(
        (res) => {
          setLoading(false);
          ParentCallBackToView(false, true, res.message);
          setShow(false);
        },
        (errors) => {
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
        newType: Yup.string().required(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={saveRadRacDeductionType}
    >
      {({
        errors,
        handleReset,
        setErrors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue,
      }) => (
        <>
          {loading ? <Loader></Loader> : null}
          <Modal
            centered
            isOpen={show}
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
              {type} {RADRACDEDUCTIONTYPE}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <ModalError
                  showErrorPopup={showErrorPopup}
                  fieldArray={errorArray}
                  handleErrorClose={handleErrorClose}
                  errorMessage={RADRACDEDUCTIONTYPE}
                ></ModalError>

                <Row className={"fieldStyle"}>
                  <FormGroup row>
                    <Label
                      style={{ textAlign: "right" }}
                      htmlFor="newType"
                      column
                      sm={3}
                      className={
                        errors.newType && touched.newType
                          ? " is-invalid-label required-field"
                          : "required-field"
                      }
                    >
                      {NEWTYPE}
                    </Label>
                    <Col sm={8}>
                      <Field
                        name="newType"
                        type="text"
                        value={values.newType}
                        onChange={(e) => {
                          const val = (e.target.value || "").replace(
                            /\s+/gi,
                            " "
                          );
                          setFieldValue("newType", val.trimLeft());
                          handleBlur(val);
                        }}
                        className={
                          "form-control" +
                          (errors.newType && touched.newType
                            ? " is-invalid"
                            : "")
                        }
                        style={{ fontSize: "14px", width: "318px" }}
                      />
                      <InlineBottomErrorMessage name="newType" />
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
                  {type === ADD ? ADD : SAVE}
                </Button>
                <Button
                  onClick={() => {
                    handleClose(values);
                    handleReset();
                  }}
                  variant="secondary"
                  className="clsbtn btn btn-secondary"
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

export default AddEditRadRacDeductionType;
