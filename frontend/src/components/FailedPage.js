// src/components/FailedPage.js
import React from 'react';

import { useNavigate } from 'react-router-dom';

const FailedPage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/'); // You can redirect to the payment page or home page for retry
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Payment Failed</h1>
      <p>There was an issue processing your payment. Please try again later.</p>
    </div>
  );
};

export default FailedPage;
