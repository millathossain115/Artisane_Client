import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminRoute from './components/routes/AdminRoute'
import CreateCategory from './pages/admin/categories/CreateCategory'
import ManageCategories from './pages/admin/categories/ManageCategories'
import CreateProduct from './pages/admin/products/CreateProduct'
import ManageProducts from './pages/admin/products/ManageProducts'
import ManageUsers from './pages/admin/users/ManageUsers'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/dashboard/ProfilePage'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
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
