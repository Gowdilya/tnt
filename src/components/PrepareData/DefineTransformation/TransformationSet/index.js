import React, { useEffect, useState, useRef } from "react";
import './transformationSet.scss';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { updateTransformationSet } from "../../reducers/prepareDataSlice";
import MLSrv from '../../../../services/ml_srv';
import { useSelector, useDispatch } from 'react-redux';






export default function TransformationSet(props) {
    const mlSrv = new MLSrv(props.auth);
    const dispatch = useDispatch();
    const transformationSet = useSelector((state) => state.prepareData.transformationSet);
    const BoldTooltip = withStyles((theme) => ({
        tooltip: {
            boxShadow: theme.shadows[1],
            fontSize: 16,
        },
    }))(Tooltip);

    const renderObject = (ObjectTest) => {
        return Object.keys(ObjectTest).map((obj, i) => {
            return (
                <div key={i}>
                    {obj}: {ObjectTest[obj]};
                </div>
            )
        })
    }

    const handleDelete = (index) => {

        var newTransformationSet = { ...transformationSet };
        newTransformationSet.steps = [...transformationSet.steps]; //must make hard copy of object array to manipulate
        newTransformationSet.steps.splice(index, 1);
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
    }


return (
    <div className="transformationSet">

        <h3>
            Transformation Set Name: {transformationSet.name}
        </h3>
        <table>
            <thead>
                <tr>
                    <th> Step</th>
                    <th> Transformation</th>
                    <th> Action </th>
                </tr>
            </thead>
            <tbody>
                {transformationSet.steps.map((step, i) => {

                    return (<tr key={i}>
                        <td>
                            {i + 1}
                        </td>
                        <td>
                            {renderObject(step)}
                        </td>
                        { i > 0 ?
                            <td>
                                <BoldTooltip title="Edit" >
                                    <IconButton aria-label="edit" onClick={() => props.handleEdit(i)}>
                                        <EditIcon />
                                    </IconButton>
                                </BoldTooltip>
                                <BoldTooltip title="Delete">
                                    <IconButton aria-label="delete" onClick={() => handleDelete(i)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </BoldTooltip>
                            </td> : <td></td>}
                    </tr>)

                })
                }
            </tbody>
        </table>
    </div>
)
            }