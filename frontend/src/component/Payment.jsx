import React, { useState } from 'react';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const [amount, setAmount] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const result = await axios.post('http://localhost:8080/api/payment/order', { amount: 10000 });

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: 'rzp_test_E8nqfYIX1yyPZp',
      amount: amount.toString(),
      currency: currency,
      name: 'Test Company',
      description: 'Test Transaction',
      order_id: order_id,
      handler: async (response) => {
        const data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        const result = await axios.post('http://localhost:8080/api/payment/verify', data);
        alert(result.data.status);
      },
      prefill: {
        name: 'Test user',
        email: 'test@gmail.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Test Address',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className='card'>
      <h2>Razorpay Payment Gateway Integration</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={displayRazorpay}>Pay Now</button>
    </div>
  );
};

export default Payment;
