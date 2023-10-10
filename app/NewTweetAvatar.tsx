'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

const NewTweetAvatar = () => {
    const supabase = createClientComponentClient<Database>();
    const [ avatarURl, setAvatarURL ] = useState("");

    useEffect(() => {
        async function downloadImage() {
            const { data: { user } } = await supabase.auth.getUser()
            setAvatarURL(user?.user_metadata.avatar_url)
            //console.log(user)
    
          try {
            const { data, error } = await supabase.storage.from('avatars').download(avatarURl)
            if (error) {
                setAvatarURL(user?.user_metadata.avatar_url)
    
              throw error
            }
    
            const url = URL.createObjectURL(data)
            if (url) {
                console.log(!!url)
                setAvatarURL(url);
            } else {
                //setAvatarUrl(user?.user_metadata.avatar_url)
            }
            //setAvatarUrl(url)
          } catch (error) {
            console.log('Error downloading image: ', error)
          }
        }
    
        if (avatarURl) downloadImage();
      }, [])

  return (
    <Image 
        src={!!avatarURl ? avatarURl : "https://picsum.photos/200"} 
        alt='profile picture' width={50} height={50}
        className='rounded-full w-12 h-12 mt-4'
    />
  )
}

export default NewTweetAvatar