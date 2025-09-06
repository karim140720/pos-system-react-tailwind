
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  CubeIcon, 
  CurrencyDollarIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import useStore, { ORDER_STATUS, CUSTOMER_TYPES } from '../store/useStore';

const StatCard = ({ title, value, change, changeType, icon: Icon, color = 'primary', onClick }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="stat-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
          {change && (
            <div className={`stat-change ${changeType === 'positive' ? 'stat-change-positive' : 'stat-change-negative'}`}>
              {changeType === 'positive' ? (
                <ArrowTrendingUpIcon className="w-4 h-4 inline mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 inline mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, path, color = 'primary' }) => {
  const navigate = useNavigate();
  
  const colorClasses = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-warning',
    danger: 'bg-gradient-danger'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="card cursor-pointer group"
      onClick={() => navigate(path)}
    >
      <div className="card-body text-center">
        <div className={`w-16 h-16 ${colorClasses[color]} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
};

const RecentActivityItem = ({ type, title, time, amount, status }) => {
  const { t } = useStore();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-50';
      case 'pending': return 'text-warning-600 bg-warning-50';
      case 'cancelled': return 'text-danger-600 bg-danger-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order': return <DocumentTextIcon className="w-5 h-5" />;
      case 'customer': return <UsersIcon className="w-5 h-5" />;
      case 'expense': return <CurrencyDollarIcon className="w-5 h-5" />;
      default: return <ClockIcon className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="p-2 bg-gray-100 rounded-lg">
        {getTypeIcon(type)}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
      <div className="text-left">
        {amount && <p className="font-semibold text-gray-900">{amount}</p>}
        {status && (
          <span className={`badge ${getStatusColor(status)}`}>
            {status === 'completed' ? t('completed') : 
             status === 'pending' ? t('pending') : 
             status === 'cancelled' ? t('cancelled') : status}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { 
    customers, 
    products, 
    orders, 
    expenses, 
    cashbox, 
    getTotalSales, 
    getTotalExpenses, 
    getProfit, 
    getLowStockProducts,
    t
  } = useStore();

  // Calculate statistics
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === ORDER_STATUS.COMPLETED).length;
  const totalSales = getTotalSales();
  const totalExpenses = getTotalExpenses();
  const profit = getProfit();
  const lowStockCount = getLowStockProducts().length;

  // Sample chart data
  const salesData = [
    { name: t('january'), sales: 12000, orders: 45 },
    { name: t('february'), sales: 15000, orders: 52 },
    { name: t('march'), sales: 18000, orders: 48 },
    { name: t('april'), sales: 16000, orders: 55 },
    { name: t('may'), sales: 20000, orders: 62 },
    { name: t('june'), sales: 22000, orders: 58 }
  ];

  const categoryData = [
    { name: t('safetyEquipment'), value: 45, color: '#3B82F6' },
    { name: t('tradingSupplies'), value: 25, color: '#10B981' },
    { name: t('tools'), value: 20, color: '#F59E0B' },
    { name: t('consumables'), value: 10, color: '#EF4444' }
  ];

  const recentActivities = [
    {
      type: 'order',
      title: `${t('newOrderFrom')} ${t('ahmedMohamed')}`,
      time: t('minutesAgo'),
      amount: `488.75 ${t('currency')}`,
      status: 'completed'
    },
    {
      type: 'customer',
      title: `${t('newCustomerAdded')} ${t('advancedConstruction')}`,
      time: t('hourAgo'),
      amount: null,
      status: null
    },
    {
      type: 'expense',
      title: t('electricityBill'),
      time: t('daysAgo'),
      amount: `800 ${t('currency')}`,
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: t('newCustomer'),
      description: t('addNewCustomer'),
      icon: PlusIcon,
      path: '/customers?action=new',
      color: 'primary'
    },
    {
      title: t('newInvoice'),
      description: t('createNewInvoice'),
      icon: DocumentTextIcon,
      path: '/invoices?action=new',
      color: 'success'
    },
    {
      title: t('newProduct'),
      description: t('addNewProduct'),
      icon: CubeIcon,
      path: '/inventory?action=new',
      color: 'warning'
    },
    {
      title: t('newExpense'),
      description: t('addNewExpense'),
      icon: CurrencyDollarIcon,
      path: '/expenses?action=new',
      color: 'danger'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-500 mt-1">{t('welcomeMessage')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">{t('lastUpdate')}</p>
            <p className="font-medium text-gray-900">
              {new Date().toLocaleTimeString('ar-EG')}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('totalSales')}
          value={`${totalSales.toLocaleString('ar-EG')} ${t('currency')}`}
          change="+12.5%"
          changeType="positive"
          icon={ArrowTrendingUpIcon}
          color="success"
        />
        <StatCard
          title={t('totalCustomers')}
          value={totalCustomers.toLocaleString('ar-EG')}
          change="+8.2%"
          changeType="positive"
          icon={UsersIcon}
          color="primary"
        />
        <StatCard
          title={t('completedOrders')}
          value={`${completedOrders}/${totalOrders}`}
          change="+15.3%"
          changeType="positive"
          icon={CheckCircleIcon}
          color="success"
        />
        <StatCard
          title={t('lowStockProducts')}
          value={lowStockCount.toLocaleString('ar-EG')}
          change={lowStockCount > 0 ? t('attention') : t('excellent')}
          changeType={lowStockCount > 0 ? "negative" : "positive"}
          icon={ExclamationTriangleIcon}
          color={lowStockCount > 0 ? "danger" : "success"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">{t('salesChart')}</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toLocaleString('ar-EG')} ${name === 'sales' ? t('currency') : 'طلب'}`,
                    name === 'sales' ? t('sales') : t('orders')
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">{t('categoryDistribution')}</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quickActions')}</h3>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                path={action.path}
                color={action.color}
              />
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('recentActivity')}</h3>
          <div className="card">
            <div className="card-body p-0">
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <RecentActivityItem
                    key={index}
                    type={activity.type}
                    title={activity.title}
                    time={activity.time}
                    amount={activity.amount}
                    status={activity.status}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard
          title={t('currentCashboxBalance')}
          value={`${cashbox.currentBalance.toLocaleString('ar-EG')} ${t('currency')}`}
          change={`+2,500 ${t('currency')}`}
          changeType="positive"
          icon={BanknotesIcon}
          color="success"
        />
        <StatCard
          title={t('totalExpenses')}
          value={`${totalExpenses.toLocaleString('ar-EG')} ${t('currency')}`}
          change="+5.8%"
          changeType="negative"
          icon={CurrencyDollarIcon}
          color="danger"
        />
        <StatCard
          title={t('netProfit')}
          value={`${profit.toLocaleString('ar-EG')} ${t('currency')}`}
          change="+18.2%"
          changeType="positive"
          icon={ChartBarIcon}
          color="primary"
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
