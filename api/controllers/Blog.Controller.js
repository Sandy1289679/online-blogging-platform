import cloudinary from '../config/cloudinary.js';
import { handleError } from '../helpers/handleError.js';
import {encode} from 'entities'
import Blog from '../models/blog.model.js';

export const addBlog=async(req,res,next)=>{
    try{
        console.log('addBlog called');
        const data=JSON.parse(req.body.data)
        console.log('data parsed:', data);
        if (!data.author) {
            return next(handleError(400, 'Author is required'));
        }
        if (!data.title || !data.slug || !data.blogcontent || !data.category) {
            return next(handleError(400, 'All fields are required'));
        }
        let featuredImage=''
         if (req.file) {
             console.log('file present:', req.file.path);
             try {
               const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                 folder: "Blogging Mern",resource_type:'auto'
               });
               featuredImage = uploadResult.secure_url;
               console.log('upload success:', featuredImage);
             } catch (error) {
               console.log('cloudinary error:', error);
               return next(handleError(500, error.message));
             }
            }
        const blog=new Blog({
            author:data.author,
            category:data.category,
            title:data.title,
            slug:data.slug,
            featuredImage:featuredImage,
            blogcontent:encode(data.blogcontent),

        })
        console.log('saving blog');
        await blog.save()
        console.log('blog saved');
        res.status(200).json({
            success:true,
            message:'blog added successfully'
        })

    }catch(error){
        console.log('error in addBlog:', error);
        next(handleError(500,error.message))
    }
}
export const editBlog=async(req,res,next)=>{
    try{
        console.log('editBlog called');
        const {blogid}=req.params
        console.log('blogid:', blogid);
        const blog=await Blog.findById(blogid).populate('category','name')
        console.log('blog found:', !!blog);
        if(!blog){
            return next(handleError(404,'Blog not found'))
        }
        res.status(200).json({
            success:true,
            blog
        })
    }catch(error){
        console.log('error in editBlog:', error);
        next(handleError(500,error.message))
    }
}
export const updateBlog=async(req,res,next)=>{
    try{
        console.log('updateBlog called');
        const {blogid}=req.params
        console.log('blogid:', blogid);
        const data=JSON.parse(req.body.data)
        console.log('data parsed:', data);
        let featuredImage=''
         if (req.file) {
             console.log('file present:', req.file.path);
             try {
               const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                 folder: "Blogging Mern",resource_type:'auto'
               });
               featuredImage = uploadResult.secure_url;
               console.log('upload success:', featuredImage);
             } catch (error) {
               console.log('cloudinary error:', error);
               return next(handleError(500, error.message));
             }
            }
        const updateData={
            category:data.category,
            title:data.title,
            slug:data.slug,
            blogcontent:encode(data.blogcontent),
        }
        if(featuredImage){
            updateData.featuredImage=featuredImage
        }
        console.log('updating blog');
        await Blog.findByIdAndUpdate(blogid,updateData)
        console.log('blog updated');
        res.status(200).json({
            success:true,
            message:'blog updated successfully'
        })

    }catch(error){
        console.log('error in updateBlog:', error);
        next(handleError(500,error.message))
    }
}
export const deleteBlog=async(req,res,next)=>{
    try{
        const {blogid}=req.params
        const blog=await Blog.findByIdAndDelete(blogid)
        if(!blog){
            return next(handleError(404,'Blog not found'))
        }
        res.status(200).json({
            success:true,
            message:'blog deleted successfully'
        })
    }catch(error){
        next(handleError(500,error.message))
    }
}
export const showAllBlog=async(req,res,next)=>{
    try{
        const user = req.user;
        let blog;
        
        if (user.role === 'admin') {
            // Admin can see all blogs
            blog = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec();
        } else {
            // Regular user can only see their own blogs
            blog = await Blog.find({ author: user._id }).populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec();
        }
        
        res.status(200).json({
            success:true,
             blogs:blog
        })
    }catch(error){
        next(handleError(500,error.message))
    }
}

export const getAllBlogsPublic=async(req,res,next)=>{
    try{
        // Get all blogs for home page - visible to everyone
        const blog = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec();
        
        res.status(200).json({
            success:true,
             blogs:blog
        })
    }catch(error){
        next(handleError(500,error.message))
    }
}

export const getBlog=async(req,res,next)=>{
    try{
        const {slug}=req.params
 const blog=await  Blog.findOne({slug}).populate('author','name avatar role').populate('category','name slug').lean().exec()
        if(!blog){
            return next(handleError(404,'Blog not found'))
        }
        res.status(200).json({
            success:true,
            blog
        })
    }catch(error){
        next(handleError(500,error.message))
    }
}

export const toggleLike = async (req, res, next) => {
    try {
        const { blogid } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return next(handleError(400, 'User ID is required'));
        }

        const blog = await Blog.findById(blogid);
        if (!blog) {
            return next(handleError(404, 'Blog not found'));
        }

        const userIndex = blog.likedBy.indexOf(userId);
        
        if (userIndex > -1) {
            // User already liked, remove like
            blog.likedBy.splice(userIndex, 1);
            blog.likes = Math.max(0, blog.likes - 1);
        } else {
            // Add like
            blog.likedBy.push(userId);
            blog.likes += 1;
        }

        await blog.save();

        res.status(200).json({
            success: true,
            likes: blog.likes,
            isLiked: userIndex === -1
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const searchBlogs = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(200).json({
                success: true,
                blogs: []
            });
        }

        // Search by title or category name (case-insensitive)
        const blogs = await Blog.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }
            ]
        })
        .populate('author', 'name avatar')
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .lean()
        .exec();

        // Also search by category name
        const blogsByCategory = await Blog.find()
            .populate('author', 'name avatar')
            .populate({
                path: 'category',
                match: { name: { $regex: query, $options: 'i' } },
                select: 'name slug'
            })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        // Filter out blogs where category didn't match
        const filteredCategoryBlogs = blogsByCategory.filter(blog => blog.category !== null);

        // Combine and remove duplicates
        const combinedBlogs = [...blogs, ...filteredCategoryBlogs];
        const uniqueBlogs = Array.from(new Map(combinedBlogs.map(blog => [blog._id.toString(), blog])).values());

        res.status(200).json({
            success: true,
            blogs: uniqueBlogs,
            count: uniqueBlogs.length
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}