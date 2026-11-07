import {products as starterProducts} from './products';
export {productImageUrl} from './image-url';

const baseUrl=()=>process.env.SUPABASE_URL?.replace(/\/$/,'');
const serviceKey=()=>process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
export const catalogConfigured=()=>Boolean(baseUrl()&&serviceKey());

function headers(extra={}){
  const key=serviceKey();
  return {apikey:key,...(process.env.SUPABASE_SECRET_KEY?{}:{Authorization:`Bearer ${key}`}), 'Content-Type':'application/json',...extra};
}

export function storageHeaders(contentType){
  const key=serviceKey();
  return {apikey:key,...(process.env.SUPABASE_SECRET_KEY?{}:{Authorization:`Bearer ${key}`}), 'Content-Type':contentType,'x-upsert':'false'};
}

function normalize(row){
  const images=[...new Set([row.image,...(Array.isArray(row.images)?row.images:[]),...(Array.isArray(row.variants)?row.variants.flatMap(variant=>Array.isArray(variant?.images)?variant.images:[]):[])].filter(Boolean))];
  const variants=Array.isArray(row.variants)&&row.variants.length?row.variants.map(variant=>({color:String(variant?.color||''),images:Array.isArray(variant?.images)?variant.images.filter(Boolean):[]})):row.color?[{color:row.color,images:images.slice(0,1)}]:[];
  return {...row,collections:Array.isArray(row.collections)?row.collections:[],price:Number(row.price),images,variants};
}

export async function getProducts(){
  if(!catalogConfigured())return starterProducts;
  const response=await fetch(`${baseUrl()}/rest/v1/products?select=*&order=name.asc`,{headers:headers(),cache:'no-store'});
  if(!response.ok)throw new Error('Could not load the product catalog. Check the Supabase products table.');
  return (await response.json()).map(normalize);
}

export async function getProduct(slug){
  const all=await getProducts();
  return all.find(product=>product.slug===slug);
}

export async function supabaseRequest(path,options={}){
  if(!catalogConfigured())throw new Error('Supabase is not configured.');
  const response=await fetch(`${baseUrl()}${path}`,{...options,headers:headers(options.headers),cache:'no-store'});
  const text=await response.text();
  let body=null;
  try{body=text?JSON.parse(text):null}catch{}
  if(!response.ok)throw new Error(body?.message||body?.error||'Supabase request failed.');
  return body;
}
