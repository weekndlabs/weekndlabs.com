import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WeekndLabs',
    short_name: 'WeekndLabs',
    description: 'WeekndLabs builds developer tools for the agentic era. Five shipped products, open source, built in Indonesia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#12141F',
    theme_color: '#12141F',
    icons: [
      {
        src: '/logo.png',
        sizes: '1024x1024',
        type: 'image/png',
      },
    ],
  };
}
