// import React from "react";
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Container from 'react-bootstrap/Container';
// import TextField from '@material-ui/core/TextField';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import './shipping.scss';
// import Button from '@material-ui/core/Button';
// import AttachmentIcon from '@material-ui/icons/Attachment';
// import UploadIcon from '@material-ui/icons/CloudUpload';
// import CloseIcon from '@material-ui/icons/Close';
// import CancelIcon from '@material-ui/icons/Cancel';
// import ReturnsSrv from "../../services/returns_srv";
// import PropTypes from "prop-types";
// import moment from 'moment'






// class FlowPointForm extends React.Component{

//     returnsSrv;

//     constructor(props){
//         super(props);
        
//             this.state = {
//                 flowpoint:''

//             };

//     }


//     render(){
//                 return (
//                     <Container className='psr-container'>
//                         <Row>
//                             <Col className='header'>Station Results </Col>
//                         </Row>
//                         <Row>
//                         <div className='search'>
//                             <TextField
//                                 className= "search-field"
//                                 label= "Enter Station #"
//                                 id= "outlined-search"
//                                 type= "search"
//                                 margin= "normal"
//                                 variant= "outlined"
//                                 onClick ={(e)=>{this.handleEnterFlowPoint(e)}}
//                                 onKeyDown={this.keyPressFlowPoint}
//                            />

                            
//                             </div>
//                         </Row>  
//                         <Row className="time">
//                              <Col>Oct 15, 2019 9:00am</Col>
//                              <Col>to</Col>
//                              <Col>5:30pm Oct 15, 2019</Col>
//                         </Row>
//                         <Row>
//                         <Col  className='cart' xs={12} lg={6}>
//                             <TextField
//                                     className= "search-field"
//                                     label= "Pass Total"
//                                     id= "outlined-search"
//                                     type= "search"
//                                     margin= "normal"
//                                     variant= "outlined"
//                                     onClick ={(e)=>{this.handleEnterFlowPoint(e)}}
//                                     onKeyDown={this.keyPressFlowPoint}
//                                 />
//                         </Col>
//                         <Col className='prods' xs={12} lg={6}>
//                         <TextField
//                                     className= "search-field"
//                                     label= "Fail Total"
//                                     id= "outlined-search"
//                                     type= "search"
//                                     margin= "normal"
//                                     variant= "outlined"
//                                     onClick ={(e)=>{this.handleEnterFlowPoint(e)}}
//                                     onKeyDown={this.keyPressFlowPoint}
//                                 />
//                         </Col>
//                         </Row>
//                         <Row>
//                             <Col><Button className="update-button show">Save</Button></Col>
//                         </Row>
//                     </Container>
//                     );
//             }
  
//             handleEnterFlowPoint(event){
//                 this.setState({ flowpoint: event.target.value });
//             }

//             keyPressFlowPoint(){
                
//             }
// }
//     FlowPointForm.propTypes = {
//         auth: PropTypes.object
//     };

// export default FlowPointForm;