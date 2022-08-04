import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import Icon from "../../../../src/assets/Images/icon.png";
import Page from "../../../components/Page";
import ReactTable from "../../../components/ReactTable";
import { FEESANDCHARGESTYPE, INFO } from "../../../constant/FieldConstant";
import feesAndCharges from "../../../services/Master/feesAndCharges.services";
import moment from "moment";
import { Col, Label, Row } from "reactstrap";
import Select from "react-select";
import AmountFormat from "../../../utils/AmountFormat";
import {
  FEESANDCHARGESTITLEESC,
  FEESANDCHARGESTITLE,
} from "../../../constant/MessageConstant";
import WarningMessageModelAlert from "../../../components/WarningMessageModelAlert";
import SingleSelect from "../../../components/MySelect/MySelect";

const ViewFeeAndCharges = () => {
  const [loading, setLoading] = useState(false);
  const [feesAndChargesList, setfeesAndChargesList] = useState([]);
  const [effectiveDateList, setEffectiveDateList] = useState([]);
  const [effectiveDateFirst, setEffectiveDateListFirst] = useState();
  const [title, setTitle] = useState();
  const [showWarningAlert, setShowWarningAlert] = useState(false);

  useEffect(() => {
    getAllfeesAndChargesList();
  }, []);

  useEffect(() => {
    if (effectiveDateFirst !== undefined) {
      const newEffectiveDate = effectiveDateFirst.value;
      feesAndCharges
        .getAllfeesAndChargesList(newEffectiveDate)
        .then((response) => {
          // console.log("getAllfeesAndChargesList response", response);
          setfeesAndChargesList(response);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [effectiveDateFirst]);

  const getAllfeesAndChargesList = () => {
    setLoading(true);
    feesAndCharges
      .getAllfeesAndCharges()
      .then((response) => {
        console.log("getAllfeesAndCharges response", response);
        const res = response.map((dt) => {
          return {
            value: dt,
            label: moment(dt).format("MM/DD/YYYY"),
          };
        });
        console.log("res",res)
        setEffectiveDateList(res);
        setEffectiveDateListFirst(res[0]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const selectStyle = {
    control: (base, state) => ({
      ...base,
      // boxShadow: state.isFocused ? "0px 0px 0px 5px #c2dbfe !important" : 0,
    }),
  };

  // function getEffectiveDate(effectiveDate) {
  //   return moment(effectiveDate).format("MM/DD/YYYY");
  // }

  const columns = [
    {
      Header: "Description",

      disableSortBy: true,
      accessor: (d) => d.description,
      className: "bold",
      width: "20%",
    },
    {
      Header: "Pensioner Type",

      disableSortBy: true,
      accessor: (d) => d.pensionerType,
      width: "20%",
    },
    {
      Header: "Resident Type",

      disableSortBy: true,
      accessor: (d) => d.residentType,
      width: "20%",
    },
    {
      Header: "Pre 20/03/08",
      Filter: true,
      disableSortBy: false,
      accessor: (d) => AmountFormat(d.pre),
      width: "20%",
    },
    {
      Header: "Post 20/03/08",
      Filter: true,
      disableSortBy: false,
      accessor: (d) => AmountFormat(d.post),
      width: "20%",
    },
  ];

  const onHandleMessage = (type, title, content) => {
    setShowWarningAlert(!showWarningAlert);
    const setNewTitle = {
      warningType: type,
      header: title,
      msg: content,
    };
    setTitle(setNewTitle);
  };

  const viewDataList = React.useMemo(() => feesAndChargesList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3" >
            <img src={Icon} className="icon" />
            Fees & Charges
            <i
              className="fa fa-info-circle fa-sm"
              style={{ cursor: "pointer" ,marginLeft:"10px"}}
              onClick={() =>
                onHandleMessage(
                  INFO,
                  FEESANDCHARGESTITLE,
                  FEESANDCHARGESTITLEESC.TEXT
                )
              }
            ></i>
          </div>
          <hr className="headerBorder" />

          <Row >
            <Col sm={8} style={{ display: "inline-flex" }}>
              <Col
                sm={1}
                className="p-2 headtwo"
                style={{ fontSize: "14px !important", marginLeft: "1rem" }}
              >
                Effective Date
              </Col>

              <Col sm={3} style={{ marginLeft: "1rem" }}>
                <SingleSelect
                  name="effectiveDate"
                  onChange={(selected) => {
                    setEffectiveDateListFirst(selected);
                  }}
                  options={effectiveDateList}
                  value={effectiveDateFirst}
                />
              </Col>
            </Col>
            <Col sm={4} style={{overflow:'hidden'}}>
              <Col
                sm={12}
                className=""
                style={{ paddingRight: "1.5rem",marginTop:"8px",marginLeft:"18.5rem ",overflow:'hidden'}}
             
              >
                Showing Fees & Charges effective from:{" "}
                {effectiveDateFirst && effectiveDateFirst.label}
              </Col>
            </Col>
          </Row>

          <ReactTable
            columns={columns}
            data={viewDataList}
            isFeesAndCharges={true}
          />
          {showWarningAlert && (
            <WarningMessageModelAlert
              warningType={title.warningType}
              header={title.header}
              msg={title.msg}
              showWarningAlert={showWarningAlert}
              setShowWarningAlert={setShowWarningAlert}
            />
          )}
        </Page>
      )}
    </>
  );
};
export default ViewFeeAndCharges;
