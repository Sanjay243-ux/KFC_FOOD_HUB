import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Clock, Utensils, Package, Bike, CheckCircle2 } from 'lucide-react-native';
import { OrderStatus } from '@/types';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { getOrderStatusMeta } from '@/utils/formatters';

interface OrderStatusTimelineProps {
  status: OrderStatus;
}

const STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'placed', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Order Confirmed', icon: Check },
  { status: 'preparing', label: 'Preparing Food', icon: Utensils },
  { status: 'ready', label: 'Ready for Dispatch', icon: Package },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  const currentMeta = getOrderStatusMeta(status);
  const currentStepIndex = STEPS.findIndex((s) => s.status === status);

  return (
    <View style={styles.container}>
      {/* Current Status Header Banner */}
      <View style={[styles.headerBanner, { backgroundColor: currentMeta.badgeBg }]}>
        <Text style={[styles.bannerTitle, { color: currentMeta.textColor }]}>
          {currentMeta.label}
        </Text>
        <Text style={styles.bannerSubtitle}>{currentMeta.description}</Text>
      </View>

      {/* Step by step timeline */}
      <View style={styles.timeline}>
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          const IconComponent = step.icon;

          return (
            <View key={step.status} style={styles.stepRow}>
              {/* Left Column: Icon Circle & Connector Line */}
              <View style={styles.indicatorCol}>
                <View
                  style={[
                    styles.iconCircle,
                    isCompleted && styles.circleCompleted,
                    isCurrent && styles.circleCurrent,
                    isUpcoming && styles.circleUpcoming,
                  ]}
                >
                  {isCompleted ? (
                    <Check size={14} color={colors.white} strokeWidth={3} />
                  ) : (
                    <IconComponent
                      size={14}
                      color={isCurrent ? colors.white : colors.textMuted}
                      strokeWidth={2.2}
                    />
                  )}
                </View>

                {index < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.connectorLine,
                      isCompleted ? styles.connectorActive : styles.connectorInactive,
                    ]}
                  />
                )}
              </View>

              {/* Right Column: Step text & timing */}
              <View style={styles.stepInfo}>
                <Text
                  style={[
                    styles.stepLabel,
                    isCurrent && styles.stepLabelCurrent,
                    isCompleted && styles.stepLabelCompleted,
                  ]}
                >
                  {step.label}
                </Text>
                {isCurrent && (
                  <Text style={styles.currentIndicator}>In Progress</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerBanner: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.base,
  },
  bannerTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  timeline: {
    paddingLeft: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 52,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circleCompleted: {
    backgroundColor: colors.success,
  },
  circleCurrent: {
    backgroundColor: colors.primary,
  },
  circleUpcoming: {
    backgroundColor: colors.secondaryBackground,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  connectorActive: {
    backgroundColor: colors.success,
  },
  connectorInactive: {
    backgroundColor: colors.border,
  },
  stepInfo: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingTop: 3,
  },
  stepLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  stepLabelCurrent: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  stepLabelCompleted: {
    color: colors.textPrimary,
  },
  currentIndicator: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
