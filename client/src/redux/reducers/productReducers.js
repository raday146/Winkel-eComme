import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_DETAILS_RESET,
  PRODUCT_TOP_RESET,
} from "../types";

export const productListReducer = (
  state = { products: [], loading: null, error: null, sort: "" },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return {
        loading: true,
        products: [],
      };
    case PRODUCT_LIST_SUCCESS:
      return {
        sort: "",
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page,
      };

    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };

    case "SORT_ASC":
      const sortAsc = action.payload.products.sort((a, b) =>
        a.price > b.price ? 1 : -1
      );
      return {
        ...state,
        products: sortAsc,
        pages: action.payload.pages,
        page: action.payload.page,
        sort: "asc",
        loading: false,
      };
    case "SORT_DESC":
      const sortDesc = action.payload.products.sort((a, b) =>
        a.price < b.price ? 1 : -1
      );

      return {
        ...state,
        products: sortDesc,
        pages: action.payload.pages,
        page: action.payload.page,
        sort: "desc",
        loading: false,
      };

    default:
      return state;
  }
};

export const productDetailsReducer = (state, action) => {
  state = {
    loading: null,
    product: { reviews: [] },

    error: null,
  };
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        loading: true,
        product: { reviews: [] },
        error: null,
      };
    case PRODUCT_DETAILS_SUCCESS:
      return { ...state, loading: false, product: action.payload };

    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_DETAILS_RESET:
      return { product: { reviews: [] } };
    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return {
        loading: true,
      };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return {
        loading: true,
      };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };

    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return {
        loading: true,
      };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return {
        product: {},
      };
    default:
      return state;
  }
};

export const productCreateReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REVIEW_REQUEST:
      return {
        loading: true,
      };
    case PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_REVIEW_RESET:
      return {};
    default:
      return state;
  }
};

export const productTopRatedReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_TOP_REQUEST:
      return {
        loading: true,
        products: [],
      };
    case PRODUCT_TOP_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
      };

    case PRODUCT_TOP_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

// export const productSortReducer = (
//   state = { products: [], sort: "" },
//   action
// ) => {
//   switch (action.type) {
//     case "SORT_ASC":
//       const sortAsc = action.payload.sort((a, b) =>
//         a.price > b.price ? 1 : -1
//       );
//       return {
//         ...state,
//         products: sortAsc,
//         sort: "asc",
//       };
//     case 'SORT_DESC':
//       const sortDesc = action.payload.sort((a, b) =>
//         a.price < b.price ? 1 : -1
//       );

//       return {
//         ...state,
//         products: sortDesc,
//         sort: "desc",
//       };
//     default:
//       return state;
//   }
// };
