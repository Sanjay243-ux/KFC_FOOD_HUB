import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Trash2,
  Check,
  Building,
  Home as HomeIcon,
  Briefcase,
} from 'lucide-react-native';
import { useUserStore } from '@/store/useUserStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { SRI_LANKAN_LOCATIONS } from '@/constants/mockData';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Address } from '@/types';

export function AddressesScreen() {
  const router = useRouter();
  const { user, selectedAddress, setSelectedAddress, addAddress, deleteAddress } =
    useUserStore();

  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [contactName, setContactName] = useState(user?.fullName || 'Nimal Perera');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+94 77 123 4567');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [district, setDistrict] = useState(SRI_LANKAN_LOCATIONS[0].district);
  const [city, setCity] = useState(SRI_LANKAN_LOCATIONS[0].cities[0]);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSaveAddress = () => {
    if (!streetAddress.trim()) {
      Alert.alert('Required Field', 'Please enter your street address.');
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      Alert.alert('Required Field', 'Please provide a contact name and phone number.');
      return;
    }

    addAddress({
      label,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      streetAddress: streetAddress.trim(),
      apartment: apartment.trim() || undefined,
      city,
      district,
      deliveryNotes: deliveryNotes.trim() || undefined,
      isDefault,
    });

    setIsAdding(false);
    setStreetAddress('');
    setApartment('');
    setDeliveryNotes('');
    Alert.alert('Address Saved', 'Your new delivery address has been saved.');
  };

  const currentDistrictCities =
    SRI_LANKAN_LOCATIONS.find((d) => d.district === district)?.cities || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.headerTitle}>Delivery Addresses</Text>
        <Pressable
          onPress={() => setIsAdding(!isAdding)}
          style={styles.addBtn}
          accessibilityLabel="Add new address"
        >
          <Plus size={20} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isAdding && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Delivery Address</Text>

            {/* Label Chips (Home, Work, Other) */}
            <View style={styles.labelChips}>
              {(['Home', 'Work', 'Other'] as const).map((l) => (
                <Pressable
                  key={l}
                  onPress={() => setLabel(l)}
                  style={[styles.labelChip, label === l && styles.labelChipSelected]}
                >
                  <Text
                    style={[
                      styles.labelChipText,
                      label === l && styles.labelChipTextSelected,
                    ]}
                  >
                    {l}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipient Name</Text>
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Phone</Text>
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                style={styles.textInput}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>District (Sri Lanka)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                {SRI_LANKAN_LOCATIONS.map((loc) => (
                  <Pressable
                    key={loc.district}
                    onPress={() => {
                      setDistrict(loc.district);
                      setCity(loc.cities[0]);
                    }}
                    style={[
                      styles.locPill,
                      district === loc.district && styles.locPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.locPillText,
                        district === loc.district && styles.locPillTextSelected,
                      ]}
                    >
                      {loc.district}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City / Area</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                {currentDistrictCities.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCity(c)}
                    style={[styles.locPill, city === c && styles.locPillSelected]}
                  >
                    <Text
                      style={[
                        styles.locPillText,
                        city === c && styles.locPillTextSelected,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Street Address & House No.</Text>
              <TextInput
                value={streetAddress}
                onChangeText={setStreetAddress}
                placeholder="e.g. No. 12, Galle Road"
                placeholderTextColor={colors.textMuted}
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Apartment / Floor (Optional)</Text>
              <TextInput
                value={apartment}
                onChangeText={setApartment}
                placeholder="e.g. Apt 3A, Tower 2"
                placeholderTextColor={colors.textMuted}
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Delivery Instructions (Optional)</Text>
              <TextInput
                value={deliveryNotes}
                onChangeText={setDeliveryNotes}
                placeholder="e.g. Ring the bell twice, leave with security"
                placeholderTextColor={colors.textMuted}
                style={styles.textInput}
              />
            </View>

            <View style={styles.formActions}>
              <PrimaryButton
                title="Cancel"
                onPress={() => setIsAdding(false)}
                variant="secondary"
                size="md"
              />
              <PrimaryButton
                title="Save Address"
                onPress={handleSaveAddress}
                variant="primary"
                size="md"
              />
            </View>
          </View>
        )}

        {/* Existing Addresses List */}
        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>

          {user?.addresses?.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;

            return (
              <Pressable
                key={addr.id}
                onPress={() => setSelectedAddress(addr)}
                style={[
                  styles.addressCard,
                  isSelected && styles.addressCardSelected,
                ]}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.labelBox}>
                    <MapPin size={16} color={colors.primary} />
                    <Text style={styles.cardLabel}>{addr.label}</Text>
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>

                  <Pressable
                    onPress={() => deleteAddress(addr.id)}
                    hitSlop={8}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={16} color={colors.textMuted} />
                  </Pressable>
                </View>

                <Text style={styles.addressLine}>
                  {addr.streetAddress}
                  {addr.apartment ? `, ${addr.apartment}` : ''}
                </Text>
                <Text style={styles.cityLine}>
                  {addr.city}, {addr.district}
                </Text>
                <Text style={styles.phoneLine}>Contact: {addr.contactPhone}</Text>

                {isSelected ? (
                  <View style={styles.selectedIndicator}>
                    <Check size={14} color={colors.success} strokeWidth={2.5} />
                    <Text style={styles.selectedText}>Active Delivery Address</Text>
                  </View>
                ) : (
                  <Text style={styles.tapToSelectText}>Tap to set as active</Text>
                )}
              </Pressable>
            );
          })}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: 46,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  headerTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 40,
    gap: spacing.base,
  },
  formCard: {
    backgroundColor: colors.secondaryBackground,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  labelChips: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  labelChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  labelChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  labelChipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  labelChipTextSelected: {
    color: colors.white,
  },
  inputGroup: {
    marginBottom: spacing.sm,
  },
  inputLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  locPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  locPillSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  locPillText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  locPillTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  addressSection: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  addressCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: colors.secondaryBackground,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  deleteBtn: {
    padding: 4,
  },
  addressLine: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cityLine: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  phoneLine: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  selectedText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  tapToSelectText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
