import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, variables } = body;

    const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
    const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        console.error('Shopify API Error Status:', response.status);
        return NextResponse.json(
            { error: `Shopify responded with status: ${response.status}` },
            { status: response.status }
        );
    }

    const data = await response.json();
    
    // Sometimes GraphQL returns 200 but includes an errors array
    if (data.errors) {
        console.error('Shopify GraphQL Error:', data.errors);
        // We still return 200 so the client can parse the GraphQL errors array 
        // per standard GraphQL conventions, but we log it.
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Shopify Proxy Exception:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching from Shopify', details: error.message },
      { status: 500 }
    );
  }
}
