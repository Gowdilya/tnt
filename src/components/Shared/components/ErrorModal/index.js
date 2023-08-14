import React ,{useState, useEffect}from "react";
import '../ErrorModal/errorModal.scss';
import ErrorIcon from '@material-ui/icons/Error';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

function ErrorModal(props) {

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = useState(props.showError);
    
    useEffect(()=>{
        setOpen(props.showError);
    },[props.showError]);

    const handleClose = () => {
      setOpen(false);
      props.toggleError()
    };
    
    return<Modal open={open} onClose={handleClose}> 
     <div className="error-modal vertical-alignment-helper">
        <div className="vertical-align-center">
            <div className="modal-content errorBox">
                <ErrorIcon/>
                <IconButton className="close" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <div className="message">
                    {props.errorMessage}
                </div>
            </div>
        </div>
    </div>
    </Modal>;
}
export default ErrorModal;
