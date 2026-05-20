/**
 * Format a number as currency
 */
export function formatCurrency(amount, currency = '$') {
  if (amount === null || amount === undefined || isNaN(amount)) return `${currency}0.00`
  const num = parseFloat(amount)
  return `${currency}${Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Format currency with sign (negative shows as red)
 */
export function formatCurrencySigned(amount, currency = '$') {
  const num = parseFloat(amount) || 0
  const sign = num < 0 ? '-' : ''
  return `${sign}${currency}${Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Format a percentage
 */
export function formatPercent(value, decimals = 1) {
  if (!value || isNaN(value)) return '0%'
  return `${parseFloat(value).toFixed(decimals)}%`
}
