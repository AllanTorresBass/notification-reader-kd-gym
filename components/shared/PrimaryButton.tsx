import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const { colors } = useThemeColors();

  const backgroundColor =
    variant === 'primary'
      ? colors.accent
      : variant === 'danger'
        ? colors.danger
        : colors.surfaceElevated;
  const textColor = variant === 'secondary' ? colors.text : '#FFFFFF';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: { fontSize: 16, fontWeight: '600' },
});
