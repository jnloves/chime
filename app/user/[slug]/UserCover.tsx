'use client';
import React, { useEffect, useState } from 'react'
import UserImage from './UserImage'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Loader from '@/app/Loader';

const UserCover = ({ user } : { user: string}) => {
    const supabase = createClientComponentClient<Database>();
    const [ coverURL, setCoverURL ] = useState("");

    useEffect(() => {
        const getCoverImage = async () => {
            let { data: profile, error } = await supabase
                .from("profiles")
                .select("cover_url")
                .eq("username", user)

            if (error) {
                throw error;
            } else {
                //console.log(profile![0].cover_url)
                const { data } = supabase
                    .storage
                    .from("covers")
                    .getPublicUrl(profile![0].cover_url)
                console.log(data.publicUrl);
                setCoverURL(data.publicUrl)
            } 
        }
        getCoverImage();
    }, [supabase, user])

    if (!coverURL) return (
        <div className="w-full h-40 bg-cover bg-center relative flex items-center justify-center">
            <Loader />
            <UserImage user={user} />
        </div>
    )

  return (
        <div className="w-full h-60 bg-cover bg-center relative" style={{ backgroundImage: `url(${coverURL})`}}>
            <UserImage user={user} />
        </div>
  )
}

export default UserCover