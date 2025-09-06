
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  BanknotesIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import useStore, { PAYMENT_METHODS } from '../store/useStore';

const ExpenseForm = ({ expense, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: expense || {
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().slice(0,10),
      paymentMethod: PAYMENT_METHODS.CASH
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, amount: Number(data.amount), date: new Date(data.date) });
    reset();
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-strong w-full max-w-xl">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">{expense ? 'تعديل المصروف' : 'مصروف جديد'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="card-body space-y-6">
          <div>
            <label className="label">الفئة *</label>
            <input {...register('category', { required: 'الفئة مطلوبة' })} className={`input ${errors.category ? 'input-error' : ''}`} placeholder="مثل: إيجار، مرافق، رواتب" />
            {errors.category && <p className="text-danger-500 text-sm mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="label">الوصف</label>
            <input {...register('description')} className="input" placeholder="تفاصيل المصروف" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">المبلغ (ج.م) *</label>
              <input type="number" step="0.01" {...register('amount', { required: 'المبلغ مطلوب' })} className={`input ${errors.amount ? 'input-error' : ''}`} placeholder="0" />
            </div>
            <div>
              <label className="label">التاريخ *</label>
              <input type="date" {...register('date', { required: 'التاريخ مطلوب' })} className={`input ${errors.date ? 'input-error' : ''}`} />
            </div>
            <div>
              <label className="label">طريقة الدفع *</label>
              <select {...register('paymentMethod', { required: 'طريقة الدفع مطلوبة' })} className={`input ${errors.paymentMethod ? 'input-error' : ''}`}>
                <option value={PAYMENT_METHODS.CASH}>نقداً</option>
                <option value={PAYMENT_METHODS.CARD}>بطاقة</option>
                <option value={PAYMENT_METHODS.BANK_TRANSFER}>تحويل بنكي</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">{expense ? 'حفظ' : 'إضافة'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">إلغاء</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card hover:shadow-medium transition-all duration-300">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger-50 rounded-xl"><CurrencyDollarIcon className="w-6 h-6 text-danger-600" /></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{expense.category}</h3>
              <p className="text-sm text-gray-500">{expense.description || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(expense)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="تعديل"><PencilIcon className="w-4 h-4 text-gray-500" /></button>
            <button onClick={() => onDelete(expense.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="حذف"><TrashIcon className="w-4 h-4 text-red-500" /></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-between"><span>المبلغ</span><span className="font-semibold text-gray-900">{expense.amount.toLocaleString('ar-EG')} ج.م</span></div>
          <div className="flex items-center justify-between"><span>التاريخ</span><span>{new Date(expense.date).toLocaleDateString('ar-EG')}</span></div>
          <div className="flex items-center justify-between"><span>طريقة الدفع</span><span>{expense.paymentMethod}</span></div>
        </div>
      </div>
    </motion.div>
  );
};

const ExpensesPage = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, getTotalExpenses } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.category.toLowerCase().includes(searchTerm.toLowerCase()) || (exp.description && exp.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterMethod === 'all' || exp.paymentMethod === filterMethod;
    return matchesSearch && matchesFilter;
  });

  const total = getTotalExpenses();
  const monthTotal = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + e.amount, 0);

  const handleSubmit = (data) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense({ ...data, createdAt: new Date() });
    }
    setEditingExpense(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المصروفات</h1>
          <p className="text-gray-500 mt-1">تسجيل وتتبع المصروفات اليومية والشهرية</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><PlusIcon className="w-5 h-5" />مصروف جديد</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card"><div className="flex items-center justify-between"><div><p className="stat-label">إجمالي المصروفات</p><p className="stat-value">{total.toLocaleString('ar-EG')} ج.م</p></div><div className="p-3 bg-danger-50 rounded-xl"><CurrencyDollarIcon className="w-6 h-6 text-danger-600" /></div></div></div>
        <div className="stat-card"><div className="flex items-center justify-between"><div><p className="stat-label">مصروفات هذا الشهر</p><p className="stat-value">{monthTotal.toLocaleString('ar-EG')} ج.م</p></div><div className="p-3 bg-primary-50 rounded-xl"><CalendarIcon className="w-6 h-6 text-primary-600" /></div></div></div>
        <div className="stat-card"><div className="flex items-center justify-between"><div><p className="stat-label">عدد السجلات</p><p className="stat-value">{expenses.length}</p></div><div className="p-3 bg-success-50 rounded-xl"><BanknotesIcon className="w-6 h-6 text-success-600" /></div></div></div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="البحث في المصروفات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pr-10" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="input w-auto">
                <option value="all">كل الطرق</option>
                <option value={PAYMENT_METHODS.CASH}>نقداً</option>
                <option value={PAYMENT_METHODS.CARD}>بطاقة</option>
                <option value={PAYMENT_METHODS.BANK_TRANSFER}>تحويل بنكي</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredExpenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onEdit={(e) => { setEditingExpense(e); setShowForm(true); }} onDelete={(id) => { if (window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) deleteExpense(id); }} />
          ))}
        </AnimatePresence>
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <CurrencyDollarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مصروفات</h3>
          <p className="text-gray-500 mb-4">{searchTerm || filterMethod !== 'all' ? 'لا توجد سجلات مطابقة' : 'ابدأ بإضافة مصروف جديد'}</p>
          {!searchTerm && filterMethod === 'all' && (<button onClick={() => setShowForm(true)} className="btn-primary">مصروف جديد</button>)}
        </div>
      )}

      <AnimatePresence>
        {showForm && (<ExpenseForm expense={editingExpense} onClose={() => { setShowForm(false); setEditingExpense(null); }} onSubmit={handleSubmit} />)}
      </AnimatePresence>
    </div>
  );
};

export default ExpensesPage;
