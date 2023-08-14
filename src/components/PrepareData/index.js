import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TimelineIcon from "@material-ui/icons/Timeline";
import TableChartIcon from "@material-ui/icons/TableChart";
import TimeSeries from "./TimeSeries";
import { useSelector, useDispatch } from "react-redux";
import MLSrv from "./../../services/ml_srv";
import ApplyTransformation from "./ApplyTransformation";
import DefineTransformation from "./DefineTransformation/index";
import { parseCSVData } from "./utility";
import "./prepareData.scss";
import {
  updatePreview,
  updateTransformationSet,
  reset,
} from "./reducers/prepareDataSlice";
import { pushTransformation } from "./reducers/prepareDataSlice";
import FileSelector from "./FileSelector";

function getSteps() {
  return [
    "Select Source Type",
    "File Selection",
    "Define Extraction",
    "Define Transformation",
    "Apply Transformation",
  ];
}
const steps = getSteps();

export default function PrepareData(props) {
  const dispatch = useDispatch();
  const mlSrv = new MLSrv(props.auth);
  const coordinates = useSelector((state) => state.prepareData.coordinates);
  const selectedFile = useSelector((state) => state.prepareData.selectedFile);
  const [activeStep, setStep] = useState(0);
  const [path, setPath] = useState(null);
  const [selectedPoints, setSelectedPoints] = useState({
    data: null,
    coordinates: null,
    coordinateTexts: [],
  });

  const Path = Object.freeze({
    IMAGEFILES: "image_files",
    TIMESERIES: "time_series",
    TABULAR: "tabular",
  });

  const resetState = () => {
    setStep(0);
    setPath(null);
    setSelectedPoints({ data: null, coordinates: null, coordinateTexts: [] });
    dispatch(reset());
  };

  useEffect(() => {
    if (path) {
      setStep(1);
    }
  }, [path]);

  const handleImageFileClick = () => {
    setPath(Path.IMAGEFILES);
  };

  const handleTimeSeriesClick = () => {
    setPath(Path.TIMESERIES);
  };

  const handleTabularClick = () => {
    setPath(Path.TABULAR);
  };

  const handleBackButton = () => {
    if (activeStep === 1) {
      setPath(null);
    }
    setStep(activeStep - 1);
  };

  const handleNextButton = () => {
    if (activeStep === 2) {
      // transformation Set coordinate range
      selectRange();
    } else {
      setStep(activeStep + 1);
    }
  };

  const selectRange = () => {
    var transformSelectRange = {
      name: "test",
      steps: [
        {
          type: "SelectStartEndCells",
          startCell: coordinates.text[0],
          endCell: coordinates.text[1],
        },
      ],
    };
    mlSrv
      .addTransformation(transformSelectRange)
      .then((res) => {
        if (res) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        if (result) {
          dispatch(updateTransformationSet(result));
          getPreview(result.id);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getPreview = (transformationId) => {
    mlSrv
      .getPreview(transformationId, selectedFile.id)
      .then((res) => {
        if (res) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        if (result) {
          fetch(result.href)
            .then((res) => res.blob())
            .then(
              (blob) => {
                // get text from blob
                blob.text().then((text) => processData(text));
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
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const processData = (text) => {
    var csvJSON = parseCSVData(text);
    dispatch(
      updatePreview({
        coordinates: {
          rowIndexes: [0, csvJSON.lines.length - 1],
          colIndexes: [0, 0],
        },
        data: csvJSON.lines[0],
      })
    );
    setStep(activeStep + 1);
  };

  const handleExtractData = (data) => {
    setSelectedPoints(data);
  };

  const displaySelectedStep = () => {
    if (activeStep === 0) {
      return (
        <div className="step-container">
          <Container>
            <Row className="source-type-row">
              <Button
                className="source-button"
                variant="contained"
                color="default"
                size="large"
                endIcon={<PhotoLibraryIcon />}
                onClick={handleImageFileClick}
              >
                Image Files
              </Button>

              <div>.jpg, .png</div>
            </Row>
            <Row className="source-type-row">
              <Button
                className="source-button"
                variant="contained"
                color="default"
                size="large"
                endIcon={<TimelineIcon />}
                onClick={handleTimeSeriesClick}
              >
                Time Series
              </Button>

              <div>.csv, .wav, .txt</div>
            </Row>
            <Row className="source-type-row">
              <Button
                className="source-button"
                variant="contained"
                color="default"
                size="large"
                endIcon={<TableChartIcon />}
                onClick={handleTabularClick}
              >
                Tabular
              </Button>

              <div>.csv, .xls</div>
            </Row>
          </Container>
        </div>
      );
    }

    if (activeStep === 1) {
      if (path === Path.TIMESERIES) {
        return (
          <div>
            <FileSelector auth={props.auth} />
            <div className="bottom-button-row">
              {selectedFile ? (
                <Button
                  className="bottom-nav-button"
                  variant="contained"
                  onClick={handleNextButton}
                >
                  {" "}
                  Next{" "}
                </Button>
              ) : (
                <Button variant="contained" disabled>
                  {" "}
                  Next{" "}
                </Button>
              )}
            </div>
          </div>
        );
      }
    }

    if (activeStep === 2) {
      if (path === Path.TIMESERIES) {
        return (
          <div>
            <TimeSeries
              auth={props.auth}
              handleBackButton={handleBackButton}
              handleNextButton={handleNextButton}
              handleBackButton={handleBackButton}
              handleExtractData={handleExtractData}
            ></TimeSeries>
          </div>
        );
      }
      if (path === Path.TABULAR) {
        return (
          <div>
            <div>Tabular</div>
            <Button variant="contained" onClick={handleBackButton}>
              {" "}
              Back{" "}
            </Button>
          </div>
        );
      }
      if (path === Path.IMAGEFILES) {
        return (
          <div>
            <div>Image Files</div>
            <Button variant="contained" onClick={handleBackButton}>
              {" "}
              Back{" "}
            </Button>
          </div>
        );
      }
    }
    if (activeStep === 3) {
      if (path === Path.TIMESERIES) {
        return (
          <div>
            <DefineTransformation
              data={selectedPoints.data}
              auth={props.auth}
              handleNextButton={handleNextButton}
            />
            <div className="bottom-button-row">
              {/*   <Button variant="contained" onClick={handleBackButton}> Back </Button> */}
            </div>
          </div>
        );
      }
      if (path === Path.TABULAR) {
        return (
          <div>
            <div>Tabular 2</div>
            <Button variant="contained" onClick={handleBackButton}>
              {" "}
              Back{" "}
            </Button>
          </div>
        );
      }
      if (path === Path.IMAGEFILES) {
        return (
          <div>
            <div>Image Files 2</div>
            <Button variant="contained" onClick={handleBackButton}>
              {" "}
              Back{" "}
            </Button>
          </div>
        );
      }
    }
    if (activeStep === 4) {
      if (path === Path.TIMESERIES) {
        return (
          <div>
            <ApplyTransformation callback={resetState} auth={props.auth} />
          </div>
        );
      }
    }
  };
  return (
    <Container className="prepare-data">
      <Paper>
        <Row className="header-row">
          <Col className="header"> Prepare Data</Col>
        </Row>
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {displaySelectedStep()}
      </Paper>
    </Container>
  );
}
