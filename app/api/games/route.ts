import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
export async function POST(request:Request){const {supabase,user}=await requireUser();const form=await request.formData();const {error}=await supabase.from('games').insert({creator_id:user.id,title:String(form.get('title')),description:String(form.get('description')),code:String(form.get('code')),status:'pending'});if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.redirect(new URL('/dashboard',request.url))}
