import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'status' | 'product';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'status', className = '' }) => {
  // `success` rather than a raw green: the design package owns every colour on
  // this site, and it is the only palette the contrast gate can see.
  const dotColor = variant === 'status' ? 'bg-success' : 'bg-brand-strong';
  const textColor = variant === 'status' ? 'text-muted-foreground' : 'text-brand-strong';
  const borderClass = variant === 'status' ? 'border-border' : 'border-brand-strong/30';
  const bgClass = variant === 'status' ? 'bg-background' : 'bg-brand-strong/10';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${borderClass} ${bgClass} ${className}`}>
      {/* The ping is the only thing on the page that moves on its own, so it is
          also the only thing that has to opt out of reduced motion. */}
      <span className={`relative h-2 w-2 rounded-full ${dotColor} animate-pulse motion-reduce:animate-none`}>
        <span className={`absolute inset-0 rounded-full ${dotColor} animate-ping opacity-75 motion-reduce:animate-none`}></span>
      </span>
      <span className={`font-mono text-xs uppercase ${textColor}`}>
        {label}
      </span>
    </div>
  );
};
