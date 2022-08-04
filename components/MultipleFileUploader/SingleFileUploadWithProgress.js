import { Grid, LinearProgress, styled } from "@material-ui/core";
import React from "react";
import { FileHeader } from "./FileHeader";
//import { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  // [`&.${linearProgressClasses.colorPrimary}`]: {
  //   backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  // },
  // [`& .${linearProgressClasses.bar}`]: {
  //   borderRadius: 5,
  //   backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  // },
}));

export function SingleFileUploadWithProgress({
  file,
  onDelete,
  onUpload,
  handleFileClick,
}) {
  // const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   async function upload() {
  //     const url = await uploadFile(file, setProgress);
  //     onUpload(file, url);
  //   }

  //   upload();
  // }, []);

  return (
    <Grid item>
      <FileHeader
        file={file}
        onDelete={onDelete}
        style={{ margin: "10px" }}
        onUpload={onUpload}
        handleFileClick={handleFileClick}
      />
      {/* {progress < 100?<BorderLinearProgress variant="determinate" value={progress} style={{margin:'10px'}}/>:""} */}

      {/* <LinearProgress variant="determinate" value={progress} /> */}
    </Grid>
  );
}

function uploadFile(file, onProgress) {
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
      }
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", key);

    xhr.send(formData);
  });
}
