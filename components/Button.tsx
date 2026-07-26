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
  const baseClasses = "inline-flex items-center justify-center font-mono text-sm uppercase px-5 py-2.5 transition-colors duration-200 border rounded-sm focus:outline-none";
  
  // Bubo and Omni both keep one weighted button per view and let the rest sit
  // quiet. Amber is the emphasis, so only `filled` spends it by default.
  const variantClasses = {
    filled: "bg-accent border-accent text-background hover:bg-accent-bright hover:border-accent-bright",
    outlined: "bg-transparent border-border text-text-primary hover:border-accent hover:text-accent"
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
