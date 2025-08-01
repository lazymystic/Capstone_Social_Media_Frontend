'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import LoadingButton from '../Helper/LoadingButton';
import PasswordInput from './passwordInput';
import { BASE_API_URL } from '@/server';
import axios from 'axios';
import { handleAuthRequest } from '../utils/apiRequest';

interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
  passwordConfirm: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ResetPasswordData>({
    email: '',
    otp: '',
    password: '',
    passwordConfirm: ''
  });

  // Get email from query parameters on component mount
  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setFormData(prev => ({
        ...prev,
        email: emailFromQuery
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error('Email address is required');
      return false;
    }

    if (!formData.otp.trim()) {
      toast.error('Please enter the OTP sent to your email');
      return false;
    }

    if (formData.otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return false;
    }

    if (!formData.password) {
      toast.error('Please enter a new password');
      return false;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const resetPasswordReq = async () => {
      console.log('Submitting reset password request:', {
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm
      });
      
      return await axios.post(`${BASE_API_URL}/users/reset-password`, formData, {
        withCredentials: true,
      });
    };

    const response = await handleAuthRequest(resetPasswordReq, setIsLoading);
    if (response) {
      console.log('Password reset successful:', response);
      toast.success('Password reset successfully! You can now login with your new password.');
      // Redirect to login page
      router.push('/auth/login');
    }
  };

  const handleBackToForgetPassword = () => {
    router.push('/auth/forget-password');
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
            Enter the OTP sent to your email and create a new password
          </p>
          {formData.email && (
            <p className="mt-1 text-sm font-medium text-blue-600">
              {formData.email}
            </p>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Field (readonly if from query) */}
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
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              readOnly={!!searchParams.get('email')}
            />
          </div>

          {/* OTP Field */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Reset Password OTP
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={formData.otp}
              onChange={handleInputChange}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-center text-lg font-semibold tracking-widest"
            />
            <p className="mt-1 text-xs text-gray-500">
              Check your email for the 6-digit verification code
            </p>
          </div>

          {/* New Password */}
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          {/* Confirm New Password */}
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            name="passwordConfirm"
            id="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            required
          />

          {/* Submit Button */}
          <div>
            <LoadingButton
              type="submit"
              loading={isLoading}
              loadingText="Resetting Password..."
              className="w-full"
            >
              Reset Password
            </LoadingButton>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2 text-center">
            <button
              type="button"
              onClick={handleBackToForgetPassword}
              className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer"
            >
              Didn&apos;t receive OTP? Request new one
            </button>
            
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

export default ResetPassword;