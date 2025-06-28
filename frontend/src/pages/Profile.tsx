"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  User,
  Settings,
  CheckCircle,
  XCircle,
  Camera,
  Trophy,
  Calendar,
  TrendingUp,
  Heart,
  Share2,
  Edit3,
  Bell,
  Award,
  Zap,
  Shield,
  AlertTriangle,
} from "lucide-react"

interface UserStats {
  totalScans: number
  certifiedProducts: number
  cleanProducts: number
  doubtfulProducts: number
  haramProducts: number
  streak: number
  joinDate: string
}

interface RecentScan {
  id: string
  productName: string
  status: "certified" | "clean" | "doubtful" | "haram"
  confidence: number
  date: string
  image: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

type TabType = "overview" | "history" | "achievements" | "settings"

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  // Добавляю состояние для пользователя
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setUser({ name: data.username || data.name || "", email: data.email || "" })
        }
      } catch (e) {
        // Можно обработать ошибку
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  // Mock user data
  const userStats: UserStats = {
    totalScans: 127,
    certifiedProducts: 45,
    cleanProducts: 44,
    doubtfulProducts: 23,
    haramProducts: 15,
    streak: 15,
    joinDate: "2024-01-15",
  }

  const recentScans: RecentScan[] = [
    {
      id: "1",
      productName: "Халяльная говядина",
      status: "certified",
      confidence: 98,
      date: "2024-12-18",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      productName: "Органическое печенье",
      status: "clean",
      confidence: 92,
      date: "2024-12-17",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "3",
      productName: "Шоколадные конфеты",
      status: "doubtful",
      confidence: 75,
      date: "2024-12-16",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Первый скан",
      description: "Проверили свой первый продукт",
      icon: "🎯",
      unlocked: true,
    },
    {
      id: "2",
      title: "Эксперт халяль",
      description: "Проверили 100+ продуктов",
      icon: "🏆",
      unlocked: true,
    },
    {
      id: "3",
      title: "Серия успехов",
      description: "15 дней подряд используете приложение",
      icon: "🔥",
      unlocked: true,
    },
    {
      id: "4",
      title: "Мастер проверки",
      description: "Проверьте 500 продуктов",
      icon: "⭐",
      unlocked: false,
      progress: 127,
      maxProgress: 500,
    },
  ]

  const getStatusBadge = (status: "certified" | "clean" | "doubtful" | "haram") => {
    switch (status) {
      case "certified":
        return <Badge className="bg-green-100 text-green-800">🏆 Сертифицирован</Badge>
      case "clean":
        return <Badge className="bg-blue-100 text-blue-800">✅ Чистый состав</Badge>
      case "doubtful":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Сомнительное</Badge>
      case "haram":
        return <Badge className="bg-red-100 text-red-800">❌ Харам</Badge>
    }
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Мой профиль</h1>
          <p className="text-gray-600">Управляйте своим аккаунтом и отслеживайте прогресс</p>
        </div>
        
        {/* Profile Header Card */}
        <Card className="mb-8 shadow-2xl border-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white overflow-hidden">
          
          <CardContent className="relative p-8 pt-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <User className="h-16 w-16 text-green-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                  <Trophy className="h-6 w-6 text-yellow-800" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold mb-2">
                  {loading ? "Загрузка..." : user?.name || "Имя не найдено"}
                </h2>
                <p className="text-green-100 mb-4">
                  {loading ? "" : user?.email || ""}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <Calendar className="mr-1 h-4 w-4" />С {new Date(userStats.joinDate).toLocaleDateString("ru-RU")}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <Zap className="mr-1 h-4 w-4" />
                    {userStats.streak} дней подряд
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Редактировать
                </Button>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Share2 className="mr-2 h-4 w-4" />
                  Поделиться
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 pt-8 text-center">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">{userStats.certifiedProducts}</div>
              <div className="text-sm text-green-600">Сертифицированных</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 pt-8 text-center">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-800 mb-1">{userStats.cleanProducts}</div>
              <div className="text-sm text-blue-600">Чистый состав</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 pt-8 text-center">
              <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-yellow-800 mb-1">{userStats.doubtfulProducts}</div>
              <div className="text-sm text-yellow-600">Сомнительных</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 pt-8 text-center">
              <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-red-800 mb-1">{userStats.haramProducts}</div>
              <div className="text-sm text-red-600">Харам продуктов</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-2 shadow-lg">
          {[
            { id: "overview" as TabType, label: "Обзор", icon: User },
            { id: "history" as TabType, label: "История", icon: Calendar },
            { id: "achievements" as TabType, label: "Достижения", icon: Trophy },
            { id: "settings" as TabType, label: "Настройки", icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 transition-all ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow-md hover:bg-green-700"
                  : "bg-white text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />📊 Последняя активность
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-8">
                  <div className="space-y-4">
                    {recentScans.slice(0, 3).map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={scan.image || "/placeholder.svg"}
                          alt={scan.productName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{scan.productName}</div>
                          <div className="text-sm text-gray-500">{new Date(scan.date).toLocaleDateString("ru-RU")}</div>
                        </div>
                        <Badge
                          className={
                            scan.status === "certified"
                              ? "bg-green-100 text-green-800"
                              : scan.status === "clean"
                                ? "bg-blue-100 text-blue-800"
                                : scan.status === "doubtful"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }
                        >
                          {scan.status === "certified"
                            ? "🏆 Сертифицирован"
                            : scan.status === "clean"
                              ? "✅ Чистый состав"
                              : scan.status === "doubtful"
                                ? "⚠️ Сомнительное"
                                : "❌ Харам"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5" />⚡ Быстрые действия
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-8">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-24 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex-col gap-2 rounded-xl">
                      <Camera className="h-8 w-8" />
                      <span className="text-sm font-medium">Новое сканирование</span>
                    </Button>
                    <Button className="h-24 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-col gap-2 rounded-xl">
                      <Heart className="h-8 w-8" />
                      <span className="text-sm font-medium">Избранное</span>
                    </Button>
                    <Button className="h-24 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex-col gap-2 rounded-xl">
                      <Trophy className="h-8 w-8" />
                      <span className="text-sm font-medium">Достижения</span>
                    </Button>
                    <Button className="h-24 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex-col gap-2 rounded-xl">
                      <Settings className="h-8 w-8" />
                      <span className="text-sm font-medium">Настройки</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "history" && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />📅 История проверок
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-8">
                <div className="space-y-4">
                  {recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={scan.image || "/placeholder.svg"}
                        alt={scan.productName}
                        className="w-16 h-16 rounded-xl object-cover shadow-md"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-800 mb-1">{scan.productName}</div>
                        <div className="text-sm text-gray-500 mb-2">
                          {new Date(scan.date).toLocaleDateString("ru-RU")}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(scan.status)}
                          <span className="text-sm text-gray-600">Уверенность: {scan.confidence}%</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "achievements" && (
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`shadow-lg border-0 transition-all duration-300 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-yellow-50 to-amber-100 hover:shadow-xl"
                      : "bg-gray-50 opacity-75"
                  }`}
                >
                  <CardContent className="p-6 pt-8">
                    <div className="flex items-start gap-4">
                      <div
                        className={`text-4xl p-3 rounded-full ${
                          achievement.unlocked ? "bg-yellow-200" : "bg-gray-200"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-bold text-lg mb-2 ${
                            achievement.unlocked ? "text-amber-800" : "text-gray-500"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p className={`text-sm mb-3 ${achievement.unlocked ? "text-amber-700" : "text-gray-400"}`}>
                          {achievement.description}
                        </p>
                        {achievement.progress !== undefined && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Прогресс</span>
                              <span>
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(achievement.progress / achievement.maxProgress!) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {achievement.unlocked && (
                          <Badge className="bg-green-100 text-green-800 mt-2">
                            <Award className="mr-1 h-3 w-3" />
                            Получено
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}