import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import "./app.scss";
import MaterialTitlePanel from "./material_title_panel";
import SidebarContent from "./sidebar_content";
import Returns from "../Returns/index";
import Products from "../Products";
import ProductTypes from "../ProductCatalog/product_types";
import Home from "./home";
import Locations from "../Locations";
import Packing from "../Packing";
import PreShipping from "../PreShipping";
import RMARequest from "../RMARequests";
import Shipping from "../Shipping";
import ShipReport from "../ShipmentReports";
import ManageListWrapper from "../Returns/managelists";
import NotFound from "./notfound";
import Callback from "../Shared/components/CallBack";
import PrivateRoute from "./private_route";
import sera from "../../assets/images/sera4logo.png";
import Menu from "@material-ui/icons/Menu";
import Parser from "../Shared/Parser";
import IconButton from "@material-ui/core/IconButton";
import RMAAction from "../RMAAction";
import RMAReports from "../RMAReports";
import Binding from "../Binding";
import UserManagement from "../UserManagement";
import Inventory from "../inventory";

import AccessControl from "../Shared/components/AccessControl";
import AccessControlR from "../Shared/components/AccessControlR";
//import * as Permissions from "../Shared/constants/Permissions";
import * as Roles from "../Shared/constants/Roles";

import { useRecoilState } from "recoil";
import { rolesState } from "../../atoms/roles";
import UsersService from "../../services/user_srv";
import ErrorMessage from "../Shared/components/ErrorMessage";
import PrepareData from "../PrepareData";

const mql = window.matchMedia(`(min-width: 800px)`);

const styles = {
  contentHeaderMenuLink: {
    textDecoration: "none",
    color: "white",
    padding: 4,
  },
  content: {
    padding: "16px",
  },
};

function App(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthWithRolesLoaded, setIsAuthWithRolesLoaded] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [sideBarDocked, setSideBardDocked] = useState(mql.matches);
  const [error, setError] = useState("");

  //Recoil
  //const [permissions, setPermissions] = useRecoilState(permissionsState);
  const [roles, setRoles] = useRecoilState(rolesState);

  const useMountEffect = (fun) => useEffect(fun, []); //Call function once on component mount

  const loadRoles = () => {
    const usersSrv = new UsersService(props.auth);
    var user = Parser.getUserID(props.auth);

    usersSrv
      .getCurrentUserRoles()
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result) {
          setRoles(result);
          setIsAuthWithRolesLoaded(isAuthenticated && true);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setError("FAILED to LOAD USER ROLES:" + error.message);
      });

    //setPermissions(permissions);
  };
  //useMountEffect(loadPermissions);

  const toggleOpen = (ev) => {
    setSideBarOpen(!sideBarOpen);

    if (ev) {
      ev.preventDefault();
    }
  };
  const handleAuth = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      props.auth
        .handleAuthentication()
        .then((auth) => {
          setIsAuthenticated(props.auth.isAuthenticated());
          loadRoles();
          //this.setState({ isAuthenticated: this.props.auth.isAuthenticated() });
        })
        .catch((error) => {
          console.log("handle auth error");
        });
    }
  };

  const mediaQueryChanged = () => {
    setSideBardDocked(mql.matches);
    setSideBarOpen(false);
  };

  useEffect(() => {
    // component mounted

    mql.addListener(mediaQueryChanged);
    return () => {
      //called before unmounting
      mql.removeListener(mediaQueryChanged);
      console.log("unsubscribe ");
    };
  }, [props.auth]);

  const sidebar = (
    <SidebarContent auth={props.auth} isAuthenticated={isAuthenticated} />
  );

  const onSetOpen = (open) => {
    setSideBarOpen(open);
  };

  const sidebarProps = {
    sidebar,
    docked: sideBarDocked,
    open: sideBarOpen,
    onSetOpen: onSetOpen,
  };

  const contentHeader = (
    <span>
      <div className="sera-logo">
        <img width="120" src={sera} alt="sera4logo" />
      </div>

      {!sideBarDocked && (
        <span>
          <IconButton
            onClick={toggleOpen}
            href="#!"
            style={styles.contentHeaderMenuLink}
          >
            <Menu className="menu-button"></Menu>
          </IconButton>
        </span>
      )}
      <span className="App-Title">Tracking & Traceability </span>
      <ErrorMessage show={error !== "" ? true : false} errorMessage={error}>
        {" "}
      </ErrorMessage>
    </span>
  );

  return (
    <Sidebar {...sidebarProps}>
      <MaterialTitlePanel title={contentHeader}>
        <div style={styles.content}>
          {isAuthenticated ? (
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return <Home isAuthenticated={isAuthenticated} />;
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/usermanagement"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.USER_ADMIN_MODULE}
                    >
                      <UserManagement auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/catalog/products"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.CATALOG_MODULE}
                    >
                      <ProductTypes auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/inventory"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.INVENTORY_MODULE}
                    >
                      <Inventory auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/locations"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.LOCATIONS_MODULE}
                    >
                      <Locations auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/diagnostics"
                render={() => {
                  return <Returns auth={props.auth} />;
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/rmarequest"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.RMA_REQUEST_MODULE}
                    >
                      <RMARequest auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/rmaaction"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.RMA_ACTION_MODULE}
                    >
                      <RMAAction auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/rmareports"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.RMA_REPORTS_MODULE}
                    >
                      <RMAReports auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/returns/managelists"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.RMA_ADMIN_MODULE}
                    >
                      <ManageListWrapper auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/shipping"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.SHIPPING_MODULE}
                    >
                      <Shipping auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/preshipping"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.SHIPPING_MODULE}
                    >
                      <PreShipping auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/sub-article"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.BINDING_MODULE}
                    >
                      <Binding auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              {/* {permissions?
                         <AccessControl userPermissions={permissions} requiredPermissions={Permissions.PACKING}>   */}
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/packing"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.PACKING_MODULE}
                    >
                      <Packing auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />
              {/* </AccessControl>  :<div>loading...</div>} */}

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/ShipReport"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.LOGISTICS_REPORTS_MODULE}
                    >
                      <ShipReport auth={props.auth} />
                    </AccessControlR>
                  );
                }}
              />

              <PrivateRoute
                isAuthenticated={isAuthenticated}
                path="/prepare-data"
                render={() => {
                  return (
                    <AccessControlR
                      userRoles={roles}
                      allowedRoles={Roles.ML_MODULE}
                    >
                      <PrepareData auth={props.auth}></PrepareData>
                    </AccessControlR>
                  );
                }}
              />

              <Route
                path="/callback"
                render={(props) => {
                  return (
                    <Callback routeProps={props} handleAuth={handleAuth} />
                  );
                }}
              />

              <Route component={NotFound} />
            </Switch>
          ) : (
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return <Home isAuthenticated={isAuthenticated} />;
                }}
              />
              <Route
                path="/callback"
                render={(props) => {
                  return (
                    <Callback routeProps={props} handleAuth={handleAuth} />
                  );
                }}
              />
              <Route component={NotFound} />
            </Switch>
          )}
        </div>
      </MaterialTitlePanel>
    </Sidebar>
  );
}

export default App;
