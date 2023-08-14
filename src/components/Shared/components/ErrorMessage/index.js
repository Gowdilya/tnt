import React from "react";
import '../ErrorMessage/errorMessage.scss';
import ErrorIcon from '@material-ui/icons/Error';


function ErrorMessage(props) {
    return<div className={props.show? "error" : "error hide"}>
        <ErrorIcon/>
        {props.errorMessage}
    </div>;
}
export default ErrorMessage;