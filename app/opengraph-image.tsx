import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'WeekndLabs - Agents run here.';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: '#080808',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          border: '10px solid #1E1E1E',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '100px',
            color: '#FFFFFF',
            fontWeight: 700,
            marginBottom: '20px',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#00FFD1', marginRight: '30px' }}>{'>'}</span>
          WeekndLabs
          <span style={{ color: '#00FFD1' }}>_</span>
        </div>
        <div
          style={{
            fontSize: '50px',
            color: '#A3A3A3',
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <span>Agents run here.</span>
          <span style={{ color: '#525252', fontSize: '30px', marginTop: '40px' }}>
            Open-source infrastructure and tools for the agentic AI era.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
