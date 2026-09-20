'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
export async function signup(formData:FormData){const supabase=await createClient();const {error}=await supabase.auth.signUp({email:String(formData.get('email')),password:String(formData.get('password')),options:{data:{username:String(formData.get('username'))}}});if(error)redirect('/signup?error=signup_failed');redirect('/login?message=check_email')}
