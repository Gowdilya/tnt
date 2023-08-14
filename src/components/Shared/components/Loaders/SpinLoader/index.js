

import CircularProgress from '@material-ui/core/CircularProgress';
import React from "react";
import { makeStyles } from '@material-ui/styles';
import './spinner.scss';

//We can use Material UI version of inline style, to customize based on tenat theme
const useStyles = makeStyles({ 
    root: {
      //color: '#ed1a39',
      //width: '60px',
      //height: '60px',
      //position:'relative',
      //left: '50%',
      //top:'50%',
    },
  });

function Spinner() {
    const classes = useStyles();
    return <div className="spin-container">
        <CircularProgress  className={classes.root}/>
    </div>;
}
export default Spinner;