import UserImage from "./UserImage"


export default function Page({
    params,
    searchParams,
  }: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }) {



    return (
        <div className="w-screen flex flex-col items-center">
            <div className="w-full max-w-[40rem] border border-black flex flex-col relative">
                <div className="w-full h-40 bg-slate-400 relative">
                    <UserImage user={params.slug} />
                </div>
                <div className="pt-12 flex flex-col">
                    <h1>{params.slug}</h1>
                </div>

            </div>


        </div>

    )
  }