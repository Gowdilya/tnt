import React, { useEffect, useState, useRef } from "react";
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import './slider.scss';
import TextField from '@material-ui/core/TextField';



export default function SliderPage(props) {
    //const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        
             props.setValue(newValue);
        
    };
    
return(<div className="slider">
         <Typography id="non-linear-slider" gutterBottom>
        Slider
      </Typography>
      <Slider  
      value={props.value} 
      min={0}
      max={1}
      marks
      step={0.01}
      onChange={handleChange} valueLabelDisplay="auto"  />



       <TextField
                        id="standard-number"
                        label="previous Sample weight"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={props.value}
                        // onChange={handleThreshHoldChange}
                    />

      <TextField
                        id="standard-number"
                        label="current Sample weight"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={1-props.value}
                        // onChange={handleThreshHoldChange}
                    />
</div>)
}