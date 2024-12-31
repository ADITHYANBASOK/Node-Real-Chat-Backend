import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  updateStatus,
  searchUsers,
  getAllUsers
} from '../controllers/userController.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/status', updateStatus);
router.get('/search', searchUsers);
router.get('/users', getAllUsers);


export default router;