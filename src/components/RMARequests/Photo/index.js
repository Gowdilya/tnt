import 'react-html5-camera-photo/build/css/index.css';
import React, { useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import './camera.scss';
import ErrorMessage from '../../Shared/components/ErrorMessage';

function Photo (props) {

    const [errorMessage, setErrorMessage] = useState('');

    function handleTakePhotoAnimationDone (dataUri) {
      props.addPhoto(dataUri);
      setErrorMessage('');
    }

    function handleCameraError (error) {
      console.log('handleCameraError', error);
      setErrorMessage(error.message);
    }
  

   
   
    return (
        <div>
              <Camera onTakePhotoAnimationDone = {handleTakePhotoAnimationDone}
                  idealFacingMode = {FACING_MODES.ENVIRONMENT}
                 
                   onCameraError = { (error) => { handleCameraError(error); } }
                  // idealResolution = {{width: 640, height: 480}}
                  imageType = {IMAGE_TYPES.JPG}
              />
              <ErrorMessage show={errorMessage!==''?true: false} errorMessage={errorMessage}></ErrorMessage>
    
        </div>
      );
    }
   
  export default Photo;