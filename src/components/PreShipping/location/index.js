
import LocationsSrv from "../../../services/locations_srv";
import React from "react";
import Row from 'react-bootstrap/Row';
import './location.scss';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ErrorMessage from '../../Shared/components/ErrorMessage';


class Location extends React.Component {
    locationsSrv;

    constructor(props) {
        super(props);

        this.state = {
            loadingshipment: false,
            locations:null,
            lcoation:null,
            locationErrorMsg:'',
            locationError: false

        };

        this.locationsSrv = new LocationsSrv(this.props.auth);
        this.displayLocations = this.displayLocations.bind(this);
    }
    componentDidMount(){
        this.getLocations();
     }

    render() {
        return (
            <>
            <Row className='location-container'>   
                        <FormControl >
                           <Select className='select'
                               error ={this.state.locationError}
                               value={this.props.location?this.props.location.id:""}
                               onChange={(e) => this.handleChangeLocation(e)}
                               displayEmpty
                           >
                               <MenuItem value="" disabled>
                                                   --Please Select--
                               </MenuItem>
                               {this.displayLocations()}
                           </Select>
                       </FormControl>
            </Row>
            <Row><ErrorMessage show={this.state.locationError} errorMessage={this.state.locationErrorMsg}></ErrorMessage></Row>
            </>
        )
    }
    handleChangeLocation(event){
        var location = this.state.locations.find( function(location){
            return location.id === event.target.value;
        })
    this.props.locationSelect(location);

       
   }

    displayLocations(){
        if(this.state.locations){
            return this.state.locations.map(( location) => { return <MenuItem key={location.id} value={location.id} >
             {location.name}
            </MenuItem>});
        }

    }

    getLocations() {

        this.locationsSrv.getAll()
            .then((res) => {
                    return res.json()
                }
            ) 
            .then((result) => {
                this.setState({
                    locations: result,
                    locationError:false
                });
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log("error");
                    console.log(error);
                    this.setState({
                        error: error,
                        locationError:true,
                        locationErrorMsg: "FETCHING ERROR: Failed to Retrieve Location List"
                    });
                }
            ).catch((reason) => {
                console.log("catch");
                console.log(reason);
                this.setState({
                    error: reason,
                    locationError:true,
                    locationErrorMsg: "FETCHING ERROR: Failed to Retrieve Location List"
                });
             });
    }
}
 //type checking




export default Location;