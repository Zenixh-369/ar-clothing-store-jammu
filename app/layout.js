import './globals.css';
import SiteHeader, { SiteFooter } from '../components/SiteChrome';
import FloatingCursor from '../components/FloatingCursor';
import FlowEffect from '../components/FlowEffect';
import QuickViewModal from '../components/QuickViewModal';
import CartDrawer from '../components/CartDrawer';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'AR Clothing — Considered Essentials',
  description: 'Modern everyday clothing, thoughtfully considered and made to last. Based in Jammu, India.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <QuickViewModal />
        <CartDrawer />
        <FloatingCursor />
        <FlowEffect />
        <Analytics />
      </body>
    </html>
  );
}
