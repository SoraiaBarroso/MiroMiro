export function useCurrency() {
  // Format price in EUR
  const formatPrice = (eurAmount: number): string => {
    return `€${eurAmount}`
  }

  // Static disclaimer for all users
  const disclaimer = 'Final price in your local currency at checkout.'

  return {
    formatPrice,
    disclaimer
  }
}
