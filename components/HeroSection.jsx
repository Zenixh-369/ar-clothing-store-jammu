'use client';

import {useRef,useState} from 'react';
import Link from 'next/link';

const LOOKS=[
  {id:'01',title:'THE SOFT STRUCTURE EDIT',headline:'Wear the\nfeeling.',intro:'An easier kind of considered. Thoughtfully made clothing for the days that make up your life.',image:'/ar-storefront.png'},
  {id:'02',title:'RELAXED LINEN & FLOW',headline:'Space to\nbreathe.',intro:'Airy European linen with an easy drape and relaxed posture for slow mornings and warm evenings.',image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90'},
  {id:'03',title:'THE LAYERED UTILITY EDIT',headline:'Quietly\nconfident.',intro:'Substantial cotton twill and heavyweight canvases. Structured layers with details you notice over time.',image:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=90'}
];

export default function HeroSection(){
  const[activeLookIndex,setActiveLookIndex]=useState(0);
  const containerRef=useRef(null);
  const activeLook=LOOKS[activeLookIndex];
  const handleMouseMove=e=>{if(!containerRef.current)return;const rect=containerRef.current.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5;const y=(e.clientY-rect.top)/rect.height-.5;containerRef.current.style.setProperty('--tilt-x',`${-y*8}deg`);containerRef.current.style.setProperty('--tilt-y',`${x*10}deg`)};
  const handleMouseLeave=()=>{if(!containerRef.current)return;containerRef.current.style.setProperty('--tilt-x','0deg');containerRef.current.style.setProperty('--tilt-y','0deg')};

  return <section className={`hero modern-hero ${activeLookIndex===0?'hero-storefront':''}`}><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/>Jammu, India · Everyday, considered</div><h1 key={activeLook.headline} className="hero-headline-animated">{activeLook.headline.split('\n')[0]}<br/><em>{activeLook.headline.split('\n')[1]}</em></h1><p className="hero-intro">{activeLook.intro}</p><div className="hero-actions"><Link className="button-dark" href="/shop">Explore collection <span>↗</span></Link><div className="hero-look-switcher"><span className="hero-look-label">Curated Looks:</span><div className="hero-look-dots">{LOOKS.map((look,idx)=><button key={look.id} type="button" className={`hero-look-btn ${idx===activeLookIndex?'active':''}`} onClick={()=>setActiveLookIndex(idx)} aria-label={`Switch to Look ${look.id}`}><span>{look.id}</span></button>)}</div></div></div><div className="hero-stamp"><span>AR</span><small>EVERYDAY<br/>UNIFORM</small></div></div><div className="hero-image-wrap modern-hero-wrap" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}><img key={activeLook.image} className="hero-image modern-hero-img" src={activeLook.image} alt={activeLook.title}/><div className="hero-image-shade"/>{activeLookIndex===0&&<><div className="hero-storefront-glow"/><div className="hero-storefront-mark"><span>AR</span><small>JAMMU<br/>EST. 2025</small></div></>}<div className="hero-image-label"><span>LOOK {activeLook.id} / 03</span><span>{activeLook.title}</span></div><div className="hero-orbit"><span>MADE TO MOVE · MADE TO LAST · </span></div></div><div className="hero-index">AR CLOTHING <span>—</span> {activeLook.id}</div></section>;
}
