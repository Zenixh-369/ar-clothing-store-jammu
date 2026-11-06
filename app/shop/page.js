import ProductCard from '../../components/ProductCard';
import {getProducts} from '../../lib/catalog';

export const metadata={title:'Shop all — AR Clothing'};
export default async function ShopPage(){
  const products=await getProducts();
  return <><section className="shop-intro"><div className="eyebrow">The complete collection</div><h1>Everyday, <em>considered.</em></h1><p>Fewer, better pieces. Built for your real life.</p></section><section className="home-section shop-list"><div className="shop-toolbar"><span>{products.length} pieces</span><div>ALL CATEGORIES <span>↓</span></div></div><div className="product-grid">{products.map((p,i)=><ProductCard key={p.slug} product={p} index={i}/>)}</div></section></>;
}
