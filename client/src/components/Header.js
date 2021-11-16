import React from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/actions/userActions";
import { useHistory, Route } from "react-router-dom";
import { CART_RESET } from "../redux/types";
import SearchBox from "../components/SearchBox";

const Header = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart.cartItems);
  let totalProductsInCart = 0;

  totalProductsInCart = cart.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logOut());
    dispatch({ type: CART_RESET });

    history.push("/");
  };

  return (
    <header>
      <Navbar
        bg="primary"
        variant="dark"
        expand="lg"
        className="fixed-top mt-0"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Winkel</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route render={({ history }) => <SearchBox history={history} />} />

            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                  <Badge
                    pill
                    bg="danger"
                    style={{ position: "relative", bottom: 7, left: 2 }}
                  >
                    {totalProductsInCart}
                  </Badge>
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.user.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      <i className="fas fa-user btn-outline-secondary"></i>{" "}
                      Profile
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/myorders">
                    <NavDropdown.Item>
                      <i className="fas fa-archive btn-outline-secondary"></i>{" "}
                      MyOrders
                    </NavDropdown.Item>
                  </LinkContainer>

                  {userInfo.user && userInfo.user.isAdmin && (
                    <>
                      <LinkContainer to="/admin/userlist">
                        <NavDropdown.Item>
                          <i className="fas fa-users btn-outline-secondary"></i>{" "}
                          Users
                        </NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>
                          <i className="fas fa-box btn-outline-secondary"></i>{" "}
                          Orders
                        </NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>
                          <i className="fas fa-store btn-outline-secondary"></i>{" "}
                          Products
                        </NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}

                  <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt btn-outline-secondary "></i>{" "}
                    LogOut
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-sign-in-alt"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
