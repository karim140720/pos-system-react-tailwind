
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CreditCardIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import useStore, { CUSTOMER_TYPES } from '../store/useStore';

const CustomerForm = ({ customer, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: customer || {
      name: '',
      phone: '',
      email: '',
      type: CUSTOMER_TYPES.IN_SHOP,
      address: '',
      creditLimit: 0,
      currentBalance: 0,
      isActive: true
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="card-header flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {customer ? 'تعديل العميل' : 'عميل جديد'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">اسم العميل *</label>
              <input
                {...register('name', { required: 'اسم العميل مطلوب' })}
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="أدخل اسم العميل"
              />
              {errors.name && (
                <p className="text-danger-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="label">رقم الهاتف *</label>
              <input
                {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                className={`input ${errors.phone ? 'input-error' : ''}`}
                placeholder="+966501234567"
              />
              {errors.phone && (
                <p className="text-danger-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">البريد الإلكتروني</label>
              <input
                {...register('email')}
                type="email"
                className="input"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="label">نوع العميل *</label>
              <select
                {...register('type', { required: 'نوع العميل مطلوب' })}
                className={`input ${errors.type ? 'input-error' : ''}`}
              >
                <option value={CUSTOMER_TYPES.IN_SHOP}>عميل في المحل</option>
                <option value={CUSTOMER_TYPES.TRADING}>عميل تجاري</option>
              </select>
              {errors.type && (
                <p className="text-danger-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">العنوان</label>
            <textarea
              {...register('address')}
              className="input"
              rows={3}
              placeholder="أدخل عنوان العميل"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">حد الائتمان (ج.م)</label>
              <input
                {...register('creditLimit', { valueAsNumber: true })}
                type="number"
                className="input"
                placeholder="0"
              />
            </div>

            <div>
              <label className="label">الرصيد الحالي (ج.م)</label>
              <input
                {...register('currentBalance', { valueAsNumber: true })}
                type="number"
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              {...register('isActive')}
              type="checkbox"
              id="isActive"
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              العميل نشط
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {customer ? 'حفظ التغييرات' : 'إضافة العميل'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const CustomerCard = ({ customer, onEdit, onDelete, onView }) => {
  const getCustomerTypeLabel = (type) => {
    return type === CUSTOMER_TYPES.IN_SHOP ? 'في المحل' : 'تجاري';
  };

  const getCustomerTypeColor = (type) => {
    return type === CUSTOMER_TYPES.IN_SHOP ? 'badge-primary' : 'badge-success';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-medium transition-all duration-300"
    >
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-50 rounded-xl">
              {customer.type === CUSTOMER_TYPES.IN_SHOP ? (
                <UserIcon className="w-6 h-6 text-primary-600" />
              ) : (
                <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <span className={`badge ${getCustomerTypeColor(customer.type)}`}>
                {getCustomerTypeLabel(customer.type)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(customer)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="عرض التفاصيل"
            >
              <EyeIcon className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => onEdit(customer)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="تعديل"
            >
              <PencilIcon className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => onDelete(customer.id)}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              title="حذف"
            >
              <TrashIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4" />
            <span>{customer.phone}</span>
          </div>
          
          {customer.email && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <EnvelopeIcon className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
          )}
          
          {customer.address && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span className="truncate">{customer.address}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <CreditCardIcon className="w-4 h-4" />
            <span>حد الائتمان: {customer.creditLimit.toLocaleString('ar-EG')} ج.م</span>
          </div>

          {customer.currentBalance > 0 && (
            <div className="p-3 bg-warning-50 rounded-lg">
              <p className="text-sm text-warning-800">
                الرصيد المستحق: {customer.currentBalance.toLocaleString('ar-EG')} ج.م
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CustomerPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || customer.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (data) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
    } else {
      addCustomer({
        ...data,
        createdAt: new Date()
      });
    }
    setEditingCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (customerId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      deleteCustomer(customerId);
    }
  };

  const handleView = (customer) => {
    setViewingCustomer(customer);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const closeViewModal = () => {
    setViewingCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-gray-500 mt-1">إدارة عملاء المحل والعملاء التجاريين</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          عميل جديد
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث عن العملاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pr-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input w-auto"
              >
                <option value="all">جميع العملاء</option>
                <option value={CUSTOMER_TYPES.IN_SHOP}>عملاء في المحل</option>
                <option value={CUSTOMER_TYPES.TRADING}>عملاء تجاريون</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">إجمالي العملاء</p>
              <p className="stat-value">{customers.length}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-xl">
              <UserIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">عملاء في المحل</p>
              <p className="stat-value">
                {customers.filter(c => c.type === CUSTOMER_TYPES.IN_SHOP).length}
              </p>
            </div>
            <div className="p-3 bg-success-50 rounded-xl">
              <UserIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">عملاء تجاريون</p>
              <p className="stat-value">
                {customers.filter(c => c.type === CUSTOMER_TYPES.TRADING).length}
              </p>
            </div>
            <div className="p-3 bg-warning-50 rounded-xl">
              <BuildingOfficeIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عملاء</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'لم يتم العثور على عملاء مطابقين للبحث'
              : 'ابدأ بإضافة عميل جديد'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              إضافة عميل جديد
            </button>
          )}
        </div>
      )}

      {/* Customer Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CustomerForm
            customer={editingCustomer}
            onClose={closeForm}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>

      {/* Customer View Modal */}
      <AnimatePresence>
        {viewingCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-strong w-full max-w-lg"
            >
              <div className="card-header flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">تفاصيل العميل</h3>
                <button
                  onClick={closeViewModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="card-body space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {viewingCustomer.type === CUSTOMER_TYPES.IN_SHOP ? (
                      <UserIcon className="w-10 h-10 text-primary-600" />
                    ) : (
                      <BuildingOfficeIcon className="w-10 h-10 text-primary-600" />
                    )}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">{viewingCustomer.name}</h4>
                  <span className={`badge ${viewingCustomer.type === CUSTOMER_TYPES.IN_SHOP ? 'badge-primary' : 'badge-success'}`}>
                    {viewingCustomer.type === CUSTOMER_TYPES.IN_SHOP ? 'عميل في المحل' : 'عميل تجاري'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <span>{viewingCustomer.phone}</span>
                  </div>
                  
                  {viewingCustomer.email && (
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                      <span>{viewingCustomer.email}</span>
                    </div>
                  )}
                  
                  {viewingCustomer.address && (
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="w-5 h-5 text-gray-400" />
                      <span>{viewingCustomer.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="w-5 h-5 text-gray-400" />
                    <span>حد الائتمان: {viewingCustomer.creditLimit.toLocaleString('ar-EG')} ج.م</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">تاريخ الإنشاء:</span>
                    <span>{new Date(viewingCustomer.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerPage;
