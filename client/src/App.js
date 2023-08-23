import React, {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/productDetails/ProductDetails';
import AddProduct from './pages/addProduct/AddProduct';
import Navbar from './components/navbar/Navbar';
import {useGlobalState} from './store/global.ts';
import Register from './pages/auth/register/Register';
import Login from './pages/auth/login/Login';
import {fetchCartItem} from './services/apis';
import Wishlist from './pages/wishlist/Wishlist';
import {Axios} from './Utility';
const App = () => {
  const state = useGlobalState();
  const user = state.getUser().value;
  const userId = state.getUser().value?._id;

  useEffect(() => {
    const getCartItems = async () => {
      try {
        if (userId) {
          // Step 1: Fetch the cart items for the user
          const cartResponse = await fetchCartItem(userId);
          const fetchedCartItems = await cartResponse.data;

          state.setApiResponseData(fetchedCartItems);
          // setCartItems(fetchedCartItems);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getCartItems();

    const fetchData = async () => {
      try {
        const res = await Axios.get('/product');
        state.setProduct(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        {user?.isAdmin && <Route path='/addProduct' element={<AddProduct />} />}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/wishlist' element={<Wishlist />} />
      </Routes>
    </>
  );
};

export default App;
