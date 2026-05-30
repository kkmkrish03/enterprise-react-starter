import React, { useState } from 'react';
import { useAuth } from '@bare-bodhika/core';
import { useNavigate } from 'react-router';
import { Button, InputField } from '@bare-bodhika/ui';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/'); // Redirect to dashboard
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <InputField
          id="email-address"
          name="email"
          type="email"
          label="Email address"
          required
          placeholder="e.g. admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startIcon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />
        <InputField
          id="password"
          name="password"
          type="password"
          isPassword
          label="Password"
          required
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startIcon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
      </div>

      {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}

      <div>
        <Button
          type="submit"
          className="w-full py-2.5"
          isLoading={loading}
        >
          Sign in
        </Button>
      </div>
      <div className="text-xs text-center text-gray-500 dark:text-gray-400">
        Demo: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">admin@example.com</code> / <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">password</code>
      </div>
    </form>
  );
};
export default Login;
