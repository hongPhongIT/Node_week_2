import { Router } from 'express';
import UploadFile from '../helper/upload-file';
const router = new Router();

// Get all users
router.post('/:id/upload-file', UploadFile);

export default router;