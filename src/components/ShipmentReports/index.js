import React from "react";
import PropTypes from "prop-types";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ProductsSrv from "../../services/products_srv";
import ShipmentsSrv from "../../services/shipments_srv";
import Button from "@material-ui/core/Button";

import './shippingreport.scss';
import moment from 'moment';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

import ReactExport from "react-export-excel";
//npm install react-export-excel --save

//import { makeStyles } from '@material-ui/core/styles';
//import { MenuItem } from '@material-ui/core';
//import InputLabel from '@material-ui/core/InputLabel';
//import FormHelperText from '@material-ui/core/FormHelperText';
//import FormControl from '@material-ui/core/FormControl';
//import Select from '@material-ui/core/Select';

import ReactTable from 'react-table-6';
import "react-table-6/react-table.css";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
//npm install --save rc-datepicker
// npm install @types/moment

class ShipReport extends React.Component {
    productsSrv;
    shipmentsSrv;
   
    constructor(props) {
        super(props);
        
        this.state = {
            loadingshipment: false,
            shipment: null,
            error: null,            
            shipDisplay: '',
            exportDataSet: [],
            exportDataSetForDisplay: [],
            startDatePick: new Date(),
            endDatePick: new Date(),
            foundRecords: false,
            sorted: [], // sample code adapted from https://codesandbox.io/s/react-table-controlled-table-h5izv
            page: 0,
            pageSize: 10,
            expanded: {},
            //resized: [],
            filtered: []
        };
        this.shipmentsSrv = new ShipmentsSrv(this.props.auth);
        this.productSrv = new ProductsSrv(this.props.auth);
        this.getShipmentByRange = this.getShipmentByRange.bind(this);        
        this.handleChangeStartPick = this.handleChangeStartPick.bind(this);
        this.handleChangeEndPick = this.handleChangeEndPick.bind(this);
        this.getExportData = this.getExportData.bind(this);
    }

