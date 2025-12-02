import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const BatchManagement = ({ onClose }) => {
  const { user } = useAuth()
  const [batches, setBatches] = useState([])
  const [selected, setSelected] = useState(null)
  const [crops, setCrops] = useState([])

  useEffect(() => {
    if (!user?.id) return
    fetchBatches()
  }, [user])

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/batches/farmer/${user.id}`)
      setBatches(res.data || [])
    } catch (e) {
      console.error('fetch batches', e)
      setBatches([])
    }
  }

  const openBatch = async (batch) => {
    setSelected(batch)
    try {
      const res = await axios.get(`http://localhost:8080/api/batches/${batch.batchId}/crops`)
      setCrops(res.data || [])
    } catch (e) {
      console.error('fetch batch crops', e)
      setCrops([])
    }
  }

  const updateStatus = async (status) => {
    if (!selected) return
    try {
      await axios.put(`http://localhost:8080/api/batches/${selected.batchId}/status`, { status })
      fetchBatches()
      openBatch(selected)
      alert('Batch status updated')
    } catch (e) {
      console.error('update status', e)
      alert('Failed to update')
    }
  }

  const bulkHarvest = async () => {
    if (!selected) return
    try {
      // Set all crops to HARVESTED
      await axios.put(`http://localhost:8080/api/batches/${selected.batchId}/status`, { status: 'HARVESTED' })
      fetchBatches()
      openBatch(selected)
      alert('Batch marked as harvested')
    } catch (e) {
      console.error('bulk harvest', e)
      alert('Failed to bulk harvest')
    }
  }

  const splitBatch = async () => {
    if (!selected) return
    if (!window.confirm(`Split batch ${selected.batchId}? Crops will be divided 50/50 into a new batch.`)) return
    try {
      const res = await axios.post(`http://localhost:8080/api/batches/${selected.batchId}/split`)
      alert(`Batch split! New batch ID: ${res.data.batchId}`)
      fetchBatches()
      setSelected(null)
      setCrops([])
    } catch (e) {
      console.error('split batch', e)
      alert('Failed to split batch')
    }
  }

  const mergeBatch = async () => {
    if (!selected) return
    const targetBatchId = prompt('Enter target batch ID to merge into:')
    if (!targetBatchId) return
    if (!window.confirm(`Merge ${selected.batchId} into ${targetBatchId}? All crops will move and source batch will be deleted.`)) return
    try {
      const res = await axios.post(`http://localhost:8080/api/batches/${selected.batchId}/merge-into/${targetBatchId}`)
      alert(`Batch merged! Target batch now has ${res.data.totalQuantity} units.`)
      fetchBatches()
      setSelected(null)
      setCrops([])
    } catch (e) {
      console.error('merge batch', e)
      alert('Failed to merge batch')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl space-y-4 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">✕</button>
        <h2 className="text-lg font-semibold">Batch Management</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <p className="text-sm font-medium">Batches</p>
            <div className="space-y-2 mt-2">
              {batches.map(b => (
                <div key={b.batchId} className={`p-2 border rounded cursor-pointer ${selected?.batchId===b.batchId? 'bg-sky-50':''}`} onClick={() => openBatch(b)}>
                  <p className="text-sm font-semibold">{b.batchId}</p>
                  <p className="text-xs text-slate-500">Qty: {b.totalQuantity || 0}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            {selected ? (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selected.batchId}</h3>
                    <p className="text-xs text-slate-500">Type: {selected.cropType} • Status: {selected.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus('LISTED')} className="btn">Mark Listed</button>
                    <button onClick={bulkHarvest} className="btn bg-green-600 text-white">Bulk Harvest</button>
                    <button onClick={splitBatch} className="btn bg-blue-600 text-white">Split</button>
                    <button onClick={mergeBatch} className="btn bg-purple-600 text-white">Merge</button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Crops in batch</p>
                  {crops.map(c => (
                    <div key={c.cropId} className="p-2 border rounded flex justify-between">
                      <div>
                        <p className="text-sm">{c.cropName}</p>
                        <p className="text-xs text-slate-500">{c.variety} • {c.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{c.quantity}</p>
                        <p className="text-xs">{c.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Select a batch to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BatchManagement
