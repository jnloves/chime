'use client'
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs'
import { sign } from 'crypto';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'
import { FaGithub } from "react-icons/fa";
import { BsArrowRightCircle, BsArrowRight } from "react-icons/bs"

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
    <div className='flex flex-col p-8 gap-12'>

        <div className='flex bg-[rgba(1,1,1,0.1)] rounded-xl w-[15rem] py-2 justify-around'>
            <button onClick={handleSignIn}>Login with Github</button>
            <FaGithub size={32} color="black" />
        </div>

        <form action={signInWithEmail} className='flex flex-col gap-4'>
            <input name='email' type='email' className='border-b border-black' placeholder='email' required />
            <input name='password' type='text' className='border-b border-black' placeholder='password' required />
            <button className='flex justify-around w-[15rem] py-2 bg-[rgba(1,1,1,0.1)] rounded-xl items-center'>Login with Email <BsArrowRight size={32} color="black" /></button>
        </form>

        <form action={handleSignUp} className='flex flex-col gap-4'>
            <input name='email' type='email' className='border-b border-black' placeholder='email' required />
            <input name='password' type='text' className='border-b border-black' placeholder='password' required />
            <button className='rounded-xl w-[15rem] bg-[rgba(1,1,1,0.1)] justify-around items-center py-2 flex'>Sign up with Email <BsArrowRight size={32} color="black" /></button>
        </form>
    </div>
  ) : (
        <div className='w-[100vw] h-16 border-b border-[rgba(1,1,1,0.1)] flex justify-center items-center px-4 fixed top-0 left-0 bg-transparent backdrop-blur-md'>
            <div className='w-full max-w-[55rem] flex justify-end'>
                <Link href="/account" className=''>Profile</Link>
            </div>
        </div>
  )
}
{/*<button onClick={handleSignOut}>Logout</button>*/}

export default AuthButtonClient