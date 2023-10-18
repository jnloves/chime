import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthButtonServer from './auth-button-server';
import { redirect } from 'next/navigation';
import NewTweet from './new-tweet';
import Likes from './likes';
import Tweets from './Tweets';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: { session }} = await supabase.auth.getSession()
  //console.log(session?.user.id)

  if ( !session ) {
    redirect('/login')
  }
  const { data } = await supabase.from('tweets').select('*, author: profiles(*), likes(user_id)')

  const tweets = data?.map(tweet => ({
    ...tweet, 
    author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
    user_has_liked_tweet: !!tweet.likes.find(like => like.user_id === session.user.id), 
    likes: tweet.likes.length,
  })) ?? [];


  return (
    <div className='w-full px-4 max-w-[35rem] flex flex-col items-center'>
      <AuthButtonServer />
      <div className='h-20'></div>
      <NewTweet userID={session.user.id} />
      <Tweets tweets={tweets} />

    </div>
  )
}
