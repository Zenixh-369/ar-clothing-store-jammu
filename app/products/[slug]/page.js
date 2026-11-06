import {notFound} from 'next/navigation';import ProductDetail from '../../../components/ProductDetail';import {findProduct,products} from '../../../lib/products';
export function generateStaticParams(){return products.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}){const {slug}=await params;const product=findProduct(slug);return product?{title:`${product.name} — AR Clothing`,description:product.description}:{title:'Piece not found'};}
export default async function ProductPage({params}){const {slug}=await params;const product=findProduct(slug);if(!product)notFound();return <ProductDetail product={product}/>}
