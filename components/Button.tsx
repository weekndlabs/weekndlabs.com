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
  const baseClasses = "inline-flex items-center justify-center font-mono text-sm uppercase px-5 py-2.5 min-h-11 transition-colors duration-200 border rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  
  // One weighted button per view, and the rest sit quiet.
  //
  // `filled` is ink rather than the brand colour, which is the whole shape of
  // the 0.4.0 identity: a solid pill in the foreground colour is the only
  // filled control on a page, and the blue is left for links, focus and
  // emphasis. `primary` inverts per theme on its own, so this is black on
  // light and white on dark with no variant of its own.
  const variantClasses = {
    filled: "bg-primary border-primary text-primary-foreground hover:opacity-90 active:opacity-85",
    outlined: "bg-transparent border-border text-foreground hover:border-brand hover:text-brand active:border-brand active:text-brand"
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
