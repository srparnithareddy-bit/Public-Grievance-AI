/**
 * Unified Storage Service
 * 
 * Works seamlessly with Mongoose when MongoDB is connected,
 * and seamlessly with in-memory store when MongoDB is offline.
 * This guarantees the project runs instantly out of the box with zero setup hurdles.
 */

const { isMongoConnected } = require('../config/db');
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const { initialUsers, initialGrievances } = require('./seedData');

// In-Memory collections (cloned on startup)
let memoryUsers = JSON.parse(JSON.stringify(initialUsers));
let memoryGrievances = JSON.parse(JSON.stringify(initialGrievances));

/**
 * Seed MongoDB on startup if connected and empty
 */
const seedMongoIfEmpty = async () => {
  if (!isMongoConnected) return;

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 [Seeding] Populating MongoDB with initial users...');
      await User.insertMany(initialUsers);
    }

    const grievanceCount = await Grievance.countDocuments();
    if (grievanceCount === 0) {
      console.log('🌱 [Seeding] Populating MongoDB with initial grievances...');
      await Grievance.insertMany(initialGrievances);
    }
  } catch (err) {
    console.warn('⚠️  Could not seed MongoDB:', err.message);
  }
};

// ----------------- USER HELPERS -----------------

const findUserByEmail = async (email) => {
  const normalized = (email || '').toLowerCase().trim();
  if (isMongoConnected) {
    return await User.findOne({ email: normalized }).select('+password');
  }
  return memoryUsers.find(u => u.email.toLowerCase() === normalized) || null;
};

const findUserById = async (id) => {
  if (isMongoConnected) {
    return await User.findById(id).select('-password');
  }
  const user = memoryUsers.find(u => u._id === id || String(u._id) === String(id));
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const createUser = async (userData) => {
  if (isMongoConnected) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  // Memory fallback
  const newUser = {
    _id: `usr_${Date.now()}`,
    ...userData,
    createdAt: new Date(),
  };
  memoryUsers.push(newUser);
  return newUser;
};

// ----------------- GRIEVANCE HELPERS -----------------

const generateTrackingId = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `GRV-${year}-${randomSuffix}`;
};

const findGrievances = async (filter = {}) => {
  if (isMongoConnected) {
    const query = {};
    if (filter.status && filter.status !== 'All') query.status = filter.status;
    if (filter.category && filter.category !== 'All') query.category = filter.category;
    if (filter.urgency && filter.urgency !== 'All') query.urgency = filter.urgency;
    if (filter['citizen.userId']) query['citizen.userId'] = filter['citizen.userId'];
    if (filter['citizen.email']) query['citizen.email'] = filter['citizen.email'];

    return await Grievance.find(query).sort({ createdAt: -1 });
  }

  // Memory fallback filtering
  let results = [...memoryGrievances];

  if (filter.status && filter.status !== 'All') {
    results = results.filter(g => g.status === filter.status);
  }
  if (filter.category && filter.category !== 'All') {
    results = results.filter(g => g.category === filter.category);
  }
  if (filter.urgency && filter.urgency !== 'All') {
    results = results.filter(g => g.urgency === filter.urgency);
  }
  if (filter['citizen.userId']) {
    results = results.filter(g => String(g.citizen?.userId) === String(filter['citizen.userId']));
  }
  if (filter['citizen.email']) {
    results = results.filter(g => (g.citizen?.email || '').toLowerCase() === filter['citizen.email'].toLowerCase());
  }

  // Sort descending by createdAt
  return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const findGrievanceById = async (id) => {
  if (isMongoConnected) {
    return await Grievance.findById(id);
  }
  return memoryGrievances.find(g => g._id === id || String(g._id) === String(id)) || null;
};

const findGrievanceByTrackingId = async (trackingId) => {
  const cleanId = (trackingId || '').trim().toUpperCase();
  if (isMongoConnected) {
    return await Grievance.findOne({ trackingId: cleanId });
  }
  return memoryGrievances.find(g => (g.trackingId || '').toUpperCase() === cleanId) || null;
};

const createGrievance = async (data) => {
  const trackingId = data.trackingId || generateTrackingId();
  const grievancePayload = {
    ...data,
    trackingId,
    status: data.status || 'Pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    statusHistory: [
      {
        status: data.status || 'Pending',
        updatedBy: data.citizen?.name || 'Citizen User',
        comment: 'Grievance ticket created and assigned Tracking ID.',
        timestamp: new Date(),
      },
    ],
  };

  if (isMongoConnected) {
    const grievance = new Grievance(grievancePayload);
    await grievance.save();
    return grievance;
  }

  // Memory fallback
  const newGrievance = {
    _id: `grv_${Date.now()}`,
    ...grievancePayload,
  };
  memoryGrievances.unshift(newGrievance);
  return newGrievance;
};

const updateGrievanceStatus = async (id, { status, officialRemarks, updatedBy, departmentAction }) => {
  const now = new Date();

  if (isMongoConnected) {
    const update = {
      $set: {
        status,
        updatedAt: now,
        'officialResponse.remarks': officialRemarks || '',
        'officialResponse.respondedBy': updatedBy || 'Official Authority',
        'officialResponse.respondedAt': now,
        'officialResponse.departmentAction': departmentAction || 'Status updated by department',
      },
      $push: {
        statusHistory: {
          status,
          updatedBy: updatedBy || 'Official Authority',
          comment: officialRemarks || `Status updated to ${status}`,
          timestamp: now,
        },
      },
    };

    return await Grievance.findByIdAndUpdate(id, update, { new: true });
  }

  // Memory fallback
  const index = memoryGrievances.findIndex(g => g._id === id || String(g._id) === String(id));
  if (index === -1) return null;

  const target = memoryGrievances[index];
  target.status = status;
  target.updatedAt = now;
  target.officialResponse = {
    remarks: officialRemarks || target.officialResponse?.remarks || '',
    respondedBy: updatedBy || 'Official Authority',
    respondedAt: now,
    departmentAction: departmentAction || target.officialResponse?.departmentAction || '',
  };
  target.statusHistory = target.statusHistory || [];
  target.statusHistory.push({
    status,
    updatedBy: updatedBy || 'Official Authority',
    comment: officialRemarks || `Status updated to ${status}`,
    timestamp: now,
  });

  return target;
};

const getStats = async () => {
  const all = await findGrievances({});
  const total = all.length;
  const pending = all.filter(g => g.status === 'Pending').length;
  const inProgress = all.filter(g => g.status === 'In Progress').length;
  const resolved = all.filter(g => g.status === 'Resolved').length;
  const critical = all.filter(g => g.urgency === 'Critical').length;

  const departmentCounts = {
    Sanitation: all.filter(g => g.category === 'Sanitation').length,
    Water: all.filter(g => g.category === 'Water').length,
    Roads: all.filter(g => g.category === 'Roads').length,
    Electricity: all.filter(g => g.category === 'Electricity').length,
    'Public Safety': all.filter(g => g.category === 'Public Safety').length,
    General: all.filter(g => g.category === 'General').length,
  };

  return {
    total,
    pending,
    inProgress,
    resolved,
    critical,
    departmentCounts,
  };
};

module.exports = {
  seedMongoIfEmpty,
  findUserByEmail,
  findUserById,
  createUser,
  findGrievances,
  findGrievanceById,
  findGrievanceByTrackingId,
  createGrievance,
  updateGrievanceStatus,
  getStats,
  generateTrackingId,
};
