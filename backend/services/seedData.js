/**
 * Seed Data and In-Memory Fallback Storage
 * Provides realistic hackathon demo records for Citizens, Admin Officials, and Grievances.
 */

const bcrypt = require('bcryptjs');

// Pre-hashed password for demo accounts ('citizen123' and 'admin123')
const citizenHash = bcrypt.hashSync('citizen123', 10);
const adminHash = bcrypt.hashSync('admin123', 10);

const initialUsers = [
  {
    _id: 'usr_citizen_01',
    name: 'Aarav Sharma',
    email: 'citizen@demo.com',
    password: citizenHash,
    role: 'citizen',
    department: 'General',
    phone: '+91 98765 43210',
    createdAt: new Date('2026-10-01T10:00:00Z'),
  },
  {
    _id: 'usr_admin_01',
    name: 'Dr. Priya Varma',
    email: 'admin@gov.in',
    password: adminHash,
    role: 'admin',
    department: 'General',
    phone: '+91 98765 00001',
    createdAt: new Date('2026-09-15T09:00:00Z'),
  },
  {
    _id: 'usr_water_02',
    name: 'Rajesh Kumar (Jal Board)',
    email: 'water.officer@gov.in',
    password: adminHash,
    role: 'official',
    department: 'Water',
    phone: '+91 98765 00002',
    createdAt: new Date('2026-09-20T09:00:00Z'),
  },
];

