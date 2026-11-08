'use client';

export default function MarqueeStrip() {
  const items = [
    'CONSIDERED ESSENTIALS',
    'CRAFTED IN JAMMU, INDIA',
    'COMPLIMENTARY SHIPPING OVER ₹9,000',
    'RESPONSIBLE & ORGANIC MATERIALS',
    'DESIGNED TO BE WORN ON REPEAT',
    'WHATSAPP ORDER CONFIRMATION',
    'TIMELESS FORMS'
  ];

  return (
    <div className="marquee-strip-wrap" aria-label="Store features">
      <div className="marquee-strip">
        <div className="marquee-content">
          {items.map((item, i) => (
            <span key={`a-${i}`} className="marquee-item">
              <span>{item}</span>
              <i className="marquee-star">✳</i>
            </span>
          ))}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {items.map((item, i) => (
            <span key={`b-${i}`} className="marquee-item">
              <span>{item}</span>
              <i className="marquee-star">✳</i>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
