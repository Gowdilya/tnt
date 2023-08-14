import React from 'react';
import PropTypes from 'prop-types';
import './imagePreview.scss';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CameraIcon from '@material-ui/icons/Camera';


export const ImagePreview = (props) => {

  const handleClose = () => {
    props.togglePreview()
  };

  return (
    <div className={'demo-image-preview '}>
      <div className="image-container">

        <div className="preview">
          <div className="preview-header">Preview</div>
          <img src={props.dataUri} alt="preview"/>
        </div>
        <div className="side-panel">
        
          <IconButton className="preview-close" onClick={handleClose}>
                        <CameraIcon />
          </IconButton>
          <IconButton className="preview-delete" onClick={()=>props.deletePhoto(props.preview)}>
                        <DeleteIcon />
          </IconButton>
          </div>
        
      </div>
    </div>
  );
};

ImagePreview.propTypes = {
  dataUri: PropTypes.string,
  isFullscreen: PropTypes.bool
};

export default ImagePreview;