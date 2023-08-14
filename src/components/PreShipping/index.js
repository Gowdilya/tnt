import React from "react";
import PropTypes from "prop-types";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Container from 'react-bootstrap/Container';
import ProductsSrv from "../../services/products_srv";
import ShipmentsSrv from "../../services/shipments_srv";

import SANScan from "./SANScan";
import TextField from "@material-ui/core/TextField";

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/RemoveCircle';

import {CR} from '../Shared/constants/KeyCodes';

import './ship.scss';
import Parser from '../Shared/Parser';
import {PREPARED} from '../Shared/constants/ShipmentStatus';
import * as CONST from '../Shared/constants/ShipmentStatus';

import QrReader from 'react-qr-reader';
import Button from "@material-ui/core/Button";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmationModal from '../Shared/components/ConfirmationModal';
import ErrorMessage from '../Shared/components/ErrorMessage';
import ErrorModal from '../Shared/components/ErrorModal';
import Location from './location';
import DoneIcon from "@material-ui/icons/Done";





function getSteps() {
    return ['Authorize Shipping', 'Select Location', 'Select Cartons'];
  }
  
const steps = getSteps();
  

class PreShipping extends React.Component {
    productsSrv;
    shipmentsSrv;

    constructor(props) {
        super(props);

        this.state = {
            loadingshipment: false,
            selectedLocation:null,
            boxSN:'',
            shipmentError:false,
            shipmentErrorMsg:'',
            shipments: [],
            activeStep:0,
            showQrScan:false,
            confirmation:false,
            error:null,
            showError: false,
            errorMsg:'',
            SAN:null,
            updateError: null,
            green:false,
            shipmentNumberOfProductsErrorMsg:'',
            productCount:0,
            usedSANModal: false,
        };
        this.shipmentsSrv = new ShipmentsSrv(this.props.auth);
        this.productSrv = new ProductsSrv(this.props.auth);
        this.handleLocationSelect = this.handleLocationSelect.bind(this);
        this.keyPressBoxSN = this.keyPressBoxSN.bind(this);
        this.getShipmentByUserShipmentId = this.getShipmentByUserShipmentId.bind(this);
        this.displayCartons = this.displayCartons.bind(this);
        this.handleShippingDeselect = this.handleShippingDeselect.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleQrScanToggle = this.handleQrScanToggle.bind(this);
        this.handleScan = this.handleScan.bind(this);
        this.getQrScanner = this.getQrScanner.bind(this);
        this.enterCarton = this.enterCarton.bind(this);
        this.toggleConfirmation = this.toggleConfirmation.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.closePrepping = this.closePrepping.bind(this);
        this.handleSetSAN = this.handleSetSAN.bind(this);
        this.reload = this.reload.bind(this);
        this.checkCartons = this.checkCartons.bind(this);
        this.proceedSANModal = this.proceedSANModal.bind(this);
        this.toggleSANModal = this.toggleSANModal.bind(this);
        this.handleNextSetLocation = this.handleNextSetLocation.bind(this);
    }
    proceedSANModal(){
        this.setState({
            usedSANModal: false,
            activeStep: this.state.activeStep + 1
        })
    }
    toggleSANModal(){
        this.setState({
            usedSANModal: !this.state.usedSANModal,
        })
    }
    handleChangeBoxSN(event) {
        this.setState({ boxSN: event.target.value });
    }

    keyPressBoxSN(e){
        if (e.key === CR) {
            this.enterCarton(e.target.value);
        }
    }

    reload(){
        this.setState({
            loadingshipment: false,
            selectedLocation:null,
            boxSN:'',
            shipmentError:false,
            shipmentErrorMsg:'',
            shipments: [],
            activeStep:0,
            showQrScan:false,
            confirmation:false,
            error:null,
            showError: false,
            errorMsg:'',
            SAN:null,
            updateError: null,
            green:false,
            shipmentNumberOfProductsErrorMsg:'',
            productCount:0,
            usedSANModal: false,
        })
    }

