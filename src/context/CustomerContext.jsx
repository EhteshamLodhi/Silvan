'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CustomerContext = createContext();

async function sendCustomerRequest(payload) {
  const response = await fetch('/api/customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok) {
    throw json;
  }

  return json;
}

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshCustomer() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/customer', { cache: 'no-store' });
      const json = await response.json();
      setCustomer(json.customer || null);
    } catch (error) {
      console.error('Unable to refresh customer session:', error);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshCustomer();
  }, []);

  async function login(email, password) {
    const json = await sendCustomerRequest({ action: 'login', email, password });
    setCustomer(json.customer || null);
    return json;
  }

  async function register(input) {
    const json = await sendCustomerRequest({ action: 'register', ...input });
    setCustomer(json.customer || null);
    return json;
  }

  async function recover(email) {
    return sendCustomerRequest({ action: 'recover', email });
  }

  async function logout() {
    await sendCustomerRequest({ action: 'logout' });
    setCustomer(null);
  }

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isLoading,
        refreshCustomer,
        login,
        register,
        recover,
        logout,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}
