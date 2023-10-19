'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'

interface TweetProps {
    content: any; 
    name: string | null; 
    username: string;
    avatarUrl: string;
}

const Tweet = ( { content, name, username, avatarUrl } : TweetProps) => {
    //console.log(content)
    return (
        <div className='hover:bg-[rgba(1,1,1,0.05)] border-t border-[rgba(1,1,1,0.1)] flex gap-4 p-4' >

            <div className='bg-center bg-cover w-12 h-12 rounded-full flex-shrink-0' style={{backgroundImage: `url(${avatarUrl})`}}></div>

            <div className='flex flex-col w-full'>
                <div className='flex gap-2 items-center'>
                    <p className='font-semibold'>{name}</p>
                    <p className='text-[rgba(1,1,1,0.3)] text-sm'>@{username}</p>
                </div>
                <div>
                    {content.title}
                </div>
            </div>
        </div>
    )

}

interface UserTweetsProps {
    userTweets: any;
    name: string | null;
    username: string;
    avatarUrl: string;
}

const UserTweets = ( { userTweets, name, username, avatarUrl } : UserTweetsProps) => {
    const supabase = createClientComponentClient<Database>();
    //console.log('hi')
    console.log(userTweets)

    const downloadImage =  (path : string) => {
        const { data } =  supabase.storage.from('avatars').getPublicUrl(path)
  
          //console.log(data)
          return data.publicUrl;
    }

    const path = downloadImage(avatarUrl);

  return (
    <div className=''>
        {userTweets.map((tweet : any) => (
            <Tweet key={tweet.id} content={tweet} name={name} username={username} avatarUrl={path} />
        ))}
    </div>
  )
}

export default UserTweets