import React from 'react';

interface CardProps {
  title: string;
  description: string;
  /** Shipped version, or the release stage when there is no number yet. */
  version?: string;
  tags?: string[];
  linkHref?: string;
  /** One of the products in focus: bigger type, more room to say why. */
  featured?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  version,
  tags = [],
  linkHref,
  featured = false,
  className = ''
}) => {
  const CardContent = (
    <>
      {/* Version sits on the title's baseline rather than in a badge above it.
          Every card here is shipped, so a row of loud SHIPPED pills carried no
          information; the number is the part that differs. */}
      <div className="flex items-baseline justify-between gap-4">
        <h3
          className={`font-display text-foreground group-hover:text-brand transition-colors ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          {title}
        </h3>
        {version && (
          <span className="font-mono text-xs text-muted-foreground shrink-0">{version}</span>
        )}
      </div>

      <p
        className={`mt-3 text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors ${
          featured ? 'max-w-2xl md:text-lg' : ''
        }`}
      >
        {description}
      </p>

      <div className="mt-auto pt-6 flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs text-muted-foreground border border-border px-2 py-1 rounded-sm bg-background group-hover:border-brand/30 group-hover:text-brand transition-colors"
            >
              [{tag}]
            </span>
          ))}
        </div>
        {linkHref && (
          <svg
            className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-brand transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        )}
      </div>
    </>
  );

  const containerClasses = [
    'group relative flex h-full flex-col rounded-lg border border-border bg-muted p-6',
    'transition-colors duration-300 hover:border-brand/50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    featured ? 'md:p-8' : '',
    className,
  ].join(' ');

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

  return <div className={containerClasses}>{CardContent}</div>;
};
