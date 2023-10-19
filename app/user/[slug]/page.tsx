import UserImage from "./UserImage"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import UserTweets from "./UserTweets"
import Link from "next/link"
import { FaArrowLeft }  from "react-icons/fa";
import UserCover from "./UserCover"


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
        <div className="w-screen flex flex-col items-center relative">
            <Link href="/" className="absolute top-4 left-4 z-[1000]"><FaArrowLeft size={32} color="black" /></Link>
            <div className="w-full max-w-[40rem] flex flex-col relative">
                <UserCover user={params.slug} />
                <div className="pt-12 pb-12 pl-8 flex flex-col">
                    <h1 className="font-semibold text-2xl">{profile![0].name}</h1>
                    <h2 className="font-light text-neutral-500 text-sm">@{params.slug}</h2>
                </div>
                <UserTweets userTweets={tweets} name={profile![0].name} username={params.slug} avatarUrl={profile![0].avatar_url} />

            </div>


        </div>

    )
  }