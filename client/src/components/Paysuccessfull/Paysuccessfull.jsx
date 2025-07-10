import React, { useEffect, useState } from 'react'
import style from "./paysuccessfull.module.css"
import { Link, useHistory } from "react-router-dom"
import PolicyService from '../../services/policy.service'
import AuthService from '../../services/auth.service'

function Paysuccessfull() {
  const history = useHistory()
  const [policyCreated, setPolicyCreated] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Create policy when component mounts
    const createPolicy = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in (optional now)
        if (!AuthService.isLoggedIn()) {
          console.log("User not logged in, but proceeding with policy creation");
          // Continue with policy creation even without authentication
        }

        // Check if we already created a policy (to prevent duplicates on refresh)
        const policyCreatedFlag = sessionStorage.getItem('policy_created');
        if (policyCreatedFlag === 'true') {
          console.log("Policy already created, skipping creation");
          setPolicyCreated(true);
          setIsLoading(false);
          return;
        }

        // Create the policy
        console.log("Creating policy...");
        const result = await PolicyService.convertExistingPolicy();
        console.log("Policy created successfully:", result);
        
        // Mark as created
        setPolicyCreated(true);
        sessionStorage.setItem('policy_created', 'true');
      } catch (err) {
        console.error("Error creating policy:", err);
        setError(err.message || "Failed to create policy");
      } finally {
        setIsLoading(false);
      }
    };

    createPolicy();
  }, []);

  const handleContinue = () => {
    // Clear vehicle data but not user authentication
    // Clear car data
    localStorage.removeItem("ackoid");
    localStorage.removeItem("totalacko");
    localStorage.removeItem("carNumber");
    localStorage.removeItem("carMake");
    localStorage.removeItem("carModel");
    localStorage.removeItem("carYear");
    
    // Clear bike data
    localStorage.removeItem("bikeNumber");
    localStorage.removeItem("bikeMake");
    localStorage.removeItem("bikeModel");
    localStorage.removeItem("bikeYear");
    localStorage.removeItem("bikeUse");
    localStorage.removeItem("bikePincode");
    localStorage.removeItem("bikeUserData");
    localStorage.removeItem("selectedBikePlan");
    localStorage.removeItem("selectedBikeCoverages");
    localStorage.removeItem("bikeTotalPremium");
    localStorage.removeItem("bikePolicyStatus");
    localStorage.removeItem("bikePolicyExpiryDate");
    
    // Clear common data
    localStorage.removeItem("policyType");
    localStorage.removeItem("vehicleType");
    localStorage.removeItem("paCover");
    localStorage.removeItem("consumablesCover");
    localStorage.removeItem("zeroDepreciation");
    localStorage.removeItem("engineProtection");
    localStorage.removeItem("roadSideAssistance");
    localStorage.removeItem("ncbDiscount");
    localStorage.removeItem("currentPremium");
    localStorage.removeItem("currentIDV");
    
    // Remove the policy creation flag
    sessionStorage.removeItem("policy_created");
    
    // Redirect to dashboard if logged in, otherwise to home
    if (AuthService.isLoggedIn()) {
      history.push("/dashboard");
    } else {
      history.push("/");
    }
  };

  return (
    <div>
      <div
        style={{
          alignItems: "center",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <img
          className={style.payimgg}
          src="https://www.cntraveller.in/wp-content/themes/cntraveller/images/check-circle.gif"
          alt="Payment Successful"
        />
        <h2 className={style.successTitle}>Payment Successful!</h2>
        
        {isLoading ? (
          <p className={style.successMessage}>Processing your policy...</p>
        ) : (
          <>
            <p className={style.successMessage}>
              {AuthService.isLoggedIn() 
                ? `Your policy has been ${policyCreated ? 'created' : 'processed'} successfully.`
                : 'Your policy has been processed successfully.'}
            </p>
            {AuthService.isLoggedIn() && !policyCreated && !error && (
              <p className={style.successMessage}>
                Your policy will be available in your dashboard shortly.
              </p>
            )}
          </>
        )}
        
        {error && (
          <p className={style.errorMessage}>
            Note: {error}. Please contact support if the issue persists.
          </p>
        )}
      </div>
      <div
        style={{
          alignItems: "center",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleContinue}
          className={style.paybtn}
        >
          {AuthService.isLoggedIn() ? 'View My Policies' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default Paysuccessfull
