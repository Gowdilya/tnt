import React, { useEffect, useState, userReducer, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { parseCSVData, loadFileData } from "../utility";
import MLSrv from "../../../services/ml_srv";
import FileViewer from "./FilesViewer";
import {
  updateFileData,
  updateCoordinates,
  updateCSVParsed,
} from "../reducers/prepareDataSlice";
import Button from "@material-ui/core/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./fileSelector.scss";
import PublishIcon from "@material-ui/icons/Publish";
import TextField from "@material-ui/core/TextField";
import { CR } from "../../Shared/constants/KeyCodes";

export default function FileSelector(props) {
  const dispatch = useDispatch();
  const mlSrv = new MLSrv(props.auth);

  //const file = useSelector((state) => state.prepareData.data)
  //const csvParsed = useSelector((state) => state.prepareData.csvParsed);
  const [filesToUpload, setFilesToUpload] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [folderNamingText, setFolderNamingText] = useState("");
  const [reloadFileViewer, setReloadFileViewer] = useState(false);

  const onFileChange = (event) => {
    setFilesToUpload(event.target.files);
  };

  const processData = (text) => {
    var csvJSON = parseCSVData(text);
    dispatch(
      updateCoordinates({
        rowIndexes: [0, csvJSON.lines.length - 1],
        colIndexes: [1, 1],
      })
    );
    dispatch(updateCSVParsed(csvJSON));
  };

  const uploadFilesToRepo = () => {
    Array.from(filesToUpload).forEach((file) => {
      uploadSingleFileToRepo(file);
    });

    setFilesToUpload(null);
  };
  const uploadSingleFileToRepo = (fileToUpload) => {
    mlSrv
      .addFile(fileToUpload, folderName)
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          if (result) {
            handleReloadFileViewer();
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error(error);
        }
      )
      .catch(function (reason) {
        // this context is not passed into the function
        console.log(reason);
      });
  };

  const handleReloadFileViewer = () => {
    setReloadFileViewer(true);
  };

  const handleFileViewerLoaded = () => {
    setReloadFileViewer(false);
  };

  const handleSetSelectFolder = (folder) => {
    console.log(folder);
    setFolderName(folder);
  };

  const handleFolderNameChange = (event) => {
    setFolderNamingText(event.target.value);
  };

  const keyPressFolderNaming = (event) => {
    if (event.key === CR) {
      setFolderName(event.target.value);
    }
  };

  return (
    <div className="fileSelector">
      <Container>
        <Row>
          <Col>
            Select a file from the Repository to transform, then click Next
          </Col>
        </Row>
        <FileViewer
          auth={props.auth}
          handleSelectCSVData={processData}
          reloadFileViewer={reloadFileViewer}
          fileViewerLoaded={handleFileViewerLoaded}
          setSelectFolder={handleSetSelectFolder}
          selectFolder={folderName}
        ></FileViewer>

        <Row>
          <Col className="select-text">
            Select files to Upload to the Repository Above:
          </Col>
        </Row>

        <Row>
          <Col>
            <input type="file" accept=".csv" onChange={onFileChange} multiple />
            {filesToUpload ? (
              <>
                <div className="upload-button">
                  {folderName.length > 0 ? (
                    <Button
                      startIcon={<PublishIcon />}
                      onClick={() => uploadFilesToRepo()}
                      color="primary"
                      variant="contained"
                    >
                      Upload Files
                    </Button>
                  ) : (
                    <Button
                      startIcon={<PublishIcon />}
                      disabled
                      variant="contained"
                    >
                      Upload Files
                    </Button>
                  )}
                </div>
                <div>
                  {" "}
                  Enter a new folder name, or select from the Folder Section in
                  the File Viewer Above.
                </div>
                <TextField
                  className="new-folder"
                  id="outlined-search"
                  label={"New Destination"}
                  type="search"
                  margin="normal"
                  variant="outlined"
                  value={folderNamingText}
                  onKeyDown={keyPressFolderNaming} //Submit value once Enter is pressed
                  onChange={(e) => handleFolderNameChange(e)}
                />
              </>
            ) : null}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
