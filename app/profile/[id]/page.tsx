import Profile from '@/components/Profile/Profile';
import React from 'react'

const ProfilePage = async ({params} : {params : {id:string}}) => {
//   console.log('Profile ID:', params.id);
  const { id } = await params;
    

  return (
    <Profile id={id} />
  )
}

export default ProfilePage