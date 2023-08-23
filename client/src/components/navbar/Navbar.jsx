import React, {useEffect, useState} from 'react';
import './navbar.scss';
import {Link} from 'react-router-dom';
import {removeItemsFromLocalStorage} from '../../helpers/common';
import {useGlobalState} from '../../store/global.ts';
import {AiOutlineShoppingCart, AiOutlineHeart} from 'react-icons/ai';
import Cart from '../cart/Cart';
import {fetchCartItem} from '../../services/apis';
const Navbar = () => {
  const state = useGlobalState();

  const user = state.getUser().value;
  const userId = state.getUser().value?._id;

  const [isCartOpen, setisCartOpen] = useState(false);

  const isLoggedIn = state.getisLoggedIn().value;
  const keysToRemove = ['user'];
  const handleLogout = () => {
    state.setisLoggedIn(false);
    state.setUser({});
    removeItemsFromLocalStorage(keysToRemove);
  };

  const handleCloseCart = () => {
    setisCartOpen(false);
  };

  const openCart = () => {
    setisCartOpen(true);
  };

  const [cartItems, setCartItems] = useState();

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

  return (
    <>
      <div className='cartPopup'>
        <div>{isCartOpen && <Cart handleCloseCart={handleCloseCart} />}</div>
      </div>

      <nav className='navbar'>
        <div className='logo'>
          {/* <img src={logo} alt='' /> */}
          <Link to='/'>
            <h2>DD</h2>
          </Link>
        </div>
        <div className='nav-options'>
          <Link to='/'>Home</Link>

          {isLoggedIn ? (
            <>
              {user?.isAdmin ? <Link to='/addProduct'>Add Product</Link> : ''}
              <Link>
                <span>{user.firstName}</span>
              </Link>
              <Link>
                <span>Cart</span>
              </Link>

              <Link to='/wishlist'>
                <span className='cartIcon'>
                  <AiOutlineHeart />
                </span>
              </Link>

              <span onClick={openCart} className='cartIcon'>
                <span className='count'>{cartItems?.length}</span>
                <AiOutlineShoppingCart />
              </span>
              <Link onClick={handleLogout}>
                <span>Logout</span>
              </Link>
            </>
          ) : (
            <>
              <Link to='/login'>Login</Link>
              <Link to='/register'>Signup</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
