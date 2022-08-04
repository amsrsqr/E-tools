import React, { useRef, useState, useEffect } from "react";
import { Button } from "reactstrap";
import { isEmpty } from "lodash";
import WarningMessageModelAlert from "../WarningMessageModelAlert";
import ErrorMessageModelAlert from "../ErrorMessageModelAlert";

const FileUploader = (props) => {
  const hiddenFileInput = React.useRef(null);
  console.log("props", props);
  const [fileName, setFileName] = useState("No file chosen");
  const [href, setHref] = useState("");
  const [download, setDownload] = useState("");
  const [isvalid, setValid] = useState("");
  const [showWarningAlert, setShowWarningAlert] = useState(false);

  useEffect(() => {
    setFileName(props.fileObj.fileName);

    if ((props.fileObj && props.fileObj.templateID) || props.hrefUrl) {
      if (props.acceptImage) {
        setDownload(props.fileObj.FileName);
        setFileName(props.fileObj.FileName);
      } else {
        setDownload(props.fileObj.FileName + ".doc");
        setFileName(props.fileObj.FileName + ".doc");
      }
      if (props.hrefUrl) setHref(props.hrefUrl);
    } else {
      setHref("");
      setDownload("");
      setFileName("No file chosen");
      if (hiddenFileInput.current) {
        hiddenFileInput.current.value = null;
      }
    }
  }, [props.hrefUrl]);

  useEffect(() => {
    setFileName(props.fileObj.fileName);
    if (props.fileObj) {
      if (props.fileObj.fileName === undefined) {
        setFileName("No file chosen");
      }
    } else {
      setHref("");
      setDownload("");
      setFileName("No file chosen");
      if (hiddenFileInput.current) {
        hiddenFileInput.current.value = null;
      }
    }
  }, [props.fileObj]);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    let validUpload = true;
    let extension = fileUploaded.name ? fileUploaded.name?.split(".")[1] : "";
    if (!props.acceptImage) {
      // let extension = (fileUploaded.name)?fileUploaded.name.split('.')[1]:""
      if (
        extension != null &&
        extension != undefined &&
        extension.toLowerCase() != "docx" &&
        extension.toLowerCase() != "doc"
      ) {
        //alert("Only valid extensions are allowed (.doc, .docx)");
        setShowWarningAlert(true);
      }
    } else {
      //let extension = (fileUploaded.name)?fileUploaded.name.split('.')[1]:""
      if (
        extension != null &&
        extension != undefined &&
        extension.toLowerCase() != "docx" &&
        extension.toLowerCase() != "doc" &&
        extension.toLowerCase() != "pdf" &&
        extension.toLowerCase() != "png" &&
        extension.toLowerCase() != "jpeg" &&
        extension.toLowerCase() != "jpg"
      ) {
        //alert("Only valid extensions are allowed (.doc, .docx)");
        setShowWarningAlert(true);
      }
    }

    if (fileUploaded && !isEmpty(fileUploaded)) {
      let sizeInBytes = fileUploaded.size;
      var sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

      if (props.maxSize && parseInt(props.maxSize) > 0) {
        if (sizeInMB > parseInt(props.maxSize)) {
          validUpload = false;
          props.handleTemplateFile("File size exceed");
        }
      }
    }

    if (validUpload) {
      let href = URL.createObjectURL(fileUploaded);
      let downloadName = fileUploaded.name;
      let extension = fileUploaded.name ? fileUploaded.name.split(".")[1] : "";

      if (!props.acceptImage) {
        if (
          extension != null &&
          extension != undefined &&
          extension.toLowerCase() != "docx" &&
          extension.toLowerCase() != "doc"
        ) {
          // alert("Only valid extensions are allowed (.doc, .docx)")
          //props.handleTemplateFile("Only valid extensions are allowed (.doc, .docx)")
        } else {
          setHref(href);
          setDownload(downloadName);
          setFileName(fileUploaded.name);
          props.handleTemplateFile(fileUploaded);
          if (props.setErrorMessage) props.setErrorMessage("");
        }
      } else {
        if (
          extension != null &&
          extension != undefined &&
          extension.toLowerCase() != "docx" &&
          extension.toLowerCase() != "doc" &&
          extension.toLowerCase() != "pdf" &&
          extension.toLowerCase() != "png" &&
          extension.toLowerCase() != "jpeg" &&
          extension.toLowerCase() != "jpg"
        ) {
        } else {
          setHref(href);
          setDownload(downloadName);
          setFileName(fileUploaded.name);
          props.handleTemplateFile(fileUploaded);
          if (props.setErrorMessage) props.setErrorMessage("");
        }
      }
    }
  };
  return (
    <>
      <div
        className="row m-1"
        style={{
          border: props.className == "" ? "1px solid #ced4da" : "1px solid red",
          borderRadius: "5px",
          width: "100% !important",
        }}
      >
        <div className="col-sm-2">
          <Button
            className="bg-light  text-dark"
            style={{
              border: props.className == "" ? "" : "1px solid red",
              fontSize: "12px",
              width: "max-content",
              marginLeft: "-13px",
              display: "flex",
            }}
            onClick={handleClick}
          >
            Choose File
          </Button>
        </div>
        {fileName === "No file chosen" ? (
          <div
            className="col-sm-9 mt-2 text-start"
            style={{ position: "absolute", marginLeft: "100px" }}
          >
            {fileName && fileName.length > 30
              ? fileName.substring(0, 30)
              : fileName}
          </div>
        ) : (
          <div
            className="col-sm-9 mt-2 pl-1 fileTxt"
            style={{
              fontSize: "14px",
              color: "#1924c3",
              cursor: "pointer",
              textAlign: "left",
              position: "absolute",
              marginLeft: "100px",
            }}
          >
            {props.fileObj && props.fileObj.templateID ? (
              <div>
                {fileName && fileName.length > 15
                  ? fileName.split("_")[0].substring(0, 15) + "..."
                  : fileName}
              </div>
            ) : (
              <div>
                {fileName && fileName.length > 15
                  ? fileName.split("_")[0].substring(0, 15) + "..."
                  : fileName}
              </div>
            )}
          </div>
        )}
      </div>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        accept={
          props.acceptImage
            ? "application/msword,.docx,.pdf,.jpg,.bmp,.png"
            : "application/msword,.docx"
        }
        style={{ display: "none" }}
        isvalid={isvalid}
        className={props.className}
      />
      {showWarningAlert && (
        <ErrorMessageModelAlert
          msg={
            props.acceptImage
              ? "Wrong file type. Please try again."
              : "You can upload only Word document. Please try again."
          }
          warningType="error"
          showWarningAlert={showWarningAlert}
          setShowWarningAlert={setShowWarningAlert}
        />
      )}
    </>
  );
};
export default FileUploader;