    enterCarton(cartonText){
        this.setState({shipmentError:false, shipmentErrorMsg: '', green:false});
            if(Parser.validURL(cartonText)){ 
                //Check valid URL entry to see if it is a QR61URL and Parse accordingly
                
                    //extract the cartonID and search/create carton
                    var cartonId = Parser.getID(cartonText); //returns empty string if there isn't an ID where its expected
                    if(isNaN(cartonId)){
                        this.setState({shipmentError:true});
                        this.setState({shipmentErrorMsg:"INVALID ENTRY:  CARTON URL format INVALID"});
                    }else{ //Only accept Valid Number
                        if(this.shipmentAlreadyAdded(cartonId)){
                            this.setState({
                                showError:true,
                                errorMsg:'This carton was already selected!'
                            })
                        }else{
                            this.getShipmentByUserShipmentId(cartonId);
                        }
                    }
            }else{ 
                // Check NON-URL entry to see if it is a valid ID entry, if so search and create/load Carton
                if(Parser.validAlphaNumID(cartonText)){
                    if(this.shipmentAlreadyAdded(cartonText)){
                        this.setState({
                            showError:true,
                            errorMsg:'This carton was already selected!'
                        })
                    }else{
                        this.getShipmentByUserShipmentId(cartonText);
                    }
                }
                else{
                    this.setState({shipmentError:true});
                    this.setState({shipmentErrorMsg:"INVALID ENTRY: contains non-alphanumeric characters"});
                }
            } 
    }

    handleLocationSelect(location){
        this.setState({selectedLocation:location
        })
    }

    shipmentAlreadyAdded(cartonId){
        //Returns true if this shipment was already added
        if (this.state.shipments.find(shipment => shipment.userShipmentId === cartonId)){
            return true;
        }else{
            return false;
        }
    }


    getShipmentsBySAN(){
        this.setState({ loadingshipment: true }, () => {
            this.shipmentsSrv.getByAuthorizationCode(this.state.SAN)
            .then((res)=>{
                return res.json()
            })
            .then((result) => {
               this.setState({
                loadingshipment: false,
                shipments:  result,
                shipmentError:  false ,
                boxSN: '',
                
            },()=> this.checkCartons())
            },
            (error) => {
                this.setState({
                    loadingshipment: false,
                    error: error,
                    shipmentError:true,
                    shipmentErrorMsg: "FETCHING ERROR: Failed to Retrieve Shipment Information"
                })
        }).catch( (reason)=> { 
            this.setState({
                loadingshipment: false,
                error: reason,
                shipmentError:true,
                shipmentErrorMsg:"FETCHING ERROR: Failed to Retrieve Shipment Information"
            })
        });
     })
    }

