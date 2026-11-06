import {NextResponse} from 'next/server';
import {getProducts} from '../../../lib/catalog';
import {filterProducts} from '../../../lib/products';

export const dynamic='force-dynamic';
export async function GET(request){
  try{
    const {searchParams}=new URL(request.url);
    const category=searchParams.get('category');
    const q=searchParams.get('q')?.toLowerCase();
    let result=await getProducts();
    if(category)result=filterProducts(category,result);
    if(q)result=result.filter(p=>`${p.name} ${p.category} ${(p.collections||[]).join(' ')} ${p.color} ${p.description}`.toLowerCase().includes(q));
    return NextResponse.json({products:result},{headers:{'Cache-Control':'no-store'}});
  }catch(error){return NextResponse.json({error:error.message||'Could not load products.'},{status:502})}
}
