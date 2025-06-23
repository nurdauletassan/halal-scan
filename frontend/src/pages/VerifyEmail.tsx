"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { MailCheck, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendEmail, setResendEmail] = useState("")
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState("")

  const navigate = useNavigate()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      await axios.post(`http://127.0.0.1:8000/auth/verify-email`, { token: code })
      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000) // Redirect to login after 3 seconds
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "Неверный или истекший код.")
      } else {
        setError("Произошла ошибка при проверке.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResendError("")
    setResendSuccess(false)
    try {
      await axios.post("http://127.0.0.1:8000/auth/resend-verification", { email: resendEmail })
      setResendSuccess(true)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setResendError(err.response.data.detail || "Не удалось повторно отправить письмо.")
      } else {
        setResendError("Произошла ошибка.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl z-10 px-6">
        <Card className="shadow-2xl border-0 overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <CardTitle className="text-3xl text-center font-bold flex items-center justify-center">
                <MailCheck className="mr-3 h-6 w-6 my-3" />Подтвердите Email
              </CardTitle>
              <p className="text-center text-green-100 mt-2">
                Мы отправили 6-значный код на вашу почту.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-8 text-center">
            {success ? (
              <div className="text-green-700 text-xl font-semibold">
                Email успешно подтверждён! Вы будете перенаправлены на страницу входа...
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="code" className="text-base font-semibold text-gray-700">
                    Код подтверждения
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white text-lg tracking-widest text-center"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                {error && <div className="text-red-600 text-center">{error}</div>}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl"
                >
                  {isLoading ? "Проверка..." : "Подтвердить"}
                </Button>
              </form>
            )}

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700">Не пришло письмо?</h3>
              <p className="text-gray-600 mt-2">Введите свой email, чтобы мы отправили его еще раз.</p>
              <form onSubmit={handleResendVerification} className="mt-4 space-y-4">
                 <div className="relative">
                  <input
                    id="resend-email"
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white text-lg"
                    placeholder="example@email.com"
                    required
                  />
                   <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Отправка..." : "Отправить повторно"}
                </Button>
              </form>
              {resendSuccess && <div className="text-green-600 mt-4">Письмо успешно отправлено.</div>}
              {resendError && <div className="text-red-600 mt-4">{resendError}</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 