    getShipmentByUserShipmentId(userShippingId) {
        this.setState({ loadingshipment: true }, () => {
            this.shipmentsSrv.getShipmentByUserShipmentId(userShippingId)
                    .then((res) => {
                        return res.json()
                    }
                )
                .then((result) => {
                     if (result[0] && result.length > 0) {
                    //     this.setState({
                    //         loadingshipment: false,
                    //         shipments: [...this.state.shipments, result[0]],
                    //         shipmentError: (result[0] && result.length) > 0 ? false : true,
                    //         boxSN: '',
                            
                    //     })
                        var shipment = result[0];
                        if (shipment.status == CONST.PACKED){
                            shipment.status = CONST.PREPARED;
                            shipment.authorizationCode = this.state.SAN;  
                            shipment.destinationLocation = this.state.selectedLocation;
                            this.updateShipmentDisplayBySAN(shipment);
                            this.checkCartons();   
                        }else{
                            this.setState({
                                shipmentNumberOfProductsErrorMsg: 'Carton:' + shipment.userShipmentId + ' does not show a PACKED status.' +'\n Please notify the Packing Operator. Cartons cannot be PREPPED until they are PACKED.'
                            })
                        }
                       
                    } else {
                       //NO RESULT RETURNED

                    }

                },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        console.error(error);
                        this.setState({
                            loadingshipment: false,
                            error: error,
                            shipmentError:true,
                            shipmentErrorMsg: "FETCHING ERROR: Failed to Retrieve Shipment Information"
                        })

                    }
                ).catch( (reason)=> { 
                    this.setState({
                        loadingshipment: false,
                        error: reason,
                        shipmentError:true,
                        shipmentErrorMsg:"FETCHING ERROR: Failed to Retrieve Shipment Information"
                    })
                });
        })
    }

    displaySelectedStep(){
        if(this.state.activeStep === 0){
            return(<>
                    {this.selectSAN()}
                    </>)
        }if(this.state.activeStep ===1){
            return(<>
                {this.selectLocation()}
            </>
            )
        }
        if(this.state.activeStep === 2){
            
            return(<>
                    {this.selectCartons()}
                    </>)
        }if(this.state.activeStep === 3){
            return(<>
                    <>
                  <Col>Cartons Successfully Prepared.</Col>
                  <Row>
                        <Col className='next-button'>
                        <Button className="step-next-button show" variant="contained" onClick={this.reload}>Prepare Next</Button>
                        </Col>
                  </Row>
                </>
                    </>)
        }
        if(this.state.activeStep === 4){
            return(<>
                    <>
                    <Col>Error: Failed to Prepare Cartons, please try again!</Col>
                    <Row>
                            <Col className='next-button'>
                            <Button className="step-next-button show" variant="contained" onClick={this.reload}>Retry</Button>
                            </Col>
                    </Row>
                    </>
                    </>)
        }
    }

    handleNext(){
            if(this.state.activeStep === 0 && this.state.shipments.length > 0){
                //Trigger Modal
                this.setState({usedSANModal:true});
               
                
            }
            else{
                this.setState({activeStep: this.state.activeStep + 1}, ()=>{
                    if(this.state.activeStep === 2){
                        this.checkCartons();
                    }
                });
            }

    }
    handleNextSetLocation(){
        this.setState({activeStep: this.state.activeStep + 1,
            selectedLocation: this.state.shipments[0].destinationLocation
        });
    }


    handleBack(){
        if(this.state.activeStep !== 0){
            this.setState({activeStep: this.state.activeStep - 1});
        }
    }

    selectArticle(article){
        console.log(article);

    }

    handleSetSAN(SAN){
        this.setState({
            SAN:SAN
        }, ()=> this.getShipmentsBySAN())

        
    }

    selectLocation(){
        return(this.state.shipments.length === 0? 
                <>
           
                    <Row>
                       
                        <Col className='text-column'><div>Please Location for Shipment:</div></Col>
                        
                    </Row>
                    <Row>
                        
                  
                        <Col>
                            <Location auth={this.props.auth} locationSelect={this.handleLocationSelect} location={this.state.selectedLocation}></Location>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className='selected-SAN'>
                                SCANNED SAN:
                                {this.state.SAN}
                            </div> 
                        </Col>
                    </Row>
                    <Row>
                        
                    </Row>
                    <Row>
                    <Col className='next-button'>
                        {this.state.selectedLocation?
                    <Button className="update-button show" variant="contained" onClick={this.handleNext}>Next</Button>
                    : <Button className="update-button show" variant="contained" disabled> Next</Button>
                    }
                    <Button className="update-button show" variant="contained" onClick={this.handleBack}>Back</Button>

                    </Col>
                    </Row>
               
                </>:<><Row>
                        <Col>
                            <div className='selected-SAN'> Selected Location: {this.state.shipments[0].destinationLocation.name}</div>
                        </Col>
                </Row>
                <Row>
                        <Col>
                            <div className='selected-SAN'>
                                SCANNED SAN: {this.state.SAN}
                            </div> 
                        </Col>
                </Row>
                <Row>
                    <Col className='next-button'>
                        {true?
                    <Button className="update-button show" variant="contained" onClick={this.handleNextSetLocation}>Next</Button>
                    : <Button className="update-button show" variant="contained" disabled> Next</Button>
                    }
                    <Button className="update-button show" variant="contained" onClick={this.handleBack}>Back</Button>

                    </Col>
                    </Row>
                </>
        )

    }


    selectSAN(){
        return(
                <>
                    <Row>
                        <ConfirmationModal confirmation={this.state.usedSANModal} confirmationMessage={"Current Number of Cartons Associated with this SAN is " + this.state.shipments.length + ". Are you sure you wish to add more Cartons to the Prep list?"} toggleConfirmation={this.toggleSANModal} confirmationFunction={this.proceedSANModal}>  </ConfirmationModal>
                    </Row>
                    <Row>
                        <Col className='text-column'><div>Please Scan the Shipment SAN:</div></Col>
                        
                    </Row>
                    <Row>
                        
                        <Col>
                            {/* <Location auth={this.props.auth} locationSelect={this.handleLocationSelect} location={this.state.selectedLocation}></Location> */}
                            <SANScan auth={this.props.auth} selectArticle={this.selectArticle} setSAN={this.handleSetSAN}></SANScan>
                        </Col>
                        
                    </Row>
                    <Row>
                    <Col>
                    {this.state.SAN?
                            <div className='selected-SAN'>
                                SCANNED SAN:
                                {this.state.SAN}
                            </div>:null}
                    </Col>
                    </Row>
                    <Row>
                        <Col className='next-button'>
                            {this.state.SAN?
                        <Button className="update-button show" variant="contained" onClick={this.handleNext}>Next</Button>
                        : <Button className="update-button show" variant="contained" disabled> Next</Button>
                        }
                        </Col>
                    </Row>
                </>
        )

    }

    toggleConfirmation(){
        this.setState({confirmation:!this.state.confirmation})
    }

    toggleError(){
        this.setState({showError:false, errorMessage:''})
    }

   closePrepping() {
            this.setState({
                activeStep:3
        }); 
   }

 
   updateShipmentDisplayBySAN(shipment) {
  
    this.setState({ loadingshipment: true }, () => {
    this.shipmentsSrv.updateShipment(shipment)
            .then((res) => {
                return res.json()
            }
        )
        .then((result) => {
            if (result) {
                console.log('updated');
                this.getShipmentsBySAN();
                
            }
        }).catch( (error) => { // this context is not passed into the function
            this.setState({
                loadingshipment: false,
                updateError: "Failed to update shipment" + error.message
               
            });
        });
    })
}






    selectCartons(){
        let qrScanner = this.getQrScanner();
        let msg= "Are you sure you want to prepare " + this.state.shipments.length +  " carton(s) for shipping with the SAN:" + this.state.SAN + " to destination: " + this.state.selectedLocation.name + "?" ;
        return(
            <>
             {this.state.SAN?<>
                <Row>
                    <ConfirmationModal confirmation={this.state.confirmation} confirmationMessage={msg} toggleConfirmation={this.toggleConfirmation} confirmationFunction={this.closePrepping}> </ConfirmationModal>
                    <ErrorModal showError={this.state.showError} errorMessage={this.state.errorMsg} toggleError={this.toggleError}></ErrorModal>
                </Row>
                <Row>
                    <Col className="search" >
                   
                    <>
                    <div> 
                        Please Scan the Cartons you wish to Associate to the Shipment SAN:
                    </div>
                        <TextField className='search-field'
                        inputRef={this.cartonInput} 
                        error={this.state.shipmentError}
                        id="outlined-search"
                        type="search"
                        margin="normal"
                        variant="outlined"
                        value={this.state.boxSN}
                        onKeyDown={this.keyPressBoxSN} //Submit value once Enter is pressed
                        onChange={(e) => this.handleChangeBoxSN(e)}
                    />
                    

                    
                    </>
                   
                    </Col>
               
                    
                </Row> 
                </> :null}
                <Row className='scan-button'>
                    <Col>
                    { this.state.showQrScan ?
                    <Button className="qr-button" variant="contained" onClick={()=>{this.enterCarton(this.state.boxSN)}}  type="button">
                        Enter
                    </Button>
                    :
                        <Button className="qr-button" variant="contained" onClick={this.handleQrScanToggle}  type="button">
                            Scan QR Code
                        </Button>
                     }

                    </Col>
                </Row>
                <Row >
                    <Col className='qr'>
                            {qrScanner}
                    </Col>
                </Row>
                <Row><ErrorMessage show={this.state.shipmentError} errorMessage={this.state.shipmentErrorMsg}></ErrorMessage></Row>
                <Row className="summary">
                    <Col><div className='selected-SAN'>
                                SCANNED SAN:
                                {this.state.SAN}
                            </div> </Col>
                </Row>
                <Row className="summary">
                    <Col>Location: {this.state.selectedLocation.name} </Col>
                </Row>
                <Row className="summary">
                    <Col>Cartons: {this.state.shipments.length} </Col>
                </Row>
                <Row className="summary">
      
                    <Col>Total # of Locks: {" "+ this.state.productCount} </Col>
              
                </Row>
                <Row>
                    {this.displayShipping()}
                </Row> 
                <Row>
                    <Col className='next-button'>
                        {this.state.shipments.length !== 0 && this.state.shipmentNumberOfProductsErrorMsg ==""?
                        <Button className="update-button complete" variant="contained" onClick={this.toggleConfirmation}><DoneIcon/>Complete</Button>
                        :
                        <Button className="update-button show" variant="contained" disabled><DoneIcon/>Complete</Button>
                        }

                        <Button className="update-button show" variant="contained" onClick={this.handleBack}>Back</Button></Col>
                </Row>
            </>
        )

    }



    handleScanError(err){
        this.setState({
            shipmentError: true,
            shipmentErrorMsg:err
        })
    }


    getQrScanner()
    {
        let showQrScanner = this.state.showQrScan;

        let qrScanner = <div></div>;
        if (showQrScanner) {
            qrScanner =
                <div className={this.state.green?"qr-container green":"qr-container"}>
                    <IconButton className="close"   onClick={this.handleQrScanToggle}>
                        <CloseIcon />
                    </IconButton>
                    <QrReader
                        delay={300}
                        onError={this.handleScanError}
                        onScan={this.handleScan}
                        style={{ width: '100%' , maxWidth:'200px', margin:'auto'}}
                    />
                </div>
        }
        return qrScanner;
    }

    handleScan(data) {
        if (data && data !== '') {            
            this.setState({boxSN:data, green:true}, ()=>{
               // this.enterCarton(this.state.boxSN); 
            });
        }
    }

    handleQrScanToggle() {
        let show = !this.state.showQrScan;
        this.setState({ showQrScan: show ,green:false });
    }

    render() {
        return (
            
            <Container className='ship-container'>
                <Row>
                    <Col className='header' >Prepping </Col>
                </Row>
                 <Stepper activeStep={this.state.activeStep}>
                 {steps.map((label) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                                <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                 </Stepper>
                 {this.displaySelectedStep()}
               
               

            </Container>
        )
    }

    
    displayShipping() {
        if (this.state.shipments.length > 0) {
            return (
                <div>
                    <table className='carton-table'>
                        <thead>
                            <tr>
                                <th>
                                    Carton ID
                                </th>
                                
                                <th>
                                    Status 
                                </th>
                                <th>
                                    Number of Locks
                                </th>
                                <th>
                                    Remove
                                </th>
                            </tr>
                        </thead>
                        <tbody >
                            {this.displayCartons()}
                        </tbody>
                    </table>
                    <ErrorMessage show={this.state.shipmentNumberOfProductsErrorMsg !==''} errorMessage={this.state.shipmentNumberOfProductsErrorMsg}></ErrorMessage>
                </div>
            )
        }
    }

    displayCartons(){
        return this.state.shipments.map(( shipment) => {  
       
            
            return(<tr  key={shipment.id}>
                                    <td>{shipment.userShipmentId}</td>
                                    <td>{shipment.status}</td>
                                    <td>{shipment.products.length}</td>
                                    <td>
                                        <IconButton aria-label="delete" onClick={(e) => this.handleShippingDeselect(shipment.userShipmentId)} >
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                            </tr>)}
                            );

    }

    handleShippingSelect() {
        this.setState({
            showShipment: !this.state.showShipment
        });
    }

    handleShippingDeselect(userShipmentId){
        var shipments = [];
        shipments = this.state.shipments.filter((shipment) => shipment.userShipmentId === userShipmentId)
        var shipment = shipments[0];
        shipment.status = CONST.PACKED;
        shipment.authorizationCode =null;
        shipment.destinationLocation = null;
        this.updateShipmentDisplayBySAN(shipment);

        // shipments = this.state.shipments.filter((shipment) => shipment.userShipmentId !== userShipmentId)
        // this.setState({
        //     shipments: shipments
        // }, ()=> this.checkCartons());

    }

    checkCartons(){
        this.setState({
            shipmentNumberOfProductsErrorMsg:""
        })
        // get sum of msgCount prop across all objects in array
        var locksTotal = this.state.shipments.reduce(function(prev, cur) {
            return prev + cur.products.length;
        }, 0);
        this.setState({productCount:locksTotal});
        // this.setState({productCount: 0})
        this.state.shipments.forEach((shipment) => {
            //this.setState({productCount: this.state.productCount + shipment.products.length})
            if(shipment.products.length == 0){
                this.setState({
                    shipmentNumberOfProductsErrorMsg:"Number of Products Can't be 0 for Carton:" + shipment.userShipmentId + ". Please Remove and Pack Again Before Preparing."
                })
            }if(shipment.status !== CONST.PACKED && shipment.status !== CONST.PREPARED){
                this.setState({
                    shipmentNumberOfProductsErrorMsg: 'Carton:' + shipment.userShipmentId + ' does not show a PACKED status.' +'\n Please notify the Packing Operator. Cartons cannot be PREPPED until they are PACKED.'
                })
            }
            if(shipment.status === CONST.PACKED ){
                this.setState({
                    shipmentNumberOfProductsErrorMsg: 'Carton:' + shipment.userShipmentId + ' is set to a PACKED status.' +'\n Remove and Scan again to set to Prepped.'
                })
            }
        })
        
    }

}

//type checking
PreShipping.propTypes = {
    auth: PropTypes.object
};



export default PreShipping;