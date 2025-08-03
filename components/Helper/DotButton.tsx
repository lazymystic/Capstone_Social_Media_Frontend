import { BASE_API_URL } from '@/server';
import { deletePost } from '@/store/postSlice';
import { setAuthUser } from '@/store/authSlice';
import { Post, User } from '@/types';
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { handleAuthRequest } from '../utils/apiRequest';
import { Dialog } from '@radix-ui/react-dialog';
import { Ellipsis } from 'lucide-react';
import { DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';

type Props = {
  post: Post|null;
  user: User|null;
}

const DotButton = ({post,user}:Props) => {

    const isOwnPost = user && post && user._id === post.user._id;
    const isFollowing = user && post && user.following.includes(post.user._id);

    const [followLoading, setFollowLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const dispatch = useDispatch();

    const handleDeletePost = async () => {
        if (!post || deleteLoading) return;
        
        setDeleteLoading(true);
        const deletePostReq = async () => 
            await axios.delete(`${BASE_API_URL}/posts/delete-post/${post._id}`, {
                withCredentials: true
            });
        const result = await handleAuthRequest(deletePostReq, setDeleteLoading);
        if (result) {
            dispatch(deletePost(post._id));
            toast.success(result.data.message);
        }
    };

    const handleFollowUnfollow = async () => {
        if (!user || !post || followLoading) return;
        
        setFollowLoading(true);
        
        const followReq = async () => {
            return await axios.post(`${BASE_API_URL}/users/follow-unfollow/${post.user._id}`, {}, {
                withCredentials: true
            });
        };
        
        const result = await handleAuthRequest(followReq, setFollowLoading);
        
        if (result) {
            // Update the current user's following list in Redux
            const wasFollowing = isFollowing;
            const updatedFollowing = wasFollowing 
                ? user.following.filter(followingId => followingId !== post.user._id)
                : [...user.following, post.user._id];
            
            const updatedCurrentUser = {
                ...user,
                following: updatedFollowing
            };
            
            dispatch(setAuthUser(updatedCurrentUser));
            toast.success(result.data.message);
        }
    };  
    return (
    <div>
        <Dialog>
            <DialogTrigger>
                <Ellipsis className='w-8 h-8 text-black hover:cursor-pointer'/>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Post Options</DialogTitle>
                <div className='flex flex-col gap-2'>
                    {isOwnPost && (
                        <button 
                            className='text-red-500 hover:underline p-2 text-left cursor-pointer'
                            onClick={handleDeletePost}
                        >
                            Delete Post
                        </button>
                    )}
                    {!isOwnPost && !isFollowing && (
                        <button 
                            className='text-blue-500 hover:underline p-2 text-left cursor-pointer'
                            onClick={handleFollowUnfollow}
                            disabled={followLoading}
                        >
                            {followLoading ? 'Following...' : `Follow ${post?.user.userName}`}
                        </button>
                    )}
                    {!isOwnPost && isFollowing && (
                        <button 
                            className='text-red-500 hover:underline p-2 text-left cursor-pointer'
                            onClick={handleFollowUnfollow}
                            disabled={followLoading}
                        >
                            {followLoading ? 'Unfollowing...' : `Unfollow ${post?.user.userName}`}
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </div>
    );
}

export default DotButton