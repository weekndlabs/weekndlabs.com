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
  
  const variantClasses = {
    filled: "bg-accent-cyan border-accent-cyan text-background hover:bg-transparent hover:text-accent-cyan",
    outlined: "bg-transparent border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-background"
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
