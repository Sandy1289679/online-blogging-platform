import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useSelector } from 'react-redux';
import { showToast } from '@/helper/showToast';
import moment from 'moment';
import { GoTrash } from "react-icons/go";

const CommentSection = ({ blogId, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const base = import.meta.env.VITE_API_BASE_URL || "";

  // Update comments when initialComments or blogId changes
  React.useEffect(() => {
    setComments(initialComments);
  }, [initialComments, blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?._id) {
      showToast('error', 'Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      showToast('error', 'Comment cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${base.replace(/\/$/, "")}/comment/add/${blogId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: commentText,
          userId: user._id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setComments([data.comment, ...comments]);
        setCommentText('');
        showToast('success', 'Comment submitted');
      } else {
        showToast('error', 'Failed to submit comment');
      }
    } catch (error) {
      showToast('error', 'Error submitting comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(`${base.replace(/\/$/, "")}/comment/delete/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        setComments(comments.filter(c => c._id !== commentId));
        showToast('success', 'Comment deleted');
      } else {
        showToast('error', 'Failed to delete comment');
      }
    } catch (error) {
      showToast('error', 'Error deleting comment');
    }
  };

  return (
    <div className='space-y-6'>
      {/* Comment Form */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <h3 className='text-xl font-semibold mb-4 flex items-center gap-2'>
          <span className='text-purple-600'>💬</span> Comment
        </h3>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Textarea
            placeholder="Type your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className='min-h-[100px]'
          />
          <Button 
            type="submit" 
            disabled={loading}
            className='bg-purple-600 hover:bg-purple-700'
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>

      {/* Comments List */}
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <h3 className='text-xl font-semibold mb-4'>
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h3>
        
        <div className='space-y-4'>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className='border-b border-gray-100 pb-4 last:border-0'>
                <div className='flex items-start gap-3'>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user?.avatar} alt={comment.user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-semibold text-gray-900'>{comment.user?.name}</p>
                        <p className='text-xs text-gray-500'>
                          {moment(comment.createdAt).format('DD-MM-YYYY')}
                        </p>
                      </div>
                      
                      {user?._id === comment.user?._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment._id)}
                          className="h-8 w-8 p-0"
                        >
                          <GoTrash size={16} className="text-red-500" />
                        </Button>
                      )}
                    </div>
                    
                    <p className='mt-2 text-gray-700'>{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-500 py-4'>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
