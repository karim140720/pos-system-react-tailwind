// Language constants
export const LANGUAGES = {
  ARABIC: 'arabic',
  EGYPTIAN: 'egyptian'
};

// Translations
export const translations = {
  [LANGUAGES.ARABIC]: {
    // Dashboard
    dashboard: 'لوحة التحكم',
    welcomeMessage: 'مرحباً بك في نظام إدارة نقاط البيع',
    lastUpdate: 'آخر تحديث',
    totalSales: 'إجمالي المبيعات',
    totalCustomers: 'إجمالي العملاء',
    completedOrders: 'الطلبات المكتملة',
    lowStockProducts: 'منتجات قليلة المخزون',
    quickActions: 'إجراءات سريعة',
    recentActivity: 'النشاط الأخير',
    newCustomer: 'عميل جديد',
    addNewCustomer: 'إضافة عميل جديد',
    newInvoice: 'فاتورة جديدة',
    createNewInvoice: 'إنشاء فاتورة بيع',
    newProduct: 'منتج جديد',
    addNewProduct: 'إضافة منتج للمخزون',
    newExpense: 'مصروف جديد',
    addNewExpense: 'تسجيل مصروف',
    currentCashboxBalance: 'رصيد الخزنة الحالي',
    totalExpenses: 'إجمالي المصروفات',
    netProfit: 'صافي الربح',
    salesChart: 'مبيعات الشهور الستة الماضية',
    categoryDistribution: 'توزيع المنتجات حسب الفئة',
    completed: 'مكتمل',
    pending: 'معلق',
    cancelled: 'ملغي',
    attention: 'انتباه',
    excellent: 'ممتاز',
    // Sidebar
    customers: 'العملاء',
    invoices: 'الفواتير',
    inventory: 'المخزون',
    expenses: 'المصروفات',
    cashbox: 'الخزنة',
    reports: 'التقارير',
    posSystem: 'نظام المبيعات',
    posDescription: 'نظام إدارة نقاط البيع',
    version: 'الإصدار 1.0.0',
    // Header
    todaySales: 'المبيعات اليوم',
    cashboxBalance: 'رصيد الخزنة',
    notifications: 'الإشعارات',
    someProductsLowStock: 'بعض المنتجات قاربت على النفاد',
    manager: 'المدير',
    // Status
    sales: 'المبيعات',
    orders: 'الطلبات',
    // Recent Activity
    newOrderFrom: 'طلب جديد من',
    newCustomerAdded: 'عميل جديد:',
    electricityBill: 'فاتورة الكهرباء',
    minutesAgo: 'منذ 5 دقائق',
    hourAgo: 'منذ ساعة',
    daysAgo: 'منذ يومين',
    // Months
    january: 'يناير',
    february: 'فبراير',
    march: 'مارس',
    april: 'أبريل',
    may: 'مايو',
    june: 'يونيو',
    // Product Categories
    safetyEquipment: 'معدات الأمان',
    tradingSupplies: 'مستلزمات التجارة',
    tools: 'أدوات',
    consumables: 'مستهلكات',
    // Currency
    currency: 'ج.م',
    // Sample Data
    ahmedMohamed: 'أحمد محمد',
    advancedConstruction: 'شركة البناء المتقدم',
    cairoEgypt: 'القاهرة، مصر',
    alexandriaEgypt: 'الإسكندرية، مصر',
    // Sample Products
    safetyHelmet: 'خوذة أمان',
    safetyShoes: 'حذاء أمان',
    workGloves: 'قفازات عمل',
    // Sample Suppliers
    safetyEquipmentSupplier: 'مورد معدات الأمان',
    // Sample Descriptions
    highQualityHelmet: 'خوذة أمان عالية الجودة',
    slipResistantShoes: 'حذاء أمان مقاوم للانزلاق',
    durableGloves: 'قفازات عمل متينة',
    // Sample Expenses
    rent: 'إيجار',
    utilities: 'مرافق',
    januaryRent: 'إيجار المحل لشهر يناير',
    // Sample Addresses
    cairoAddress: 'القاهرة، مصر',
    alexandriaAddress: 'الإسكندرية، مصر'
  },
  [LANGUAGES.EGYPTIAN]: {
    // Dashboard
    dashboard: 'الكونترول',
    welcomeMessage: 'أهلاً وسهلاً في نظام البيع',
    lastUpdate: 'آخر تحديث',
    totalSales: 'إجمالي المبيعات',
    totalCustomers: 'إجمالي الزباين',
    completedOrders: 'الطلبات المكتملة',
    lowStockProducts: 'المنتجات اللي قاربت تخلص',
    quickActions: 'أعمال سريعة',
    recentActivity: 'آخر حاجات حصلت',
    newCustomer: 'زبون جديد',
    addNewCustomer: 'إضافة زبون جديد',
    newInvoice: 'فاتورة جديدة',
    createNewInvoice: 'عمل فاتورة بيع',
    newProduct: 'منتج جديد',
    addNewProduct: 'إضافة منتج للبضاعة',
    newExpense: 'مصروف جديد',
    addNewExpense: 'تسجيل مصروف',
    currentCashboxBalance: 'فلوس الخزنة دلوقتي',
    totalExpenses: 'إجمالي المصروفات',
    netProfit: 'صافي الربح',
    salesChart: 'مبيعات آخر 6 شهور',
    categoryDistribution: 'توزيع المنتجات حسب النوع',
    completed: 'خلص',
    pending: 'معلق',
    cancelled: 'ملغي',
    attention: 'انتبه',
    excellent: 'ممتاز',
    // Sidebar
    customers: 'الزبائن',
    invoices: 'الفواتير',
    inventory: 'البضاعة',
    expenses: 'المصروفات',
    cashbox: 'الخزنة',
    reports: 'التقارير',
    posSystem: 'نظام البيع',
    posDescription: 'نظام إدارة المحل',
    version: 'الإصدار 1.0.0',
    // Header
    todaySales: 'مبيعات النهاردة',
    cashboxBalance: 'فلوس الخزنة',
    notifications: 'الإشعارات',
    someProductsLowStock: 'في منتجات قاربت تخلص',
    manager: 'المدير',
    // Status
    sales: 'المبيعات',
    orders: 'الطلبات',
    // Recent Activity
    newOrderFrom: 'طلب جديد من',
    newCustomerAdded: 'زبون جديد:',
    electricityBill: 'فاتورة الكهرباء',
    minutesAgo: 'منذ 5 دقائق',
    hourAgo: 'منذ ساعة',
    daysAgo: 'منذ يومين',
    // Months
    january: 'يناير',
    february: 'فبراير',
    march: 'مارس',
    april: 'أبريل',
    may: 'مايو',
    june: 'يونيو',
    // Product Categories
    safetyEquipment: 'معدات الأمان',
    tradingSupplies: 'مستلزمات التجارة',
    tools: 'أدوات',
    consumables: 'مستهلكات',
    // Currency
    currency: 'ج.م',
    // Sample Data
    ahmedMohamed: 'أحمد محمد',
    advancedConstruction: 'شركة البناء المتقدم',
    cairoEgypt: 'القاهرة، مصر',
    alexandriaEgypt: 'الإسكندرية، مصر',
    // Sample Products
    safetyHelmet: 'خوذة أمان',
    safetyShoes: 'حذاء أمان',
    workGloves: 'قفازات عمل',
    // Sample Suppliers
    safetyEquipmentSupplier: 'مورد معدات الأمان',
    // Sample Descriptions
    highQualityHelmet: 'خوذة أمان عالية الجودة',
    slipResistantShoes: 'حذاء أمان مقاوم للانزلاق',
    durableGloves: 'قفازات عمل متينة',
    // Sample Expenses
    rent: 'إيجار',
    utilities: 'مرافق',
    januaryRent: 'إيجار المحل لشهر يناير',
    // Sample Addresses
    cairoAddress: 'القاهرة، مصر',
    alexandriaAddress: 'الإسكندرية، مصر'
  }
};

// Translation helper function
export const getTranslation = (language, key) => {
  return translations[language]?.[key] || key;
};
