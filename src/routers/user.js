import express from 'express';
import * as UserController from '../controllers/user.js';

const router = express.Router();

router.post('/users', UserController.createUser);
router.get('/users', UserController.getAllUsers);
router.get('/users/:uuid', UserController.getUserByUUID);
router.put('/users/:uuid', UserController.updateUserByUUID);
router.delete('/users/:uuid', UserController.deleteUserByUUID);
router.delete('/users/force/:uuid', UserController.forceDeleteUserByUUID);

export default router;
