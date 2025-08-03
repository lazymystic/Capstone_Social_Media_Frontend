'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ArrowLeft, Camera, MenuIcon } from 'lucide-react';
import { RootState } from '@/store/store';
import { setAuthUser } from '@/store/authSlice';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import LeftSidebar from '../Home/LeftSidebar';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet';
import { toast } from 'sonner';

const EditProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  const [bio, setBio] = useState(currentUser?.Bio || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(currentUser?.profilePicture || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    // setIsUpdatingProfile(true);

    const formData = new FormData();
    formData.append('Bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    const updateProfileReq = async () => {
      return await axios.post(`${BASE_API_URL}/users/edit-profile`, formData, {
        withCredentials: true,
      });
    };

    const result = await handleAuthRequest(updateProfileReq, setIsUpdatingProfile);

    if (result) {
      const updatedUser = result.data.data.user;
      dispatch(setAuthUser(updatedUser));
      toast.success('Profile updated successfully!');
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser) return;

    // setIsChangingPassword(true);

    const changePasswordReq = async () => {
      return await axios.post(`${BASE_API_URL}/users/change-password`, {
        currentPassword,
        newPassword,
        newPasswordConfirm: confirmPassword,
      }, {
        withCredentials: true,
      });
    };

    const result = await handleAuthRequest(changePasswordReq, setIsChangingPassword);

    if (result) {
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Please log in to edit your profile</div>
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

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold">Edit Profile</h1>
          </div>

          {/* Profile Picture Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={previewImage} alt={currentUser.userName} />
                  <AvatarFallback className="text-xl">
                    {currentUser.userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="font-medium">{currentUser.userName}</p>
                <p className="text-sm text-gray-500">Click the camera icon to change your profile picture</p>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Bio</h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              maxLength={150}
            />
            <p className="text-sm text-gray-500 mt-2">{bio.length}/150 characters</p>
            
            <Button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                />
              </div>
              
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;