import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'filled', 
  href, 
  className = '', 
  children, 
  ...props 
}) => {
  // min-h-11 keeps every call to action at a thumb-sized tap target on phones.
  // The focus ring is not decoration: without it a keyboard user cannot see
  // where they are, which is what the bare focus:outline-none used to cost.
  const baseClasses = "inline-flex items-center justify-center font-mono text-sm uppercase px-5 py-2.5 min-h-11 transition-colors duration-200 border rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  
  // Bubo and Omni both keep one weighted button per view and let the rest sit
  // quiet. Amber is the emphasis, so only `filled` spends it by default.
  const variantClasses = {
    filled: "bg-accent border-accent text-background hover:bg-accent-bright hover:border-accent-bright active:bg-accent-bright active:border-accent-bright",
    outlined: "bg-transparent border-border text-text-primary hover:border-accent hover:text-accent active:border-accent active:text-accent"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
