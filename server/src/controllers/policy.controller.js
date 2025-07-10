const express = require('express');
const Policy = require('../models/policy.model');
const User = require('../models/user.model');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();

// Optional authentication - allows both authenticated and non-authenticated access
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Get all policies for a user (or all policies if not authenticated)
router.get('/', optionalAuth, async (req, res) => {
  try {
    let policies;
    if (req.user) {
      // If authenticated, get user's policies
      policies = await Policy.find({ userId: req.user.id });
    } else {
      // If not authenticated, return empty array or mock data for demo
      policies = [];
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Policies retrieved successfully',
      data: policies
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get a specific policy
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    let policy;
    if (req.user) {
      // If authenticated, check ownership
      policy = await Policy.findOne({ 
        _id: req.params.id,
        userId: req.user.id
      });
    } else {
      // If not authenticated, just find by ID (for demo purposes)
      policy = await Policy.findById(req.params.id);
    }
    
    if (!policy) {
      return res.status(404).json({
        status: 'error',
        message: 'Policy not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Policy retrieved successfully',
      data: policy
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create a new policy
router.post('/', optionalAuth, async (req, res) => {
  try {
    // Prepare policy data
    const policyData = {
      ...req.body,
      userId: req.user ? req.user.id : null // Allow null userId for non-authenticated users
    };
    
    // Create policy
    const policy = await Policy.create(policyData);
    
    // Add policy to user's policies array if user is authenticated
    if (req.user) {
      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { policies: policy._id } }
      );
    }
    
    return res.status(201).json({
      status: 'success',
      message: 'Policy created successfully',
      data: policy
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update a policy
router.patch('/:id', optionalAuth, async (req, res) => {
  try {
    let existingPolicy;
    if (req.user) {
      // Check if policy exists and belongs to user
      existingPolicy = await Policy.findOne({
        _id: req.params.id,
        userId: req.user.id
      });
    } else {
      // If not authenticated, just check if policy exists
      existingPolicy = await Policy.findById(req.params.id);
    }
    
    if (!existingPolicy) {
      return res.status(404).json({
        status: 'error',
        message: 'Policy not found'
      });
    }
    
    // Update policy
    const policy = await Policy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    return res.status(200).json({
      status: 'success',
      message: 'Policy updated successfully',
      data: policy
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Add a claim to a policy
router.post('/:id/claims', optionalAuth, async (req, res) => {
  try {
    let existingPolicy;
    if (req.user) {
      // Check if policy exists and belongs to user
      existingPolicy = await Policy.findOne({
        _id: req.params.id,
        userId: req.user.id
      });
    } else {
      // If not authenticated, just check if policy exists
      existingPolicy = await Policy.findById(req.params.id);
    }
    
    if (!existingPolicy) {
      return res.status(404).json({
        status: 'error',
        message: 'Policy not found'
      });
    }
    
    // Generate claim ID
    const claimId = `CLAIM-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Add claim to policy
    const policy = await Policy.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          claims: {
            ...req.body,
            claimId,
            claimDate: new Date(),
            claimStatus: 'pending'
          } 
        } 
      },
      { new: true }
    );
    
    return res.status(201).json({
      status: 'success',
      message: 'Claim added successfully',
      data: policy
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router; 