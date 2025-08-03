'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ImageIcon, X } from 'lucide-react';
import { RootState } from '@/store/store';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import { addPost } from '@/store/postSlice';
import { toast } from 'sonner';

interface CreatePostModelProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const CreatePostModel: React.FC<CreatePostModelProps> = ({ isOpen, onClose, onPostCreated }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage('');
  };

  const handleCreatePost = async () => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    if (!currentUser) {
      toast.error('Please log in to create a post');
      return;
    }

    setIsCreating(true);

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('caption', caption);

    const createPostReq = async () => {
      return await axios.post(`${BASE_API_URL}/posts/create-post`, formData, {
        withCredentials: true,
      });
    };

    const result = await handleAuthRequest(createPostReq, setIsCreating);

    if (result) {
      const newPost = result.data.data.post;
      
      // Add the new post to Redux store (at the beginning of posts array)
      dispatch(addPost(newPost));
      
      toast.success('Post created successfully!');
      // Reset form
      resetForm();
      onClose();
      
      // Call callback to refresh posts if provided
      if (onPostCreated) {
        onPostCreated();
      }
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreviewImage('');
    setCaption('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share a moment with your followers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={currentUser.profilePicture} alt={currentUser.userName} />
              <AvatarFallback>
                {currentUser.userName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{currentUser.userName}</p>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            {!previewImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-gray-600 mb-2">Upload a photo</p>
                    <label className="inline-block">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>
                          Select from device
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={400}
                  height={256}
                  className="w-full max-h-64 object-cover rounded-lg"
                  unoptimized
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={500}
            />
            <p className="text-sm text-gray-500 text-right">
              {caption.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={!selectedImage || isCreating}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isCreating ? 'Creating...' : 'Share Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModel;