import { Router } from 'express';
import GroupController from '../controllers/group.controller';
const router = new Router();
import group from '../validation/group'
const validate = require('express-validation')
    , http = require('http');

// Get all group users
router.get('/groups', GroupController.getAll);
// Get group by id
router.get('/groups/:id', validate(group.params),GroupController.getGroup);
// Create group
router.post('/groups', validate(group.body),GroupController.addGroup);
// Update group
router.put('/groups/:id', validate(group),GroupController.updateGroup);
// Remove group
router.delete('/groups/:id', validate(group.params),GroupController.deleteGroup);

export default router;