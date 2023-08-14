import React, { useState, useEffect } from "react";
//import "./rmaRequests.scss";
import Container from "react-bootstrap/Container";
import moment from "moment";
import ProductsSrv from "../../../services/products_srv";
//import Button from "@material-ui/core/Button";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import BouncyLoader from "../../Shared/components/Loaders/BouncyLoader";
import ErrorMessage from "../../Shared/components/ErrorMessage";
//import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
//import ReactExport from "react-export-excel";
//import GetAppIcon from '@material-ui/icons/GetApp';

import "./ArticleTable.scss";
//const ExcelFile = ReactExport.ExcelFile;
//const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
//const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ArticleTable(props) {
  const [articles, setArticle] = useState({
    data: null,
    loading: false,
    error: "",
  });
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
//  const [sortedTableData, setSortedData] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [row, setRow] = useState(null);

  //const useMountEffect = (fun) => useEffect(fun, []); //Call function once on component mount

  
  //UseMountEffect(loadData); // suggest comment out. Move definition of loadData()

  const [refreshFlag, setRefreshFlag] = useState(false);
  useEffect(() => {
    const loadData = () => {
      const productSrv = new ProductsSrv(props.auth);
      setArticle({ data: null, loading: true, error: "" });
      productSrv
        .getAll()
        .then((res) => {
          if (res.status >= 200 && res.status <= 299) {
            setRefreshFlag(false);
            return res.json();
          } else {
            throw Error(res.statusText);
          }
        })
        .then((result) => {
          if (result) 
          {
            //console.log(result);
            setShowTable(true)
            setArticle({ data: result, loading: false, error: "" });
            setSort( [{desc: true, id: "dateCreated"}], );
            props.setArticle (result)
          }
        })
        .catch((error) => {
          console.log("error", error);
          setArticle({
            data: null,
            loading: false,
            error: "Load Status Report Error: " + error.message,
          });
        });
    };    
    console.log("table useEffect with props.flag= "+props.refreshFlag)
    if ( props.refreshFlag) {
      loadData();
    }
  }, [props.refreshFlag, props.auth]);
  
  // const filterMethod = (filter, row, column) => {
  //   const id = filter.pivotId || filter.id;
  //   return row[id] !== undefined
  //     ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
  //     : true;
  //   //return row[id] !== undefined ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase()) : true
  // };

//  const getExportData = () => {   
  //  return sortedTableData;
  //};

  return (
    <Container className="article-container">
      <ErrorMessage
        show={articles.error !== ""}
        errorMessage={articles.error}
      ></ErrorMessage>
      {articles.loading  ? (
        <BouncyLoader></BouncyLoader>
      ) : articles.data && showTable ? (
        <div>
          <ReactTable
            data={articles.data}
            columns={[
              {
                Header: "All Articles",
                columns: [
                  {
                    Header: "ID",
                    accessor: (d) => d.userProductId,
                    id: "ID",
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
                    Header: "Type",
                    accessor: (d) => d.productType.name,
                    id: "productType",
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
                    Header: "Create Date",
                    accessor: (d) => {
                      return moment(d.dateCreated).format("YYYY-MM-DD");
                    },
                    id: "dateCreated",
                    sortMethod: (a, b) => {
                      //console.log(a);

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
                    Header: "Location",
                    accessor: (d) => d.location.name,
                    id: "location",
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
            //onFetchData={(state)=>{setSortedData(state.sortedData)}}
            getTrProps={(state, rowInfo) => {
              //Not Sure why but state needs to be the first parameter to work
              
              if (rowInfo && rowInfo.row) {
                return {
                  onClick: (e) => {
                    if (
                      row &&
                      row.index === rowInfo.index                      
                    ) {
                      setRow(null);
                    } else {
                      setRow(rowInfo);
                    }
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

              //console.log(sort)
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
        </div>
      ) : 
     
      //null
      console.log(articles.data)
      }
    </Container>
  );
}
