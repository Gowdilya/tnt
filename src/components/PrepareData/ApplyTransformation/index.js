import React, { useEffect, useState, userReducer, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import MlSrv from "./../../../services/ml_srv";
import Button from "@material-ui/core/Button";
import ProgressBar from "./ProgressBar/index";
import ErrorMessage from "../../Shared/components/ErrorMessage";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import "./applyTransformation.scss";

export default function ApplyTransformation(props) {
  const [bulkId, setBulkId] = useState(null);
  const [progress, setProgress] = React.useState(0);
  const [folders, setFolders] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [totalFile, setTotalFile] = React.useState(0);
  const [error, setError] = useState({ isError: false, message: "" });
  const cancel = useRef(false);

  const mlSrv = new MlSrv(props.auth);
  const transformationSet = useSelector(
    (state) => state.prepareData.transformationSet
  );

  //console.log(transformationSet);
  useEffect(() => {
    //called only once
    loadAllFiles();
  }, []);

  const loadAllFiles = () => {
    mlSrv
      .getAllFiles()
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          if (result) {
            let fileSet = result;

            let folders = [
              ...new Set(
                fileSet
                  ? fileSet.map((file) => {
                      if (file.filename && file.filename.indexOf("/", 0)) {
                        return file.filename.substr(
                          0,
                          file.filename.indexOf("/", 1) - 0
                        );
                      } else {
                        return null;
                      }
                    })
                  : null
              ),
            ];

            setFolders(folders);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error(error);
          // this.setState({
          //     error:error,
          //     selectedFile:null
          // });
        }
      )
      .catch(function (reason) {
        // this context is not passed into the function
        console.log(reason);
        // this.setState({
        //     error:reason,
        //     selectedFile:null
        // });
      });
  };

  useEffect(() => {
    //called only once once bulkId is retrieved

    if (bulkId) {
      //why is files total 0?
      getStatus();
    }
  }, [bulkId]);

  const resetPage = () => {
    props.callback();
  };
  const cancelBulk = () => {
    //setCancel(true);
    //we used reference instead of state since state isn't updated inside settime out
    cancel.current = true;
  };

  const bulkTransform = () => {
    mlSrv
      .createBulkTransformation(transformationSet.id, selectedFolder)
      .then((res) => {
        if (res) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        setTotalFile(result.filesTotal);
        setProgress(result.filesTransformed);
        setBulkId(result.id);
      })
      .catch((error) => {
        console.log("error", error);
        setError({ isError: true, message: "Failed to Bulk Transform files." });
      });
  };

  const getStatus = () => {
    mlSrv
      .getBulkTransformationStatus(transformationSet.id, bulkId)
      .then((res) => {
        if (res) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        setTotalFile(result.filesTotal);
        setProgress(result.filesTransformed);

        if (
          result.filesTotal > result.filesTransformed &&
          result.status != "Error"
        ) {
          const timer = setTimeout(() => {
            if (cancel.current) {
              setError({
                isError: true,
                message: "Canceled",
              });
              return stop;
            }
            getStatus();
          }, 10000);

          function stop() {
            if (timer) {
              clearTimeout(timer);
              timer = 0;
            }
          }
        }
        if (result.status == "Error") {
          setError({
            isError: true,
            message: "Bulk Upload Failed: " + result.status,
          });
        }
      })
      .catch((error) => {
        setError({ isError: true, message: "Failed to Get Status" });
        console.log("error", error);
      });
  };

  const handleDropDownChange = (event) => {
    setSelectedFolder(event.target.value);
  };

  const handleBulkUpload = () => {
    bulkTransform();
  };
  return (
    <div className="applyTransformation">
      {folders ? (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedFolder}
          onChange={handleDropDownChange}
        >
          {folders.map((folder) => {
            return (
              <MenuItem key={folder} value={folder}>
                {folder}
              </MenuItem>
            );
          })}
        </Select>
      ) : null}
      {selectedFolder ? (
        <Button onClick={handleBulkUpload} variant="contained" color="primary">
          {" "}
          BULK UPLOAD
        </Button>
      ) : (
        <Button disabled> BULK UPLOAD</Button>
      )}

      {selectedFolder && totalFile ? (
        <>
          {progress < totalFile ? (
            <div>Bulk Transforming the Files please wait...</div>
          ) : null}
          <ProgressBar progress={progress ? progress : 0} total={totalFile} />
        </>
      ) : null}

      <ErrorMessage show={error.isError} errorMessage={error.message} />

      <>
        {selectedFolder && progress === totalFile ? (
          <div>Bulk Transformation Complete!</div>
        ) : null}
        <div className="bottom-button-row">
          {(totalFile && progress >= totalFile) || error.isError ? (
            <Button onClick={resetPage} variant="contained">
              {" "}
              RESET
            </Button>
          ) : (
            <Button onClick={cancelBulk} variant="contained">
              {" "}
              Cancel
            </Button>
          )}{" "}
        </div>
      </>
    </div>
  );
}
