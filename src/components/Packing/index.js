import React from "react";
import PropTypes from "prop-types";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ProductsSrv from "../../services/products_srv";
import ShipmentsSrv from "../../services/shipments_srv";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import './packing.scss';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/RemoveCircle';
import moment from 'moment';
import carton from '../../assets/images/carton.png';
import lock from '../../assets/images/lock.png';
import Parser from '../Shared/Parser';

import {CR} from '../Shared/constants/KeyCodes';
import {PACKED} from '../Shared/constants/ShipmentStatus';

import ErrorMessage from '../Shared/components/ErrorMessage';
import SpinLoader from '../Shared/components/Loaders/SpinLoader';
import WarningModal from '../Shared/components/WarningModal';
import ConfirmationModal from '../Shared/components/ConfirmationModal';
import ErrorModal from '../Shared/components/ErrorModal';
import UnarchiveIcon from '@material-ui/icons/Unarchive';


class Packing extends React.Component {
    productsSrv;
    shipmentsSrv;

    constructor(props) {
        super(props);
        this.cartonInput = React.createRef();
        this.articleInput = React.createRef();

        this.state = {
            loadingshipment: false,
            loadingproduct: false,
            shipment: null,
            error: null,
            shipmentError: false,
            shipmentErrorMsg:'',
            productError: false,
            productErrorMsg:'',
            boxSN: '',
            productSN: '',
            showShipment: false,
            showUpdateButton: false,
            warning: false,
            warningMsg:'',
            confirmation:false,
            showError:false,
            errorMsg:'',
            emptyconfirmation:false
        };
        this.shipmentsSrv = new ShipmentsSrv(this.props.auth);
        this.productSrv = new ProductsSrv(this.props.auth);
        this.keyPressBoxSN = this.keyPressBoxSN.bind(this);
        this.keyPressProductSN = this.keyPressProductSN.bind(this);
        this.displayArticles = this.displayArticles.bind(this);
        this.updateShipment = this.updateShipment.bind(this);
        this.updateShipmentClose = this.updateShipmentClose.bind(this);
        this.updateShipmentEmpty = this.updateShipmentEmpty.bind(this);
        this.closeCarton = this.closeCarton.bind(this);
        this.toggleWarning =  this.toggleWarning.bind(this);
        this.toggleConfirmation= this.toggleConfirmation.bind(this);
        this.toggleEmptyConfirmation= this.toggleEmptyConfirmation.bind(this);
        this.toggleError =  this.toggleError.bind(this);
        
    }
    componentDidMount(){
        if(this.cartonInput.current){
            this.cartonInput.current.focus();
        }
        this.checkPackingURL();
     }

    checkPackingURL(){
        var cartonID = Parser.getIDFromURL(window.location.href);
        if(cartonID){
            this.getShipmentByUserShipmentId(cartonID);
        }
    }

    toggleError(){
        this.setState({showError:false, errorMsg:''});
    }

    toggleWarning(){
        this.setState({warning:false, warningMsg:''});
    }

    toggleConfirmation(){
        this.setState({confirmation:!this.state.confirmation})
    }

    toggleEmptyConfirmation(){
        this.setState({emptyconfirmation:!this.state.emptyconfirmation})
    }

