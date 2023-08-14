import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import ArticleScan from './ArticleScan';
import ArticleTypeCombo from './articleTypesCombo'
import LocationsCombo from './locationsCombo'
import ArticleTable from './articleTable'
import '../inventory/inventory.scss';
//import ErrorMessage from '../Shared/components/ErrorMessage';
import ProductsSrv from '../../services/products_srv';
import SwitchLabels from './switch';

function Inventory(props) {
  const MAX_BULK_LOAD_COUNT = 1000;
    // Declare a new state variable, which we'll call "count"
    //const [article, setArticle] = useState(null);
    const [articleType, setArticleType] = useState(null);
    const [location, setLocation] = useState(null);
    const [showError,setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(true); //true to auto fetch initial table
   //const [articleError, setArticleError] = useState('');
   const [inputMode, setInputMode] = useState(2);
   const [articleStart, setArticleStart] = useState('');
   const [articleCount, setArticleCount] = useState(0);
   
   const [disableBulkButton, setDisableBulkButton] = useState(false);
   const [knownDataList, setKnownDataList] = useState([]);
   
   const [overwriteExisting, setOverwriteExisting] = useState(false);
   const [hexMode, setHexMode] = useState(true);

   const getInputMode=() =>{
      if (inputMode === 1)
        return 'Enter one Article ID';

      return 'Enter Start Article ID and count';
   }
   
   const toggleInputMode=() =>{
    if (inputMode === 1)
      setInputMode(2);
    else
      setInputMode(1);

    setErrorMsg('');

   }
   const executeBulkLoad= async() =>
   {
      if(articleStart === null) return;
      if(articleCount === null || isNaN(articleCount)) return;
      if(articleCount < 1) return;
      if(location === null)
      {
        setShowError(true);
        setErrorMsg('Location must be set');
        return;
      }
      if(articleType === null)
      {
        setShowError(true);
        setErrorMsg('Article Type must be set');
        return;
      }
            
      let radix = 10;      
      if(hexMode===true)
      {
        radix = 16;
      }
      let baseInt = String(articleStart);
      if(isNaN(parseInt(baseInt, radix)))
      {
        return
      }
      if(knownDataList === undefined)
      {
        console.log("knownDataList is undefined. Refresh your data.")   
        setShowError(true);
        setErrorMsg('Data not loaded. Refresh data set');
        return
      }

      setDisableBulkButton(true);
      setRefreshFlag(false);
      let addedOK = true;
      for (let index = 0; index < articleCount; index++)
      {
         let snToLoad = parseInt(baseInt, radix) + index
         //console.log(snToLoad);         
        // find duplicate 
        //console.log(knownDataList) danger, do not uncomment except in dev mode.
        console.log("known data list size="+knownDataList.length);
        let found = knownDataList.find(function(oneArticle) {
          return oneArticle.userProductId.toString().toUpperCase() === snToLoad.toString(radix).toUpperCase();
          });
          if (found !== undefined && index<20)
          {console.log("found ");}
          //console.log(found);

        let sentOverwrite= false;
        if( overwriteExisting === true )
        {          
            if(found !== undefined)
            {
              //found.userProductId = snToLoad.toString(radix).toUpperCase(); do not overwrite.
              found.productType= articleType;  
              //found.location= location; Do NOT permit overwrite location. This bypasses Ship modules.
              sentOverwrite = true;
              addedOK = await productsSrv.update(found)
              .then((res) => {
                console.log(res.status)
                if (res.status === 409) {              
                  setErrorMsg("Unexpected error Bulk Load stopped at "+snToLoad.toString(radix).toUpperCase());              
                  console.log("error 409 on update "+snToLoad.toString(radix).toUpperCase());
                  return false; // halt on error
                }
                else if (res.status === 201 || res.status === 200) { //updated ok
                  return true;
                }
                else {
                    console.log(res);
                    setErrorMsg(res.statusText + "Bulk Load stopped at "+snToLoad.toString(radix).toUpperCase());
                    return false; // halt on error
                }
            })
            }
        }
        if(addedOK === false)
          break;

        if( overwriteExisting === false && found !== undefined ) // this is the ADD path!
        { 
          setErrorMsg("Duplicate Article ID, Bulk Load stopped at "+snToLoad.toString(radix).toUpperCase());              
          console.log("Duplicate Article ID, Bulk Load stopped at "+snToLoad.toString(radix).toUpperCase());
          addedOK = false;         
        }
        else if (sentOverwrite === false)
         {
            const newProduct= {
              userProductId: snToLoad.toString(radix).toUpperCase(),
              productType: articleType,          
              location: location
            }

            addedOK = await productsSrv.add(newProduct)
              //.then(res => (res.ok ? res : Promise.reject(res)))
              .then((res) => {
                console.log(res.status)
                if (res.status === 409) {              
                  setErrorMsg("Duplicate Article ID, Bulk Load stopped at "+snToLoad.toString(radix).toUpperCase());              
                  console.log("Duplicate Article ID "+snToLoad.toString(radix).toUpperCase());
                  return false; // halt on error
                }
                else if (res.status === 201) {                          
                  //append  
                  return true;
                }
                else {
                    console.log(res);
                    setErrorMsg(res.statusText + "Bulk Load stopped at "+snToLoad.toString(radix).toUpperCase());
                    return false; // halt on error
                }
            })
          }
        if(addedOK === false)
            break;
      } // end for
      let finalSn = parseInt(baseInt, radix) + parseInt(articleCount,10); //count is always base 10
      console.log("ok="+addedOK+" and total="+articleCount)
      if(addedOK === true)
      {
        setErrorMsg('Success');              
        if (radix === 16){
          //convert to hex
          setArticleStart(finalSn.toString(radix));
        }
        else
        {
          setArticleStart(finalSn);
        }

      }
      setShowError(true);    
      setDisableBulkButton(false);
      setRefreshFlag(true);
   } // end bulk load

   const loadMessage=() =>{
      if(articleStart === null || articleStart.toString().trim()==='')
        return 'Enter Start Article ID';
      if(articleCount === null || isNaN(articleCount))
        return 'Enter Count';

      let radix = 10;
      let baseInt = String(articleStart);
      if(hexMode===true)      {
        radix = 16;        
      }
      if(isNaN(parseInt(baseInt, radix)))
          return 'Enter Start Article ID';

      if(disableBulkButton === true)
        setDisableBulkButton(false);
      let msg = 'Load from '+ (radix===16?'0x':'') + parseInt(baseInt,radix).toString(radix).toUpperCase() + ' to '
      let end = parseInt(baseInt, radix) +  (1> articleCount? 0: articleCount-1);
      if(radix ===16)
        end = '0x'+ end.toString(radix).toUpperCase()
      msg = msg + end;      
      return msg;
   }
   
    const productsSrv = new ProductsSrv(props.auth);
 
    const selectArticle = (article) => {
        //console.log("select article hit")       
        saveNewArticle(article);
      }

      const doGotData = (data) => {
        
        //console.log("doGotData Hit")   
       //console.log(data);   
        setKnownDataList(data);
      }
      const doSetOverwriteMode = (overwrite) =>{
        console.log("inventoryOverwite mode="+overwrite);
        if( (overwrite !== undefined ) && (overwrite===true || overwrite ===false))
          setOverwriteExisting(overwrite);
      }
      const doSetRadixMode = (radixMode) =>{
        console.log("setRadix mode="+radixMode);
        if( (radixMode !== undefined ) && (radixMode===true || radixMode ===false))
          {
            setHexMode(radixMode);
            if(inputMode !== 1) setArticleStart('');
          }
      }

      const saveNewArticle = (article)=>
      {
        console.log(article)       
        setRefreshFlag(false);   
        // check conditions
        if(article === null)
        {
          setShowError(true);
          
          setErrorMsg((hexMode)
          ?'Article must be digits, then press enter':'Article must be hex digits, then press enter' ); // need to press enter
          return;
        }        
        console.log(location);
        console.log(articleType);
        if(location === null)
        {
          setShowError(true);
          setErrorMsg('Location must be set');
          return;
        }
        if(articleType === null)
        {
          setShowError(true);
          setErrorMsg('Article Type must be set');
          return;
        }
 
        setShowError(false);
        setErrorMsg('');       
      
        // find duplicate    
        let found = knownDataList.find(function(oneArticle) {
          return oneArticle.userProductId.toString().toUpperCase() === article.toString().toUpperCase();
        });
        if (found !== undefined)
          {console.log("found ");}
        console.log(found);
        
        if( overwriteExisting === true
          && knownDataList !== undefined && knownDataList !== null && knownDataList.length > 0)
        {          
          if(found !== undefined)
          {
            //found.userProductId = article.toString().toUpperCase();
            found.productType= articleType;  
            //found.location= location;
              productsSrv.update(found).then((res) => {
                console.log(res.status)
                if (res.status === 409) {
                  setShowError(true);
                  setErrorMsg("Duplicate Product ID update error");
                  console.log("Duplicate Product ID update error");                  
                }
                else if (res.status === 201 || res.status === 200) {
                  setShowError(true);    
                  setErrorMsg("updated "+article.toString().toUpperCase());                                   
                  setRefreshFlag(true);
                }
                else {
                    console.log(res);
                    setShowError(true);
                    setErrorMsg(res.statusText);
                    setRefreshFlag(true);
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
            return;
          }
          
        }
        if( overwriteExisting === false && found !== undefined ) // this is the ADD path!
        {
          setShowError(true);
          setErrorMsg("Duplicate Article ID");
          console.log("Duplicate Article ID");
          return;
        }

        const newProduct= {
          userProductId: article.toString().toUpperCase(),
          productType: articleType,          
          location: location
        }
        
        console.log(newProduct)
        
        productsSrv.add(newProduct)
            .then((res) => {
                console.log(res.status)
                if (res.status === 409) {
                  setShowError(true);
                  setErrorMsg("Duplicate Article ID");
                  console.log("Duplicate Article ID");                  
                }
                else if (res.status === 201) {
                  setShowError(true);    
                  setErrorMsg("Added "+article.toString().toUpperCase());                     
                  setRefreshFlag(true);
                }
                else {
                    console.log(res);
                    setShowError(true);
                    setErrorMsg(res.statusText);
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

    const handleChangeArticleStartSN = (event) => {
      console.log("handleChangeArticleStartSN");        
      if(event.target.value === undefined || event.target.value.toString().length===0)
        return

      let num = Number(event.target.value);
      console.log("num="+num);  
      let okBin = !isNaN(num) ;
      let okHex = !isNaN(Number('0x' +event.target.value));      
      console.log("okHex="+okHex);  
      console.log("okBin="+okBin);  
      if( (okHex && hexMode)  || (!hexMode && okBin))
      {
        setShowError(true);
        setErrorMsg('');
        setArticleStart(event.target.value); 
        console.log("set articleStart")
      }
  };
  const handleChangeArticleCount = (event) => {
    console.log("handleChangeArticleCount");        
    if (event.target.value !== null)
    {
      let num = event.target.value;
      if(!isNaN(num))
      {
        setArticleCount(num <= MAX_BULK_LOAD_COUNT ? num : MAX_BULK_LOAD_COUNT);
      }
      else
        setArticleCount(1);
    }
    else
      setArticleCount(1);
};
  

    const selectArticleType = (articleType) => {
        setArticleType(articleType);
        console.log("select articleType hit")
        console.log(articleType)
      }
      const selectLocation = (location) => {
        setLocation(location);
        console.log("select location hit")
        console.log(location)
      }
    return <Container className='inventory-container'>
      <Row>
          <Col className='header' >Inventory</Col>
      </Row>     
      <Row>
          Article Type
      <ArticleTypeCombo auth={props.auth} selectArticleType={selectArticleType}>{
          articleType !== undefined && articleType !== null ? articleType.name: '' }</ArticleTypeCombo>
      </Row>
      <Row>
          Location
        <LocationsCombo auth={props.auth} selectLocation={selectLocation}>{
          location !== undefined && location !== null ? location.name: '' }</LocationsCombo>
      </Row>
      <Row classname='selectModeButton'>
          <Button className="qr-button" variant="contained" type="button" onClick={()=>toggleInputMode()} >
            {inputMode ===1 ?'Switch to Bulk Mode': 'Switch to Single Mode'}
          </Button>          
      </Row>
      <Row>
        {getInputMode()}
      </Row>
      <Row>
        <SwitchLabels auth={props.auth} setBoolOutput={doSetRadixMode} displayText="Hex Input" default={hexMode}/>
        <SwitchLabels auth={props.auth} setBoolOutput={doSetOverwriteMode} displayText="Overwrite Existing Records Article Type" default={overwriteExisting}/>
      </Row>
      {inputMode ===1 ?
         <Row>
           <ArticleScan auth={props.auth} refreshFlag={refreshFlag} selectArticle={selectArticle} hexOnly={hexMode} />
         </Row>   
         :
          <Row> 
            <Col>
              <TextField className='article-start'
                        error={errorMsg ==='' || errorMsg==='Success' ?false:true}
                        id="outlined-search"
                        label={errorMsg ==='' || errorMsg==='Success'? "Start Article ID" : " ERROR" }
                        type="search"
                        margin="normal"
                        variant="outlined"
                        value={articleStart}                        
                        onChange={(e) => handleChangeArticleStartSN(e)}
              />
              </Col>
              <Col>
              <TextField className='article-cnt'
                        error={errorMsg ===''|| errorMsg==='Success'?false:true}
                        id="outlined-searchCount"
                        label={errorMsg ==='' || errorMsg==='Success'? "Count(Max"+MAX_BULK_LOAD_COUNT +")" : " ERROR" }
                        type="search"
                        margin="normal"
                        variant="outlined"
                        value={articleCount}                        
                        onChange={(e) => handleChangeArticleCount(e)}
              />              
              </Col>
              <Col>              
              <Button className="qr-button" variant="contained" type="button"
              disabled={disableBulkButton}
               onClick={()=>executeBulkLoad()}>
              {loadMessage()}
               </Button>     
              </Col>
         </Row>      
      }
      
      <Row>
        {showError? errorMsg: ''}
      </Row>
        <ArticleTable  auth={props.auth} refreshFlag={refreshFlag} setArticle={doGotData}/>   
        
    </Container>
    ;
  }
  export default Inventory;