
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import useStore, { PRODUCT_CATEGORIES } from '../store/useStore';

const ProductForm = ({ product, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: product || {
      name: '',
      category: PRODUCT_CATEGORIES.SAFETY_EQUIPMENT,
      sku: '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      supplier: '',
      description: '',
      isActive: true
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      cost: Number(data.cost),
      stock: Number(data.stock),
      minStock: Number(data.minStock)
    });
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
        className="bg-white rounded-2xl shadow-strong w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="card-header flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {product ? 'تعديل المنتج' : 'منتج جديد'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">اسم المنتج *</label>
              <input {...register('name', { required: 'اسم المنتج مطلوب' })} className={`input ${errors.name ? 'input-error' : ''}`} placeholder="أدخل اسم المنتج" />
              {errors.name && <p className="text-danger-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">الفئة *</label>
              <select {...register('category', { required: 'الفئة مطلوبة' })} className={`input ${errors.category ? 'input-error' : ''}`}>
                <option value={PRODUCT_CATEGORIES.SAFETY_EQUIPMENT}>معدات الأمان</option>
                <option value={PRODUCT_CATEGORIES.TRADING_SUPPLIES}>مستلزمات التجارة</option>
                <option value={PRODUCT_CATEGORIES.TOOLS}>أدوات</option>
                <option value={PRODUCT_CATEGORIES.CONSUMABLES}>مستهلكات</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">SKU</label>
              <input {...register('sku')} className="input" placeholder="HELMET-001" />
            </div>
            <div>
              <label className="label">سعر البيع (ج.م) *</label>
              <input type="number" step="0.01" {...register('price', { required: 'السعر مطلوب' })} className={`input ${errors.price ? 'input-error' : ''}`} placeholder="0" />
            </div>
            <div>
              <label className="label">سعر التكلفة (ج.م)</label>
              <input type="number" step="0.01" {...register('cost')} className="input" placeholder="0" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">المخزون الحالي *</label>
              <input type="number" {...register('stock', { required: 'المخزون مطلوب' })} className={`input ${errors.stock ? 'input-error' : ''}`} placeholder="0" />
            </div>
            <div>
              <label className="label">حد إعادة الطلب *</label>
              <input type="number" {...register('minStock', { required: 'حد إعادة الطلب مطلوب' })} className={`input ${errors.minStock ? 'input-error' : ''}`} placeholder="0" />
            </div>
            <div>
              <label className="label">المورد</label>
              <input {...register('supplier')} className="input" placeholder="اسم المورد" />
            </div>
          </div>

          <div>
            <label className="label">الوصف</label>
            <textarea {...register('description')} className="input" rows={3} placeholder="وصف المنتج" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">المنتج مفعل</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">{product ? 'حفظ التغييرات' : 'إضافة المنتج'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">إلغاء</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ProductCard = ({ product, onEdit, onDelete }) => {
  const lowStock = product.stock <= product.minStock;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card hover:shadow-medium transition-all duration-300">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-50 rounded-xl">
              <CubeIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <TagIcon className="w-4 h-4" />
                <span>{product.sku || 'بدون SKU'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(product)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="تعديل">
              <PencilIcon className="w-4 h-4 text-gray-500" />
            </button>
            <button onClick={() => onDelete(product.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="حذف">
              <TrashIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>السعر</span>
            <span className="font-medium text-gray-900">{product.price.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <div className="flex items-center justify-between">
            <span>التكلفة</span>
            <span className="font-medium">{product.cost?.toLocaleString('ar-EG') || 0} ج.م</span>
          </div>
          <div className="flex items-center justify-between">
            <span>المخزون</span>
            <span className="font-medium {lowStock ? 'text-danger-600' : ''}">{product.stock}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>حد إعادة الطلب</span>
            <span className="font-medium">{product.minStock}</span>
          </div>
        </div>

        {lowStock && (
          <div className="mt-3 p-3 bg-warning-50 rounded-lg flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-warning-600" />
            <p className="text-sm text-warning-800">المنتج بحاجة لإعادة طلب</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const InventoryPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.cost || 0) * p.stock, 0);
  const totalSku = products.length;

  const handleSubmit = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct({ ...data, createdAt: new Date() });
    }
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المخزون</h1>
          <p className="text-gray-500 mt-1">إدارة المنتجات، الموردين، وحد إعادة الطلب</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          منتج جديد
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
                  placeholder="البحث عن المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pr-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input w-auto">
                <option value="all">كل الفئات</option>
                <option value={PRODUCT_CATEGORIES.SAFETY_EQUIPMENT}>معدات الأمان</option>
                <option value={PRODUCT_CATEGORIES.TRADING_SUPPLIES}>مستلزمات التجارة</option>
                <option value={PRODUCT_CATEGORIES.TOOLS}>أدوات</option>
                <option value={PRODUCT_CATEGORIES.CONSUMABLES}>مستهلكات</option>
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
              <p className="stat-label">عدد الأصناف</p>
              <p className="stat-value">{totalSku}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-xl">
              <TagIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">قيمة المخزون</p>
              <p className="stat-value">{totalStockValue.toLocaleString('ar-EG')} ج.م</p>
            </div>
            <div className="p-3 bg-success-50 rounded-xl">
              <BuildingStorefrontIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">منتجات قليلة المخزون</p>
              <p className="stat-value">{lowStockCount}</p>
            </div>
            <div className="p-3 bg-warning-50 rounded-xl">
              <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-500 mb-4">{searchTerm || filterCategory !== 'all' ? 'لم يتم العثور على منتجات مطابقة' : 'ابدأ بإضافة منتج جديد'}</p>
          {!searchTerm && filterCategory === 'all' && (
            <button onClick={() => setShowForm(true)} className="btn-primary">إضافة منتج</button>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm product={editingProduct} onClose={closeForm} onSubmit={handleSubmit} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryPage;
