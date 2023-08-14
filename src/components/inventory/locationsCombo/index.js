import './locationsCombo.scss';
import LocationsSrv from '../../../services/locations_srv';
import React, { useState, useEffect } from 'react';
import ErrorMessage from '../../Shared/components/ErrorMessage';
import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

function LocationsCombo(props) {
    
    const [infoError, setInfoError] = useState('');
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {        
        const locationsSrv = new LocationsSrv(props.auth);

        setLoading(true);
        locationsSrv.getAll()
            .then((res) => { 
                setLoading(false);
                if(res.status >= 200 && res.status <= 299){                   
                    return res.json() 
                }else{
                    throw Error(res.statusText);
                }
            })
            .then((result) => {
               if(result){
                console.log(result)
                    setInfo(result);
               }
            }).catch((error) =>{  
                setLoading(false);          
                setInfoError('Load Return Error:' + error.message);
            });       
      },[props.auth, props.infoType, props.location]); // was props.productType.id


    const handleChange =(event)=> {
        console.log("inside handleChange property type")
        console.log(event)
        //props.setSuggest(false);
        var foundInfo = info.find( function(infoInstance){
            return infoInstance.id === event.target.value;
        })
        //props.setSelectedInfo(foundInfo); //? sel
        if(foundInfo === undefined){
            props.selectLocation('');
            return;
        }
        props.selectLocation(foundInfo);
        
    }

    const displayLocationsCombobox = () => {
        if(info){
            return info.map(( infoInstance) => { return <MenuItem key={infoInstance.id} value={infoInstance.id} >
             {infoInstance.name}
            </MenuItem>});
        }
    }

    return(
        <div className="symptom-selector">
            {loading?<Row>
                Loading
                {/*<SpinLoader ></SpinLoader>*/}
                </Row>:
                <FormControl >
                    <Select className='select'
                        error ={infoError === "" ? false : true}
                        value={(props.selectLocation!==undefined ?props.selectLocation.id :"")}
                        onChange={(e) => handleChange(e)}
                        displayEmpty
                        >
                        {/* <MenuItem value="" >
                                            --Please Select Issue--
                        </MenuItem> */}

                        {displayLocationsCombobox()}
                        
                    </Select>
                    <ErrorMessage
                        show={infoError === "" ? false : true}
                        errorMessage={infoError}>
                    </ErrorMessage>
                </FormControl>
            }
        </div>
        )
}

export default LocationsCombo;