    render() {
        return (
            
            <Container className='packing-container'>
                <Row>
                    <ConfirmationModal confirmation={this.state.confirmation} confirmationMessage="Are you sure you want to close? Carton is not fully packed." toggleConfirmation={this.toggleConfirmation} confirmationFunction={this.updateShipmentClose}>  </ConfirmationModal>
                    <ConfirmationModal confirmation={this.state.emptyconfirmation} confirmationMessage="Are you sure you want to remove all articles from this carton?" toggleConfirmation={this.toggleEmptyConfirmation} confirmationFunction={this.updateShipmentEmpty}>  </ConfirmationModal>

                    <WarningModal warning={this.state.warning} warningMessage={this.state.warningMsg} toggleWarning={this.toggleWarning}></WarningModal>
                    <ErrorModal showError={this.state.showError} errorMessage={this.state.errorMsg} toggleError={this.toggleError}></ErrorModal>
                </Row>
                <Row>
                    <Col className='header' >Packing </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={6}>
                        <Row ><div className='text'>Please Scan the Carton Tag:</div></Row>
                        <Row>
                            <div className='search carton'>
                            <TextField className='search-field'
                                inputRef={this.cartonInput} 
                                error={this.state.shipmentError}
                                id="outlined-search"
                                label={!this.state.shipmentError ? "Carton Tag" : " ERROR" }
                                type="search"
                                margin="normal"
                                variant="outlined"
                                value={this.state.boxSN}
                                onKeyDown={this.keyPressBoxSN}
                                onChange={(e) => this.handleChangeBoxSN(e)}
                            />
                            <div className='image'>
                                <img className='carton-image' src={carton} width="110" alt="carton" ></img>
                            </div>
                            </div>
                        </Row>          
                        <Row><ErrorMessage show={this.state.shipmentError} errorMessage={this.state.shipmentErrorMsg}></ErrorMessage></Row>
                        
                    </Col>
                   
                    {this.state.loadingshipment ? <Row> <Col><SpinLoader/></Col></Row> :
                        <Col className={!(this.state.shipment && this.state.shipment.userShipmentId) ? "shipping-panel" : "shipping-panel show "} xs={12} lg={6}>
                            <Row ><div className='text'>Please Scan the Lock ID :</div></Row>
                            <Row>
                                <div className='search article'>
                                <TextField className='search-field'
                                    inputRef={this.articleInput} 
                                    error={this.state.productError}
                                    id="outlined-search"
                                    label={!this.state.productError ? "Lock ID" : "INVALID"}
                                    type="search"
                                    margin="normal"
                                    variant="outlined"
                                    value={this.state.productSN}
                                    onKeyDown={this.keyPressProductSN}
                                    onChange={(e) => this.handleChangeProductSN(e)}
                                />
                                <div className='image'>
                                <img className='lock-image' src={lock} width="55" alt="lock" ></img>
                                </div>
                                </div>
                            </Row>
                            <Row><ErrorMessage show={this.state.productError} errorMessage={this.state.productErrorMsg}></ErrorMessage></Row>
                           
                            
                        </Col>}
                </Row>

                <div className={!(this.state.shipment && this.state.shipment.userShipmentId)? "shipping-panel" : "shipping-panel show"}>
                    <Row>
                        <Col className='cart' xs={12} lg={6}> 
                        {this.state.shipment?
                    <div className='carton-status'>Status: {this.state.shipment.status?this.state.shipment.status:"None"} </div>:null}
                         {this.displayShipping()}

                        </Col>
                        <Col className='prods' xs={12} lg={6}>
                            {this.state.loadingproduct ? <Row><Col><SpinLoader/></Col></Row> :
                                <div>
                                    <div className="product-container">
                                    {(this.state.shipment && this.state.shipment.userShipmentId)?
                            <Row> { this.state.shipment && this.state.shipment.products && this.state.shipment.products.length?
                                        <div className='article-count'> Lock Count: {this.state.shipment.products.length} </div> :null}
                                        <Button className="remove-button" variant="contained" onClick={this.toggleEmptyConfirmation}> Remove All  
                                        <DeleteIcon />
                                    </Button></Row>:null}
                                        {/* { this.state.shipment && this.state.shipment.products && this.state.shipment.products.length?
                                        <div className='article-count'>Count: {this.state.shipment.products.length} </div> :null} */}
                                        <table className='article-table'>
                                            <thead>
                                                <tr>
                                                    <th>Lock Name</th><th>Lock ID</th><th>Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.displayArticles()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            }
                        </Col>
                    </Row>
                    <Row>
                        {this.displayUpdateButton()}
                    </Row>
                </div>

            </Container>
        )
    }
    displayUpdateButton() {
        if (this.state.shipment && this.state.shipment.products && this.state.shipment.products.length > 0 && this.state.shipment.products[0] !== undefined ) {
            return (
                <Col className='button-column'><Button className="update-button show" variant="contained" onClick={this.closeCarton}>Finish Packing</Button></Col>
            )
        }
        else {
            return (
                <Col className='button-column'  ><Button className="update-button" variant="contained"  disabled>Finish Packing</Button></Col>
            )
        }
    }

