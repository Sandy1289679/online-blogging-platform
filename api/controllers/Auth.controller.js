// controllers/Auth.controller.js
import { handleError } from '../helpers/handleError.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return next(handleError(400, 'Name, email and password are required'));

    const checkuser = await User.findOne({ email });
    if (checkuser) return next(handleError(409, 'User already registered.'));

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(handleError(400, 'Email and password are required'));
    }

    const user = await User.findOne({ email });
    if (!user) return next(handleError(401, 'Invalid login credentials'));

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return next(handleError(401, 'Invalid login credentials'));

    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remove password and use newUser
    const { password: _, ...newUser } = user.toObject();

    return res.status(200).json({
      success: true,
      user: newUser,
      message: 'Login successful'
    });

  } catch (error) {
    return next(handleError(500, error.message));
  }
};


/**
 * Exported name must be exactly `googleLogin` (lowercase g)
 * so routes/Authroute.js can import it correctly.
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    if (!email) return next(handleError(400, 'Email is required'));

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.round(Math.random() * 100000).toString();
      const hashedPassword = bcryptjs.hashSync(randomPassword, 10);
      const created = new User({ name, email, password: hashedPassword, avatar });
      user = await created.save();
    } else {
      // optional: update name/avatar
      let changed = false;
      if (name && user.name !== name) { user.name = name; changed = true; }
      if (avatar && user.avatar !== avatar) { user.avatar = avatar; changed = true; }
      if (changed) await user.save();
    }

    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user.toObject();
    return res.status(200).json({ success: true, user: safeUser, message: 'Login successful' });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};
export const logout = async (req, res, next) => {
  try {
  

    
    res.clearCookie('access_token',  {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      
    });

    
    return res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};
