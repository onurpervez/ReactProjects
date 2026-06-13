import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../utils/getHistory'
import { calculateTDEE } from '../utils/calculateTDEE'
import { ui } from '../styles'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'

export default function HistoryPage() {
  const { profile, settings } = useAuth()
  const navigate = useNavigate()

  if (!profile) return null

  const history  = getHistory(profile.username, 7)
  const tdee     = settings.dailyGoalOverride ?? calculateTDEE(profile)
  const reversed = [...history].reverse()

  const chartData = reversed.map(d => ({
    name:    d.label,
    Kalori:  d.totalCalories,
    Protein: d.totalProtein,
    Karb:    d.totalCarbs,
  }))

  const filled   = history.filter(d => d.totalCalories > 0)
  const avgKcal  = filled.length > 0
    ? Math.round(filled.reduce((s, d) => s + d.totalCalories, 0) / filled.length)
    : 0
  const avgProt  = filled.length > 0
    ? Math.round(filled.reduce((s, d) => s + d.totalProtein, 0) / filled.length * 10) / 10
    : 0
  const avgCarb  = filled.length > 0
    ? Math.round(filled.reduce((s, d) => s + d.totalCarbs, 0) / filled.length * 10) / 10
    : 0

  return (
    <div className={ui.pageWrapper}>
      <div className="w-44 bg-gray-300 border-r border-gray-300 flex flex-col p-3 gap-1">
        <div className={ui.sidebarLogo}>
          Macro<span className="text-blue-500">Track</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className={ui.navPassive}>Dashboard</button>
        <button className={ui.navActive}>Geçmiş</button>
        <button onClick={() => navigate('/settings')} className={ui.navPassive}>Ayarlar</button>
      </div>

      <div className={ui.mainWrapper}>
        <div className={ui.content}>

          <div className={`${ui.card} flex flex-col gap-4`}>
            <h2 className={ui.cardTitle}>Son 7 gün — kalori</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #d1d5db', background: '#f3f4f6' }}
                />
                <ReferenceLine
                  y={tdee}
                  stroke="#3b82f6"
                  strokeDasharray="4 4"
                  label={{ value: `Hedef ${tdee}`, fontSize: 11, fill: '#3b82f6', position: 'insideTopRight' }}
                />
                <Bar dataKey="Kalori" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${ui.card} flex flex-col gap-4`}>
            <h2 className={ui.cardTitle}>Son 7 gün — makrolar</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #d1d5db', background: '#f3f4f6' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Karb"    fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Protein" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={ui.grid3}>
            <div className={ui.pill}>
              <p className={ui.muted}>Ort. kalori</p>
              <p className="text-base font-medium text-black mt-1">
                {avgKcal} <span className="text-xs text-gray-400 font-normal">kcal</span>
              </p>
            </div>
            <div className={ui.pill}>
              <p className={ui.muted}>Ort. protein</p>
              <p className="text-base font-medium text-black mt-1">
                {avgProt} <span className="text-xs text-gray-400 font-normal">g</span>
              </p>
            </div>
            <div className={ui.pill}>
              <p className={ui.muted}>Ort. karb</p>
              <p className="text-base font-medium text-black mt-1">
                {avgCarb} <span className="text-xs text-gray-400 font-normal">g</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}