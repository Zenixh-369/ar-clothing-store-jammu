import {NextResponse} from 'next/server';
import {isAdminRequest} from '../../../../../lib/admin-auth';
import {catalogConfigured,supabaseRequest} from '../../../../../lib/catalog';
import {cleanProduct} from '../../../../../lib/product-validation';

export async function PATCH(request,{params}){
  if(!await isAdminRequest())return NextResponse.json({error:'Please sign in again.'},{status:401});
  if(!catalogConfigured())return NextResponse.json({error:'Connect Supabase to enable the synced product catalog.'},{status:503});
  try{
    const {slug}=await params;
    const product=cleanProduct(await request.json());
    const rows=await supabaseRequest(`/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(product)});
    if(!rows?.length)return NextResponse.json({error:'Product was not found.'},{status:404});
    return NextResponse.json({product:rows[0]});
  }catch(error){return NextResponse.json({error:error.message},{status:400})}
}

export async function DELETE(request,{params}){
  if(!await isAdminRequest())return NextResponse.json({error:'Please sign in again.'},{status:401});
  if(!catalogConfigured())return NextResponse.json({error:'Connect Supabase to enable the synced product catalog.'},{status:503});
  try{
    const {slug}=await params;
    await supabaseRequest(`/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`,{method:'DELETE'});
    return NextResponse.json({ok:true});
  }catch(error){return NextResponse.json({error:error.message},{status:400})}
}
