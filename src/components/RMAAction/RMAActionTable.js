import React, { useState, useEffect } from "react";
import "./rmaRequests.scss";
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

export default function RMAActionTable(props) {
  const [returns, setReturns] = useState({
    data: null,
    loading: false,
    error: "",
  });
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([{id: "disposition", desc: true}]);
  const [triggerLoadUsers, SetTriggerLoadUsers] = useState(false);
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
  }, [returns.data, props.auth, SetTriggerLoadUsers, triggerLoadUsers]);

  useMountEffect(loadData);

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id
    return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true
    //return row[id] !== undefined ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase()) : true
  }


  return (
    <Container className="rma-action-container">
      <ErrorMessage
        show={returns.error !== ""}
        errorMessage={returns.error}
      ></ErrorMessage>
      {returns.loading ? (
        <BouncyLoader></BouncyLoader>
      ) : returns.data ? (
        <div>
          <ReactTable
            data={returns.data}
            columns={[
              {
                Header: "RMA Status Reports",
                columns: [
                  {
                    Header: "Date Created",
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
                  },
                  {
                    Header: " Lock ID",
                    accessor: (d) => d.product.userProductId,
                    id: "iD",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                  },
                  {
                    Header: "Main Issue",
                    accessor: (d) =>{ return d.information.filter((info) => 
                      info.type === "MainIssue")[0].description},
                    id: "maindescription",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
                  },
                  {
                    Header: "Requester Email",
                    accessor: (d) => d.requestUserEmail,
                    id: "email",
                    sortMethod: (a, b) => {
                      if (!isNaN(a) && !isNaN(b)) {
                        return parseInt(a) - parseInt(b);
                      }
                      return a > b ? 1 : -1;
                    },
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
            defaultFilterMethod={filterMethod}
            getTrProps={(state, rowInfo) => {
              //Not Sure why but state needs to be the first parameter to work
              if (rowInfo && rowInfo.row) {
                return {
                  onClick: (e) => {
                    if (
                      (row && row.index === rowInfo.index) ||
                      rowInfo.original.disposition === Disposition.CLOSED ||
                      rowInfo.original.disposition === Disposition.CANCELLED
                    ) {
                      setRow(null);
                    } else {
                      setRow(rowInfo);
                    }
                    
                  },
                    
                  style: {
                    background: row && rowInfo.index === row.index ? "#ed1a39" :(rowInfo.original.disposition === Disposition.CANCELLED? '#ffb74d' : (rowInfo.original.disposition === Disposition.CLOSED? '#81c784':'white')),
                    color: row && rowInfo.index === row.index ? "white" : "black",
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
            {row ? (
              <Button
                className="update-button show"
                variant="contained"
                onClick={handleButtonClick}
              >
                Next <ArrowForwardIosIcon />
              </Button>
            ) : (
              <Button className="update-button " variant="contained" disabled>
                Next <ArrowForwardIosIcon />
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </Container>
  );
}
