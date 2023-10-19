'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, {useEffect, useState} from 'react'
import Loader from '../Loader';

const CoverImage = ({ userID } : { userID : string}) => {
    const supabase = createClientComponentClient<Database>();
    const [ coverURL, setCoverURL ] = useState("");

    useEffect(() => {
        
        const getCoverImage = async () => {
            const { data } = supabase
                .storage
                .from("covers")
                .getPublicUrl("cooncover")
            
            setCoverURL(data.publicUrl);
        }

        getCoverImage();
    }, [])

    if (!coverURL) return (
        <div className='w-screen md:w-full h-[15rem] bg-white relative -top-12 flex-shrink-0 flex justify-center items-center'>
            <Loader />
        </div>
    )

  return (
    <div 
        className='w-screen md:w-full h-[15rem] relative -top-12 flex-shrink-0 bg-center bg-cover'
        style={{ backgroundImage: `url(${coverURL})`}}
    ></div>
  )
}

export default CoverImage