import { Router } from 'express';
import GroupController from '../controllers/group.controller';
const router = new Router();
import group from '../validations/group'
const validate = require('express-validation')
    , http = require('http');

// Get all group users
router.get('/groups', GroupController.getAll);
// Get group by id
router.get('/groups/:id', validate(group.params), GroupController.getGroup);

router.get('/groups/:id/active', validate(group.params), GroupController.getActiveGroup);
// Create group
router.post('/groups', validate(group.body), GroupController.addGroup);
// Update group
router.put('/groups/:id', validate([group.params, group.bodyForUpdate]), GroupController.updateGroup);
// Remove group
router.delete('/groups/:id', validate(group.params), GroupController.deleteGroup);
// Add member
// router.put('/groups/:id/add-members', validate(group.addMember), GroupController.addMember);
// Delete member
// router.put('/groups/:id/delete-member', validate(group.deleteMember), GroupController.deleteMember);

export default router;