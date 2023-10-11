'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

const NewTweetAvatar = () => {
    const supabase = createClientComponentClient<Database>();
    const [ avatarURL, setAvatarURL ] = useState("");

    useEffect(() => {

        async function downloadImage() {
            const { data: { user } } = await supabase.auth.getUser()

            const userID = user?.id;

            const { data: profiles, error } = await supabase
            .from('profiles')
            .select("*")
            .eq("id", String(userID));

            //const url = URL.createObjectURL(profiles![0].avatar_url)
            const path = profiles![0].avatar_url;

            //setAvatarURL(profiles![0].avatar_url)
            console.log(profiles![0].avatar_url)
    
          try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
            if (error) {
                //setAvatarURL(profiles![0].avatar_url)
                console.log('hi')
    
              throw error
            }
    
            const url = URL.createObjectURL(data)
            if (url) {
                console.log(!!url)
                console.log(url)
                setAvatarURL(url);
            } else {
                //setAvatarUrl(user?.user_metadata.avatar_url)
            }
            //setAvatarUrl(url)
          } catch (error) {
            console.log('Error downloading image: ', error)
          }
        }
    
        downloadImage();
      }, [supabase])

      console.log(avatarURL)

  return (

    <Image 
        src={!!avatarURL ? avatarURL : "https://picsum.photos/200"} 
        alt='profile picture' width={50} height={50}
        className='rounded-full w-12 h-12 mt-4  flex-shrink-0'
    />
  )
}

export default NewTweetAvatar