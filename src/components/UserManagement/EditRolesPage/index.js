import React, { useState, useEffect } from "react";
import "./editRolePage.scss";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import { Col, Row, Container } from "react-bootstrap";
import UsersService from "../../../services/user_srv";
import ErrorMessage from "../../Shared/components/ErrorMessage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function EditRolesPage(props) {
  const usersSrv = new UsersService(props.auth);
  const classes = useStyles();
  const [userRoles, setUserRoles] = React.useState(null);
  const [roles, setRoles] = React.useState(null);
  const [isFirst, setIsFirst] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [addComplete, setAddComplete] = React.useState(false);
  const [deleteComplete, setDeleteComplete] = React.useState(false);

  
  const useMountEffect = (fun) => useEffect(fun, []); //Call function once on component mount

  const handleChange = (event) => {
    var index = roles.findIndex(rl =>rl.id === event.target.value)
    var newResult = [...roles];
    newResult[index].assigned = !newResult[index].assigned;
    setRoles(newResult);
  };

  useEffect(() =>{
    //called only once
    if (isFirst && roles){
      getUserRoles();
      setIsFirst(false);
    }
}, [roles, isFirst])

useEffect(() =>{
  //called only once
  if (addComplete && deleteComplete && error === null){
    setSuccess(true);
  }
}, [addComplete, deleteComplete])

  const getAllRoles = () => {
    usersSrv
      .getAllRoles()
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result) {
          var newResult = result.map( (role) =>  ({...role, assigned: false}))
          setRoles(newResult);
        } else {
          setError("NO RESULTS: Failed to get All Roles");
        }
      })
      .catch((error) => {
        console.log("error", error);
        setError("FAILED to LOAD ROLES:" + error.message);
      });
  };
  const updateRoles = () =>{
    setError(null);
    setAddComplete(false);
    setDeleteComplete(false);
     var rolesAssigned = roles.map( function (role){ if (role.assigned ===true) {
      const found = userRoles.some(el => el.name === role.name);
        if(!found){
          return {id: role.id, name: role.name}
        }
      }});

     rolesAssigned = rolesAssigned.filter(n=>n!==undefined)
     if(rolesAssigned.length > 0){
         addRoles(rolesAssigned);
     }else{
      setAddComplete(true);
     }
     var rolesUnAssigned = roles.map( function (role){ if (role.assigned ===false) {
      const found = userRoles.some(el => el.name === role.name);
      if(found){
        return {id: role.id, name: role.name}
      }
    }});
    rolesUnAssigned = rolesUnAssigned.filter(n=>n!==undefined)
    if(rolesUnAssigned.length > 0){
        removeRoles(rolesUnAssigned);
    }else{
      setDeleteComplete(true);
    }
    //Only when there is no Error, its a successful Update
    // if(error === null){
    //   setSuccess(true);
    // }
  } 
  function refreshPage() {
    props.back();
  }

  const addRoles = (Roles) => {
    usersSrv
     .addRoles(props.row.original.id, Roles).then((res) => {
        if(res.status === 200 || res.status === 204){
          setAddComplete(true);
        }else {
          throw Error(res.statusText);
        }
    })
    .catch((error) => {
      console.log("error", error);
      setError("FAILED to ADD ROLES, TRY AGAIN: " + error.message);
    });
  }
  const removeRoles = (Roles) => {
    usersSrv
     .removeRoles(props.row.original.id, Roles).then((res) => {
      
      if(res.status === 200 || res.status === 204){
        setDeleteComplete(true);
      }else {
        throw Error(res.statusText);
      }
    })
    .catch((error) => {
      console.log("error", error);
      setError("FAILED to REMOVE ROLES, TRY AGAIN: " + error.message);
    });
  }
  const getUserRoles = () => {
    usersSrv
      .getUserRoles(props.row.original.id)
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result) {
          setUserRoles(result);
          result.map( (role) =>{ 
            if (result && roles && roles.length > 0 && result.length > 0){
            var index = roles.findIndex(rl =>rl.id === role.id)
              if (index > -1){
                var newResult = [...roles];
                if (newResult[index].assigned == false){
                newResult[index].assigned = true;
                setRoles(newResult);
                }
              }
            }
          })
        } 
      })
      .catch((error) => {
        console.log("error", error);
        setError("FAILED to LOAD ROLES:" + error.message);
      });
  };

  const setUpRoles = () =>{
     getAllRoles();
    
  }
  
  useMountEffect(setUpRoles);

  return (
    <Container className="editRole">
      <Row className="header-row">
        <Col className="header"> Edit Roles</Col>
      </Row>
      {success?
      <>
        <Row>
          <Col>
            <div className="center-msg">Successfully updated Roles!</div>
          </Col>
        </Row>
        <Row>
        <div className="button-panel">
               <Button
              className="update-button show"
              variant="contained"
              onClick={refreshPage}
            >
             Return to Table
            </Button>
             </div>
        </Row>
      </>

      :
      <>
      <Row>
        <Col style={{ textAlign: "center" }}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              {roles?roles.map( (role) => {return(
                  <FormControlLabel key={role.id}
                  control={
                    <Checkbox
                      checked={role.assigned}
                      onChange={handleChange}
                      name={role.name}
                      value={role.id}
                    />
                  }
                  label={role.name}
                />
              )
              }):null}
            </FormGroup>
          </FormControl>
        </Col>
      </Row>
      <Row>
      <ErrorMessage
              show={error ? true : false}
              errorMessage={error}
            ></ErrorMessage>
      </Row>
      <Row>
       
        <Col>
          {error?
             <div className="button-panel">
               <Button
              className="update-button show"
              variant="contained"
              onClick={refreshPage}
            >
             Retry
            </Button>
            <Button
                className="update-button show"
                variant="contained"
                onClick={props.back}
              >
                Back
            </Button>
             </div>
          :
          <div className="button-panel">
          {roles && !isFirst?
            <Button
              className="update-button show"
              variant="contained"
              onClick={updateRoles}
            >
              Update 
            </Button>:
            <Button
            className="update-button"
            variant="contained"
            disabled
          >
            Update 
          </Button>}
          <Button
                className="update-button show"
                variant="contained"
                onClick={props.back}
              >
                Back
          </Button>
          </div>
          }
        </Col>
      </Row>
      </>}
    </Container>
  );
}
