'use client';

import {useEffect,useRef} from 'react';

export default function FlowEffect(){
  const ref=useRef(null);

  useEffect(()=>{
    const bar=ref.current;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame=0;
    let idleTimer;
    const update=()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      const progress=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
      bar.style.transform=`scaleX(${progress})`;
      frame=0;
    };
    const onScroll=()=>{
      if(!frame)frame=requestAnimationFrame(update);
      if(!reduced){
        document.documentElement.classList.add('is-flowing');
        clearTimeout(idleTimer);
        idleTimer=setTimeout(()=>document.documentElement.classList.remove('is-flowing'),420);
      }
    };
    update();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll,{passive:true});
    return()=>{
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
      document.documentElement.classList.remove('is-flowing');
    };
  },[]);

  return <div className="flow-progress" aria-hidden="true"><span ref={ref}/></div>;
}