const initialGrievances = [
  {
    _id: 'grv_001',
    trackingId: 'GRV-2026-1001',
    title: 'Severe Main Pipeline Burst Flooding 4th Cross Road',
    description: 'A major underground drinking water supply pipe has fractured near the community hall. Thousands of liters of potable water are gushing out onto the road, creating waterlogging up to 2 feet and disrupting vehicular movement.',
    category: 'Water',
    urgency: 'Critical',
    status: 'In Progress',
    location: {
      address: '4th Cross Road, Near Community Hall, Ward 12',
      landmark: 'Opposite Shiva Temple',
      wardOrPincode: '560034',
    },
    citizen: {
      userId: 'usr_citizen_01',
      name: 'Aarav Sharma',
      email: 'citizen@demo.com',
      phone: '+91 98765 43210',
    },
    aiTriage: {
      summary: 'Critical underground water pipe burst causing significant potable water wastage and road inundation.',
      actionableRecommendations: [
        'Immediately shut down feeder valve at Substation 4B.',
        'Dispatch Jal Board emergency repair crew with suction pumps.',
        'Alert traffic police to divert vehicles away from 4th Cross Road.',
      ],
      confidenceScore: 0.98,
      detectedKeywords: ['pipe burst', 'flooding', 'potable water', 'drinking water', 'waterlogging'],
    },
    officialResponse: {
      remarks: 'Emergency maintenance crew dispatched. Valve 4B closed to stop outflow. Excavation underway.',
      respondedBy: 'Rajesh Kumar (Jal Board)',
      respondedAt: new Date('2026-10-29T11:30:00Z'),
      departmentAction: 'Valve Isolation and Pipe Replacement',
    },
    statusHistory: [
      {
        status: 'Pending',
        updatedBy: 'System AI Engine',
        comment: 'Grievance submitted by citizen and classified as Critical Urgency.',
        timestamp: new Date('2026-10-29T08:15:00Z'),
      },
      {
        status: 'In Progress',
        updatedBy: 'Dr. Priya Varma (Admin)',
        comment: 'Escalated to Jal Board Emergency Response Unit.',
        timestamp: new Date('2026-10-29T09:00:00Z'),
      },
    ],
    createdAt: new Date('2026-10-29T08:15:00Z'),
    updatedAt: new Date('2026-10-29T11:30:00Z'),
  },
  {
    _id: 'grv_002',
    trackingId: 'GRV-2026-1002',
    title: 'Exposed High Voltage Cable Dangling Near Market Transformer',
    description: 'During yesterday evening rainstorm, a high-tension power cable snapped and is hanging less than 5 feet above the pedestrian walkway near the Sector 7 vegetable market. Sparks were observed earlier.',
    category: 'Electricity',
    urgency: 'Critical',
    status: 'Pending',
    location: {
      address: 'Sector 7 Market, Near Bank ATM kiosk',
      landmark: 'Next to Mother Dairy Booth',
      wardOrPincode: '560085',
    },
    citizen: {
      userId: 'usr_citizen_01',
      name: 'Aarav Sharma',
      email: 'citizen@demo.com',
      phone: '+91 98765 43210',
    },
    aiTriage: {
      summary: 'High-voltage electrocution hazard in crowded commercial market zone requiring urgent power cutoff.',
      actionableRecommendations: [
        'De-energize Sector 7 Feeder line immediately.',
        'Cordone off 50m perimeter around the transformer.',
        'Deploy electricity board lineman for cable re-tensioning and insulation testing.',
      ],
      confidenceScore: 0.99,
      detectedKeywords: ['sparking', 'high voltage', 'cable snapped', 'danger', 'transformer'],
    },
    officialResponse: {
      remarks: '',
      respondedBy: '',
      respondedAt: null,
      departmentAction: '',
    },
    statusHistory: [
      {
        status: 'Pending',
        updatedBy: 'System AI Engine',
        comment: 'High risk detected. Priority queue placement.',
        timestamp: new Date('2026-10-30T07:20:00Z'),
      },
    ],
    createdAt: new Date('2026-10-30T07:20:00Z'),
    updatedAt: new Date('2026-10-30T07:20:00Z'),
  },
  {
    _id: 'grv_003',
    trackingId: 'GRV-2026-1003',
    title: 'Cluster of Deep Potholes on Main Ring Road Flyover Descent',
    description: 'A cluster of deep potholes has developed at the descent of the main ring road flyover. Two two-wheeler skids were witnessed this morning. It poses a severe risk during peak traffic hours.',
    category: 'Roads',
    urgency: 'High',
    status: 'Resolved',
    location: {
      address: 'Main Ring Road, Northern Flyover Descent',
      landmark: '500m before Metro Station Pillar 140',
      wardOrPincode: '560012',
    },
    citizen: {
      userId: 'usr_citizen_01',
      name: 'Aarav Sharma',
      email: 'citizen@demo.com',
      phone: '+91 98765 43210',
    },
    aiTriage: {
      summary: 'Road surface hazard on high-speed flyover descent with direct accident risk to motorists.',
      actionableRecommendations: [
        'Erect warning reflective cones upstream of the potholes.',
        'Apply rapid cold-mix asphalt patching.',
        'Conduct structural review of flyover expansion joints.',
      ],
      confidenceScore: 0.95,
      detectedKeywords: ['potholes', 'flyover', 'accident risk', 'two-wheeler skid'],
    },
    officialResponse: {
      remarks: 'Hot-mix bituminous asphalt patching completed by PWD on October 28th night. Inspection verified smooth surface.',
      respondedBy: 'Suresh Patil (PWD Roads)',
      respondedAt: new Date('2026-10-28T22:00:00Z'),
      departmentAction: 'Bituminous Road Patching',
    },
    statusHistory: [
      {
        status: 'Pending',
        updatedBy: 'System AI Engine',
        comment: 'Submitted by citizen.',
        timestamp: new Date('2026-10-27T10:00:00Z'),
      },
      {
        status: 'In Progress',
        updatedBy: 'Dr. Priya Varma (Admin)',
        comment: 'Assigned to PWD North Division.',
        timestamp: new Date('2026-10-27T14:00:00Z'),
      },
      {
        status: 'Resolved',
        updatedBy: 'Suresh Patil (PWD Roads)',
        comment: 'Road patched and certified safe.',
        timestamp: new Date('2026-10-28T22:00:00Z'),
      },
    ],
    createdAt: new Date('2026-10-27T10:00:00Z'),
    updatedAt: new Date('2026-10-28T22:00:00Z'),
  },
  {
    _id: 'grv_004',
    trackingId: 'GRV-2026-1004',
    title: 'Overflowing Municipal Garbage Dumpster Adjacent to Primary School',
    description: 'The community garbage dumpster near the municipal primary school gate has not been cleared for 4 days. Waste is spilling across the sidewalk, generating foul odor and stray dog menace.',
    category: 'Sanitation',
    urgency: 'High',
    status: 'In Progress',
    location: {
      address: 'Opposite Modern Public Primary School, Gandhi Nagar',
      landmark: 'Near Gandhi Nagar Post Office',
      wardOrPincode: '560041',
    },
    citizen: {
      userId: 'usr_citizen_01',
      name: 'Aarav Sharma',
      email: 'citizen@demo.com',
      phone: '+91 98765 43210',
    },
    aiTriage: {
      summary: 'Unsanitary waste accumulation near educational institution posing health risks to children.',
      actionableRecommendations: [
        'Deploy municipal compactor truck for urgent disposal.',
        'Sanitize dumpster area with lime powder disinfectant.',
        'Schedule daily 7 AM clearance cycle to avoid school hours.',
      ],
      confidenceScore: 0.94,
      detectedKeywords: ['garbage', 'dumpster', 'school', 'sanitation', 'odor'],
    },
    officialResponse: {
      remarks: 'Sanitation supervisor instructed. Waste clearing vehicle routed for afternoon clearance.',
      respondedBy: 'Dr. Priya Varma (Admin)',
      respondedAt: new Date('2026-10-30T10:00:00Z'),
      departmentAction: 'Garbage Clearance & Disinfection',
    },
    statusHistory: [
      {
        status: 'Pending',
        updatedBy: 'System AI Engine',
        comment: 'Complaint recorded.',
        timestamp: new Date('2026-10-30T08:00:00Z'),
      },
      {
        status: 'In Progress',
        updatedBy: 'Dr. Priya Varma (Admin)',
        comment: 'Truck assigned.',
        timestamp: new Date('2026-10-30T10:00:00Z'),
      },
    ],
    createdAt: new Date('2026-10-30T08:00:00Z'),
    updatedAt: new Date('2026-10-30T10:00:00Z'),
  },
  {
    _id: 'grv_005',
    trackingId: 'GRV-2026-1005',
    title: 'Non-Functional Streetlights on Dark Stretch of 2nd Main Road',
    description: 'Four consecutive LED street poles on 2nd Main Road have been unlit for nearly two weeks. The dark street has become unsafe for evening walkers and commuters returning from work.',
    category: 'Public Safety',
    urgency: 'Medium',
    status: 'Pending',
    location: {
      address: '2nd Main Road, Green Park Layout',
      landmark: 'Poles #18 through #21',
      wardOrPincode: '560078',
    },
    citizen: {
      userId: 'usr_citizen_01',
      name: 'Aarav Sharma',
      email: 'citizen@demo.com',
      phone: '+91 98765 43210',
    },
    aiTriage: {
      summary: 'Public safety hazard caused by multi-pole streetlight failure along pedestrian route.',
      actionableRecommendations: [
        'Inspect street lighting circuit breaker box on Pole #18.',
        'Replace burned LED fixtures or faulty photocell sensors.',
        'Increase police patrolling until lighting is restored.',
      ],
      confidenceScore: 0.91,
      detectedKeywords: ['streetlight', 'dark', 'unsafe', 'night', 'street light failure'],
    },
    officialResponse: {
      remarks: '',
      respondedBy: '',
      respondedAt: null,
      departmentAction: '',
    },
    statusHistory: [
      {
        status: 'Pending',
        updatedBy: 'System AI Engine',
        comment: 'Ticket generated.',
        timestamp: new Date('2026-10-29T19:00:00Z'),
      },
    ],
    createdAt: new Date('2026-10-29T19:00:00Z'),
    updatedAt: new Date('2026-10-29T19:00:00Z'),
  },
];

module.exports = {
  initialUsers,
  initialGrievances,
};
