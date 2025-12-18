export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const calculateConfidence = (score) => {
  if (score >= 90) return { grade: 'A', color: 'green' }
  if (score >= 80) return { grade: 'B', color: 'yellow' }
  if (score >= 70) return { grade: 'C', color: 'orange' }
  return { grade: 'D', color: 'red' }
}

export const generateBatchId = () => {
  const timestamp = new Date().getTime()
  const random = Math.random().toString(36).substr(2, 9)
  return `BCH_${timestamp}_${random}`
}