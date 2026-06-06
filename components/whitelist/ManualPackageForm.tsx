import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { radius, spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface ManualPackageFormProps {
  onAdd: (packageName: string, appLabel: string) => void;
}

export function ManualPackageForm({ onAdd }: ManualPackageFormProps) {
  const { colors } = useThemeColors();
  const [packageName, setPackageName] = useState('');
  const [appLabel, setAppLabel] = useState('');

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Add package manually</Text>
      <TextInput
        accessibilityLabel="Package name"
        placeholder="com.example.app"
        placeholderTextColor={colors.textMuted}
        value={packageName}
        onChangeText={setPackageName}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceElevated },
        ]}
      />
      <TextInput
        accessibilityLabel="App label"
        placeholder="Display name (optional)"
        placeholderTextColor={colors.textMuted}
        value={appLabel}
        onChangeText={setAppLabel}
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border, backgroundColor: colors.surfaceElevated },
        ]}
      />
      <PrimaryButton
        label="Add to whitelist"
        onPress={() => {
          onAdd(packageName, appLabel || packageName);
          setPackageName('');
          setAppLabel('');
        }}
        disabled={!packageName.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
  },
});
