'use client'
import { useCallback, useEffect, useState } from 'react'
import { Database } from '@/database.types'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Avatar from './avatar'

export default function AccountForm({ session }: { session: Session | null  }) {
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  //const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const user = session?.user! 

  if (!user) return;
  
  //ensure user is something
  //if (!user) return;
  //const fixedUser = (!user) ? "" : user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`name, username, avatar_url`)
        .eq('id', user?.id)
        .single()

      console.log(data)

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setName(data.name)
        setUsername(data.username)
        //setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    //website,
    avatar_url,
  }: {
    username: string | null
    name: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      let { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        name,
        username,
        avatar_url,
        //updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full p-8 items-center">
      <Avatar
        uid={user.id}
        url={avatar_url}
        size={200}
        onUpload={(url) => {
        setAvatarUrl(url)
        updateProfile({ name, username, avatar_url: url })
        }}
      />
      <div className='w-full flex flex-col gap-2 text-sm'>
        <div className='flex justify-between'>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" className='brightness-50 opacity-50' value={session?.user.email} disabled />
        </div>
        <div className='flex justify-between'>
          <label htmlFor="fullName">Full Name</label>
          <input
            className='w-1/2 border-b border-[rgba(1,1,1,0.1)] truncate'
            id="fullName"
            type="text"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className=' flex justify-between'>
          <label htmlFor="username">Username</label>
          <input
            className='w-1/2 border-b border-[rgba(1,1,1,0.1)] truncate'
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className='flex flex-col h-[25vh] relative'>
          <button
            className="button primary block border border-[rgba(1,1,1,0.2)] px-4 py-2 rounded-xl w-fit self-end"
            onClick={() => updateProfile({ name, username, avatar_url })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update Profile'}
          </button>
          <form action="/auth/signout" method="post" className='absolute bottom-0 right-0'>
            <button className="button block border border-[rgba(1,1,1,0.2)] px-4 py-2 rounded-xl" type="submit">
              Sign out
            </button>
          </form>
        </div>

      </div>

    </div>
  )
}