'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React, {useEffect, useState} from 'react'
import { AiFillHeart } from 'react-icons/ai';


const Likes =  ({ tweet, addOptimisticTweet } : {tweet:  TweetWithAuthor; addOptimisticTweet: (newTweet: TweetWithAuthor) => (void)}) => {
    const [ liked, setLiked ] = useState(tweet.user_has_liked_tweet);
    const router = useRouter();
    const supabase = createClientComponentClient<Database>();
    //console.log(tweet)

    const handleLikes = async () => {
        setLiked(!liked);
        const supabase = createClientComponentClient<Database>()
        const { data: {user}} = await supabase.auth.getUser();
        if (user) {
            if (tweet.user_has_liked_tweet) {
                addOptimisticTweet({
                    ...tweet,
                    likes: tweet.likes - 1,
                    user_has_liked_tweet: !tweet.user_has_liked_tweet, 
                })
                await supabase.from('likes').delete().match({ user_id: user.id, tweet_id: tweet.id})
            } else {
                addOptimisticTweet({
                    ...tweet,
                    likes: tweet.likes + 1,
                    user_has_liked_tweet: !tweet.user_has_liked_tweet, 
                })
                await supabase.from('likes').insert({ user_id: user.id, tweet_id: tweet.id});
            }
            router.refresh();
        }
    }
  return (

    <button onClick={handleLikes} className='flex transition-all duration-150 items-center text-lg gap-1'>{tweet.likes} <AiFillHeart color={liked ? "red" : "grey"} size={20} /></button>
  )
}

export default Likes