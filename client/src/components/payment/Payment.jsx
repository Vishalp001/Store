import React, {useState} from 'react';
import './payment.scss';
import {loadStripe} from '@stripe/stripe-js';
import {useGlobalState} from '../../store/global.ts';
import {Axios} from '../../Utility';
// import {stat} from 'fs';

const Payment = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  const state = useGlobalState();
  const orderData = state.getOrder().value;

  let orderState;
  if (orderData !== undefined) {
    const normalData = JSON.parse(JSON.stringify(orderData));
    orderState = normalData;
    console.log(normalData, 'orderState');
  }

  const makePayment = async () => {
    const stripe = await loadStripe(
      'pk_test_51NpFpYSEKxyQ7sG7WKXbgvfJjoZ0C2aHmWW0QCChxo8b9HCf9FZQnYr7JUMVugKITSpbkeJHymT6rf6k9OCaQx7j00Epx0iiUk'
    );
    const body = orderState;
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await fetch(
      'http://localhost:8080/api/create-checkout-session',
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();
    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <div className='cartContainer payemntDiv'>
      <div className='header'>
        <span className='number'>3</span>
        <span className='heading'>Payment</span>
      </div>
      <div className='payment'>
        <div className='rowOne'>
          <div>
            <input
              type='radio'
              id='card'
              name='payment'
              onChange={() => handleRadioChange('card')}
            />
            <label htmlFor='card'>Credit / Debit / ATM Card</label>
          </div>
          {selectedOption === 'card' && (
            <button onClick={makePayment}>Continue</button>
          )}
        </div>

        <div className='rowTwo'>
          <div>
            <input
              type='radio'
              id='cod'
              name='payment'
              onChange={() => handleRadioChange('cod')}
            />
            <label htmlFor='cod'>Cash on Delivery</label>
          </div>
          {selectedOption === 'cod' && <button>Confirm Order</button>}
        </div>
      </div>
    </div>
  );
};

export default Payment;
