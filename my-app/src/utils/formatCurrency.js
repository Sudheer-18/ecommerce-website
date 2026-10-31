export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

export const getDiscountPercent = (price, discountedPrice) => {
  if (!price || Number(price) <= Number(discountedPrice || 0)) return 0
  return Math.round(((Number(price) - Number(discountedPrice)) / Number(price)) * 100)
}
