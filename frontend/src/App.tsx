import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from '@/lib/auth'
import { LoginPage } from '@/pages/LoginPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SignupPage } from '@/pages/SignupPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
