'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import LoadingButton from '../Helper/LoadingButton';
import { BASE_API_URL } from '@/server';
import axios from 'axios';
import { handleAuthRequest } from '../utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';
import { RootState } from '@/store/store';

const Verify = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user= useSelector((state: RootState) => state.auth.user);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated
        if (!user) {
          router.replace('/auth/login');
        } else if( user && user.isVerified){
        router.replace('/');
        }
        else {
        setIsPageLoading(false);
        }
    }, [user, router]);

  // Create ref callback to avoid inline function issues
  const setInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single character
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter a complete 6-digit OTP');
      return;
    }

    const verifyReq = async () => {
      return await axios.post(`${BASE_API_URL}/users/verify`, 
        { otp: otpCode }, 
        { withCredentials: true }
      );
    };

    const response = await handleAuthRequest(verifyReq, setIsLoading);
    if (response) {
      dispatch(setAuthUser(response.data.data.user));
      toast.success('Account verified successfully!');
      router.push('/');
    }
  };

  const handleResendOtp = async () => {
    const resendReq = async () => {
      return await axios.post(`${BASE_API_URL}/users/resend-otp`, {}, 
        { withCredentials: true }
      );
    };

    const response = await handleAuthRequest(resendReq, setIsResending);
    if (response) {
      toast.success('OTP sent successfully!');
      setTimeLeft(300); // Reset timer
      setOtp(['', '', '', '', '', '']); // Clear OTP inputs
      inputRefs.current[0]?.focus(); // Focus first input
    }
  };

  if(isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a 6-digit verification code to your email address
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter Verification Code
            </label>
            
            {/* OTP Input Fields */}
            <div className="flex justify-center space-x-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={setInputRef(index)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="0"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in: <span className="font-semibold text-red-500">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-500 font-semibold">
                  OTP has expired. Please request a new one.
                </p>
              )}
            </div>

            {/* Verify Button */}
            <LoadingButton
              type="submit"
              loading={isLoading}
              loadingText="Verifying..."
              disabled={otp.join('').length !== 6}
              className="w-full"
            >
              Verify Account
            </LoadingButton>

            {/* Resend OTP */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending || timeLeft > 240} // Disable for first minute
                  className="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              </p>
            </div>

            {/* Back to Signup */}
            <div className="mt-2 text-center">
                <p className="text-xs text-gray-400">
                    <a 
                        href="/auth/signup" 
                        className="text-gray-400 hover:text-blue-800 font-semibold underline transition-colors duration-200"
                    >
                    Back to Signup
                    </a>
                </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;