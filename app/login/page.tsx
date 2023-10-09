import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthButtonClient from '../auth-button-client'

const Login = async () => {
    const supabase = createServerComponentClient<Database>({ cookies })

    const { data: {session }} = await supabase.auth.getSession();

    if (session) {
        redirect("/login")
    }

  return (
    <AuthButtonClient session={session} />
  )
}

export default Login