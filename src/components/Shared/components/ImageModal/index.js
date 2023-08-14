import React ,{useState, useEffect}from "react";
import './imageModal.scss';
import ErrorIcon from '@material-ui/icons/Error';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

function ImageModal(props) {

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = useState(props.showImage);
    
    useEffect(()=>{
        setOpen(props.showImage);
    },[props.showImage]);

    const handleClose = () => {
      setOpen(false);
      props.toggleImagePreview()
    };
    
    return<Modal open={open} onClose={handleClose}> 
     <div className="image-modal vertical-alignment-helper" onClick={handleClose}>
        <div className="vertical-align-center">
            <div className="modal-content errorBox">
                {/* <ErrorIcon/> */}
                
                <div className="message">
                {props.imageUrl?<img className="photos" src={props.imageUrl} alt="new"  />:null}
                </div>
                <IconButton className="close" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            
        </div>
    </div>
    </Modal>;
}
export default ImageModal;