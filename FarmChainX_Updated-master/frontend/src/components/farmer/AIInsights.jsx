import React, { useState } from "react"
import { Upload } from 'lucide-react'

const AIInsights = () => {
  const [form, setForm] = useState({
    productName: "",
    cropType: "",
    soilType: "",
    pesticidesUsed: "",
    harvestDate: "",
    quantity: "",
    unit: "kg",
    location: "",
  })
  const [image, setImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      alert("Product metadata submitted (mock)")
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Farm Product Upload
        </h2>
        <p className="text-xs text-slate-500">
          Capture detailed farm metadata including soil, crop, pesticide usage, and location.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="card grid gap-4 md:grid-cols-[2fr,1.4fr]"
      >
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Product details</h3>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                Product name
              </label>
              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                required
                placeholder="Organic Mangoes"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                Crop type
              </label>
              <select
                name="cropType"
                value={form.cropType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select type</option>
                <option>Fruit</option>
                <option>Vegetable</option>
                <option>Cereal</option>
                <option>Pulses</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                Soil type
              </label>
              <select
                name="soilType"
                value={form.soilType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select soil</option>
                <option>Alluvial</option>
                <option>Black</option>
                <option>Red</option>
                <option>Laterite</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                Pesticides used
              </label>
              <input
                name="pesticidesUsed"
                value={form.pesticidesUsed}
                onChange={handleChange}
                placeholder="Neem-based bio pesticide"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Product image</h3>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
            {image ? (
              <p className="text-xs text-slate-600 font-medium">{image.name}</p>
            ) : (
              <div className="space-y-1">
                <Upload className="h-6 w-6 mx-auto text-slate-400" />
                <label className="text-xs text-slate-600 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                  <span className="text-green-600 font-medium hover:underline">Click to upload</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default AIInsights

function SectionTitle({ title }) {
  return (
    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
      {title}
    </p>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[11px] font-medium text-slate-600 mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}
