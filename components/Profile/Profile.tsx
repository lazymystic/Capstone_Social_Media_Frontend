'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Grid, Bookmark, MenuIcon } from 'lucide-react';
import { RootState } from '@/store/store';
import { User, Post } from '@/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import LeftSidebar from '../Home/LeftSidebar';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet';
import { setAuthUser } from '@/store/authSlice';
import { useFollowUnfollow } from '@/hooks/useAuthCheck';

interface Props {
  id: string;
}

const Profile = ({ id }: Props) => {
  const { handleFollowUnfollow } = useFollowUnfollow();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(currentUser ? currentUser.following.includes(id) : false);
  const [followLoading, setFollowLoading] = useState(false);

  // console.log('Profile ID:', id);
  // console.log('Current User:', currentUser);
  // console.log('Profile User:', profileUser);

  useEffect(() => {
    if(!currentUser) {
      router.replace('/auth/login');
    }
    else
    {
        const getUser = async () => {
            const userReq = async () => {
                return await axios.get(`${BASE_API_URL}/users/profile/${id}`);
            };
            
            const result = await handleAuthRequest(userReq, setIsLoading);
            if (result) {
                setProfileUser(result?.data.data.user);
                if (currentUser) {
                    setIsFollowing(currentUser?.following?.includes(id) ?? false);
                }
                setIsLoading(false);
            }
        };
        getUser();
    }
    
    
  },[currentUser, router,id]);

  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Profile not found</div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profileUser._id;


  return (
    <div className="flex">
      <div className="w-[20%] hidden md:block border-r-2 h-screen fixed">
        <LeftSidebar />
      </div>
      <div className="flex-1 md:ml-[20%] overflow-y-auto">
        
        <div className='md:hidden p-4'>
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MenuIcon className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation menu
              </SheetDescription>
              <div className="mt-4">
                <LeftSidebar />
              </div>
            </SheetContent>
          </Sheet>  
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32 md:w-40 md:h-40">
                <AvatarImage 
                  src={profileUser.profilePicture} 
                  alt={profileUser.userName}
                />
                <AvatarFallback className="text-2xl">
                  {profileUser.userName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {/* Username and Follow/Edit Button */}
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <h1 className="text-2xl font-light">{profileUser.userName}</h1>
                {isOwnProfile ? (
                  <Button 
                    variant="outline" 
                    className="px-6"
                    onClick={() => router.push('/edit-profile')}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleFollowUnfollow(profileUser._id)}
                    disabled={followLoading}
                    className={`px-6 hover: cursor-pointer ${
                      isFollowing 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    
                    {followLoading 
                      ? 'Loading...' 
                      : isFollowing 
                        ? 'Unfollow' 
                        : 'Follow'
                    }
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-6 justify-center md:justify-start">
                <div className="text-center">
                  <span className="font-semibold">{profileUser.posts?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Posts</span>
                </div>
                <div className="text-center">
                  <span className="font-semibold">{profileUser.followers?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
                <div className="text-center">
                  <span className="font-semibold">{profileUser.following?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
              </div>

              {/* Bio */}
              <div className="text-sm">
                <p className="font-semibold">{profileUser.userName}</p>
                <p className="text-gray-700 mt-1">
                  {profileUser.Bio || 'Bio Part'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex justify-center">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center gap-1 px-6 py-4 text-xs font-semibold tracking-wide border-t-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid size={12} />
                POST
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-1 px-6 py-4 text-xs font-semibold tracking-wide border-t-2 transition-colors ${
                  activeTab === 'saved'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Bookmark size={12} />
                SAVED
              </button>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="mt-8">
            {activeTab === 'posts' ? (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {profileUser.posts && profileUser.posts.length > 0 ? (
                  profileUser.posts.map((post, index) => (
                    <div
                      key={post._id || index}
                      className="aspect-square bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={post.image?.url || '/placeholder-image.jpg'}
                        alt={`Post ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <div className="text-2xl mb-4">📷</div>
                    <h3 className="text-2xl font-light mb-2">No Posts Yet</h3>
                    <p className="text-gray-500">When you share photos, they&apos;ll appear on your profile.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {profileUser.savedPosts && profileUser.savedPosts.length > 0 ? (
                  profileUser.savedPosts.map((savedPost, index) => (
                    <div
                      key={typeof savedPost === 'string' ? savedPost : savedPost._id}
                      className="aspect-square bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={typeof savedPost === 'string' ? '/placeholder-image.jpg' : savedPost.image?.url || '/placeholder-image.jpg'}
                        alt={`Saved post ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <div className="text-2xl mb-4">🔖</div>
                    <h3 className="text-2xl font-light mb-2">No Saved Posts</h3>
                    <p className="text-gray-500">Save posts to see them here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;