import React, {useEffect} from 'react';
import {useGlobalState} from '../../store/global.ts';
import {Axios} from '../../Utility.js';
import './success.scss';
import {Link} from 'react-router-dom';
const Success = () => {
  const state = useGlobalState();

  const userId = state.getUser().value?._id;
  useEffect(() => {
    const clearData = async () => {
      try {
        const res = await Axios.delete(`cart/user/${userId}`);
        state.setProduct(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    clearData();
  }, []);

  return (
    <>
      <div className='successPage'>
        <h2> Payment Successfull</h2>
        <Link to='/'>Back to Homepage</Link>
      </div>
    </>
  );
};

export default Success;
