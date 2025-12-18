import Loading from '@/components/Loading';
import { useFetch } from '@/hooks/useFettch';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { decode } from 'entities';
import moment from 'moment';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { showToast } from '@/helper/showToast';
import CommentSection from '@/components/CommentSection';
import RelatedBlogs from '@/components/RelatedBlogs';

const SingleBlogDetails = () => {
  const { category, blog } = useParams();
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const user = useSelector((state) => state.user?.user);
  
  const { data, loading, error } = useFetch(`${base.replace(/\/$/, "")}/blog/get-blog/${blog}`, {
    method: 'get',
    credentials: 'include',
  }, [blog]);

  const { data: allBlogs } = useFetch(`${base.replace(/\/$/, "")}/blog/get-all`, {
    method: 'get',
    credentials: 'include',
  });

  const { data: commentsData } = useFetch(
    data?.blog?._id ? `${base.replace(/\/$/, "")}/comment/get/${data.blog._id}` : null,
    {
      method: 'get',
      credentials: 'include',
    }, 
    [data?.blog?._id]
  );

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Initialize likes from blog data and reset when blog changes
  useEffect(() => {
    if (data?.blog) {
      setLikes(data.blog.likes || 0);
      // Check if current user has liked this blog
      const userHasLiked = data.blog.likedBy?.includes(user?._id);
      setIsLiked(userHasLiked || false);
      window.scrollTo(0, 0); // Scroll to top when navigating to new blog
    }
  }, [data?.blog, blog, user?._id]);

  if (loading) return <Loading />;

  if (!data || !data.blog) {
    return (
      <div className='w-full min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center text-gray-500'>Blog not found</div>
      </div>
    );
  }

  const blogData = data.blog;

  const handleLike = async () => {
    if (!user) {
      showToast('error', 'Please login to like');
      return;
    }
    
    try {
      const response = await fetch(`${base.replace(/\/$/, "")}/blog/like/${blogData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId: user._id })
      });

      const data = await response.json();
      
      if (data.success) {
        setLikes(data.likes);
        setIsLiked(data.isLiked);
        // showToast('success', data.isLiked ? 'Liked!' : 'Removed like');
      } else {
        showToast('error', 'Failed to update like');
      }
    } catch (error) {
      showToast('error', 'Error updating like');
    }
  };

  return (
    <div className="w-full bg-gray-50 pt-4 md:pt-10 pb-6 min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-4 md:gap-8 px-4 sm:px-8 md:px-16 lg:px-40">
        
        {/* Main Content Container - 70% */}
        <div className='flex-1 lg:flex-[20]'>
          {/* Blog Content and Comments in One Container */}
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-8'>
            
            {/* Blog Title */}
            <h1 className='text-2xl md:text-4xl font-bold text-gray-900 mb-4'>{blogData.title}</h1>
            
            {/* Meta Information - Profile, Like, Comment ABOVE Image */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-3'>
              <div className='flex items-center gap-3'>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={blogData.author?.avatar} alt={blogData.author?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {blogData.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium text-gray-900 text-sm md:text-base'>{blogData.author?.name || 'Unknown Author'}</p>
                  <p className='text-xs md:text-sm text-gray-500'>Date: {moment(blogData.createdAt).format('DD-MM-YYYY')}</p>
                </div>
              </div>
              
              <div className='flex items-center gap-4'>
                <button
                  className='flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors'
                  onClick={handleLike}
                >
                  {isLiked ? <FaHeart className="text-red-500" size={18} /> : <FaRegHeart size={18} />}
                  <span className='font-medium text-sm'>{likes}</span>
                </button>
                
                <div className='flex items-center gap-1 text-gray-600'>
                  <FaRegComment size={18} />
                  <span className='font-medium text-sm'>{commentsData?.comments?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blogData.featuredImage && (
              <div className='mb-6 rounded-lg overflow-hidden'>
                <img 
                  src={blogData.featuredImage} 
                  alt={blogData.title}
                  className='w-full h-auto max-h-[300px] md:max-h-[500px] object-cover'
                />
              </div>
            )}

            {/* Blog Content */}
            <div className='prose prose-sm md:prose-lg max-w-none break-words mb-8'>
              <div dangerouslySetInnerHTML={{ __html: decode(blogData.blogcontent) }} />
            </div>

            {/* Comments Section in Same Container */}
            <div className='border-t border-gray-200 pt-6'>
              <CommentSection 
                blogId={blogData._id} 
                initialComments={commentsData?.comments || []}
              />
            </div>
          </div>
        </div>
        
        {/* Sidebar Container - 30% */}
        <div className='w-full lg:w-auto lg:flex-[8]'>
          <RelatedBlogs 
            blogs={allBlogs?.blogs || []} 
            currentBlogId={blogData._id}
            currentCategoryId={blogData.category?._id}
          />
        </div>

      </div>
    </div>
  );
};

export default SingleBlogDetails;
