import React from 'react';

interface PrintKhaasLogoProps {
  variant?: 'full' | 'mark' | 'icon' | 'white';
  height?: number | string;
  className?: string;
  alt?: string;
}

export const PrintKhaasLogo: React.FC<PrintKhaasLogoProps> = ({
  variant = 'full',
  height,
  className = '',
  alt = 'Print Khaas Logo',
}) => {
  // If variant is icon only
  if (variant === 'icon') {
    return (
      <img
        src="/logo-icon.svg"
        alt={alt}
        className={`object-contain ${className}`}
        style={height ? { height } : undefined}
      />
    );
  }

  // If variant is white (for dark navy header/footer/backgrounds)
  if (variant === 'white') {
    return (
      <img
        src="/logo-white.svg"
        alt={alt}
        className={`object-contain ${className}`}
        style={height ? { height } : undefined}
      />
    );
  }

  // Default full logo
  return (
    <img
      src="/logo.svg"
      alt={alt}
      className={`object-contain ${className}`}
      style={height ? { height } : undefined}
    />
  );
};
