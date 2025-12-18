import express from 'express';
import { googleLogin, Login, logout, Register } from '../controllers/Auth.controller.js';
import { addBlog, deleteBlog, editBlog, showAllBlog, updateBlog, getBlog, toggleLike, searchBlogs, getAllBlogsPublic} from '../controllers/Blog.Controller.js';
import upload from '../config/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const BlogRoute = express.Router();

BlogRoute.post('/add',authenticate, upload.single('file'), addBlog);
BlogRoute.get('/edit/:blogid', authenticate, editBlog);
BlogRoute.put('/update/:blogid',authenticate, upload.single('file'), updateBlog);
BlogRoute.delete('/delete/:blogid', authenticate, deleteBlog);
BlogRoute.get('/get-all', authenticate, showAllBlog);
BlogRoute.get('/public/all', getAllBlogsPublic);

BlogRoute.get('/get-blog/:slug',  getBlog);
BlogRoute.post('/like/:blogid', toggleLike);
BlogRoute.get('/search', searchBlogs);


export default BlogRoute;

