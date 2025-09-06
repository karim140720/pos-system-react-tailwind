import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PrinterIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import useStore, { ORDER_STATUS, PAYMENT_METHODS, CUSTOMER_TYPES } from '../store/useStore';

const InvoiceForm = ({ order, onClose, onSubmit }) => {
  const { customers, products, addOrder, updateOrder } = useStore();
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: order || {
      customerId: '',
      items: [{ productId: '', quantity: 1, price: 0 }],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      paymentMethod: PAYMENT_METHODS.CASH,
      status: ORDER_STATUS.PENDING,
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedCustomerId = watch('customerId');

  const selectedCustomer = customers.find(c => c.id === parseInt(watchedCustomerId));

  // Calculate totals
  const subtotal = watchedItems.reduce((sum, item) => {
    const product = products.find(p => p.id === parseInt(item.productId));
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const tax = subtotal * 0.15; // 15% VAT
  const discount = watch('discount') || 0;
  const total = subtotal + tax - discount;

  // Update totals when items change
  React.useEffect(() => {
    setValue('subtotal', subtotal);
    setValue('tax', tax);
    setValue('total', total);
  }, [subtotal, tax, total, setValue]);

  const handleProductChange = (index, productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      setValue(`items.${index}.price`, product.price);
    }
  };

  const handleFormSubmit = (data) => {
    const orderData = {
      ...data,
      customerId: parseInt(data.customerId),
      customerName: selectedCustomer?.name || 'عميل غير محدد',
      items: data.items.map(item => ({
        ...item,
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        total: parseFloat(item.price) * parseInt(item.quantity),
        name: products.find(p => p.id === parseInt(item.productId))?.name || ''
      })),
      subtotal: parseFloat(data.subtotal),
      tax: parseFloat(data.tax),
      discount: parseFloat(data.discount),
      total: parseFloat(data.total),
      createdAt: order ? order.createdAt : new Date(),
      completedAt: data.status === ORDER_STATUS.COMPLETED ? new Date() : null
    };

    if (order) {
      updateOrder(order.id, orderData);
    } else {
      addOrder(orderData);
    }
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
        className="bg-white rounded-2xl shadow-strong w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="card-header flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {order ? 'تعديل الفاتورة' : 'فاتورة جديدة'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="card-body space-y-6">
          {/* Customer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">العميل *</label>
              <select
                {...register('customerId', { required: 'العميل مطلوب' })}
                className={`input ${errors.customerId ? 'input-error' : ''}`}
              >
                <option value="">اختر العميل</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.type === CUSTOMER_TYPES.IN_SHOP ? 'في المحل' : 'تجاري'}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-danger-500 text-sm mt-1">{errors.customerId.message}</p>
              )}
            </div>

            <div>
              <label className="label">طريقة الدفع *</label>
              <select
                {...register('paymentMethod', { required: 'طريقة الدفع مطلوبة' })}
                className={`input ${errors.paymentMethod ? 'input-error' : ''}`}
              >
                <option value={PAYMENT_METHODS.CASH}>نقداً</option>
                <option value={PAYMENT_METHODS.CARD}>بطاقة ائتمان</option>
                <option value={PAYMENT_METHODS.BANK_TRANSFER}>تحويل بنكي</option>
                <option value={PAYMENT_METHODS.CREDIT}>آجل</option>
              </select>
              {errors.paymentMethod && (
                <p className="text-danger-500 text-sm mt-1">{errors.paymentMethod.message}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">المنتجات</h4>
              <button
                type="button"
                onClick={() => append({ productId: '', quantity: 1, price: 0 })}
                className="btn-primary flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                إضافة منتج
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="md:col-span-2">
                    <label className="label">المنتج</label>
                    <select
                      {...register(`items.${index}.productId`, { required: 'المنتج مطلوب' })}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      className="input"
                    >
                      <option value="">اختر المنتج</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.price} ج.م
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">الكمية</label>
                    <input
                      {...register(`items.${index}.quantity`, { 
                        required: 'الكمية مطلوبة',
                        min: { value: 1, message: 'الكمية يجب أن تكون أكبر من 0' }
                      })}
                      type="number"
                      min="1"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">السعر</label>
                    <input
                      {...register(`items.${index}.price`, { required: 'السعر مطلوب' })}
                      type="number"
                      step="0.01"
                      className="input"
                      readOnly
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn-danger p-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-semibold">{subtotal.toLocaleString('ar-EG')} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الضريبة (15%):</span>
                  <span className="font-semibold">{tax.toLocaleString('ar-EG')} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الخصم:</span>
                  <input
                    {...register('discount')}
                    type="number"
                    step="0.01"
                    className="input w-24 text-left"
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>المجموع الكلي:</span>
                  <span className="text-primary-600">{total.toLocaleString('ar-EG')} ج.م</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label">حالة الطلب</label>
                  <select
                    {...register('status')}
                    className="input"
                  >
                    <option value={ORDER_STATUS.PENDING}>معلق</option>
                    <option value={ORDER_STATUS.CONFIRMED}>مؤكد</option>
                    <option value={ORDER_STATUS.PROCESSING}>قيد المعالجة</option>
                    <option value={ORDER_STATUS.COMPLETED}>مكتمل</option>
                    <option value={ORDER_STATUS.CANCELLED}>ملغي</option>
                  </select>
                </div>

                <div>
                  <label className="label">ملاحظات</label>
                  <textarea
                    {...register('notes')}
                    className="input"
                    rows={3}
                    placeholder="ملاحظات إضافية..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {order ? 'حفظ التغييرات' : 'إنشاء الفاتورة'}
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

const OrderCard = ({ order, onEdit, onView, onPrint }) => {
  const { getCustomerById } = useStore();
  const customer = getCustomerById(order.customerId);

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.COMPLETED: return 'badge-success';
      case ORDER_STATUS.PENDING: return 'badge-warning';
      case ORDER_STATUS.CONFIRMED: return 'badge-primary';
      case ORDER_STATUS.PROCESSING: return 'badge-primary';
      case ORDER_STATUS.CANCELLED: return 'badge-danger';
      default: return 'badge-gray';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case ORDER_STATUS.COMPLETED: return 'مكتمل';
      case ORDER_STATUS.PENDING: return 'معلق';
      case ORDER_STATUS.CONFIRMED: return 'مؤكد';
      case ORDER_STATUS.PROCESSING: return 'قيد المعالجة';
      case ORDER_STATUS.CANCELLED: return 'ملغي';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case PAYMENT_METHODS.CASH: return 'نقداً';
      case PAYMENT_METHODS.CARD: return 'بطاقة ائتمان';
      case PAYMENT_METHODS.BANK_TRANSFER: return 'تحويل بنكي';
      case PAYMENT_METHODS.CREDIT: return 'آجل';
      default: return method;
    }
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
              <DocumentTextIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                فاتورة #{order.id}
              </h3>
              <p className="text-sm text-gray-500">{customer?.name || 'عميل غير محدد'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(order)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="عرض التفاصيل"
            >
              <EyeIcon className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => onPrint(order)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="طباعة"
            >
              <PrinterIcon className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => onEdit(order)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="تعديل"
            >
              <PencilIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">المجموع الكلي:</span>
            <span className="font-semibold text-lg text-gray-900">
              {order.total.toLocaleString('ar-EG')} ج.م
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">طريقة الدفع:</span>
            <span className="text-sm font-medium">{getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">التاريخ:</span>
            <span className="text-sm">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">الحالة:</span>
            <span className={`badge ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm text-gray-500">المنتجات:</p>
            <div className="mt-2 space-y-1">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.quantity} × {item.price} ج.م</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-xs text-gray-400">
                  و {order.items.length - 2} منتج آخر...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InvoicePage = () => {
  const { orders, addOrder, updateOrder } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingOrder, setViewingOrder] = useState(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (data) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, data);
    } else {
      addOrder(data);
    }
    setEditingOrder(null);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleView = (order) => {
    setViewingOrder(order);
  };

  const handlePrint = (order) => {
    // Print functionality would be implemented here
    console.log('Printing order:', order);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const closeViewModal = () => {
    setViewingOrder(null);
  };

  const totalSales = orders
    .filter(order => order.status === ORDER_STATUS.COMPLETED)
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(order => order.status === ORDER_STATUS.PENDING).length;
  const completedOrders = orders.filter(order => order.status === ORDER_STATUS.COMPLETED).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الفواتير</h1>
          <p className="text-gray-500 mt-1">إدارة فواتير البيع والطلبات</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          فاتورة جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">إجمالي المبيعات</p>
              <p className="stat-value">{totalSales.toLocaleString('ar-EG')} ج.م</p>
            </div>
            <div className="p-3 bg-success-50 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">الطلبات المعلقة</p>
              <p className="stat-value">{pendingOrders}</p>
            </div>
            <div className="p-3 bg-warning-50 rounded-xl">
              <ClockIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">الطلبات المكتملة</p>
              <p className="stat-value">{completedOrders}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-xl">
              <CheckCircleIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
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
                  placeholder="البحث في الفواتير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pr-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input w-auto"
              >
                <option value="all">جميع الحالات</option>
                <option value={ORDER_STATUS.PENDING}>معلق</option>
                <option value={ORDER_STATUS.CONFIRMED}>مؤكد</option>
                <option value={ORDER_STATUS.PROCESSING}>قيد المعالجة</option>
                <option value={ORDER_STATUS.COMPLETED}>مكتمل</option>
                <option value={ORDER_STATUS.CANCELLED}>ملغي</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={handleEdit}
              onView={handleView}
              onPrint={handlePrint}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فواتير</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'لم يتم العثور على فواتير مطابقة للبحث'
              : 'ابدأ بإنشاء فاتورة جديدة'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              إنشاء فاتورة جديدة
            </button>
          )}
        </div>
      )}

      {/* Invoice Form Modal */}
      <AnimatePresence>
        {showForm && (
          <InvoiceForm
            order={editingOrder}
            onClose={closeForm}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoicePage;