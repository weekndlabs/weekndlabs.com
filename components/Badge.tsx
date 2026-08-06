import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'status' | 'product';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'status', className = '' }) => {
  const dotColor = variant === 'status' ? 'bg-green-500' : 'bg-brand-strong';
  const textColor = variant === 'status' ? 'text-muted-foreground' : 'text-brand-strong';
  const borderClass = variant === 'status' ? 'border-border' : 'border-brand-strong/30';
  const bgClass = variant === 'status' ? 'bg-muted' : 'bg-brand-strong/10';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm border ${borderClass} ${bgClass} ${className}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse relative`}>
        <span className={`absolute inset-0 rounded-full ${dotColor} animate-ping opacity-75`}></span>
      </span>
      <span className={`font-mono text-xs uppercase ${textColor}`}>
        {label}
      </span>
    </div>
  );
};
