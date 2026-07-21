import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminRoute from './components/routes/AdminRoute'
import ProtectedRoute from './components/routes/ProtectedRoute'
import ScrollToTop from './components/routes/ScrollToTop'
import CreateCategory from './pages/admin/categories/CreateCategory'
import ManageCategories from './pages/admin/categories/ManageCategories'
import ManageOrders from './pages/admin/orders/ManageOrders'
import CreateProduct from './pages/admin/products/CreateProduct'
import ManageProducts from './pages/admin/products/ManageProducts'
import ManageUsers from './pages/admin/users/ManageUsers'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Categories from './pages/Categories'
import Checkout from './pages/checkout/Checkout'
import Dashboard from './pages/dashboard/Dashboard'
import MyOrdersPage from './pages/dashboard/MyOrdersPage'
import OrderDetailPage from './pages/dashboard/OrderDetailPage'
import ProfilePage from './pages/dashboard/profile-page/ProfilePage'
import UserReviewsPage from './pages/dashboard/reviews/ReviewsPage'
import WishlistPage from './pages/dashboard/user-dashboard/WishlistPage'
import AdminReviewsPage from './pages/admin/reviews/ReviewsPage'
import Home from './pages/Home'
import InfoPage from './pages/info/InfoPage'
import NotFound from './pages/NotFound'
import PaymentResult from './pages/payment/PaymentResult'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<InfoPage page="about" />} />
        <Route path="/faq" element={<InfoPage page="faq" />} />
        <Route
          path="/shipping-returns"
          element={<InfoPage page="shippingReturns" />}
        />
        <Route path="/terms" element={<InfoPage page="terms" />} />
        <Route path="/privacy" element={<InfoPage page="privacy" />} />
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
          path="/dashboard/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reviews"
          element={
            <ProtectedRoute>
              <UserReviewsPage />
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
          path="/dashboard/admin/reviews"
          element={
            <AdminRoute>
              <AdminReviewsPage />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
