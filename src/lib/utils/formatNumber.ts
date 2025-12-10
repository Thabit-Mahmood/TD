/**
 * Format a number to always use Western Arabic numerals (0-9)
 * This prevents the display of Eastern Arabic numerals (٠-٩) in Arabic locale
 */
export function formatNumber(num: number | string): string {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return String(num);
  
  // Use Intl.NumberFormat with 'en' locale to ensure Western numerals
  return new Intl.NumberFormat('en-US').format(number);
}

/**
 * Format a number without thousand separators
 */
export function formatNumberPlain(num: number | string): string {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return String(num);
  
  return String(number);
}

/**
 * Convert any Arabic-Indic numerals to Western Arabic numerals
 */
export function toWesternNumerals(str: string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let result = str;
  
  arabicNumerals.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), String(index));
  });
  
  return result;
}
