import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import NewTweetAvatar from "./NewTweetAvatar";

export default function NewTweet() {

    const addTweet = async ( formData : FormData) => {
        "use server";
        console.log("submitted")
        const title = String( formData.get("title"));
        const supabase = createServerActionClient<Database>({ cookies })
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase .from('tweets').insert(({ title, user_id: user.id }))
        }
    }
    return (
        <form action={addTweet} className="w-full flex gap-4 border-b border-[rgba(1,1,1,0.1)] pb-4">
            <NewTweetAvatar />
            <div className="flex flex-col w-full items-end">
                <input name="title" className="bg-inherit w-full min-h-[5rem] flex items-start" placeholder="Write something" />
                <button className="bg-black w-20 text-white h-10 rounded-3xl flex-shrink-0 text-lg font-semibold">Post</button>
            </div>  
        </form>
    )
}