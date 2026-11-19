import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Clock,
  Heart,
  CreditCard,
  Bell,
  Headphones,
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Phone,
  User,
} from 'lucide-react-native';
import { useUserStore } from '@/store/useUserStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';

export function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useUserStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/auth/sign-in' as any);
        },
      },
    ]);
  };

  const handleCallHotline = () => {
    Linking.openURL('tel:+94115532532').catch(() => {
      Alert.alert('KFC Customer Service', 'Hotline: +94 11 553 2532\nHours: 10:00 AM - 11:00 PM');
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account & Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <User size={30} color={colors.primary} />
            </View>
          )}

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Sign in to access your rewards'}</Text>
            <Text style={styles.userPhone}>{user?.phone || '+94 77 123 4567'}</Text>
          </View>
        </View>

        {/* Quick Menu Options */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupHeading}>Ordering & Preferences</Text>

          <Pressable
            onPress={() => router.push('/profile/addresses' as any)}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                <MapPin size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Saved Delivery Addresses</Text>
                <Text style={styles.menuItemSub}>
                  {user?.addresses?.length || 0} addresses saved
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/orders' as any)}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.warningLight }]}>
                <Clock size={18} color={colors.warning} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Order History & Tracking</Text>
                <Text style={styles.menuItemSub}>Past deliveries & reorders</Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/menu' as any)}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.badgeRed }]}>
                <Heart size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Favorite Meals</Text>
                <Text style={styles.menuItemSub}>
                  {user?.favoriteProductIds?.length || 0} saved items
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Support & Contact */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupHeading}>Help & Support</Text>

          <Pressable
            onPress={handleCallHotline}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.successLight }]}>
                <Phone size={18} color={colors.success} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Customer Care Hotline</Text>
                <Text style={styles.menuItemSub}>+94 11 553 2532 (Toll Free)</Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={() =>
              Alert.alert('Terms & Privacy', 'KFC Sri Lanka respects customer privacy and data security. All payment transactions comply with PCI-DSS standards.')
            }
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.secondaryBackground }]}>
                <FileText size={18} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Terms of Service & Privacy</Text>
                <Text style={styles.menuItemSub}>Legal policies and notices</Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Sri Lanka Delivery Guarantee */}
        <View style={styles.infoBanner}>
          <ShieldCheck size={20} color={colors.primary} />
          <Text style={styles.infoBannerText}>
            KFC Sri Lanka Official Delivery App • Version 1.0.0
          </Text>
        </View>

        {/* Sign Out Button */}
        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOutBtn, pressed && styles.signOutBtnPressed]}
        >
          <LogOut size={18} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: 48,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 110,
    gap: spacing.base,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.base,
    ...shadows.card,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  menuGroup: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  groupHeading: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  menuItemPressed: {
    backgroundColor: colors.secondaryBackground,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  menuItemSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  infoBannerText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.medium,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.badgeRed,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  signOutBtnPressed: {
    opacity: 0.8,
  },
  signOutText: {
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
});
