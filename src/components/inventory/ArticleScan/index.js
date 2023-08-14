import React, { useState , useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from "@material-ui/core/TextField";
import './articleScan.scss';
import Parser from '../../Shared/Parser';
import {CR} from '../../Shared/constants/KeyCodes';
import ErrorMessage from '../../Shared/components/ErrorMessage';
//import ProductsSrv from '../../../services/products_srv';
import IconButton from '@material-ui/core/IconButton';
import QrReader from 'react-qr-reader';
import CloseIcon from '@material-ui/icons/Close';
import Button from "@material-ui/core/Button";

function ArticleScan(props) {
    const [articleSN, setArticleSN] = useState('');
    const [articleError, setArticleError] = useState('');
    const [showQrScan, setShowQrScan] = useState(false);

    const scanArticle = (data)=> {
        if (data) {  setArticleSN(data);}
    }
    
    useEffect(() =>
    {
         //console.log('useEffect inside article scan with sn='+articleSN)    ;  
         console.log("useEffect scan refreshflag= "+props.refreshFlag)         
         //if(articleSN.length === 5) 
         if(props.refreshFlag === true) 
            setArticleSN('');

    }    , [props.selectArticle, props, props.refreshFlag, props.hexOnly]);

    const handleChangeArticleSN = (event) => {
        console.log("handleChangeArticleSN="+event.target.value);        
        
        if(props.hexOnly && isNaN(Number('0x' +event.target.value)))
        {
            setArticleSN('')
            //console.log('try to ignore it');
            return;
        }          
        setArticleSN(event.target.value);     
    };

    const keyPressArticleSN = (event) => {                
        //console.log('keyPressArticleSN event.key='+event.key)    ;         
        if (event.key === CR) 
        {
            console.log('CR');
            enterArticleSN(event.target.value);
            return
        }    
    }

    const enterArticleSN = (articleSN) =>{
        setArticleError('');
        console.log("enterArticleSN")
            if(Parser.validURL(articleSN)){ 
                //Check valid URL entry to see if it is a Sera4URL and Parse accordingly
                    var articleId = Parser.getSeraID(articleSN);
                    if(isNaN(articleId)){
                        articleId = Parser.getID(articleSN);   
                    }
                    var hexId = Parser.decimalTohex(parseInt(articleId));
                    //getProductByUserProductId(hexId);
                    console.log(hexId);
                    props.selectArticle(hexId)
                    //setArticleSN('');
            }else{
                // Check NON-URL entry to see if it is a valid ID entry, if so search and get Article
                if(Parser.validAlphaNumID(articleSN)){
                   // getProductByUserProductId(articleSN);
                   console.log(articleSN);
                   props.selectArticle(articleSN)
                   //setArticleSN('');
                }
                else{
                    console.log("ERROR");
                    setArticleError("INVALID ENTRY: contains non-alphanumeric characters");                    
                }
            }
    }

    return(
        <>
            <Row>                
                <Col className="search" >
                    <TextField className='article-search-field'
                        error={articleError ===''?false:true}
                        id="outlined-search"
                        label={articleError ==='' ? "Article Id" : " ERROR" }
                        type="search"
                        margin="normal"
                        variant="outlined"
                        value={articleSN}
                        onKeyDown={keyPressArticleSN} //Submit value once Enter is pressed
                        onChange={(e) => handleChangeArticleSN(e)}
                    />
                </Col>                
                
            </Row>
            <Row>     
                    <Button className="qr-button" variant="contained" onClick={()=>enterArticleSN(articleSN)}  type="button">
                            Enter
                    </Button>                                   
            </Row>
            <Row><Col><ErrorMessage show={articleError ===''?false:true} errorMessage={articleError}></ErrorMessage></Col></Row>
            
           <Row  className='scan-button'>                                       
            
            { showQrScan && false?
                <Col className='qr'>
                    <div className="qr-container">
                        <IconButton className="close"  onClick={()=>setShowQrScan(!showQrScan)}>
                            <CloseIcon />
                        </IconButton>
                        <QrReader
                            delay={300}
                            onError={setArticleError}
                            onScan={scanArticle}
                            style={{ width: '100%' , maxWidth:'200px', margin:'auto'}}
                        />
                    </div>
                </Col>
                :null}
            </Row>

     </>

    );


    }
export default ArticleScan;