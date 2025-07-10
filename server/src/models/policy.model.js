const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  // Policy details
  policyNumber: { type: String, required: true, unique: true },
  policyType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  
  // Vehicle details
  vehicleDetails: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    registrationNumber: { type: String, required: true },
    engineNumber: { type: String, required: false },
    chassisNumber: { type: String, required: false }
  },
  
  // Coverage details
  coverage: {
    thirdPartyLiability: { type: Boolean, default: true },
    ownDamage: { type: Boolean, default: true },
    personalAccidentCover: { type: Boolean, default: false },
    zeroDepreciation: { type: Boolean, default: false },
    engineProtection: { type: Boolean, default: false },
    roadSideAssistance: { type: Boolean, default: false },
    consumablesCover: { type: Boolean, default: false },
    returnToInvoice: { type: Boolean, default: false },
    ncbProtection: { type: Boolean, default: false },
    passengerCover: { type: Boolean, default: false }
  },
  
  // Premium details
  premium: {
    basePremium: { type: Number, required: true },
    ownDamagePremium: { type: Number, required: false },
    thirdPartyPremium: { type: Number, required: false },
    addOnsPremium: { type: Number, required: false },
    ncbDiscount: { type: Number, required: false },
    gst: { type: Number, required: true },
    totalPremium: { type: Number, required: true }
  },
  
  // Claims
  claims: [{
    claimId: { type: String, required: false },
    claimDate: { type: Date, required: false },
    claimAmount: { type: Number, required: false },
    claimStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'settled'], required: false },
    claimDescription: { type: String, required: false }
  }],
  
  // User reference (optional for non-authenticated users)
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: false 
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  versionKey: false,
  timestamps: true
});

// Generate a unique policy number before saving
policySchema.pre("save", function(next) {
  if (this.policyNumber) return next();
  
  // Generate a random policy number with prefix ACKO-
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  this.policyNumber = `ACKO-${randomNum}`;
  next();
});

const Policy = mongoose.model("policy", policySchema);

module.exports = Policy; 