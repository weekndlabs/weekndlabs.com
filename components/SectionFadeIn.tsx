'use client';

import React, { useEffect, useState } from 'react';

interface SectionFadeInProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionFadeIn: React.FC<SectionFadeInProps> = ({ children, className = '', id }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id={id}
      className={`transition-all duration-1000 ease-out transform ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </section>
  );
};
