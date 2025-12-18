import React, { useState } from 'react';
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
import moment from 'moment';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const UsersPage = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [refresh, setRefresh] = useState(0);
  
  const { data: usersData, loading } = useFetch(
    `${base.replace(/\/$/, "")}/user/all`,
    {
      method: 'get',
      credentials: 'include',
    },
    [refresh]
  );

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`${base.replace(/\/$/, "")}/user/delete/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        showToast('success', 'User deleted successfully');
        setRefresh(prev => prev + 1);
      } else {
        showToast('error', 'Failed to delete user');
      }
    } catch (error) {
      showToast('error', 'Error deleting user');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center items-start pt-10 pb-6 w-full min-h-[calc(100vh-120px)]">
      <Card className="w-full max-w-[1200px] shadow-lg p-8 rounded-xl">
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableCaption>List of all users in the system.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Role</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead className="w-[150px]">Dated</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {usersData && usersData.users.length > 0 ? (
                usersData.users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.role || 'user'}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{moment(user.createdAt).format('DD-MM-YYYY')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleDelete(user._id)}
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
                  <TableCell colSpan={6} className="text-center">
                    No users found
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

export default UsersPage;
