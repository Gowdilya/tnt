import { render } from "enzyme";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './addTransformation.scss';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MLSrv from '../../../../services/ml_srv';
import { updateTransformationSet } from "../../reducers/prepareDataSlice";
import InputLabel from '@material-ui/core/InputLabel';
import * as TRANSFORMATION from '../../../Shared/constants/Transformations';
import Slider from '../../Slider';


export default function AddTransformation(props) {
    const dispatch = useDispatch();
    const mlSrv = new MLSrv(props.auth);
    const transformationSet = useSelector((state) => state.prepareData.transformationSet);
    const [transformation, setTransformation] = React.useState('');
    const [keepNth, setKeepNth] = React.useState('');
    // const [maxLength, setMaxLength] = React.useState('');
    const [truncateLength, setTruncateLength] = React.useState('');
    const [threshold, setThreshold] = React.useState('');
    const [prevSampleWeight, setPrevSampleWeight] = React.useState(0);
    //const [currentSampleWeight, setCurrentSampleWeight] = React.useState('');
    //const [value, setValue] = React.useState(0);



    const handleChange = (event) => {
        setTransformation(event.target.value);
    };

    const handlekeepNthChange = (event) => {
        setKeepNth(event.target.value);
    };

    // const handlemaxLengthChange = (event) => {
    //     setMaxLength(event.target.value);
    // };

    const handleTruncateLengthChange = (event) => {
        setTruncateLength(event.target.value);
    };

    const handleThreshHoldChange = (event) => {
        setThreshold(event.target.value);
    };

    const applyTransformation = () => {
        var newStep = {};
        if (transformation === TRANSFORMATION.DOWNSAMPLE) {
            newStep = {
                type: transformation,
                keepNth: parseInt(keepNth),//2
               // maxLength: parseInt(maxLength)//300
            }
        } else if (transformation === TRANSFORMATION.TRUNCATE) {
            newStep = {
                type: transformation,
                length: parseInt(truncateLength),//2
            }
        } else if (transformation === TRANSFORMATION.ZEROBELOWTHRESHOLD) {
            newStep = {
                type: transformation,
                threshold: parseFloat(threshold),
            }
        }else if (transformation === TRANSFORMATION.SMOOTHFILTER) {
            newStep = {
                type: transformation,
                prevSampleWeight: prevSampleWeight ,
                currentSampleWeight: 1 - prevSampleWeight
            }
        }


        var newTransformationSet = { ...transformationSet };
        newTransformationSet.steps = [...transformationSet.steps]; //must make hard copy of object array to manipulate
        newTransformationSet.steps.pop();
        //console.log(newTransformationSet);
        newTransformationSet.steps = [...newTransformationSet.steps, newStep];
        mlSrv.updateTransformation(newTransformationSet).then((res) => {
            if (res.status >= 200 && res.status <= 299) {
                return res.json();
            } else {
                throw Error(res.statusText);
            }
        })
            .then((result) => {
                if (result) {
                    dispatch(updateTransformationSet(result));
                }
            })
            .catch((error) => {
                console.log("error", error);
            });

        props.handleClose();
    }

    const displayInput = () => {
        if (transformation === TRANSFORMATION.DOWNSAMPLE) {
            return (
                <div>
                    <TextField
                        id="standard-number"
                        label="keepNth"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={keepNth}
                        onChange={handlekeepNthChange}
                    />

                    {/* <TextField
                        id="standard-number"
                        label="maxLength"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={maxLength}
                        onChange={handlemaxLengthChange}
                    /> */}
                </div>
            )
        } else if (transformation === TRANSFORMATION.TRUNCATE) {
            return (
                <div>
                    <TextField
                        id="standard-number"
                        label="length"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={truncateLength}
                        onChange={handleTruncateLengthChange}
                    />
                </div>)
        }
        else if (transformation === TRANSFORMATION.ZEROBELOWTHRESHOLD) {
            return (
                <div>
                    <TextField
                        id="standard-number"
                        label="threshold"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={threshold}
                        onChange={handleThreshHoldChange}
                    />
                </div>)
        }
        else if (transformation === TRANSFORMATION.SMOOTHFILTER) {
            return (
                <div>
                    <Slider value={prevSampleWeight} setValue={setPrevSampleWeight}/>
                </div>)
        }
    }

    return (<div className='add-transform'>
        <div className="selection-container">
            <InputLabel id="demo-simple-select-label">Select Transformation</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={transformation}
                onChange={handleChange}
            >
                <MenuItem value={TRANSFORMATION.DOWNSAMPLE}>Downsample</MenuItem>
                <MenuItem value={TRANSFORMATION.SMOOTHFILTER}>Smooth Filter</MenuItem>
                <MenuItem value={TRANSFORMATION.ZEROBELOWTHRESHOLD}>ZeroBelowThreshold</MenuItem>
                <MenuItem value={TRANSFORMATION.TRUNCATE}>Truncate</MenuItem>
            </Select>
        </div>
        {displayInput()}
        {transformation !== '' ?
            <Button className="source-button" onClick={() => applyTransformation()}>
                Apply Transformation
        </Button> : null}
    </div>)
}