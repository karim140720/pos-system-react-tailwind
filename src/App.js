
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerPage from './pages/CustomerPage';
import InvoicePage from './pages/InvoicePage';
import InventoryPage from './pages/InventoryPage';
import ExpensesPage from './pages/ExpensesPage';
import CashboxPage from './pages/CashboxPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import SubscriptionPage from './pages/SubscriptionPage';
import useStore from './store/useStore';

function RequireAuth({ children }) {
  const isAuthenticated = useStore((s) => s.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireSubscription({ children }) {
  const isSubscriptionActive = useStore((s) => s.isSubscriptionActive);
  if (!isSubscriptionActive()) {
    return <Navigate to="/subscription" replace />;
  }
  return children;
}

function App() {
  const isAuthenticated = useStore((s) => s.auth.isAuthenticated);
  const isSubscriptionActive = useStore((s) => s.isSubscriptionActive);
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? (isSubscriptionActive() ? <Navigate to="/" replace /> : <Navigate to="/subscription" replace />)
              : <LoginPage />
          }
        />
        <Route
          path="/subscription"
          element={
            <RequireAuth>
              <SubscriptionPage />
            </RequireAuth>
          }
        />

        {/* Protected routes with layout */}
        <Route
          element={
            <RequireAuth>
              <RequireSubscription>
                <Layout />
              </RequireSubscription>
            </RequireAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/invoices" element={<InvoicePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/cashbox" element={<CashboxPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
