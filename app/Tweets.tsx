'use client';
import React, { useEffect } from 'react'
import Likes from './likes'
import { experimental_useOptimistic as useOptimistic } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Tweets =  ({ tweets } : { tweets: TweetWithAuthor[]}) => {
    const [optimisticTweets, addOptimisticTweet ] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
        tweets, 
        (currentOptimisticTweets, newTweet) => {
            const newOptimisticTweets = [...currentOptimisticTweets]
            const index = newOptimisticTweets.findIndex(tweet => tweet.id === newTweet.id)
            newOptimisticTweets[index] = newTweet
            return newOptimisticTweets;
        }
    )

    const supabase = createClientComponentClient();
    const router = useRouter()

    useEffect(() => {
      const channel = supabase.channel('realtime tweets').on('postgres_changes', {
        event: "*",
        schema: 'public',
        table: 'tweets'
      }, (payload) => {
        router.refresh();
      }).subscribe();

      return () => {
        supabase.removeChannel(channel);
      }
    }, [supabase, router])

    const getAllImages = async () => {
      const { data, error } = await supabase
      .storage
      .from('avatars')
      .list('', {
        limit: 100,
      })

      //console.log(data);
    }

    //getAllImages();




    const downloadImage =  (path : string) => {
      const { data } =  supabase.storage.from('avatars').getPublicUrl(path)

        //console.log(data)
        return data.publicUrl;
      }
    





  return optimisticTweets.map((tweet) => (
        <div key={tweet.id} className='flex w-full justify-start py-2 gap-4'>
          <div className='flex-shrink-0'>
            { !!tweet.author.avatar_url ? (
                <Image src={downloadImage(tweet.author.avatar_url)} width={50} height={50} alt='profile pic' className='rounded-full' />
            ) : (
              <Image src={"https://picsum.photos/200"} width={50} height={50} alt='profile pic' className='rounded-full' />
            )

              //(downloadImage(tweet.author.avatar_url))  ? (
                //@ts-ignore
              //): (
                //<Image src={tweet.author.avatar_url} width={50} height={50} alt='profile pic' className='rounded-full' />
              //)

            }
          </div>

          <div>
            <p>
              {tweet.author.name} {tweet.author.username} 
            </p>
            <p>{tweet.title}</p>
            <Likes tweet={tweet}  addOptimisticTweet={addOptimisticTweet} />
          </div>

        </div>
  ))
}

export default Tweets