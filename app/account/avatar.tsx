'use client'
import React, { useEffect, useState } from 'react'
import { Database } from '@/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
type profiles = Database['public']['Tables']['profiles']['Row']

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string
  url: profiles['avatar_url']
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClientComponentClient<Database>()
  const [avatarUrl, setAvatarUrl] = useState<profiles['avatar_url']>(url)
  const [uploading, setUploading] = useState(false)
  console.log(avatarUrl)
  const [ defaultUrl, setDefaultUrl ] = useState();

  useEffect(() => {
    async function downloadImage(path: string) {
        const { data: { user } } = await supabase.auth.getUser()
        setDefaultUrl(user?.user_metadata.avatar_url)
        //console.log(user)

      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
            setAvatarUrl(user?.user_metadata.avatar_url)

          throw error
        }

        const url = URL.createObjectURL(data)
        if (url) {
            console.log(!!url)
            setAvatarUrl(url);
        } else {
            //setAvatarUrl(user?.user_metadata.avatar_url)
        }
        //setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: filePath })
      .eq('id', uid)
      .select()

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }
  //console.log(avatarUrl)
  const getRandomInt = () => {
    return Math.floor(Math.random() * 100);
  }

  return (
    <div 
      className='flex items-center w-60 h-60 bg-center bg-cover rounded-full overflow-hidden relative'
      style={{backgroundImage: `url(${!!avatarUrl ? avatarUrl : "https://picsum.photos/1000"})`}}
    >
      {/*avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="avatar image rounded-full"
          style={{ height: size, width: size }}
        />
      ) : (
        <Image
          width={size}
          height={size}
          src={"https://picsum.photos/200"}
          alt="Avatar"
          className="avatar image rounded-full"
          style={{ height: size, width: size }}
      />      )*/}
      <div className='text-center !w-full text-white font-semibold h-1/4 bg-[rgba(1,1,1,0.5)] py-2 absolute -bottom-2'>
        <label className="button primary block cursor-pointer" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Edit Image'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}