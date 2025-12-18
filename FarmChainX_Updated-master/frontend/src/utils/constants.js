export const APP_CONFIG = {
  name: 'FarmChainX',
  version: '1.0.0',
  description: 'AI-Driven Agricultural Traceability & Marketplace'
}

export const ROLES = {
  FARMER: 'FARMER',
  ADMIN: 'ADMIN',
  BUYER: 'BUYER'
}

export const PRODUCT_GRADES = {
  A: { label: 'Premium', color: 'green', minScore: 90 },
  B: { label: 'Standard', color: 'yellow', minScore: 80 },
  C: { label: 'Economy', color: 'orange', minScore: 70 }
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}