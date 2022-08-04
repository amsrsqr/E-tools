import { Button, Grid, LinearProgress, styled } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ImageConfig } from "../../config/ImageConfig";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

export function FileHeader({ file, onDelete, onUpload, handleFileClick }) {
  const [progress, setProgress] = useState(0);
  const [totalfilesize, setTotalfilesize] = useState(formatBytes(file.size, 2));
  const [completed, setCompleted] = useState(formatBytes(file.size, 2));
  const [uploadedDate, setUploadedDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    MuiLinearProgressbarColorPrimary: "#308fe8",
    // [`&.${linearProgressClasses.colorPrimary}`]: {
    //   backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    // },
    // [`& .${linearProgressClasses.bar}`]: {
    //   borderRadius: 5,
    //   backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    // },
  }));
  useEffect(() => {
    async function upload() {
      const url = await uploadFile(file, setProgress, setCompleted);
      //onUpload(file, url);
    }

    upload();
  }, []);

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  function formatBytesInPercentage(decimals = 2, Percentage, TotalSize) {
    var bytes = (Percentage / 100) * TotalSize;
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <Grid>
      <div className="drop-file-preview">
        <div className="drop-file-preview__item">
          <img
            src={ImageConfig[file.type.split("/")[1]] || ImageConfig["default"]}
            alt=""
          />
          <div
            className="drop-file-preview__item__info"
            style={{ width: "100%" }}
          >
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 50%" }}>
                <p
                  style={{ color: "blue", cursor: file.id ? "pointer" : "" }}
                  onClick={() => {
                    if (file.id) handleFileClick(file);
                  }}
                >
                  {file.name}
                </p>
              </div>
              <div style={{ flex: "1 1 -11%", float: "left" }}>
                <p>Uploaded {uploadedDate} </p>
              </div>
              <div style={{ flex: 1, float: "left" }}>
                <span
                  className="drop-file-preview__item__del"
                  onClick={() => {
                    // console.log("on delete", file);
                    onDelete(file, progress);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </div>
            </div>
            {progress < 100 ? (
              <BorderLinearProgress
                variant="determinate"
                value={progress}
                style={{ marginRight: "15px" }}
              />
            ) : (
              ""
            )}

            {progress < 100 ? (
              <div style={{ display: "flex" }}>
                <div style={{ flex: "1 1 55%" }}>
                  <p>
                    {completed} of {totalfilesize}
                  </p>{" "}
                </div>
                <div style={{ flex: 1, float: "left" }}>
                  <p>{progress}% Uploaded</p>{" "}
                </div>
              </div>
            ) : null}

            {/* {progress < 100?<BorderLinearProgress variant="determinate" value={progress} style={{margin:'10px'}}/>:""} */}
            {/* <p>{file.size}B</p> */}
          </div>
        </div>
      </div>
    </Grid>
  );

  function uploadFile(file, onProgress, onComplete) {
    const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
    const key = "docs_upload_example_us_preset";

    return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        res(resp.secure_url);
      };
      xhr.onerror = (evt) => rej(evt);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = (event.loaded / event.total) * 100;
          onProgress(Math.round(percentage));
          onComplete(
            formatBytesInPercentage(2, Math.round(percentage), file.size)
          );
          //setCompleted(formatBytesInPercentage(2,Math.round(percentage),totalfilesize));
        }
      };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", key);

      xhr.send(formData);
    });
  }
}
