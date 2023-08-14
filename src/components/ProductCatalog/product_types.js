import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import ProductTypesList from "./product_types_list";
import ProductTypeForm from "./product_type_form";
import ProductTypesSrv from "../../services/product_types_srv";



class ProductTypes extends React.Component {

    productTypesSrv;

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            productTypes: []
        };

        this.handleProductTypeAdded = this.handleProductTypeAdded.bind(this);
        this.getProductTypes = this.getProductTypes.bind(this);
        this.productTypesSrv =  new ProductTypesSrv(this.props.auth);
    }

    handleProductTypeAdded(newProduct) {
        this.getProductTypes();
    }

    componentDidMount() {
        this.getProductTypes();
    }

    getProductTypes() {

        this.productTypesSrv.getAll()
            .then((res) => {
                    return res.json()
                }
            ) 
            .then((result) => {
                this.setState({
                    isLoaded: true,
                    productTypes: result
                });
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log("error");
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            ).catch(function(reason) {
                console.log("catch");
                this.setState({
                    isLoaded: true,
                    error: reason
                });
             });
    }

    render() {
        const { error, isLoaded, productTypes } = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <ProductTypeForm 
                            newProductTypeAdded={this.handleProductTypeAdded} 
                            auth={this.props.auth}
                        />
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <ProductTypesList 
                            productTypes={productTypes}
                            isLoaded={isLoaded}
                            error={error}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

}

ProductTypes.propTypes = {
    auth: PropTypes.object
  };

export default ProductTypes;