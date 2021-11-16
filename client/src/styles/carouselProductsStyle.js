import { sizes } from "../constants/sizes";

const styles = {
  carousel: {
    borderRadius: ".58%",
    marginTop: "85px",
  },
  carouselSlide: { display: "flex" },
  caption: {
    position: "absolute",
    top: 0,
  },
  carouselInner: {
    "& a": {
      margin: "0 auto",
    },
  },
  image: {
    height: "300px",
    padding: "30px",
    margin: "40px",
    borderRadius: "50%",
    marginLeft: "auto !important",
    marginRight: "auto !important",
    display: "block !important",
  },
  h2: {
    color: "#fff",
    "& strong": {
      color: "gold",
    },
    [sizes.down("xl")]: {
      fontSize: "larger",
    },
    [sizes.down("lg")]: {
      fontSize: "large",
    },
    [sizes.down("md")]: {
      fontSize: "large",
    },
    [sizes.down("sm")]: {
      fontSize: "medium",
    },
    [sizes.down("xs")]: {
      fontSize: "smaller",
    },
    [sizes.down("xxs")]: {
      fontSize: "x-small",
    },
  },
};
export default styles;
