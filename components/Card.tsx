import React from 'react';

interface CardProps {
  title: string;
  description: string;
  badgeLabel?: string;
  tags?: string[];
  linkHref?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  badgeLabel,
  tags = [],
  linkHref,
  className = ''
}) => {
  const CardContent = (
    <>
      {badgeLabel && (
        <div className="mb-4">
          <span className="inline-block font-mono text-xs text-accent-bright uppercase px-2 py-0.5 border border-accent-bright/30 bg-accent-bright/10 rounded-sm">
            {badgeLabel}
          </span>
        </div>
      )}
      
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-xl font-display text-text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>
        {linkHref && (
          <svg
            className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        )}
      </div>
      
      <p className="text-text-secondary mb-6 flex-grow leading-relaxed group-hover:text-text-primary/90 transition-colors">
        {description}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, idx) => (
            <span key={idx} className="font-mono text-xs text-text-secondary border border-border px-2 py-1 rounded-sm bg-background group-hover:border-accent/30 group-hover:text-accent transition-colors">
              [{tag}]
            </span>
          ))}
        </div>
      )}
    </>
  );

  const containerClasses = `group relative bg-surface border border-border rounded p-6 flex flex-col h-full transition-colors duration-300 hover:border-accent/50 block ${className}`;

  if (linkHref) {
    // Internal routes stay in this tab. Only the cards pointing at another site
    // open a new one, so the same destination behaves the same way whether it is
    // reached from a card or from the nav.
    const isExternal = !linkHref.startsWith('/');
    return (
      <a
        href={linkHref}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={containerClasses}
      >
        {CardContent}
      </a>
    );
  }

  return (
    <div className={containerClasses}>
      {CardContent}
    </div>
  );
};
