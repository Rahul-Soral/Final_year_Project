import axios from 'axios';
import AuthService from './auth.service';

// For production
// const API_URL = 'https://acko.herokuapp.com';

// For local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('acko_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Policy service
const PolicyService = {
  // Get all policies
  getPolicies: async () => {
    try {
      // Add timeout to prevent hanging requests
      const response = await api.get('/policies', { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.error('Error getting policies:', error);
      
      // More detailed error handling
      if (error.code === 'ECONNABORTED') {
        throw { message: 'Request timed out. Server might be unavailable.' };
      } else if (!error.response) {
        throw { message: 'Network error. Please check your connection.' };
      } else if (error.response.status === 401) {
        // Token expired, clear it but don't force redirect
        AuthService.logout();
        throw { message: 'Authentication expired. Some features may be limited.' };
      } else if (error.response.status >= 500) {
        throw { message: 'Server error. Please try again later.' };
      }
      
      throw error.response ? error.response.data : error;
    }
  },

  // Get a specific policy
  getPolicy: async (policyId) => {
    try {
      const response = await api.get(`/policies/${policyId}`, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.error('Error getting policy:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw { message: 'Request timed out. Server might be unavailable.' };
      } else if (!error.response) {
        throw { message: 'Network error. Please check your connection.' };
      }
      
      throw error.response ? error.response.data : error;
    }
  },

  // Create a new policy
  createPolicy: async (policyData) => {
    try {
      const response = await api.post('/policies', policyData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Update a policy
  updatePolicy: async (policyId, policyData) => {
    try {
      const response = await api.patch(`/policies/${policyId}`, policyData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Add a claim to a policy
  addClaim: async (policyId, claimData) => {
    try {
      const response = await api.post(`/policies/${policyId}/claims`, claimData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Convert existing policy data to new format
  convertExistingPolicy: async () => {
    try {
      // Get user ID from localStorage or from current user
      const userId = localStorage.getItem('ackoUserId') || AuthService.getCurrentUser()?.id;
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Check if this is a car or bike policy
      const vehicleType = localStorage.getItem('vehicleType') || 'car';
      const isPolicyForBike = vehicleType === 'bike';

      // Get vehicle details from localStorage
      let vehicleNumber, vehicleMake, vehicleModel, vehicleYear, policyType;
      
      if (isPolicyForBike) {
        // Bike details
        vehicleNumber = localStorage.getItem('bikeNumber') || 'KA01AB1234';
        vehicleMake = localStorage.getItem('bikeMake') || 'Honda';
        vehicleModel = localStorage.getItem('bikeModel') || 'CB Shine';
        vehicleYear = localStorage.getItem('bikeYear') || new Date().getFullYear().toString();
        policyType = localStorage.getItem('policyType') || 'Comprehensive Bike Insurance';
      } else {
        // Car details
        vehicleNumber = localStorage.getItem('carNumber') || 'KA01AB1234';
        vehicleMake = localStorage.getItem('carMake') || 'Ford';
        vehicleModel = localStorage.getItem('carModel') || 'Titanium AT';
        vehicleYear = localStorage.getItem('carYear') || new Date().getFullYear().toString();
        policyType = localStorage.getItem('policyType') || 'Comprehensive Car Insurance';
      }
      
      // Get premium details
      const totalPremium = localStorage.getItem('totalacko');
      if (!totalPremium) {
        throw new Error('Premium details not found. Please restart the policy purchase process.');
      }

      // Calculate premium components
      const basePremium = Math.round(parseFloat(totalPremium) * 0.7);
      const thirdPartyPremium = Math.round(parseFloat(totalPremium) * 0.15);
      const gst = Math.round(parseFloat(totalPremium) * 0.15);
      
      // Generate a policy number
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const policyNumber = `ACKO-${randomNum}`;
      
      // Create policy data with more realistic values
      const policyData = {
        policyNumber: policyNumber,
        policyType: policyType,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'active',
        vehicleType: isPolicyForBike ? 'bike' : 'car',
        vehicleDetails: {
          make: vehicleMake,
          model: vehicleModel,
          year: parseInt(vehicleYear),
          registrationNumber: vehicleNumber,
          usage: isPolicyForBike ? localStorage.getItem('bikeUse') || 'Personal use' : undefined
        },
        coverage: {
          thirdPartyLiability: true,
          ownDamage: true,
          personalAccidentCover: localStorage.getItem('paCover') === 'true',
          consumablesCover: localStorage.getItem('consumablesCover') === 'true' || false,
          zeroDepreciation: localStorage.getItem('zeroDepreciation') === 'true' || false,
          engineProtection: localStorage.getItem('engineProtection') === 'true' || false,
          roadSideAssistance: localStorage.getItem('roadSideAssistance') === 'true' || false
        },
        premium: {
          basePremium: basePremium,
          ownDamagePremium: basePremium,
          thirdPartyPremium: thirdPartyPremium,
          addOnsPremium: Math.round(parseFloat(totalPremium) * 0.05),
          ncbDiscount: localStorage.getItem('ncbDiscount') || 0,
          gst: gst,
          totalPremium: totalPremium
        }
      };

      console.log(`Creating ${isPolicyForBike ? 'bike' : 'car'} policy with data:`, policyData);

      // Create policy
      const policyResponse = await api.post('/policies', policyData);
      return policyResponse.data;
    } catch (error) {
      console.error("Error creating policy:", error);
      throw error.response ? error.response.data : error;
    }
  }
};

export default PolicyService; 