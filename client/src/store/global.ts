import {hookstate, useHookstate} from '@hookstate/core';
import {getKeyFromLocalStorage} from '../helpers/common';

const initialState: {
  loader: boolean;
  user: {};
  token: string | {};
  isLoggedIn: boolean;
  cartData: null;
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
    getcartData: () => state.cartData,
    setcartData: (data: any) => state.cartData.set(data),

    //Product
    getProduct: () => state.product,
    setProduct: (data: any) => state.product.set(data),
  };
};
