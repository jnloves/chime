import UserImage from "./UserImage"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import UserTweets from "./UserTweets"


export default async function Page({
    params,
    searchParams,
  }: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
    
    const supabase = createServerComponentClient<Database>({ cookies });


    let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', params.slug)

    if (error) {
        throw error
    } else {
        console.log(profile)
    }

    let { data: tweets } = await supabase
        .from("tweets")
        .select("*")
        .eq("user_id", profile![0].id)
    
    if (tweets === null) {
        console.log("error getting tweets")
        //console.log(tweets)
    } else {
        //console.log(tweets)
    }




    return (
        <div className="w-screen flex flex-col items-center">
            <div className="w-full max-w-[40rem] flex flex-col relative">
                <div className="w-full h-40 bg-slate-400 relative">
                    <UserImage user={params.slug} />
                </div>
                <div className="pt-12 flex flex-col">
                    <h1>{profile![0].name}</h1>
                    <h2>{params.slug}</h2>
                </div>
                <UserTweets userTweets={tweets} />

            </div>


        </div>

    )
  }