import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import {getProducts} from '../../lib/catalog';

export const metadata={title:'Search the collection — AR Clothing'};
export default async function SearchPage({searchParams}){
  const params=await searchParams;
  const q=typeof params?.q==='string'?params.q.trim():'';
  const products=await getProducts();
  const results=q?products.filter(p=>`${p.name} ${p.category} ${(p.collections||[]).join(' ')} ${p.color} ${p.description}`.toLowerCase().includes(q.toLowerCase())):[];
  return <section className="search-page"><div className="eyebrow">Find your everyday</div><h1>Search the <em>collection.</em></h1><form className="search-form" action="/search"><label className="sr-only" htmlFor="shop-search">Search products and categories</label><input id="shop-search" name="q" defaultValue={q} placeholder="Try linen, jackets, or sneakers"/><button className="button-dark" type="submit">Search <span>↗</span></button></form>{q?<><div className="search-result-heading"><span>{results.length} result{results.length===1?'':'s'} for “{q}”</span><Link href="/shop">Browse all pieces ↗</Link></div>{results.length?<div className="product-grid">{results.map((p,i)=><ProductCard key={p.slug} product={p} index={i}/>)}</div>:<div className="no-results"><p>No pieces found for “{q}”. Try a broader search.</p><Link className="button-dark" href="/shop">Explore all pieces <span>↗</span></Link></div>}</>:<div className="search-suggestions"><span>POPULAR CATEGORIES</span>{['menswear','womenswear','bottomwear','jackets','footwear'].map(s=><Link key={s} href={`/categories/${s}`}>{s.replace('-',' ')} ↗</Link>)}</div>}</section>;
}
