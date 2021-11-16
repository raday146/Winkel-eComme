import React from "react";
import { Spinner } from "react-bootstrap";

import { withStyles } from "@material-ui/styles";
import styles from "../styles/LoaderStyle";
const Loader = ({ classes }) => {
  return (
    <Spinner animation="border" role="status" className={classes.root}>
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default withStyles(styles)(Loader);
