import React ,{useState, useEffect}from "react";
import '../WarningModal/warningModal.scss';
import WarningIcon from '@material-ui/icons/Warning';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

function WarningModal(props) {

    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = useState(props.warning);
    
    useEffect(()=>{
        setOpen(props.warning);
    },[props.warning]);

    const handleClose = () => {
      setOpen(false);
      props.toggleWarning()
    };
    
    return<Modal open={open} onClose={handleClose}> 
     <div className="warning-modal vertical-alignment-helper">
        <div className="vertical-align-center">
            <div className="modal-content warning">
                <WarningIcon/>
                <IconButton className="close" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <div className="message">
                    {props.warningMessage}
                </div>
            </div>
        </div>
    </div>
    </Modal>;
}
export default WarningModal;
