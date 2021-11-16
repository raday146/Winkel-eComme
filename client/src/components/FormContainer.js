import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { withStyles } from "@material-ui/styles";
import styles from "../styles/FormContainerStyle";
const FormContainer = (props) => {
  const { classes, children } = props;

  return (
    <Container className={classes.root}>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default withStyles(styles)(FormContainer);
