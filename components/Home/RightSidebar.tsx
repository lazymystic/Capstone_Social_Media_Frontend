'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import { RootState } from '@/store/store';
import axios from 'axios';
import { User } from '@/types';


const RightSidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // console.log(suggestedUsers);
  useEffect(() => {
    const getSuggestedUsers = async () => {
      const getSuggestedUserReq = async () => {
        return await axios.get(`${BASE_API_URL}/users/suggested-users`, {
          withCredentials: true,
        });
      };

      const result = await handleAuthRequest(getSuggestedUserReq, setIsLoading);
      
      if (result) {
        setSuggestedUsers(result.data.data.users);
      }
    };

    getSuggestedUsers();
  }, []);
  // return (<div>Hello</div>);
  return (
    <div className="my-10 w-full">
      {/* Current User Profile Section */}
      <div className="flex items-center justify-between my-5 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={user?.profilePicture} 
              alt={user?.userName}
            />
            <AvatarFallback>
              {user?.userName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">
              <span 
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/profile/${user?._id}`)}
              >
                {user?.userName}
              </span>
            </h1>
            <span className="text-gray-600 text-sm">
              {user?.Bio || 'My bio'}
            </span>
          </div>
        </div>
        
        <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6] transition-colors">
          Switch
        </span>
      </div>

      {/* Suggested Users Section */}
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See all</span>
      </div>
      
      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-sm text-gray-500">Loading suggestions...</div>
          </div>
        ) : suggestedUsers.length > 0 ? (
          suggestedUsers.slice(0, 5).map((suggestedUser) => (
            <div key={suggestedUser._id} className="flex items-center justify-between my-5">
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={suggestedUser?.profilePicture} 
                    alt={suggestedUser.userName}
                  />
                  <AvatarFallback>
                    {suggestedUser.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold text-sm">
                    <span 
                      className="cursor-pointer hover:underline"
                      onClick={() => router.push(`/profile/${suggestedUser._id}`)}
                    >
                      {suggestedUser.userName}
                    </span>
                  </h1>
                    <span className="text-gray-600 text-sm">
                    {suggestedUser.Bio || 'No bio available'}
                    </span>
                </div>
              </div>
              
              <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6] transition-colors">
                Details
              </span>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">
            No suggestions available
          </div>
        )}
      </div>

      
    </div>
  );
};

export default RightSidebar;