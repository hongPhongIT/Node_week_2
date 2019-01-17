import { Router } from 'express';
import UploadFile from '../helper/upload-file';
const router = new Router();

// Get all users
router.post('/upload-file', UploadFile);

export default router;