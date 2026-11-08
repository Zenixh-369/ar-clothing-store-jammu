'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function ProductDetail({ product }) {
  const [size, setSize] = useState('');
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const addBtnRef = useRef(null);

  const colors = getProductColors(product);
  const [activeColor, setActiveColor] = useState(colors[0] || product.color);
  const [activeImage, setActiveImage] = useState(0);
  const images = useMemo(() => getProductImages(product, activeColor), [product, activeColor]);

  const sizes = useMemo(() => {
    if (product.sizeType === 'footwear') return ['6', '7', '8', '9', '10', '11', '12'];
    if (product.sizeType === 'one-size') return ['ONE'];
    return ['XS', 'S', 'M', 'L', 'XL'];
  }, [product.sizeType]);

  useEffect(() => {
    setActiveImage(0);
    if (product.sizeType === 'one-size') setSize('ONE');
  }, [activeColor, product.sizeType]);

  useEffect(() => {
    if (!guideOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setGuideOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.querySelector('.size-guide-close')?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [guideOpen]);

  // Observer for sticky bottom bar
  useEffect(() => {
    const btn = addBtnRef.current;
    if (!btn) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(btn);
    return () => observer.disconnect();
  }, []);

  const handleAdd = () => {
    if (!size) return;
    addCart({ ...product, color: activeColor, image: images[activeImage] || product.image }, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '919876543210';
  const whatsappInquiry = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello AR Clothing, I have a question about the ${product.name} (color: ${activeColor}, price: ${formatPrice(product.price)}).`
  )}`;

  return (
    <>
      <section className="product-detail modern-product-detail">
        {/* Gallery Section */}
        <div className="detail-gallery">
          <div className="detail-image modern-detail-image">
            <img
              src={productImageUrl(images[activeImage] || product.image, 1200)}
              alt={`${product.name} in ${activeColor}`}
            />
            {product.badge && <span className="product-badge">{product.badge}</span>}
            <span className="image-caption">
              AR CLOTHING · {activeColor} · {activeImage + 1}/{images.length}
            </span>
          </div>

          {images.length > 1 && (
            <div className="detail-thumbnails" aria-label="Product photos">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={activeImage === index ? 'selected' : ''}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View photo ${index + 1}`}
                >
                  <img src={productImageUrl(image, 180)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="detail-copy">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> /{' '}
            <Link href={`/categories/${product.category?.toLowerCase() || 'tops'}`}>
              {product.category}
            </Link>{' '}
            / {product.name}
          </nav>

          <div className="eyebrow">{product.material} · {activeColor}</div>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-price">{formatPrice(product.price)}</div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-rule" />

          {/* Color Switcher */}
          {colors.length > 1 && (
            <div className="variant-section">
              <div className="variant-heading">
                <span>Available colorways</span>
                <strong>{activeColor}</strong>
              </div>
              <div className="variant-options">
                {colors.map((color) => {
                  const preview = getProductImages(product, color)[0] || product.image;
                  return (
                    <button
                      key={color}
                      type="button"
                      className={activeColor === color ? 'selected' : ''}
                      aria-label={`Select ${color}`}
                      aria-pressed={activeColor === color}
                      onClick={() => setActiveColor(color)}
                    >
                      <img src={productImageUrl(preview, 260)} alt="" />
                      <span>
                        <i style={{ backgroundColor: swatchValue(color) }} />
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Picker */}
          <div className="size-heading">
            <span>{product.sizeType === 'footwear' ? 'Select Shoe Size (US)' : 'Select Size'}</span>
            <button type="button" onClick={() => setGuideOpen(true)}>
              Size guide ↗
            </button>
          </div>

          <div className="size-options">
            {sizes.map((s) => (
              <button
                key={s}
                className={size === s ? 'selected' : ''}
                aria-pressed={size === s}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Main Action Button */}
          <button
            ref={addBtnRef}
            className="button-dark add-button modern-add-btn"
            disabled={!size}
            onClick={handleAdd}
          >
            {added
              ? 'Added to bag ✓'
              : size
              ? `Add to bag — ${formatPrice(product.price)}`
              : 'Select a size to continue'}{' '}
            <span>↗</span>
          </button>

          {/* Highlights & WhatsApp concierge */}
          <div className="product-perks modern-perks">
            <span>✳ &nbsp;Thoughtfully made in Jammu, India</span>
            <span>↗ &nbsp;Complimentary express shipping over ₹9,000</span>
            <span>↺ &nbsp;Easy size exchange & dedicated support</span>
          </div>

          <div className="detail-whatsapp-inquiry">
            <a href={whatsappInquiry} target="_blank" rel="noreferrer" className="whatsapp-inquire-link">
              <span>Need help with sizing or fit? Chat on WhatsApp</span>
              <b>↗</b>
            </a>
          </div>

          <div className="detail-rule" />

          {/* Accordion */}
          <div className="detail-accordion">
            <details open>
              <summary>Details & fit</summary>
              <p>
                {product.description} Carefully finished and engineered for an easy, relaxed drape.
                Designed to soften beautifully through continuous wear.
              </p>
            </details>
            <details>
              <summary>Materials & origin</summary>
              <p>
                {product.material || 'Organic cotton / natural blends'}.
                Responsibly milled. Machine wash cold with similar shades; line dry in shade.
              </p>
            </details>
          </div>
        </div>

        {/* Size Guide Modal */}
        {guideOpen && (
          <div className="size-guide-backdrop" role="presentation" onClick={() => setGuideOpen(false)}>
            <section
              className="size-guide"
              role="dialog"
              aria-modal="true"
              aria-labelledby="size-guide-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="size-guide-close"
                onClick={() => setGuideOpen(false)}
                aria-label="Close size guide"
              >
                ×
              </button>
              <div className="eyebrow">A little help with fit</div>
              <h2 id="size-guide-title">Size guide</h2>
              <p>
                {product.sizeType === 'footwear'
                  ? 'Footwear sizes are shown in US sizing. If you are between sizes, choose the larger size.'
                  : product.sizeType === 'one-size'
                  ? 'This accessory is designed as one size and adjusts to fit comfortably.'
                  : 'Our clothing is designed for an easy, relaxed fit. Choose your usual size; size up for a roomier feel.'}
              </p>

              {product.sizeType === 'footwear' ? (
                <div className="guide-table">
                  <div>
                    <b>US</b>
                    <b>Foot length</b>
                  </div>
                  {[
                    [6, '23.5 cm'],
                    [7, '24.4 cm'],
                    [8, '25.2 cm'],
                    [9, '26 cm'],
                    [10, '26.8 cm'],
                    [11, '27.7 cm'],
                    [12, '28.5 cm']
                  ].map((row) => (
                    <div key={row[0]}>
                      <span>{row[0]}</span>
                      <span>{row[1]}</span>
                    </div>
                  ))}
                </div>
              ) : product.sizeType === 'one-size' ? (
                <div className="one-size-note">ONE SIZE · Adjustable / relaxed fit</div>
              ) : (
                <div className="guide-table">
                  <div>
                    <b>Size</b>
                    <b>Chest</b>
                    <b>Waist</b>
                  </div>
                  {[
                    ['XS', '81–86 cm', '66–71 cm'],
                    ['S', '86–91 cm', '71–76 cm'],
                    ['M', '91–97 cm', '76–81 cm'],
                    ['L', '97–102 cm', '81–86 cm'],
                    ['XL', '102–107 cm', '86–91 cm']
                  ].map((row) => (
                    <div key={row[0]}>
                      {row.map((value) => (
                        <span key={value}>{value}</span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <small>Measurements are a general guide. Garment fit varies by style.</small>
            </section>
          </div>
        )}
      </section>

      {/* Sticky Bottom Bar on Scroll */}
      <div className={`sticky-product-bar ${stickyVisible ? 'is-visible' : ''}`} aria-hidden={!stickyVisible}>
        <div className="sticky-bar-content">
          <div className="sticky-bar-left">
            <img src={productImageUrl(images[activeImage] || product.image, 100)} alt="" />
            <div>
              <strong>{product.name}</strong>
              <span>
                {activeColor} · {formatPrice(product.price)}
              </span>
            </div>
          </div>

          <div className="sticky-bar-right">
            <div className="sticky-sizes">
              {sizes.map((s) => (
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
            <button
              type="button"
              className="button-dark sticky-add-btn"
              disabled={!size}
              onClick={handleAdd}
            >
              {added ? 'Added ✓' : size ? 'Add to bag' : 'Select size'} ↗
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
