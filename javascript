// models/QueueLog.js
const mongoose = require('mongoose');

// Define allowed departments to prevent dirty data entry
const DEPARTMENTS = [
  'SASSA', 
  'HOME_AFFAIRS', 
  'SARS', 
  'HOUSING_DEPARTMENT', 
  'LABOUR'
  'CCMA',
  'MUNICIPAL_SERVICES',
  'TRANSIT_HUB'
];

const QueueLogSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    enum: DEPARTMENTS,
    index: true
  },
  branchName: {
    type: String,
    required: true, // e.g., "Barrack Street", "Civic Centre 2nd Floor"
    trim: true
  },
  lineLengthMeters: {
    type: Number,
    required: true,
    min: 0 // Cannot have negative line length
  },
  estimatedWaitMinutes: {
    type: Number,
    required: true,
    min: 0
  },
  congestionLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  reportedBy: {
    type: String, 
    required: true // Identifier/ID of the Public Safety Guard reporting
  },
  isSpillingToPavement: {
    type: Boolean,
    default: false // Crucial for CCID pavement management flags
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Indexed for rapid time-series dashboard queries
  }
});

// Middleware to auto-calculate congestion level based on line length
QueueLogSchema.pre('save', function(next) {
  if (this.lineLengthMeters >= 50) {
    this.congestionLevel = 'CRITICAL';
  } else if (this.lineLengthMeters >= 30) {
    this.congestionLevel = 'HIGH';
  } else if (this.lineLengthMeters >= 15) {
    this.congestionLevel = 'MEDIUM';
  } else {
    this.congestionLevel = 'LOW';
  }
  next();
});

module.exports = mongoose.model('QueueLog', QueueLogSchema);
