import React, { useState,  useRef } from "react";
import "./createUserPage.scss";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Col, Row, Container } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import UsersService from "../../../services/user_srv";
import { CR } from "../../Shared/constants/KeyCodes";
import Parser from "../../Shared/Parser";
import ErrorMessage from "../../Shared/components/ErrorMessage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function CreateUserPage(props) {
  const classes = useStyles();

  const usersSrv = new UsersService(props.auth);
  const emailTextRef = useRef();
  const firstNameTextRef = useRef();
  const lastNameTextRef = useRef();

  const [page, setPage] = useState(0);
  const [email, setEmailState] = useState({
    error: "",
    text: "",

  });

  const [firstName, setFirstNameState] = useState({
    error: "",
    text: "",
 
  });

  const [lastName, setLastNameState] = useState({
    error: "",
    text: "",

  });

  const createUser = () => {
    usersSrv
      .createUser({
        email: email.text,
        firstName: firstName.text,
        lastName: lastName.text,
      })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result) {
          setPage(1);
        } else {
          setPage(2);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setPage(2);
      });

    //props.back();
  };

  const handleEmailTextChange = (event) => {
    setEmailState({ ...email, text: event.target.value });
  };

  const handleFirstNameTextChange = (event) => {
    setFirstNameState({ ...firstName, text: event.target.value });
  };

  const handleLastNameTextChange = (event) => {
    setLastNameState({ ...lastName, text: event.target.value });
  };

  const keyPressEmail = (event) => {
    if (event.key === CR) {
      emailTextRef.current.blur();
    }
  };

  const validateEmail = () => {
    if (email.text === "") {
      setEmailState({
        ...email,
        error:
          "MANDATORY FIELD: Email Can Not be Empty, Please Enter a Valid Email",
      });
    } else if (Parser.validEmail(email.text)) {
      setEmailState({
        ...email,
        error: "",
      });
    }else{
      setEmailState({
        ...email,
        error: "INVALID EMAIL FORMAT",
      });
    }
  };

  const keyPressFirstName = (event) => {
    if (event.key === CR) {
      firstNameTextRef.current.blur();
    }
  };
  //onBlur
  const validateFirstName = () => {
    if (firstName.text === "") {
      setFirstNameState({
        ...firstName,
        error:
          "MANDATORY FIELD: First Name Can Not be Empty, Please Enter a First Name",
      });
    } else if (Parser.validName(firstName.text)) {
      setFirstNameState({
        ...firstName,
        error: "",
      });
    }else{
      setFirstNameState({
        ...firstName,
        error: "INVALID NAME: use only alphabetic charecters",
      });
    }
  };

  const keyPressLastName = (event) => {
    if (event.key === CR) {
      lastNameTextRef.current.blur();
    }
  };

  const validateLastName = () => {
    if (lastName.text === "") {
      setLastNameState({
        ...lastName,
        error:
          "MANDATORY FIELD: Last Name Can Not be Empty, Please Enter a Last Name",
      });
    }else if (Parser.validName(lastName.text)) {
      setLastNameState({
        ...lastName,
        error: "",
      });
    }else{
      setLastNameState({
        ...lastName,
        error: "INVALID NAME: use only alphabetic charecters",
      });
    }
  };

  if (page === 0) {
    return (
      <Container className="createUser">
        <Row className="header-row">
          <Col className="header"> Create User</Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center" }} xs={12} lg={6}>
            <TextField
              id="filled-basic"
              inputRef={emailTextRef}
              variant="filled"
              error={email.error === "" ? false : true}
              label={email.error === "" ? "Email" : " ERROR"}
              type="search"
              margin="normal"
              value={email.text}
              onKeyDown={keyPressEmail} //Submit value once Enter is pressed
              onChange={(e) => handleEmailTextChange(e)}
              onBlur={validateEmail}
            />
            <ErrorMessage
              show={email.error === "" ? false : true}
              errorMessage={email.error}
            ></ErrorMessage>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center" }} xs={12} lg={6}>
            <TextField
              id="filled-basic"
              inputRef={firstNameTextRef}
              variant="filled"
              error={firstName.error === "" ? false : true}
              label={firstName.error === "" ? "First Name" : " ERROR"}
              type="search"
              margin="normal"
              value={firstName.text}
              onKeyDown={keyPressFirstName} //Submit value once Enter is pressed
              onChange={(e) => handleFirstNameTextChange(e)}
              onBlur={validateFirstName}
            />
            <ErrorMessage
              show={firstName.error === "" ? false : true}
              errorMessage={firstName.error}
            ></ErrorMessage>
          </Col>
          <Col style={{ textAlign: "center" }} xs={12} lg={6}>
            <TextField
              id="filled-basic"
              inputRef={lastNameTextRef}
              variant="filled"
              error={lastName.error === "" ? false : true}
              label={lastName.error === "" ? "Last Name" : " ERROR"}
              type="search"
              margin="normal"
              value={lastName.text}
              onKeyDown={keyPressLastName} //Submit value once Enter is pressed
              onChange={(e) => handleLastNameTextChange(e)}
              onBlur={validateLastName}
            />
            <ErrorMessage
              show={lastName.error === "" ? false : true}
              errorMessage={lastName.error}
            ></ErrorMessage>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="button-panel">
            
              {email.text !== "" &&
              firstName.text !== "" &&
              lastName.text !== "" &&
              email.error === "" &&
              firstName.error === "" &&
              lastName.error === "" ? (
                <Button
                  className="update-button show"
                  variant="contained"
                  onClick={createUser}
                >
                 Create
                </Button>
              ) : (
                <Button className="update-button " variant="contained" disabled>
                 Create
                </Button>
              )}
              <Button
                className="update-button show"
                variant="contained"
                onClick={props.back}
              >
                Back
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  } else if (page === 1) {
    return (
      <Container className="createUser">
        <Row className="header-row">
          <Col className="header"> Create User</Col>
        </Row>
        <Row>
          <Col>
            <div className="center-msg">Successfully created the User!</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="button-panel">
              <Button
                className="update-button show"
                variant="contained"
                onClick={props.back}
              >
                Return to Table
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container className="createUser">
        <Row className="header-row">
          <Col className="header"> Create User</Col>
        </Row>
        <Row>
          <Col>
            <ErrorMessage
              show={true}
              errorMessage={"Error: Failed to Create User"}
            ></ErrorMessage>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="button-panel">
              <Button
                className="update-button show"
                variant="contained"
                onClick={props.back}
              >
                Return to Table
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
