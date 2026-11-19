import { OrderStatus } from '@/types';
import { colors } from '@/theme';

/**
 * Format currency into standard Sri Lankan Rupee representation: "LKR 1,250.00"
 */
export function formatLKR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'LKR 0.00';
  }
  const formatted = Math.max(0, amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `LKR ${formatted}`;
}

/**
 * Format Sri Lankan phone number: "+94 77 123 4567" or "077 123 4567"
 */
export function formatSLPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('94') && digits.length === 11) {
    return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

/**
 * Validate Sri Lankan mobile phone
 */
export function isValidSLPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  // Matches 07XXXXXXXX (10 digits) or 947XXXXXXXX (11 digits)
  return /^(?:07\d{8}|947\d{8})$/.test(digits);
}

/**
 * Get human readable status label and badge colors for OrderStatus
 */
export function getOrderStatusMeta(status: OrderStatus): {
  label: string;
  step: number;
  badgeBg: string;
  textColor: string;
  description: string;
} {
  switch (status) {
    case 'placed':
      return {
        label: 'Order Placed',
        step: 1,
        badgeBg: colors.warningLight,
        textColor: colors.warning,
        description: 'Your order has been received and sent to the kitchen.',
      };
    case 'confirmed':
      return {
        label: 'Order Confirmed',
        step: 2,
        badgeBg: colors.primaryLight,
        textColor: colors.primary,
        description: 'The kitchen has confirmed your order.',
      };
    case 'preparing':
      return {
        label: 'Preparing Food',
        step: 3,
        badgeBg: colors.warningLight,
        textColor: colors.warning,
        description: 'Freshly coating and cooking your chicken.',
      };
    case 'ready':
      return {
        label: 'Ready for Dispatch',
        step: 4,
        badgeBg: colors.primaryLight,
        textColor: colors.primary,
        description: 'Packed hot and awaiting driver pickup.',
      };
    case 'out_for_delivery':
      return {
        label: 'Out for Delivery',
        step: 5,
        badgeBg: colors.badgeYellow,
        textColor: colors.badgeYellowText,
        description: 'Driver is on the way to your delivery address.',
      };
    case 'delivered':
      return {
        label: 'Delivered',
        step: 6,
        badgeBg: colors.successLight,
        textColor: colors.success,
        description: 'Order delivered successfully. Enjoy your meal!',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        step: 0,
        badgeBg: colors.errorLight,
        textColor: colors.error,
        description: 'This order was cancelled.',
      };
  }
}
