import React from "react";
import { CKEditor } from "ckeditor4-react";

import { useState } from "react";
import Page from "../../../components/Page";
import ReactTable from "../../../components/ReactTable";
import DirtyWarningAlert from "../../../components/DirtyWarningAlert";

import {
  ANYBONDBALANCE,
  BUTNOTGREATERTHAN,
  DELETE,
  INSERT,
  ISGREATERTHAN,
  ISNOTGREATERTHAN,
  LIQUIDITY,
  MINIMUMLIQUIDITYLEVEL,
  MINIMUMLIQUIDITYREQUIRED,
  REFUNDABLEDEPOSITBOND,
  UPDATE,
} from "../../../constant/FieldConstant";
import Icon from "../../../../src/assets/Images/icon.png";
import Loader from "../../../components/Loader";
import {
  ALLVALUEFILLED,
  LIQUIDITYHEADINGMESSAGE,
  VALUEGREATERTHANLOWERLIMIT,
  VALUELESSTHANLOWERLIMIT,
} from "../../../constant/MessageConstant";
import { Button } from "reactstrap";
import { useEffect } from "react";
import liquidityService from "../../../services/Master/liquidity.service";
import ModalValidation from "../../../components/modalValidation";
import SuccessAlert from "../../../components/SuccessAlert";
import DeleteConfirmationModelAlert from "../../../components/DeleteConfirmationModelAlert";
// import NumberFormat from "react-number-format";
import NumberFormat from "../../../components/NumberFormat";

