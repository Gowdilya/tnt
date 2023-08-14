import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MaterialTitlePanel from "./material_title_panel";
import Button from "@material-ui/core/Button";

import Accordian from "@material-ui/core/Accordion";
import AccordianDetails from "@material-ui/core/AccordionDetails";
import AccordianSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccessControlR from "../Shared/components/AccessControlR";
import Parser from "../Shared/Parser";
import * as Roles from "../Shared/constants/Roles";
import { rolesState } from "../../atoms/roles";
import { useRecoilState } from "recoil";

const styles = {
  sidebar: {
    width: 276,
    height: "100%",
    backgroundColor: "#32303a",
  },
  menuItem: {
    display: "block",
    padding: "12px",
  },
  content: {
    padding: "12px",
    //height: "100%",
    backgroundColor: "#32303a",
  },
  routerLink: {
    color: "#ed1a39",
    textDecoration: "none",
  },
};

function SidebarContent(props) {
  const [roles, setRoles] = useRecoilState(rolesState);

  const getNavMenuContent = () => {
    const { login, logout } = props.auth;
    let content = "<div ></div>";
    if (props.isAuthenticated) {
      content = (
        <div>
          <Accordian>
            <AccordianSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Admin</Typography>
            </AccordianSummary>
            <AccordianDetails>
              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.USER_ADMIN_MODULE}
              >
                <Link style={styles.routerLink} to="/usermanagement">
                  <Button className="button-red" variant="contained">
                    User Management
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.RMA_ADMIN_MODULE}
              >
                <Link style={styles.routerLink} to="/returns/managelists">
                  <Button className="button-red" style={styles.menuItem}>
                    RMA Admin
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.INVENTORY_MODULE}
              >
                <Link style={styles.routerLink} to="/inventory">
                  <Button className="button-red" style={styles.menuItem}>
                    Inventory
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.CATALOG_MODULE}
              >
                <Link style={styles.routerLink} to="/catalog/products">
                  <Button className="button-red" style={styles.menuItem}>
                    Catalog{" "}
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.LOCATIONS_MODULE}
              >
                <Link style={styles.routerLink} to="/locations">
                  <Button className="button-red" style={styles.menuItem}>
                    Locations
                  </Button>
                </Link>
              </AccessControlR>
            </AccordianDetails>
          </Accordian>

          <Accordian>
            <AccordianSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Production</Typography>
            </AccordianSummary>
            <AccordianDetails>
              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.BINDING_MODULE}
              >
                <Link style={styles.routerLink} to="/sub-article">
                  <Button className="button-red" style={styles.menuItem}>
                    Binding
                  </Button>
                </Link>
              </AccessControlR>
              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Button className="button-grey" variant="contained" disabled>
                  Flowpoint Collection
                </Button>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.PACKING_MODULE}
              >
                <Link style={styles.routerLink} to="/packing">
                  <Button className="button-red" style={styles.menuItem}>
                    Packing
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Button className="button-grey" variant="contained" disabled>
                  Reports
                </Button>
              </AccessControlR>
            </AccordianDetails>
          </Accordian>

          <Accordian>
            <AccordianSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Logistics</Typography>
            </AccordianSummary>
            <AccordianDetails>
              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.PREPPING_MODULE}
              >
                <Link style={styles.routerLink} to="/preshipping">
                  <Button className="button-red" style={styles.menuItem}>
                    Prepping
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.SHIPPING_MODULE}
              >
                <Link style={styles.routerLink} to="/shipping">
                  <Button
                    className="button-red"
                    variant="contained"
                    style={styles.menuItem}
                  >
                    Shipping
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Button
                  className="button-grey"
                  disabled
                  variant="contained"
                  style={styles.menuItem}
                >
                  Recieving
                </Button>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.LOGISTICS_REPORTS_MODULE}
              >
                <Link style={styles.routerLink} to="/ShipReport">
                  <Button className="button-red" style={styles.menuItem}>
                    Reports
                  </Button>
                </Link>
              </AccessControlR>
            </AccordianDetails>
          </Accordian>
          <Accordian>
            <AccordianSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Field</Typography>
            </AccordianSummary>
            <AccordianDetails>
              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.RMA_ACTION_MODULE}
              >
                <Link style={styles.routerLink} to="/rmaaction">
                  <Button className="button-red" style={styles.menuItem}>
                    RMA Action
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.RMA_REQUEST_MODULE}
              >
                <Link style={styles.routerLink} to="/rmarequest">
                  <Button className="button-red" style={styles.menuItem}>
                    RMA Request
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Button
                  className="button-grey"
                  disabled
                  variant="contained"
                  style={styles.menuItem}
                >
                  Diagnostics
                </Button>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={Roles.RMA_REPORTS_MODULE}
              >
                <Link style={styles.routerLink} to="/rmareports">
                  <Button className="button-red" style={styles.menuItem}>
                    Reports
                  </Button>
                </Link>
              </AccessControlR>
            </AccordianDetails>
          </Accordian>
          <Accordian>
            <AccordianSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Analytics</Typography>
            </AccordianSummary>
          </Accordian>

          <Accordian>
            <AccordianSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Machine Learning</Typography>
            </AccordianSummary>
            <AccordianDetails>
              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Link style={styles.routerLink} to="/prepare-data">
                  <Button className="button-red" style={styles.menuItem}>
                    Prepare Data
                  </Button>
                </Link>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Button className="button-grey" variant="contained" disabled>
                  Define Model
                </Button>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Button className="button-grey" variant="contained" disabled>
                  Train Model
                </Button>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Button className="button-grey" variant="contained" disabled>
                  Test Model
                </Button>
              </AccessControlR>

              <AccessControlR
                userRoles={roles}
                allowedRoles={[Roles.MATTS_ADMIN]}
              >
                <Button className="button-grey" variant="contained" disabled>
                  Publish Model
                </Button>
              </AccessControlR>
            </AccordianDetails>
          </Accordian>

          <a href="#!" onClick={() => logout()} style={styles.routerLink}>
            <Button className="button-white" style={styles.menuItem}>
              Logout
            </Button>
          </a>
        </div>
      );
    } else {
      content = (
        <Nav className="flex-column">
          <a href="#!" onClick={() => login()} style={styles.routerLink}>
            <Button className="button-white" style={styles.menuItem}>
              Login
            </Button>
          </a>
        </Nav>
      );
    }
    return content;
  };

  const style = props.style
    ? { ...styles.sidebar, ...props.style }
    : styles.sidebar;

  const navMenuContent = getNavMenuContent();

  return (
    <MaterialTitlePanel title="Menu" style={style}>
      <div style={styles.content}>{navMenuContent}</div>
    </MaterialTitlePanel>
  );
}

export default SidebarContent;