    render() {
        return (
            <Container className='shipping-report-container'>
                <Row>
                    <Col className='header' >ShipReport: Begining of Start Date to End of Day End Date Local Time</Col>
                </Row>
                <Row>
                    <Col xs={12} lg={6}>
                        <Row >
                            <div className='text'>
                            <p>Please select Start Date</p>
                            <DatePicker className='starter'
                            dateFormat="yyyy-MM-dd HH:mm:ss"
                            showTimeSelect
                            minDate={new Date(2019,1,1)}
                            selected={this.state.startDatePick}
                            onChange={this.handleChangeStartPick}
                            />   
                            </div>
                            </Row>                       
                        <Row ><div className='text'><p>Please select End Date</p>
                           <DatePicker className='finisher'
                                dateFormat="yyyy-MM-dd HH:mm:ss"
                                showTimeSelect
                                minDate={new Date(2019,1,1)}
                                selected={this.state.endDatePick}
                                onChange={this.handleChangeEndPick}
                              />  
                            </div>
                            </Row>                               
                        <Row>
                            <Button                            
                              className="update-button show"
                               variant="contained"
                               disabled={this.state.loadingshipment}
                               onClick={this.getShipmentByRange}>Get Data
                            </Button>
                            { !(this.state.foundRecords) ? <Row> </Row> :
                            <ExcelFile element={<button>Export Data</button>}>
                                                               
                                <ExcelSheet data={this.getExportData} name="Shipment Report">
                                    <ExcelColumn label="Shipment Authorization Number" value="shipmentAuthorizationNumber"/>
                                    <ExcelColumn label="Carton ID" value="userShipmentId"/>
                                    <ExcelColumn label="Destination" value="cartonDestination"/>   
                                    <ExcelColumn label="Status" value = "prodStatus"/> 
                                    <ExcelColumn label="Packed Date (Local)" value="datePacked" />
                                    <ExcelColumn label="Packed Date Epoch (UTC)" value="datePackedUnix" />
                                    <ExcelColumn label="Shipped Date (Local)" value="dateShipped" /> 
                                    <ExcelColumn label="Shipped Date Epoch (UTC)" value="dateShippedUnix" />                                    
                                    <ExcelColumn label="Article Type" value="productType"/>
                                    <ExcelColumn label="Article Id" value="userProductId"/>  
                                </ExcelSheet>                
                                
                            </ExcelFile>
                            }
                            </Row>   
                            
                            <Row>                
                                <div className='shipment-info'>{this.state.shipDisplay}</div> 
                            </Row>                                             
                    </Col>
                </Row>
                
                { !(this.state.foundRecords) ? <Row> </Row> :
                <Row>
                    <div>
                    <ReactTable                       
                        data={this.state.exportDataSet}
                        columns={[
                            {
                              Header: "Carton Information",                             
                              columns: [                               
                                {
                                  Header: "Authorization Number",                                  
                                  accessor: "shipmentAuthorizationNumber",
                                  id: "shipmentAuthorizationNumber",
                                  sortMethod: (a, b) => {
                                      if ( !isNaN(a) && !isNaN(b) )
                                      {
                                          return parseInt(a) - parseInt(b);
                                      }                                   
                                      return a > b ? 1 : -1;                                   
                                  }
                                  ,
                                  filterMethod: (filter, row) =>
                                  row[filter.id].toString().toUpperCase().includes(filter.value.toString().toUpperCase())
                                },
                                { Header: "Carton ID",                                  
                                  accessor: "userShipmentId",
                                  id: "userShipmentId",
                                  sortMethod: (a, b) => {
                                      if ( !isNaN(a) && !isNaN(b) )
                                      {
                                          return parseInt(a) - parseInt(b);
                                      }                                   
                                      return a > b ? 1 : -1;                                   
                                  },
                                  aggregate: values =>{
                                      // this aggrtegate calculates a set to avoid duplicates and shows the aggregate
                                      // after filtering using STARTSWITH. Similar to default behaviour but deplicates are removed.
                                        for(let index = 0; index < this.state.filtered.length; index++) {
                                            //console.log("calculate aggreate");                                            
                                            if(this.state.filtered[index].id==="userShipmentId")
                                            {                                            
                                                //console.log(this.state.filtered[index].value);
                                                return [...new Set(values)].filter(v=> v.toString().toUpperCase().startsWith(this.state.filtered[index].value.toString().toUpperCase()));
                                            }
                                        }
                                        return [...new Set(values)];                                      
                                    }
                                  ,                                 
                                  Aggregated: row => { return row.value +' ' }
                                  , FilterAll : true ,           
                                  filterMethod: (filter, row) =>
                                  {                                      
                                      return  row[filter.id].toString().toUpperCase().startsWith(filter.value.toString().toUpperCase())  ;
                                  }
                                  
                                  
                                },
                                { Header: "Carton Destination",
                                  id: "cartonDestination",                                 
                                  accessor: d => d.cartonDestination,
                                  width: 170,
                                  //aggregate: (values, rows) => values[0],
                                  //Aggregated: row => { return row.value}
                                  aggregate: values => [...new Set(values)],                                 
                                  Aggregated: row => { return row.value +' ' }
                                  , filterMethod: (filter, row) =>
                                  row[filter.id].toString().toUpperCase().includes(filter.value.toString().toUpperCase())
                                }
                                ,
                                { Header: "Status",
                                  id: "prodStatus",                                 
                                  accessor: d => d.prodStatus,
                                  width: 170,
                                  //aggregate: (values, rows) => values[0],
                                  //Aggregated: row => { return row.value}
                                  aggregate: values => [...new Set(values)],
                                  Aggregated: row => { return row.value +' ' }
                                  , filterMethod: (filter, row) =>
                                  row[filter.id].toString().toUpperCase().includes(filter.value.toString().toUpperCase())
                                }                                
                                ,
                                {   Header: "Packed Date",
                                    id: "datePacked",                                 
                                    accessor: d => d.datePacked,
                                    width: 170,
                                    aggregate: values => [...new Set(values)],                                 
                                    Aggregated: row => { return row.value +' ' }
                                    , filterMethod: (filter, row) =>
                                    row[filter.id].toString().includes(filter.value.toString())
                                  }
                                  ,
                                { Header: "Shipped Date",
                                  id: "dateShipped",                                 
                                  accessor: d => d.dateShipped,
                                  width: 170,
                                  aggregate: (values, rows) => values[0],
                                  Aggregated: row => { return row.value}
                                }
                            ]
                        },
                        {   Header: "Article Information",
                            columns: [                                
                                { Header: "Article Type",   
                                  id: "productType",                                                                 
                                  accessor: d => d.productType,
                                  width: 170
                                  , aggregate: values => [...new Set(values)],                                 
                                  Aggregated: row => { return row.value +' ' }
                                 , filterMethod: (filter, row) =>
                                    row[filter.id].toString().toUpperCase().includes(filter.value.toString().toUpperCase())
                                }
                                ,
                                { Header: "Article Id",   
                                  id: "userProductId",                                                                 
                                  accessor: d => d.userProductId,
                                  width: 170                                  
                                }
                              ]
                            }                            
                          ]}
                        defaultPageSize={10}
                                                
                        pivotBy={["shipmentAuthorizationNumber"]}                        
                        filterable
                        filtered={this.state.filtered}
                        onFilteredChange={filtered => this.setState({ filtered })}
                        sorted={this.state.sorted}
                        onSortedChange={sorted => this.setState({ sorted })}
                        collapseOnSortingChange={false}
                        collapseOnDataChange={false}
                        
                    />
                    </div>
               </Row>                         
            }                       
            </Container>
        )
    }


