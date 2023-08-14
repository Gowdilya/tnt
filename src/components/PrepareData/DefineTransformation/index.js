import React, { useEffect, useState, useRef } from "react";
import Slider from "./../Slider";
//import Graph from "./Graph";
import MlSrv from "./../../../services/ml_srv";
import { Container, Row, Col } from "react-bootstrap";
import Graph from "./Graph";
import { useSelector, useDispatch } from "react-redux";
import TransformationSet from "./TransformationSet/index";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import "./defineTransformation.scss";
import { displayPartsToString } from "typescript";
import AddIcon from "@material-ui/icons/Add";
import AddTransformation from "./AddTransformation";
import RedoTransformation from "./RedoTransformation";
import EditTransformation from "./EditTransformation";
import { updatePreview } from "./../reducers/prepareDataSlice";
import { parseCSVData } from "./../utility/index";
import RedoIcon from "@material-ui/icons/Redo";

export default function DefineTransformation(props) {
  const dispatch = useDispatch();
  const coordinates = useSelector((state) => state.prepareData.coordinates);
  const selectedFile = useSelector((state) => state.prepareData.selectedFile);
  const transformationSet = useSelector(
    (state) => state.prepareData.transformationSet
  );
  const preview = useSelector((state) => state.prepareData.preview);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRedoModal, setShowRedoModal] = useState(false);
  const [editModal, setEditModal] = useState({ show: false, step: null });

  const mlSrv = new MlSrv(props.auth);

  const handleEdit = (step) => {
    setEditModal({ show: true, step: step });
  };

  const handleClose = () => {
    setShowAddModal(false);
    setShowRedoModal(false);
    setEditModal({ show: false, step: null });
  };

  useEffect(() => {
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
    };
    getPreview(transformationSet.id);
  }, [transformationSet]);

  // useEffect(() => {
  //         const getAllTransformation = () => {
  //                 mlSrv
  //                         .getAllTransformation()
  //                         .then((res) => {
  //                                 if (res.status >= 200 && res.status <= 299) {
  //                                         return res.json();
  //                                 } else {
  //                                         throw Error(res.statusText);
  //                                 }
  //                         })
  //                         .then((result) => {
  //                                 if (result) {
  //                                         //setRMA(result);
  //                                         //console.log(result);
  //                                 }
  //                         })
  //                         .catch((error) => {
  //                                 console.log("error", error);
  //                         });
  //         }
  //         getAllTransformation();
  // }, [])

  const displayAddModalContent = () => {
    return (
      <div className="transformation-modal-window">
        <AddTransformation
          auth={props.auth}
          handleClose={() => handleClose()}
        />
      </div>
    );
  };
  const displayRedoModalContent = () => {
    return (
      <div className="transformation-modal-window">
        <RedoTransformation
          auth={props.auth}
          handleClose={() => handleClose()}
        />
      </div>
    );
  };

  const displayEditModalContent = () => {
    return (
      <div className="transformation-modal-window">
        <EditTransformation
          auth={props.auth}
          step={editModal.step}
          handleClose={() => handleClose()}
        />
      </div>
    );
  };

  return (
    <div className="defineTransformation">
      <Container>
        <Row>
          <Col>
            <Graph data={props.data} />
          </Col>
          <Col>
            <Graph data={preview.data} />
          </Col>
        </Row>
      </Container>
      <div className="button-row">
        <Button
          className="source-button"
          onClick={() => setShowAddModal(true)}
          startIcon={<AddIcon />}
        >
          Add Transformation
        </Button>
        <Button
          className="source-button"
          onClick={() => setShowRedoModal(true)}
          startIcon={<RedoIcon />}
        >
          Redo Last
        </Button>
      </div>

      <Modal
        open={showAddModal}
        onClose={() => handleClose()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {displayAddModalContent()}
      </Modal>
      <Modal
        open={showRedoModal}
        onClose={() => handleClose()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {displayRedoModalContent()}
      </Modal>
      <Modal
        open={editModal.show}
        onClose={() => handleClose()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {displayEditModalContent()}
      </Modal>
      <TransformationSet auth={props.auth} handleEdit={handleEdit} />
      <div className="bottom-button-row">
        <Button
          className="transform-button"
          onClick={props.handleNextButton}
          variant="contained"
        >
          {" "}
          Transform Data{" "}
        </Button>
      </div>
    </div>
  );
}
