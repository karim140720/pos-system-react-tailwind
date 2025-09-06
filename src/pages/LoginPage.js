import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

function LoginPage() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const subscription = useStore((s) => s.subscription);
  const isSubscriptionActive = useStore((s) => s.isSubscriptionActive);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    login({ email, name: 'مالك المتجر' });
    if (isSubscriptionActive()) {
      navigate('/');
    } else {
      navigate('/subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-strong border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">تسجيل الدخول</h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger-50 text-danger-700 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full btn-primary"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;


