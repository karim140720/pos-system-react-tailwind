import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CubeIcon, 
  CurrencyDollarIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import useStore from '../store/useStore';
import { LANGUAGES } from '../utils/translations';

const Sidebar = ({ collapsed, onToggle, isMobile, mobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const { getLowStockProducts, getTotalSales, t } = useStore();

  const menuItems = [
    { 
      title: t('dashboard'), 
      path: '/', 
      icon: HomeIcon,
      badge: null
    },
    { 
      title: t('customers'), 
      path: '/customers', 
      icon: UsersIcon,
      badge: null
    },
    { 
      title: t('invoices'), 
      path: '/invoices', 
      icon: DocumentTextIcon,
      badge: null
    },
    { 
      title: t('inventory'), 
      path: '/inventory', 
      icon: CubeIcon,
      badge: getLowStockProducts().length > 0 ? getLowStockProducts().length : null
    },
    { 
      title: t('expenses'), 
      path: '/expenses', 
      icon: CurrencyDollarIcon,
      badge: null
    },
    { 
      title: t('cashbox'), 
      path: '/cashbox', 
      icon: BanknotesIcon,
      badge: null
    },
    { 
      title: t('reports'), 
      path: '/reports', 
      icon: ChartBarIcon,
      badge: null
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onCloseMobile}
        />
      )}
      
      <motion.div 
        initial={false}
        animate={isMobile ? { x: mobileOpen ? 0 : '100%' } : { width: collapsed ? 80 : 280 }}
        className={`h-screen bg-white shadow-strong fixed right-0 top-0 z-40 border-l border-gray-200 ${
          isMobile ? 'w-80' : ''
        }`}
      >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {(!collapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ن</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{t('posSystem')}</h1>
                    <p className="text-sm text-gray-500">{t('posDescription')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobile ? (
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              ) : collapsed ? (
                <Bars3Icon className="w-5 h-5 text-gray-600" />
              ) : (
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${
                  isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {(!collapsed || isMobile) && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex-1"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {item.badge && !collapsed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="badge-danger text-xs"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-center"
              >
                <p className="text-xs text-gray-500">
                  {t('version')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
    </>
  );
};

const Header = ({ collapsed, isMobile, onOpenSidebar }) => {
  const { cashbox, getTotalSales, language, setLanguage, t } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <motion.header 
      initial={false}
      animate={{ marginRight: isMobile ? 0 : (collapsed ? 80 : 280) }}
      className="bg-white shadow-soft border-b border-gray-200 sticky top-0 z-30"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onOpenSidebar}
            >
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {new Date().toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium">
                  {language === LANGUAGES.ARABIC ? 'العربية' : 'مصري'}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 top-full mt-2 w-40 bg-white rounded-xl shadow-strong border border-gray-200 p-2"
                  >
                    <button
                      onClick={() => {
                        setLanguage(LANGUAGES.ARABIC);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                        language === LANGUAGES.ARABIC 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      العربية الفصحى
                    </button>
                    <button
                      onClick={() => {
                        setLanguage(LANGUAGES.EGYPTIAN);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                        language === LANGUAGES.EGYPTIAN 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      اللهجة المصرية
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('todaySales')}</p>
                <p className="text-lg font-bold text-success-600">
                  {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(getTotalSales())}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('cashboxBalance')}</p>
                <p className="text-lg font-bold text-primary-600">
                  {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(cashbox.currentBalance)}
                </p>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <BellIcon className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full"></span>
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-strong border border-gray-200 p-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">{t('notifications')}</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-warning-50 rounded-lg">
                        <p className="text-sm text-warning-800">
                          {t('someProductsLowStock')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{t('manager')}</p>
                  <p className="text-xs text-gray-500">admin@pos.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      console.log('Screen width:', window.innerWidth, 'isMobile:', mobile);
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onToggle={() => {
          if (isMobile) {
            setMobileOpen(!mobileOpen);
          } else {
            setSidebarCollapsed(!sidebarCollapsed);
          }
        }}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Header collapsed={sidebarCollapsed} isMobile={isMobile} onOpenSidebar={() => setMobileOpen(true)} />
      <motion.main 
        initial={false}
        animate={{ marginRight: isMobile ? 0 : (sidebarCollapsed ? 80 : 280) }}
        className="min-h-screen pt-20"
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children ? children : <Outlet />}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;
