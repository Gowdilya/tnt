import React, { useState } from "react";
import "./rmaRequests.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import RMAActionTable from "./RMAActionTable";
import ReviewAction from "./ReviewAction";
import Paper from "@material-ui/core/Paper";


function getSteps() {
  return ["RMA Status Report", "Review & Action", "Submit Request"];
}
const steps = getSteps();

export default function RMAAction(props) {
  const [activeStep, setStep] = useState(0);
  const [rma, setRMA] = useState(null);

  const resetState = () => {
    setStep(0);
    setRMA(null);
  };

  const handleSelectRMA = (rmaInfo) => {
    setRMA(rmaInfo);
    setStep(activeStep + 1);
  };

  const handleBackButton = () => {
    setStep(activeStep - 1);
  };

  const displaySelectedStep = () => {
    if (activeStep === 0) {
      return (
        <RMAActionTable
          auth={props.auth}
          selectRMA={handleSelectRMA}
        ></RMAActionTable>
      );
    }
    if (activeStep === 1) {
      return (
        <ReviewAction
          auth={props.auth}
          rma={rma}
          back={handleBackButton}
          setStep={setStep}
        ></ReviewAction>
      );
    }
    // if (activeStep === 2) {
    //   return (
    //     <>
    //      <Row>
    //           <Col className="final-message"> RMA was Succesfuly Reviewed!</Col>
    //       </Row>
    //       <div className="button-container">
    //         <Button
    //           className="update-button show"
    //           variant="contained"
    //           onClick={resetState}
    //         >
    //           Return to Table
    //         </Button>
    //       </div>
    //     </>
    //   );
    // }
  };
  return (
    <Container className="request-container">
      <Paper>
        <Row className="header-row">
          <Col className="header"> RMA Action</Col>
        </Row>
        <Stepper activeStep={activeStep}>
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
