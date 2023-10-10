'use client'
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs'
import { sign } from 'crypto';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'

const AuthButtonClient = ({ session } : { session: Session | null  ;}) => {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();

    const handleSignUp = async (formdata : FormData) => {
        const formName = String(formdata.get("name"))
        const formUsername = String(formdata.get("username"))
        const formEmail = String(formdata.get("email"))
        const formPassword = String(formdata.get("password"))

        const { data, error } = await supabase.auth.signUp({
            email: formEmail,
            password: formPassword,
        })

        if (error) {
            throw error;
        } else {
            redirect("/account");
        }
    }

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: 'http://localhost:3000/auth/callback'
            }
        })
    }

    async function signInWithEmail( formdata : FormData) {

        const formEmail = String(formdata.get("email"))
        const formPassword = String(formdata.get("password"))
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formEmail,
          password: formPassword,
        })

        if (error) {
            throw  error;
        } else {
            redirect('/');
        }
      }
      
      
    //console.log(!!session)

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }
  return !session ? (
    <div className='flex flex-col'>
        <button onClick={handleSignIn}>Login with Github</button>

        <form action={signInWithEmail} className='flex flex-col'>
            <input name='email' type='email' className='border border-black' placeholder='email' required />
            <input name='password' type='text' className='border border-black' placeholder='password' required />
            <button>Login with Email</button>
        </form>

        <form action={handleSignUp} className='flex flex-col'>
            <input name='email' type='email' className='border border-black' placeholder='email' required />
            <input name='password' type='text' className='border border-black' placeholder='password' required />
            <button>Sign up with Email</button>
        </form>
    </div>
  ) : (
        <div className='w-[100vw] h-16 max-w-[35rem] border-b border-[rgba(1,1,1,0.1)] flex justify-end items-center px-4 fixed top-0 left-0 bg-transparent backdrop-blur-md'>
            <Link href="/account" className=''>Profile</Link>
        </div>
  )
}
{/*<button onClick={handleSignOut}>Logout</button>*/}

export default AuthButtonClient