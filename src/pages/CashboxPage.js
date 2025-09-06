
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BanknotesIcon, ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import useStore from '../store/useStore';

const CashboxPage = () => {
  const { cashbox, updateCashbox } = useStore();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleCashIn = () => {
    const value = parseFloat(amount || '0');
    if (value <= 0) return;
    updateCashbox({ currentBalance: cashbox.currentBalance + value, dailySales: (cashbox.dailySales || 0) + value });
    setAmount('');
    setNote('');
  };

  const handleCashOut = () => {
    const value = parseFloat(amount || '0');
    if (value <= 0) return;
    updateCashbox({ currentBalance: cashbox.currentBalance - value, dailyExpenses: (cashbox.dailyExpenses || 0) + value });
    setAmount('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الخزنة</h1>
          <p className="text-gray-500 mt-1">إدارة الرصيد النقدي اليومي</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card"><div className="flex items-center justify-between"><div><p className="stat-label">الرصيد الافتتاحي</p><p className="stat-value">{cashbox.openingBalance.toLocaleString('ar-EG')} ج.م</p></div><div className="p-3 bg-primary-50 rounded-xl"><BanknotesIcon className="w-6 h-6 text-primary-600" /></div></div></div>
        <div className="stat-card"><div className="flex items-center justify-between"><div><p className="stat-label">الرصيد الحالي</p><p className="stat-value">{cashbox.currentBalance.toLocaleString('ar-EG')} ج.م</p></div><div className="p-3 bg-success-50 rounded-xl"><BanknotesIcon className="w-6 h-6 text-success-600" /></div></div></div>
        <div className="stat-card"><div className="flex items-center justify-between"><div><p className="stat-label">آخر تحديث</p><p className="stat-value text-base">{new Date(cashbox.lastUpdated).toLocaleTimeString('ar-EG')}</p></div><div className="p-3 bg-warning-50 rounded-xl"><BanknotesIcon className="w-6 h-6 text-warning-600" /></div></div></div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="text-lg font-semibold text-gray-900">عملية على الخزنة</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">المبلغ</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input" placeholder="0" />
            </div>
            <div className="md:col-span-2">
              <label className="label">ملاحظة</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} className="input" placeholder="سبب العملية" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleCashIn} className="btn-success inline-flex gap-2 items-center"><ArrowDownCircleIcon className="w-5 h-5" />إيداع</button>
            <button onClick={handleCashOut} className="btn-danger inline-flex gap-2 items-center"><ArrowUpCircleIcon className="w-5 h-5" />سحب</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashboxPage;
