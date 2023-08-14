import React from "react";
import PropTypes from "prop-types";
import Table from 'react-bootstrap/Table';

const styles = {
    tableData: {
        wordWrap: "break-word",
        minWidth: "160px",
        maxWidth: "160px"
    }
  };

class ProductsList extends React.Component {

    render() {

        const productTypeNames = this.props.productTypes.reduce((map, obj) => {map[obj.id] = obj.name; return map}, {});
        const locationNames = this.props.locations.reduce((map, obj) => {map[obj.id] = obj.name; return map }, {});

        if (this.props.error) {
            return <div>Error: {this.props.error.message}</div>;
        } else if (!this.props.isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Table striped bordered responsive hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Date Added</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.props.products.map(product => (                            
                            <tr key={product.id}>
                                <td style={styles.tableData} >{product.userProductId}</td>
                                <td>{productTypeNames[product.productType.id]}</td>
                                <td>{locationNames[product.location.id]}</td>
                                <td>
                                    {(new Date(product.dateCreated)).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            );
        }
    }

}

ProductsList.propTypes = {
    products: PropTypes.array,
    productTypes: PropTypes.array,
    locations: PropTypes.array,
    error: PropTypes.object,
    isLoaded: PropTypes.bool
  };

export default ProductsList;