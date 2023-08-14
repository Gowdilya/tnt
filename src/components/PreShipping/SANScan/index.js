import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TextField from "@material-ui/core/TextField";
import "./SANScan.scss";
import Parser from "../../Shared/Parser";
import { CR } from "../../Shared/constants/KeyCodes";
import ErrorMessage from "../../Shared/components/ErrorMessage";
import IconButton from "@material-ui/core/IconButton";
import QrReader from "react-qr-reader";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";

function SANScan(props) {
  const [articleSN, setArticleSN] = useState("");
  const [articleError, setArticleError] = useState("");
  const [scanned, toggleScanned] = useState(false);

  const [showQrScan, setShowQrScan] = useState(false);

  const scanArticle = data => {
    if (data && data !== " ") {
      toggleScanned(true);
      setArticleSN(data);
    }
  };
  const close = () => {
    toggleScanned(false);
    setShowQrScan(!showQrScan);
  };
  const handleChangeArticleSN = event => {
    setArticleSN(event.target.value);
  };

  const keyPressArticleSN = event => {
    if (event.key === CR) {
      enterArticleSN(event.target.value);
    }
  };

  const enterArticleSN = SAN => {
    toggleScanned(false);
    setShowQrScan(false);
    setArticleError("");
    // Check NON-URL entry to see if it is a valid ID entry, if so search and get Article
    if (Parser.validSAN(SAN)) {
      //getProductByUserProductId(articleSN);
      var Month = SAN.slice(5, 7);
      var Date = SAN.slice(8, 10);
      if (parseInt(Month) > 12) {
        setArticleError("INVALID Month in SAN: MM out of range in YYYY.MM.DD.nn");
        props.setSAN(null);
      } else if (parseInt(Date) > 31) {
        setArticleError("INVALID Date in SAN: DD out of range in YYYY.MM.DD.nn");
        props.setSAN(null);
      } else {
        props.setSAN(SAN);
      }
    } else {
      console.log("ERROR");
      setArticleError("INVALID SAN: is not of the form YYYY.MM.DD.nn, where YYYY > 2000");
      props.setSAN(null);
    }
  };

  return (
    <>
      <Row>
        <Col className="search">
          <TextField
            className="article-search-field"
            error={articleError === "" ? false : true}
            id="outlined-search"
            label={articleError === "" ? "SAN Tag" : " ERROR"}
            type="search"
            margin="normal"
            variant="outlined"
            value={articleSN}
            onKeyDown={keyPressArticleSN} //Submit value once Enter is pressed
            onChange={e => handleChangeArticleSN(e)}
          />
        </Col>
      </Row>
      <Row className="scan-button">
        <Col>
          {showQrScan ? (
            <Button
              className="qr-buttn"
              variant="contained"
              onClick={() => enterArticleSN(articleSN)}
              type="button"
            >
              Enter
            </Button>
          ) : (
            <Button
              className="qr-buttn"
              variant="contained"
              onClick={() => setShowQrScan(!showQrScan)}
              type="button"
            >
              Scan QR Code
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        {showQrScan ? (
          <Col className="qr">
            <div
              className={
                scanned === true ? "qr-container green" : "qr-container"
              }
            >
              <IconButton className="close" onClick={() => close()}>
                <CloseIcon />
              </IconButton>
              <QrReader
                delay={300}
                //onError={setArticleError}
                onScan={scanArticle}
                style={{ width: "100%", maxWidth: "200px", margin: "auto" }}
              />
            </div>
          </Col>
        ) : null}
      </Row>
      <Row>
        <ErrorMessage
          show={articleError === "" ? false : true}
          errorMessage={articleError}
        ></ErrorMessage>
      </Row>
    </>
  );
}
export default SANScan;
