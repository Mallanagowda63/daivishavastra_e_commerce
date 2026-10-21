import React from 'react';

/** Small round Daivisha Vastra logo marking a photo, top-right. */
export const LogoBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img
    src="/images/daivisha-logo.webp"
    alt=""
    aria-hidden="true"
    className={`absolute top-2.5 right-2.5 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-1 ring-[#d4af37]/70 shadow-md pointer-events-none ${className}`}
  />
);
