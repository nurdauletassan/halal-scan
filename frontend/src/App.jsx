import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Scan from './pages/Scan.tsx'
import Login from './pages/Login.tsx'
import RegisterPage from './pages/Register.tsx'
import Profile from './pages/Profile'
import Header from './components/Header'
import Footer from './components/Footer'
import VerifyEmailPage from './pages/VerifyEmail.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'
import ResetPasswordPage from "./pages/ResetPassword.tsx"
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" />
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<RegisterPage />}></Route>
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/scan" element={
              <ProtectedRoute>
                <Scan />
              </ProtectedRoute>
            } />
            <Route path='/verify-email' element={<VerifyEmailPage />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
