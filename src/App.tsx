import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminRoute from './components/routes/AdminRoute'
import CreateCategory from './pages/admin/categories/CreateCategory'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/dashboard/ProfilePage'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route
          path="/dashboard/categories"
          element={
            <AdminRoute>
              <CreateCategory />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/categories/create"
          element={<Navigate replace to="/dashboard/categories" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
