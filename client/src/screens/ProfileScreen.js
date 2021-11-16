import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/userActions";
import { USER_UPDATE_PROFILE_RESET, USER_DETAILS_RESET } from "../redux/types";
import { Divider } from "@mui/material";
import { withStyles } from "@material-ui/styles";
import styles from "../styles/profileScreenStyle";

const ProfileScreen = (props) => {
  const { classes, history } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);

  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo.user) {
      history.push("/login");
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
      if (success) {
        setTimeout(() => {
          dispatch(getUserDetails("profile"));
          dispatch({ type: USER_UPDATE_PROFILE_RESET });
        }, 1500);

        //dispatch(getMyOrdersDetails());
      }
    }
  }, [dispatch, history, userInfo, success, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ id: user._id, name, email }));
  };

  const submitPasswordHandler = (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      setMessage("Please confirm your new password!");
      console.log("Please confirm your new password!");
    } else {
      setMessage("");
      dispatch(updateUserProfile({ id: user._id, currentPassword, password }));
    }
  };
  return (
    <Row className={classes.root}>
      <Col md={4} className="center mt-3">
        <h1>User Profile</h1>

        {error && <Message variant="danger" text={error} />}
        {success && <Message variant="success" text="Update success" />}
        {message && <Message variant="danger" text={message} />}

        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="New name.."
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="New email.."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-3">
            Update Profile
          </Button>
        </Form>
        <Divider />

        <Form onSubmit={submitPasswordHandler}>
          <Form.Group controlId="CurrntPassword" className="mt-3">
            <Form.Label>Currnet Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="ConfirmPassword" className="mt-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3">
            Update Password
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default withStyles(styles)(ProfileScreen);
