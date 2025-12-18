import Comment from '../models/comment.model.js';
import { handleError } from '../helpers/handleError.js';

export const addComment = async (req, res, next) => {
    try {
        const { blogId } = req.params;
        const { content, userId } = req.body;

        if (!content || !userId) {
            return next(handleError(400, 'Content and userId are required'));
        }

        const comment = new Comment({
            blog: blogId,
            user: userId,
            content
        });

        await comment.save();
        
        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'name avatar')
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            comment: populatedComment
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const getComments = async (req, res, next) => {
    try {
        const { blogId } = req.params;

        const comments = await Comment.find({ blog: blogId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findByIdAndDelete(commentId);
        
        if (!comment) {
            return next(handleError(404, 'Comment not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const getAllComments = async (req, res, next) => {
    try {
        const user = req.user;
        let comments;
        
        if (user.role === 'admin') {
            // Admin can see all comments
            comments = await Comment.find()
                .populate('user', 'name avatar')
                .populate('blog', 'title slug')
                .populate({
                    path: 'blog',
                    populate: {
                        path: 'category',
                        select: 'slug'
                    }
                })
                .sort({ createdAt: -1 })
                .lean()
                .exec();
        } else {
            // Regular user can only see their own comments
            comments = await Comment.find({ user: user._id })
                .populate('user', 'name avatar')
                .populate('blog', 'title slug')
                .populate({
                    path: 'blog',
                    populate: {
                        path: 'category',
                        select: 'slug'
                    }
                })
                .sort({ createdAt: -1 })
                .lean()
                .exec();
        }

        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};
