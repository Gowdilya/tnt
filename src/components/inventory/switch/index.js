import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useState , useEffect} from 'react';

export default function SwitchLabels(props) {
  const [state, setState] = React.useState({  checkedA: props.default,    });
  const [displayText, setDisplayText] = useState("Overwrite Existing Records Article Type");

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    console.log("switch handle change set to"+event.target.checked);
    props.setBoolOutput(event.target.checked);
  };
  useEffect(() =>
    {
        console.log("useEffect switch= "+props.displayText)         
        if(props.displayText=== undefined)    
            return;
        setDisplayText(props.displayText);        
    }    , [props.displayText,  props]);

  return (
    <FormGroup row>
      <FormControlLabel
        control={<Switch checked={state.checkedA} onChange={handleChange} name="checkedA" />}
        label={displayText}
      />
              
    </FormGroup>
  );
}
