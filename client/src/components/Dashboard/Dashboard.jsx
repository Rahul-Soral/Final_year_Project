import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import PolicyService from '../../services/policy.service';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const [databaseStatus, setDatabaseStatus] = useState('unknown');
  const [useMockData, setUseMockData] = useState(false);

  // Mock data function
  const loadMockData = () => {
    setUser({
      name: 'Demo User',
      email: 'demo@example.com',
      mobile: '1234567890'
    });
    setPolicies([
      {
        id: '1',
        policyNumber: 'POL-001',
        type: 'Comprehensive',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        premium: 5000
      }
    ]);
    setUseMockData(true);
  };

  // Check server availability with enhanced status info
  const checkServerAvailability = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:8080/health', { 
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setIsServerAvailable(true);
        setDatabaseStatus(data.database || 'unknown');
        return {
          available: true,
          database: data.database || 'unknown'
        };
      } else {
        setIsServerAvailable(false);
        setDatabaseStatus('disconnected');
        return { available: false, database: 'disconnected' };
      }
    } catch (error) {
      console.warn('Server health check failed:', error.message);
      setIsServerAvailable(false);
      setDatabaseStatus('disconnected');
      return { available: false, database: 'disconnected' };
    }
  };

  useEffect(() => {
    sessionStorage.removeItem('policy_created');
    
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      // First check server status
      const serverStatus = await checkServerAvailability();
      
      if (!serverStatus.available) {
        console.log("Server unavailable, using mock data");
        loadMockData();
        setLoading(false);
        return;
      }
      
      if (serverStatus.database === 'disconnected') {
        setError("Server is running but database is disconnected. Some features may be unavailable.");
      }
      
      try {
        // Get user profile with better error handling
        try {
          const userResponse = await AuthService.getProfile();
          if (userResponse && userResponse.data) {
            setUser(userResponse.data);
          } else {
            console.warn("Invalid user data response:", userResponse);
            // Don't set error yet, try to fetch policies anyway
          }
        } catch (userError) {
          console.error("Error fetching user profile:", userError);
          // Continue with policies fetch, don't set error yet
        }

        // Get policies with better error handling
        try {
          const policiesResponse = await PolicyService.getPolicies();
          console.log("Policies fetched:", policiesResponse);
          
          if (policiesResponse && policiesResponse.data) {
            setPolicies(policiesResponse.data);
          } else {
            console.warn("No policies data in response:", policiesResponse);
            setPolicies([]);
          }
        } catch (policyError) {
          console.error("Error fetching policies:", policyError);
          setPolicies([]);
          // We'll show empty policies rather than an error
        }

        // Only set error if we failed to get both user and policies
        if (!user && policies.length === 0) {
          setError('Please check your connection and try again');
        }

        setLoading(false);
      } catch (error) {
        console.error("Dashboard error:", error);
        
        // More specific error messages based on the error type
        if (error.message && error.message.includes('Network Error')) {
          setError('Network error. Please check your internet connection.');
        } else if (error.response && error.response.status === 401) {
          setError('Session expired. Please log in again.');
          // Redirect to login after a short delay
          setTimeout(() => {
            AuthService.logout();
            window.location.href = '/login';
          }, 2000);
        } else {
          setError('Failed to load dashboard data. Please try refreshing.');
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const refreshPolicies = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-badge status-active';
      case 'expired':
        return 'status-badge status-expired';
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge';
    }
  };

  if (!isServerAvailable) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>My Dashboard</h1>
            <div className="dashboard-actions">
              <button onClick={() => setRefreshKey(prevKey => prevKey + 1)} className="dashboard-button secondary refresh-button">
                Try Again
              </button>
              <Link to="/profile" className="dashboard-button secondary">
                Edit Profile
              </Link>
              <Link to="/cars/useofcar" className="dashboard-button primary">
                Buy New Policy
              </Link>
            </div>
          </div>
          
          <div className="server-unavailable-message">
            <div className="message-icon">🔌</div>
            <h3>Server is currently unavailable</h3>
            <p>We're having trouble connecting to our servers. This could be due to maintenance or temporary network issues.</p>
            <p>You can try again or continue using other parts of the application that don't require server connection.</p>
            <button onClick={() => setRefreshKey(prevKey => prevKey + 1)} className="dashboard-button secondary">
              Retry Connection
            </button>
          </div>
          
          {user && (
            <div className="user-info-card">
              <div className="user-info-header">
                <h2>Personal Information (Cached)</h2>
                <Link to="/profile" className="edit-link">
                  Edit
                </Link>
              </div>
              <div className="user-info-content">
                <div className="user-info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="user-info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                {user.mobile && (
                  <div className="user-info-item">
                    <span className="info-label">Mobile</span>
                    <span className="info-value">{user.mobile}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="policies-section">
            <h2>My Policies</h2>
            <div className="no-policies">
              <p>We can't load your policies right now.</p>
              <p className="policy-note">Please try again when the server is available.</p>
              <Link to="/cars/useofcar" className="dashboard-button primary">
                Buy a New Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <div className="dashboard-actions">
            <button onClick={() => setRefreshKey(prevKey => prevKey + 1)} className="dashboard-button secondary refresh-button">
              Refresh
            </button>
            {!isServerAvailable && (
              <div className="server-status-indicator">
                Server Offline
                <span className="status-dot offline"></span>
              </div>
            )}
            {isServerAvailable && databaseStatus === 'disconnected' && (
              <div className="database-status-indicator">
                Database Offline
                <span className="status-dot warning"></span>
              </div>
            )}
            {useMockData && (
              <div className="mock-data-indicator">
                Demo Mode
              </div>
            )}
            <Link to="/profile" className="dashboard-button secondary">
              Edit Profile
            </Link>
            <Link to="/cars/useofcar" className="dashboard-button primary">
              Buy New Policy
            </Link>
          </div>
        </div>

        {error && <div className="dashboard-error">{error}</div>}

        {user ? (
          <div className="user-info-card">
            <div className="user-info-header">
              <h2>Personal Information</h2>
              <Link to="/profile" className="edit-link">
                Edit
              </Link>
            </div>
            <div className="user-info-content">
              <div className="user-info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="user-info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="user-info-item">
                <span className="info-label">Mobile</span>
                <span className="info-value">{user.mobile}</span>
              </div>
              {user.address && (
                <div className="user-info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">
                    {user.address}, {user.city}, {user.state} {user.pincode}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="user-info-card">
            <div className="user-info-header">
              <h2>Welcome to Your Dashboard</h2>
            </div>
            <div className="user-info-content">
              <p>You can browse and purchase insurance policies without logging in!</p>
              <p>To save your policies and access your personal dashboard, please <Link to="/login">login</Link> or <Link to="/register">create an account</Link>.</p>
            </div>
          </div>
        )}

        <div className="policies-section">
          <h2>{user ? 'My Policies' : 'Insurance Policies'}</h2>
          
          {policies.length === 0 ? (
            <div className="no-policies">
              {user ? (
                <>
                  <p>You don't have any policies yet.</p>
                  <p className="policy-note">If you've recently purchased a policy, please click the "Refresh Policies" button above.</p>
                  <Link to="/cars/useofcar" className="dashboard-button primary">
                    Buy Your First Policy
                  </Link>
                </>
              ) : (
                <>
                  <p>Start exploring insurance options!</p>
                  <p className="policy-note">You can browse and get quotes without creating an account.</p>
                  <div className="dashboard-actions">
                    <Link to="/cars/useofcar" className="dashboard-button primary">
                      Car Insurance
                    </Link>
                    <Link to="/bikes/useofbike" className="dashboard-button primary">
                      Bike Insurance
                    </Link>
                    <Link to="/health/profile" className="dashboard-button primary">
                      Health Insurance
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="policies-grid">
              {policies.map((policy) => (
                <div className="policy-card" key={policy._id}>
                  <div className="policy-header">
                    <h3>{policy.vehicleDetails.make} {policy.vehicleDetails.model}</h3>
                    <span className={getStatusBadgeClass(policy.status)}>
                      {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="policy-details">
                    <div className="policy-detail-item">
                      <span className="detail-label">Policy Number</span>
                      <span className="detail-value">{policy.policyNumber}</span>
                    </div>
                    <div className="policy-detail-item">
                      <span className="detail-label">Policy Type</span>
                      <span className="detail-value">{policy.policyType}</span>
                    </div>
                    <div className="policy-detail-item">
                      <span className="detail-label">Valid From</span>
                      <span className="detail-value">{formatDate(policy.startDate)}</span>
                    </div>
                    <div className="policy-detail-item">
                      <span className="detail-label">Valid Until</span>
                      <span className="detail-value">{formatDate(policy.endDate)}</span>
                    </div>
                    <div className="policy-detail-item">
                      <span className="detail-label">Premium</span>
                      <span className="detail-value">₹{policy.premium.totalPremium}</span>
                    </div>
                  </div>
                  
                  <div className="policy-actions">
                    <Link to={`/policies/${policy._id}`} className="policy-button">
                      View Details
                    </Link>
                    {policy.status === 'active' && (
                      <Link to={`/policies/${policy._id}/claim`} className="policy-button claim">
                        File a Claim
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 