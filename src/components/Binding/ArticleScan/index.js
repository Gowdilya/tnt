import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from "@material-ui/core/TextField";
import './articleScan.scss';
import Parser from '../../Shared/Parser';
import {CR} from '../../Shared/constants/KeyCodes';
import ErrorMessage from '../../Shared/components/ErrorMessage';
import ProductsSrv from '../../../services/products_srv';
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
    const productSrv = new ProductsSrv(props.auth);

    const handleChangeArticleSN = (event) => {
        setArticleSN(event.target.value);
    };



    const keyPressArticleSN = (event) => {
        if (event.key === CR) 
        {
            enterArticleSN(event.target.value);
        }
    }

    const enterArticleSN = (articleSN) =>{
        setArticleError('');
            if(Parser.validURL(articleSN)){ 
                //Check valid URL entry to see if it is a Sera4URL and Parse accordingly
                    var articleId = Parser.getSeraID(articleSN);
                    if(isNaN(articleId)){
                        articleId = Parser.getID(articleSN);   
                    }
                    var hexId = Parser.decimalTohex(parseInt(articleId));
                    getProductByUserProductId(hexId);
            }else{
                // Check NON-URL entry to see if it is a valid ID entry, if so search and get Article
                if(Parser.validAlphaNumID(articleSN)){
                    getProductByUserProductId(articleSN);
                }
                else{
                    console.log("ERROR");
                    setArticleError("INVALID ENTRY: contains non-alphanumeric characters");
                    
                }
            }
    }

    const getProductByUserProductId = (userProductId) => {
                productSrv.getByUserProductId(userProductId)
                    .then((res) => { 
                        if(res.status >= 200 && res.status <= 299){
                            return res.json() 
                        }else{
                            throw Error(res.statusText);
                        }
                    })
                    .then((result) => {
                       if(result){
                            props.selectArticle(result[0]);
                            setArticleSN('');
                       }
                    }).catch((error) =>{  
                        console.log('error', error)           
                        setArticleError('Load Product Error:' + error.message);
                    });       
    }
    


    return(
        <>
            <Row>
                <Col className="search" >
                <TextField className='article-search-field'
                        error={articleError ===''?false:true}
                        id="outlined-search"
                        label={articleError ==='' ? "Lock Id" : " ERROR" }
                        type="search"
                        margin="normal"
                        variant="outlined"
                        value={articleSN}
                        onKeyDown={keyPressArticleSN} //Submit value once Enter is pressed
                        onChange={(e) => handleChangeArticleSN(e)}
                    />
                </Col>
            </Row>
            <Row><ErrorMessage show={articleError ===''?false:true} errorMessage={articleError}></ErrorMessage></Row>

            <Row className='scan-button'>
                    <Col>
                    { showQrScan ?
                    <Button className="qr-button" variant="contained" onClick={()=>enterArticleSN(articleSN)}  type="button">
                        Enter
                    </Button>
                    :
                        <Button className="qr-button" variant="contained" onClick={()=>setShowQrScan(!showQrScan)}  type="button">
                            Scan QR Code
                        </Button>
                     }

                    </Col>
            </Row>
            <Row >
            { showQrScan ?
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