import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AdminRoute from './components/routes/AdminRoute'
import CreateCategory from './pages/admin/categories/CreateCategory'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/dashboard/categories/create"
          element={
            <AdminRoute>
              <CreateCategory />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
