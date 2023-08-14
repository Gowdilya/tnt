import React, { useRef, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArticleScan from './ArticleScan';
import ArticleDisplay from './ArticleDisplay';
import Button from "@material-ui/core/Button";
import '../Binding/binding.scss';
import SubArticleTypeDisplay from './SubArticleTypeDisplay';
import SubArticleTypeDisplayTrack from './SubArticleTypeDisplayTrack';
import SubArticleScan from './SubArticleScan';
import SubArticleDisplay from './SubArticleDisplay';
import ErrorMessage from '../Shared/components/ErrorMessage';
import ProductsSrv from '../../services/products_srv';
import BindedSubsDisplay from './BindedSubs';


function getSteps() {
  return ['Select Article', 'Bind Sub-Articles'];
}

const steps = getSteps();

function Binding(props) {
    // Declare a new state variable, which we'll call "count"
    const [activeStep, setStep] = useState(0);
    const [article, setArticle] = useState(null);
    const [binded, setBinded] = useState(null);
    const [subTypes, setSubTypes] = useState(null);
    const [subArticles, setSubArticles] = useState([]);
    const [allowBind, setAllowBind] = useState(false);
    const [showError,setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [subTypeIndex,setSubTypeIndex] = useState(0);
    const [articleError, setArticleError] = useState('');


    const isFirst = useRef(true);
    const productsSrv = new ProductsSrv(props.auth);

    const reload=()=>{
      setStep(0);
      setArticle(null);
      setSubTypes(null);
      setSubArticles([]);
      setAllowBind(false);
      setShowError(false);
      setErrorMsg('');
    }
    useEffect(() => {
      const checkSubType = () =>{
        setAllowBind(false);
        if(subArticles.length > 0 ){
          setAllowBind(true);
        }
      }
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      checkSubType();
    }, [subArticles.join(",")]) //had to do the join if not useEffect throws error due to changing array size
  

    const selectArticle = (article) => {
      getAllAssoc(article.id);
      setArticle(article);
    }

    const handleSetSubTypeIndex = (index)=>{
      if(subTypes.length  > index){
        setSubTypeIndex(index);
      }
    }

    const setRequiredSubTypes = (subTypes) =>{
      setSubTypes(subTypes);
    }

    const selectSubArticle = (subArticle)=>{
      setShowError(false);
      const found = subArticles.find(sub => sub.id === subArticle.id);
      if(found && subArticle){
        setShowError(true);
        setErrorMsg('This Sub Article was already scanned!');
      }else{
        setSubArticles([...subArticles, subArticle]);
        handleSetSubTypeIndex(subTypeIndex + 1);
      }
    } 

    const removeSub = (subId) =>{
      var subs = subArticles.filter((sub) => sub.id !== subId)
      
      setSubArticles(subs);
      deleteSub(subId);
      
    }

    const removeBinding = (subId) =>{
      removeBind(subId);
    }

    const displaySelectedStep = () => {
      if(activeStep === 0){
          return(<>

                      <ArticleScan auth={props.auth} selectArticle={selectArticle}/>
                      <ErrorMessage show={articleError !== ''?true:false} errorMessage={articleError}></ErrorMessage>
                      {article?<><ArticleDisplay article={article}/> 
                       <SubArticleTypeDisplay auth={props.auth} article={article} setRequiredSubTypes={setRequiredSubTypes} />
                       { binded?
                       <BindedSubsDisplay subArticles={binded} removeSub={removeBinding}></BindedSubsDisplay>
                       :null
                        }
                      </>
                      : null}

                      <Col className='next-button'>
                          {article && subTypes &&  ( binded == null||subTypes.length > binded.length) ?
                            <Button className="step-next-button show" variant="contained" onClick={()=>setStep(1)}>Next</Button>
                            : <Button className="step-next-button " variant="contained" disabled> Next</Button>}
                      </Col>
         
                </>
                   
                  )
      }if(activeStep === 1){
          return(<>
          
                   <ArticleDisplay article={article}/> 
                   <SubArticleTypeDisplayTrack auth={props.auth} article={article} subArticles={subArticles} subIndex={subTypeIndex} setRequiredSubTypes={setRequiredSubTypes} setSubTypeIndex={handleSetSubTypeIndex}/>
                   <SubArticleDisplay subArticles={subArticles} removeSub={removeSub}/>
                   <SubArticleScan auth={props.auth} subType={subTypes[subTypeIndex]} selectSubArticle={selectSubArticle} />
                   <ErrorMessage show={showError} errorMessage={errorMsg}></ErrorMessage>
                   <Col className='next-button'>
                          {allowBind?
                            <Button className="step-next-button show" variant="contained" onClick={()=>bindSubTypes()}>Bind</Button>
                            : <Button className="step-next-button " variant="contained" disabled> Next</Button>}
                    </Col>
                   
                  </>)
      }if(activeStep === 2){
          return(<>
                  <Col>Binding Complete!</Col>
                  <Col className='next-button'>
                         
                            <Button className="step-next-button show" variant="contained" onClick={()=>reload()}>Bind Next Article</Button>
                            
                    </Col>
                  
                           
        
                  </>)
      }
    }


      
      
    const bindSubTypes=()=>{
       if(subArticlesErrorChecks()){
        subArticles.map( sub =>{
          bindtoArticle(sub);
        }) 
      }
    }

    const bindtoArticle=(sub)=>{
      productsSrv.addSubAssociation(article.id, sub)
                .then((res) => {
                    console.log(res.status)
                    if (res.status === 201) {
                        console.log("201 Created");
                        setStep(2);
                    }
                    else {
                      throw Error(res.statusText);
                    }
                })
                .catch(function (error) {
                  console.log(error);
                  setErrorMsg("Failed to Bind:" + error.message);
                  setShowError(true);
                });
        }


    const getAllAssoc = (Id)=>{
      productsSrv.getAllAssociations(Id).then(
          (res) => { 
            if(res.status >= 200 && res.status <= 299){
              return res.json() 
            }else {
              throw Error(res.statusText);
            }
          }   
            ).then((result) => {
                setBinded(result);
              }
          ).catch((error) =>{ 
            console.log('error', error)           
            setArticleError('Failed to Get Association:' + error.message);
          });       

  }

  const removeBind = (Id)=>{
    productsSrv.removeAssociation(article.id, Id).then((res) => {
      console.log(res.status)
      if (res.status === 204) {
          console.log("204 ");
          getAllAssoc(article.id);
          deleteSub(Id);
      }
      else {
          console.log(res);
      }
  },
      (error) => {
          console.error(error);
      }
  )
  .catch(function (reason) {
      console.error(reason);
      this.setState({ error: reason });
  });
}

const deleteSub = (Id)=>{
  productsSrv.deleteSub(Id).then((res) => {
    console.log(res.status)
    if (res.status === 204) {
        console.log("204 ");
    }
    else {
        console.log(res);
    }
},
    (error) => {
        console.error(error);
    }
)
.catch(function (reason) {
    console.error(reason);
});
}

 


    const subArticlesErrorChecks = ()=>{

      setShowError(false);
      var reqMap = new Map();
      for (let i = 0; i < subTypes.length; i++) {
        var count = reqMap.get(subTypes[i].id);
        if(count){
          reqMap.set(subTypes[i].id, count + 1)
        }else{
          reqMap.set(subTypes[i].id, 1)
        }
      } 

      var subMap = new Map();
      for (let i = 0; i < subArticles.length; i++) {
        count = subMap.get(subArticles[i].subProductType.id);
        if(count){
          subMap.set(subArticles[i].subProductType.id, count + 1)
        }else{
          subMap.set(subArticles[i].subProductType.id, 1)
        }
      } 

      for (let i = 0; i < subTypes.length; i++) {
        console.log(reqMap.get(subTypes[i].id));
        console.log(subMap.get(subTypes[i].id));
        if(reqMap.get(subTypes[i].id) > subMap.get(subTypes[i].id )||!subMap.get(subTypes[i].id )){
          setErrorMsg("Missing a required sub-article of type: " + subTypes[i].name);
          setShowError(true);
          return false;
        }
      } 
      

      if (subArticles.length > subTypes.length ){
        setErrorMsg("Scanned more subArticles than required.");
        setShowError(true);
        return false;
      }

      else{
        return true;
      }
    }

    return <Container className='ship-container'>
      <Row>
          <Col className='header' >Binding </Col>
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




  export default Binding;