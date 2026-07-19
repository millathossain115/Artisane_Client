import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminRoute from './components/routes/AdminRoute'
import ProtectedRoute from './components/routes/ProtectedRoute'
import CreateCategory from './pages/admin/categories/CreateCategory'
import ManageCategories from './pages/admin/categories/ManageCategories'
import ManageOrders from './pages/admin/orders/ManageOrders'
import CreateProduct from './pages/admin/products/CreateProduct'
import ManageProducts from './pages/admin/products/ManageProducts'
import ManageUsers from './pages/admin/users/ManageUsers'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Checkout from './pages/checkout/Checkout'
import Dashboard from './pages/dashboard/Dashboard'
import MyOrdersPage from './pages/dashboard/MyOrdersPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import WishlistPage from './pages/dashboard/user-dashboard/WishlistPage'
import Home from './pages/Home'
import PaymentResult from './pages/payment/PaymentResult'
import ProductDetails from './pages/ProductDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/payment/success"
          element={<PaymentResult status="success" />}
        />
        <Route path="/payment/fail" element={<PaymentResult status="fail" />} />
        <Route
          path="/payment/cancel"
          element={<PaymentResult status="cancel" />}
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/orders"
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/categories"
          element={
            <AdminRoute>
              <ManageCategories />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/categories/create"
          element={
            <AdminRoute>
              <CreateCategory />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/products"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/products/create"
          element={
            <AdminRoute>
              <CreateProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/categories/manage"
          element={<Navigate replace to="/dashboard/categories" />}
        />
        <Route
          path="/dashboard/products/manage"
          element={<Navigate replace to="/dashboard/products" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
