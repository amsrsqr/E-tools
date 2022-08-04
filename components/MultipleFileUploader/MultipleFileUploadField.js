import { Grid, makeStyles } from "@material-ui/core";
import { useField } from "formik";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SingleFileUploadWithProgress } from "./SingleFileUploadWithProgress";
import { UploadError } from "./UploadError";
import "../../css/drop-file-input.css";
import uploadImg from "../../assets/Images/MultipleFileUploder_Images/cloud-upload-regular-240.png";
import uploadImgGray from "../../assets/Images/MultipleFileUploder_Images/cloudgray1.png";

let currentId = 0;

function getNewId() {
  // we could use a fancier solution instead of a sequential ID :)
  return ++currentId;
}

const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: `2px dotted #eeeeee`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // background: theme.palette.background.default,
    height: "130px",
    outline: "none",
    margin: "8px",
  },
}));

export function MultipleFileUploadField({
  selectedFile,
  name,
  fileCallBack,
  handleDelete,
  handleClickFile,
  isNotMultiple,
  isDisabled,
}) {
  const [_, __, helpers] = useField(name);
  const classes = useStyles();

  const [files, setFiles] = useState([]);

  const onDrop = (choosedFile) => {
    const mappedAcc = choosedFile.map((file) => ({
      file,
      errors: [],
      id: getNewId(),
    }));
    // const mappedRej = rejFiles.map((r) => ({ ...r, id: getNewId() }));
    setFiles((curr) => [...curr, ...mappedAcc]);
    fileCallBack([...mappedAcc, ...files], mappedAcc);
  };

  useEffect(() => {
    console.log("selectedFile in multifile", selectedFile);
    if (selectedFile) {
      setFiles([...selectedFile]);
    }
  }, [selectedFile]);

  function onUpload(file, url) {
    setFiles((curr) =>
      curr.map((fw) => {
        if (fw.file === file) {
          return { ...fw, url };
        }
        return fw;
      })
    );

    fileCallBack(files);
    // console.log("hiii", files);
  }
  function onDelete(file, progress) {
    // console.log("all files in delete", files);

    const tmpFiles = [...files];

    var fileIndx = tmpFiles.findIndex(
      (singleFile) => singleFile.id === file.id
    );

    if (fileIndx >= 0) {
      // console.log("index ", fileIndx);
      handleDelete(files[fileIndx], progress);
    }
  }
  const handleFileClick = (clickedFile) => {
    // console.log("clicked file", clickedFile);
    if (handleClickFile) handleClickFile(clickedFile);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: isNotMultiple ? false : true,
    disabled: (isNotMultiple && files.length >= 1) || isDisabled ? true : false,
    accept: ["image/*", ".doc", ".docx", ".pdf", ".txt"],
    maxSize: 30000000 * 1024, // 300KB
  });
  //onDrop: (event) => event.preventDefault(),
  return (
    <React.Fragment>
      <Grid item>
        <div {...getRootProps({ className: classes.dropzone })}>
          <input {...getInputProps()} />
          <div className="drop-file-input__label">
            {/* <img src={uploadImg} alt="" /> */}
            {isNotMultiple && files.length >= 1 ? (
              <img src={uploadImgGray} alt="" style={{ cursor: "no-drop" }} />
            ) : (
              <img src={uploadImg} alt="" />
            )}

            {isNotMultiple && files.length >= 1 ? (
              <p style={{ cursor: "no-drop", fontWeight: "600" }}>
                Drag and drop your CSV files here, or{" "}
                <span
                  style={{
                    color: "gray",
                    cursor: "no-drop",
                  }}
                >
                  press here
                </span>{" "}
                to upload from your desktop.
              </p>
            ) : (
              <p style={{ fontWeight: "600" }}>
                Drag and drop your CSV files here, or{" "}
                <span style={{ color: "blue", fontWeight: "600" }}>
                  press here
                </span>{" "}
                to upload from your desktop.
              </p>
            )}
          </div>
        </div>
      </Grid>
      {files && files.length > 0 ? (
        <Grid
          style={{ overflowY: "scroll", height: "auto", cursor: "pointer" }}
        >
          {files.map((fileWrapper) => (
            <Grid item key={fileWrapper.id}>
              {fileWrapper.errors.length ? (
                <UploadError
                  handleFileClick={handleFileClick}
                  file={fileWrapper.file}
                  errors={fileWrapper.errors}
                  onDelete={(fl, progres) => onDelete(fileWrapper, progres)}
                />
              ) : (
                <SingleFileUploadWithProgress
                  handleFileClick={handleFileClick}
                  onDelete={(fl, progres) => onDelete(fileWrapper, progres)}
                  onUpload={onUpload}
                  file={fileWrapper.file}
                />
              )}
            </Grid>
          ))}
        </Grid>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
