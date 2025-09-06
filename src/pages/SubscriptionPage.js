import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

function formatCurrencyEGP(amount) {
  try {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  } catch {
    return `${amount} ج.م`;
  }
}

function SubscriptionPage() {
  const navigate = useNavigate();
  const { subscription, setSubscription, isSubscriptionActive } = useStore((s) => ({
    subscription: s.subscription,
    setSubscription: s.setSubscription,
    isSubscriptionActive: s.isSubscriptionActive
  }));
  const [plan, setPlan] = useState(subscription.plan || 'monthly');
  const [isPermanent, setIsPermanent] = useState(subscription.isPermanent || false);

  const price = useMemo(() => (plan === 'monthly' ? 299 : 2990), [plan]);

  const activate = () => {
    if (isPermanent) {
      setSubscription({ status: 'active', isPermanent: true, renewalDate: null, plan });
      navigate('/');
      return;
    }
    const now = new Date();
    const renewal = new Date(now);
    if (plan === 'monthly') {
      renewal.setMonth(renewal.getMonth() + 1);
    } else {
      renewal.setFullYear(renewal.getFullYear() + 1);
    }
    setSubscription({ status: 'active', plan, renewalDate: renewal.toISOString(), isPermanent: false });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-strong border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">الاشتراك</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setPlan('monthly')}
            className={`p-4 rounded-xl border ${plan === 'monthly' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <div className="text-right">
              <p className="font-semibold">شهري</p>
              <p className="text-gray-600 text-sm">ادفع شهريًا ويمكنك الإلغاء في أي وقت</p>
              <p className="text-lg font-bold mt-2">{formatCurrencyEGP(299)}</p>
            </div>
          </button>
          <button
            onClick={() => setPlan('yearly')}
            className={`p-4 rounded-xl border ${plan === 'yearly' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <div className="text-right">
              <p className="font-semibold">سنوي</p>
              <p className="text-gray-600 text-sm">احصل على خصم عند الدفع سنويًا</p>
              <p className="text-lg font-bold mt-2">{formatCurrencyEGP(2990)}</p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 mb-6">
          <div className="text-right">
            <p className="font-semibold">اشتراك دائم</p>
            <p className="text-gray-600 text-sm">دفع لمرة واحدة، بدون تجديد</p>
          </div>
          <input
            type="checkbox"
            checked={isPermanent}
            onChange={(e) => setIsPermanent(e.target.checked)}
            className="h-5 w-5"
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-700">الإجمالي</p>
          <p className="text-xl font-bold">{isPermanent ? formatCurrencyEGP(7990) : formatCurrencyEGP(price)}</p>
        </div>

        <button onClick={activate} className="w-full btn-primary">تفعيل الاشتراك</button>
      </div>
    </div>
  );
}

export default SubscriptionPage;


