import { getProducts } from '../../lib/catalog';
import ShopCatalog from '../../components/ShopCatalog';

export const metadata = {
  title: 'Shop All Pieces — AR Clothing',
  description: 'The complete archive of considered essentials. Crafted for everyday life in Jammu, India.'
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <section className="shop-intro modern-shop-intro">
        <div className="eyebrow">The complete collection</div>
        <h1>Everyday, <em>considered.</em></h1>
        <p>Fewer, better pieces. Built for your real life and made to last.</p>
      </section>

      <ShopCatalog products={products} />
    </>
  );
}
