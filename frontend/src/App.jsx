import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Scan from './pages/Scan.tsx'
import Login from './pages/Login.tsx'
import RegisterPage from './pages/Register.tsx'
import Profile from './pages/Profile'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import VerifyEmailPage from './pages/VerifyEmail.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'
import ResetPasswordPage from "./pages/ResetPassword.tsx"
import ProtectedRoute from './components/ProtectedRoute'
import HistoryPage from './pages/History'
import HalalAdditivesPage from './pages/HalalAdditives.js'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-20 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-0 -left-20 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          <div className="relative z-10 h-full overflow-y-auto">
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
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/additives" element={<HalalAdditivesPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
