'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getCart, saveCart } from './SiteChrome';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../lib/products';
import { productImageUrl } from '../lib/image-url';

export function openCartDrawer() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('opencartdrawer'));
  }
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const update = () => setItems(getCart());
    update();

    const handleOpen = () => {
      setItems(getCart());
      setOpen(true);
    };

    window.addEventListener('opencartdrawer', handleOpen);
    window.addEventListener('cartchange', update);
    window.addEventListener('storage', update);
    window.addEventListener('bagfly', () => {
      // Auto-open drawer slightly after fly animation to give satisfying visual reward
      setTimeout(() => {
        setItems(getCart());
        setOpen(true);
      }, 500);
    });

    return () => {
      window.removeEventListener('opencartdrawer', handleOpen);
      window.removeEventListener('cartchange', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [items]);

  const freeShippingReached = total >= FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));

  const removeItem = (index) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    saveCart(next);
  };

  if (!open) return null;

  return (
    <div className="cart-drawer-backdrop" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
      <aside className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div>
            <h3>Your Bag</h3>
            <span className="cart-drawer-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <button 
            className="cart-drawer-close" 
            onClick={() => setOpen(false)} 
            aria-label="Close cart drawer"
          >
            ×
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="cart-drawer-meter">
          <div className="cart-meter-label">
            <span>
              {freeShippingReached 
                ? '✓ Complimentary shipping unlocked!' 
                : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - total)} for free shipping`}
            </span>
            <small>{progressPercent}%</small>
          </div>
          <div className="cart-meter-track">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-drawer-empty">
              <span className="empty-icon">AR</span>
              <h4>Your bag is empty</h4>
              <p>Explore our considered collection of everyday essentials.</p>
              <Link 
                href="/shop" 
                className="button-dark"
                onClick={() => setOpen(false)}
              >
                Shop collection ↗
              </Link>
            </div>
          ) : (
            <div className="cart-drawer-items">
              {items.map((item, index) => (
                <article className="cart-drawer-item" key={`${item.slug}-${item.size}-${index}`}>
                  <Link 
                    href={`/products/${item.slug}`} 
                    className="cart-item-thumb"
                    onClick={() => setOpen(false)}
                  >
                    <img src={productImageUrl(item.image, 200)} alt="" />
                  </Link>
                  <div className="cart-item-info">
                    <Link 
                      href={`/products/${item.slug}`} 
                      className="cart-item-name"
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="cart-item-details">
                      Size: {item.size} {item.color ? `· ${item.color}` : ''}
                    </div>
                    <div className="cart-item-bottom">
                      <span className="cart-item-price">{formatPrice(item.price)}</span>
                      <button 
                        type="button" 
                        className="cart-item-remove"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-subtotal">
              <span>Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="cart-drawer-shipping-note">
              Shipping & taxes calculated at checkout. WhatsApp confirmation ready.
            </p>
            <div className="cart-drawer-cta-group">
              <Link 
                href="/cart" 
                className="button-dark cart-drawer-checkout-btn"
                onClick={() => setOpen(false)}
              >
                Proceed to Checkout <span>↗</span>
              </Link>
              <button 
                type="button" 
                className="cart-drawer-continue-btn"
                onClick={() => setOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
