import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import LicenseManagementPage from './pages/LicenseManagementPage';
import ProductKeyPage from './pages/ProductKeyPage';
import UserManagementPage from './pages/UserManagementPage';
import RoleManagementPage from './pages/RoleManagementPage';
import MasterDataCustomerPage from './pages/MasterDataCustomerPage';
import RequestProductKeyPage from './pages/RequestProductKeyPage';

import {
  INITIAL_USERS,
  INITIAL_ROLES,
  INITIAL_CUSTOMERS,
  INITIAL_LICENSES,
  INITIAL_PRODUCT_KEYS
} from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('license-management');

  // Application Data States
  const [users, setUsers] = useState(INITIAL_USERS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [licenses, setLicenses] = useState(INITIAL_LICENSES);
  const [productKeys, setProductKeys] = useState(INITIAL_PRODUCT_KEYS);

  // Synchronize licenses state if existing items lack hostName (e.g. from HMR cache)
  useEffect(() => {
    if (licenses.some((l) => !l.hostName || l.hostName === '-')) {
      setLicenses(INITIAL_LICENSES);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveMenu('license-management');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNavigate = (menu) => {
    setActiveMenu(menu);
  };

  // If not logged in, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} users={users} />;
  }

  // If activeMenu is 'request-license', render client portal (Image 2)
  if (activeMenu === 'request-license') {
    return (
      <RequestProductKeyPage
        onBackToAdmin={() => setActiveMenu('license-management')}
        customers={customers}
      />
    );
  }

  return (
    <Layout
      activeMenu={activeMenu}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      currentUser={currentUser}
    >
      {/* APPLICATION PAGES */}
      {activeMenu === 'license-management' && (
        <LicenseManagementPage
          licenses={licenses}
          onUpdateLicenses={setLicenses}
          customers={customers}
          productKeys={productKeys}
          onUpdateProductKeys={setProductKeys}
        />
      )}

      {activeMenu === 'product-key' && (
        <ProductKeyPage
          productKeys={productKeys}
          onUpdateProductKeys={setProductKeys}
        />
      )}

      {/* MANAGEMENT PAGES */}
      {activeMenu === 'user-management' && (
        <UserManagementPage
          users={users}
          onUpdateUsers={setUsers}
          roles={roles}
        />
      )}

      {activeMenu === 'role-management' && (
        <RoleManagementPage
          roles={roles}
          onUpdateRoles={setRoles}
        />
      )}

      {/* DATABASE PAGES */}
      {activeMenu === 'master-data-customer' && (
        <MasterDataCustomerPage
          customers={customers}
          onUpdateCustomers={setCustomers}
        />
      )}
    </Layout>
  );
}
