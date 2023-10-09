import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import { cookies } from 'next/headers'
import AuthButtonClient from './auth-button-client'

const AuthButtonServer = async () => {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data : {session} } = await supabase.auth.getSession();
  return (
    <AuthButtonClient  session={session}/>
  )
}

export default AuthButtonServer