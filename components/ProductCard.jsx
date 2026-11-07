'use client';

import Link from 'next/link';
import {useEffect,useMemo,useRef,useState} from 'react';
import {formatPrice,getProductColors,getProductImages} from '../lib/products';
import {productImageUrl} from '../lib/image-url';

const swatchValue=color=>{const value=color.toLowerCase();if(value.includes('black')||value.includes('ink'))return '#151515';if(value.includes('white')||value.includes('ivory'))return '#f5f3eb';if(value.includes('blue')||value.includes('denim')||value.includes('mid'))return '#5d7891';if(value.includes('green')||value.includes('olive'))return '#65705b';if(value.includes('sand')||value.includes('stone')||value.includes('chalk'))return '#c9b99b';if(value.includes('red'))return '#9b4d45';return '#aaa'};

export default function ProductCard({product,index=0}){
  const colors=getProductColors(product);const[activeColor,setActiveColor]=useState(colors[0]||product.color);const[activeImage,setActiveImage]=useState(0);const cardRef=useRef(null);const images=useMemo(()=>getProductImages(product,activeColor),[product,activeColor]);
  useEffect(()=>{setActiveImage(0)},[activeColor]);
  useEffect(()=>{const card=cardRef.current;if(!card||images.length<2)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&entry.intersectionRatio>.65)setActiveImage(current=>(current+1)%images.length)},{threshold:[.65]});observer.observe(card);return()=>observer.disconnect()},[images.length]);
  return <article className="product-card interactive-product-card" ref={cardRef} style={{'--card-index':index}}><Link className="product-image-link" href={`/products/${product.slug}`}><div className="product-image" onPointerEnter={()=>images.length>1&&setActiveImage(1)}><img src={productImageUrl(images[activeImage]||product.image,800)} alt={product.name}/>{product.badge&&<span className="product-badge">{product.badge}</span>}<span className="product-image-count">{images.length>1?`${activeImage+1} / ${images.length}`:'AR'}</span><span className="quick-view">Discover piece <b>↗</b></span></div></Link><div className="product-meta"><div><Link href={`/products/${product.slug}`} className="product-name">{product.name}</Link><span className="product-color">{activeColor} · {product.category}</span>{colors.length>1&&<div className="product-swatches" aria-label="Available colors">{colors.map(color=><button key={color} type="button" className={color===activeColor?'selected':''} aria-label={`Show ${color}`} aria-pressed={color===activeColor} onClick={()=>setActiveColor(color)}><i style={{backgroundColor:swatchValue(color)}}/></button>)}</div>}</div><span className="product-price">{formatPrice(product.price)}</span></div></article>;
}
