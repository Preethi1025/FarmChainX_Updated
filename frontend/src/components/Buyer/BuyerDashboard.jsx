import React from 'react'

const ConsumerDashboard = () => {
  return (
    <div className="space-y-5">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Consumer Verification Portal
          </h2>
          <p className="text-xs text-slate-500">
            Scan a QR from your product to see origin, quality score, and journey.
          </p>
        </div>
        <a href="/consumer/scan" className="btn-primary text-xs">
          Scan new product
        </a>
      </header>

      <div className="card grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Recently scanned
          </p>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">FarmChainX Alphonso</p>
                <p className="text-slate-500">Grade A · Farmer: Kavya Farms</p>
              </div>
              <span className="badge bg-emerald-50 text-emerald-600">Verified</span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-500 text-white p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-75 mb-1">
              Why verify?
            </p>
            <p className="text-sm font-semibold mb-2">
              Ensure your food is authentic, safe, and ethically sourced.
            </p>
            <p className="text-[11px] opacity-80">
              FarmChainX shows the full chain of custody including harvest
              details, transport temperature logs, and certifications.
            </p>
          </div>
          <p className="text-[10px] opacity-70 mt-4">
            Data provided by farmers and distributors via the FarmChainX
            platform.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConsumerDashboard
