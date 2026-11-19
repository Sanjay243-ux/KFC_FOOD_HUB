import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react-native';
import { useUserStore } from '@/store/useUserStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { PrimaryButton } from '@/components/common/PrimaryButton';

export function SignInScreen() {
  const router = useRouter();
  const { signIn, continueAsGuest } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    // Simulate auth
    setTimeout(() => {
      setLoading(false);
      signIn(email.trim(), 'Nimal Perera', '+94 77 123 4567');
      router.replace('/' as any);
    }, 600);
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace('/' as any);
  };

  return (
    <View style={styles.container}>
      {/* Brand Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>KFC</Text>
        </View>
        <Text style={styles.heroTitle}>Welcome Back!</Text>
        <Text style={styles.heroSubtitle}>
          Sign in to order your crispy favourites and track deliveries
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color={colors.textSecondary} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. nimal@example.lk"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={colors.textSecondary} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              style={styles.input}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={8}
            >
              {showPassword ? (
                <EyeOff size={18} color={colors.textSecondary} />
              ) : (
                <Eye size={18} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() =>
            Alert.alert(
              'Reset Password',
              'A password reset link will be sent to your registered email.'
            )
          }
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>

        <View style={styles.actionBtn}>
          <PrimaryButton
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            size="lg"
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <PrimaryButton
          title="Continue as Guest"
          onPress={handleGuest}
          variant="secondary"
          size="md"
        />

        <View style={styles.registerRow}>
          <Text style={styles.registerPrompt}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/auth/sign-up' as any)}>
            <Text style={styles.registerLink}> Register Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
    ...shadows.dish,
  },
  logoText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: 2,
  },
  heroTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    height: 50,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  actionBtn: {
    marginBottom: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    paddingHorizontal: spacing.md,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.bold,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerPrompt: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
