import React from "react";
import PropTypes from 'prop-types';


function AccessControl(props) {

    const isAllowed = () => {
        if (props.userPermissions){
        //Checks the userPermission includes EVERY required permission
        return props.requiredPermissions.every(i => props.userPermissions.includes(i));
        }else{
            return false;
        }
    }

    if(isAllowed()){
        return<>
            {props.children}
        </>
    } else return null;
    
}

AccessControl.propTypes = {
    userPermissions: PropTypes.arrayOf(PropTypes.string),
    requiredPermissions:PropTypes.arrayOf(PropTypes.string)
  };
export default AccessControl;