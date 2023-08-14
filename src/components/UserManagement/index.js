import React, { useState, useEffect } from "react";
import "./userManagement.scss";
import UserSrv from "./../../services/user_srv";
import { useTable } from "react-table";
import ReactTable from "react-table-6";
import moment from "moment";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import BouncyLoader from "../Shared/components/Loaders/BouncyLoader";
import CreateUserPage from "./CreateUserPage";
import EditRolePage from "./EditRolesPage";
import ErrorMessage from "../Shared/components/ErrorMessage";

export default function UserManagement(props) {
  const [users, setUsers] = useState({ data: null, loading: false, error: "" });
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [activeMode, setMode] = useState(0);
  const [row, setRow] = useState(null);
  const [sortedTableData, setSortedData] = useState(null);

  useEffect(() => {
    const loadAllUserData = () => {
      setUsers({ loading: true, error: "" });
      const userSrv = new UserSrv(props.auth);

      userSrv
        .getAll()
        .then((res) => {
          if (res.status >= 200 && res.status <= 299) {
            return res.json();
          } else {
            throw Error(res.statusText);
          }
        })
        .then((result) => {
          setUsers({ data: result, loading: false, error: "" });
        })
        .catch((error) => {
          setUsers({ loading: false, error: error.message });
          console.log("error", error);
        });
    };

    loadAllUserData();
  }, [props.auth]);

  const handleCreateUserClick = () => {
    //Create User
    setMode(2);
  };

  const handleEditRolesClick = () => {
    //Edit Roles
    setMode(1);
  };

  const handleBackClick = () => {
    setMode(0);
  };

  const displaySelectedStep = () => {
    if (activeMode === 0) {
      return (
        <div className="user-management">
          <ErrorMessage
            show={users.error !== ""}
            errorMessage={users.error}
          ></ErrorMessage>
          <div>
            {users.loading ? (
              <BouncyLoader></BouncyLoader>
            ) : users.data ? (
              <>
                <ReactTable
                  data={users.data}
                  columns={[
                    {
                      Header: "User Management",
                      columns: [
                        {
                          Header: "Users",
                          accessor: (d) => d.email,
                          id: "iD",
                          sortMethod: (a, b) => {
                            if (!isNaN(a) && !isNaN(b)) {
                              return parseInt(a) - parseInt(b);
                            }
                            return a > b ? 1 : -1;
                          },
                          filterMethod: (filter, row) => {
                            const id = filter.pivotId || filter.id;
                            return row[id] !== undefined
                              ? String(row[id].toLowerCase()).startsWith(
                                  filter.value.toLowerCase()
                                )
                              : true;
                          },
                        },
                        {
                          Header: "First Name",
                          accessor: (d) => d.firstName,
                          id: "firstName",
                          sortMethod: (a, b) => {
                            if (!isNaN(a) && !isNaN(b)) {
                              return parseInt(a) - parseInt(b);
                            }
                            return a > b ? 1 : -1;
                          },
                          filterMethod: (filter, row) => {
                            const id = filter.pivotId || filter.id;
                            return row[id] !== undefined
                              ? String(row[id].toLowerCase()).startsWith(
                                  filter.value.toLowerCase()
                                )
                              : true;
                          },
                        },
                        {
                          Header: "Last Name",
                          accessor: (d) => d.lastName,
                          id: "lastName",
                          sortMethod: (a, b) => {
                            if (!isNaN(a) && !isNaN(b)) {
                              return parseInt(a) - parseInt(b);
                            }
                            return a > b ? 1 : -1;
                          },
                          filterMethod: (filter, row) => {
                            const id = filter.pivotId || filter.id;
                            return row[id] !== undefined
                              ? String(row[id].toLowerCase()).startsWith(
                                  filter.value.toLowerCase()
                                )
                              : true;
                          },
                        },
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
                          filterMethod: (filter, row) => {
                            const id = filter.pivotId || filter.id;
                            return row[id] !== undefined
                              ? String(row[id].toLowerCase()).startsWith(
                                  filter.value.toLowerCase()
                                )
                              : true;
                          },
                        },
                        {
                          Header: "Date Modified",
                          accessor: (d) => {
                            return moment(d.dateModified).format("YYYY-MM-DD");
                          },
                          id: "dateModified",
                          sortMethod: (a, b) => {
                            console.log(a);

                            if (!isNaN(a) && !isNaN(b)) {
                              return parseInt(a) - parseInt(b);
                            }
                            return a > b ? 1 : -1;
                          },
                          filterMethod: (filter, row) => {
                            const id = filter.pivotId || filter.id;
                            return row[id] !== undefined
                              ? String(row[id].toLowerCase()).startsWith(
                                  filter.value.toLowerCase()
                                )
                              : true;
                          },
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
                  onFetchData={(state) => {
                    setSortedData(state.sortedData);
                  }}
                  getTrProps={(state, rowInfo) => {
                    //Not Sure why but state needs to be the first parameter to work

                    if (rowInfo && rowInfo.row) {
                      return {
                        onClick: (e) => {
                          if (row && row.index === rowInfo.index) {
                            setRow(null);
                          } else {
                            setRow(rowInfo);
                          }
                        },

                        style: {
                          background:
                            row && rowInfo.index === row.index
                              ? "#ed1a39"
                              : // : rowInfo.original.disposition === Disposition.CANCELLED
                                // ? "#ffb74d"
                                // : rowInfo.original.disposition === Disposition.CLOSED
                                // ? "#81c784"
                                "white",
                          color:
                            row && rowInfo.index === row.index
                              ? "white"
                              : "black",
                        },
                      };
                    } else {
                      return {};
                    }
                  }}
                >
                  {(state, makeTable, instance) => {
                    let recordsInfoText = "";

                    const {
                      filtered,
                      pageRows,
                      pageSize,
                      sortedData,
                      page,
                    } = state;

                    if (sortedData && sortedData.length > 0) {
                      let isFiltered = filtered.length > 0;

                      let totalRecords = sortedData.length;

                      let recordsCountFrom = page * pageSize + 1;

                      let recordsCountTo =
                        recordsCountFrom + pageRows.length - 1;

                      if (isFiltered)
                        recordsInfoText = `${recordsCountFrom}-${recordsCountTo} of ${totalRecords} filtered records`;
                      else
                        recordsInfoText = `${recordsCountFrom}-${recordsCountTo} of ${totalRecords} records`;
                    } else recordsInfoText = "No records";

                    return (
                      <div className="main">
                        <div className="above-table text-right">
                          <div className="record-container col-sm-12">
                            <span className="records-info">
                              {recordsInfoText}
                            </span>
                          </div>
                        </div>

                        {makeTable()}
                      </div>
                    );
                  }}
                </ReactTable>
                <div className="button-panel">
                  <Button
                    className="update-button show"
                    variant="contained"
                    onClick={handleCreateUserClick}
                  >
                    Create User <PersonAddIcon />
                  </Button>
                  
                  {row ? (
                    <Button
                      className="update-button show"
                      variant="contained"
                      onClick={handleEditRolesClick}
                    >
                      Edit Roles <EditIcon />
                    </Button>
                  ) : (
                    <Button
                      className="update-button "
                      variant="contained"
                      disabled
                    >
                      Edit Roles <EditIcon />
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="button-panel">
                <Button
                  className="update-button show"
                  variant="contained"
                  onClick={handleCreateUserClick}
                >
                  Create User <PersonAddIcon />
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }
    if (activeMode === 1) {
      return (
        <EditRolePage back={handleBackClick} auth={props.auth} row={row} />
      );
    }
    if (activeMode === 2) {
      return <CreateUserPage back={handleBackClick} auth={props.auth} />;
    }
  };
  return <>{displaySelectedStep()}</>;
}
