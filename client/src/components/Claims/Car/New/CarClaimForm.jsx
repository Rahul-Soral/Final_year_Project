import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  FaCar,
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
import './CarClaimForm.css';

const CarClaimForm = () => {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    policyNumber: '',
    vehicleNumber: '',
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
    rentalCarRequired: 'no'
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
    // Form validation would go here
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit the form
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
    // Save form data to localStorage or backend
    const formData = {
      basicInfo,
      incidentDetails,
      damageAssessment,
      additionalInfo,
      serviceOptions
    };
    
    localStorage.setItem('carClaimDraft', JSON.stringify(formData));
    alert('Your claim draft has been saved!');
  };

  const handleSubmitClaim = () => {
    // Submit the form data to backend
    alert('Your claim has been submitted successfully!');
    history.push('/dashboard'); // Redirect to dashboard or confirmation page
  };

  // Conditional form fields based on claim type
  const renderConditionalFields = () => {
    switch (basicInfo.claimType) {
      case 'accident':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="speed">Speed at time of accident (km/h)</label>
                <input
                  type="number"
                  id="speed"
                  name="speed"
                  value={incidentDetails.speed}
                  onChange={handleIncidentDetailsChange}
                  placeholder="Approximate speed"
                />
              </div>
              <div className="form-group">
                <label htmlFor="weatherCondition">Weather conditions</label>
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
                  <option value="snowy">Snowy</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="otherVehiclesInvolved">Were other vehicles involved?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="otherVehiclesInvolved"
                    value="yes"
                    checked={incidentDetails.otherVehiclesInvolved === 'yes'}
                    onChange={handleIncidentDetailsChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
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
                <label htmlFor="otherVehicleDetails">Other vehicle details</label>
                <textarea
                  id="otherVehicleDetails"
                  name="otherVehicleDetails"
                  value={incidentDetails.otherVehicleDetails}
                  onChange={handleIncidentDetailsChange}
                  placeholder="Vehicle registration, driver details, etc."
                  rows="3"
                ></textarea>
              </div>
            )}
          </>
        );
      case 'theft':
        return (
          <>
            <div className="form-group">
              <label htmlFor="lastSeenLocation">Last seen location</label>
              <div className="input-with-icon">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  id="lastSeenLocation"
                  name="lastSeenLocation"
                  value={incidentDetails.lastSeenLocation}
                  onChange={handleIncidentDetailsChange}
                  placeholder="Enter location where vehicle was last seen"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="policeReportNumber">Police report number</label>
                <input
                  type="text"
                  id="policeReportNumber"
                  name="policeReportNumber"
                  value={incidentDetails.policeReportNumber}
                  onChange={handleIncidentDetailsChange}
                  placeholder="Enter FIR number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateReported">Date reported to police</label>
                <div className="input-with-icon">
                  <FaCalendarAlt className="input-icon" />
                  <input
                    type="date"
                    id="dateReported"
                    name="dateReported"
                    value={incidentDetails.dateReported}
                    onChange={handleIncidentDetailsChange}
                  />
                </div>
              </div>
            </div>
          </>
        );
      case 'naturalDisaster':
        return (
          <>
            <div className="form-group">
              <label htmlFor="disasterType">Type of natural disaster</label>
              <select
                id="disasterType"
                name="disasterType"
                value={incidentDetails.disasterType}
                onChange={handleIncidentDetailsChange}
              >
                <option value="">Select disaster type</option>
                <option value="flood">Flood</option>
                <option value="earthquake">Earthquake</option>
                <option value="hurricane">Hurricane/Cyclone</option>
                <option value="hailstorm">Hailstorm</option>
                <option value="landslide">Landslide</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="damageExtent">Extent of damage</label>
              <select
                id="damageExtent"
                name="damageExtent"
                value={incidentDetails.damageExtent}
                onChange={handleIncidentDetailsChange}
              >
                <option value="">Select damage extent</option>
                <option value="minor">Minor - Vehicle is drivable</option>
                <option value="moderate">Moderate - Vehicle needs repairs but salvageable</option>
                <option value="severe">Severe - Vehicle possibly not salvageable</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="steps-display">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    );
  };

  // Render step 1: Basic Information
  const renderBasicInfoStep = () => {
    return (
      <div className="form-step">
        <h2><FaClipboardList className="step-icon" /> Basic Information</h2>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="policyNumber">Policy Number</label>
            <div className="input-with-action">
              <input
                type="text"
                id="policyNumber"
                name="policyNumber"
                value={basicInfo.policyNumber}
                onChange={handleBasicInfoChange}
                placeholder="Enter your policy number"
                required
              />
              <button className="retrieve-btn">Retrieve</button>
            </div>
          </div>

          <div className="form-group">
            <VehicleDropdown
              value={basicInfo.vehicleNumber}
              onChange={(value) => handleBasicInfoChange({ target: { name: 'vehicleNumber', value } })}
              placeholder="Enter your vehicle number or select from demo database"
              type="car"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="incidentDate">Date of Incident</label>
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="date"
                  id="incidentDate"
                  name="incidentDate"
                  value={basicInfo.incidentDate}
                  onChange={handleBasicInfoChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="incidentTime">Time of Incident</label>
              <input
                type="time"
                id="incidentTime"
                name="incidentTime"
                value={basicInfo.incidentTime}
                onChange={handleBasicInfoChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="incidentLocation">Location of Incident</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                id="incidentLocation"
                name="incidentLocation"
                value={basicInfo.incidentLocation}
                onChange={handleBasicInfoChange}
                placeholder="Enter location"
                required
              />
            </div>
            <div className="map-placeholder">
              <p>Map interface would be integrated here</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="claimType">Type of Claim</label>
            <select
              id="claimType"
              name="claimType"
              value={basicInfo.claimType}
              onChange={handleBasicInfoChange}
              required
            >
              <option value="">Select claim type</option>
              <option value="accident">Accident</option>
              <option value="theft">Theft</option>
              <option value="naturalDisaster">Natural disaster</option>
              <option value="fire">Fire</option>
              <option value="thirdParty">Third-party liability</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  // Render step 2: Incident Details
  const renderIncidentDetailsStep = () => {
    return (
      <div className="form-step">
        <h2><FaExclamationTriangle className="step-icon" /> Incident Details</h2>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="description">
              Description of incident
              <span className="character-counter">
                {incidentDetails.description.length}/500
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              value={incidentDetails.description}
              onChange={handleIncidentDetailsChange}
              placeholder="Please provide a detailed description of what happened..."
              rows="5"
              maxLength="500"
              required
            ></textarea>
          </div>

          {renderConditionalFields()}

          <div className="incident-map-interface">
            <h3><FaMapMarkerAlt /> Interactive Map</h3>
            <div className="map-controls">
              <div className="map-placeholder advanced">
                <p>Enhanced map interface with the following features:</p>
                <ul className="feature-list">
                  <li><FaMapMarkerAlt /> Pin exact accident location</li>
                  <li><FaTrafficLight /> Mark traffic signals & landmarks</li>
                  <li><FaUser /> Show street view when available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render step 3: Damage Assessment
  const renderDamageAssessmentStep = () => {
    const handleDamagedAreaToggle = (area) => {
      setDamageAssessment(prev => {
        if (prev.damagedAreas.includes(area)) {
          return { 
            ...prev, 
            damagedAreas: prev.damagedAreas.filter(item => item !== area) 
          };
        } else {
          return { 
            ...prev, 
            damagedAreas: [...prev.damagedAreas, area] 
          };
        }
      });
    };

    const handleSeverityChange = (e) => {
      setDamageAssessment(prev => ({
        ...prev,
        severityScale: e.target.value
      }));
    };

    const handlePhotoUpload = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        // In a real implementation, you would upload these files to a server
        // Here we'll just store them in the state
        setDamageAssessment(prev => ({
          ...prev,
          photos: [...prev.photos, ...files]
        }));
      }
    };

    const removePhoto = (index) => {
      setDamageAssessment(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    };

    const handleVoiceNote = () => {
      // In a real implementation, this would activate the device microphone
      alert('Voice note recording would be activated here.');
    };

    return (
      <div className="form-step">
        <h2><FaCar className="step-icon" /> Damage Assessment</h2>
        <div className="form-section">
          <div className="car-damage-selector">
            <h3>Select damaged areas of your vehicle</h3>
            <p className="helper-text">Click on the areas of the car that were damaged in the incident</p>
            
            <div className="car-diagram-container">
              <div className="car-diagram">
                <div className="car-outline">
                  {/* This would be replaced with an actual interactive car diagram */}
                  <div className="car-regions">
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('front') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('front')}
                      data-region="front"
                    >
                      Front
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('front-left') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('front-left')}
                      data-region="front-left"
                    >
                      Front Left
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('front-right') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('front-right')}
                      data-region="front-right"
                    >
                      Front Right
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('rear') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('rear')}
                      data-region="rear"
                    >
                      Rear
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('rear-left') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('rear-left')}
                      data-region="rear-left"
                    >
                      Rear Left
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('rear-right') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('rear-right')}
                      data-region="rear-right"
                    >
                      Rear Right
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('left-side') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('left-side')}
                      data-region="left-side"
                    >
                      Left Side
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('right-side') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('right-side')}
                      data-region="right-side"
                    >
                      Right Side
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('roof') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('roof')}
                      data-region="roof"
                    >
                      Roof
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('hood') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('hood')}
                      data-region="hood"
                    >
                      Hood
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('trunk') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('trunk')}
                      data-region="trunk"
                    >
                      Trunk
                    </div>
                    <div 
                      className={`car-region ${damageAssessment.damagedAreas.includes('windshield') ? 'selected' : ''}`}
                      onClick={() => handleDamagedAreaToggle('windshield')}
                      data-region="windshield"
                    >
                      Windshield
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="selected-regions">
                <h4>Selected areas:</h4>
                {damageAssessment.damagedAreas.length > 0 ? (
                  <ul className="selected-regions-list">
                    {damageAssessment.damagedAreas.map((area, index) => (
                      <li key={index}>{area.replace('-', ' ')}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-regions">No areas selected</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="severityScale">Damage Severity</label>
              <div className="severity-scale">
                <div className="severity-option">
                  <input 
                    type="radio" 
                    id="severity-minor" 
                    name="severityScale" 
                    value="minor"
                    checked={damageAssessment.severityScale === 'minor'}
                    onChange={handleSeverityChange}
                  />
                  <label htmlFor="severity-minor" className="severity-label">
                    <div className="severity-icon minor"></div>
                    <span>Minor</span>
                    <small>Scratches, small dents</small>
                  </label>
                </div>
                
                <div className="severity-option">
                  <input 
                    type="radio" 
                    id="severity-moderate" 
                    name="severityScale" 
                    value="moderate"
                    checked={damageAssessment.severityScale === 'moderate'}
                    onChange={handleSeverityChange}
                  />
                  <label htmlFor="severity-moderate" className="severity-label">
                    <div className="severity-icon moderate"></div>
                    <span>Moderate</span>
                    <small>Damaged panels, broken lights</small>
                  </label>
                </div>
                
                <div className="severity-option">
                  <input 
                    type="radio" 
                    id="severity-severe" 
                    name="severityScale" 
                    value="severe"
                    checked={damageAssessment.severityScale === 'severe'}
                    onChange={handleSeverityChange}
                  />
                  <label htmlFor="severity-severe" className="severity-label">
                    <div className="severity-icon severe"></div>
                    <span>Severe</span>
                    <small>Major structural damage</small>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Upload Photos/Videos of Damage</label>
              <div className="photo-upload-area">
                <div className="upload-instructions">
                  <FaCamera className="upload-icon" />
                  <h4>Upload up to 10 images or videos</h4>
                  <p>Show different angles of the damage</p>
                  <label htmlFor="damage-photos" className="upload-btn">
                    <FaCloudUploadAlt /> Choose Files
                  </label>
                  <input 
                    type="file" 
                    id="damage-photos" 
                    multiple 
                    accept="image/*,video/*" 
                    onChange={handlePhotoUpload}
                    className="file-input"
                  />
                </div>
                
                {damageAssessment.photos.length > 0 && (
                  <div className="uploaded-photos">
                    <h4>Uploaded Files ({damageAssessment.photos.length}/10)</h4>
                    <div className="photo-grid">
                      {damageAssessment.photos.map((photo, index) => (
                        <div key={index} className="photo-item">
                          <div className="photo-preview">
                            {/* In a real implementation, you would display the photo here */}
                            <div className="photo-name">{photo.name}</div>
                          </div>
                          <button 
                            type="button" 
                            className="remove-photo" 
                            onClick={() => removePhoto(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label>Voice Note Description</label>
              <button 
                type="button" 
                className="voice-note-btn"
                onClick={handleVoiceNote}
              >
                <FaMicrophone /> Record Voice Note (max 60 seconds)
              </button>
              {damageAssessment.voiceNote && (
                <div className="voice-note-preview">
                  <div className="voice-note-waveform">
                    {/* Voice note waveform visualization would go here */}
                  </div>
                  <div className="voice-note-controls">
                    <button type="button" className="voice-note-play">Play</button>
                    <button type="button" className="voice-note-delete">Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render step 4: Additional Information
  const renderAdditionalInfoStep = () => {
    const handleAdditionalInfoChange = (e) => {
      const { name, value } = e.target;
      setAdditionalInfo(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <div className="form-step">
        <h2><FaFileAlt className="step-icon" /> Additional Information</h2>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="injuries">Were there any injuries?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="injuries"
                  value="yes"
                  checked={additionalInfo.injuries === 'yes'}
                  onChange={handleAdditionalInfoChange}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="injuries"
                  value="no"
                  checked={additionalInfo.injuries === 'no'}
                  onChange={handleAdditionalInfoChange}
                />
                No
              </label>
            </div>
          </div>

          {additionalInfo.injuries === 'yes' && (
            <div className="form-group">
              <label htmlFor="injurySeverity">Injury severity</label>
              <select
                id="injurySeverity"
                name="injurySeverity"
                value={additionalInfo.injurySeverity}
                onChange={handleAdditionalInfoChange}
              >
                <option value="">Select severity</option>
                <option value="minor">Minor</option>
                <option value="medical">Requiring medical attention</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="thirdPartyInvolvement">Third-party involvement?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="thirdPartyInvolvement"
                  value="yes"
                  checked={additionalInfo.thirdPartyInvolvement === 'yes'}
                  onChange={handleAdditionalInfoChange}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="thirdPartyInvolvement"
                  value="no"
                  checked={additionalInfo.thirdPartyInvolvement === 'no'}
                  onChange={handleAdditionalInfoChange}
                />
                No
              </label>
            </div>
          </div>

          {additionalInfo.thirdPartyInvolvement === 'yes' && (
            <div className="form-group">
              <label htmlFor="thirdPartyDetails">Third-party details</label>
              <textarea
                id="thirdPartyDetails"
                name="thirdPartyDetails"
                value={additionalInfo.thirdPartyDetails}
                onChange={handleAdditionalInfoChange}
                placeholder="Vehicle registration, driver contact, insurance details, etc."
                rows="3"
              ></textarea>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="witnesses">Were there any witnesses?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="witnesses"
                  value="yes"
                  checked={additionalInfo.witnesses === 'yes'}
                  onChange={handleAdditionalInfoChange}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="witnesses"
                  value="no"
                  checked={additionalInfo.witnesses === 'no'}
                  onChange={handleAdditionalInfoChange}
                />
                No
              </label>
            </div>
          </div>

          {additionalInfo.witnesses === 'yes' && (
            <div className="form-group">
              <label htmlFor="witnessDetails">Witness information (optional)</label>
              <textarea
                id="witnessDetails"
                name="witnessDetails"
                value={additionalInfo.witnessDetails}
                onChange={handleAdditionalInfoChange}
                placeholder="Names, contact details, etc."
                rows="3"
              ></textarea>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="policeReportFiled">Police report filed?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="policeReportFiled"
                  value="yes"
                  checked={additionalInfo.policeReportFiled === 'yes'}
                  onChange={handleAdditionalInfoChange}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="policeReportFiled"
                  value="no"
                  checked={additionalInfo.policeReportFiled === 'no'}
                  onChange={handleAdditionalInfoChange}
                />
                No
              </label>
            </div>
          </div>

          {additionalInfo.policeReportFiled === 'yes' && (
            <div className="form-group">
              <label htmlFor="policeDetails">Police report details</label>
              <textarea
                id="policeDetails"
                name="policeDetails"
                value={additionalInfo.policeDetails}
                onChange={handleAdditionalInfoChange}
                placeholder="FIR number, police station, officer details, etc."
                rows="3"
              ></textarea>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render step 5: Service Options
  const renderServiceOptionsStep = () => {
    const handleServiceOptionsChange = (e) => {
      const { name, value } = e.target;
      setServiceOptions(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <div className="form-step">
        <h2><FaWrench className="step-icon" /> Preferred Service Options</h2>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="preferredGarage">Preferred garage</label>
            <div className="garage-selector">
              <div className="garage-map-container">
                <div className="map-placeholder advanced">
                  <p>Map showing network garages nearby</p>
                  <small>Click on a garage marker to select it</small>
                </div>
              </div>
              <select
                id="preferredGarage"
                name="preferredGarage"
                value={serviceOptions.preferredGarage}
                onChange={handleServiceOptionsChange}
              >
                <option value="">Select a garage</option>
                <option value="network1">Network Garage - City Center (2.5 km)</option>
                <option value="network2">Network Garage - West Avenue (4.1 km)</option>
                <option value="network3">Authorized Service Center (5.8 km)</option>
                <option value="other">Other (Specify in notes)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="preferredContactMethod">Preferred contact method for updates</label>
            <div className="contact-method-options">
              <label className="contact-method-option">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="email"
                  checked={serviceOptions.preferredContactMethod === 'email'}
                  onChange={handleServiceOptionsChange}
                />
                <div className="contact-method-content">
                  <span>Email</span>
                </div>
              </label>
              <label className="contact-method-option">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="sms"
                  checked={serviceOptions.preferredContactMethod === 'sms'}
                  onChange={handleServiceOptionsChange}
                />
                <div className="contact-method-content">
                  <span>SMS</span>
                </div>
              </label>
              <label className="contact-method-option">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="whatsapp"
                  checked={serviceOptions.preferredContactMethod === 'whatsapp'}
                  onChange={handleServiceOptionsChange}
                />
                <div className="contact-method-content">
                  <span>WhatsApp</span>
                </div>
              </label>
              <label className="contact-method-option">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="call"
                  checked={serviceOptions.preferredContactMethod === 'call'}
                  onChange={handleServiceOptionsChange}
                />
                <div className="contact-method-content">
                  <span>Phone Call</span>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="towingNeeded">Do you require towing service?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="towingNeeded"
                  value="yes"
                  checked={serviceOptions.towingNeeded === 'yes'}
                  onChange={handleServiceOptionsChange}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="towingNeeded"
                  value="no"
                  checked={serviceOptions.towingNeeded === 'no'}
                  onChange={handleServiceOptionsChange}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rentalCarRequired">Do you need a rental car?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="rentalCarRequired"
                  value="yes"
                  checked={serviceOptions.rentalCarRequired === 'yes'}
                  onChange={handleServiceOptionsChange}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="rentalCarRequired"
                  value="no"
                  checked={serviceOptions.rentalCarRequired === 'no'}
                  onChange={handleServiceOptionsChange}
                />
                No
              </label>
            </div>
            {serviceOptions.rentalCarRequired === 'yes' && (
              <div className="info-message">
                <FaExclamationCircle /> Your policy coverage for rental car will be verified
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render step 6: Review & Submit
  const renderReviewStep = () => {
    return (
      <div className="form-step">
        <h2><FaCheck className="step-icon" /> Review & Submit</h2>
        <div className="form-section">
          <div className="review-summary">
            <h3>Summary of your claim</h3>
            
            <div className="review-section">
              <h4>Basic Information</h4>
              <div className="review-details">
                <div className="review-item">
                  <span className="review-label">Policy Number:</span>
                  <span className="review-value">{basicInfo.policyNumber}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Vehicle Number:</span>
                  <span className="review-value">{basicInfo.vehicleNumber}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Date & Time:</span>
                  <span className="review-value">{basicInfo.incidentDate} {basicInfo.incidentTime}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Location:</span>
                  <span className="review-value">{basicInfo.incidentLocation}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Claim Type:</span>
                  <span className="review-value">{basicInfo.claimType}</span>
                </div>
              </div>
            </div>
            
            <div className="review-section">
              <h4>Incident Details</h4>
              <div className="review-details">
                <div className="review-item review-text">
                  <span className="review-label">Description:</span>
                  <span className="review-value">{incidentDetails.description}</span>
                </div>
                {/* Additional incident details would be rendered conditionally based on claim type */}
              </div>
            </div>
            
            <div className="review-section">
              <h4>Damage Assessment</h4>
              <div className="review-details">
                <div className="review-item">
                  <span className="review-label">Damaged Areas:</span>
                  <span className="review-value">
                    {damageAssessment.damagedAreas.length > 0 
                      ? damageAssessment.damagedAreas.map(area => area.replace('-', ' ')).join(', ')
                      : 'None specified'}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Severity:</span>
                  <span className="review-value">{damageAssessment.severityScale || 'Not specified'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Photos/Videos:</span>
                  <span className="review-value">{damageAssessment.photos.length} uploaded</span>
                </div>
              </div>
            </div>
            
            <div className="review-section">
              <h4>Additional Information</h4>
              <div className="review-details">
                <div className="review-item">
                  <span className="review-label">Injuries:</span>
                  <span className="review-value">
                    {additionalInfo.injuries === 'yes' 
                      ? `Yes, ${additionalInfo.injurySeverity}` 
                      : 'No'}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Third-party Involved:</span>
                  <span className="review-value">{additionalInfo.thirdPartyInvolvement}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Witnesses:</span>
                  <span className="review-value">{additionalInfo.witnesses}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Police Report:</span>
                  <span className="review-value">{additionalInfo.policeReportFiled}</span>
                </div>
              </div>
            </div>
            
            <div className="review-section">
              <h4>Service Options</h4>
              <div className="review-details">
                <div className="review-item">
                  <span className="review-label">Preferred Garage:</span>
                  <span className="review-value">{serviceOptions.preferredGarage || 'Not specified'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Contact Method:</span>
                  <span className="review-value">{serviceOptions.preferredContactMethod}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Towing Required:</span>
                  <span className="review-value">{serviceOptions.towingNeeded}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Rental Car:</span>
                  <span className="review-value">{serviceOptions.rentalCarRequired}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-group terms-declaration">
            <label className="checkbox-label">
              <input type="checkbox" name="termsAgreed" />
              <span>I declare that all information provided is true and accurate to the best of my knowledge. I understand that providing false information may result in denial of the claim.</span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="car-claim-form-container">
      <div className="claim-form-header">
        <h1><FaCar /> Filing a New Car Insurance Claim</h1>
        <div className="form-actions-top">
          <button 
            className="save-draft-btn"
            onClick={handleSaveDraft}
          >
            <FaSave /> Save Draft
          </button>
        </div>
      </div>

      {renderProgressIndicator()}

      <div className="claim-form-content">
        <form>
          {currentStep === 1 && renderBasicInfoStep()}
          {currentStep === 2 && renderIncidentDetailsStep()}
          {currentStep === 3 && renderDamageAssessmentStep()}
          {currentStep === 4 && renderAdditionalInfoStep()}
          {currentStep === 5 && renderServiceOptionsStep()}
          {currentStep === 6 && renderReviewStep()}
        </form>
      </div>

      <div className="form-navigation">
        {currentStep > 1 && (
          <button 
            className="prev-btn"
            onClick={handlePrevStep}
          >
            Previous
          </button>
        )}
        
        <button 
          className="next-btn"
          onClick={handleNextStep}
        >
          {currentStep === totalSteps ? 'Submit Claim' : 'Next'} <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CarClaimForm; 
 