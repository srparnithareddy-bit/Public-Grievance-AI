/**
 * Grievance Model
 * Stores citizen complaints, AI classification, location, and resolution history
 */

const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const grievanceSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the grievance'],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed complaint description'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Sanitation', 'Water', 'Roads', 'Electricity', 'Public Safety', 'General'],
      default: 'General',
      index: true,
    },
    urgency: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    location: {
      address: {
        type: String,
        default: 'Not specified',
      },
      landmark: {
        type: String,
        default: '',
      },
      wardOrPincode: {
        type: String,
        default: '',
      },
    },
    citizen: {
      userId: {
        type: mongoose.Schema.Types.Mixed, // Can be ObjectId or String identifier
        default: null,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        default: '',
      },
    },
    aiTriage: {
      summary: {
        type: String,
        default: '',
      },
      actionableRecommendations: {
        type: [String],
        default: [],
      },
      confidenceScore: {
        type: Number,
        default: 0.9,
      },
      detectedKeywords: {
        type: [String],
        default: [],
      },
    },
    officialResponse: {
      remarks: {
        type: String,
        default: '',
      },
      respondedBy: {
        type: String,
        default: '',
      },
      respondedAt: {
        type: Date,
        default: null,
      },
      departmentAction: {
        type: String,
        default: '',
      },
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Helper function to generate tracking ID (e.g. GRV-2026-7842)
grievanceSchema.statics.generateTrackingId = function () {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `GRV-${year}-${randomSuffix}`;
};

module.exports = mongoose.model('Grievance', grievanceSchema);
