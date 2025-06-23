"use client"

import React, { useState } from "react"
import axios from "axios"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Mail, Lock } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSent(false)

    try {
      await axios.post("http://127.0.0.1:8000/auth/forgot-password", { email })
      setSent(true)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "Не удалось отправить письмо для сброса пароля.")
      } else {
        setError("Произошла ошибка.")
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
                <Lock className="mr-3 h-6 w-6 my-3" />Восстановление пароля
              </CardTitle>
              <p className="text-center text-green-100 mt-2">
                Введите ваш email для сброса пароля
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-8">
            {sent ? (
              <div className="text-center text-green-700 text-xl font-semibold">
                Инструкции по восстановлению отправлены на вашу почту!
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Ошибка!</strong>
                    <span className="block sm:inline"> {error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-base font-semibold text-gray-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                    Электронная почта
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white text-lg"
                      placeholder="example@email.com"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5 text-xl font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Отправка..." : "Отправить код для сброса"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 