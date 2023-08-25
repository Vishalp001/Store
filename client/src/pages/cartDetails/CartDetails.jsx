import React from 'react';
import {useGlobalState} from '../../store/global.ts';
import './cartDetails.scss';
import {RxCross2} from 'react-icons/rx';

const CartDetails = () => {
  const state = useGlobalState();

  const cartItems = state.getcartData().value;
  const allProduct = state.getProduct().value;

  console.log(cartItems, 'cartItem');
  // console.log(allProduct, 'allProduct');

  const cartItemId = cartItems?.map((item) => item.product) || [];
  // console.log(cartItemId, 'cartItemId');

  const productInCart = allProduct?.filter((product) =>
    cartItemId.includes(product._id)
  );

  // console.log(productInCart, 'productInCart');
  const getCartItemQuantity = (productId) => {
    console.log(productId);
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getSubTotal = (productId) => {
    console.log(productId);
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.price : 0;
  };

  return (
    <>
      <div className='cartDetailsContainer'>
        <div className='cartItems'>
          {productInCart?.map((item) => (
            <div key={item._id} className='cartItem'>
              <div className='divOne'>
                <div className='imgDiv'>
                  <img src={item?.images[0]} alt='' />
                </div>
                <h1>{item.productName}</h1>
              </div>
              <div className='divTwo'>
                <p>₹ {item.price}.00</p>
              </div>
              <div className='divThree'>
                <button> &lt; </button>
                <input
                  type='text'
                  value={getCartItemQuantity(item._id)}
                  readOnly
                />
                <button> &gt; </button>
              </div>
              <div className='divFour'>{getSubTotal(item._id)}</div>
              <div className='divFive'>
                <p className='crossIocn'>
                  <RxCross2 />
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className='cartTotal'>
          <h1>Cart Total</h1>
          <div className='subTotal'>
            <p>Subtotal</p>
            <p className='price'>$458</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetails;
