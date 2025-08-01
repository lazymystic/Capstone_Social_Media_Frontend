'use client'
import { RootState } from '@/store/store';
import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const user=useSelector((state: RootState) => state.auth.user);
  console.log('User in Home:', user);
  return (
    <div>Home</div>
  )
}

export default Home