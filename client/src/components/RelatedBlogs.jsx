import React from 'react';
import { Link } from 'react-router-dom';
import { RouteBlogDetails } from '@/helper/RouteName';

const RelatedBlogs = ({ blogs, currentBlogId, currentCategoryId }) => {
  const relatedBlogs = blogs?.filter(blog => 
    blog._id !== currentBlogId && 
    blog.category?._id === currentCategoryId
  ).slice(0, 4) || [];

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
      <h3 className='text-xl font-semibold mb-4'>Related Blogs</h3>
      
      {relatedBlogs.length > 0 ? (
        <div className='space-y-4'>
          {relatedBlogs.map((blog) => (
            <Link
              key={blog._id}
              to={RouteBlogDetails(blog.category?.slug, blog.slug)}
              className='block group'
            >
              <div className='flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors'>
                {blog.featuredImage && (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className='w-20 h-20 object-cover rounded-lg'
                  />
                )}
                <div className='flex-1'>
                  <h4 className='font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors'>
                    {blog.title}
                  </h4>
                  {blog.category && (
                    <span className='text-xs text-gray-500 mt-1 inline-block'>
                      {blog.category.name}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 text-sm'>No related blogs found</p>
      )}
    </div>
  );
};

export default RelatedBlogs;
