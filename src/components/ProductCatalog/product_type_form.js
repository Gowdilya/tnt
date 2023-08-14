import React from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import ProductTypesSrv from "../../services/product_types_srv";


class ProductTypeForm extends React.Component {

    productTypesSrv

    constructor(props) {
        super(props);

        this.state = {
            validated: false,
            newProductType: {
                name: ""
            },
            error: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleProductTypeNameChange = this.handleProductTypeNameChange.bind(this);
        this.addNewProductType = this.addNewProductType.bind(this);
        this.handleCloseAlert = this.handleCloseAlert.bind(this);
        this.getAlert = this.getAlert.bind(this);

        this.productTypesSrv = new ProductTypesSrv(this.props.auth);
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ error: null });
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            this.setState({ validated: true });
            this.addNewProductType();
        }
        else {
            this.setState({ validated: false });
        }

    }

    handleCloseAlert() {
        this.setState({ error: null });
    }

    handleProductTypeNameChange(event) {
        var newProductType = { ...this.state.newProductType }
        newProductType.name = event.target.value;
        this.setState({ newProductType: newProductType });
    }

    addNewProductType() {
        var newProductType = { ...this.state.newProductType };        
        newProductType.name = newProductType.name.trim();
        this.productTypesSrv.add(newProductType)
            .then((res) => {
                console.log(res.status)
                if (res.status === 201) {
                    this.props.newProductTypeAdded(newProductType);
                    newProductType.name = "";
                    this.setState({ newProductType: newProductType,validated: false  });
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


    render() {
        const { validated, newProductType } = this.state;

        let alert = this.getAlert();

        return (
            <div>
                <Form
                    validated={validated}
                    onSubmit={this.handleSubmit}
                >
                    <Row>
                        <Col>
                            <Form.Control
                                name="name"
                                required
                                type="text"
                                value={newProductType.name}
                                placeholder="Product Name"
                                onChange={this.handleProductTypeNameChange} />
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {alert}
            </div>
        )

    }

}

ProductTypeForm.propTypes = {
    newProductTypeAdded: PropTypes.func,
    auth: PropTypes.object
};

export default ProductTypeForm;