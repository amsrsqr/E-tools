import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { CKEditor } from "ckeditor4-react";
import Loader from "../../../components/Loader";
import InlineBottomErrorMessage from "../../../components/InlineBottomErrorMessage";
import { CLOSE, SAVE } from "../../../constant/MessageConstant";
import additionalServicesService from "../../../services/Master/additionalServices.service";
import { Input } from "reactstrap";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";
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

import {
  SERVICENAME,
  ADD,
  CANCLE,
  DESCRIPTION,
  DOCUMENTTYPE,
  PRICE,
  ADDITIONALSERVICE,
  ASSIGNEDFACILITIES,
} from "../../../constant/FieldConstant";
import ReactTableToggle from "../../../components/ReactTableToggle";

const AddEditAddtionalServices = ({
  ShowModel,
  Data,

  type,
  callBackAddEditFormToViewForm,
}) => {
  const [loading, setLoading] = useState(false);
  const [assignCheck, setAssignCheck] = useState(false);
  const [defaultCheck, setDefaultCheck] = useState(false);
  const [show, setShow] = useState(ShowModel);
  const [id, setId] = useState(0);
  const [ckEditorData, setckEditorData] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorArray, setErrorArray] = useState([]);
  const [modalPriceVal, setModalPriceVal] = useState(0);
  const [facilityList, setFacilityList] = useState([]);
  const [CPYfacilityList, setCPYFacilityList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    price: 0,
    description: "",
  });
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
    getAllFacilityList();
  }, []);

  useEffect(() => {
    if (Data && Data.item) {
      setId(Data.item.id);
      console.log(Data.item);
      setInitialValues({
        name: Data.item.serviceName,
        price: Data.item.price,
        description: Data.item.description,
      });
      setckEditorData(Data.item.description);
      getAllFacilityList(Data.item.facilities);
      setModalPriceVal(Data.item.price);
    } else {
      setInitialValues({
        name: "",
        price: "",
        description: "",
      });
      setckEditorData("");
      setId(0);
      setModalPriceVal(0);
      getAllFacilityList(null);
    }
  }, [Data]);

  const getAllFacilityList = (facilityId) => {
    setLoading(true);
    additionalServicesService.getAllFacility().then((response) => {
      setLoading(false);
      let result;
      if (facilityId) {
        result = response.map((x) => {
          const obj = {};

          obj.label = x.facility_name;

          obj.id = x.id;

          let IsAssigned = facilityId.filter(
            (filterfacilityId) => x.id === filterfacilityId.facilityId
          );

          obj.isChecked =
            IsAssigned.length > 0 ? IsAssigned[0].isAssigned : false;

          let isDefaultChecked = facilityId.filter(
            (filterfacilityId) => x.id === filterfacilityId.facilityId
          );

          obj.isDefaultChecked =
            isDefaultChecked.length > 0 ? isDefaultChecked[0].isDefault : false;

          return obj;
        });
      } else {
        result = response.map((x) => {
          const obj = {};
          obj.label = x.facility_name;
          obj.id = x.id;
          obj.isChecked = false;
          obj.isDefaultChecked = false;
          return obj;
        });
      }
      setFacilityList(result);
      setCPYFacilityList([...result]);
    });
  };
  const handleClose = (values) => {
    callBackAddEditFormToViewForm(!show, false);
    setShow(!show);
    setId(0);
    setckEditorData("");
    setFacilityList([]);
    setModalPriceVal(0);
    setDefaultCheck(false);
    setAssignCheck(false);
  };

  const validateForm = (values) => {
    var errorObj = {},
      errorArr = [];
    setErrorArray([]);
    if (values.name === "" || values.name.trim() === "") {
      errorObj.name = DOCUMENTTYPE;
      errorArr.push({ name: DOCUMENTTYPE });
    }
    if (modalPriceVal == 0 || modalPriceVal === "") {
      errorObj.price = "price error";
      errorArr.push({ name: "price error" });
    }
    setErrorArray(errorArr);
    if (errorArr.length) {
      setErrorArray(errorArr);
    }
    return errorObj;
  };

  async function saveAdditionalService(fields, { setStatus, setSubmitting }) {
    const facilities = [];
    facilityList.map((x) => {
      if (x.isChecked) {
        const obj = {
          facilityId: x.id,
          isAssigned: x.isChecked,
          isDefault: x.isDefaultChecked,
        };
        console.log(obj);
        facilities.push(obj);
      }
    });

    let ckEditorDataFilter = ckEditorData
      .replaceAll("&nbsp;", "")
      .replaceAll(/\s/g, "")
      .replaceAll("<p></p>", "");
    let ckEditorDescription = !ckEditorDataFilter.length ? "" : ckEditorData;
    if (id != 0) {
      setLoading(true);
      additionalServicesService
        .updateAddtionalServices(
          id,
          fields.name,
          modalPriceVal,
          ckEditorDescription,
          facilities
        )
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
      additionalServicesService
        .createAddtionalServices(
          fields.name,
          modalPriceVal,
          ckEditorDescription,
          facilities
        )
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

  const handleEditorChange = (event) => {
    let ckEditorData = event.editor.getData();
    setckEditorData(ckEditorData);
  };

  function getDefault({ cell: { value } }) {
    const cell = value;
    return (
      <Input
        className=""
        style={{ display: "flex", margin: "auto" }}
        type="checkbox"
        onClick={(e) => {
          if (!e.currentTarget.checked) {
            setDefaultCheck(false);
          } else {
            cell.isChecked = true;
            setDefaultCheck(false);
          }

          let arr3 = facilityList;
          let se = arr3.map((x) => {
            if (cell.id == x.id) {
              x.label = x.label;
              if (e.currentTarget.checked === true) {
                x.isChecked = e.currentTarget.checked ? true : false;
              }
              x.isDefaultChecked = e.currentTarget.checked ? true : false;
            }
            return x;
          });
          setFacilityList(se);
        }}
        checked={
          cell.isDefaultChecked == true
            ? true
            : false || defaultCheck
            ? true
            : false
        }
      ></Input>
    );
  }

  function getAssigned({ cell: { value } }) {
    const cell = value;

    return (
      <Input
        className=""
        style={{ display: "flex", margin: "auto" }}
        type="checkbox"
        onClick={(e) => {
          if (!e.currentTarget.checked) {
            setAssignCheck(false);
            setDefaultCheck(false);
          } else {
            cell.isChecked = true;
            setAssignCheck(false);
          }
          let arr2 = facilityList;
          let se = arr2.map((x) => {
            if (cell.id == x.id) {
              x.label = x.label;
              x.isChecked = e.currentTarget.checked ? true : false;
              x.isDefaultChecked = e.currentTarget.isDefaultChecked
                ? true
                : false;
            }
            return x;
          });
          setFacilityList(se);
        }}
        checked={
          cell.isChecked === true ? true : false || assignCheck ? true : false
        }
      ></Input>
    );
  }
  const EveryCellgetAssigned = ({ cell: { value } }) => {
    const [checkBox, setCheckBox] = useState(value.isChecked);
    useEffect(() => {
      setCheckBox(value.isChecked);
    }, [value.isChecked, checkBox]);

    return (
      <Input
        className=""
        style={{ display: "flex", margin: "auto" }}
        type="checkbox"
        onClick={(e) => {
          console.log("e.target.checked", e.target.checked);
          // console.log("total object", value);
          value.isChecked = e.target.checked;
          setCheckBox(e.target.checked);
        }}
        // value={value.isChecked}
        checked={checkBox}
      />
    );
  };

  const handleChangeAssigned = (event) => {
    let arr2 = facilityList;
    let newarr = [];
    if (event.currentTarget.checked) {
      newarr = arr2.map((x) => {
        x.label = x.label;
        x.isChecked = true;
        return x;
      });
    } else {
      newarr = arr2.map((x) => {
        x.label = x.label;
        x.isChecked = false;
        x.isDefaultChecked = false;
        return x;
      });
      setDefaultCheck(false);
    }
    setFacilityList(newarr);
    setAssignCheck(event.target.checked);
  };
  const onPriceChange = (e) => {
    let value = e.target.value.replace("$", "");
    setModalPriceVal(value);
  };

  const handleChangeDefault = (event) => {
    let arr2 = facilityList;
    let newarr = [];
    if (event.currentTarget.checked) {
      newarr = arr2.map((x) => {
        x.label = x.label;
        x.isChecked = true;
        x.isDefaultChecked = true;
        return x;
      });
      setAssignCheck(true);
    } else {
      newarr = arr2.map((x) => {
        x.label = x.label;
        x.isDefaultChecked = false;
        return x;
      });
    }

    setFacilityList(newarr);
    setDefaultCheck(event.target.checked);
  };

  const columns = React.useMemo(() => [
    {
      Header: "Facility Name",
      id: "ACTION",
      accessor: "label",
      width: "60%",
    },
    {
      Header: "Assigned",
      Footer: "Assigned",
      // accessor: getAssigned,

      accessor: (d) => d,
      Cell: getAssigned,
      // Cell: EveryCellgetAssigned,

      resizable: false,
      Filter: false,
      disableSortBy: true,
      sortable: false,
      Filter: ({ filter, onChange }) => {
        return (
          <input
            className="ml-4"
            type="checkbox"
            style={{ display: "flex", margin: "auto" }}
            onChange={handleChangeAssigned}
            checked={assignCheck == true ? true : false}
          />
        );
      },
      width: "15%",
    },

    {
      Header: "Default",
      id: "",
      Footer: "Default",
      resizable: false,
      Filter: false,
      disableSortBy: true,
      Filter: ({ filter, onChange }) => {
        return (
          <input
            className="ml-4"
            type="checkbox"
            onChange={handleChangeDefault}
            checked={defaultCheck == true ? true : false}
            style={{ display: "flex", margin: "auto" }}
          />
        );
      },
      // accessor: getDefault,
      Cell: getDefault,
      accessor: (d) => d,
      // Cell: EveryCellgetDefault,

      width: "15%",
    },
  ]);
  const searchFieldsCallback = (searchData) => {
    console.log("searchData in aad additional service", searchData);
    const tmpFacility = [...CPYfacilityList];
    if (searchData && Object.keys(searchData).length > 0) {
      const filterValue = tmpFacility.filter((v) =>
        v.label
          .toLocaleLowerCase()
          .includes(searchData.facilityName.toLocaleLowerCase())
      );
      // console.log("filterValue", filterValue);
      setFacilityList(filterValue);
    } else {
      // console.log("empty back space");
      setFacilityList(tmpFacility);
    }
  };
  const servicesList = React.useMemo(() => facilityList);
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        name: Yup.string(),
        price: Yup.string(),
        description: Yup.string(),
      })}
      validate={validateForm}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={saveAdditionalService}
    >
      {({
        errors,
        handleReset,
        handleSubmit,
        isSubmitting,
        setErrors,
        handleBlur,
        setFieldValue,
        touched,
        values,
      }) => (
        <>
          {loading ? <Loader></Loader> : null}
          <Modal
            centered
            isOpen={show}
            size="xl"
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
              {type} {ADDITIONALSERVICE}
            </ModalHeader>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody>
                <div className="row">
                  <div className="col">
                    <Row className={"fieldstyle"}>
                      <FormGroup row>
                        <Label
                          style={{ textAlign: "right" }}
                          htmlFor="documentName"
                          column
                          sm={3}
                          className={
                            errors.name && touched.name
                              ? "is-invalid-label required-field fw-bold"
                              : "required-field"
                          }
                        >
                          {SERVICENAME}
                        </Label>

                        <Col sm={9}>
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
                              "text form-control" +
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
                          htmlFor="price"
                          column
                          sm={3}
                          className={
                            errors.price && touched.price && !modalPriceVal
                              ? "is-invalid-label required-field fw-bold"
                              : "required-field"
                          }
                        >
                          {PRICE}
                        </Label>

                        <Col
                          sm={9}
                          className={
                            modalPriceVal === "" ||
                            (modalPriceVal === 0 &&
                              touched.price &&
                              !modalPriceVal)
                              ? "invaildPlaceholders"
                              : ""
                          }
                        >
                          {/* <NumberFormat
                            thousandSeparator={true}
                            prefix={"$"}
                            maxLength={17}
                            fixedDecimalScale={2}
                            allowNegative={false}
                            decimalScale={2}
                            name="price"
                            id="entryFeeTxtt"
                            value={modalPriceVal ? modalPriceVal : ""}
                            placeholder="$0.00"
                            onBlur={handleBlur}
                            onChange={onPriceChange}
                            style={{ alignText: "right" }}
                            className={
                              "text form-control" +
                              (errors.price && touched.price
                                ? " is-invalid"
                                : "")
                            }
                          /> */}

                          <NumberFormat
                            thousandSeparator={true}
                            prefix={"$"}
                            placeholder={"$0.00"}
                            allowNegative={false}
                            // maxLength={
                            //   modalPriceVal && modalPriceVal.length > 0
                            //     ? modalPriceVal === 0
                            //       ? 14
                            //       : 16
                            //     : modalPriceVal === 0
                            //     ? 14
                            //     : 14
                            // }
                            name="price"
                            id="entryFeeTxtt"
                            style={{ alignText: "right" }}
                            value={modalPriceVal ? modalPriceVal : ""}
                            onBlur={handleBlur}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              if (floatValue) {
                                setModalPriceVal(floatValue);
                              } else {
                                setModalPriceVal(0);
                              }
                            }}
                            fixedDecimalScale={2}
                            decimalScale={2}
                            className={
                              "text form-control " +
                              (errors.modalPriceVal &&
                              touched.modalPriceVal &&
                              !modalPriceVal
                                ? " is-invalid"
                                : "")
                            }
                          />

                          {!modalPriceVal ? (
                            <InlineBottomErrorMessage
                              name="price"
                              msg={"Required field & should be greater than 0"}
                            />
                          ) : null}

                          {/* <InlineBottomErrorMessage name="price" /> */}
                        </Col>
                      </FormGroup>
                    </Row>
                    <Row className="text-end">
                      <FormGroup row>
                        <Label sm={3}>{DESCRIPTION}</Label>
                        <Col sm={9}>
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
                  </div>
                  <div className="col">
                    <div
                      className="p-2 headone"
                      style={{ fontSize: "16px !important" }}
                    >
                      {ASSIGNEDFACILITIES}
                    </div>
                    <ReactTableToggle
                      columns={columns}
                      data={servicesList}
                      isScrolling={true}
                      searchFieldsCallback={searchFieldsCallback}
                      style={{
                        height: "350px",
                      }}
                      rowProps={(row) => ({
                        onClick: () => alert(JSON.stringify(row.values)),
                      })}
                    />
                  </div>
                </div>
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

export default AddEditAddtionalServices;
