'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Loader from './Loader';

interface NTAProps {
  userID: string;
}

const NewTweetAvatar = ({ userID } : NTAProps) => {
    const supabase = createClientComponentClient<Database>();
    const [ avatarURL, setAvatarURL ] = useState("");

    useEffect(() => {

        async function downloadImage() {
            //const { data: { user } } = await supabase.auth.getUser()
            //const userID = user?.id;

            const { data: profiles, error } = await supabase
            .from('profiles')
            .select("avatar_url")
            .eq("id", userID);

            //const url = URL.createObjectURL(profiles![0].avatar_url)
            const path = profiles![0].avatar_url;
            console.log(path);
            if (!path) {
              let { data } = supabase.storage.from("avatars").getPublicUrl("coon");
              setAvatarURL(data.publicUrl);
            } else {
              let { data } = supabase.storage.from("avatars").getPublicUrl(path);
              setAvatarURL(data.publicUrl);
            }

            //setAvatarURL(profiles![0].avatar_url)
            //console.log(profiles![0].avatar_url)
          /*
          try {
            let { data, error } = await supabase.storage.from('avatars').download(path)
            let url;
            if (error) {
                //setAvatarURL(profiles![0].avatar_url)
                console.log('hi')
                let { data } = supabase.storage.from("avatars").getPublicUrl("coon");
                setAvatarURL(data.publicUrl);
            } else {
              url = URL.createObjectURL(data!)
              setAvatarURL(url)
            }

          } catch (error) {
            console.log('Error downloading image: ', error)
          }*/
        }
        
        setTimeout(() => {
          downloadImage();
        }, 1000);
        //downloadImage();
      }, [supabase])

      //console.log(avatarURL)

      if (!avatarURL) return <Loader />

  return (
        <Image 
        src={avatarURL} 
        alt='profile picture' width={50} height={50}
        className='rounded-full w-12 h-12 mt-4  flex-shrink-0'
      />
  )
}

export default NewTweetAvatar