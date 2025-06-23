"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Shield, Lock, Mail, User, ArrowRight } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register", {
        email: email,
        username: name,
        password: password,
      })

      if (response.status === 200) {
        navigate("/verify-email") // Redirect to a page that tells them to check their email
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "Произошла ошибка при регистрации")
      } else {
        setError("Произошла ошибка при регистрации")
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

      {/* Main Content */}
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl z-10 px-6">
        <Card className="shadow-2xl border-0 overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <CardTitle className="text-3xl text-center font-bold flex items-center justify-center">
                <Shield className="mr-3 h-6 w-6 my-3" />Регистрация
              </CardTitle>
              <p className="text-center text-green-100 mt-2">Создайте новый аккаунт HalalCheck</p>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-8 ">
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Ошибка!</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-base font-semibold text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-emerald-600" />
                  Имя
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white text-lg"
                    placeholder="Ваше имя"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              {/* Email Field */}
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
              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-base font-semibold text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-emerald-600" />
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white text-lg"
                    placeholder="Введите пароль"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-base font-semibold text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-emerald-600" />
                  Повторите пароль
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white text-lg"
                    placeholder="Повторите пароль"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5 text-xl font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Регистрация...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Зарегистрироваться</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Уже есть аккаунт?{' '}
                  <a
                    href="/login"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all duration-200"
                  >
                    Войти
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
} 