import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import VehicleDropdown from '../../VehicleDropdown/VehicleDropdown';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  padding: 40px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #000;
  margin-bottom: 40px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin-bottom: 30px;
`;

const Label = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 16px;
  text-transform: uppercase;
  &:focus {
    outline: none;
    border-color: #522ED3;
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 180px;
  height: 48px;
  background-color: ${props => props.disabled ? '#ccc' : '#522ED3'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#3f22a3'};
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

const BikeNumber = () => {
  const [bikeNumber, setBikeNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const validateBikeNumber = (number) => {
    // Basic validation for Indian vehicle numbers (e.g., MH01AB1234)
    const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/;
    return regex.test(number);
  };

  const handleBikeNumberChange = (value) => {
    setBikeNumber(value);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!validateBikeNumber(bikeNumber)) {
      setError('Please enter a valid bike registration number');
      return;
    }

    setLoading(true);
    
    try {
      // Simulating API call - for now, we'll just store the data locally
      // const response = await axios.post('/api/bikes/bikenumber', { bikeNumber });
      
      // Store bike number in localStorage
      localStorage.setItem('bikeNumber', bikeNumber);
      
      // Navigate to the next step
      history.push('/bikes/useofbike');
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Error submitting bike number:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Enter your bike registration number</Title>
      <FormContainer>
        <VehicleDropdown
          value={bikeNumber}
          onChange={handleBikeNumberChange}
          placeholder="Example: MH01AB1234 or select from demo database"
          type="bike"
        />
        <InfoText>Please enter the registration number as shown on your RC</InfoText>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
      <Button 
        disabled={bikeNumber.length < 4 || loading} 
        onClick={handleSubmit}
      >
        {loading ? 'Processing...' : 'Continue'}
      </Button>
    </Container>
  );
};

export default BikeNumber; 