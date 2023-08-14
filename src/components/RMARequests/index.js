import React, { useState, useEffect } from 'react';
import './rmaRequests.scss';
import Container from 'react-bootstrap/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArticleScan from './ArticleScan';
import Button from "@material-ui/core/Button";
import SymptomSelector from './SymptomSelector';
import SymptomSuggester from './SymptomSuggester';
import PhotoIcon from '@material-ui/icons/AddAPhoto';
import AttachIcon from '@material-ui/icons/AttachFile';
import ImageList from './ImageList';
import ImagePreview from './Photo/ImagePreview';
import Photo from './Photo';
import ErrorMessage from '../Shared/components/ErrorMessage';
import ReturnsSrv from '../../services/returns_srv';
import ExternalCode from './ExternalCode';
import SymptomMultiSelector from "./SymptomMultiSelector";

function getSteps() {
    return ['Scan Article', 'Describe Symptoms', 'Submit Request'];
    
  }
const steps = getSteps();

function Request(props) {
    
    const [activeStep, setStep] = useState(0);
    const [article, setArticle] = useState(null);
    const [mainIssue, setMainIssue] = useState(null);
    const [faultIndicationArray, setfaultIndicationArray] = useState([]);
    const [photo, showPhoto] = useState(false);
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState(null);
    const [error, setError ] = useState('');
    const [savedRma, setSavedRMA] = useState(null);

    const [suggestMain, setSuggestMain] = useState(false);
    const [suggestSecondary, setSuggestSecondary]=  useState(false);
    const [suggestedMain, setSuggestedMain] = useState("");
    const [suggestedSecondary, setSuggestedSecondary] = useState("");
    const [validSuggestion, setValidSuggestion] = useState(true);
    const [faultIndicationObjs, setfaultIndicationObjs] = useState([]);
    const [submitReturn, setSubmitReturn]= useState(false);
    const [externalCode, setExternalCode]= useState("");

    const returnsSrv = new ReturnsSrv(props.auth);

    // UseEffect used to attach Files once the RMA is saved
    useEffect(()=>{
        const returnsSrv = new ReturnsSrv(props.auth);
        const attachFileSet = () =>{
            if(savedRma && savedRma.id){
                images.map(image => attachFile(image))
                setStep(activeStep + 1);        
            }else{
                //unable to retrieve RMA, images not attached
            }
            setSavedRMA(null);
        }
        const attachFile = (image) =>{
            if (image  && image.data){
    
                var imageBlob = dataURItoBlob(image.data);
                
                    returnsSrv.addFile(savedRma.id, imageBlob)
                            .then((res) => {
                                if (res.status === 201) {
                                    console.log("201 Created");
                                    return res.json();
                                }
                                else {
                                throw Error(res.statusText);
                                }
                            })
                            .catch(function (error) {
                            console.log(error);
                            setError("Failed to add Image File:" + error.message);
                            });
                    
                }
        }
        attachFileSet();
    }, [savedRma, props.auth, activeStep, images])




    const reset = ()=> {
        setStep(0);
        setArticle(null);
        setMainIssue(null);
        setfaultIndicationArray([]);
        showPhoto(false);
        setImages([]);
        setPreview(null);
        setError('');
        setSavedRMA(null);
  
        setSuggestMain(false);
        setSuggestSecondary(false);
        setSuggestedMain("");
        setSuggestedSecondary("");
        setValidSuggestion(true);
        setfaultIndicationObjs([]);
        setSubmitReturn(false);
        setExternalCode("");
    }
    


    function dataURItoBlob (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
  
        return new Blob([ia], {type:mimeString});
      }

    const selectArticle = (article) => {
        setArticle(article);
      }

    const validateSuggested = () =>{
        var allowNext = true;
        setValidSuggestion(true);
        if(suggestMain && suggestedMain == ""){
            setValidSuggestion(false);
            allowNext = false;
        }

        if(suggestSecondary && suggestedSecondary ==""){
            setValidSuggestion(false);
            allowNext = false;
        }

       if(allowNext){
        nextStep();
       }


    }

    const nextStep = () =>{
        setStep(activeStep + 1);
    }
    const backStep = () =>{
        setStep(activeStep - 1);
    }
    const takePic = () =>{
        showPhoto(!photo);
    } 

    const submit = () =>{
        if(suggestMain){
             //create Suggested Issue
            createSuggestedIssue(suggestedMain, "MainIssue", article.productType.id, article.productType.name);
        }if(suggestSecondary){
            //create Suggested Issue
            createSuggestedIssue(suggestedSecondary, "FaultIndication", article.productType.id, article.productType.name);
        }
        setSubmitReturn(true);
    }

    useEffect(()=>{
        const returnsSrv = new ReturnsSrv(props.auth);

        const createReturn = (returnObject) =>{
            setError('');
            returnsSrv.add(returnObject)
                    .then((res) => {
                        if (res.status === 201) {
                            console.log("201 Created");
                            return res.json();
                        }
                        else {
                          throw Error(res.statusText);
                        }
                    }).then((result) => {
                             setSavedRMA(result);
                        })
                    .catch(function (error) {
                      console.log(error);
                      setError("Failed to Create Return:" + error.message);
                    });
            setSubmitReturn(false);
        }
        if(submitReturn && !suggestMain && !suggestSecondary){
            var Return = {};
            Return.product = article;
            Return.information = [];
                //handle Return Information
                Return.information.push(mainIssue);
                faultIndicationObjs.forEach(element => {
                    Return.information.push(element);
                });
                // if(faultIndicationArray){
                //     Return.information.push(faultIndicationArray);
                // }
            Return.disposition = 'New';
            Return.status = 'RequestReceived';
            if(externalCode !==""){
                Return.externalCode = externalCode;
            }else{
                Return.externalCode = null;
            }
            createReturn(Return);
        }
    })

    const createSuggestedIssue = (propertyDescription, menuType, productTypeId, productTypeName) =>{
        returnsSrv.createReturnsInformation(propertyDescription ,menuType, productTypeId, productTypeName, true).then((res) => {
            if (res.status === 201) {
                console.log("201 Created");
                return res.json();
            }
            else {
              throw Error(res.statusText);
            }
        }).then((result) => {
            if(menuType === "MainIssue"){
                setMainIssue(result);
                setSuggestMain(false);
            }
            if(menuType === "FaultIndication"){
                var newArr = faultIndicationObjs;
                newArr.push(result);
                setfaultIndicationObjs(newArr);
                setSuggestSecondary(false);
            }
            })
        .catch(function (error) {
          console.log(error);
          setError("Failed to Create ReturnInformation:" + error.message);
        });
    }


    const handleAddPhoto = (photo)=>{
        if (images.length < 5){
            const newImage = { 
                            id: images.length.toString(),
                            data: photo
                            };
            const newImages =[...images, newImage];
            setImages(newImages);
        }
    }

    const handleDeletePhoto = (id) => {
        const newImages = images.filter(image => image.id !== id);
            newImages.forEach( image => {if (image.id >= id){
                (parseInt(image.id)-1).toString()
            }})
        setPreview(null);
        setImages(newImages);
    };

    const handlePreview = (id) =>{
        setPreview(id);
    }
    const displaySelectedStep = ()=> {
        if(activeStep === 0){
            return(<>
                    <div>
                        <ArticleScan auth={props.auth} selectArticle={selectArticle}/>
                    </div>
                    {article?
                        <div className="article-info">
                            {article.productType.name}:{article.userProductId}
                        </div>
                    :null}
                    <Row>
                        <Col className='next-button'>
                            {article?
                        <Button className="update-button show" variant="contained" onClick={nextStep}>Next</Button>
                        : <Button className="update-button" variant="contained" disabled> Next</Button>
                        }
                        </Col>
                    </Row>
                </>)
        }if(activeStep ===1){
            return(
                <>
                  {article?
                        <div className="article-info">
                            {article.productType.name}:{article.userProductId}
                        </div>
                    :null}
                    <div className="symptom-header"> Please Select the Main Issue :</div>
                    <SymptomSelector auth={props.auth} infoType="MainIssue" productType={article.productType} setSelectedInfo={setMainIssue} selectedInfo={mainIssue} suggest={suggestMain} setSuggest={setSuggestMain}></SymptomSelector>
                    {mainIssue ==="new"?<SymptomSuggester type="Main Issue"  suggestion={suggestedMain} setSuggestion={setSuggestedMain}></SymptomSuggester>:null}
                    <ErrorMessage show={!validSuggestion && suggestMain && suggestedMain === ""} errorMessage={"Please enter valid Non-Empty text for the Suggestion"}></ErrorMessage>
                    <div className="symptom-header"> Please Select the Secondary Indication :</div>
                    <SymptomMultiSelector auth={props.auth} infoType="FaultIndication" productType={article.productType} setSelectedInfo={setfaultIndicationArray} setfaultIndicationObjs={setfaultIndicationObjs} selectedInfo={faultIndicationArray} suggest={suggestSecondary} setSuggest={setSuggestSecondary}></SymptomMultiSelector>
                    {faultIndicationArray && faultIndicationArray.includes("new")?<SymptomSuggester type="Secondary Issue"  suggestion={suggestedSecondary} setSuggestion={setSuggestedSecondary}></SymptomSuggester>:null}
                    <ErrorMessage show={!validSuggestion && suggestSecondary && suggestedSecondary === ""} errorMessage={"Please enter valid Non-Empty text for the Suggestion"}></ErrorMessage>
                    <Row>
                        <Col className='next-button'>
                            

                            <Button className="update-button show" variant="contained" onClick={backStep}>Back</Button>
                            {mainIssue?
                            <Button className="update-button show" variant="contained" onClick={validateSuggested}>Next</Button>
                            :
                            <Button className="update-button " variant="contained" disabled>Next</Button>
                            }
                        </Col>
                    </Row>
                </>
            )
        }

        if(activeStep === 2){
            return(<>
                    <div className="symptom-header"> Take a Photo:</div>
                    <div className="pic-buttons">
                        <Button  className="pic-button camera" variant="contained" onClick={takePic}><PhotoIcon></PhotoIcon></Button>
                        {/* <Button  className="pic-button clip" variant="contained"><AttachIcon></AttachIcon></Button> */}
                    </div>{photo? <div>{!preview ?<Photo addPhoto={handleAddPhoto}></Photo>:
                    <ImagePreview  preview={preview} togglePreview={setPreview} deletePhoto={handleDeletePhoto} dataUri={images.find( image => image.id === preview).data}></ImagePreview>}
                    <ImageList images={images} deletePhoto={handleDeletePhoto} previewPhoto={handlePreview}></ImageList></div>:null}
                    <Row></Row>
                    <div className="symptom-header">Cross-Reference Number (Optional):</div>
                    <Row>
                        <ExternalCode externalCode={externalCode} setExternalCode={setExternalCode}></ExternalCode>
                    </Row>
                    <Row>
                        <ErrorMessage show={error!==''?true: false} errorMessage={error}> </ErrorMessage>
                    </Row>
                    <Row>
                        <Col className='next-button'>
                            

                            <Button className="update-button show" variant="contained" onClick={backStep}>Back</Button>
                            {mainIssue?
                            <Button className="update-button show" variant="contained" onClick={submit}>Submit</Button>
                            :
                            <Button className="update-button show" variant="contained" disabled>Next</Button>
                            }
                        </Col>
                    </Row>
                </>)
        }if(activeStep === 3){
            return(
                    <>
                    <Row>
                        <Col>Succesfully Sent RMA Request!</Col>
                    </Row>
                    <Row className="empty-row">  
                    </Row>
                    <Row>
                        <Col>
                            <Button className="update-button show" variant="contained" onClick={reset}>New Request</Button>
                        </Col>
                    </Row>
                    </>
                )
        }if(activeStep === 4){
            return(
                    <>
                    <Row>
                        <Col>RMA, Request failed. Please try again.</Col>
                    </Row>
                    <Row className="empty-row">  
                    </Row>
                    <Row>
                        <Col>
                            <Button className="update-button show" variant="contained" onClick={reset}>New Request</Button>
                        </Col>
                    </Row>
                    </>
                )
        }
    }

    return <Container className='request-container'>
      <Row>
          <Col className='header'> RMA Request</Col>
      </Row>
       <Stepper activeStep={activeStep}>
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
       {displaySelectedStep()}
    </Container>
    ;

}

export default Request;