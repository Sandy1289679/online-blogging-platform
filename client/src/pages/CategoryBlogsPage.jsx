import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFettch';
import Loading from '@/components/Loading';
import { RouteBlogDetails } from '@/helper/RouteName';
import moment from 'moment';

const CategoryBlogsPage = () => {
  const { categoryId } = useParams();
  const base = import.meta.env.VITE_API_BASE_URL || "";

  const { data: categoryData, loading: categoryLoading } = useFetch(
    `${base.replace(/\/$/, "")}/category/get/${categoryId}`,
    {
      method: 'get',
      credentials: 'include',
    }
  );

  const { data: blogsData, loading: blogsLoading } = useFetch(
    `${base.replace(/\/$/, "")}/blog/public/all`,
    {
      method: 'get',
      credentials: 'include',
    }
  );

  if (blogsLoading) return <Loading />;

  const allBlogs = blogsData?.blogs || [];
  
  // Filter blogs by category - shows all blogs by all users in this category
  const categoryBlogs = allBlogs.filter(blog => blog.category?._id === categoryId);
  
  // Get category name from first blog if category data is not available
  const category = categoryBlogs[0]?.category;

  return (
    <div className="w-full bg-gray-50 pt-10 pb-6 min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-[1200px] mx-auto px-30">
        
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {category?.name || 'Category'}
          </h1>
          <p className="text-gray-600">
            {categoryBlogs.length} {categoryBlogs.length === 1 ? 'blog' : 'blogs'} in this category
          </p>
        </div>

        {/* Blogs Grid */}
        {categoryBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryBlogs.map((blog) => (
              <Link
                key={blog._id}
                to={RouteBlogDetails(blog.category?.slug, blog.slug)}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Blog Image */}
                  {blog.featuredImage && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="p-5">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                        {blog.category?.name}
                      </span>
                    </div>

                    {/* Blog Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {blog.title}
                    </h3>

                    {/* Author and Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{blog.author?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{moment(blog.createdAt).format('DD MMM YYYY')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Blogs Found</h2>
              <p className="text-gray-500">
                There are no blogs in the "{category?.name}" category yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBlogsPage;
