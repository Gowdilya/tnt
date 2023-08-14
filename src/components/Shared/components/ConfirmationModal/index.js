import React ,{useState, useEffect}from "react";
import '../ConfirmationModal/confirmationModal.scss';
import ErrorIcon from '@material-ui/icons/Error';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

function ConfirmationModal(props) {

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = useState(props.confirmation);
    
    useEffect(()=>{
        setOpen(props.confirmation);
    },[props.confirmation]);

    const handleClose = () => {
      setOpen(false);
      props.toggleConfirmation();
    };

    const handleYes =() =>{
        setOpen(false);
        props.toggleConfirmation();
        props.confirmationFunction();
    }
    
    return<Modal open={open} onClose={handleClose}> 
    <div className="vertical-alignment-helper">
        <div className="vertical-align-center">
              
            <div className="confirmation-modal-content">
                    <ErrorIcon/>
                    <IconButton className="close"  onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    
                    <div className="message">
                        {props.confirmationMessage}
                        <div className="button-group">
                            <Button className="update-button button" variant="contained" onClick={handleYes}>Yes</Button>
                            <Button  className="button" variant="contained" onClick={handleClose}>No</Button>
                        </div>
                    </div>
        
            </div>
        </div>
    </div>
    </Modal>;
}
export default ConfirmationModal;
