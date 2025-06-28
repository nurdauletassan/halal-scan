"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Package,
  Database,
  ChevronRight,
  Info,
  BookOpen,
  Shield,
} from "lucide-react"

interface AdditiveStatus {
  id: number
  title: string
  slug: string
  name: string
}

interface Additive {
  id: number
  title: string
  slug: string
  desc: string
  status_id: number
  status_desc: string
  name: string
  category: string
  status: AdditiveStatus
}

export default function HalalAdditivesPage() {
  const [additives, setAdditives] = useState<Additive[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAdditive, setSelectedAdditive] = useState<Additive | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetch("https://halaldamu.kz/ru/api/qospalar/1/1")
      .then(res => res.json())
      .then(data => setAdditives(data.data || []))
  }, [])

  // Get unique categories and statuses
  const categories = useMemo(() => {
    const cats = Array.from(new Set(additives.map((item) => item.category)))
    return cats.sort()
  }, [additives])

  const statuses = useMemo(() => {
    const stats = Array.from(new Set(additives.map((item) => item.status.name)))
    return stats.sort()
  }, [additives])

  // Filter additives
  const filteredAdditives = useMemo(() => {
    return additives.filter((additive) => {
      const matchesSearch =
        additive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        additive.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        additive.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = selectedStatus === "all" || additive.status.name === selectedStatus

      const matchesCategory = selectedCategory === "all" || additive.category === selectedCategory

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [searchTerm, selectedStatus, selectedCategory, additives])

  // Statistics
  const stats = useMemo(() => {
    const total = additives.length
    const halal = additives.filter((item) => item.status_id === 1).length
    const haram = additives.filter((item) => item.status_id === 3).length
    const questionable = additives.filter((item) => item.status_id === 2).length

    return { total, halal, haram, questionable }
  }, [additives])

  const handleAdditiveClick = (additive: Additive) => {
    setSelectedAdditive(additive)
    setIsDialogOpen(true)
  }

  const stripHtml = (html: string | null | undefined) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  }

  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case 1:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 3:
        return <XCircle className="h-5 w-5 text-red-500" />
      case 2:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (statusId: number, statusName: string) => {
    switch (statusId) {
      case 1:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ {statusName}</Badge>
      case 3:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">✗ {statusName}</Badge>
      case 2:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⚠ {statusName}</Badge>
      default:
        return <Badge variant="secondary">{statusName}</Badge>
    }
  }

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "from-green-500 to-emerald-600"
      case 3:
        return "from-red-500 to-rose-600"
      case 2:
        return "from-yellow-500 to-orange-600"
      default:
        return "from-gray-500 to-slate-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-0 -left-20 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-lg opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-emerald-800 bg-clip-text text-transparent">
                  Справочник добавок
                </h1>
                <p className="text-green-700 font-semibold mt-2">E-коды и их халяль статус</p>
              </div>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Полный справочник пищевых добавок с указанием их{" "}
              <span className="text-green-600 font-semibold">халяль статуса</span> и подробным описанием
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-lg border-green-200 hover:bg-white/90 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <Database className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-800 mb-1">{stats.total}</div>
                <div className="text-gray-600 text-sm">Всего добавок</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-lg border-green-200 hover:bg-white/90 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-400 mb-1">{stats.halal}</div>
                <div className="text-gray-300 text-sm">Халяль</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-lg border-green-200 hover:bg-white/90 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <XCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-red-400 mb-1">{stats.haram}</div>
                <div className="text-gray-300 text-sm">Харам</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-lg border-green-200 hover:bg-white/90 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.questionable}</div>
                <div className="text-gray-300 text-sm">Сомнительно</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8 bg-white/80 backdrop-blur-lg border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Filter className="h-5 w-5" />
                Фильтры и поиск
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Поиск по коду или названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/90 border-green-300 text-gray-800 placeholder:text-gray-500"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white/90 border-green-300 text-gray-800">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/90 border-green-300 text-gray-800">
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Найдено: <span className="font-semibold text-gray-800">{filteredAdditives.length}</span> добавок
              </div>
            </CardContent>
          </Card>

          {/* Additives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdditives.map((additive) => (
              <Card
                key={additive.id}
                className="bg-white/80 backdrop-blur-lg border-green-200 hover:bg-white/90 transition-all cursor-pointer hover:scale-105 group shadow-lg hover:shadow-xl"
                onClick={() => handleAdditiveClick(additive)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${getStatusColor(
                          additive.status_id,
                        )} border backdrop-blur-sm shadow-md`}
                      >
                        <span className="text-2xl font-bold text-white">{additive.title}</span>
                      </div>
                      <div>{getStatusIcon(additive.status_id)}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{additive.name}</h3>
                      <Badge variant="outline" className="text-xs border-green-300 text-gray-600">
                        {additive.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      {getStatusBadge(additive.status_id, additive.status.name)}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>

                    <div className="text-sm text-gray-600 line-clamp-2">{stripHtml(additive.desc)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredAdditives.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-lg border-green-200 text-center py-12 shadow-lg">
              <CardContent>
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ничего не найдено</h3>
                <p className="text-gray-600 mb-4">Попробуйте изменить параметры поиска</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedStatus("all")
                    setSelectedCategory("all")
                  }}
                  className="bg-white/90 border-green-300 text-gray-800 hover:bg-green-50"
                >
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Load More Button */}
          {filteredAdditives.length > 0 && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/80 border-green-300 text-gray-800 hover:bg-green-50 transition-all shadow-lg"
              >
                <Package className="h-5 w-5 mr-2" />
                Загрузить еще добавки
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-lg border-green-200 text-gray-800 shadow-2xl">
          {selectedAdditive && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4 text-2xl">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${getStatusColor(
                      selectedAdditive.status_id,
                    )} border backdrop-blur-sm`}
                  >
                    <span className="text-3xl font-bold text-white">{selectedAdditive.title}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAdditive.name}</h2>
                    <p className="text-gray-400 font-normal text-base">{selectedAdditive.category}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedAdditive.status_id)}
                    {getStatusBadge(selectedAdditive.status_id, selectedAdditive.status.name)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">ID добавки</p>
                    <p className="text-lg font-bold">#{selectedAdditive.id}</p>
                  </div>
                </div>

                {/* Description */}
                {typeof selectedAdditive.desc === "string" && stripHtml(selectedAdditive.desc).trim().length > 0 && (
                  <div
                    className={`p-6 rounded-xl bg-gradient-to-r ${getStatusColor(
                      selectedAdditive.status_id,
                    )} border backdrop-blur-sm`}
                  >
                    <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-6 w-6" />
                      Подробное описание
                    </h4>
                    <div
                      className="text-lg leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedAdditive.desc }}
                    />
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Статус
                    </h5>
                    <p className="text-blue-700 font-semibold">{selectedAdditive.status.title}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Категория
                    </h5>
                    <p className="text-blue-700 font-semibold">{selectedAdditive.category}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Закрыть
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Поделиться
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 