
import { Heart, HomeIcon, LogOut, MessageCircle, Search, Square, SquarePlus } from 'lucide-react';
import React, { use, useState } from 'react'
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { RootState } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setAuthUser } from '@/store/authSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import CreatePostModel from './CreatePostModel';

const LeftSidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleLogout =async () => {
    await axios.post(`${BASE_API_URL}/users/logout`, {}, { withCredentials: true });
    // Clear user data from Redux store
    dispatch(setAuthUser(null));
    
    // Show logout success message
    toast.success('Logged out successfully!');
    
    // Redirect to login page
    router.push('/auth/login');
    
    // console.log('User logged out');
  };
  
  const handleSidebar = (label: string) => {
    if (label === 'Logout') handleLogout();
    if (label === 'Home') router.push('/');
    if (label === 'Profile') router.push(`/profile/${user?._id}`);
    if (label === 'Create Post') setIsDialogOpen(true);
  }
  const SidebarLinks = [
    {
      icon: <HomeIcon />,
      label: 'Home',
    },
    {
      icon: <Search />,
      label: 'Search',
    },
    {
      icon: <MessageCircle />,
      label: 'Messages',
    },
    {
      icon: <Heart />,
      label: 'Notifications',
    },
    {
      icon: <SquarePlus />,
      label: 'Create Post',
    },
    {
      icon: (
        <Avatar className='w-8 h-8'>
          <AvatarImage src={user?.profilePicture} className='w-8 h-8' alt="User Avatar" />
          <AvatarFallback>ch</AvatarFallback>
        </Avatar>
      ),
      label: 'Profile',
    },
    {
      icon: <LogOut />,
      label: 'Logout',
    }

  ];
  return (
    <div className="h-full">
      <CreatePostModel isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      <div className='lg:p-6 p-3 cursor-pointer'>
      <div onClick={()=>{router.push('/');}} className="flex justify-center items-center w-full py-6 cursor-pointer">
        <Image
          src="/images/logo.jpg"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto"
        />
      </div>
      
      <div className="mt-4 px-2">
        {SidebarLinks.map((link) => {
          return (
            <div
              key={link.label}
              className="flex items-center mb-1 p-3 rounded-lg group cursor-pointer transition-all duration-200 hover:bg-gray-100 space-x-3"
              onClick={() => handleSidebar(link.label)}
            >
              <div className="group-hover:scale-110 transition-all duration-200 w-5 h-5">
                {link.icon}
              </div>
              <p className="text-sm font-medium align-middle">{link.label}</p>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

export default LeftSidebar