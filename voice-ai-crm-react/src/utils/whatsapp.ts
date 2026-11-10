export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return '';
  let digits = (phone + '').replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    digits = '91' + digits; // Default Indian 10-digit mobile
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = '91' + digits.substring(1);
  }
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = formatWhatsAppPhone(phone);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

