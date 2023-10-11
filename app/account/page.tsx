import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/database.types'
import AccountForm from './account-form'
import { FaArrowLeft }  from "react-icons/fa";
import Link from 'next/link';
import ConfirmEmail from './ConfirmEmail';

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return <ConfirmEmail />

  return (
    <>
    <Link href="/" className='absolute top-4 left-4'>
      <FaArrowLeft size={32} color="grey" />
    </Link>
    <AccountForm session={session} />
    </>
  ) 
}