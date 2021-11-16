import React, { useEffect } from "react";
import { Button, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getMyOrdersDetails,
  getOrderDetails,
} from "../redux/actions/orderActions";
import { LinkContainer } from "react-router-bootstrap";
import { withStyles } from "@material-ui/styles";
import styles from "../styles/myOrdersStyle";
const MyOrders = (props) => {
  const { classes, history } = props;
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const myOrders = useSelector((state) => state.myOrders);
  const { loading, error, orders } = myOrders;

  useEffect(() => {
    if (!userInfo.user) {
      history.push("/login");
    } else {
      if (!orders) {
        dispatch(getMyOrdersDetails());
      }
    }
  }, [dispatch, history, userInfo, orders]);
  return (
    <Row className={classes.root}>
      <h1 className={classes.title}>My Orders</h1>

      <Col md={9}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger" text={error} />
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {String(order.createdAt).substring(0, 16).replace("T", " ")}
                  </td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button
                        className="btn-sm"
                        variant="primary"
                        onClick={() => {
                          dispatch(getOrderDetails(order._id));
                        }}
                      >
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default withStyles(styles)(MyOrders);
