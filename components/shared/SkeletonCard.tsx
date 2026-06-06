import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { radius, spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface SkeletonCardProps {
  lines?: number;
}

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  const { colors } = useThemeColors();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.card,
        animatedStyle,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.lineWide, { backgroundColor: colors.surfaceElevated }]} />
      {Array.from({ length: lines }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.line,
            { backgroundColor: colors.surfaceElevated, width: index === lines - 1 ? '60%' : '90%' },
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  lineWide: { height: 14, borderRadius: radius.sm, width: '40%' },
  line: { height: 10, borderRadius: radius.sm },
});
