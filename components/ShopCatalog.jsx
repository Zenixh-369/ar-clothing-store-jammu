'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { categories } from '../lib/products';

export default function ShopCatalog({ products = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('curated');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      list = list.filter(p => 
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.collections?.includes(activeCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'new') {
      list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    }

    return list;
  }, [products, activeCategory, sortBy, searchQuery]);

  return (
    <section className="home-section shop-list modern-shop-list">
      {/* Search & Filter Bar */}
      <div className="shop-interactive-bar">
        {/* Search */}
        <div className="shop-search-input-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            type="text"
            placeholder="Search pieces, fabrics, styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter pieces"
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="shop-category-pills" role="tablist">
          <button
            type="button"
            className={`shop-cat-pill ${activeCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Pieces ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              type="button"
              className={`shop-cat-pill ${activeCategory === cat.slug ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort & Count */}
        <div className="shop-sort-row">
          <span className="shop-counter">
            Showing <strong>{filtered.length}</strong> of {products.length} pieces
          </span>

          <div className="shop-sort-controls">
            <label htmlFor="shop-sort-select" className="sr-only">Sort by</label>
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="curated-sort-select"
            >
              <option value="curated">Sort: Curated</option>
              <option value="new">Sort: New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="curated-empty">
          <p>No pieces match your current selection.</p>
          <button
            type="button"
            className="button-light"
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="product-grid modern-grid">
          {filtered.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
