import React, {useState} from 'react';
import './product.scss';
import {Link, useNavigate} from 'react-router-dom';
import Cart from '../components/cart/Cart';
import {useGlobalState} from '../store/global.ts';
import {Axios} from '../Utility';
import {useEffect} from 'react';

const Product = ({showProduct}) => {
  const state = useGlobalState();
  const navigate = useNavigate();
  const isUser = state.getisLoggedIn().value;

  const [isCartOpen, setCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch initial data from the state or wherever it comes from
    const fetchInitialData = async () => {
      try {
        const initialData = await state.getApiResponseData(); // Replace with the correct method to fetch data
        setCartItems(initialData.value);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialData();
  }, [state.getApiResponseData().value?.length]);

  const handleAddToCart = async (productID) => {
    if (!isUser) {
      navigate('/login');
    } else {
      try {
        // Find the product from id of product (showProduct)
        const getProduct = showProduct.find(
          (product) => product._id === productID
        );
        const newItem = {
          product: getProduct._id,
          price: getProduct.price,
          user: state.getUser().value._id,
        };
        const updatedData = await Axios.post(`/cart`, newItem);

        // state.setApiResponseData(updatedData.data);

        state.setApiResponseData((prevData) => [...prevData, updatedData.data]);

        setCartItems(state.getApiResponseData().value);
        // console.log(allCartItem, 'Updated cart');
      } catch (error) {
        console.log(error);
      }
      setCartOpen(true);
    }
  };

  // console.log(cartItems, 'Updated cart');

  // Close the cart
  const handleCloseCart = () => {
    setCartOpen(false);
  };

  return (
    <>
      <div className='cartPopup'>
        <div>{isCartOpen && <Cart handleCloseCart={handleCloseCart} />}</div>
      </div>
      <div className='productMain'>
        {showProduct.map((item) => (
          <div key={item._id} className='product-card'>
            <div>
              <Link to={`product/${item._id}`}>
                <img src={item?.images[0]} alt='img' />
                <div className='category'>{item.category}</div>
                <div className='description'>
                  {item.description.slice(0, 150)}
                </div>
              </Link>
              <div className='price'>{item.price}</div>
              {/* <div className='rating'>{item.rating.rate}</div> */}
              <Link to={`product/${item._id}`}>
                <div className='title'>{item.productName}</div>
              </Link>
            </div>
            <div className='buttons'>
              <button className='buyButton'>Buy Now</button>
              {cartItems?.some((cartItem) => cartItem?.product === item._id) ? (
                <button>Item Added to Cart</button>
              ) : (
                <button onClick={() => handleAddToCart(item._id)}>
                  Add to Cart
                </button>
              )}

              {/* <button onClick={() => handleAddToCart(item._id)}>
                Add to Cart
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Product;
