"use client"

import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tokenFromUrl = queryParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setError("Токен для сброса пароля не найден.")
    }
  }, [location.search])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают.")
      setIsLoading(false)
      return
    }

    try {
      await axios.post("http://127.0.0.1:8000/auth/reset-password", {
        token: token,
        new_password: newPassword,
      })
      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "Не удалось сбросить пароль.")
      } else {
        setError("Произошла ошибка.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="w-full sm:max-w-md md:max-w-lg z-10 px-6">
        <Card className="shadow-2xl border-0 overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
            <CardTitle className="text-3xl text-center font-bold flex items-center justify-center">
              <Lock className="mr-3 h-6 w-6 my-3" />
              Сброс пароля
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {success ? (
              <div className="text-center text-green-700 text-xl font-semibold">
                Пароль успешно сброшен! Вы будете перенаправлены на страницу входа...
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="text-base font-semibold text-gray-700 flex items-center"
                  >
                    Новый пароль
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-5 py-4 pl-12 border-2 rounded-xl"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-base font-semibold text-gray-700 flex items-center"
                  >
                    Повторите новый пароль
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 py-4 pl-12 border-2 rounded-xl"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full py-4 text-lg">
                  {isLoading ? "Сброс..." : "Сбросить пароль"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 