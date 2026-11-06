const categories=['Menswear','Womenswear','Tops','Bottomwear','Jackets','Footwear','Accessories'];
const collectionSlugs=['menswear','womenswear','tops','bottomwear','jackets','footwear','accessories','new-arrivals'];

export function cleanProduct(input){
  const name=String(input?.name||'').trim().slice(0,100);
  const slug=String(input?.slug||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
  const price=Number(input?.price);
  const category=String(input?.category||'').trim();
  const image=String(input?.image||'').trim().slice(0,1000);
  const collections=Array.isArray(input?.collections)?[...new Set(input.collections.filter(item=>collectionSlugs.includes(item)))]:[];
  if(!name||!slug||!Number.isFinite(price)||price<=0||!categories.includes(category)||!image||!collections.length)throw new Error('Name, slug, a positive price, category, image, and at least one collection are required.');
  return {slug,name,category,collections,price:Math.round(price*100)/100,description:String(input.description||'').trim().slice(0,1500),material:String(input.material||'').trim().slice(0,160),color:String(input.color||'').trim().slice(0,80),badge:String(input.badge||'').trim().slice(0,80),image,featured:Boolean(input.featured),newArrival:Boolean(input.newArrival),sizeType:['standard','one-size','footwear'].includes(input.sizeType)?input.sizeType:'standard'};
}