    displayArticles() {
        if (this.state.shipment && this.state.shipment.products && this.state.shipment.products.length > 0 && this.state.shipment.products[0] !== undefined) {
            return this.state.shipment.products.map((product, index) => {
                return (
                    <tr key={product.userProductId}>
                        <td>{product.productType.name}</td>
                        <td>{product.userProductId}</td>
                        <td>
                            <IconButton aria-label="delete" onClick={(e) => this.handleChipDelete(product.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </td>
                    </tr>
                )

            });
        }
    }

    displayShipping() {
        if (this.state.shipment) {
            return (
                <div>
                    <table className='carton-table'>
                        <thead>
                            <tr>
                                <th>
                                    Carton ID
                            </th>
                                <th>
                                    Date Created
                            </th>
                                <th>
                                    Date Modified
                            </th>
                                <th>
                                    Remove
                            </th>
                            </tr>
                        </thead>
                        <tbody >
                            <tr>
                                <td>{this.state.shipment.userShipmentId}</td>
                                <td>{moment(this.state.shipment.dateCreated).format("MMM Do YYYY")}</td>
                                <td>{moment(this.state.shipment.dateModified).format("MMM Do YYYY")}</td>
                                <td>
                                    <IconButton aria-label="delete" onClick={(e) => this.handleShippingDeselect()} >
                                        <DeleteIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            )
        }
    }

    handleShippingSelect() {
        this.setState({
            showShipment: !this.state.showShipment
        });
    }

    handleShippingDeselect() {
        this.setState({
            shipment: null,
            error: null,
            shipmentError: false,
            boxSN: '',

        });
    }

    handleChipDelete(productid) {
        var shipment = { ...this.state.shipment }
        shipment.products = this.state.shipment.products.filter((product) => product.id !== productid)
        this.setState({
            shipment: shipment,
            showUpdateButton: true
        }, () => this.updateShipment());
    }

    handleChangeBoxSN(event) {
        this.setState({ boxSN: event.target.value });
    }

    keyPressBoxSN(e) {
        if (e.key === CR) {
            this.setState({shipmentError:false, shipmentErrorMsg: ''});
            if(Parser.validURL(e.target.value)){ 
                //Check valid URL entry to see if it is a QR61URL and Parse accordingly
                
                    //extract the cartonID and search/create carton
                    var cartonId = Parser.getID(e.target.value); //returns empty string if there isn't an ID where its expected
                    if(isNaN(cartonId)){
                        this.setState({shipmentError:true});
                        this.setState({shipmentErrorMsg:"INVALID ENTRY:  CARTON URL format INVALID"});
                    }else{ //Only accept Valid Number
                        this.getShipmentByUserShipmentId(cartonId);
                    }
            }else{ 
          
                // Check NON-URL entry to see if it is a valid ID entry, if so search and create/load Carton
                if(Parser.validAlphaNumID(e.target.value)){
                    this.getShipmentByUserShipmentId(e.target.value);
                }
                else{
                    this.setState({shipmentError:true});
                    this.setState({shipmentErrorMsg:"INVALID ENTRY: contains non-alphanumeric characters"});
                }
            }
            
        }
    }

    keyPressProductSN(e) {
        if (e.key === CR) {
            if(this.state.shipment.products.length > 23){
                this.setState({showError:true,
                    errorMsg:'Maximum Capacity: Carton can NOT exceed Limit of 24 Locks'
                })
            }else{
                this.setState({productError:false, productErrorMsg: ''});
                if(Parser.validURL(e.target.value)){ 
                    //Check valid URL entry to see if it is a Sera4URL and Parse accordingly
                        var articleId = Parser.getSeraID(e.target.value);
                        if(isNaN(articleId)){
                            articleId = Parser.getID(e.target.value);   
                        }
                        var hexId = Parser.decimalTohex(parseInt(articleId));
                        this.getProductByUserProductId(hexId);
                }else{
                    // Check NON-URL entry to see if it is a valid ID entry, if so search and get Article
                    if(Parser.validAlphaNumID(e.target.value)){
                        this.getProductByUserProductId(e.target.value);
                    }
                    else{
                        this.setState({productError:true});
                        this.setState({productErrorMsg:"INVALID ENTRY: contains non-alphanumeric characters"});
                    }
                }
            }
        }
    }

    handleChangeProductSN(event) {
        this.setState({ productSN: event.target.value });
    }

    addProduct(product) {
        if (product) {
            //Check Product isn't in another Carton
            this.productNotInCarton(product);
        }
    }

    

     productNotInCarton(product){
        this.shipmentsSrv.getShipmentByUserProductId(product.userProductId).then((res)=>{
            return res.json()
        }).then((result)=>{ 
            if(result.length > 0){
                this.setState({
                    showError:true,
                    errorMsg:"Lock already exist in Carton " + result[0].userShipmentId,
                    loadingproduct: false,
                })
                return(true);
            }   
            else{
                //Check the product isn't alreadys scanned / no duplicates.
                this.checkArticleScanned(product);
            } 
    },(error)=>{
        this.setState({
            loadingproduct: false,
            error: error,
            return: null,
            productError:true,
            productErrorMsg: "FETCHING ERROR: Failed to Retrieve Product Information"

        });
    } ).catch((reason) =>{ // this context is not passed into the function
        this.setState({
            loadingproduct: false,
            error: reason,
            return: null,
            productError:true,
            productErrorMsg: "FETCHING ERROR: Failed to Retrieve Product Information"

        });
    });
}
       
checkArticleScanned(product){
    let index = this.state.shipment.products.findIndex(prod => prod.id === product.id);
    //If the article isn't already scanned than add it to the list
    if (index === -1) {
        var shipment = { ...this.state.shipment }
        shipment.products = [...this.state.shipment.products, product]
        this.setState({
            shipment: shipment,
            showUpdateButton: true
        }, ()=> this.updateShipment());
    }else{
        this.setState({
            showError:true,
            errorMsg:'Article with this ID was already added.'
        })
    }
}

    getProductByUserProductId(userProductId) {
        this.setState({ loadingproduct: true }, () => {
            this.productSrv.getByUserProductId(userProductId)
                .then((res) => {
                    return res.json()
                }
                )
                .then((result) => {
                    if (result) {
                        this.setState({
                            loadingproduct: false,
                            product: result[0],
                            producterror: result[0] ? false : true,
                            productSN: '',
                        }, () => { this.addProduct(this.state.product) });
                    }
                },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        console.error(error);
                        this.setState({
                            loadingproduct: false,
                            error: error,
                            return: null,
                            productError:true,
                            productErrorMsg: "FETCHING ERROR: Failed to Retrieve Product Information"

                        });
                    }
                ).catch((reason) =>{ // this context is not passed into the function
                    this.setState({
                        loadingproduct: false,
                        error: reason,
                        return: null,
                        productError:true,
                        productErrorMsg: "FETCHING ERROR: Failed to Retrieve Product Information"

                    });
                });
        })

    }

    // getAllShipping() {
    //     this.shipmentsSrv.getAll()
    //             .then((res) => {
    //                 return res.json()
    //             }
    //         )
    //             .then((result) => {
    //                 if (result) {
    //                     console.log(result);
    //                 }
    //             },
    //             // Note: it's important to handle errors here
    //             // instead of a catch() block so that we don't swallow
    //             // exceptions from actual bugs in components.
    //             (error) => {
    //                 console.error(error);

    //             }
    //         ).catch((reason) =>{ // this context is not passed into the function

    //         });

    // }

    closeCarton(){
        if(this.state.shipment.products.length < 24){
            this.setState({confirmation:true})
        }
        else{
            this.updateShipmentClose();
            
        }
    }

    updateShipment() {
        this.setState({ loadingshipment: true }, () => {
        this.shipmentsSrv.updateShipment(this.state.shipment)
                .then((res) => {
                    return res.json()
                }
            )
            .then((result) => {
                if (result) {
                    console.log("update");
                    this.setState({loadingshipment:false});
                    if (result[0] && result.length > 0) {
                        this.setState({
                            shipment: result[0],
                            shipmentError: (result[0] && result.length) > 0 ? false : true,
                            boxSN: '',
                            showUpdateButton: false
                        })
                    }
                }
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        selectedFile: null,
                        loadingshipment: false,
                        shipment: [],
                        error: error,
                        shipmentError:true,
                        shipmentErrorMsg:"UPDATE ERROR: FAILED TO UPDATE SHIPMENT"
                    })

                }
            ).catch( (reason) => { // this context is not passed into the function
                this.setState({
                    selectedFile: null,
                    loadingshipment: false,
                    shipment: [],
                    error: reason,
                    shipmentError:true,
                    shipmentErrorMsg:"UPDATE ERROR: FAILED TO UPDATE SHIPMENT"
                })
            });
        })
    }

    updateShipmentClose() {
        var shipment = { ...this.state.shipment, status:PACKED};
        this.setState({shipment:shipment}, ()=>{
            this.shipmentsSrv.updateShipment(this.state.shipment)
                .then((res) => {
                    return res.json()
                }
            )
            .then((result) => {
                if (result) {
                    console.log('updated');
                    this.setState({
                        showUpdateButton: false,
                        shipment:null
                    });
                }
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        error: error,
                        selectedFile: null,
                        shipmentError:true,
                        shipmentErrorMsg:"UPDATE ERROR: FAILED TO UPDATE SHIPMENT"
                    });

                }
            ).catch( (reason) => { // this context is not passed into the function
                this.setState({
                    error: reason,
                    selectedFile: null,
                    shipmentError:true,
                    shipmentErrorMsg:"UPDATE ERROR: FAILED TO UPDATE SHIPMENT"
                });
            });

        })
    }

    updateShipmentEmpty() {
        var shipment = { ...this.state.shipment, products:[]};

             this.setState({shipment:shipment, loadingshipment: true }, ()=>{
                this.shipmentsSrv.updateShipment(this.state.shipment)
                    .then((res) => {
                        return res.json()
                    }
                )
                .then((result) => {
                    if (result) {
                        console.log('update empty');
                        this.setState({
                            loadingshipment: false,
                            shipment: result, // note its not result[0] due to it being PUT?
                            shipmentError: false,
                            boxSN: '',
                            showUpdateButton: false
                        })
                    }
                },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        this.setState({
                            selectedFile: null,
                            loadingshipment: false,
                            shipment: [],
                            error: error,
                            shipmentError:true,
                            shipmentErrorMsg:"UPDATE ERROR: FAILED TO UPDATE SHIPMENT"
                        })

                    }
                ).catch( (reason) => { // this context is not passed into the function
                    this.setState({
                        selectedFile: null,
                        loadingshipment: false,
                        shipment: [],
                        error: reason,
                        shipmentError:true,
                        shipmentErrorMsg:"UPDATE ERROR: FAILED TO UPDATE SHIPMENT"
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
                        this.setState({
                            loadingshipment: false,
                            shipment: result[0],
                            shipmentError: false,
                            boxSN: '',
                            showUpdateButton: false
                        })
                        this.articleInput.current.focus();
                    } else {
                        this.addCarton(userShippingId);

                    }

                },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        console.error(error);
                        this.setState({
                            loadingshipment: false,
                            shipment: [],
                            error: error,
                            shipmentError:true,
                            shipmentErrorMsg: "FETCHING ERROR: Failed to Retrieve Shipment Information"
                        })

                    }
                ).catch( (reason)=> { 
                    this.setState({
                        loadingshipment: false,
                        shipment: [],
                        error: reason,
                        shipmentError:true,
                        shipmentErrorMsg:"FETCHING ERROR: Failed to Retrieve Shipment Information"
                    })
                });
        })
    }

    addCarton(id) {
        console.log('adding carton...');
        var carton = {
            userShipmentId: id,
            products: []
        }
        this.shipmentsSrv.createShipment(carton)
            .then((res) => {
                return res.json()
            }
            )
            .then((result) => {
                if (result) {
                    //Reset File Selection Button

                    this.getShipmentByUserShipmentId(id);
                    this.cartonInput.current.focus();
                }
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.error(error);
                    this.setState({
                        error: error,
                        selectedFile: null
                    });

                }
            ).catch( (reason) => { // this context is not passed into the function
                this.setState({
                    error: reason,
                    selectedFile: null
                });
            });
    }


}



//type checking
Packing.propTypes = {
    auth: PropTypes.object
};

export default Packing;