const ViewLiquidity = () => {
  const [loading, setLoading] = useState(false);
  const [liquidityList, setLiquidityList] = useState([]);
  const [ckEditorData, setCkEditorData] = useState("");
  const [CPYliquidityList, setCPYLiquidityList] = useState([]);
  const [CPYckEditorData, setCPYCkEditorData] = useState("");
  const [IsUpdated, setsetIsUpdated] = useState(false);

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [message, setMessage] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertOptions, setSuccessAlertOptions] = useState({});
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
  ] = useState(false);
  const [
    deleteConfirmationModalData,
    setDeleteConfirmationModalData,
  ] = useState({});
  // const handleEditorChange = (event) => {
  //   let ckEditorData = event.editor.getData();
  //   setCkEditorData(ckEditorData);
  // };

  const handleEditorChange = (event) => {
    let ckEditorData = event.editor.getData();

    setCkEditorData(ckEditorData);

    localStorage.setItem("ckEditorData", ckEditorData);
  };

  const [indexForDelete, setIndexForDelete] = useState(-1);

  const editorConfiguration = {
    removePlugins:
      "specialCharacters,elementspath,blockquote,save,flash,iframe,pagebreak,templates,about,showblocks,newpage,language,print,div",
    extraPlugins: ["font", "justify"],
    removeButtons:
      "Undo,Redo,SpecialChar,HorizontalRule,PasteText,Scayt,Styles,HorizontalLine,Subscript,Superscript,Link,Cut,Copy,Unlink,Paste,Indent,Outdent,Format,Table,Image,Source,Anchor,PasteFromWord,Insert Special Character,Save,Print,Preview,Find,About,Maximize,ShowBlocks",
    height: 160,
    innerWidth: 200,
    width: 1100,
  };

  const handleErrorClose = () => {
    setShowErrorPopup(!showErrorPopup);
  };

  const getAllLiquidity = () => {
    setLoading(true);
    liquidityService
      .getAllLiquidity()
      .then((response) => {
        setLoading(false);
        setCkEditorData(response.comment);
        setCPYCkEditorData(response.comment);
        //updateAllHigherLimit(response);
        if (response.liquidityLimits.length === 1) {
          response.liquidityLimits[0].bondReceivedHigherLimit =
            response.liquidityLimits[0].bondReceivedLowerLimit;
        }
        updateAllHigherLimit(response.liquidityLimits);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllLiquidity();
    updateAllHigherLimit(liquidityList);
  }, []);

  const amountFormat = (amt) => {
    const newNum = addZeroes(amt);
    let newNumber = numberWithCommas(newNum);
    return `${newNumber}`.includes("-")
      ? "-$" + `${newNumber}`.replace("-", "")
      : `$${newNumber}`;
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function addZeroes(value) {
    var new_value = value * 1;
    new_value = new_value + "";

    let pos = new_value.indexOf(".");
    if (pos == -1) new_value = new_value + ".00";
    else {
      var integer = new_value.substring(0, pos);
      var decimals = new_value.substring(pos + 1);
      while (decimals.length < 2) decimals = decimals + "0";
      new_value = integer + "." + decimals;
    }
    return new_value;
  }

  useEffect(() => {
    // console.log("rendered liquidity", liquidityList);
    // console.log(" CPYliquidity", CPYliquidityList);
    // console.log("rendered ckEditorData", ckEditorData);
    // console.log(" CPYckEditorData", CPYckEditorData);
    if (
      JSON.stringify(liquidityList) === JSON.stringify(CPYliquidityList) &&
      ckEditorData === CPYckEditorData
    ) {
      // console.log(" not changed");
      setsetIsUpdated(false);
    } else {
      // console.log("changed");
      setsetIsUpdated(true);
    }
  }, [ckEditorData, liquidityList, CPYliquidityList, CPYckEditorData]);

  const updateAllHigherLimit = (liquidityList, action) => {
    let liquidityArray = JSON.parse(JSON.stringify(liquidityList));
    if (liquidityList.length) delete liquidityArray[0].bondReceivedHigherLimit;

    liquidityArray.forEach((x, i) => {
      if (i > 0) {
        liquidityArray[i - 1].bondReceivedHigherLimit = parseFloat(
          liquidityArray[i].bondReceivedLowerLimit
        );
      }
    });
    setLiquidityList(liquidityArray);
    if (
      action === "Delete" ||
      action === "Insert" ||
      action === "amountChange"
    ) {
    } else {
      setCPYLiquidityList(JSON.parse(JSON.stringify(liquidityArray)));
    }
  };

  function checkLiquidityListValidations() {
    let returnFlag = false;
    liquidityList.forEach((obj, i) => {
      if (i === 0) {
        if (liquidityList.length !== 1 && !obj.bondReceivedHigherLimit) {
          returnFlag = true;
        }
      } else if (i === liquidityList.length - 1) {
        if (!obj.bondReceivedLowerLimit || obj.bondReceivedLowerLimit < -1) {
          returnFlag = true;
        }
      } else if (
        !obj.bondReceivedLowerLimit ||
        obj.bondReceivedLowerLimit < -1 ||
        !obj.bondReceivedHigherLimit ||
        obj.bondReceivedHigherLimit < -1
      ) {
        return (returnFlag = true);
      }
      if (!obj.minimumLiquidity || obj.minimumLiquidity < -1) {
        returnFlag = true;
      }
    });
    return returnFlag;
  }

  const saveLiquidity = () => {
    let returnFlag = checkLiquidityListValidations();
    if (checkAllFieldsForZero()) {
      return;
    } else if (returnFlag) {
      setLoading(false);
      setMessage(ALLVALUEFILLED);
      setShowErrorPopup(true);
      return;
    }
    let liquidityArray = liquidityList.slice();
    liquidityArray.forEach((x, i) => {
      delete x.id;
      delete x.bondReceivedHigherLimit;
    });
    if (
      JSON.stringify(liquidityList) === JSON.stringify(CPYliquidityList) &&
      ckEditorData === CPYckEditorData
    ) {
      console.log(" not changed");
    } else {
      setLoading(true);
      liquidityService.createLiquidity(ckEditorData, liquidityList).then(
        (res) => {
          //console.log(res);
          if (res.message) {
            setSuccessAlertOptions({
              title: "",
              actionType: UPDATE,
              msg: res.message,
              callback: () => {
                getAllLiquidity();
                setShowSuccessAlert(false);
              },
            });
            setShowSuccessAlert(true);
          }
          setLoading(false);
        },
        (errors) => {
          setLoading(false);
        }
      );
    }
  };

  function bondBalanceFormatter(cell, rowIndex, row) {
    if (row)
      return (
        <div className=" align-items-center justify-content-center ">
          <div className=""></div>
          <div class="container">
            <div class="row">
              {rowIndex === 0 ? (
                <>
                  <div className="col-md-auto">
                    {liquidityList.length === 1
                      ? ANYBONDBALANCE
                      : ISNOTGREATERTHAN}
                  </div>
                  {cell.bondReceivedHigherLimit &&
                  cell.bondReceivedHigherLimit > -1 ? (
                    <div className="col-md-auto">
                      {amountFormat(cell.bondReceivedHigherLimit)}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <div class="col-md-auto  mt-1">{ISGREATERTHAN}</div>
                  <div class="col-sm-4">
                    <NumberFormat
                      className={`form-control txtbox${rowIndex}`}
                      prefix="$"
                      placeholder="$0.00"
                      fixedDecimalScale={2}
                      allowNegative={false}
                      decimalScale={2}
                      thousandSeparator={true}
                      style={{
                        height: "90%",
                        fontSize: "14px",
                        marginTop: "1px",
                        verticalAlign: "2px",
                      }}
                      value={
                        cell.bondReceivedLowerLimit > -1
                          ? cell.bondReceivedLowerLimit
                          : ""
                      }
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        if (floatValue) {
                          changeBondRecieved(floatValue, rowIndex);
                        } else {
                          changeBondRecieved(0, rowIndex);
                        }
                      }}
                      // onChange={(evt) => changeBondRecieved(evt, rowIndex)}
                      onBlur={() =>
                        cell.bondReceivedLowerLimit > -1
                          ? changeBondHigherLimit(rowIndex)
                          : () => false
                      }
                    />
                  </div>
                </>
              )}

              {rowIndex !== liquidityList.length - 1 && rowIndex !== 0 ? (
                <>
                  <div class="col-md-auto mt-1">{BUTNOTGREATERTHAN}</div>
                  {cell.bondReceivedHigherLimit &&
                  cell.bondReceivedHigherLimit > -1 ? (
                    <div
                      className="col-md-auto"
                      style={{ marginTop: "0.3rem" }}
                    >
                      {" "}
                      {amountFormat(cell.bondReceivedHigherLimit)}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <div className=""></div>
              )}
            </div>
          </div>
        </div>
      );
  }

  // OnBlur of textbox -> Above row higher limit updates
  const changeBondHigherLimit = (rowIndex) => {
    let liquidityItemList = JSON.parse(JSON.stringify(liquidityListData));
    if (checkForUpperValidation(rowIndex)) return false;
    if (rowIndex > 0) {
      liquidityItemList[rowIndex - 1].bondReceivedHigherLimit = parseFloat(
        liquidityItemList[rowIndex].bondReceivedLowerLimit
      );
      setLiquidityList(liquidityItemList);
      updateAllHigherLimit(liquidityItemList, "amountChange");
    }
    return true;
  };

  const checkForUpperValidation = (rowIndex) => {
    let liquidityItemList = JSON.parse(JSON.stringify(liquidityListData));
    if (
      rowIndex !== 0 &&
      rowIndex !== 1 &&
      liquidityItemList[rowIndex - 1].bondReceivedLowerLimit !== -1 &&
      (liquidityItemList[rowIndex].bondReceivedLowerLimit <
        liquidityItemList[rowIndex - 1].bondReceivedLowerLimit ||
        liquidityItemList[rowIndex].bondReceivedLowerLimit ===
          liquidityItemList[rowIndex - 1].bondReceivedLowerLimit)
    ) {
      setMessage(
        VALUEGREATERTHANLOWERLIMIT +
          liquidityItemList[rowIndex - 1].bondReceivedLowerLimit
      );
      setShowErrorPopup(true);
      document.getElementsByClassName(`txtbox${rowIndex}`)[0].focus();
      return true;
    } else if (
      rowIndex + 1 <= liquidityList.length - 1 &&
      liquidityItemList[rowIndex + 1].bondReceivedLowerLimit !== -1 &&
      (liquidityItemList[rowIndex].bondReceivedLowerLimit >
        liquidityItemList[rowIndex + 1].bondReceivedLowerLimit ||
        liquidityItemList[rowIndex].bondReceivedLowerLimit ===
          liquidityItemList[rowIndex + 1].bondReceivedLowerLimit)
    ) {
      setMessage(
        VALUELESSTHANLOWERLIMIT +
          liquidityItemList[rowIndex + 1].bondReceivedLowerLimit
      );
      setShowErrorPopup(true);
      document.getElementsByClassName(`txtbox${rowIndex}`)[0].focus();
      return true;
    }
    return false;
  };

  // OnChange of textbox -> value updates
  const changeBondRecieved = (floatValue, rowIndex) => {
    let liquidityItemList = JSON.parse(JSON.stringify(liquidityListData));
    liquidityItemList[rowIndex].bondReceivedLowerLimit =
      floatValue != "" ? floatValue : -1;
    setLiquidityList(liquidityItemList);
  };

  function minimumLiquidityFormatter(cell, rowIndex, row) {
    return (
      // <Input
      //   className=" form-control form-control-sm"
      //   style={{ fontSize: "14px" }}
      //   placeholder="$0.00"
      //   value={cell.minimumLiquidity > -1 ? cell.minimumLiquidity : ""}
      //   onChange={(evt) => changeMinimumLiquidity(evt, rowIndex)}
      // ></Input>
      <NumberFormat
        thousandSeparator={true}
        prefix={"$"}
        // maxLength={cell.minimumLiquidity === 0 ? 14 : 16}
        fixedDecimalScale={2}
        allowNegative={false}
        decimalScale={2}
        name="minimumLiquidity"
        id="minimumLiquidity"
        className="form-control"
        value={parseFloat(cell.minimumLiquidity?.toString().substring(0, 5))}
        placeholder="$0.00"
        onValueChange={(x, src) =>
          changeMinimumLiquidity(x.floatValue, rowIndex)
        }
        style={{
          alignText: "right",
          width: "69.5%",
          padding: "6px 12px",
          height: "34.19px",
        }}
      />
    );
  }

  const changeMinimumLiquidity = (evt, rowIndex) => {
    let liquidityItemList = JSON.parse(JSON.stringify(liquidityListData)); // To create a different array which is hard copied from liquidity list
    liquidityItemList[rowIndex].minimumLiquidity = evt;
    setLiquidityList(liquidityItemList);
  };

  function insertButton(cell, rowIndex, row) {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => {
            if (changeBondHigherLimit(rowIndex) !== false)
              insertRow(cell, rowIndex, row);
          }}
          className="addbtn btn  btn-primary"
          style={{ padding: "5px 10px", width: "70%", border: "none" }}
        >
          {INSERT}
        </Button>
      </div>
    );
  }

  function deleteButton(cell, rowIndex, row) {
    return (
      <>
        <div style={{ textAlign: "center" }}>
          {rowIndex !== 0 ? (
            <Button
              onClick={() => {
                deleteRow(cell, row, rowIndex);
              }}
              className="btn deletebtn "
              style={{
                padding: "5px 10px",
                width: "70%",
                fontSize: "14px",
                border: "1px solid lightgray",
                color: "#000",
              }}
            >
              {DELETE}
            </Button>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }

  const checkAllFieldsForZero = () => {
    let liquidityItemList = [...liquidityListData];
    let flag = false;
    liquidityItemList.forEach((x, i) => {
      if (
        x.minimumLiquidity == 0 ||
        (i != "0" && x.bondReceivedLowerLimit == 0)
      ) {
        if (i === liquidityItemList.length - 1) {
          setMessage(
            VALUELESSTHANLOWERLIMIT +
              liquidityItemList[i - 1].bondReceivedLowerLimit
          ); //Value must be greater than $0
        } else {
          setMessage(
            VALUELESSTHANLOWERLIMIT +
              liquidityItemList[i + 1].bondReceivedLowerLimit
          );
        }
        setShowErrorPopup(true);
        flag = true;
      }
    });
    return flag;
  };

  const insertRow = (cell, rowIndex, row) => {
    if (checkAllFieldsForZero()) {
      return;
    }

    // if (
    //   cell.minimumLiquidity == 0 ||
    //   (rowIndex !== '0' && cell.bondReceivedLowerLimit == 0)
    // ) {
    //   setMessage(VALUEGREATERTHANZERO);
    //   setShowErrorPopup(true);
    //   return;
    // }
    let liquidityItemList = [...liquidityList];
    liquidityItemList.splice(rowIndex + 1, 0, {
      bondReceivedLowerLimit: -1,
      minimumLiquidity: "",
    });
    updateAllHigherLimit(liquidityItemList, "Insert");
    // setLiquidityList(liquidityItemList);
  };

  const deleteConfirmation = (isConfimationVisible, success) => {
    setShowDeleteConfirmationModal(isConfimationVisible);
    if (success) {
      let liquidityItemList = [...liquidityList];
      liquidityItemList.splice(indexForDelete, 1);
      setSuccessAlertOptions({
        title: "",
        actionType: DELETE,
        msg: "Record Deleted Successfully",
        callback: (value) => {
          setShowSuccessAlert(false);
        },
      });
      setShowSuccessAlert(true);
      // setLiquidityList(liquidityItemList);
      updateAllHigherLimit(liquidityItemList, "Delete");
    }
  };

  const deleteRow = (cell, row, rowIndex) => {
    let obj = {
      ...cell,
      header: LIQUIDITY,
      message: LIQUIDITY,
    };
    setShowDeleteConfirmationModal(true);
    setIndexForDelete(rowIndex);
    setDeleteConfirmationModalData(obj);
  };

  const columns = React.useMemo(() => [
    {
      Header: REFUNDABLEDEPOSITBOND,
      Filter: false,
      disableSortBy: true,
      accessor: bondBalanceFormatter,
      width: "50%",
    },
    {
      Header: MINIMUMLIQUIDITYREQUIRED,
      Filter: false,
      disableSortBy: true,
      accessor: minimumLiquidityFormatter,
      width: "20%",
    },
    {
      Header: INSERT,
      Filter: false,
      disableSortBy: true,
      accessor: insertButton,
      width: "13%",
    },
    {
      Header: DELETE,
      Filter: false,
      disableSortBy: true,
      accessor: deleteButton,
      width: "15%",
    },
  ]);
  const liquidityListData = React.useMemo(() => liquidityList);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title={LIQUIDITY}>
          <ModalValidation
            showErrorPopup={showErrorPopup}
            handleErrorClose={handleErrorClose}
            errorMessage={message}
          ></ModalValidation>
          <DeleteConfirmationModelAlert
            ShowDeleteModal={showDeleteConfirmationModal}
            Data={deleteConfirmationModalData}
            deleteConfirmationCallBack={deleteConfirmation}
          ></DeleteConfirmationModelAlert>
          {showSuccessAlert && (
            <SuccessAlert
              type={successAlertOptions.actionType}
              msg={successAlertOptions.msg}
              title={successAlertOptions.title}
              callback={successAlertOptions.callback}
            ></SuccessAlert>
          )}

          {IsUpdated ? (
            <DirtyWarningAlert
              isBlocking={IsUpdated}
              sourceName={"Liquidity"}
              messageBody={
                "Are you sure you want to exit to the Liquidity and discard these changes?"
              }
            />
          ) : null}

          <div>
            <div className="head mt-3">
              <img src={Icon} className="icon" alt="#" />
              {LIQUIDITY}
              <Button
                className="addbtn btn btn-primary  btnright justify-content-end "
                // style={{ width: "10%" }}
                onClick={saveLiquidity}
              >
                Save
              </Button>
            </div>

            <div className="headone mt-4">{LIQUIDITYHEADINGMESSAGE}</div>

            {/* <CKEditor data="<p>Hello from CKEditor 4!</p>" /> */}

            <CKEditor
              config={editorConfiguration}
              id="firstEditor"
              initData={localStorage.getItem("ckEditorData", ckEditorData)}
              data={ckEditorData}
              onChange={(e) => {
                handleEditorChange(e);
              }}
            />
            {/* <CKEditor
              config={editorConfiguration}
              id="firstEditor"
              initData={ckEditorData}
              data={ckEditorData}
              onChange={(e) => {
                handleEditorChange(e);
              }}
            /> */}
            <div className="headone mt-4">{MINIMUMLIQUIDITYLEVEL}</div>

            <ReactTable
              columns={columns}
              showSecondHead={false}
              data={liquidityListData}
              showFilterHeader={false}
            />
          </div>
        </Page>
      )}
    </>
  );
};

export default ViewLiquidity;
