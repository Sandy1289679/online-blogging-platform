import express from 'express';
import { googleLogin, Login, logout, Register } from '../controllers/Auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const AuthRoute = express.Router();

AuthRoute.post('/register', Register);
AuthRoute.post('/login', Login);
AuthRoute.post('/google-login', googleLogin);
AuthRoute.get('/logout',authenticate, logout);

export default AuthRoute;

