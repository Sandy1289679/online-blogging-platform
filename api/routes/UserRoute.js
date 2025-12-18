// api/routes/UserRoute.js
import express from 'express';
import { getUser, updateUser, getAllUsers, deleteUser } from '../controllers/User.controller.js'; // <-- match file name exactly
import upload from '../config/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const UserRoute = express.Router();
UserRoute.use(authenticate)

UserRoute.get('/get-user/:userid', getUser);
UserRoute.put('/update-user/:userid', upload.single('file'), updateUser);
UserRoute.get('/all', getAllUsers);
UserRoute.delete('/delete/:userid', deleteUser);

export default UserRoute;