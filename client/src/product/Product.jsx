import React, {useState} from 'react';
import './product.scss';
import {Link, useNavigate} from 'react-router-dom';
import Cart from '../components/cart/Cart';
import {useGlobalState} from '../store/global.ts';
import {Axios} from '../Utility';
import {useEffect} from 'react';
import {setKeyToLocalStorage} from '../helpers/common';

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

        state.setApiResponseData((prevData) => [...prevData, updatedData.data]);

        setCartItems(state.getApiResponseData().value);
      } catch (error) {
        console.log(error);
      }
      setCartOpen(true);
    }
  };

  // Close the cart
  const handleCloseCart = () => {
    setCartOpen(false);
  };

  const userData = state.getUser();
  const normalUserData = JSON.parse(JSON.stringify(userData.value));

  const handleLike = async (productID, action) => {
    if (!isUser) {
      navigate('/login');
    } else {
      try {
        const userId = state.getUser().value?._id;
        const productId = productID;

        const response = await Axios.post(
          `/product/like/${productId}?action=${action}`,
          {userId}
        );

        if (response.status === 200) {
          const updatedLikedProducts = [...normalUserData.likedProducts];

          if (action === 'like') {
            updatedLikedProducts.push(productId);
          } else if (action === 'dislike') {
            const index = updatedLikedProducts.indexOf(productId);
            if (index !== -1) {
              updatedLikedProducts.splice(index, 1);
            }
          }
          // Update the user's likedProducts array
          normalUserData.likedProducts = updatedLikedProducts;
          setKeyToLocalStorage('user', normalUserData);
          state.setUser(normalUserData);
        }
      } catch (error) {
        console.log(error);
      }
    }
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
                <button className='goToCartBtn'>Go to Cart</button>
              ) : (
                <button onClick={() => handleAddToCart(item._id)}>
                  Add to Cart
                </button>
              )}
              <div className='likeBtn'>
                {normalUserData?.likedProducts?.includes(item._id) ? (
                  <i
                    className='heart-icon fas fa-heart'
                    onClick={() => handleLike(item._id, 'dislike')}></i>
                ) : (
                  <i
                    onClick={() => handleLike(item._id, 'like')}
                    className='heart-icon far fa-heart'></i>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Product;
