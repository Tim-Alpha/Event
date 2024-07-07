import express from 'express';
import * as UserController from '../controllers/user.js';
import * as middleware from '../middlewares/authentication.js';

const router = express.Router();

router.post('/users', UserController.createUser);
router.post('/users/login', UserController.userLogin);
router.post('/users/verify/number', UserController.verifyNumber);
router.post('/users/send/otp', UserController.sendOtp);
router.get('/users', UserController.getAllUsers);
router.get('/users/profile', middleware.verifyToken, UserController.getUserByToken);
router.get('/users/:uuid', UserController.getUserByUUID);
router.put('/users/update', middleware.verifyToken, UserController.updateUser);
router.delete('/users/delete', middleware.verifyToken, UserController.deleteUser);
router.delete('/users/force/delete', middleware.verifyToken, UserController.forceDeleteUser);

export default router;
