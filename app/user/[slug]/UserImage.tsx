'use client';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { setuid } from 'process';
import React, { useEffect, useState } from 'react'

interface UserProps {
    user: string
}

const UserImage = ({ user } : UserProps) => {
    const supabase = createClientComponentClient<Database>();

    const [ userImageURL, setUserImageURL ] = useState<any | string>("");
    const [ avatarImage , setAvatarImage ] = useState<any>("");
    

    useEffect(() => {

        const getProfile = async () => {
            let { data: profile, error } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('username', user)

            if (error || (!profile)) {
                throw error;
            } else {
                //console.log(profile[0].avatar_url)
                setUserImageURL(profile[0].avatar_url)

                const { data, error } = await supabase.storage.from('avatars').download(profile[0].avatar_url)
                
                if (error) {
                    throw error;
                } else {
                    const url = URL.createObjectURL(data);
                    setAvatarImage(url);
                }
            }
        }
        getProfile();

    }, [supabase, user])


  return (
    <div 
        className='w-24 h-24 rounded-full absolute -bottom-12 left-4 bg-center bg-cover border-4 border-white'
        style={{ backgroundImage: `url(${avatarImage})`}}
    >
    </div>
  )
}

export default UserImage