import React from 'react';
import './checkout.scss';
import PriceDetails from '../../components/priceDetails/PriceDetails';
import Address from '../../components/address/Address';
import {useGlobalState} from '../../store/global.ts';
import OrderSummary from '../../components/orderSummary/OrderSummary';
const Checkout = () => {
  const state = useGlobalState();

  const cartItems = state.getcartData().value;

  const priceArray = cartItems?.map((item) => item.price) || [];
  let sum = 0;
  for (const num of priceArray) {
    sum += num;
  }

  const handlePlaceOrder = () => {
    const currentOrder = state.getOrder().value;
    const normalData = JSON.parse(JSON.stringify(cartItems));
    state.setOrder({
      ...currentOrder,
      user: state.getUser().value?._id,
      products: normalData,
      totalAmount: sum,
      // user:
    });
  };

  // console.log(state.getOrder().value, 'Order');

  return (
    <>
      <div className='checkoutContainer wrapper'>
        <div className='colOne'>
          <div className='stepOne'>
            <button onClick={handlePlaceOrder}>Place Order</button>
            <Address />
          </div>
          <div className='stepTwo'>
            <OrderSummary />
          </div>
          {/* <div className='stepThree'>Payment Options</div> */}
        </div>
        <div className='colTwo'>
          <PriceDetails />
        </div>
      </div>
    </>
  );
};

export default Checkout;
