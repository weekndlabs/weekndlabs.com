import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Node rather than edge, so the mark can be read off disk. It is the same
// public/logo.svg the favicon and the navbar use, inlined as a data URI because
// the renderer has no origin to fetch a relative path from.
export const runtime = 'nodejs';

export const alt = 'WeekndLabs. Reliable infrastructure for the agentic era.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// @weekndlabs/design 0.4.0, by role.
const GROUND = '#141416'; // background, dark
const SURFACE = '#1C1C1E'; // card, dark
const HAIRLINE = '#3A3A3C'; // border, dark
const INK = '#F5F5F7'; // foreground, dark
const SOFT = '#98989D'; // muted-foreground, dark
const BLUE = '#409CFF'; // ring, dark

export default async function Image() {
  const logo = readFileSync(join(process.cwd(), 'public/logo.svg')).toString('base64');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: GROUND,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/svg+xml;base64,${logo}`} width={88} height={88} alt="" />
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 600, color: INK, letterSpacing: '-0.02em' }}>
            WeekndLabs
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 76,
              fontWeight: 700,
              color: INK,
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Reliable infrastructure for the agentic era.
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: SOFT, marginTop: 28, maxWidth: 860 }}>
            Agent context, LLM routing, pull request automation, macOS performance.
          </div>
        </div>

        {/* One blue mark on the card, and nothing else spends colour. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            alignSelf: 'flex-start',
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 10,
            padding: '14px 22px',
            fontSize: 26,
          }}
        >
          <span style={{ color: BLUE }}>$</span>
          <span style={{ color: INK }}>brew install fajarhide/tap/omni</span>
        </div>
      </div>
    ),
    size
  );
}
