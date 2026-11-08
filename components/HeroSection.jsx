'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { openQuickView } from './QuickViewModal';

const LOOKS = [
  {
    id: '01',
    title: 'THE SOFT STRUCTURE EDIT',
    category: 'SPRING / SUMMER 2026',
    headline: 'Wear the\nfeeling.',
    intro: 'An easier kind of considered. Thoughtfully made clothing for the days that make up your life.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=90',
    hotspots: [
      {
        x: 48,
        y: 36,
        label: 'The Everyday Shirt',
        price: '₹7,020',
        slug: 'everyday-shirt',
        category: 'Tops',
        image: 'photo-1598554747436-c9293d6a588f'
      },
      {
        x: 52,
        y: 74,
        label: 'Straight Leg Denim',
        price: '₹8,820',
        slug: 'everyday-denim',
        category: 'Bottomwear',
        image: 'photo-1542272604-787c3835535d'
      }
    ]
  },
  {
    id: '02',
    title: 'RELAXED LINEN & FLOW',
    category: 'NATURAL DRAPE SERIES',
    headline: 'Space to\nbreathe.',
    intro: 'Airy European linen with an easy drape and relaxed posture for slow mornings and warm evenings.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90',
    hotspots: [
      {
        x: 48,
        y: 33,
        label: 'Soft Form Knit',
        price: '₹8,640',
        slug: 'soft-form-knit',
        category: 'Tops',
        image: 'photo-1576566588028-4147f3842f27'
      },
      {
        x: 50,
        y: 68,
        label: 'Relaxed Linen Trouser',
        price: '₹9,900',
        slug: 'linen-trouser',
        category: 'Bottomwear',
        image: 'photo-1509631179647-0177331693ae'
      }
    ]
  },
  {
    id: '03',
    title: 'THE LAYERED UTILITY EDIT',
    category: 'AUTUMN / WINTER CORE',
    headline: 'Quietly\nconfident.',
    intro: 'Substantial cotton twill and heavyweight canvases. Structured layers with details you notice over time.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=90',
    hotspots: [
      {
        x: 45,
        y: 38,
        label: 'The Weekend Jacket',
        price: '₹13,320',
        slug: 'weekend-jacket',
        category: 'Jackets',
        image: 'photo-1551028719-00167b16eac5'
      },
      {
        x: 68,
        y: 58,
        label: 'Everywhere Tote',
        price: '₹3,780',
        slug: 'everywhere-tote',
        category: 'Accessories',
        image: 'photo-1590874103328-eac38a683ce7'
      }
    ]
  }
];

export default function HeroSection({ allProducts = [] }) {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const containerRef = useRef(null);

  const activeLook = LOOKS[activeLookIndex];

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    containerRef.current.style.setProperty('--tilt-x', `${-y * 8}deg`);
    containerRef.current.style.setProperty('--tilt-y', `${x * 10}deg`);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--tilt-x', '0deg');
    containerRef.current.style.setProperty('--tilt-y', '0deg');
  };

  const findProductForHotspot = (slug) => {
    return allProducts.find((p) => p.slug === slug) || {
      slug,
      name: slug.replace(/-/g, ' '),
      price: 8000,
      description: 'Considered essential by AR Clothing.',
      category: 'Clothing'
    };
  };

  return (
    <section className="hero modern-hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          Jammu, India · Everyday, considered
        </div>

        <h1 key={activeLook.headline} className="hero-headline-animated">
          {activeLook.headline.split('\n')[0]}<br />
          <em>{activeLook.headline.split('\n')[1]}</em>
        </h1>

        <p className="hero-intro">{activeLook.intro}</p>

        <div className="hero-actions">
          <Link className="button-dark" href="/shop">
            Explore collection <span>↗</span>
          </Link>

          {/* Lookbook Switcher Pill */}
          <div className="hero-look-switcher">
            <span className="hero-look-label">Curated Looks:</span>
            <div className="hero-look-dots">
              {LOOKS.map((look, idx) => (
                <button
                  key={look.id}
                  type="button"
                  className={`hero-look-btn ${idx === activeLookIndex ? 'active' : ''}`}
                  onClick={() => {
                    setActiveLookIndex(idx);
                    setActiveHotspot(null);
                  }}
                  aria-label={`Switch to Look ${look.id}`}
                >
                  <span>{look.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Stamp */}
        <div className="hero-stamp">
          <span>AR</span>
          <small>EVERYDAY<br />UNIFORM</small>
        </div>
      </div>

      {/* Visual Canvas with 3D Tilt and Hotspots */}
      <div 
        className="hero-image-wrap modern-hero-wrap" 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          key={activeLook.image}
          className="hero-image modern-hero-img"
          src={activeLook.image}
          alt={activeLook.title}
        />
        <div className="hero-image-shade" />

        {/* Interactive Shoppable Hotspots */}
        {activeLook.hotspots.map((spot, i) => {
          const isSelected = activeHotspot === i;
          return (
            <div
              key={`${spot.slug}-${i}`}
              className={`hero-hotspot ${isSelected ? 'is-active' : ''}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onMouseEnter={() => setActiveHotspot(i)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(isSelected ? null : i)}
            >
              <button 
                type="button" 
                className="hotspot-trigger" 
                aria-label={`View ${spot.label}`}
              >
                <span className="hotspot-ping" />
                <span className="hotspot-dot" />
              </button>

              <div className="hotspot-card">
                <span className="hotspot-tag">{spot.category}</span>
                <strong>{spot.label}</strong>
                <span className="hotspot-price">{spot.price}</span>
                <div className="hotspot-buttons">
                  <button
                    type="button"
                    className="hotspot-quickview"
                    onClick={(e) => {
                      e.stopPropagation();
                      const prod = findProductForHotspot(spot.slug);
                      openQuickView(prod);
                    }}
                  >
                    Quick View
                  </button>
                  <Link href={`/products/${spot.slug}`} className="hotspot-link">
                    ↗
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Floating Badges */}
        <div className="hero-image-label">
          <span>LOOK {activeLook.id} / 03</span>
          <span>{activeLook.title}</span>
        </div>

        <div className="hero-orbit">
          <span>MADE TO MOVE · MADE TO LAST · </span>
        </div>

        <div className="hero-hotspot-hint">
          <span className="hint-pulse">●</span> Tap pins to shop the look
        </div>
      </div>

      <div className="hero-index">
        AR CLOTHING <span>—</span> {activeLook.id}
      </div>
    </section>
  );
}