    getExportData()
    {       
        
        var rowsToDisplay = this.state.exportDataSet;
        if (this.state.filtered.length > 0)
        {
            let etFilter = this.state.filtered[0].id;
            let etValue = this.state.filtered[0].value;
           // console.log(etFilter+'  ' +etValue);
            rowsToDisplay = this.state.exportDataSet.filter( function(ary) {  
               // console.log(ary[etFilter]+'?=' +etValue);                  
                //console.log(( String(ary[etFilter]) ).lastIndexOf( String(etValue), 0));  
                return ary[etFilter] === etValue || etValue=== '*' 
                    || String(ary[etFilter]).lastIndexOf( String(etValue), 0)===0; // is StartsWith
                }
                );            
        }
       // console.log(this.state.sorted);
        const data = rowsToDisplay;
        if (this.state.sorted.length > 0)
        {
            console.log(this.state.sorted[0].id);
            const sortKey = this.state.sorted[0].id;
                       
            if(this.state.sorted[0].desc)
            {
                data.sort((a,b) => 
                    {
                        if(!isNaN(b[sortKey]) && !isNaN(a[sortKey]))
                        {
                           // console.log('sorted desc int');
                            return parseInt(b[sortKey]) - parseInt(a[sortKey]);
                        }
                       // console.log('sorted desc str');
                        return b[sortKey].localeCompare(a[sortKey])
                    }
                )
            }
            else
            {
                data.sort((a,b) => 
                    {
                        if(!isNaN(b[sortKey]) && !isNaN(a[sortKey]))
                        {
                            return parseInt(a[sortKey]) - parseInt(b[sortKey]);
                        }
                       return  a[sortKey].localeCompare(b[sortKey])
                    }
                )
            }
        }                
        this.setState({  exportDataSetForDisplay: data })
        return data
    }
    
  handleChangeStartPick = date => {
    //const dateFormat = 'YYYY-MM-DD HH:mm:ss';    

   // moment.locale('en');  
    this.setState({
        startDatePick: date
      });    
   // var newDate = moment(date).format(dateFormat);
   // console.log(newDate);   
    //const timeFormat = 'HH:mm:ss';
    //console.log(moment(this.state.startDatePick).format(timeFormat))   
  };

  handleChangeEndPick= date => {
    this.setState({
        endDatePick: date             
      });
  };
           
