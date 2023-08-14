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
import Input from '@material-ui/core/Input';



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
        props.setSelectedInfo(event.target.value);
        if(event.target.value.includes("new")){
            props.setSuggest(true);
        }else{
            props.setSuggest(false);
        }
        var newArr = [];

        event.target.value.forEach(element => {
            var foundInfo = info.find( function(infoInstance){
                return infoInstance.id === element;
            })
            if(foundInfo){
                newArr.push(foundInfo);
            }
        });
        props.setfaultIndicationObjs(newArr);
        

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
                        multiple
                        error ={infoError === "" ? false : true}
                        value={props.selectedInfo}
                        onChange={(e) => handleChange(e)}
                        input={<Input />}
                        displayEmpty
                
                        //     return selected.join(', ');
                        //   }}
                        // >
                        >

                        {displayReturnInfo()}
                        <MenuItem key="new" value="new" >
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