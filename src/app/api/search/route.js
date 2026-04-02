import { NextResponse } from 'next/server';
import { getPredictiveSearchResults } from '../../../utils/shopify';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q) {
    return NextResponse.json({ products: [], collections: [] });
  }

  const results = await getPredictiveSearchResults(q, 5);
  return NextResponse.json(results);
}
