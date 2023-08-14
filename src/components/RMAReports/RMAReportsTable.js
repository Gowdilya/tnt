import React, { useState, useEffect } from "react";
//import "./rmaRequests.scss";
import Container from "react-bootstrap/Container";
import moment from "moment";
import ReturnsSrv from "../../services/returns_srv";
import UsersSrv from "../../services/user_srv";
import Button from "@material-ui/core/Button";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import BouncyLoader from "../Shared/components/Loaders/BouncyLoader";
import ErrorMessage from "../Shared/components/ErrorMessage";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import * as Disposition from "../Shared/constants/ReturnDispositions";
import PageviewIcon from "@material-ui/icons/Pageview";
import HistoryIcon from "@material-ui/icons/History";
import ReactExport from "react-export-excel";
import GetAppIcon from '@material-ui/icons/GetApp';


import "./rmaReports.scss";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function RMAReportsTable(props) {
  const [returns, setReturns] = useState({
    data: null,
    loading: false,
    error: "",
  });
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [sortedTableData, setSortedData] = useState(null);

 // const [sort, setSort] = useState([{ id: "disposition", desc: true }]);
  const [triggerLoadUsers, SetTriggerLoadUsers] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [row, setRow] = useState(null);

  const useMountEffect = (fun) => useEffect(fun, []); //Call function once on component mount

  const loadData = () => {
    const returnsSrv = new ReturnsSrv(props.auth);
    setReturns({ data: null, loading: true, error: "" });
    returnsSrv
      .getAll()
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((result) => {
        if (result) {
          setReturns({ data: result, loading: false, error: "" });
          SetTriggerLoadUsers(true);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setReturns({
          data: null,
          loading: false,
          error: "Load Status Report Error: " + error.message,
        });
      });
  };

  const handleButtonClick = () => {
    //Returns the orignal data used to generate the Row
    props.rowSelect(row.original);
  };
  const handleInfoButtonClick = () => {
    //Returns the orignal data used to generate the Row
    props.selectRMA(row.original);
  };
  // const loadUserData = () =>{
  //     const usersSrv = new UsersSrv(props.auth);
  //     //setReturns({ data:null, loading:true, error: ''});
  //     usersSrv.getUser('google-oauth2|110352718416895647193').then((res) => {
  //                         if(res.status >= 200 && res.status <= 299){
  //                             return res.json()
  //                         }else{
  //                             throw Error(res.statusText);
  //                         }
  //                     })
  //                     .then((result) => {
  //                     if(result){
  //                             //setReturns({data: result, loading:false});
  //                             console.log(result);
  //                         }
  //                     }).catch((error) =>{
  //                         console.log('error', error)
  //                         //setReturns({ data:null, loading:false, error: 'Load Product Error:' + error.message});
  //                     });
  //     }

  //useMountEffect(loadUserData);

  useEffect(() => {
    const loadAllUserData = () => {
      const usersSrv = new UsersSrv(props.auth);
      //setReturns({ data:null, loading:true, error: ''});
      usersSrv
        .getAll()
        .then((res) => {
          if (res.status >= 200 && res.status <= 299) {
            return res.json();
          } else {
            throw Error(res.statusText);
          }
        })
        .then((result) => {
          if (result) {
            var newRet;
            newRet = [...returns.data];
            returns.data.map((rma, id) => {
              var user = result.find((user) => user.id === rma.requestUserId);
              if (user) {
                newRet[id] = {
                  ...returns.data[id],
                  requestUserEmail: user.email,
                };
              } else {
                newRet[id] = { ...returns.data[id], requestUserEmail: "" };
              }
            });
            setReturns({ data: newRet, loading: false, error: "" });
            setShowTable(true);
            
          }
        })
        .catch((error) => {
          console.log("error", error);
          setReturns({
            data: null,
            loading: false,
            error: "Load User Data Error: " + error.message,
          });
        });
    };
    if (triggerLoadUsers === true) {
      loadAllUserData();
      SetTriggerLoadUsers(false);
      
    }
  }, [returns.data, props.auth, SetTriggerLoadUsers, triggerLoadUsers, setShowTable]);
  
  useMountEffect(loadData);

  // const filterMethod = (filter, row, column) => {
  //   const id = filter.pivotId || filter.id;
  //   return row[id] !== undefined
  //     ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
  //     : true;
  //   //return row[id] !== undefined ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase()) : true
  // };

  const getExportData = () => {
    // var rowsToDisplay = sortedTableData;
    // if (filter.length > 0) {
    //   let etFilter = filter[0].id;
    //   let etValue = filter[0].value;
    //   // console.log(etFilter+'  ' +etValue);
    //   rowsToDisplay = sortedTableData.filter(function (ary) {
    //     // console.log(ary[etFilter]+'?=' +etValue);
    //     //console.log(( String(ary[etFilter]) ).lastIndexOf( String(etValue), 0));
    //     return (
    //       ary[etFilter] === etValue ||
    //       etValue === "*" ||
    //       String(ary[etFilter]).lastIndexOf(String(etValue), 0) === 0
    //     ); // is StartsWith
    //   });
    // }
    // // console.log(this.state.sorted);
    // console.log(rowsToDisplay);
    // const data = rowsToDisplay;
    // console.log(sort);
    // if (sort.length > 0) {
    //   console.log(sort[0].id);
    //   const sortKey = sort[0].id;

    //   if (sort[0].desc) {
    //     data.sort((a, b) => {
    //       if (!isNaN(b[sortKey]) && !isNaN(a[sortKey])) {
    //         // console.log('sorted desc int');
    //         return parseInt(b[sortKey]) - parseInt(a[sortKey]);
    //       }
    //       // console.log('sorted desc str');
    //       return b[sortKey].localeCompare(a[sortKey]);
    //     });
    //   } else {
    //     data.sort((a, b) => {
    //       if (!isNaN(b[sortKey]) && !isNaN(a[sortKey])) {
    //         return parseInt(a[sortKey]) - parseInt(b[sortKey]);
    //       }
    //       return a[sortKey].localeCompare(b[sortKey]);
    //     });
    //   }
    // }
    // console.log(data);

    return sortedTableData;
  };

  return (
    <Container className="rma-action-container">
      <ErrorMessage
        show={returns.error !== ""}
        errorMessage={returns.error}
      ></ErrorMessage>
      {returns.loading  ? (
        <BouncyLoader></BouncyLoader>
      ) : returns.data && showTable? (
        <div>
          <ReactTable
            data={returns.data}
            columns={[
              {
                Header: "RMA Status Reports",
                columns: [
                  {
                    Header: "Lock ID",
                    accessor: (d) => d.product.userProductId,
                    id: "iD",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                    filterMethod: (filter, row) =>{
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined
                        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true;
                    }
                  },
                  {
                    Header: "RMA #",
                    accessor: (d) => d.userReturnId,
                    id: "userReturnId",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                    filterMethod: (filter, row) =>{
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined
                        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true;
                    }
                  },
                  {
                    Header: "Request Date",
                    accessor: (d) => {
                      return moment(d.dateCreated).format("YYYY-MM-DD");
                    },
                    id: "dateCreated",
                    sortMethod: (a, b) => {
                      console.log(a);

                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                    filterMethod: (filter, row) =>{
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined
                        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true;
                    }
                  },
                  {
                    Header: "Requester",
                    accessor: (d) => d.requestUserEmail,
                    id: "email",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                    filterMethod: (filter, row) =>{
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined
                        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true;
                    }
                  },
                  {
                    Header: "Disposition",
                    accessor: (d) => d.disposition,
                    id: "disposition",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                    filterMethod: (filter, row) =>{
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined
                        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true;
                    }
                  },

                  {
                    Header: "Issue Reported",
                    accessor: (d) =>{ return d.information.filter((info) => 
                   info.type === "MainIssue")[0].description},
                    id: "maindescription",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                    filterMethod: (filter, row) =>{
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined
                        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true;
                    }
                  },
                  {
                    Header: "Other Observations",
                    accessor: (d) =>{ return ( d.information.filter((info) => 
                      info.type === "FaultIndication").map( info => info.description) ).join(",  ")}
                      ,
                    id: "otherObservation",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                    filterMethod: (filter, row) =>{
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined
                        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true;
                    }
                  },

                  // {
                  //   width: 350,
                  //   Header: "Status",
                  //   //accessor: (d) => d.actions,
                  //   accessor: data => {
                  //     let output = [];

                  //     if (data.actions ){
                  //       data.actions.forEach( action => {
                  //           output.push(Status_Texts[action]);
                  //       });
                  //   }
                  //     return output.join(', ');
                  //   },
                  //   id: "status",
                  //   sortMethod: (a, b) => {
                  //     if (!isNaN(a) && !isNaN(b)) {
                  //       return parseInt(a) - parseInt(b);
                  //     }
                  //     return a > b ? 1 : -1;
                  //   },
                  // },
                ],
              },
            ]}
            defaultPageSize={10}
            filterable
            filtered={filter}
            onFilteredChange={(filtered) => setFilter(filtered)}
            sorted={sort}
            onSortedChange={(sorted) => setSort(sorted)}
            //resolveData={data => data.map(row => console.log(row))}
            //defaultFilterMethod={filterMethod}
            onFetchData={(state)=>{setSortedData(state.sortedData)}}
            getTrProps={(state, rowInfo) => {
              //Not Sure why but state needs to be the first parameter to work
              
              if (rowInfo && rowInfo.row) {
                return {
                  onClick: (e) => {
                    if (
                      row &&
                      row.index === rowInfo.index
                      //rowInfo.original.disposition === Disposition.CLOSED ||
                      //rowInfo.original.disposition === Disposition.CANCELLED
                    ) {
                      setRow(null);
                    } else {
                      setRow(rowInfo);
                    }
                  },

                  style: {
                    background:
                      row && rowInfo.index === row.index
                        ? "#ed1a39"
                        : rowInfo.original.disposition === Disposition.CANCELLED
                        ? "#ffb74d"
                        : rowInfo.original.disposition === Disposition.CLOSED
                        ? "#81c784"
                        : "white",
                    color:
                      row && rowInfo.index === row.index ? "white" : "black",
                  },
                };
              } else {
                return {};
              }
            }}
          >
            {(state, makeTable, instance) => {
              let recordsInfoText = "";

              const { filtered, pageRows, pageSize, sortedData, page } = state;


              if (sortedData && sortedData.length > 0) {
                let isFiltered = filtered.length > 0;

                let totalRecords = sortedData.length;

                let recordsCountFrom = page * pageSize + 1;

                let recordsCountTo = recordsCountFrom + pageRows.length - 1;

                if (isFiltered)
                  recordsInfoText = `${recordsCountFrom}-${recordsCountTo} of ${totalRecords} filtered records`;
                else
                  recordsInfoText = `${recordsCountFrom}-${recordsCountTo} of ${totalRecords} records`;
              } else recordsInfoText = "No records";

              return (
                <div className="main-grid">
                  <div className="above-table text-right">
                    <div className="col-sm-12">
                      <span className="records-info">{recordsInfoText}</span>
                    </div>
                  </div>

                  {makeTable()}
                </div>
              );
            }}
          </ReactTable>
          <div className="button-panel">
            {returns.data ? (
              <ExcelFile
                element={
                  <Button className="update-button show" variant="contained">
                    <GetAppIcon /> Export Data
                  </Button>
                }
              >
                <ExcelSheet data={getExportData} name="RMA Report">
  
                  <ExcelColumn
                    label="Lock ID"
                    value="iD"
                  />
                  <ExcelColumn
                    label="RMA #"
                    value="userReturnId"
                  />
                  <ExcelColumn
                    label="Request Date"
                    value="dateCreated"
                  />
                  <ExcelColumn
                    label="Requester"
                    value="email"
                  />
                  <ExcelColumn
                    label="Disposition"
                    value="disposition"
                  />

                  <ExcelColumn
                    label="Issue Reported"
                    value="maindescription"
                  />
                  <ExcelColumn
                    label="Other Observations"
                    value="otherObservation"
                  />

                </ExcelSheet>
              </ExcelFile>
            ) : (
              <Button className="update-button " variant="contained" disabled>
                <GetAppIcon /> Export Data
              </Button>
            )}

            {row ? (
              <Button
                className="update-button show"
                variant="contained"
                onClick={handleButtonClick}
              >
                <HistoryIcon /> Action History
              </Button>
            ) : (
              <Button className="update-button " variant="contained" disabled>
                <HistoryIcon /> ActionHistory
              </Button>
            )}
            {row ? (
              <Button
                className="update-button show"
                variant="contained"
                onClick={handleInfoButtonClick}
              >
                <PageviewIcon /> RMA Info
              </Button>
            ) : (
              <Button className="update-button " variant="contained" disabled>
                <PageviewIcon />
                RMA Info
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </Container>
  );
}
