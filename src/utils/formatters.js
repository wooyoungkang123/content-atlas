export const formatNumber = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

export const formatComma = (n) => n.toLocaleString('en-US')

export const formatPercent = (n, decimals = 1) => `${n.toFixed(decimals)}%`

export const formatYear = (d) => String(d)
