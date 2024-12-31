import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getMessages,
  createMessage,
  updateMessageStatus,
  addReaction
} from '../controllers/messageController.js';

const router = express.Router();

router.use(authenticate);

router.get('/:room', getMessages);
router.post('/', createMessage);
router.put('/:messageId/read', updateMessageStatus);
router.post('/:messageId/reactions', addReaction);

export default router;