import express from 'express';
import { addComment, getComments, deleteComment, getAllComments } from '../controllers/Comment.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const CommentRoute = express.Router();

CommentRoute.post('/add/:blogId',authenticate, addComment);
CommentRoute.get('/get/:blogId', getComments);
CommentRoute.get('/all',authenticate, getAllComments);
CommentRoute.delete('/delete/:commentId', authenticate, deleteComment);

export default CommentRoute;
