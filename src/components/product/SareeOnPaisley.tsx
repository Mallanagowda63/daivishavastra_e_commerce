import React from 'react';

/** A saree photo set on the cream paisley backdrop with a soft glow and shadow, used on saree cards. */
export const SareeOnPaisley: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => (
  <div className={`relative w-full h-full overflow-hidden bg-[#fbf3e6] bg-[url('/images/saree-bg.webp')] bg-cover bg-center ${className}`}>
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse at center, rgba(255,250,240,0.8) 0%, rgba(255,250,240,0.35) 45%, transparent 72%)' }}
    />
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-[7%] w-[86%] h-[86%] object-contain drop-shadow-[0_14px_16px_rgba(70,40,10,0.35)] transition-transform duration-700 group-hover:scale-105"
    />
  </div>
);
