import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import { listProducts } from "../redux/actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import OffCanvas from "../components/OffCanvas";
import { openFilter } from "../redux/actions/filterActions";
import CarouselProducts from "../components/CarouselProducts";
// import { sortProductsAsc, sortProductsDesc } from "../redux/actions/productActions";

const HomeScreen = ({ match, history }) => {
  const keywordSearch = match.params.keyword;
  const pageNumber = match.params.page || 1;

  const dispatch = useDispatch();
  const productListReducer = useSelector((state) => state.productListReducer);
  const {
    loading,
    error,
    page,
    products,
    pages,
    sort: sortType,
  } = productListReducer;

  const filterReducer = useSelector((state) => state.filterReducer);
  const { show } = filterReducer;

  const [sort, setSort] = useState(sortType);

  useEffect(() => {
    dispatch(listProducts(keywordSearch, pageNumber, sort));
  }, [dispatch, keywordSearch, pageNumber, sort]);

  //const pageSize = 6;

  //const indexOfLastProduct = pageNumber * pageSize;
  //const indexOfFirstProduct = indexOfLastProduct - pageSize;
  // let products = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <Helmet>
        <title>Winkel | Home</title>
      </Helmet>

      {!keywordSearch && <CarouselProducts />}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" text={error} />
      ) : (
        <>
          {!keywordSearch && (
            <>
              <Col className="d-grid gap-1 mt-3" lg={1} md={2} xs={4}>
                <Button variant="light" onClick={() => dispatch(openFilter())}>
                  filter <i className="fas fa-filter"></i>
                </Button>
              </Col>
            </>
          )}

          {show && <OffCanvas />}

          <Row className="mt-3">
            {products && products.length > 0 ? (
              products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} className="mb-3">
                  <Product product={product} />
                </Col>
              ))
            ) : (
              <Row className="d-grid justify-content-center" md="auto">
                <Message
                  variant="danger"
                  text={`no results for ${keywordSearch}`}
                />
              </Row>
            )}
          </Row>
          <Row className="d-grid justify-content-center" md="auto">
            <Paginate
              pages={pages}
              page={page}
              keyword={keywordSearch ? keywordSearch : ""}
            />
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
