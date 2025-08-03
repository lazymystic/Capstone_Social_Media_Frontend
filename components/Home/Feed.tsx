import { BASE_API_URL } from '@/server';
import { RootState } from '@/store/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { handleAuthRequest } from '../utils/apiRequest';
import { setPosts, likeOrDislikePost, addComment } from '@/store/postSlice';
import { Heart, MessageCircle, Send, Bookmark, Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';
import { toast } from 'sonner';
import { Post } from '@/types';
import Comment from '../Helper/Comment';
import DotButton from '../Helper/DotButton';
import { toggleSavePost } from '@/store/authSlice';

const Feed = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.post.posts);

  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [likingPosts, setLikingPosts] = useState<{[key: string]: boolean}>({});
  const [commentingPosts, setCommentingPosts] = useState<{[key: string]: boolean}>({});

  // console.log("Posts in Feed:", posts); 

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  useEffect(() => {
    const getAllPosts = async () => {
      const getAllPostsReq = async () => 
          await axios.get(`${BASE_API_URL}/posts/get`);
      const result = await handleAuthRequest(getAllPostsReq, setIsLoading);
      if (result) {
        dispatch(setPosts(result.data.data.posts));
      }
    }
    getAllPosts();
  }, [dispatch]);

  const handleLikeDislike = async (postId: string) => {
    if (!user || likingPosts[postId]) return;
    
    setLikingPosts(prev => ({ ...prev, [postId]: true }));
    
    const likeReq = async () => 
      await axios.post(`${BASE_API_URL}/posts/like-dislike/${postId}`, {}, {
        withCredentials: true
      });
    
    const result = await handleAuthRequest(likeReq, () => {});
    
    if (result) {
      dispatch(likeOrDislikePost({ postId, userId: user._id }));
    }
    
    setLikingPosts(prev => ({ ...prev, [postId]: false }));
  };

  const handleSaveUnsave = async (postId: string) => {
    if (!user) return;
    
    const saveReq = async () => 
      await axios.post(`${BASE_API_URL}/posts/save-unsaved-post/${postId}`, {}, {
        withCredentials: true
      });
    
    const result = await handleAuthRequest(saveReq, () => {});
    
    if (result) {
      // Update Redux store using postSlice
      dispatch(toggleSavePost(postId));
      // dispatch(saveOrUnsavePost({ postId, userId: user._id }));
      toast.success(result.data.message);
    }
  };

  const handleComment = async (postId: string) => {
    if (!user || !commentInputs[postId]?.trim() || commentingPosts[postId]) return;
    
    setCommentingPosts(prev => ({ ...prev, [postId]: true }));
    
    const commentReq = async () => 
      await axios.post(`${BASE_API_URL}/posts/comment/${postId}`, {
        text: commentInputs[postId].trim()
      }, {
        withCredentials: true
      });
    
    const result = await handleAuthRequest(commentReq, () => {});
    
    if (result) {
      const newComment = result.data.data.comment;
      dispatch(addComment({ postId, comment: newComment }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      toast.success('Comment added successfully!');
    }
    
    setCommentingPosts(prev => ({ ...prev, [postId]: false }));
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center my-10">
        <Loader className="mx-auto animate-spin" size={24} />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center my-10">
        <h1 className="text-lg font-semibold">No posts available</h1>
        <p className="text-gray-500 mt-2">Start following people to see their posts!</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {posts.map((post: Post) => (
        <div key={post._id} className="bg-white border rounded-lg mb-6">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button onClick={() => handleUserClick(post.user._id)}>
                <Avatar className="w-8 h-8 hover:opacity-80 transition-opacity">
                  <AvatarImage src={post.user.profilePicture} alt={post.user.userName} />
                  <AvatarFallback>
                    {post.user.userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
              <div>
                <button 
                  onClick={() => handleUserClick(post.user._id)}
                  className="font-semibold text-sm hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {post.user.userName}
                </button>
              </div>
            </div>
            {/* <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button> */}
            
            <DotButton post={post} user={user} />
            
          </div>

          {/* Post Image */}
          <div className="relative aspect-square">
            <Image
              src={post.image.url}
              alt={post.caption || 'Post image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Post Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLikeDislike(post._id)}
                  disabled={likingPosts[post._id]}
                  className="transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 hover:cursor-pointer ${
                      post.likes.includes(user?._id || '') 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-700 hover:text-gray-500'
                    }`}
                  />
                </button>
                <button className="transition-colors hover:text-gray-500">
                  <MessageCircle className="w-6 h-6 hover:cursor-pointer" />
                </button>
                <button className="transition-colors hover:text-gray-500">
                  <Send className="w-6 h-6 hover:cursor-pointer" />
                </button>
              </div>
              <button 
                onClick={() => handleSaveUnsave(post._id)}
                className={`cursor-pointer ${(user?.savedPosts as string[])?.some((savePostId: string) => savePostId === post._id) ? "text-red-500" : ""}`}
              >
                <Bookmark className="w-6 h-6 hover:cursor-pointer" />
              </button>
            </div>

            {/* Likes Count */}
            {post.likes.length > 0 && (
              <p className="font-semibold text-sm mb-2">
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </p>
            )}

            {/* {<span className="font-semibold text-sm mr-2">{post.user.userName}</span>} */}
            {/* Caption */}
            {post.caption && (
              <div className="mb-2">
                <span className="text-sm">{post.caption}</span>
              </div>
            )}

            {/* Comments */}
            {/* {post.comments.length > 0 && (
              <div className="mb-2">
                {post.comments.length > 2 && (
                  <button className="text-gray-500 text-sm mb-1">
                    View all {post.comments.length} comments
                  </button>
                )}
                {post.comments.slice(-2).map((comment) => (
                  <div key={comment._id} className="mb-1">
                    <span className="font-semibold text-sm mr-2">{comment.user.userName}</span>
                    <span className="text-sm">{comment.text}</span>
                  </div>
                ))}
              </div>
            )} */}
            {
              <Comment post={post} />
            }

            {/* Time */}
            <p className="text-gray-500 text-xs mb-3">
              {formatTimeAgo(post.createdAt)}
            </p>

            {/* Comment Input */}
            <div className="flex items-center gap-3 border-t pt-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[post._id] || ''}
                onChange={(e) => setCommentInputs(prev => ({ 
                  ...prev, 
                  [post._id]: e.target.value 
                }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleComment(post._id);
                  }
                }}
                className="flex-1 text-sm outline-none"
              />
              {commentInputs[post._id]?.trim() && (
                <button
                  onClick={() => handleComment(post._id)}
                  disabled={commentingPosts[post._id]}
                  className="text-blue-500 font-semibold text-sm hover:text-blue-700 disabled:opacity-50"
                >
                  {commentingPosts[post._id] ? 'Posting...' : 'Post'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;