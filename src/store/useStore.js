import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LANGUAGES, getTranslation } from '../utils/translations';

// Customer types
export const CUSTOMER_TYPES = {
  IN_SHOP: 'in_shop',
  TRADING: 'trading'
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT: 'credit'
};

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Product categories
export const PRODUCT_CATEGORIES = {
  SAFETY_EQUIPMENT: 'safety_equipment',
  TRADING_SUPPLIES: 'trading_supplies',
  TOOLS: 'tools',
  CONSUMABLES: 'consumables'
};

const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      auth: {
        isAuthenticated: false,
        user: null
      },

      // Language
      language: LANGUAGES.ARABIC,

      // Subscription
      subscription: {
        status: 'inactive', // 'active' | 'inactive' | 'expired' | 'trial'
        plan: 'monthly', // 'monthly' | 'yearly'
        renewalDate: null,
        isPermanent: false
      },

      // Customers
      customers: [
        {
          id: 1,
          name: 'أحمد محمد',
          phone: '+201001234567',
          email: 'ahmed@example.com',
          type: CUSTOMER_TYPES.IN_SHOP,
          address: 'القاهرة، مصر',
          creditLimit: 5000,
          currentBalance: 0,
          createdAt: new Date('2024-01-15'),
          isActive: true
        },
        {
          id: 2,
          name: 'شركة البناء المتقدم',
          phone: '+201223456789',
          email: 'info@advanced-construction.com',
          type: CUSTOMER_TYPES.TRADING,
          address: 'الإسكندرية، مصر',
          creditLimit: 50000,
          currentBalance: 15000,
          createdAt: new Date('2024-01-10'),
          isActive: true
        }
      ],

      // Products/Inventory
      products: [
        {
          id: 1,
          name: 'خوذة أمان',
          category: PRODUCT_CATEGORIES.SAFETY_EQUIPMENT,
          sku: 'HELMET-001',
          price: 150,
          cost: 100,
          stock: 50,
          minStock: 10,
          supplier: 'مورد معدات الأمان',
          description: 'خوذة أمان عالية الجودة',
          image: null,
          isActive: true,
          createdAt: new Date('2024-01-01')
        },
        {
          id: 2,
          name: 'حذاء أمان',
          category: PRODUCT_CATEGORIES.SAFETY_EQUIPMENT,
          sku: 'SHOE-001',
          price: 200,
          cost: 130,
          stock: 30,
          minStock: 5,
          supplier: 'مورد معدات الأمان',
          description: 'حذاء أمان مقاوم للانزلاق',
          image: null,
          isActive: true,
          createdAt: new Date('2024-01-01')
        },
        {
          id: 3,
          name: 'قفازات عمل',
          category: PRODUCT_CATEGORIES.SAFETY_EQUIPMENT,
          sku: 'GLOVE-001',
          price: 25,
          cost: 15,
          stock: 100,
          minStock: 20,
          supplier: 'مورد معدات الأمان',
          description: 'قفازات عمل متينة',
          image: null,
          isActive: true,
          createdAt: new Date('2024-01-01')
        }
      ],

      // Orders/Invoices
      orders: [
        {
          id: 1,
          customerId: 1,
          customerName: 'أحمد محمد',
          items: [
            { productId: 1, name: 'خوذة أمان', quantity: 2, price: 150, total: 300 },
            { productId: 3, name: 'قفازات عمل', quantity: 5, price: 25, total: 125 }
          ],
          subtotal: 425,
          tax: 63.75,
          discount: 0,
          total: 488.75,
          paymentMethod: PAYMENT_METHODS.CASH,
          status: ORDER_STATUS.COMPLETED,
          notes: '',
          createdAt: new Date('2024-01-20'),
          completedAt: new Date('2024-01-20')
        }
      ],

      // Expenses
      expenses: [
        {
          id: 1,
          category: 'إيجار',
          description: 'إيجار المحل لشهر يناير',
          amount: 5000,
          date: new Date('2024-01-01'),
          paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
          receipt: null,
          createdAt: new Date('2024-01-01')
        },
        {
          id: 2,
          category: 'مرافق',
          description: 'فاتورة الكهرباء',
          amount: 800,
          date: new Date('2024-01-15'),
          paymentMethod: PAYMENT_METHODS.CARD,
          receipt: null,
          createdAt: new Date('2024-01-15')
        }
      ],

      // Cashbox
      cashbox: {
        openingBalance: 10000,
        currentBalance: 12500,
        dailySales: 2500,
        dailyExpenses: 0,
        lastUpdated: new Date()
      },

      // UI State
      sidebarCollapsed: false,
      currentPage: 'dashboard',
      notifications: [],

      // Actions
      login: (user) => set({ auth: { isAuthenticated: true, user } }),

      logout: () => set({
        auth: { isAuthenticated: false, user: null },
        subscription: { status: 'inactive', plan: 'monthly', renewalDate: null, isPermanent: false }
      }),

      setSubscription: (subscription) => set((state) => ({
        subscription: { ...state.subscription, ...subscription }
      })),

      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, { ...customer, id: Date.now() }]
      })),

      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      })),

      deleteCustomer: (id) => set((state) => ({
        customers: state.customers.filter(customer => customer.id !== id)
      })),

      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: Date.now() }]
      })),

      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(product =>
          product.id === id ? { ...product, ...updates } : product
        )
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(product => product.id !== id)
      })),

      addOrder: (order) => set((state) => ({
        orders: [...state.orders, { ...order, id: Date.now() }]
      })),

      updateOrder: (id, updates) => set((state) => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, ...updates } : order
        )
      })),

      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: Date.now() }]
      })),

      updateExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map(expense =>
          expense.id === id ? { ...expense, ...updates } : expense
        )
      })),

      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(expense => expense.id !== id)
      })),

      updateCashbox: (updates) => set((state) => ({
        cashbox: { ...state.cashbox, ...updates, lastUpdated: new Date() }
      })),

      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),

      setCurrentPage: (page) => set({ currentPage: page }),

      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Date.now() }]
      })),

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(notification => notification.id !== id)
      })),

      // Language actions
      setLanguage: (language) => set({ language }),

      // Translation helper
      t: (key) => {
        const state = get();
        return getTranslation(state.language, key);
      },

      // Getters
      isSubscriptionActive: () => {
        const { subscription } = get();
        if (subscription.isPermanent) return true;
        if (subscription.status !== 'active' && subscription.status !== 'trial') return false;
        if (!subscription.renewalDate) return false;
        return new Date(subscription.renewalDate) >= new Date();
      },

      getCustomerById: (id) => {
        const state = get();
        return state.customers.find(customer => customer.id === id);
      },

      getProductById: (id) => {
        const state = get();
        return state.products.find(product => product.id === id);
      },

      getOrdersByCustomer: (customerId) => {
        const state = get();
        return state.orders.filter(order => order.customerId === customerId);
      },

      getLowStockProducts: () => {
        const state = get();
        return state.products.filter(product => product.stock <= product.minStock);
      },

      getTotalSales: () => {
        const state = get();
        return state.orders
          .filter(order => order.status === ORDER_STATUS.COMPLETED)
          .reduce((total, order) => total + order.total, 0);
      },

      getTotalExpenses: () => {
        const state = get();
        return state.expenses.reduce((total, expense) => total + expense.amount, 0);
      },

      getProfit: () => {
        const state = get();
        const totalSales = state.getTotalSales();
        const totalExpenses = state.getTotalExpenses();
        return totalSales - totalExpenses;
      }
    }),
    {
      name: 'pos-store',
      partialize: (state) => ({
        auth: state.auth,
        subscription: state.subscription,
        customers: state.customers,
        products: state.products,
        orders: state.orders,
        expenses: state.expenses,
        cashbox: state.cashbox,
        language: state.language
      })
    }
  )
);

export default useStore;
