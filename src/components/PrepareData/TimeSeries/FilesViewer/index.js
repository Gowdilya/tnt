import React, { useEffect, useState, useRef } from "react";
import MLSrv from "../../../../services/ml_srv";
import {updateSelectedFile} from '../../reducers/prepareDataSlice';
import { useSelector, useDispatch } from 'react-redux';


export default function FileViewer(props) {
    const [files, setFiles] = useState(null);
    const [fileData, setFileData] = useState(null);
    const dispatch = useDispatch()
    const mlSrv = new MLSrv(props.auth);

    useEffect(() => {
        //called only once
        loadAllFiles();
    }, [])

    const loadAllFiles = () => {
        mlSrv.getAllFiles().then((res) => {
            return res.json()
        }
        )
            .then((result) => {
                if (result) {
                    setFiles(result);

                }
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.error(error);
                    // this.setState({
                    //     error:error,
                    //     selectedFile:null
                    // });

                }
            ).catch(function (reason) { // this context is not passed into the function
                console.log(reason);
                // this.setState({
                //     error:reason,
                //     selectedFile:null
                // });
            });

    }


    const deleteFile = (file) => {
        mlSrv.deleteFile(file.id).then((res) => {
            return res.json()
        }
        )
            .then((result) => {
                if (result) {
                    setFiles(result);

                }
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.error(error);
                    // this.setState({
                    //     error:error,
                    //     selectedFile:null
                    // });

                }
            ).catch(function (reason) { // this context is not passed into the function
                console.log(reason);
                // this.setState({
                //     error:reason,
                //     selectedFile:null
                // });
            });
            loadAllFiles();
    }


    const selectFile = (file) => {
        dispatch(updateSelectedFile(file));

        // var localUrl = file.url.href.replace(
        //     "host.docker.internal",
        //     "localhost"
        // );
        //var prodUrl = file.url.href;

        fetch(file.url.href).then((res) => res.blob())
            .then((blob) => {
                // get text from blob
                blob.text().then(text => props.handleSelectCSVData(text));
                dispatch(updateSelectedFile(file));
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.error(error);
                    // this.setState({
                    //     error:error,
                    //     selectedFile:null
                    // });

                }
            ).catch(function (reason) { // this context is not passed into the function
                console.log(reason);
                // this.setState({
                //     error:reason,
                //     selectedFile:null
                // });
            });

    }
    const displayFile = (file) => {
        return (<div 
            key={file.id}
        ><button onClick={() => selectFile(file)} >{file.filename}</button>
        <button onClick={() => deleteFile(file)} >DELETE</button></div>
        )

    }
    return (<div>
        {files ? files.map(file => { return displayFile(file) }) : null}
    </div>)
}