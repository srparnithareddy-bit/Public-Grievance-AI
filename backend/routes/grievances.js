/**
 * Grievance Routes
 * Handles grievance submission, tracking, admin queue management, and status updates
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  findGrievances,
  findGrievanceById,
  findGrievanceByTrackingId,
  createGrievance,
  updateGrievanceStatus,
  getStats,
  generateTrackingId,
} = require('../services/store');

/**
 * @route   GET /api/grievances/stats
 * @desc    Get summary counts and department distribution
 * @access  Public / Admin
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await getStats();
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve grievance statistics.',
    });
  }
});

/**
 * @route   GET /api/grievances/track/:trackingId
 * @desc    Public real-time grievance tracking by Tracking ID (e.g. GRV-2026-1001)
 * @access  Public
 */
router.get('/track/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    if (!trackingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Tracking ID.',
      });
    }

    const grievance = await findGrievanceByTrackingId(trackingId);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `No grievance found with Tracking ID "${trackingId.toUpperCase()}". Please verify and try again.`,
      });
    }

    return res.status(200).json({
      success: true,
      grievance,
    });
  } catch (error) {
    console.error('Track error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching for grievance record.',
    });
  }
});

/**
 * @route   GET /api/grievances
 * @desc    Fetch grievances.
 *          If citizen, returns their personal grievances.
 *          If admin/official, returns department/system queue with filters.
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, urgency, search } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.status = status;
    if (category && category !== 'All') filter.category = category;
    if (urgency && urgency !== 'All') filter.urgency = urgency;

    // If user is a citizen, only show their own grievances
    if (req.user.role === 'citizen') {
      filter['citizen.email'] = req.user.email;
    }

    let grievances = await findGrievances(filter);

    // Optional client search filter across title, description, trackingId, landmark
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      grievances = grievances.filter(g =>
        (g.title || '').toLowerCase().includes(q) ||
        (g.trackingId || '').toLowerCase().includes(q) ||
        (g.description || '').toLowerCase().includes(q) ||
        (g.location?.landmark || '').toLowerCase().includes(q) ||
        (g.location?.address || '').toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: grievances.length,
      grievances,
    });
  } catch (error) {
    console.error('Get grievances error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve grievances.',
    });
  }
});

/**
 * @route   GET /api/grievances/:id
 * @desc    Get detailed record of a single grievance
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const grievance = await findGrievanceById(req.params.id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found.',
      });
    }

    // Citizens can only view their own grievances
    if (req.user.role === 'citizen' && grievance.citizen?.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this grievance.',
      });
    }

    return res.status(200).json({
      success: true,
      grievance,
    });
  } catch (error) {
    console.error('Get grievance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch grievance details.',
    });
  }
});

/**
 * @route   POST /api/grievances
 * @desc    Submit a new citizen grievance (pre-filled with AI recommendations)
 * @access  Private (or Public if guest citizen provided)
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      urgency,
      location,
      citizen,
      aiTriage,
    } = req.body;

    // Input validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required to submit a complaint.',
      });
    }

    // Default citizen contact information if not provided
    const citizenInfo = citizen || {
      name: 'Anonymous Citizen',
      email: 'citizen@demo.com',
      phone: '',
    };

    const newGrievance = await createGrievance({
      title: title.trim(),
      description: description.trim(),
      category: category || 'General',
      urgency: urgency || 'Medium',
      status: 'Pending',
      location: location || {
        address: 'Local Ward',
        landmark: '',
        wardOrPincode: '',
      },
      citizen: citizenInfo,
      aiTriage: aiTriage || {
        summary: description.slice(0, 150),
        actionableRecommendations: ['Inspect site and assign to zonal staff.'],
        confidenceScore: 0.9,
        detectedKeywords: [],
      },
      officialResponse: {
        remarks: '',
        respondedBy: '',
        respondedAt: null,
        departmentAction: '',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully! Save your Tracking ID.',
      trackingId: newGrievance.trackingId,
      grievance: newGrievance,
    });
  } catch (error) {
    console.error('Create grievance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit grievance. Please try again.',
    });
  }
});

/**
 * @route   PATCH /api/grievances/:id/status
 * @desc    Update grievance status and post official resolution remarks
 * @access  Private (Admin / Official only)
 */
router.patch('/:id/status', protect, authorize('admin', 'official'), async (req, res) => {
  try {
    const { status, remarks, departmentAction } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await updateGrievanceStatus(req.params.id, {
      status,
      officialRemarks: remarks || `Status marked as ${status} by department authority.`,
      updatedBy: `${req.user.name} (${req.user.role === 'admin' ? 'Administrator' : req.user.department + ' Dept'})`,
      departmentAction: departmentAction || 'Official municipal review action taken',
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found to update.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Grievance status updated to "${status}" successfully!`,
      grievance: updated,
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update grievance status.',
    });
  }
});

module.exports = router;
