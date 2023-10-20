'use client'
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs'
import { sign } from 'crypto';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaGithub } from "react-icons/fa";
import { BsArrowRightCircle, BsArrowRight, BsArrowDownCircle } from "react-icons/bs"
import Image from 'next/image';
import { CgProfile } from "react-icons/cg";


const AuthButtonClient = ({ session } : { session: Session | null  ;}) => {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();

    const [ showEmailLogin, setShowEmailLogin ] = useState(false);
    const [ vis, setVis ] = useState(false);
    const [ vis1, setVis1 ] = useState(false);
    const [ incorrectLogin, setIncorrectLogin ] = useState(false);
    const [ incorrectPwLen , setIncorrectPwLen ] = useState(false);


    const handleSignUp = async (formdata : FormData) => {
        const formName = String(formdata.get("name"))
        const formUsername = String(formdata.get("username"))
        const formEmail = String(formdata.get("email"))
        const formPassword = String(formdata.get("password"))

        const { data, error } = await supabase.auth.signUp({
            email: formEmail,
            password: formPassword,
            options: {
                
            }
        })

        if (formPassword.length < 6) {
            setIncorrectPwLen(true);
        } else if (error) {
            console.log(error)
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
            setIncorrectLogin(true);
            setTimeout(() => {
                setIncorrectLogin(false);
                redirect('/');
            }, 1500);
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
    <div className='flex flex-col py-8 px-12 gap-24 h-[80vh] w-full items-center pt-24 bg-white'>

        <div className={`fixed top-0 left-0 w-screen h-screen bg-[rgba(1,1,1,0.5)] flex items-center justify-center z-[100] backdrop-blur-md transition-all duration-300 ${incorrectLogin ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className='w-screen h-[100vw] max-w-[20rem] max-h-[10rem] bg-white rounded-lg flex items-center justify-center'>Incorrect login credentials.</div>
        </div>

        <div className='flex flex-col gap-8'>

            <div className={`w-full max-w-[20rem] md:max-w-[30rem] border  rounded-xl overflow-hidden relative transition-all duration-300 flex justify-center ${vis ? "h-60" : "!h-12"} ${incorrectPwLen ? "border-red-400 h-72" : "border-[rgba(1,1,1,0.1)]"}`}>
                <div className='absolute left-0 top-0 w-full h-12  bg-[rgba(1,1,1,0.1)] flex items-center justify-center cursor-pointer gap-4' onClick={()  => setVis(!vis)}>Sign Up <span className={`transition-all duration-300 ${vis ? "-rotate-180" : "rotate-0"}`}><BsArrowDownCircle size={24} color="black" /></span></div>
                <form action={handleSignUp} className={`flex flex-col gap-4 relative top-16`}>
                    <input name='email' type='email' className='border-b border-black' placeholder='email' required />
                    <input name='password' type='text' className='border-b border-black' placeholder='password' required />
                    <div className={`text-red-400 text-sm text-center ${incorrectPwLen ? "block" : "hidden"}`}>Please make sure your password is at least 6 characters</div>
                    <button className='rounded-xl w-[15rem] bg-[rgba(1,1,1,0.1)] mx-auto justify-around items-center py-2 flex'>Sign up with Email <BsArrowRight size={32} color="black" /></button>
                </form>
            </div>

            <div className={`w-screen max-w-[20rem] md:max-w-[30rem] border border-[rgba(1,1,1,0.1)] rounded-xl overflow-hidden relative transition-all duration-300 flex justify-center ${vis1 ? "h-60" : "h-12"}`}>
                <div className='absolute left-0 top-0 w-full h-12  bg-[rgba(1,1,1,0.1)] flex items-center justify-center cursor-pointer gap-4' onClick={()  => setVis1(!vis1)}>Sign In <span className={`transition-all duration-300 ${vis1 ? "-rotate-180" : "rotate-0"}`}><BsArrowDownCircle size={24} color="black" /></span></div>
                <form action={signInWithEmail} className='flex flex-col gap-4 relative top-16'>
                    <input name='email' type='email' className='border-b border-black' placeholder='email' required />
                    <input name='password' type='text' className='border-b border-black' placeholder='password' required />
                    <button className='flex justify-around w-[15rem] py-2 bg-[rgba(1,1,1,0.1)] rounded-xl items-center'>Login with Email <BsArrowRight size={32} color="black" /></button>
                </form>
            </div>

        </div>

        <div className='flex bg-[rgba(1,1,1,0.1)] rounded-xl w-[15rem] py-2 justify-around'>
            <button onClick={handleSignIn}>Login with Github</button>
            <FaGithub size={32} color="black" />
        </div>

        <Image src="/logo.jpg" width={1000} height={1000} alt='logo' className='w-40 h-auto mix-blend-multiply absolute left-1/2 top-[85%] -translate-x-1/2 -translate-y-[85%]'/>

    </div>
  ) : (
        <div className='w-[100vw] h-16 border-b border-[rgba(1,1,1,0.1)] flex justify-center items-center px-4 fixed top-0 left-0 bg-transparent backdrop-blur-md'>
            <div className='w-full max-w-[55rem] flex justify-end'>
                <Link href="/account" className=''><CgProfile size={44} color="black" /></Link>
            </div>
        </div>
  )
}
{/*<button onClick={handleSignOut}>Logout</button>*/}

export default AuthButtonClient