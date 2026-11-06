import {notFound} from 'next/navigation';
import ProductDetail from '../../../components/ProductDetail';
import {getProduct} from '../../../lib/catalog';

export const dynamic='force-dynamic';
export async function generateMetadata({params}){
  const {slug}=await params;
  const product=await getProduct(slug);
  return product?{title:`${product.name} — AR Clothing`,description:product.description}:{title:'Piece not found'};
}
export default async function ProductPage({params}){
  const {slug}=await params;
  const product=await getProduct(slug);
  if(!product)notFound();
  return <ProductDetail product={product}/>;
}
