import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from "@material-ui/core/TextField";
import './articleScan.scss';
import {CR} from '../../Shared/constants/KeyCodes';
import ErrorMessage from '../../Shared/components/ErrorMessage';
import ProductsSrv from '../../../services/products_srv';
import IconButton from '@material-ui/core/IconButton';
import QrReader from 'react-qr-reader';
import CloseIcon from '@material-ui/icons/Close';
import Button from "@material-ui/core/Button";


function SubArticleScan(props) {
    const productsSrv = new ProductsSrv(props.auth);
    const [subArticleSN, setSubArticleSN] = useState('');
    const [articleError, setArticleError] = useState('');



    const [showQrScan, setShowQrScan] = useState(false);

    const scanSubArticle = (data)=> {
        if (data) {  setSubArticleSN(data);}
    }

    const handleChangeSubArticleSN = (event) => {
        setSubArticleSN(event.target.value);
    };

    const keyPressArticleSN = (event) => {
        if (event.key === CR) 
        {
            addSubProduct(event.target.value, props.subType);
        }
    }




    
    const addSubProduct = (code, productType)=>{
        setArticleError('');
        let sub ={ code:code, subProductType:productType };
        productsSrv.addSub(sub)
                .then((res) => {
                    if (res.status >= 200 && res.status <= 299) {
                         return res.json().then((result) => {
                            props.selectSubArticle(result); //Pass to parent
                                    setSubArticleSN('');
                         })
                        //this.setState({ newProductType: newProductType,validated: false  });
                    }
                    else {
                        console.log(res);
                        throw Error(res.statusText);
                    }
                })
                .catch(function (error) {
                    console.log('error', error);
                    setArticleError('Add Sub-Product Error:' + error.message);
                });
        }

        //addSubProduct(sub);


    return(
        <>
            <Row>
                <Col className="search" >
                <TextField className='article-search-field'
                        // inputRef={this.cartonInput} 
                        error={articleError === '' ? false : true}
                        id="outlined-search"
                        label={articleError === '' ? " Sub-Article ID" : " ERROR" }
                        type="search"
                        margin="normal"
                        variant="outlined"
                        value={subArticleSN}
                        onKeyDown={keyPressArticleSN} //Submit value once Enter is pressed
                        onChange={(e) => handleChangeSubArticleSN(e)}
                    />
                </Col>
            </Row>
            <Row><ErrorMessage show={articleError === ''?false:true} errorMessage={articleError}></ErrorMessage></Row>

            <Row className='scan-button'>
                    <Col>
                    { showQrScan ?
                    <Button className="qr-button" variant="contained" onClick={()=>addSubProduct(subArticleSN, props.subType)}  type="button">
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
                            onScan={scanSubArticle}
                            style={{ width: '100%' , maxWidth:'200px', margin:'auto'}}
                        />
                    </div>
                </Col>
                :null}
            </Row>

     </>

    );


    }
export default SubArticleScan;