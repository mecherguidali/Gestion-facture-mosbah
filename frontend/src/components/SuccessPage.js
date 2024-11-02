import React, { useEffect, useState } from 'react';
import { Button, Spin, Alert } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);

  // Extract the payment_id and other query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get('payment_id');
  const paymentMethod = queryParams.get('paymentMethod') || 'Credit Card';  // Default to 'Credit Card' if not provided
  const createdBy = queryParams.get('createdBy') || '6696b0c0e3e488c4b51391e2';  // Default value or get from query params
  const amount = queryParams.get('amount') || 1;  // Default value if not present
  const invoiceId = queryParams.get('invoiceId');  // Invoice ID extracted from the URL
  
  // Function to verify payment using the Flouci API
  const verifyPayment = async (paymentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/flouci/confirm/${paymentId}`);
      setVerificationResult(response.data);  // Store verification result

      // Make a request to update the invoice payment once verification is successful
      if (invoiceId) {
        await updateInvoicePayment(invoiceId, amount, paymentMethod, createdBy);
      }
      
      setLoading(false);
    } catch (error) {
      setError('Error verifying payment. Please try again.');
      setLoading(false);
    }
  };

  // Function to update the invoice payment using your API
  const updateInvoicePayment = async (invoiceId, amount, paymentMethod, createdBy) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/invoice/${invoiceId}`, {
        amountPaid: amount,
        paymentMethod: paymentMethod,
        createdBy: createdBy
      });
      console.log('Payment updated successfully:', response);
    } catch (error) {
      setError('Error updating payment. Please contact support.');
      console.error(error);
    }
  };

  // Trigger the verification when the component mounts
  useEffect(() => {
    if (paymentId) {
      verifyPayment(paymentId);  // Call the function to verify payment
    } else {
      setError('No payment ID found in the URL.');
      setLoading(false);
    }
  }, [paymentId]);

  // Handler to navigate back to home
  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Payment Successful!</h1>
      
      {/* If still loading, show the loading spinner */}
      {loading && <Spin size="large" />}

      {/* If verification is complete, show the result */}
      {!loading && verificationResult && (
        <div>
          <p>Your payment was verified successfully.</p>
          <p><strong>Amount:</strong> {amount} TND</p>
          <p><strong>Status:</strong> Success</p>
          <Button type="primary" onClick={handleBackHome}>Go Back to Home</Button>
        </div>
      )}

      {/* If there was an error, display an alert */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      )}
    </div>
  );
};

export default SuccessPage;
