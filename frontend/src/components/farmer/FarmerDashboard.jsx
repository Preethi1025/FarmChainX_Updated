import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const qualityData = [
  { day: "Mon", score: 82 },
  { day: "Tue", score: 88 },
  { day: "Wed", score: 91 },
  { day: "Thu", score: 86 },
  { day: "Fri", score: 92 },
]

const shipmentData = [
  { label: "In Transit", value: 4 },
  { label: "Delivered", value: 12 },
  { label: "Pending QR", value: 3 },
]

const FarmerDashboard = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Farmer Overview
          </h1>
          <p className="text-xs text-slate-500">
            Monitor harvest quality, active batches, and handovers at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="badge">Today’s AI Quality Avg: 91%</span>
          <span className="badge bg-sky-50 text-sky-700">Active Batches: 7</span>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-4">
        {shipmentData.map((card) => (
          <div key={card.label} className="card">
            <p className="text-xs text-slate-500 mb-1">{card.label}</p>
            <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Updated a few minutes ago
            </p>
          </div>
        ))}
      </section>

      <section className="grid lg:grid-cols-3 gap-5">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-800">
              Weekly AI Quality Score Trend
            </p>
            <span className="text-[11px] text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">
              +4.8% vs last week
            </span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={qualityData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[70, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#16a34a"
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            Quick Stats
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700"><span className="font-semibold">Total Harvested:</span> 247 kg</p>
            <p className="text-slate-700"><span className="font-semibold">Avg Grade:</span> A</p>
            <p className="text-slate-700"><span className="font-semibold">Revenue:</span> $3,421</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FarmerDashboard
