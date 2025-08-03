'use client'
import { RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import { Loader, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import { handleAuthRequest } from '../utils/apiRequest';

const Home = () => {
  const router = useRouter();
  const dispatch= useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  // console.log('User in Home:', user);]
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  
  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const getAuthUserReq = async () => await axios.get(`${BASE_API_URL}/users/me`, { withCredentials: true }); 
        const result = await handleAuthRequest(getAuthUserReq, setIsLoading);
        if (result) {
          dispatch(setAuthUser(result.data.data.user));
        } else {
          // console.log('User not authenticated, redirecting to login');
          router.push('/auth/login');
        }
      } catch {
        // console.log('Authentication failed, redirecting to login');
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    }
    getAuthUser();
  }, [dispatch, router]);

  // Show loading while checking authentication or if user is not loaded yet
  if (isLoading || isCheckingAuth || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
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
      <Feed />
      </div>
      <div className="w-[30%] pt-8 px-6 lg:block hidden">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Home