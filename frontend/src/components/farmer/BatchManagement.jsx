import React, { useState } from "react"
import { Upload, Zap } from 'lucide-react'

const BatchManagement = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handlePredict = (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)

    setTimeout(() => {
      const score = 92
      setResult({
        grade: "A",
        confidence: score,
        notes: "Color & texture within optimal range, no visible defects.",
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          AI Quality Scoring
        </h2>
        <p className="text-xs text-slate-500">
          Upload a product image and get an AI-predicted quality grade and confidence score.
        </p>
      </header>

      <div className="card grid md:grid-cols-2 gap-6">
        <form className="space-y-4" onSubmit={handlePredict}>
          <div>
            <label className="text-[11px] font-medium text-slate-600 mb-1 block">
              Product image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!file || loading}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            {loading ? "Running model..." : "Predict quality"}
          </button>

          <p className="text-[11px] text-slate-400">
            The backend AI model will analyze color, uniformity, and defects.
          </p>
        </form>

        <div className="space-y-4">
          <div className="h-40 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
            {file ? (
              <p className="text-xs text-slate-500 text-center">
                <span className="font-medium">{file.name}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Image preview will appear here.
              </p>
            )}
          </div>

          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl font-bold text-emerald-600">
                  {result.grade}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Predicted grade</p>
                  <p className="text-sm font-semibold text-slate-800">
                    Grade {result.grade} ({result.confidence}% confidence)
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] mb-1 text-slate-500">
                  Model confidence
                </p>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 bg-emerald-500 rounded-full"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500">{result.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BatchManagement
