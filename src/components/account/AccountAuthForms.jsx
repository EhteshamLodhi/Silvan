'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';

function ErrorList({ errors = [] }) {
  if (!errors.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {errors.map((error, index) => (
        <p key={`${error.message}-${index}`}>{error.message}</p>
      ))}
    </div>
  );
}

export function LoginForm() {
  const { login, recover } = useCustomer();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setMessage('');

    try {
      await login(form.email, form.password);
      window.location.assign('/account');
    } catch (error) {
      setErrors(error.errors || [{ message: error.error || 'Unable to sign in.' }]);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRecover() {
    if (!form.email) {
      setErrors([{ message: 'Enter your email first so we know where to send the reset link.' }]);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setMessage('');

    try {
      const response = await recover(form.email);
      setMessage(response.message);
    } catch (error) {
      setErrors(error.errors || [{ message: error.error || 'Unable to send reset email.' }]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid gap-4">
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
        />
      </div>

      <ErrorList errors={errors} />
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      <button
        type="button"
        onClick={handleRecover}
        disabled={isSubmitting}
        className="w-full rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary disabled:opacity-60"
      >
        Send Password Reset Email
      </button>

      <p className="text-sm text-gray-600">
        New here?{' '}
        <Link href="/account/register" className="font-semibold text-primary">
          Create your account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const { register } = useCustomer();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      await register(form);
      window.location.assign('/account');
    } catch (error) {
      setErrors(error.errors || [{ message: error.error || 'Unable to create account.' }]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="First name"
          value={form.firstName}
          onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
        />
        <input
          type="text"
          placeholder="Last name"
          value={form.lastName}
          onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
        />
      </div>
      <div className="grid gap-4">
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
        />
      </div>

      <ErrorList errors={errors} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/account/login" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
