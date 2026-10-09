export function formatMoney(cents, currency = 'usd') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100)
}

// Free courses (price 0) are labelled instead of showing "$0".
export function formatPrice(cents, currency = 'usd') {
  return !cents || cents <= 0 ? 'Free' : formatMoney(cents, currency)
}

export function formatDate(value) {
  if (!value) return null
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}
