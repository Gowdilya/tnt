import React from 'react';

import Col from 'react-bootstrap/Col';
import TextField from "@material-ui/core/TextField";
import './externalCode.scss';


function ExternalCode(props) {

    const handleExternalCode = (event) =>{
        props.setExternalCode(event.target.value);
    }

    // const keyExternalCodeTextField = (event) => {
    //     if (event.key === CR) 
    //     {
    //         props.Enter(event.target.value);
    //     }
    // }

    return(
        <>

                <Col className="external-code" >
                <TextField className='external-code-field'
                        id="filled-basic"
                        type="search"
                        margin="normal"
                        variant="filled"
                        value={props.externalCode}
                        //onKeyDown={keyExternalCodeTextField} //Submit value once Enter is pressed
                        onChange={(e) => handleExternalCode(e)}
                    />
                </Col>

        </>

    );


    }
export default ExternalCode;