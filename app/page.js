import Link from 'next/link';
import { getProducts } from '../lib/catalog';
import HeroSection from '../components/HeroSection';
import MarqueeStrip from '../components/MarqueeStrip';
import CategoryShowcase from '../components/CategoryShowcase';
import CuratedShowcase from '../components/CuratedShowcase';

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      {/* Interactive 3D Hero with Shoppable Lookbook Hotspots */}
      <HeroSection allProducts={products} />

      {/* Modern Kinetic Infinite Marquee Strip */}
      <MarqueeStrip />

      {/* Category Discovery with Interactive 3D Tilt Cards */}
      <section className="home-section categories-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Find your everyday</div>
            <h2>Good things<br />in <em>good form.</em></h2>
          </div>
          <p>Build a wardrobe that feels like you.<br />Start with what you reach for most.</p>
        </div>
        <CategoryShowcase />
      </section>

      {/* Interactive Curated Essentials with Real-time Filters & Quick View */}
      <CuratedShowcase initialProducts={products} />

      {/* Editorial Manifesto */}
      <section className="manifesto modern-manifesto">
        <div className="manifesto-mark">AR</div>
        <div className="manifesto-content">
          <div className="eyebrow">Our point of view</div>
          <h2>Less noise.<br /><em>More feeling.</em></h2>
          <p>
            We make pieces that earn their place: enduring shapes, honest materials, and thoughtful details.
            Good clothes should feel effortless from the first wear and get better with time.
          </p>
          <div className="manifesto-cta-row">
            <Link href="/about" className="button-light">
              Meet AR Clothing <span>↗</span>
            </Link>
            <Link href="/shop" className="manifesto-secondary-link">
              Browse full archive ↗
            </Link>
          </div>
        </div>
        <div className="manifesto-side">
          A WARDROBE<br />WITH ROOM<br />TO BREATHE.
        </div>
      </section>

      {/* Modern Studio Newsletter */}
      <section className="newsletter modern-newsletter">
        <div>
          <div className="eyebrow">A note from the studio</div>
          <h2>Good things, <em>occasionally.</em></h2>
          <p>New arrivals, studio notes, and a little quiet inspiration for wearing what you own.</p>
        </div>
        <form className="newsletter-form" action="mailto:www.honeyqureshi@gmail.com" method="get">
          <input
            aria-label="Email address"
            type="email"
            placeholder="Enter your email address..."
            required
          />
          <button type="submit" aria-label="Subscribe to studio newsletter">
            Join us ↗
          </button>
        </form>
      </section>
    </>
  );
}
