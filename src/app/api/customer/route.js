import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  createCustomer,
  createCustomerAccessToken,
  deleteCustomerAccessToken,
  getCustomerByAccessToken,
  recoverCustomerAccount,
} from '../../../utils/shopify';

const CUSTOMER_TOKEN_COOKIE = 'shopify_customer_access_token';
const CUSTOMER_TOKEN_EXPIRES_COOKIE = 'shopify_customer_access_token_expires';

function clearSession(response) {
  response.cookies.set(CUSTOMER_TOKEN_COOKIE, '', {
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  response.cookies.set(CUSTOMER_TOKEN_EXPIRES_COOKIE, '', {
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  return response;
}

async function getStoredToken() {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value || null;
}

export async function GET() {
  const token = await getStoredToken();
  if (!token) {
    return NextResponse.json({ customer: null });
  }

  const customer = await getCustomerByAccessToken(token);
  if (!customer) {
    return clearSession(NextResponse.json({ customer: null }));
  }

  return NextResponse.json({ customer });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { action } = payload;

    if (action === 'login') {
      const result = await createCustomerAccessToken({
        email: payload.email,
        password: payload.password,
      });

      if (result?.customerUserErrors?.length) {
        return NextResponse.json({ errors: result.customerUserErrors }, { status: 400 });
      }

      const token = result?.customerAccessToken?.accessToken;
      const expiresAt = result?.customerAccessToken?.expiresAt;
      const customer = await getCustomerByAccessToken(token);

      const response = NextResponse.json({ customer });
      response.cookies.set(CUSTOMER_TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });
      response.cookies.set(CUSTOMER_TOKEN_EXPIRES_COOKIE, expiresAt, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }

    if (action === 'register') {
      const created = await createCustomer({
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
      });

      if (created?.customerUserErrors?.length) {
        return NextResponse.json({ errors: created.customerUserErrors }, { status: 400 });
      }

      const result = await createCustomerAccessToken({
        email: payload.email,
        password: payload.password,
      });

      if (result?.customerUserErrors?.length) {
        return NextResponse.json({ errors: result.customerUserErrors }, { status: 400 });
      }

      const token = result?.customerAccessToken?.accessToken;
      const expiresAt = result?.customerAccessToken?.expiresAt;
      const customer = await getCustomerByAccessToken(token);

      const response = NextResponse.json({ customer });
      response.cookies.set(CUSTOMER_TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });
      response.cookies.set(CUSTOMER_TOKEN_EXPIRES_COOKIE, expiresAt, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }

    if (action === 'recover') {
      const result = await recoverCustomerAccount(payload.email);
      if (result?.customerUserErrors?.length) {
        return NextResponse.json({ errors: result.customerUserErrors }, { status: 400 });
      }

      return NextResponse.json({
        ok: true,
        message: 'If the customer exists, a password reset email has been sent.',
      });
    }

    if (action === 'logout') {
      const token = await getStoredToken();
      if (token) {
        await deleteCustomerAccessToken(token);
      }

      return clearSession(NextResponse.json({ ok: true }));
    }

    return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to complete customer request.', details: error.message },
      { status: 500 },
    );
  }
}
