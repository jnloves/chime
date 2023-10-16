import React from 'react'

interface TweetProps {
    content: any; 
    name: string; 
    username: string;
}

const Tweet = ( { content, name, username } : TweetProps) => {
    //console.log(content)
    return (
        <div className='hover:bg-[rgba(1,1,1,0.05)] border-t border-[rgba(1,1,1,0.1)] flex gap-4 p-4' >

            <div className='bg-slate-500 w-12 h-12 rounded-full flex-shrink-0'></div>

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
    name: string;
    username: string;
}

const UserTweets = ( { userTweets, name, username } : UserTweetsProps) => {
    //console.log('hi')
    console.log(userTweets)

  return (
    <div className=''>
        {userTweets.map((tweet : any) => (
            <Tweet key={tweet.id} content={tweet} name={name} username={username} />
        ))}
    </div>
  )
}

export default UserTweets