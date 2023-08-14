import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ReturnsSrv from '../../../services/returns_srv';
import FormControl from '@material-ui/core/FormControl';
import './symptomSelector.scss';
import SpinLoader from '../../Shared/components/Loaders/SpinLoader';
import ErrorMessage from '../../Shared/components/ErrorMessage';
import AddIcon from '@material-ui/icons/Add';




function SymptomSelector(props) {

    const [infoError, setInfoError] = useState('');
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(null);



       

    useEffect(() => {
        const returnsSrv = new ReturnsSrv(props.auth);

        setLoading(true);
        returnsSrv.getAllInformation(props.infoType, props.productType.id, false)
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
                    setInfo(result);
               }
            }).catch((error) =>{  
                setLoading(false);          
                setInfoError('Load Return Error:' + error.message);
            });       
      },[props.auth, props.infoType, props.productType.id]);


    const handleChange =(event)=> {
        if (event.target.value !== "new"){
            props.setSuggest(false);
            var foundInfo = info.find( function(infoInstance){
                return infoInstance.id === event.target.value;
            })
            props.setSelectedInfo(foundInfo);
        }else{
            props.setSuggest(true);
            props.setSelectedInfo("new");
        }
    }

    const displayReturnInfo = () => {
        if(info){
            return info.map(( infoInstance) => { return <MenuItem key={infoInstance.id} value={infoInstance.id} >
             {infoInstance.description}
            </MenuItem>});
        }
    }

    return(
        <div className="symptom-selector">
            {loading?<Row><SpinLoader ></SpinLoader></Row>:
                <FormControl >
                    <Select className='select'
                        error ={infoError === "" ? false : true}
                        value={props.suggest?"new":(props.selectedInfo?props.selectedInfo.id :"")}
                        onChange={(e) => handleChange(e)}
                        displayEmpty
                        >
                        {/* <MenuItem value="" >
                                            --Please Select Issue--
                        </MenuItem> */}

                        {displayReturnInfo()}
                        <MenuItem value="new" >
                        + Suggest New Issue 
                        </MenuItem>
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
export default SymptomSelector;