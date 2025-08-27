import { Router } from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import { nlpService } from '../services/nlpService';

const router = Router();

// POST /api/translate
// Processes a text message through the NLP pipeline
router.post('/translate', protect, async (req: AuthRequest, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ message: 'Text and targetLanguage are required.' });
  }

  try {
    const result = await nlpService.processMessage(text, targetLanguage);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error during text processing:', error);
    res.status(500).json({ message: 'Server error during text processing.' });
  }
});

export default router;
