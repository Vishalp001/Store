import React, {useEffect, useState} from 'react';
import './orderSummary.scss';
import {useGlobalState} from '../../store/global.ts';
import {Axios} from '../../Utility';

const OrderSummary = () => {
  const state = useGlobalState();
  const cartItems = state.getcartData().value;
  const allProduct = state.getProduct().value;
  const cartItemId = cartItems?.map((item) => item.product) || [];

  const [cartProduct, setcartProduct] = useState([]);

  console.log(cartItems);

  useEffect(() => {
    const productInCart = () => {
      if (!cartItems || cartItems.length === 0) return;
      const item = allProduct?.filter((product) =>
        cartItemId.includes(product._id)
      );
      setcartProduct(item);
    };

    productInCart();
  }, [cartItems?.length, allProduct?.length]);

  const getSubTotal = (productId) => {
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.price : 0;
  };

  const getQunatity = (productId) => {
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Delete Cart item
  const deleteItem = async (productId) => {
    try {
      const cartItem = cartItems?.find((item) => item.product === productId);
      if (cartItem) {
        await Axios.delete(`/cart/${cartItem._id}`);
        setcartProduct((previousData) =>
          previousData.filter((product) => product._id !== productId)
        );

        // After successful deletion, update the setcartData state
        state.setcartData((previousData) =>
          previousData.filter((product) => product.product !== productId)
        );
      } else {
        console.log('Cart Item Not Found');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className='cartContainer'>
        <div className='header'>
          <span className='number'>2</span>
          <span className='heading'>Order Summary</span>
        </div>
        <div className='cartItems'>
          {cartProduct?.map((item) => (
            <div className='cartItem' key={item._id}>
              <div className='colOne'>
                <div className='producImage'>
                  <img src={item.images} alt='' />
                </div>
                <div className='productDesc'>
                  <h2>{item.productName}</h2>
                  <p className='desc'>{item.description}</p>
                  <p className='price'>
                    <span>₹</span>
                    {getSubTotal(item._id)}.00
                  </p>
                  <p className='quantity'>
                    <span>quantity:</span> {getQunatity(item._id)}
                  </p>
                </div>
              </div>
              <button
                className='removeBtn'
                onClick={() => deleteItem(item._id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
