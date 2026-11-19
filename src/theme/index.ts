import { Platform } from 'react-native';

export const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, serif',
});

export const colors = {
  // Warm terracotta / coral-red primary inspired by the reference design
  primary: '#E54D2E',
  primaryDark: '#C73B1D',
  primaryLight: '#FDF0EC',
  primaryMuted: '#FAD8CE',
  accentPeach: '#FDEEE9',

  // Soft warm almond-milk background
  background: '#F8F6F2',
  secondaryBackground: '#EFECE6',
  card: '#FFFFFF',

  // Typography colors
  textPrimary: '#1E1D1B',
  textSecondary: '#7C7975',
  textMuted: '#A5A29D',

  // Borders
  border: '#E8E4DD',
  borderLight: '#F1EDE6',

  // Status tokens
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#D32F2F',
  errorLight: '#FFEBEE',

  white: '#FFFFFF',
  black: '#000000',

  // Badges
  badgePeach: '#FDEEE9',
  badgePeachText: '#C73B1D',
  badgeGreen: '#E8F5E9',
  badgeGreenText: '#2E7D32',
  badgeRed: '#FFEBEE',
  badgeYellow: '#FEF3C7',
  badgeYellowText: '#D97706',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const typography = {
  fontFamily: {
    serif: serifFont,
    sans: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'system-ui, -apple-system, sans-serif',
    }),
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    hero: 28,
    display: 34,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 9999,
};

export const shadows = {
  subtle: {
    shadowColor: '#2B1E16',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: '#2B1E16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  dish: {
    shadowColor: '#2B1E16',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
};
