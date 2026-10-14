import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Daivisha Vastra Luxury Saree',
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-burgundy-950 via-burgundy-900 to-[#1e070d] text-gold-400 p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-gold-500/40 flex items-center justify-center mb-3 bg-burgundy-950/60 shadow-inner">
            <Sparkles className="w-5 h-5 text-gold-400" />
          </div>
          <p className="font-serif text-lg tracking-wider text-ivory">Daivisha Vastra</p>
          <p className="text-xs text-gold-300/80 tracking-widest uppercase mt-1">
            {fallbackTitle || alt || 'Haute Couture Handloom'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#f1e9df] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${props.className || ''}`}
        {...props}
      />
    </div>
  );
};
