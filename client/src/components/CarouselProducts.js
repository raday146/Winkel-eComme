import React, { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { listTopRatedProducts } from "../redux/actions/productActions";
import { withStyles } from "@material-ui/styles";
import styles from "../styles/carouselProductsStyle";

const CarouselProducts = (props) => {
  const dispatch = useDispatch();

  const topRatedProducts = useSelector((state) => state.productTopRatedReducer);
  const { classes } = props;
  const { error, loading, products } = topRatedProducts;
  useEffect(() => {
    dispatch(listTopRatedProducts());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" text={error} />
      ) : (
        products && (
          <Carousel
            pause="hover"
            className={`${classes.carousel} bg-primary p-5`}
          >
            {products.map((product) => (
              <Carousel.Item key={product._id} interval={1500}>
                <Link
                  className={classes.carouselInner}
                  to={`/product/${product._id}`}
                >
                  <Image
                    className={classes.image}
                    src={product.image}
                    alt={product.name}
                    fluid
                  />
                  <Carousel.Caption className={classes.caption}>
                    <h2 className={classes.h2}>
                      {product.name} <strong>(${product.price})</strong>
                    </h2>
                  </Carousel.Caption>
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        )
      )}
    </>
  );
};

export default withStyles(styles)(CarouselProducts);
