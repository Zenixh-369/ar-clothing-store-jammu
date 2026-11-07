import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import {getProducts} from '../../lib/catalog';

export const metadata={title:'Search the collection — AR Clothing'};

const aliases={pants:['bottomwear','trouser','trousers','jeans','denim'],trousers:['bottomwear','pants','jeans','denim'],jeans:['bottomwear','pants','denim'],bottomwear:['pants','trousers','jeans','denim']};
const textFor=product=>`${product.name} ${product.category} ${(product.collections||[]).join(' ')} ${product.color} ${product.description}`.toLowerCase();

function getSearchGroups(products,query){
  const normalized=query.toLowerCase();
  const terms=normalized.split(/\s+/).filter(Boolean);
  const exact=products.filter(product=>product.name.toLowerCase()===normalized);
  const exactSlugs=new Set(exact.map(product=>product.slug));
  const direct=products.filter(product=>!exactSlugs.has(product.slug)&&terms.some(term=>textFor(product).includes(term)));
  const pantsSearch=terms.some(term=>aliases[term]?.includes('bottomwear')||['pants','trousers','jeans','denim','bottomwear'].includes(term));
  const bottomwear=products.filter(product=>product.category==='Bottomwear'&&!exactSlugs.has(product.slug)&&!direct.some(item=>item.slug===product.slug));
  const related=pantsSearch?bottomwear:[];
  const groupedSlugs=new Set([...exact,...direct,...related].map(product=>product.slug));
  const other=products.filter(product=>!groupedSlugs.has(product.slug)&&terms.some(term=>textFor(product).includes(term)));
  return {exact,direct,related,other};
}

function ProductGroup({label,products,startIndex=0}){if(!products.length)return null;return <section className="search-group"><div className="search-group-heading"><span>{label}</span><small>{products.length} piece{products.length===1?'':'s'}</small></div><div className="product-grid">{products.map((product,index)=><ProductCard key={product.slug} product={product} index={startIndex+index}/>)}</div></section>}

export default async function SearchPage({searchParams}){
  const params=await searchParams;const q=typeof params?.q==='string'?params.q.trim():'';const products=await getProducts();const groups=q?getSearchGroups(products,q):null;const resultCount=groups?[...groups.exact,...groups.direct,...groups.related,...groups.other].length:0;
  return <section className="search-page"><div className="eyebrow">Find your everyday</div><h1>Search the <em>collection.</em></h1><form className="search-form" action="/search"><label className="sr-only" htmlFor="shop-search">Search products and categories</label><input id="shop-search" name="q" defaultValue={q} placeholder="Try denim pants, jackets, or sneakers"/><button className="button-dark" type="submit">Search <span>↗</span></button></form>{q?<>{resultCount?<div className="search-result-heading"><span>{resultCount} result{resultCount===1?'':'s'} for “{q}”</span><Link href="/shop">Browse all pieces ↗</Link></div>:null}<ProductGroup label="Exact matches" products={groups.exact}/><ProductGroup label={groups.direct.length?`Matches for “${q}”`:'Direct matches'} products={groups.direct} startIndex={groups.exact.length}/><ProductGroup label="Pants & trousers / Bottomwear" products={groups.related} startIndex={groups.exact.length+groups.direct.length}/><ProductGroup label="More related pieces" products={groups.other} startIndex={groups.exact.length+groups.direct.length+groups.related.length}/>{!resultCount&&<div className="no-results"><p>No pieces found for “{q}”. Try a broader search.</p><Link className="button-dark" href="/shop">Explore all pieces <span>↗</span></Link></div>}</>:<div className="search-suggestions"><span>POPULAR CATEGORIES</span>{['menswear','womenswear','bottomwear','jackets','footwear'].map(s=><Link key={s} href={`/categories/${s}`}>{s.replace('-',' ')} ↗</Link>)}</div>}</section>;
}
