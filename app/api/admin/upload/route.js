import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {isAdminRequest} from '../../../../lib/admin-auth';
import {catalogConfigured,storageHeaders} from '../../../../lib/catalog';

const mimeTypes=new Set(['image/jpeg','image/png','image/webp','image/avif']);
export async function POST(request){
  if(!await isAdminRequest())return NextResponse.json({error:'Please sign in again.'},{status:401});
  if(!catalogConfigured())return NextResponse.json({error:'Connect Supabase to enable image uploads.'},{status:503});
  try{
    const form=await request.formData();
    const file=form.get('image');
    if(!file||typeof file.arrayBuffer!=='function'||!mimeTypes.has(file.type))return NextResponse.json({error:'Choose a JPG, PNG, WebP, or AVIF image.'},{status:400});
    if(file.size>4*1024*1024)return NextResponse.json({error:'Images must be 4 MB or smaller.'},{status:400});
    const extension=({ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'})[file.type];
    const objectPath=`${randomUUID()}.${extension}`;
    const root=process.env.SUPABASE_URL.replace(/\/$/,'');
    const upload=await fetch(`${root}/storage/v1/object/products/${objectPath}`,{method:'POST',headers:storageHeaders(file.type),body:await file.arrayBuffer()});
    if(!upload.ok){const error=await upload.json().catch(()=>({}));throw new Error(error.message||'Image upload failed. Check the public products storage bucket.');}
    return NextResponse.json({url:`${root}/storage/v1/object/public/products/${objectPath}`},{status:201});
  }catch(error){return NextResponse.json({error:error.message},{status:400})}
}
