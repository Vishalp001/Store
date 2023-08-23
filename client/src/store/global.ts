import {hookstate, useHookstate} from '@hookstate/core';
import {getKeyFromLocalStorage} from '../helpers/common';

const initialState: {
  loader: boolean;
  user: {};
  token: string | {};
  isLoggedIn: boolean;
  apiResponseData: null;
  product: null;
} = hookstate({
  loader: false,
  user: getKeyFromLocalStorage('user'),
  // token: getKeyFromLocalStorage('jwt'),
  isLoggedIn: getKeyFromLocalStorage('user') ? true : false,
});

export const useGlobalState = () => {
  const state = useHookstate(initialState);

  return {
    getLoader: () => state.loader,
    setLoader: (value: boolean) => state.loader.set(value),
    getisLoggedIn: () => state.isLoggedIn,
    setisLoggedIn: (value: boolean) => state.isLoggedIn.set(value),
    setUser: (user: any) => {
      state.user.set(user);
    },
    unsetUser: () => {
      state.user.set({});
    },
    getUser: () => state.user,
    // Cart
    getApiResponseData: () => state.apiResponseData,
    setApiResponseData: (data: any) => state.apiResponseData.set(data),

    //Product
    getProduct: () => state.product,
    setProduct: (data: any) => state.product.set(data),
  };
};
