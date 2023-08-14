import React from 'react';
import TextField from '@material-ui/core/TextField'
import './symptomSuggester.scss';

function SymptomSelector(props) {
    

    const handleChangeText = (event) => {
        props.setSuggestion(event.target.value);
    };

    return(
        <div className="symptom-suggester">
             {/* <div className="symptom-header"> Suggest New {props.type} :</div> */}
            <TextField label={"Suggest New " + props.type} disabled={props.disable} variant="filled" 
                value={props.suggestion}
                error={props.suggestion ==""}
                // onKeyDown={keyPressArticleSN} //Submit value once Enter is pressed
                onChange={(e) => handleChangeText(e)}
             />
        </div>
        )
}
export default SymptomSelector;