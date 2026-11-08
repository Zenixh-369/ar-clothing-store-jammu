'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

const FILTERS = [
  { id: 'all', label: 'All Essentials' },
  { id: 'tops', label: 'Tops & Shirts' },
  { id: 'bottomwear', label: 'Bottomwear' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'under8k', label: 'Under ₹8,000' }
];

export default function CuratedShowcase({ initialProducts = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('featured');

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter
    if (activeFilter === 'tops') {
      list = list.filter(p => p.category?.toLowerCase() === 'tops' || p.collections?.includes('tops'));
    } else if (activeFilter === 'bottomwear') {
      list = list.filter(p => p.category?.toLowerCase() === 'bottomwear' || p.collections?.includes('bottomwear'));
    } else if (activeFilter === 'jackets') {
      list = list.filter(p => p.category?.toLowerCase() === 'jackets' || p.collections?.includes('jackets'));
    } else if (activeFilter === 'accessories') {
      list = list.filter(p => p.category?.toLowerCase() === 'accessories' || p.collections?.includes('accessories'));
    } else if (activeFilter === 'under8k') {
      list = list.filter(p => Number(p.price) < 8000);
    }

    // Sort
    if (sortOrder === 'price-low') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === 'price-high') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOrder === 'newest') {
      list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    }

    return list;
  }, [initialProducts, activeFilter, sortOrder]);

  return (
    <section className="home-section featured-section modern-featured-section">
      <div className="section-heading compact">
        <div>
          <div className="eyebrow">A curated starting point</div>
          <h2>Start with the <em>essentials.</em></h2>
        </div>
        <Link className="text-link" href="/shop">
          Shop all {initialProducts.length} pieces <span>↗</span>
        </Link>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="curated-toolbar">
        <div className="curated-pills-row" role="tablist" aria-label="Product categories">
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === f.id}
              className={`curated-pill ${activeFilter === f.id ? 'is-active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="curated-sort-wrap">
          <label htmlFor="sort-select" className="sr-only">Sort products</label>
          <select
            id="sort-select"
            className="curated-sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="featured">Sort: Curated</option>
            <option value="newest">Sort: New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <span className="curated-count-badge">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="curated-empty">
          <p>No pieces found under this filter.</p>
          <button 
            type="button" 
            className="button-light" 
            onClick={() => { setActiveFilter('all'); setSortOrder('featured'); }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="product-grid modern-grid">
          {filteredProducts.map((p, i) => (
            <ProductCard product={p} index={i} key={`${p.slug}-${activeFilter}`} />
          ))}
        </div>
      )}
    </section>
  );
}
