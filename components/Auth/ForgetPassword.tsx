'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoadingButton from '../Helper/LoadingButton';
import { BASE_API_URL } from '@/server';
import axios from 'axios';
import { handleAuthRequest } from '../utils/apiRequest';

const ForgetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const forgetPasswordReq = async () => {
      // console.log('Sending forget password request for:', email);
      return await axios.post(`${BASE_API_URL}/users/forget-password`, 
        { email }
      );
    };

    const response = await handleAuthRequest(forgetPasswordReq, setIsLoading);
    if (response) {
      // console.log('Forget password request successful:', response);
      toast.success('Password reset OTP sent to your email!');
      // Redirect to reset password page
      router.push('/auth/reset-password?email='+encodeURIComponent(email));
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you OTP to reset your password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <LoadingButton
              type="submit"
              loading={isLoading}
              loadingText="Sending Reset Otp..."
              className="w-full"
            >
              Send Reset Otp
            </LoadingButton>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors cursor-pointer"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;