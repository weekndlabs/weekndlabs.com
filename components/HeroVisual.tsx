'use client';

import dynamic from 'next/dynamic';

// A Server Component cannot ask for ssr: false, and the scene has to stay out of
// the first load: three is bigger than the rest of this page's JavaScript put
// together, and the hero reads fine before it arrives.
const HeroGraph = dynamic(() => import('./HeroGraph'), { ssr: false });

export const HeroVisual = () => <HeroGraph />;
