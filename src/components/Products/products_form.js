import React from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import QrReader from 'react-qr-reader';
import PropTypes from "prop-types";
import ProductsSrv from "../../services/products_srv";


class ProductsForm extends React.Component {
    productsSrv;

    constructor(props) {
        super(props);

        this.state = {
            validated: false,
            newProduct: {
                userProductId: "",
                productType: {
                    id: "",
                },
                location: {
                    id: "",
                }
            },
            error: "",
            showQrScan: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleProductIdChange = this.handleProductIdChange.bind(this);
        this.handleProductTypeChange = this.handleProductTypeChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.addNewProduct = this.addNewProduct.bind(this);
        this.handleCloseAlert = this.handleCloseAlert.bind(this);
        this.handleQrScanToggle = this.handleQrScanToggle.bind(this);
        this.getAlert = this.getAlert.bind(this);
        this.getQrScanner = this.getQrScanner.bind(this);
        this.handleScan = this.handleScan.bind(this);
        this.handleScanError = this.handleScanError.bind(this);
        this.getProductTypesSelectList = this.getProductTypesSelectList.bind(this);
        this.getLocationSelectList = this.getLocationSelectList.bind(this);

        this.productsSrv = new ProductsSrv(this.props.auth);

    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ error: null });
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            this.setState({ validated: true });
            this.addNewProduct();
        }
        else {
            this.setState({ validated: false });
        }

    }

    handleCloseAlert() {
        this.setState({ error: null });
    }

    addNewProduct() {
        var newProduct = { ...this.state.newProduct };
        newProduct.userProductId = newProduct.userProductId.trim();

        if (!newProduct.userProductId || ! newProduct.productType.id)
        {
            console.log("Bad values for product, not defined" );
            this.setState({ error: "Bad values for product", validated: false});
            return; 
        }

        if (newProduct.userProductId === "" ||
            newProduct.productType.id === "" )
        {
            console.log("Bad values for product, empty string" );
            this.setState({ error: "Bad values for product", validated: false});
            return;            
        }

        //console.log(newProduct)
        
        this.productsSrv.add(newProduct)
            .then((res) => {
                console.log(res.status)
                if (res.status === 409) {
                    console.log("Duplicate Product ID");
                    this.setState({ error: "Duplicate Product ID" });
                }
                else if (res.status === 201) {
                    this.props.newProductAdded(newProduct);
                    newProduct = {
                        userProductId: "",
                        productType: {
                            id: "",
                        },
                        location: {
                            id: "",
                        }
                    };
                    this.setState({ newProduct: newProduct,validated: false  });
                }
                else {
                    console.log(res);
                    this.setState({ error: res.statusText });
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

    handleQrScanToggle() {
        let show = !this.state.showQrScan;
        this.setState({ showQrScan: show });
    }

    handleScan(data) {
        if (data) {            
            let newProduct = { ...this.state.newProduct };
            newProduct.userProductId = data;
            this.setState({newProduct: newProduct});
        }
    }

    handleScanError(err) {
        this.setState({ error: err });        
    }

    getAlert() {
        let error = this.state.error;
        let alert = <div></div>;
        if (error) {
            alert =
                <Alert
                    dismissible
                    onClose={this.handleCloseAlert}
                    variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>
                        {error.toString()}
                    </p>
                </Alert>;
        }
        return alert;
    }

    getQrScanner()
    {
        let showQrScanner = this.state.showQrScan;

        let qrScanner = <div></div>;
        if (showQrScanner) {
            qrScanner =
                <div>
                    <QrReader
                        delay={300}
                        onError={this.handleScanError}
                        onScan={this.handleScan}
                        style={{ width: '100%' }}
                    />
                </div>
        }
        return qrScanner;
    }

    handleProductIdChange(event) {
        let newProduct = { ...this.state.newProduct }
        newProduct.userProductId = event.target.value;
        this.setState({ newProduct });
    }

    handleProductTypeChange(event) {
        let index = event.target.value;
        let productTypes = this.props.productTypes ? this.props.productTypes: [];
        console.log(productTypes);
        console.log(productTypes[index])
        var found = productTypes.find(function(productType) {
            return productType.id === index;
          });
        let newProduct = { ...this.state.newProduct }
        newProduct.productType = found;
        console.log(newProduct);
        this.setState({ newProduct });      
    }

    handleLocationChange(event) {
        let index = event.target.value;
        let locations = this.props.locations ? this.props.locations: [];
        console.log(locations[index])
        var found = locations.find(function(location) {
            return location.id === index;
          });
        let newProduct = { ...this.state.newProduct }
        newProduct.location = found;
        this.setState({ newProduct: newProduct });      
    }

    getProductTypesSelectList()
    {
        let productTypes = this.props.productTypes ? this.props.productTypes: [];

        let productTypeId = this.state.newProduct.productType.id;
        console.log(this.state.newProduct.productType.id);
        console.log(productTypes);
        return (
            <Form.Control 
                as="select" 
                id="product-types-select" 
                onChange={this.handleProductTypeChange} 
                required
                value={productTypeId}
                title="Product Types">
                    <option disabled value="">-- Select a Product --</option>
                    {productTypes.map((productType, index) => (
                        <option 
                            key={productType.id}
                            value={productType.id}>
                                {productType.name
                        }</option>
                    ))}
            </Form.Control>
        )
    }

    getLocationSelectList()
    {
        let locations = this.props.locations ? this.props.locations: [];

        console.log(this.state.newProduct.location.id);
        let locationId = this.state.newProduct.location.id;

        return (
            <Form.Control 
                as="select" 
                id="product-types-select" 
                onChange={this.handleLocationChange} 
                required
                value={locationId}
                title="Product Types">
                    <option disabled value="">-- Select a Location --</option>
                     {locations.map((location, index) => (
                        <option 
                            key={location.id}
                            value={location.id}>
                                {location.name
                        }</option>
                    ))}                    
            </Form.Control>
        )
    }    

    render() {
        const { validated, newProduct } = this.state;

        let alert = this.getAlert();

        let qrScanner = this.getQrScanner();

        let productTypeSelectList = this.getProductTypesSelectList();

        let locationSelectList = this.getLocationSelectList();

        return (
            <div>
                <Form
                    validated={validated}
                    onSubmit={this.handleSubmit}
                >
                    <Row>
                        <Col>
                            <Form.Control
                                name="userProductId"
                                required
                                type="text"
                                value={newProduct.userProductId}
                                placeholder="Product ID"
                                onChange={this.handleProductIdChange} />
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={this.handleQrScanToggle} variant="primary" type="button">
                                Scan QR Code
                            </Button>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {productTypeSelectList}
                            {locationSelectList}
                        </Col>
                        <Col>                            
                        </Col>
                        <Col>
                            {qrScanner}
                        </Col>
                    </Row>
                </Form>
                {alert}
            </div>
        )

    }

}

ProductsForm.propTypes = {
    newProductAdded: PropTypes.func,
    productTypes: PropTypes.array,
    locations: PropTypes.array
};

export default ProductsForm;