  getShipmentByRange() {
        const dateFormat = 'YYYY-MM-DD';          
        const timeFormat = 'HH:mm:ss';
              
        var newDateStart = moment.utc(this.state.startDatePick).format(dateFormat)
                       +'T'+ moment.utc(this.state.startDatePick).format(timeFormat)
                       +'Z';
        console.log(newDateStart);                       
        var newDateEnd= moment.utc(this.state.endDatePick).format(dateFormat)
                       +'T'+ moment.utc(this.state.endDatePick).format(timeFormat)
                       +'Z';
        console.log(newDateEnd);
        this.setState({ // clear initial set, not append.
            exportDataSet: []
        })
        if (newDateStart === newDateEnd)
        {
            var badEntry = 'Please select End Time after Start Time.'
            this.setState({shipDisplay: badEntry})  
            return;
        }
        var dispCountloading = 'Loading...'
        this.setState({shipDisplay: dispCountloading})  
        this.setState({ loadingshipment: true }, () => {
            
            this.shipmentsSrv.getShipmentsByDates(newDateStart, newDateEnd)
                .then((res) => {
                    return res.json()
                }
                )
                .then((result) => {
                                        
                    this.setState({ // clear initial set, not append.
                        exportDataSet: []
                    })
                    
                    if (result[0] && result.length > 0) {
                        let myCount=0
                        let buildingSet=[] ;
                        for (let index = 0; index < result.length; index++) {
                            const element = result[index];
                            if( index < 10 || index % 100 === 1)
                            {
                                console.log(element);
                            }

                            //this.setState({ shipment: element})
                            let destinationAndLocation =((element.destinationLocation == null) ? '' :element.destinationLocation)                           
                            var destLocationLine = {
                                destination :((destinationAndLocation.name == null) ? '' :destinationAndLocation.name),
                                type :((destinationAndLocation.type == null) ? '' : destinationAndLocation.type)
                            }
                            var sanLine = ( (element.authorizationCode== null) 
                                ? '['+element.userShipmentId+']'
                                : element.authorizationCode )
                            if(element.products.length >0)
                            {
                                for (let innerIndex = 0; innerIndex < element.products.length; innerIndex++) {
                                    const prod = element.products[innerIndex];
                                                                        
                                    let shipmentLine = {
                                        shipmentAuthorizationNumber: sanLine,
                                        userShipmentId:  element.userShipmentId,
                                        cartonDestination: destLocationLine.destination,
                                        destinationType: destLocationLine.type,
                                        prodStatus: element.status,
                                        //dateCreated: moment(element.dateCreated).format("YYYY-MM-DD HH:mm"),                                        
                                        //dateModified: moment(element.dateModified).format("YYYY-MM-DD HH:mm"),
                                        datePacked :(element.datePacked == null ? 
                                             moment(element.dateCreated).format("YYYY-MM-DD HH:mm")
                                           : moment(element.datePacked ).format("YYYY-MM-DD HH:mm") ),
                                        dateShipped : (element.dateShipped == null ? 
                                                        '' : moment(element.dateShipped).format("YYYY-MM-DD HH:mm")),
                                        productType:  prod.productType.name,
                                        userProductId:  prod.userProductId ,                                        
                                        datePackedUnix:(element.datePacked == null ? 0+ moment(element.dateCreated).unix()
                                                                                   : 0+ moment(element.datePacked ).unix() ),
                                        dateShippedUnix: 0+ moment(element.dateShipped).unix()
                                    }        
                                    buildingSet = buildingSet.concat(shipmentLine);                                   
                                      myCount = myCount+1                                      
                                }
    
                            }                            
                        } //end for    
                        
                        // Default sort results on Carton Id and then ArticleId
                        buildingSet.sort((a, b) =>
                         (a.userShipmentId > b.userShipmentId) ?
                             1 : (a.userShipmentId === b.userShipmentId) ?
                                     ((a.userProductId > b.userProductId) ? 1 : -1) : -1 )
                        
                        this.setState({ exportDataSetForDisplay:  buildingSet })
                        this.setState({ exportDataSet: buildingSet })

                        let dispCount = myCount+' Records Found'                         
                        this.setState({shipDisplay: dispCount})
                        this.setState({foundRecords: (myCount !== 0) })
                        this.setState({loadingshipment: false})
                        console.log(this.state.foundRecords+': ' + dispCount);                        
                    } 
                    else
                    {
                        console.log('sent but no result');
                        const dispCount0 = '0 Records Found'                         
                        this.setState({shipDisplay: dispCount0})                        
                        this.setState({foundRecords: false})
                        this.setState({loadingshipment: false})
                          this.setState({
                            exportDataSet: [],
                            exportDataSetForDisplay: []
                          })
                    }

                },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        
                        console.error('error! '+ error);
                        this.setState({
                            loadingshipment: false,
                            shipment: [],
                            error: error,
                            foundRecords: false
                        })  
                        //this.setState({
                        //    exportDataSet: [],
                         //   exportDataSetForDisplay: []
                         // })   
                          this.setState({shipDisplay: 'Error fetching data.'})
                                             
                    }
                ).catch(function (reason) { // this context is not passed into the function
                    this.setState({
                        loadingshipment: false,
                        shipment: [],
                        error: reason,
                        foundRecords: false
                    })
                });
        })
        }   
    }

ShipReport.propTypes = {
    auth: PropTypes.object
};

export default ShipReport;