import React, {useEffect, useState} from 'react';
import {useGlobalState} from '../../store/global.ts';
import './cartDetails.scss';
import {RxCross2} from 'react-icons/rx';
import {BiSolidRightArrow} from 'react-icons/bi';
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/md';
import {Axios} from '../../Utility.js';
import {udateCartItem} from '../../services/apis.js';
import {Link} from 'react-router-dom';

const CartDetails = () => {
  const state = useGlobalState();

  const cartItems = state.getcartData().value;
  const allProduct = state.getProduct().value;

  console.log(cartItems, 'cartItems');

  const cartItemId = cartItems?.map((item) => item.product) || [];

  const priceArray = cartItems?.map((item) => item.price) || [];
  let sum = 0;
  for (const num of priceArray) {
    sum += num;
  }

  const [cartProduct, setcartProduct] = useState([]);

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

  // ------------------------------------------------------------------------------------------------
  // Get Item Quantity in Cart
  const getCartItemQuantity = (productId) => {
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Get Subtotal of cart
  const getSubTotal = (productId) => {
    const cartItem = cartItems?.find((item) => item.product === productId);
    return cartItem ? cartItem.price : 0;
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
  // ---------------------------------------------------------------------

  // Update the Quantity
  const updateQuantity = async (item, action) => {
    try {
      const productId = item._id;

      const desiredCartItem = cartItems.find(
        (item) => item.product === productId
      );
      if (!desiredCartItem) return;

      let updatedQuantity, updatedPrice;

      if (
        action === 'increment' &&
        desiredCartItem.quantity < item.stockQuantity
      ) {
        updatedQuantity = desiredCartItem.quantity + 1;
        updatedPrice = desiredCartItem.price + item.price;
      } else if (action === 'decrement' && desiredCartItem.quantity > 1) {
        updatedQuantity = desiredCartItem.quantity - 1;
        updatedPrice = desiredCartItem.price - item.price;
      }

      const payload = {
        quantity: updatedQuantity,
        price: updatedPrice,
      };

      const cartResponse = await udateCartItem(desiredCartItem._id, payload);
      const updatedCartItem = await cartResponse.data;

      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.product === updatedCartItem.product
          ? updatedCartItem
          : cartItem
      );

      const normalData = JSON.parse(JSON.stringify(updatedCartItems));

      state.setcartData(normalData);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Free Delevery
  const [freeDevelery, setFreeDelivery] = useState(false);

  useEffect(() => {
    if (cartItems && sum > 500) {
      setFreeDelivery(true);
    } else {
      setFreeDelivery(false);
    }
  }, [cartItems, sum]);

  return (
    <>
      <div className='cartDetailsContainer'>
        <div className='cartItems'>
          {cartProduct?.map((item) => (
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
                <button onClick={() => updateQuantity(item, 'decrement')}>
                  <MdKeyboardArrowLeft />
                </button>
                <input
                  type='text'
                  value={getCartItemQuantity(item._id)}
                  readOnly
                />
                <button onClick={() => updateQuantity(item, 'increment')}>
                  <MdKeyboardArrowRight />
                </button>
              </div>
              <div className='divFour'>{getSubTotal(item._id)}</div>
              <div className='divFive'>
                <p className='crossIocn' onClick={() => deleteItem(item._id)}>
                  <RxCross2 />
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className='rowTwo'>
          <div className='cartTotal'>
            <h1>PRICE DETAILS</h1>
            <div className='rowOne'>
              <p>
                Price ({cartItems?.length}{' '}
                {cartItems?.length > 1 ? 'Items' : 'Item'})
              </p>
              <p className='price'>₹{sum}</p>
            </div>
            <div className='rowOne'>
              <p>Delivery Charges</p>
              {freeDevelery ? <p className='free'>Free</p> : <p>₹40</p>}
            </div>
            <div className='rowOne totalAmt'>
              <p>Total Amount</p>
              <p className='price'>
                {freeDevelery ? <span>₹{sum}</span> : <span>₹{sum + 40}</span>}
              </p>
            </div>
            <button className='checkoutBtn'>Proceed To Checkout</button>
          </div>
          {!freeDevelery && (
            <div className='freeCart'>
              <div className='rowOne'>
                <div>
                  <p>Add items worth ₹{500 - sum} more for FREE delivery</p>
                  <img
                    src='https://rukminim2.flixcart.com/www/400/400/promos/06/04/2017/32f62e07-a9e4-4bfc-88d8-3eeb8b4be127.png?q=80'
                    alt=''
                  />
                </div>
                <p className='subText'>Eligible only for products</p>
              </div>
              <div className='rowTwoInner'>
                <p>Browse Super Value store</p>
                <Link to='/'>
                  <BiSolidRightArrow />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDetails;
