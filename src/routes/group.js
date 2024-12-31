import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createGroup } from '../controllers/groupController.js';


const router = express.Router();

router.use(authenticate);

router.post('/addgroup', createGroup);




export default router;