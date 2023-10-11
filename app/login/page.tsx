import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import { redirect } from 'next/navigation'
import AuthButtonClient from '../auth-button-client'

const Login = async () => {
    const supabase = createServerComponentClient<Database>({ cookies })

    const { data: {session }} = await supabase.auth.getSession();

    if (session) {
        redirect("/login")
    }

  return (
    <div className='w-screen h-screen flex items-start justify-center'>
      <AuthButtonClient session={session} />
    </div>
  )
}

export default Login