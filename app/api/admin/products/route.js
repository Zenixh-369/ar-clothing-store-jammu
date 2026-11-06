import {NextResponse} from 'next/server';
import {isAdminRequest} from '../../../../lib/admin-auth';
import {catalogConfigured,getProducts,supabaseRequest} from '../../../../lib/catalog';
import {cleanProduct} from '../../../../lib/product-validation';

export async function GET(){
  if(!await isAdminRequest())return NextResponse.json({error:'Please sign in again.'},{status:401});
  if(!catalogConfigured())return NextResponse.json({error:'Connect Supabase to enable the synced product catalog.'},{status:503});
  try{return NextResponse.json({products:await getProducts()},{headers:{'Cache-Control':'no-store'}})}catch(error){return NextResponse.json({error:error.message},{status:502})}
}

export async function POST(request){
  if(!await isAdminRequest())return NextResponse.json({error:'Please sign in again.'},{status:401});
  if(!catalogConfigured())return NextResponse.json({error:'Connect Supabase to enable the synced product catalog.'},{status:503});
  try{
    const product=cleanProduct(await request.json());
    const rows=await supabaseRequest('/rest/v1/products',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(product)});
    return NextResponse.json({product:rows?.[0]||product},{status:201});
  }catch(error){return NextResponse.json({error:error.message},{status:400})}
}
