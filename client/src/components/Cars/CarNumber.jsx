import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import VehicleDropdown from '../VehicleDropdown/VehicleDropdown';
import './CarNumber.css';

const CarNumber = () => {
    const history = useHistory();
    const [carNumber, setCarNumber] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if we have vehicle details in localStorage
        const storedDetails = localStorage.getItem('vehicleDetails');
        console.log('Stored vehicle details:', storedDetails);
        
        if (storedDetails) {
            try {
                const details = JSON.parse(storedDetails);
                console.log('Parsed vehicle details:', details);
                if (details.vehicleNumber) {
                    setCarNumber(details.vehicleNumber);
                }
            } catch (error) {
                console.error('Error parsing vehicle details:', error);
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!carNumber.trim()) {
            setError('Please enter a car number');
            return;
        }
        history.push('/cars/year');
    };

    return (
        <div className="car-number-container">
            <h2>Enter Your Car Number</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <VehicleDropdown
                        value={carNumber}
                        onChange={setCarNumber}
                        placeholder="Enter car number or select from demo database"
                        type="car"
                    />
                    {error && <p className="error-message">{error}</p>}
                </div>
                <button type="submit" className="submit-button">
                    Next
                </button>
            </form>
        </div>
    );
};

export default CarNumber; 