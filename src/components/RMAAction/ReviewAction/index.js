import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "@material-ui/core/Button";
import "./actionReview.scss";
import ShipmentsSrv from "../../../services/shipments_srv";
import ErrorMessage from "../../Shared/components/ErrorMessage";
import moment from "moment";
import ProductsSrv from "../../../services/products_srv";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { ReturnActions } from "../../Shared/constants/ReturnActions";
import * as ACTIONS from "../../Shared/constants/ReturnActions";
import * as DISPOSITIONS from "../../Shared/constants/ReturnDispositions";
import ViewAttachments from "./ViewAttachments";
import ReturnsSrv from "../../../services/returns_srv";
import Action_Texts from "../../Shared/constants/ReturnActions";
import SpinLoader from "../../Shared/components/Loaders/SpinLoader";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CloseIcon from "@material-ui/icons/Close";
import UpdateIcon from "@material-ui/icons/Update";
import DoneIcon from "@material-ui/icons/Done";

export default function ReviewAction(props) {
  const returnsSrv = new ReturnsSrv(props.auth);

  const useMountEffect = (fun) => useEffect(fun, []); //Call function once on component mount
  const [shipment, setShipment] = useState({
    data: null,
    loading: false,
    error: "",
  });

  const [productHistory, setProductHistory] = useState({
    data: null,
    loading: false,
    error: "",
  });

  const [selectedActionsObj, setSelectedActionsObj] = useState({});

  const [rma, setRMA] = useState(props.rma);

  const [disableClose, setDisableClose] = useState(false);

  const Rules = {};
  Rules[ACTIONS.REQUEST_ACKNOWLEDGED] = false;
  Rules[ACTIONS.REPLACEMENT_TRADE] =
    !selectedActionsObj[ACTIONS.REQUEST_ACKNOWLEDGED] ||
    selectedActionsObj[ACTIONS.REPLACEMENT_NO_TRADE];
  Rules[ACTIONS.REPLACEMENT_NO_TRADE] =
    !selectedActionsObj[ACTIONS.REQUEST_ACKNOWLEDGED] ||
    selectedActionsObj[ACTIONS.REPLACEMENT_TRADE];
  Rules[ACTIONS.WARRANTY_VALIDATED] =
    !selectedActionsObj[ACTIONS.REQUEST_ACKNOWLEDGED] ||
    selectedActionsObj[ACTIONS.WARRANTY_REJECTED];
  Rules[ACTIONS.WARRANTY_REJECTED] =
    !selectedActionsObj[ACTIONS.REQUEST_ACKNOWLEDGED] ||
    selectedActionsObj[ACTIONS.WARRANTY_VALIDATED];
  Rules[ACTIONS.GRANT_CREDIT_TRADE] =
    !selectedActionsObj[ACTIONS.REQUEST_ACKNOWLEDGED] ||
    selectedActionsObj[ACTIONS.GRANT_CREDIT_NO_TRADE];
  Rules[ACTIONS.GRANT_CREDIT_NO_TRADE] =
    !selectedActionsObj[ACTIONS.REQUEST_ACKNOWLEDGED] ||
    selectedActionsObj[ACTIONS.GRANT_CREDIT_TRADE];
  Rules[ACTIONS.GRANT_CREDIT_TRADE] =
    !selectedActionsObj[ACTIONS.REQUEST_ACKNOWLEDGED] ||
    selectedActionsObj[ACTIONS.GRANT_CREDIT_NO_TRADE];
  Rules[ACTIONS.ORDER_INVESTIGATION] = !selectedActionsObj[
    ACTIONS.REQUEST_ACKNOWLEDGED
  ];

  // const getRMA=()=>{
  //   const returnsSrv = new ReturnsSrv(props.auth);
  //   setShipment({ data: null, loading: true, error: "" });
  //   returnsSrv
  //     .get(props.rma.id)
  //     .then((res) => {
  //       if (res.status >= 200 && res.status <= 299) {
  //         return res.json();
  //       } else {
  //         throw Error(res.statusText);
  //       }
  //     })
  //     .then((result) => {
  //       if (result) {
  //         setRMA({ result});
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // }

  useEffect(() => {
    // Update the document title using the browser API
    var actionMap = {};
    if (props.rma.actions && props.rma.actions.length > 0) {
      props.rma.actions.map((action) => (actionMap[action] = true));
    }
    setSelectedActionsObj(actionMap);
  }, [props.rma.actions]);

  const checkRules = (status) => {
    return Rules[status];
  };

  //const ReturnStatusObj =[]
  const handleStatusSelect = (status) => {
    setDisableClose(true);
    if (!checkRules(status)) {
      if (selectedActionsObj[status]) {
        if (status === ACTIONS.REQUEST_ACKNOWLEDGED) {
          // wipe all selections
          setSelectedActionsObj({});
        } else {
          setSelectedActionsObj({ ...selectedActionsObj, [status]: false });
        }
      } else {
        setSelectedActionsObj({ ...selectedActionsObj, [status]: true });
      }
    }
  };

  const handleUpdateClick = () => {
    var ActionsArray = [];
    for (var property in selectedActionsObj) {
      if (selectedActionsObj[property] === true) {
        ActionsArray.push(property);
      }
    }

    var NewRMA = { ...rma };
    // If Action  is Request Acknowledged
    if (selectedActionsObj[ACTIONS.REQUEST_ACKNOWLEDGED] === true) {
      NewRMA.disposition = DISPOSITIONS.OPENED;
    }
    NewRMA.actions = ActionsArray;
    setRMA(NewRMA);
    updateReturns(NewRMA, true);
  };

  const handleCancelClick = () => {
    var NewRMA = { ...rma };
    // If Action  is Request Acknowledged

    NewRMA.disposition = DISPOSITIONS.CANCELLED;

    setRMA(NewRMA);
    updateReturns(NewRMA, true);
  };

  const handleCompleteClick = () => {
    var NewRMA = { ...rma };
    // If Action  is Request Acknowledged
    NewRMA.disposition = DISPOSITIONS.CLOSED;

    setRMA(NewRMA);
    updateReturns(NewRMA, true);
  };

  const updateReturns = (rmaObj, next) => {
    returnsSrv
      .update(rmaObj)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        if (result) {
          setRMA(result);
          if (next) {
            props.setStep(0);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  var symptoms = props.rma.information;

  const loadShipmentData = () => {
    const shipmentsSrv = new ShipmentsSrv(props.auth);
    setShipment({ data: null, loading: true, error: "" });
    shipmentsSrv
      .getShipmentByUserProductId(props.rma.product.userProductId)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        if (result) {
          setShipment({ data: result, loading: false, error: "" });
        }
      })
      .catch((error) => {
        console.log("error", error);
        setShipment({
          data: null,
          loading: false,
          error: "Failed to Load Shipment Data: " + error.message,
        });
      });
  };

  const loadProductHistory = () => {
    const productsSrv = new ProductsSrv(props.auth);
    setProductHistory({ data: null, loading: true, error: "" });
    productsSrv
      .getProductHistory(props.rma.product.id)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        if (result) {
          setProductHistory({ data: result, loading: false, error: "" });
        }
      })
      .catch((error) => {
        console.log("error", error);
        setProductHistory({
          data: null,
          loading: false,
          error: "Failed to Load Product History: " + error.message,
        });
      });
  };

  // const getFiles = () =>{
  //               setReturnFiles({ data:null, loading:true, error: ''});
  //               returnsSrv.getAllFiles(returnId).then((res) => {
  //                   if(res.status >= 200 && res.status <= 299){
  //                       return res.json()
  //                   }else{
  //                       throw Error(res.statusText);
  //                   }
  //               })
  //               .then((result) => {
  //               if(result){
  //                   setReturnFiles({data: result, loading:false});
  //               }
  //               }).catch((error) =>{
  //                   console.log('error', error)
  //                   setReturnFiles({ data:null, loading:false, error: 'Load Product Error:' + error.message});
  //               });
  //           }

  //         };

  useMountEffect(loadShipmentData);
  useMountEffect(loadProductHistory);
  const displayHistory = () => {
    return (
      <>
        {productHistory.loading ? (
          <SpinLoader />
        ) : (
          <List>
            {productHistory.data
              ? productHistory.data.map((historyElement) => {
                  return (
                    <ListItemText
                      key={historyElement.id}
                      primary={historyElement.description}
                      secondary={moment(historyElement.dateEvent).format(
                        "YYYY-MM-DD"
                      )}
                    ></ListItemText>
                  );
                })
              : null}
          </List>
        )}
      </>
    );
  };

  return (
    <Paper m={2} className="review-paper">
      <Container className="rma-action-review-container">
        <Row>
          <Col className="header"> RMA Action Review </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Paper>
              <Row className="rma-header">RMA Info</Row>
              <Row className="info">
                <div>Lock ID: {props.rma.product.userProductId} </div>
              </Row>
              <Row className="info">
                <div>{props.rma.product.productType.name}</div>
              </Row>
              {shipment.data && shipment.data[0] ? (
                <>
                  <Row className="info">
                    Packed Date:{" "}
                    {shipment.data[0].datePacked
                      ? moment(shipment.data[0].datePacked).format("YYYY-MM-DD")
                      : "N/A"}
                  </Row>
                  <Row className="info">
                    Shipped Date:{" "}
                    {shipment.data[0].dateShipped
                      ? moment(shipment.data[0].dateShipped).format(
                          "YYYY-MM-DD"
                        )
                      : "N/A"}
                  </Row>
                </>
              ) : (
                <Row>
                  <ErrorMessage
                    show={shipment.error !== ""}
                    errorMessage={shipment.error}
                  />
                </Row>
              )}
              <Row className="info">
                RMA Request Date:
                {moment(props.rma.dateCreated).format("YYYY-MM-DD")}
              </Row>
              <Row className="info">Customer:{props.rma.requestUserEmail}</Row>
              <Row className="info">
                Issue Reported: {props.rma.information.filter((info) => info.type === "MainIssue").map( info => info.description)}
              </Row>

              <Row className="info">
                Other Observations:
                {symptoms?symptoms.filter((info) => info.type === "FaultIndication").map( info => info.description).join(",  "):null}
              </Row>
            </Paper>
            <Paper>
              <Row className="rma-header">View Attachments</Row>
              <ViewAttachments
                rmaId={props.rma.id}
                auth={props.auth}
              ></ViewAttachments>
            </Paper>
          </Col>
          <Col xs={12} md={6}>
            <Row className="rma-header">Lock History</Row>

            <Paper style={{ maxHeight: 200, overflow: "auto", width: "100%" }}>
              {displayHistory()}
            </Paper>
            <Row className="rma-header">RMA Action</Row>
            <Paper style={{ maxHeight: 200, overflow: "auto", width: "100%" }}>
              <List>
                {ReturnActions.map((status) => {
                  return (
                    //selected={selectedStatusArray[status] === true}

                    <ListItem
                      key={status}
                      disabled={checkRules(status)}
                      className={
                        selectedActionsObj[status] === true
                          ? "selected-status action"
                          : "action"
                      }
                      onClick={() => handleStatusSelect(status)}
                    >
                      <ListItemText primary={Action_Texts[status]}>
                        {" "}
                      </ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
            
           



            <Button
              className="update-button show"
              variant="contained"
              onClick={() => props.back()}
            >
              <ArrowBackIosIcon />
              Back
            </Button>

            <Button
              className="updateReview-button show"
              variant="contained"
              onClick={() => handleUpdateClick()}
            >
              Update & Save Action
              <UpdateIcon />
            </Button>

            <Row className="rma-header">Complete Review</Row>
            {!(rma.actions && rma.actions.length > 1) ? (
              <Button
                className="cancelReview-button show"
                variant="contained"
                onClick={() => handleCancelClick()}
              >
                Cancel Ticket
                <CloseIcon />
              </Button>
            ) : (
              <Button
                className="cancelReview-button"
                variant="contained"
                disabled
              >
                Cancel Ticket
                <CloseIcon />
              </Button>
            )}

            {!(rma.actions && rma.actions.length > 1) ? (
              <Button className="update-button" variant="contained" disabled>
                Close Ticket
                <DoneIcon />
              </Button>
            ) : (
              <Button
                className="completeReview-button show"
                variant="contained"
                onClick={() => handleCompleteClick()}
              >
                Close Ticket
                <DoneIcon />
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </Paper>
  );
}
