'use client';  // This forces it to be a CLIENT-SIDE component
import Image from 'next/image'
import React, { useState } from 'react'
import PasswordInput from './passwordInput'
import LoadingButton from '../Helper/LoadingButton'
import { BASE_API_URL } from '@/server';
import axios from 'axios';
import { handleAuthRequest } from '../utils/apiRequest';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

interface SignupFormData {
  
  email: string;
  password: string;
}

const Login = () => {

  const dispatch= useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginReq = async () => {
      console.log('Submitting form with data:', formData);
      return await axios.post(`${BASE_API_URL}/users/login`, formData, {withCredentials: true,});
    };
    
    const response = await handleAuthRequest(loginReq, setIsLoading);
    if (response) {
      console.log('Login successful:', response);
      dispatch(setAuthUser(response.data.data.user));
      toast.success('Account created successfully! Welcome!');
      
      // Add debugging
      console.log('About to redirect to home page...');
      console.log('Current URL:', window.location.href);
      
      router.push("/");
      console.log('Router.push executed');
      
      
    } else {
      console.log('Login failed - response was null');
    }
    
  };

  return (
    <div className="w-full h-screen overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 h-full">
            {/* Banner */}
            <div className="lg:col-span-4 h-screen hidden lg:block">
                <Image 
                    src="/images/signup-banner.jpg" 
                    alt="signup" 
                    width={1000} 
                    height={1000}
                    className="w-full h-full object-cover" 
                />
            </div>
            
            {/* Form Section */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen px-8">
                <h1 className="font-bold text-xl sm:text-2xl text-center uppercase mb-8">
                    Login with <span className="text-blue-300">Instafake</span>
                </h1>
                <form className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]" onSubmit={handleSubmit}>
                    
                    <div className="mb-4">
                        <label htmlFor="email" className="font-semibold mb-2 block">
                            Email
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input 
                            type="email" 
                            id="email"
                            name="email" 
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none focus:ring-2 focus:ring-rose-500" 
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div className="mb-4">
                    <PasswordInput 
                        label="Password"
                        placeholder="Enter your password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <div className="text-right mt-2">
                      <a
                        href="/auth/forget-password"
                        className="text-sm text-rose-500 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    </div>                    
                    {/* Submit Button */}
                    <div className="mt-6">
                        <LoadingButton
                            type="submit"
                            loading={isLoading}
                            loadingText="Creating Account..."
                        >
                            Login Now
                        </LoadingButton>
                    </div>
                    
                    {/* Signup Link */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Dont have an account?{' '}
                            <a 
                                href="/auth/signup" 
                                className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors duration-200"
                            >
                                Signup here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login