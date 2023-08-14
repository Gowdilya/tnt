import React, { useEffect, useState, useRef } from "react";
import DataViewer from "./DataViewer";
import Button from "@material-ui/core/Button";
import MLSrv from "../../../services/ml_srv";
import { useSelector, useDispatch } from "react-redux";
import {
  updateFileData,
  updateCoordinates,
  updateCSVParsed,
} from "../reducers/prepareDataSlice";
import FileViewer from "./FilesViewer";
import { parseCSVData, loadFileData } from "../utility";
// It's not clear to me how to trigger updates to the UI
const useForceUpdate = () => useState()[1];

export default function TimeSeries(props) {
  const dispatch = useDispatch();
  const mlSrv = new MLSrv(props.auth);
  const file = useSelector((state) => state.prepareData.data);
  const csvParsed = useSelector((state) => state.prepareData.csvParsed);

  useEffect(() => {
    if (file) {
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function () {
        //csv content

        processData(reader.result);
      };

      reader.onerror = function () {
        console.log(reader.error);
      };
    }
  }, [file]);

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

  return (
    <div>
      <div>
        {csvParsed ? (
          <DataViewer
            data={csvParsed}
            handleExtractData={props.handleExtractData}
            handleNextButton={props.handleNextButton}
            handleBackButton={props.handleBackButton}
          ></DataViewer>
        ) : (
          <div className="bottom-button-row">
            <Button onClick={props.handleBackButton} variant="contained">
              {" "}
              Back{" "}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
