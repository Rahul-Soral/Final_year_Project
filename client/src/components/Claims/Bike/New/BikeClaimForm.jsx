import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  FaMotorcycle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClipboardList,
  FaExclamationTriangle,
  FaChevronRight,
  FaSave,
  FaFileAlt,
  FaCamera,
  FaCheck,
  FaUserInjured,
  FaWrench,
  FaExclamationCircle,
  FaCloudUploadAlt,
  FaMicrophone,
  FaThermometerHalf,
  FaCloudRain,
  FaTrafficLight,
  FaUser
} from 'react-icons/fa';
import VehicleDropdown from '../../../VehicleDropdown/VehicleDropdown';
import './BikeClaimForm.css';

const BikeClaimForm = () => {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    policyNumber: '',
    bikeNumber: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    claimType: ''
  });

  const [incidentDetails, setIncidentDetails] = useState({
    description: '',
    speed: '',
    weatherCondition: '',
    otherVehiclesInvolved: 'no',
    otherVehicleDetails: '',
    lastSeenLocation: '',
    policeReportNumber: '',
    dateReported: '',
    disasterType: '',
    damageExtent: ''
  });

  const [damageAssessment, setDamageAssessment] = useState({
    damagedAreas: [],
    severityScale: '',
    photos: [],
    voiceNote: null
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    injuries: 'no',
    injurySeverity: '',
    thirdPartyInvolvement: 'no',
    thirdPartyDetails: '',
    witnesses: 'no',
    witnessDetails: '',
    policeReportFiled: 'no',
    policeDetails: ''
  });

  const [serviceOptions, setServiceOptions] = useState({
    preferredGarage: '',
    preferredContactMethod: 'email',
    towingNeeded: 'no',
    rentalBikeRequired: 'no'
  });

  // Handle input changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIncidentDetailsChange = (e) => {
    const { name, value } = e.target;
    setIncidentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for the current step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmitClaim();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSaveDraft = () => {
    const formData = {
      basicInfo,
      incidentDetails,
      damageAssessment,
      additionalInfo,
      serviceOptions
    };
    
    localStorage.setItem('bikeClaimDraft', JSON.stringify(formData));
    alert('Your claim draft has been saved!');
  };

  const handleSubmitClaim = () => {
    alert('Your claim has been submitted successfully!');
    history.push('/dashboard');
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    const progress = (currentStep / totalSteps) * 100;
    return (
      <div className="progress-indicator">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="steps-display">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    );
  };

  // Render basic info step
  const renderBasicInfoStep = () => (
    <div className="form-step">
      <h2><FaMotorcycle className="step-icon" /> Basic Information</h2>
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="policyNumber">Policy Number</label>
          <div className="input-with-icon">
            <FaFileAlt className="input-icon" />
            <input
              type="text"
              id="policyNumber"
              name="policyNumber"
              value={basicInfo.policyNumber}
              onChange={handleBasicInfoChange}
              placeholder="Enter your policy number"
            />
          </div>
        </div>
        <div className="form-group">
          <VehicleDropdown
            value={basicInfo.bikeNumber}
            onChange={(value) => handleBasicInfoChange({ target: { name: 'bikeNumber', value } })}
            placeholder="Enter your bike registration number or select from demo database"
            type="bike"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="incidentDate">Incident Date</label>
            <div className="input-with-icon">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                id="incidentDate"
                name="incidentDate"
                value={basicInfo.incidentDate}
                onChange={handleBasicInfoChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="incidentTime">Incident Time</label>
            <div className="input-with-icon">
              <FaCalendarAlt className="input-icon" />
              <input
                type="time"
                id="incidentTime"
                name="incidentTime"
                value={basicInfo.incidentTime}
                onChange={handleBasicInfoChange}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="incidentLocation">Incident Location</label>
          <div className="input-with-icon">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              id="incidentLocation"
              name="incidentLocation"
              value={basicInfo.incidentLocation}
              onChange={handleBasicInfoChange}
              placeholder="Enter incident location"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="claimType">Type of Claim</label>
          <select
            id="claimType"
            name="claimType"
            value={basicInfo.claimType}
            onChange={handleBasicInfoChange}
          >
            <option value="">Select claim type</option>
            <option value="accident">Accident</option>
            <option value="theft">Theft</option>
            <option value="natural_disaster">Natural Disaster</option>
            <option value="fire">Fire</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render incident details step
  const renderIncidentDetailsStep = () => (
    <div className="form-step">
      <h2><FaClipboardList className="step-icon" /> Incident Details</h2>
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="description">Incident Description</label>
          <textarea
            id="description"
            name="description"
            value={incidentDetails.description}
            onChange={handleIncidentDetailsChange}
            placeholder="Please describe what happened in detail"
            rows="4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="speed">Speed at the time of incident</label>
          <input
            type="text"
            id="speed"
            name="speed"
            value={incidentDetails.speed}
            onChange={handleIncidentDetailsChange}
            placeholder="Enter speed in km/h"
          />
        </div>
        <div className="form-group">
          <label htmlFor="weatherCondition">Weather Condition</label>
          <select
            id="weatherCondition"
            name="weatherCondition"
            value={incidentDetails.weatherCondition}
            onChange={handleIncidentDetailsChange}
          >
            <option value="">Select weather condition</option>
            <option value="clear">Clear</option>
            <option value="rainy">Rainy</option>
            <option value="foggy">Foggy</option>
            <option value="stormy">Stormy</option>
          </select>
        </div>
        <div className="form-group">
          <label>Other Vehicles Involved?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="otherVehiclesInvolved"
                value="yes"
                checked={incidentDetails.otherVehiclesInvolved === 'yes'}
                onChange={handleIncidentDetailsChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="otherVehiclesInvolved"
                value="no"
                checked={incidentDetails.otherVehiclesInvolved === 'no'}
                onChange={handleIncidentDetailsChange}
              />
              No
            </label>
          </div>
        </div>
        {incidentDetails.otherVehiclesInvolved === 'yes' && (
          <div className="form-group">
            <label htmlFor="otherVehicleDetails">Other Vehicle Details</label>
            <textarea
              id="otherVehicleDetails"
              name="otherVehicleDetails"
              value={incidentDetails.otherVehicleDetails}
              onChange={handleIncidentDetailsChange}
              placeholder="Please provide details of other vehicles involved"
              rows="3"
            />
          </div>
        )}
      </div>
    </div>
  );

  // Render damage assessment step
  const renderDamageAssessmentStep = () => (
    <div className="form-step">
      <h2><FaWrench className="step-icon" /> Damage Assessment</h2>
      <div className="form-section">
        <div className="form-group">
          <label>Damaged Areas</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={damageAssessment.damagedAreas.includes('front')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...damageAssessment.damagedAreas, 'front']
                    : damageAssessment.damagedAreas.filter(area => area !== 'front');
                  setDamageAssessment(prev => ({ ...prev, damagedAreas: newAreas }));
                }}
              />
              Front
            </label>
            <label>
              <input
                type="checkbox"
                checked={damageAssessment.damagedAreas.includes('rear')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...damageAssessment.damagedAreas, 'rear']
                    : damageAssessment.damagedAreas.filter(area => area !== 'rear');
                  setDamageAssessment(prev => ({ ...prev, damagedAreas: newAreas }));
                }}
              />
              Rear
            </label>
            <label>
              <input
                type="checkbox"
                checked={damageAssessment.damagedAreas.includes('left')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...damageAssessment.damagedAreas, 'left']
                    : damageAssessment.damagedAreas.filter(area => area !== 'left');
                  setDamageAssessment(prev => ({ ...prev, damagedAreas: newAreas }));
                }}
              />
              Left Side
            </label>
            <label>
              <input
                type="checkbox"
                checked={damageAssessment.damagedAreas.includes('right')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...damageAssessment.damagedAreas, 'right']
                    : damageAssessment.damagedAreas.filter(area => area !== 'right');
                  setDamageAssessment(prev => ({ ...prev, damagedAreas: newAreas }));
                }}
              />
              Right Side
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="severityScale">Damage Severity</label>
          <select
            id="severityScale"
            name="severityScale"
            value={damageAssessment.severityScale}
            onChange={(e) => setDamageAssessment(prev => ({ ...prev, severityScale: e.target.value }))}
          >
            <option value="">Select severity</option>
            <option value="minor">Minor (Scratches, small dents)</option>
            <option value="moderate">Moderate (Major dents, broken parts)</option>
            <option value="severe">Severe (Structural damage)</option>
            <option value="total">Total Loss</option>
          </select>
        </div>
        <div className="form-group">
          <label>Upload Photos</label>
          <div className="photo-upload">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setDamageAssessment(prev => ({
                  ...prev,
                  photos: [...prev.photos, ...files]
                }));
              }}
            />
            <FaCloudUploadAlt className="upload-icon" />
            <span>Click to upload photos of the damage</span>
          </div>
          {damageAssessment.photos.length > 0 && (
            <div className="uploaded-photos">
              {damageAssessment.photos.map((photo, index) => (
                <div key={index} className="photo-preview">
                  <img src={URL.createObjectURL(photo)} alt={`Damage ${index + 1}`} />
                  <button
                    onClick={() => {
                      setDamageAssessment(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render additional information step
  const renderAdditionalInfoStep = () => (
    <div className="form-step">
      <h2><FaExclamationCircle className="step-icon" /> Additional Information</h2>
      <div className="form-section">
        <div className="form-group">
          <label>Were there any injuries?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="injuries"
                value="yes"
                checked={additionalInfo.injuries === 'yes'}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, injuries: e.target.value }))}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="injuries"
                value="no"
                checked={additionalInfo.injuries === 'no'}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, injuries: e.target.value }))}
              />
              No
            </label>
          </div>
        </div>
        {additionalInfo.injuries === 'yes' && (
          <div className="form-group">
            <label htmlFor="injurySeverity">Injury Severity</label>
            <select
              id="injurySeverity"
              name="injurySeverity"
              value={additionalInfo.injurySeverity}
              onChange={(e) => setAdditionalInfo(prev => ({ ...prev, injurySeverity: e.target.value }))}
            >
              <option value="">Select severity</option>
              <option value="minor">Minor (First aid required)</option>
              <option value="moderate">Moderate (Medical attention required)</option>
              <option value="severe">Severe (Hospitalization required)</option>
            </select>
          </div>
        )}
        <div className="form-group">
          <label>Third Party Involvement?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="thirdPartyInvolvement"
                value="yes"
                checked={additionalInfo.thirdPartyInvolvement === 'yes'}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, thirdPartyInvolvement: e.target.value }))}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="thirdPartyInvolvement"
                value="no"
                checked={additionalInfo.thirdPartyInvolvement === 'no'}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, thirdPartyInvolvement: e.target.value }))}
              />
              No
            </label>
          </div>
        </div>
        {additionalInfo.thirdPartyInvolvement === 'yes' && (
          <div className="form-group">
            <label htmlFor="thirdPartyDetails">Third Party Details</label>
            <textarea
              id="thirdPartyDetails"
              name="thirdPartyDetails"
              value={additionalInfo.thirdPartyDetails}
              onChange={(e) => setAdditionalInfo(prev => ({ ...prev, thirdPartyDetails: e.target.value }))}
              placeholder="Please provide details of third party involvement"
              rows="3"
            />
          </div>
        )}
        <div className="form-group">
          <label>Were there any witnesses?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="witnesses"
                value="yes"
                checked={additionalInfo.witnesses === 'yes'}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, witnesses: e.target.value }))}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="witnesses"
                value="no"
                checked={additionalInfo.witnesses === 'no'}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, witnesses: e.target.value }))}
              />
              No
            </label>
          </div>
        </div>
        {additionalInfo.witnesses === 'yes' && (
          <div className="form-group">
            <label htmlFor="witnessDetails">Witness Details</label>
            <textarea
              id="witnessDetails"
              name="witnessDetails"
              value={additionalInfo.witnessDetails}
              onChange={(e) => setAdditionalInfo(prev => ({ ...prev, witnessDetails: e.target.value }))}
              placeholder="Please provide witness contact information"
              rows="3"
            />
          </div>
        )}
      </div>
    </div>
  );

  // Render service options step
  const renderServiceOptionsStep = () => (
    <div className="form-step">
      <h2><FaWrench className="step-icon" /> Service Options</h2>
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="preferredGarage">Preferred Garage</label>
          <select
            id="preferredGarage"
            name="preferredGarage"
            value={serviceOptions.preferredGarage}
            onChange={(e) => setServiceOptions(prev => ({ ...prev, preferredGarage: e.target.value }))}
          >
            <option value="">Select preferred garage</option>
            <option value="garage1">Garage 1</option>
            <option value="garage2">Garage 2</option>
            <option value="garage3">Garage 3</option>
          </select>
        </div>
        <div className="form-group">
          <label>Preferred Contact Method</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="preferredContactMethod"
                value="email"
                checked={serviceOptions.preferredContactMethod === 'email'}
                onChange={(e) => setServiceOptions(prev => ({ ...prev, preferredContactMethod: e.target.value }))}
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                name="preferredContactMethod"
                value="phone"
                checked={serviceOptions.preferredContactMethod === 'phone'}
                onChange={(e) => setServiceOptions(prev => ({ ...prev, preferredContactMethod: e.target.value }))}
              />
              Phone
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Do you need towing service?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="towingNeeded"
                value="yes"
                checked={serviceOptions.towingNeeded === 'yes'}
                onChange={(e) => setServiceOptions(prev => ({ ...prev, towingNeeded: e.target.value }))}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="towingNeeded"
                value="no"
                checked={serviceOptions.towingNeeded === 'no'}
                onChange={(e) => setServiceOptions(prev => ({ ...prev, towingNeeded: e.target.value }))}
              />
              No
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Do you need a rental bike?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="rentalBikeRequired"
                value="yes"
                checked={serviceOptions.rentalBikeRequired === 'yes'}
                onChange={(e) => setServiceOptions(prev => ({ ...prev, rentalBikeRequired: e.target.value }))}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="rentalBikeRequired"
                value="no"
                checked={serviceOptions.rentalBikeRequired === 'no'}
                onChange={(e) => setServiceOptions(prev => ({ ...prev, rentalBikeRequired: e.target.value }))}
              />
              No
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Render review step
  const renderReviewStep = () => (
    <div className="form-step">
      <h2><FaCheck className="step-icon" /> Review & Submit</h2>
      <div className="form-section review-section">
        <div className="review-group">
          <h3>Basic Information</h3>
          <div className="review-item">
            <span>Policy Number:</span>
            <span>{basicInfo.policyNumber}</span>
          </div>
          <div className="review-item">
            <span>Bike Number:</span>
            <span>{basicInfo.bikeNumber}</span>
          </div>
          <div className="review-item">
            <span>Incident Date:</span>
            <span>{basicInfo.incidentDate}</span>
          </div>
          <div className="review-item">
            <span>Incident Time:</span>
            <span>{basicInfo.incidentTime}</span>
          </div>
          <div className="review-item">
            <span>Incident Location:</span>
            <span>{basicInfo.incidentLocation}</span>
          </div>
          <div className="review-item">
            <span>Claim Type:</span>
            <span>{basicInfo.claimType}</span>
          </div>
        </div>

        <div className="review-group">
          <h3>Incident Details</h3>
          <div className="review-item">
            <span>Description:</span>
            <span>{incidentDetails.description}</span>
          </div>
          <div className="review-item">
            <span>Speed:</span>
            <span>{incidentDetails.speed} km/h</span>
          </div>
          <div className="review-item">
            <span>Weather Condition:</span>
            <span>{incidentDetails.weatherCondition}</span>
          </div>
          <div className="review-item">
            <span>Other Vehicles Involved:</span>
            <span>{incidentDetails.otherVehiclesInvolved}</span>
          </div>
          {incidentDetails.otherVehiclesInvolved === 'yes' && (
            <div className="review-item">
              <span>Other Vehicle Details:</span>
              <span>{incidentDetails.otherVehicleDetails}</span>
            </div>
          )}
        </div>

        <div className="review-group">
          <h3>Damage Assessment</h3>
          <div className="review-item">
            <span>Damaged Areas:</span>
            <span>{damageAssessment.damagedAreas.join(', ')}</span>
          </div>
          <div className="review-item">
            <span>Severity:</span>
            <span>{damageAssessment.severityScale}</span>
          </div>
          <div className="review-item">
            <span>Photos Uploaded:</span>
            <span>{damageAssessment.photos.length} photos</span>
          </div>
        </div>

        <div className="review-group">
          <h3>Additional Information</h3>
          <div className="review-item">
            <span>Injuries:</span>
            <span>{additionalInfo.injuries}</span>
          </div>
          {additionalInfo.injuries === 'yes' && (
            <div className="review-item">
              <span>Injury Severity:</span>
              <span>{additionalInfo.injurySeverity}</span>
            </div>
          )}
          <div className="review-item">
            <span>Third Party Involvement:</span>
            <span>{additionalInfo.thirdPartyInvolvement}</span>
          </div>
          {additionalInfo.thirdPartyInvolvement === 'yes' && (
            <div className="review-item">
              <span>Third Party Details:</span>
              <span>{additionalInfo.thirdPartyDetails}</span>
            </div>
          )}
          <div className="review-item">
            <span>Witnesses:</span>
            <span>{additionalInfo.witnesses}</span>
          </div>
          {additionalInfo.witnesses === 'yes' && (
            <div className="review-item">
              <span>Witness Details:</span>
              <span>{additionalInfo.witnessDetails}</span>
            </div>
          )}
        </div>

        <div className="review-group">
          <h3>Service Options</h3>
          <div className="review-item">
            <span>Preferred Garage:</span>
            <span>{serviceOptions.preferredGarage}</span>
          </div>
          <div className="review-item">
            <span>Preferred Contact Method:</span>
            <span>{serviceOptions.preferredContactMethod}</span>
          </div>
          <div className="review-item">
            <span>Towing Needed:</span>
            <span>{serviceOptions.towingNeeded}</span>
          </div>
          <div className="review-item">
            <span>Rental Bike Required:</span>
            <span>{serviceOptions.rentalBikeRequired}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bike-claim-form-container">
      <div className="claim-form-header">
        <h1><FaMotorcycle /> New Bike Insurance Claim</h1>
        <div className="form-actions-top">
          <button className="save-draft-btn" onClick={handleSaveDraft}>
            <FaSave /> Save Draft
          </button>
        </div>
      </div>

      {renderProgressIndicator()}

      <div className="claim-form-content">
        {currentStep === 1 && renderBasicInfoStep()}
        {currentStep === 2 && renderIncidentDetailsStep()}
        {currentStep === 3 && renderDamageAssessmentStep()}
        {currentStep === 4 && renderAdditionalInfoStep()}
        {currentStep === 5 && renderServiceOptionsStep()}
        {currentStep === 6 && renderReviewStep()}
      </div>

      <div className="form-navigation">
        {currentStep > 1 && (
          <button className="prev-btn" onClick={handlePrevStep}>
            Previous
          </button>
        )}
        <button className="next-btn" onClick={handleNextStep}>
          {currentStep === totalSteps ? 'Submit Claim' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default BikeClaimForm; 