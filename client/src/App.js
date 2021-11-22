import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UsersListScreen from "./screens/UsersListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import CreateProductScreen from "./screens/CreateProductScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrdersListScreen from "./screens/OrdersListScreen";
import { Container } from "react-bootstrap";
import { Provider } from "react-redux";
import store from "./redux/store";
import MyOrders from "./screens/MyOrders";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Route exact path="/" component={HomeScreen} />
            <Route path="/product/:id" component={ProductScreen} exact />
            <Route exact path="/cart/:id?" component={CartScreen} />
            <Route path="/login" component={LoginScreen} exact />
            <Route path="/register" component={RegisterScreen} exact />
            <Route path="/profile" component={ProfileScreen} exact />
            <Route path="/myorders" component={MyOrders} exact />
            <Route path="/shipping" component={ShippingScreen} exact />
            <Route path="/payment" component={PaymentScreen} exact />
            <Route path="/placeorder" component={PlaceOrderScreen} exact />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/admin/userlist" component={UsersListScreen} />
            <Route
              path="/admin/userlist/:id/edit"
              component={UserEditScreen}
              exact
            />
            <Route
              path="/admin/productlist"
              component={ProductListScreen}
              exact
            />
            <Route
              path="/admin/productlist/:page"
              component={ProductListScreen}
              exact
            />
            <Route
              exact
              path="/admin/products/newproduct"
              component={CreateProductScreen}
            />
            <Route
              path="/admin/productlist/:id/edit"
              component={ProductEditScreen}
              exact
            />
            <Route path="/admin/orderlist" component={OrdersListScreen} exact />
            <Route path="/search/:keyword" component={HomeScreen} exact />
            <Route path="/page/:page" component={HomeScreen} exact />
            <Route
              path="/search/:keyword/page/:page"
              component={HomeScreen}
              exact
            />
          </Container>
        </main>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
