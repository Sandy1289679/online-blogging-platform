import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from '@/hooks/useFettch';
import Loading from '@/components/Loading';
import { GoTrash } from "react-icons/go";
import { showToast } from '@/helper/showToast';
import { RouteBlogDetails } from '@/helper/RouteName';

const CommentsPage = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [refresh, setRefresh] = useState(0);
  
  const { data: commentsData, loading } = useFetch(
    `${base.replace(/\/$/, "")}/comment/all`,
    {
      method: 'get',
      credentials: 'include',
    },
    [refresh]
  );

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`${base.replace(/\/$/, "")}/comment/delete/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        showToast('success', 'Comment deleted successfully');
        setRefresh(prev => prev + 1); // Refresh the list
      } else {
        showToast('error', 'Failed to delete comment');
      }
    } catch (error) {
      showToast('error', 'Error deleting comment');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center items-start pt-4 md:pt-10 pb-6 w-full min-h-[calc(100vh-120px)] px-4">
      <Card className="w-full max-w-[950px] shadow-lg p-4 md:p-8 rounded-xl">
        <CardHeader className="px-0">
          <CardTitle className="text-xl md:text-2xl">Comments Management</CardTitle>
          <CardDescription className="text-sm">View and manage all comments posted by users</CardDescription>
        </CardHeader>

        <CardContent className="px-0 overflow-x-auto">
          <Table>
            <TableCaption>List of all comments in the system.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Blog</TableHead>
                <TableHead className="min-w-[150px]">Commented By</TableHead>
                <TableHead className="min-w-[200px]">Comment</TableHead>
                <TableHead className="min-w-[80px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {commentsData && commentsData.comments.length > 0 ? (
                commentsData.comments.map(comment => (
                  <TableRow key={comment._id}>
                    <TableCell className="font-medium">
                      {comment.blog ? (
                        <Link 
                          to={RouteBlogDetails(comment.blog.category?.slug, comment.blog.slug)}
                          className="text-purple-600 hover:underline"
                        >
                          {comment.blog.title}
                        </Link>
                      ) : (
                        <span className="text-gray-400">Blog deleted</span>
                      )}
                    </TableCell>
                    <TableCell>{comment.user?.name || 'Unknown'}</TableCell>
                    <TableCell className="max-w-md truncate">{comment.content}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleDelete(comment._id)}
                        variant="outline"
                        className="h-9 w-9 p-0 flex items-center justify-center 
                                   hover:bg-red-600 hover:text-white transition ml-auto"
                      >
                        <GoTrash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No comments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentsPage;
