import { llmsTxt } from '@/lib/site';

// Static: the catalog only changes with a deploy.
export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
