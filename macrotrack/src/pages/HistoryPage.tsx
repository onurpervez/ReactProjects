import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { getHistory } from '../utils/getHistory'
import { calculateTDEE } from '../utils/calculateTDEE'
import { ui } from '../styles'
import { useEffect, useState } from 'react'
import type { DayHistory } from '../utils/getHistory'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'
import Navbar from '../components/Navbar'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'

export default function HistoryPage() {
  const { profile, settings } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [history, setHistory] = useState<DayHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  // useEffect'in kendi callback'i async olamaz, bu yüzden 
  // içeride asenkron bir fonksiyon tanımlayıp onu çağırıyoruz.
  const loadHistoryData = async () => {
    const username = localStorage.getItem('macrotrack_user') ?? '';
    
    // Fonksiyonun veriyi getirmesini bekliyoruz
    const data = await getHistory(username, 7); 
    
    setHistory(data);
    setLoading(false);
  };

  loadHistoryData();
}, []);

  if (!profile) return null

  const tdee     = settings.dailyGoalOverride ?? calculateTDEE(profile)
  const reversed = [...history].reverse()

  const gridColor    = isDark ? '#3f3f46' : '#e5e7eb'
  const tickColor    = isDark ? '#a1a1aa' : '#6b7280'
  const tooltipStyle = {
    fontSize: 12,
    borderRadius: 8,
    border: `0.5px solid ${isDark ? '#3f3f46' : '#d1d5db'}`,
    background: isDark ? '#18181b' : '#f3f4f6',
    color: isDark ? '#e4e4e7' : '#111827',
  }

  const chartData = reversed.map(d => ({
    name:    d.label,
    Kalori:  d.totalCalories,
    Protein: d.totalProtein,
    Karb:    d.totalCarbs,
    Yağ:     d.totalFat,
  }))

  const filled  = history.filter(d => d.totalCalories > 0)
  const avgKcal = filled.length > 0 ? Math.round(filled.reduce((s, d) => s + d.totalCalories, 0) / filled.length) : 0
  const avgProt = filled.length > 0 ? Math.round(filled.reduce((s, d) => s + d.totalProtein,  0) / filled.length * 10) / 10 : 0
  const avgCarb = filled.length > 0 ? Math.round(filled.reduce((s, d) => s + d.totalCarbs,    0) / filled.length * 10) / 10 : 0

  return (
    <div className={ui.pageWrapper}>
      <Sidebar />
      <div className={ui.mainWrapper}>
        <Navbar />
        <div className={ui.content}>
          {loading ? (
            <p className={ui.muted}>Yükleniyor...</p>
          ) : (
            <>
              <div className={`${ui.card} flex flex-col gap-4`}>
                <h2 className={ui.cardTitle}>Son 7 gün — kalori</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <ReferenceLine
                      y={tdee}
                      stroke="#3b82f6"
                      strokeDasharray="4 4"
                      label={{ value: `Hedef ${tdee}`, fontSize: 11, fill: '#3b82f6', position: 'insideTopRight' }}
                    />
                    <Bar dataKey="Kalori" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={`${ui.card} flex flex-col gap-4`}>
                <h2 className={ui.cardTitle}>Son 7 gün — makrolar</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} />
                    <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12, color: tickColor }} />
                    <Bar dataKey="Karb"    fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Protein" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Yağ"     fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={ui.grid3}>
                {[
                  { label: 'Ort. kalori',  value: avgKcal, unit: 'kcal', valueClass: 'text-blue-600 dark:text-blue-400',   dot: 'bg-blue-500' },
                  { label: 'Ort. protein', value: avgProt, unit: 'g',    valueClass: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-400' },
                  { label: 'Ort. karb',    value: avgCarb, unit: 'g',    valueClass: 'text-orange-500 dark:text-orange-400', dot: 'bg-orange-400' },
                ].map(s => (
                  <div key={s.label} className={ui.pill}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                      <p className={ui.muted}>{s.label}</p>
                    </div>
                    <p className={`text-base font-bold mt-0.5 ${s.valueClass}`}>
                      {s.value} <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">{s.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <MobileNav />
      </div>
    </div>
  )
}