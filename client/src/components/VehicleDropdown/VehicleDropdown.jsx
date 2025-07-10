import React, { useState, useEffect, useCallback } from 'react';
import { vehicleData } from '../../data/vehicleData';
import { vehicleData as chatbotVehicleData } from '../Chatbot/mockData';
import './VehicleDropdown.css';

const VehicleDropdown = ({ 
  value, 
  onChange, 
  placeholder = "Enter vehicle number or select from available demo data",
  type = "car", // "car" or "bike"
  className = "",
  showLabel = true,
  disabled = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [inputValue, setInputValue] = useState(value || '');

  // Combine vehicle data from different sources
  const getAllVehicles = useCallback(() => {
    // Get vehicles from main vehicle data (filter by type)
    const mainVehicles = vehicleData
      .filter(vehicle => {
        if (type === 'car') {
          return vehicle.vehicleType !== 'Bike';
        } else if (type === 'bike') {
          return vehicle.vehicleType === 'Bike';
        }
        return true;
      })
      .map(vehicle => ({
        vehicleNumber: vehicle.vehicleNumber,
        model: vehicle.model,
        year: vehicle.manufacturingYear,
        fuelType: vehicle.fuelType,
        vehicleType: vehicle.vehicleType,
        source: 'main'
      }));

    // Get vehicles from chatbot mock data (filter by type)
    const chatbotVehicles = Object.keys(chatbotVehicleData)
      .filter(key => chatbotVehicleData[key].type === type)
      .map(key => ({
        vehicleNumber: key,
        model: `${chatbotVehicleData[key].brand} ${chatbotVehicleData[key].model}`,
        year: chatbotVehicleData[key].year,
        fuelType: chatbotVehicleData[key].fuelType,
        vehicleType: chatbotVehicleData[key].type,
        source: 'chatbot'
      }));

    return [...mainVehicles, ...chatbotVehicles];
  }, [type]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const allVehicles = getAllVehicles();
    
    if (inputValue.length > 0) {
      const filtered = allVehicles.filter(vehicle =>
        vehicle.vehicleNumber.toLowerCase().includes(inputValue.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredVehicles(filtered.slice(0, 8)); // Limit to 8 results
    } else {
      // Show a few examples when no input
      setFilteredVehicles(allVehicles.slice(0, 6));
    }
  }, [inputValue, type, getAllVehicles]);

  const handleInputChange = (e) => {
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    setShowDropdown(true);
    onChange(newValue);
  };

  const handleVehicleSelect = (vehicle) => {
    setInputValue(vehicle.vehicleNumber);
    setShowDropdown(false);
    onChange(vehicle.vehicleNumber);
    
    // Store additional vehicle details for later use
    const vehicleDetails = {
      vehicleNumber: vehicle.vehicleNumber,
      model: vehicle.model,
      manufacturingYear: vehicle.year,
      vehicleType: vehicle.vehicleType,
      fuelType: vehicle.fuelType
    };
    localStorage.setItem('selectedVehicleDetails', JSON.stringify(vehicleDetails));
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    // Delay hiding to allow click on dropdown item
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className={`vehicle-dropdown-container ${className}`}>
      {showLabel && (
        <div className="vehicle-dropdown-label">
          <span>Vehicle Registration Number</span>
          <span className="demo-indicator">
            🔧 Demo Data Available - {getAllVehicles().length} vehicles in database
          </span>
        </div>
      )}
      
      <div className="vehicle-input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="vehicle-input"
          disabled={disabled}
        />
        
        {showDropdown && filteredVehicles.length > 0 && (
          <div className="vehicle-dropdown">
            <div className="dropdown-header">
              <span>📋 Available Demo Vehicles ({filteredVehicles.length})</span>
              <span className="dropdown-subtitle">Select any vehicle to see complete details</span>
            </div>
            
            {filteredVehicles.map((vehicle, index) => (
              <div
                key={`${vehicle.vehicleNumber}-${index}`}
                className="dropdown-item"
                onClick={() => handleVehicleSelect(vehicle)}
              >
                <div className="vehicle-info">
                  <div className="vehicle-number">{vehicle.vehicleNumber}</div>
                  <div className="vehicle-details">
                    <span className="vehicle-model">{vehicle.model}</span>
                    <span className="vehicle-year">{vehicle.year}</span>
                    <span className="vehicle-fuel">{vehicle.fuelType}</span>
                  </div>
                </div>
                <div className="select-indicator">Select →</div>
              </div>
            ))}
            
            <div className="dropdown-footer">
              💡 This showcases our comprehensive vehicle database structure
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDropdown; 