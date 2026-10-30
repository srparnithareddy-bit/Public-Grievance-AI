const path = require('path');
const { triageComplaint } = require('./services/aiService');
const { findGrievances, getStats, findUserByEmail, createGrievance } = require('./services/store');
const bcrypt = require('bcryptjs');

async function runTests() {
  console.log('--- 1. Testing AI Complaint Triage Engine ---');
  const triage = await triageComplaint('Live exposed wire dangling from transformer outside public park. Sparks flying everywhere!');
  console.log('AI Title:', triage.title);
  console.log('AI Category:', triage.category);
  console.log('AI Urgency:', triage.urgency);
  console.log('AI Recommendations:', triage.actionableRecommendations);
  console.log('Confidence Score:', triage.confidenceScore);

  console.log('\n--- 2. Testing In-Memory / Database Store ---');
  const stats = await getStats();
  console.log('Initial Stats:', stats);

  const citizen = await findUserByEmail('citizen@demo.com');
  console.log('Found Demo Citizen:', citizen.name, citizen.email, citizen.role);
  const isValidPass = await bcrypt.compare('citizen123', citizen.password);
  console.log('Citizen Password Verification:', isValidPass ? 'SUCCESS' : 'FAILED');

  const admin = await findUserByEmail('admin@gov.in');
  console.log('Found Demo Admin:', admin.name, admin.email, admin.role);
  const isValidAdminPass = await bcrypt.compare('admin123', admin.password);
  console.log('Admin Password Verification:', isValidAdminPass ? 'SUCCESS' : 'FAILED');

  console.log('\n--- 3. Testing Grievance Creation with Tracking ID ---');
  const created = await createGrievance({
    title: triage.title,
    description: 'Live exposed wire test complaint',
    category: triage.category,
    urgency: triage.urgency,
    location: {
      address: 'Near Central Park Gate 2',
      landmark: 'Opposite Coffee Day',
      wardOrPincode: '560001',
    },
    citizen: {
      name: citizen.name,
      email: citizen.email,
      phone: citizen.phone,
    },
    aiTriage: triage,
  });
  console.log('Created Grievance Tracking ID:', created.trackingId);
  console.log('Status History Length:', created.statusHistory.length);

  const updatedStats = await getStats();
  console.log('Updated Stats Total:', updatedStats.total);
  console.log('\n✅ ALL BACKEND TESTS COMPLETED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
