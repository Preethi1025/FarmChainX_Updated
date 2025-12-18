import React, { useState } from "react"
import { Zap } from 'lucide-react'

const mockJourney = [
  { label: "Farm & Harvest", detail: "Kavya Farms, Andhra Pradesh", date: "2025-11-23" },
  { label: "Quality Graded", detail: "AI Grade A (93%)", date: "2025-11-24" },
  { label: "Cold Storage", detail: "Maintained at 4°C", date: "2025-11-24" },
  { label: "Retail Shelf", detail: "GreenMart Hyderabad", date: "2025-11-25" },
]

const ProductBrowser = () => {
  const [value, setValue] = useState("")
  const [scanned, setScanned] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value) return
    setScanned(true)
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Scan / Enter QR Code
        </h2>
        <p className="text-xs text-slate-500">
          Use your device camera to scan a QR or paste the code printed on your product.
        </p>
      </header>

      <div className="card grid lg:grid-cols-[1.4fr,2fr] gap-6">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-[11px] font-medium text-slate-600 mb-1 block">
              QR value / Batch URL
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://trace.farmchainx.com/batch/FARM-MNG-2025-001"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button type="submit" className="btn-primary text-xs w-full flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            View product journey
          </button>
          <p className="text-[11px] text-slate-400">
            In a real deployment, this page would automatically open when you scan the QR using your phone camera.
          </p>
        </form>

        <div className="space-y-3">
          {scanned ? (
            <>
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    Product details
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    FarmChainX Organic Mangoes
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Batch: FARM-MNG-2025-001 · Certification: FSSAI Verified
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">AI Quality Score</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    93%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-700 uppercase mb-2">
                  Farm to consumer journey
                </p>
                <ol className="relative border-l border-slate-200 pl-4 text-xs space-y-4">
                  {mockJourney.map((step, i) => (
                    <li key={i} className="pb-4 last:pb-0">
                      <p className="font-semibold text-slate-900">{step.label}</p>
                      <p className="text-slate-600 text-[11px]">{step.detail}</p>
                      <p className="text-slate-400 text-[11px] mt-1">{step.date}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500 text-sm">
              Enter a QR code or batch URL to view the product journey
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductBrowser
