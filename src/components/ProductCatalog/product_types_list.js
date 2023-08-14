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

class ProductTypesList extends React.Component {
 
    render() {

        if (this.props.error) {
            return <div>Error: {this.props.error.message}</div>;
        } else if (!this.props.isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Table striped bordered responsive hover size="sm">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Date Added</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.props.productTypes.map(productType => (
                            <tr key={productType.id}>
                                <td style={styles.tableData} >{productType.name}</td>
                                <td>
                                    {(new Date(productType.dateCreated)).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            );
        }
    }

}

ProductTypesList.propTypes = {
    productTypes: PropTypes.array,
    error: PropTypes.object,
    isLoaded: PropTypes.bool
  };

export default ProductTypesList;