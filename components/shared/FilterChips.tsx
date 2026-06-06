import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export interface FilterChipOption {
  id: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterChipOption[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function FilterChips({ options, selectedId, onSelect }: FilterChipsProps) {
  const { colors } = useThemeColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show all apps"
        onPress={() => onSelect(null)}
        style={[
          styles.chip,
          {
            backgroundColor: selectedId === null ? colors.accent : colors.chip,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={{ color: selectedId === null ? '#FFF' : colors.text, fontWeight: '600' }}>
          All
        </Text>
      </Pressable>
      {options.map((option) => {
        const selected = selectedId === option.id;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${option.label}`}
            onPress={() => onSelect(option.id)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? colors.accent : colors.chip,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: selected ? '#FFF' : colors.text, fontWeight: '600' }}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
