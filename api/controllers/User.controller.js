// api/controllers/User.controller.js
import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import { handleError } from "../helpers/handleError.js";

export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid }).lean().exec();

    if (!user) {
      return next(handleError(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const parsedData = req.body.data ? JSON.parse(req.body.data) : {};

    let avatarUrl;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    const updateFields = {
      name: parsedData.name,
      email: parsedData.email,
      bio: parsedData.bio,
    };
    if (avatarUrl) updateFields.avatar = avatarUrl;

    const updatedUser = await User.findByIdAndUpdate(userid, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return next(handleError(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    const user = await User.findByIdAndDelete(userid);

    if (!user) {
      return next(handleError(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};