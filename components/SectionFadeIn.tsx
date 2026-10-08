import React from 'react';

interface SectionFadeInProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

// A server component on purpose. The reveal is the `.reveal` rule in
// globals.css, so the section is visible in the HTML as sent and no script has
// to run before anyone can read it. See issue #41.
export const SectionFadeIn: React.FC<SectionFadeInProps> = ({ children, className = '', id }) => (
  <section id={id} className={`reveal ${className}`}>
    {children}
  </section>
);
