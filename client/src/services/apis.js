import {APIRequest, REQUEST_TYPES} from '../helpers/apiRequest.ts';

const BASEURL = 'http://localhost:8080/api';

// Fetch All card items of user
export const fetchCartItem = (userId) => {
  return APIRequest({
    url: `${BASEURL}/cart/${userId}`,
    method: REQUEST_TYPES.GET,
  });
};

// Update card item
export const udateCartItem = (userId, payload) => {
  return APIRequest({
    url: `${BASEURL}/cart/${userId}`,
    method: REQUEST_TYPES.PUT,
    body: payload,
  });
};
