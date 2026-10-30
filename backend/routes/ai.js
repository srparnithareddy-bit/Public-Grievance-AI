/**
 * AI Routes
 * Endpoints for AI Complaint Triage Engine and Conversational Assistant
 */

const express = require('express');
const router = express.Router();
const { triageComplaint, chatWithCitizenAssistant } = require('../services/aiService');

/**
 * @route   POST /api/ai/triage
 * @desc    Parse raw citizen text and output structured complaint JSON
 * @access  Public
 */
router.post('/triage', async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complaint text to triage.',
      });
    }

    const triageResult = await triageComplaint(rawText);

    return res.status(200).json({
      success: true,
      triage: triageResult,
    });
  } catch (error) {
    console.error('AI Triage error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'AI Triage processing failed.',
    });
  }
});

/**
 * @route   POST /api/ai/chat
 * @desc    Conversational chat assistant that interacts with citizens and guides complaint drafting
 * @access  Public
 */
router.post('/chat', async (req, res) => {
  try {
    const { messages, draftComplaint } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a conversation messages array.',
      });
    }

    const chatResponse = await chatWithCitizenAssistant(messages, draftComplaint);

    return res.status(200).json({
      success: true,
      reply: chatResponse.reply,
      suggestedTriage: chatResponse.suggestedTriage,
      source: chatResponse.source,
    });
  } catch (error) {
    console.error('AI Chat assistant error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'AI Chat Assistant processing failed.',
    });
  }
});

module.exports = router;
