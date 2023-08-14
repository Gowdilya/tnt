import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import ProductsList from "./products_list";
import ProductsForm from "./products_form";
import ProductsSrv from "../../services/products_srv";
import ProductTypesSrv from "../../services/product_types_srv";
import LocationsSrv from "../../services/locations_srv";



class Products extends React.Component {
    
    productsSrv;
    productTypesSrv;
    locationsSrv;

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isProductsLoaded: false,
            isProductTypesLoaded: false,
            isLocationsLoaded: false,
            products: [],
            productTypes: [],
            locations: [],
        };

        this.handleProductAdded = this.handleProductAdded.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getProductTypes = this.getProductTypes.bind(this);
        this.getLocations = this.getLocations.bind(this);
        this.productsSrv = new ProductsSrv(this.props.auth);
        this.productTypesSrv = new ProductTypesSrv(this.props.auth);
        this.locationsSrv = new LocationsSrv(this.props.auth);
    }

    handleProductAdded(newProduct) {
        this.getProducts();
    }

    componentDidMount() {
        this.getProducts();
        this.getProductTypes();
        this.getLocations();
    }

    getProductTypes() {

        this.productTypesSrv.getAll()
            .then((res) => {
                    return res.json()
                }
            ) 
            .then((result) => {
                this.setState({
                    isProductTypesLoaded: true,
                    productTypes: result
                });
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.error(error);
                    this.setState({
                        isProductTypesLoaded: true,
                        productTypes: [],
                        error: error
                    });                    
                }
            ).catch(function(reason) {
                console.error(reason);
                this.setState({
                    isProductTypesLoaded: true,
                    productTypes: [],
                    error: reason
                });                  
            });

    }

    getLocations() {

        this.locationsSrv.getAll()
            .then((res) => {
                    return res.json()
                }
            ) 
            .then((result) => {
                this.setState({
                    isLocationsLoaded: true,
                    locations: result
                });
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.error(error);
                    this.setState({
                        isLocationsLoaded: true,
                        locations: [],
                        error: error
                    });                    
                }
            ).catch(function(reason) {
                console.error(reason);
                this.setState({
                    isLocationsLoaded: true,
                    locations: [],
                    error: reason
                });                  
            });

    }


    getProducts() {

        this.productsSrv.getAll()
            .then((res) => {
                    return res.json()
                }
            ) 
            .then((result) => {
                this.setState({
                    isProductsLoaded: true,
                    products: result
                });
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.error(error);
                    this.setState({
                        isProductsLoaded: true,
                        error: error,
                        products: []
                    });
                }
            ).catch(function(reason) {
                console.error(reason);
                this.setState({
                    isProductsLoaded: true,
                    error: reason,
                    products: []
                });
             });
    }

    render() {
        const { 
            error, 
            isProductsLoaded, 
            isProductTypesLoaded,
            isLocationsLoaded,
            products, 
            productTypes,
            locations } = this.state;
        const isLoaded = isProductsLoaded && isProductTypesLoaded && isLocationsLoaded;
        return (
            <Container>
                <Row>
                    <Col>
                        <ProductsForm 
                            productTypes={productTypes}
                            locations={locations}
                            newProductAdded={this.handleProductAdded} 
                            auth={this.props.auth}
                        />
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <ProductsList 
                            products={products}
                            productTypes={productTypes}
                            locations={locations}
                            isLoaded={isLoaded}
                            error={error}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

}

Products.propTypes = {
    auth: PropTypes.object
  };


export default Products;