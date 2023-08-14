import React from "react";
import PropTypes from 'prop-types';


function AccessControlR(props) {

    const isAllowed = () => {
        if (props.userRoles){
        //Checks the userRoles includes some allowed role

        return props.userRoles.some(i => props.allowedRoles.includes(i.name));
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

AccessControlR.propTypes = {
    userRoles: PropTypes.arrayOf(PropTypes.object),
    allowedRoles:PropTypes.arrayOf(PropTypes.string)
  };
export default AccessControlR;