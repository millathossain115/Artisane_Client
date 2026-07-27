import { Toaster } from 'sonner'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminRoute from './components/routes/AdminRoute'
import ProtectedRoute from './components/routes/ProtectedRoute'
import ScrollToTop from './components/routes/ScrollToTop'
import CreateCategory from './pages/admin/categories/CreateCategory'
import ManageCategories from './pages/admin/categories/ManageCategories'
import AdminOrderDetailPage from './pages/admin/orders/AdminOrderDetailPage'
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
import SupportPage from './pages/dashboard/SupportPage'
import AddressesPage from './pages/dashboard/profile-page/AddressesPage'
import ProfilePage from './pages/dashboard/profile-page/ProfilePage'
import UserReviewsPage from './pages/dashboard/reviews/ReviewsPage'
import WishlistPage from './pages/dashboard/user-dashboard/WishlistPage'
import AdminReviewsPage from './pages/admin/reviews/ReviewsPage'
import ManagePromoBanner from './pages/admin/promo/ManagePromoBanner'
import ManageHomeHero from './pages/admin/homeHero/ManageHomeHero'
import ManagePaymentLogs from './pages/admin/paymentLog/ManagePaymentLogs'
import PaymentLogDetailPage from './pages/admin/paymentLog/PaymentLogDetailPage'
import ManageActivityLogs from './pages/admin/activityLogs/ManageActivityLogs'
import Home from './pages/Home'
import InfoPage from './pages/info/InfoPage'
import NotFound from './pages/NotFound'
import PaymentResult from './pages/payment/PaymentResult'
import ProductDetails from './pages/ProductDetails'
import { PageTitleUpdater } from './components/routes/PageTitleUpdater'
import Products from './pages/Products'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#f8f3ea',
            color: '#181512',
            border: '1px solid rgba(24, 21, 18, 0.18)',
            borderRadius: '0px',
            boxShadow: '0 12px 30px -5px rgba(24, 21, 18, 0.15)',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: '600',
            padding: '14px 18px',
          },
          classNames: {
            toast: 'font-sans bg-[#f8f3ea] text-[#181512] border border-[#181512]/20 shadow-xl rounded-none p-4 font-semibold text-sm',
            title: 'text-[#181512] font-bold text-sm',
            description: 'text-[#6b5f53] text-xs mt-0.5',
            actionButton: '!bg-[#7a3f1d] !text-white font-bold rounded-none',
            cancelButton: '!bg-[#e5dcd0] !text-[#181512] font-bold rounded-none',
            success: '!bg-[#f3f7f2] !text-[#2d5a27] !border-[#2d5a27]/30',
            error: '!bg-[#fcf2f0] !text-[#8c2a1c] !border-[#8c2a1c]/30',
            info: '!bg-[#f8f3ea] !text-[#7a3f1d] !border-[#7a3f1d]/30',
            warning: '!bg-[#fbf4e6] !text-[#784f17] !border-[#b47818]/30',
          },
        }}
      />
      <ScrollToTop />
      <PageTitleUpdater />
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
          path="/dashboard/addresses"
          element={
            <ProtectedRoute>
              <AddressesPage />
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
          path="/dashboard/support"
          element={
            <ProtectedRoute>
              <SupportPage />
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
          path="/dashboard/admin/orders/:id"
          element={
            <AdminRoute>
              <AdminOrderDetailPage />
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
          path="/dashboard/admin/promo"
          element={
            <AdminRoute>
              <ManagePromoBanner />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/admin/home-hero"
          element={
            <AdminRoute>
              <ManageHomeHero />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/admin/payment-logs"
          element={
            <AdminRoute>
              <ManagePaymentLogs />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/admin/payment-logs/:ref"
          element={
            <AdminRoute>
              <PaymentLogDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/admin/activity-logs"
          element={
            <AdminRoute>
              <ManageActivityLogs />
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
