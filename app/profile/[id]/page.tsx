import Profile from '@/components/Profile/Profile';
import React from 'react'

interface PageProps {
  params: Promise<{ id: string }>;
}

const ProfilePage = async ({ params }: PageProps) => {
//   console.log('Profile ID:', params.id);
  const { id } = await params;
    

  return (
    <Profile id={id} />
  )
}

export default ProfilePage