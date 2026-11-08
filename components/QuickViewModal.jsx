'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { addCart } from './SiteChrome';
import { formatPrice, getProductColors, getProductImages } from '../lib/products';
import { productImageUrl } from '../lib/image-url';

const swatchValue = color => {
  const value = (color || '').toLowerCase();
  if (value.includes('black') || value.includes('ink')) return '#151515';
  if (value.includes('white') || value.includes('ivory')) return '#f5f3eb';
  if (value.includes('blue') || value.includes('denim') || value.includes('mid')) return '#5d7891';
  if (value.includes('green') || value.includes('olive')) return '#65705b';
  if (value.includes('sand') || value.includes('stone') || value.includes('chalk')) return '#c9b99b';
  if (value.includes('red')) return '#9b4d45';
  return '#aaa';
};

export function openQuickView(product) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('openquickview', { detail: product }));
  }
}

export default function QuickViewModal() {
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [activeColor, setActiveColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleOpen = (e) => {
      const p = e.detail;
      setProduct(p);
      const colors = getProductColors(p);
      setActiveColor(colors[0] || p.color || '');
      setActiveImage(0);
      setSize(p.sizeType === 'one-size' ? 'ONE' : '');
      setAdded(false);
    };

    window.addEventListener('openquickview', handleOpen);
    return () => window.removeEventListener('openquickview', handleOpen);
  }, []);

  useEffect(() => {
    if (!product) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape') setProduct(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [product]);

  const colors = useMemo(() => product ? getProductColors(product) : [], [product]);
  const images = useMemo(() => product ? getProductImages(product, activeColor) : [], [product, activeColor]);
  const sizes = useMemo(() => {
    if (!product) return [];
    if (product.sizeType === 'footwear') return ['6', '7', '8', '9', '10', '11', '12'];
    if (product.sizeType === 'one-size') return ['ONE'];
    return ['XS', 'S', 'M', 'L', 'XL'];
  }, [product]);

  if (!product) return null;

  const currentImg = images[activeImage] || product.image;

  return (
    <div className="quickview-backdrop" onClick={() => setProduct(null)} role="dialog" aria-modal="true">
      <div className="quickview-panel" onClick={(e) => e.stopPropagation()}>
        <button 
          className="quickview-close" 
          onClick={() => setProduct(null)} 
          aria-label="Close quick view"
        >
          ×
        </button>

        <div className="quickview-grid">
          {/* Gallery View */}
          <div className="quickview-gallery">
            <div className="quickview-main-image">
              <img 
                src={productImageUrl(currentImg, 900)} 
                alt={`${product.name} preview`} 
              />
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <span className="quickview-counter">
                {activeImage + 1} / {Math.max(1, images.length)}
              </span>
            </div>

            {images.length > 1 && (
              <div className="quickview-thumbs">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    className={`quickview-thumb-btn ${activeImage === i ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={productImageUrl(img, 140)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Selection */}
          <div className="quickview-info">
            <div className="eyebrow">{product.material || product.category} · In Stock</div>
            <h2>{product.name}</h2>
            <div className="quickview-price">{formatPrice(product.price)}</div>
            <p className="quickview-desc">{product.description}</p>

            {/* Colors */}
            {colors.length > 1 && (
              <div className="quickview-swatches-wrap">
                <span className="quickview-label">Color: <strong>{activeColor}</strong></span>
                <div className="product-swatches">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={color === activeColor ? 'selected' : ''}
                      aria-label={`Select ${color}`}
                      onClick={() => {
                        setActiveColor(color);
                        setActiveImage(0);
                      }}
                    >
                      <i style={{ backgroundColor: swatchValue(color) }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="quickview-sizes-wrap">
              <span className="quickview-label">Select Size</span>
              <div className="size-options">
                {sizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={size === s ? 'selected' : ''}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="quickview-actions">
              <button
                type="button"
                className="button-dark quickview-add-btn"
                disabled={!size}
                onClick={() => {
                  addCart({ ...product, color: activeColor, image: currentImg }, size);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
              >
                {added ? 'Added to Bag ✓' : size ? `Add to Bag · ${formatPrice(product.price)}` : 'Select a size'} <span>↗</span>
              </button>

              <Link
                href={`/products/${product.slug}`}
                className="quickview-full-link"
                onClick={() => setProduct(null)}
              >
                View full product page ↗
              </Link>
            </div>

            <div className="quickview-perks">
              <span>✳ Complimentary shipping over ₹9,000</span>
              <span>✳ Direct WhatsApp checkout confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
