import React, { useEffect, useState, useRef } from "react";
import MLSrv from "../../../../services/ml_srv";
import { updateSelectedFile } from "../../reducers/prepareDataSlice";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";
import DescriptionIcon from "@material-ui/icons/Description";
import Button from "@material-ui/core/Button";
import "./fileViewer.scss";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Refresh";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

export default function FileViewer(props) {
  const [files, setFiles] = useState(null);
  const [currentFolderPath, setCurrentFolderPath] = useState("");
  const selectedFile = useSelector((state) => state.prepareData.selectedFile);
  const dispatch = useDispatch();

  const mlSrv = new MLSrv(props.auth);

  useEffect(() => {
    //called only once
    loadAllFiles();
  }, []);

  useEffect(() => {
    if (props.reloadFileViewer) {
      loadAllFiles();
      props.fileViewerLoaded();
    }
  }, [props.reloadFileViewer]);

  const handleFolderSelect = (folder) => {
    //root concat
    setCurrentFolderPath(currentFolderPath + folder + "/");
  };
  const handleBackFolder = () => {
    var strippedPath = RemoveLastDirectoryPartOf(currentFolderPath);
    if (strippedPath.length > 0) {
      setCurrentFolderPath(strippedPath + "/");
    } else {
      setCurrentFolderPath("");
    }
  };
  const RemoveLastDirectoryPartOf = (the_url) => {
    var the_arr = the_url.slice(0, -1).split("/");
    the_arr.pop();
    return the_arr.join("/");
  };

  const loadAllFiles = () => {
    mlSrv
      .getAllFiles()
      .then((res) => {
        return res.json();
      })
      .then(
        (result) => {
          if (result) {
            setFiles(result);
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
  const handleDeleteFile = () => {
    deleteFile(selectedFile);
  };

  const deleteFile = (file) => {
    mlSrv
      .deleteFile(file.id)
      .then((res) => {
        loadAllFiles();
      })
      .catch(function (reason) {
        // this context is not passed into the function
        console.log(reason);
        // this.setState({
        //     error:reason,
        //     selectedFile:null
        // });
      });
  };

  const handleDropDownChange = (event) => {
    props.setSelectFolder(event.target.value);
  };

  const selectFile = (file) => {
    dispatch(updateSelectedFile(file));

    // var localUrl = file.url.href.replace(
    //     "host.docker.internal",
    //     "localhost"
    // );
    //var prodUrl = file.url.href;

    fetch(file.url.href)
      .then((res) => res.blob())
      .then(
        (blob) => {
          // get text from blob
          blob.text().then((text) => props.handleSelectCSVData(text));
          dispatch(updateSelectedFile(file));
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
  const displayFile = (file) => {
    return (
      <div
        className={
          selectedFile && selectedFile.id === file.id ? "file-selected" : ""
        }
        key={file.id}
      >
        <IconButton onClick={() => selectFile(file)}>
          <DescriptionIcon />
        </IconButton>
        {currentFolderPath
          ? file.filename.substr(currentFolderPath.length)
          : file.filename}
        {/* <button onClick={() => deleteFile(file)} >DELETE</button> */}
      </div>
    );
  };

  const getFolders = (fileSet) => {
    var rootPathLength = currentFolderPath ? currentFolderPath.length : 0;
    //Filter FileSet based on root
    fileSet =
      currentFolderPath && fileSet
        ? fileSet.filter((file) => {
            return file.filename.startsWith(currentFolderPath);
          })
        : fileSet;
    let folders = [
      ...new Set(
        fileSet
          ? fileSet.map((file) => {
              if (file.filename && file.filename.indexOf("/", rootPathLength)) {
                return file.filename.substr(
                  0 + rootPathLength,
                  file.filename.indexOf("/", rootPathLength + 1) -
                    rootPathLength
                );
              } else {
                return null;
              }
            })
          : null
      ),
    ];

    return (
      <div className="window">
        {folders
          ? folders.map((folder, i) => {
              if (folder && folder.length > 0) {
                return (
                  <div key={i}>
                    <IconButton onClick={() => handleFolderSelect(folder)}>
                      <FolderIcon fontSize="large" />
                    </IconButton>
                    {folder}
                  </div>
                );
              }
            })
          : null}
        <div>
          {fileSet
            ? fileSet.map((file) => {
                return !file.filename.substr(rootPathLength).includes("/")
                  ? displayFile(file)
                  : null;
              })
            : null}
        </div>

        {folders ? (
          <div className="selection-container">
            <InputLabel id="demo-simple-select-label">
              Folder Selection
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={props.selectFolder}
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
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="fileViewer">
      {files ? getFolders(files) : null}
      <div>
        {selectedFile ? (
          <div>Selected File: {selectedFile.filename}</div>
        ) : null}
      </div>
      {currentFolderPath.length > 0 ? (
        <Button variant="contained" onClick={handleBackFolder}>
          Back
        </Button>
      ) : (
        <Button variant="contained" disabled>
          Back
        </Button>
      )}
      <div className="upload-destination">
        File Upload Destination:
        {props.selectFolder ? props.selectFolder : "---"}
      </div>

      {selectedFile ? (
        <Button
          variant="contained"
          className="delete-button"
          onClick={handleDeleteFile}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      ) : (
        <Button
          startIcon={<DeleteIcon />}
          variant="contained"
          className="delete-button-disabled"
          disabled
        >
          Delete
        </Button>
      )}
      {/* <Button
        startIcon={<RefreshIcon />}
        className="reload-button"
        variant="contained"
        onClick={loadAllFiles}
      >
        Refresh
      </Button> */}
    </div>
  );
}
