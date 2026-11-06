import Link from 'next/link';
import ProductCard from '../../../components/ProductCard';
import {categories,filterProducts} from '../../../lib/products';
import {getProducts} from '../../../lib/catalog';

export const dynamic='force-dynamic';
export default async function CategoryPage({params}){
  const {slug}=await params;
  const category=categories.find(c=>c.slug===slug);
  if(!category)return <section className="page-wrap"><h1>Collection not found</h1><Link href="/shop">Back to shop</Link></section>;
  const products=await getProducts();
  const items=filterProducts(slug,products);
  return <><section className="collection-hero"><div className="collection-image"><img src={`https://images.unsplash.com/${category.image}?auto=format&fit=crop&w=1400&q=85`} alt=""/></div><div className="collection-copy"><div className="eyebrow">AR CLOTHING / COLLECTION 0{categories.indexOf(category)+1}</div><h1>{category.name}<br/><em>in good form.</em></h1><p>{category.note}. Considered shapes, honest materials, and pieces you'll reach for again and again.</p><Link className="button-dark" href="#collection">Explore collection <span>↓</span></Link></div></section><section className="home-section collection-list" id="collection"><div className="section-heading compact"><div><div className="eyebrow">{items.length} considered pieces</div><h2>{category.name}</h2></div><Link className="text-link" href="/shop">View all <span>↗</span></Link></div><div className="product-grid">{items.map((p,i)=><ProductCard key={p.slug} product={p} index={i}/>)}</div></section></>;
}
