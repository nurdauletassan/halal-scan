"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, XCircle, AlertCircle, Search, Filter, Calendar, Package, Eye, Sparkles } from "lucide-react"

const API_URL = "http://localhost:8000/api/v1/products/history";; // Change if needed

interface CheckItem {
  id: number
  productName: string
  brand: string
  status: "halal" | "not-halal" | "questionable" | "clean"
  date: string
  time: string
  image: string
  category: string
  ingredients: string[]
  halalCertificate?: string
  reason?: string
  confidence: number
  barcode?: string
  manufacturer?: string
  country?: string
  additionalNotes?: string
}

function mapStatus(status: string): CheckItem["status"] {
  if (status === "halal" || status === "certified") return "halal";
  if (status === "haram" || status === "not-halal") return "not-halal";
  if (status === "doubtful" || status === "questionable") return "questionable";
  if (status === "clean") return "clean";
  return "questionable";
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "halal":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "not-halal":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "questionable":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "clean":
      return <Sparkles className="h-4 w-4 text-cyan-600" />
    default:
      return null
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "halal":
      return <Badge variant="default">Халяль</Badge>
    case "not-halal":
      return <Badge variant="secondary">Не халяль</Badge>
    case "questionable":
      return <Badge variant="destructive">Сомнительно</Badge>
    case "clean":
      return <Badge variant="outline">Чистый состав</Badge>
    default:
      return null
  }
}

export default function HistoryPage() {
  const [history, setHistory] = useState<CheckItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<CheckItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CheckItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(API_URL, {
          headers: {
            // 'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const mapped = data.map((item: any) => {
          const dateObj = new Date(item.date);
          return {
            id: item.id,
            productName: item.product_name || "",
            brand: item.brand || "",
            status: mapStatus(item.status),
            date: dateObj.toLocaleDateString("ru-RU"),
            time: dateObj.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
            image: item.image_url || "/placeholder.svg",
            category: item.category || "",
            ingredients: item.ingredients || [],
            halalCertificate: item.halal_certificate,
            reason: item.reason,
            confidence: item.confidence ?? 0,
            barcode: item.barcode,
            manufacturer: item.manufacturer,
            country: item.country,
            additionalNotes: item.additional_notes,
          };
        });
        setHistory(mapped);
        setFilteredHistory(mapped);
      } catch (e) {
        setHistory([]);
        setFilteredHistory([]);
      }
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    const filterByCategory = (item: CheckItem) => {
      if (categoryFilter === "all") return true
      return item.category === categoryFilter
    }

    const filterByDate = (item: CheckItem) => {
      if (periodFilter === 'all') {
        return true;
      }
      const [day, month, year] = item.date.split('.');
      const itemDate = new Date(`${year}-${month}-${day}`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (periodFilter === 'today') {
        return itemDate.getFullYear() === today.getFullYear() &&
               itemDate.getMonth() === today.getMonth() &&
               itemDate.getDate() === today.getDate()
      }
      if (periodFilter === 'week') {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          return itemDate >= lastWeek;
      }
      if (periodFilter === 'month') {
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          return itemDate >= lastMonth;
      }
      return true;
    }

    const newFilteredHistory = history
      .filter((item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((item) => statusFilter === "all" || item.status === statusFilter)
      .filter(filterByCategory)
      .filter(filterByDate)

    setFilteredHistory(newFilteredHistory)
  }, [searchTerm, statusFilter, categoryFilter, periodFilter, history])

  const handleItemClick = (item: CheckItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const totalChecks = history.length;
  const halalCount = history.filter((item) => item.status === 'halal').length;
  const notHalalCount = history.filter((item) => item.status === 'not-halal').length;
  const questionableCount = history.filter((item) => item.status === 'questionable').length;
  const cleanCount = history.filter((item) => item.status === 'clean').length;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">История проверок Halal Agent</h1>
          <p className="text-gray-600">Все результаты сканирования продуктов на соответствие халяль стандартам</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white hover:bg-gray-100 transition-colors">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Фильтры
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск продукта..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="halal">Халяль</SelectItem>
                  <SelectItem value="not-halal">Не халяль</SelectItem>
                  <SelectItem value="questionable">Сомнительно</SelectItem>
                  <SelectItem value="clean">Чистый состав</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="Мясо и птица">Мясо и птица</SelectItem>
                  <SelectItem value="Молочные продукты">Молочные продукты</SelectItem>
                  <SelectItem value="Кондитерские изделия">Кондитерские изделия</SelectItem>
                  <SelectItem value="Готовые блюда">Готовые блюда</SelectItem>
                </SelectContent>
              </Select>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="all">Все время</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white hover:bg-gray-100 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего проверок</p>
                  <p className="text-2xl font-extrabold">{totalChecks}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white hover:bg-gray-100 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Халяль</p>
                  <p className="text-2xl font-extrabold text-green-600">{halalCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white hover:bg-gray-100 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Не халяль</p>
                  <p className="text-2xl font-extrabold text-red-600">{notHalalCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white hover:bg-gray-100 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Сомнительно</p>
                  <p className="text-2xl font-extrabold text-yellow-600">{questionableCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white hover:bg-gray-100 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Чистый состав</p>
                  <p className="text-2xl font-extrabold text-cyan-600">{cleanCount}</p>
                </div>
                <Sparkles className="h-8 w-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simplified History List */}
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              className="bg-white hover:shadow-md transition-all cursor-pointer hover:bg-gray-100"
              onClick={() => handleItemClick(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.productName}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 truncate">{item.productName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </div>
                          <p className="text-xs text-gray-400">{item.time}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Загрузить еще
          </Button>
        </div>

        {/* Detailed Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <img
                      src={selectedItem.image || "/placeholder.svg"}
                      alt={selectedItem.productName}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-bold">{selectedItem.productName}</h2>
                      <p className="text-gray-600 font-normal">{selectedItem.brand}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 p-4">
                  {/* Status and Confidence */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(selectedItem.status)}
                      {getStatusBadge(selectedItem.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Уверенность</p>
                      <p className="text-lg font-bold">{selectedItem.confidence}</p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Основная информация</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Категория:</span>
                          <Badge variant="outline">{selectedItem.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Дата проверки:</span>
                          <span>
                            {selectedItem.date} в {selectedItem.time}
                          </span>
                        </div>
                        {selectedItem.barcode && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Штрих-код:</span>
                            <span className="font-mono">{selectedItem.barcode}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Производитель</h4>
                      <div className="space-y-2 text-sm">
                        {selectedItem.manufacturer && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Компания:</span>
                            <span>{selectedItem.manufacturer}</span>
                          </div>
                        )}
                        {selectedItem.country && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Страна:</span>
                            <span>{selectedItem.country}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Состав продукта</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="ingredient">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Certificate or Reason */}
                  {selectedItem.halalCertificate && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">✓ Халяль сертификат</h4>
                      <p className="text-green-700">{selectedItem.halalCertificate}</p>
                    </div>
                  )}

                  {selectedItem.reason && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">⚠ Причина отклонения</h4>
                      <p className="text-red-700">{selectedItem.reason}</p>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {selectedItem.additionalNotes && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">📝 Дополнительные заметки</h4>
                      <p className="text-blue-700">{selectedItem.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 