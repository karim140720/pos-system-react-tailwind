
import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import useStore, { ORDER_STATUS, PRODUCT_CATEGORIES } from '../store/useStore';

const ReportsPage = () => {
  const { orders, expenses, products } = useStore();

  const months = ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'];

  const salesByMonth = Array.from({ length: 12 }, (_, i) => {
    const total = orders
      .filter(o => o.status === ORDER_STATUS.COMPLETED && new Date(o.createdAt).getMonth() === i)
      .reduce((s, o) => s + o.total, 0);
    const exp = expenses
      .filter(e => new Date(e.date).getMonth() === i)
      .reduce((s, e) => s + e.amount, 0);
    return { name: months[i], sales: total, expenses: exp };
  });

  const categoryCounts = Object.values(PRODUCT_CATEGORIES).map(cat => ({
    name: cat === PRODUCT_CATEGORIES.SAFETY_EQUIPMENT ? 'معدات الأمان' : cat === PRODUCT_CATEGORIES.TRADING_SUPPLIES ? 'مستلزمات التجارة' : cat === PRODUCT_CATEGORIES.TOOLS ? 'أدوات' : 'مستهلكات',
    value: products.filter(p => p.category === cat).length
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">التقارير والتحليلات</h1>
        <p className="text-gray-500 mt-1">تحليل المبيعات والمصروفات وتوزيع المنتجات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h3 className="text-lg font-semibold text-gray-900">المبيعات مقابل المصروفات (12 شهر)</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v, n) => [`${v.toLocaleString('ar-EG')} ج.م`, n === 'sales' ? 'المبيعات' : 'المصروفات']} />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="text-lg font-semibold text-gray-900">توزيع المنتجات حسب الفئة</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={categoryCounts} dataKey="value" cx="50%" cy="50%" outerRadius={110} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryCounts.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}`, 'عدد المنتجات']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="text-lg font-semibold text-gray-900">أفضل المنتجات (حسب المخزون)</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={[...products].sort((a,b) => b.stock - a.stock).slice(0,8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
