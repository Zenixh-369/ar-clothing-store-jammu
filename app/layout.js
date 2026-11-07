import './globals.css';import SiteHeader,{SiteFooter} from '../components/SiteChrome';import FloatingCursor from '../components/FloatingCursor';import {Analytics} from '@vercel/analytics/react';
export const metadata={title:'AR Clothing — Considered essentials',description:'Modern everyday clothing, thoughtfully considered and made to last.'};
export default function RootLayout({children}){return <html lang="en"><body><SiteHeader/><main>{children}</main><SiteFooter/><FloatingCursor/><Analytics/></body></html>}
