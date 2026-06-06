import BottomSheet from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationDetailSheet } from '@/components/notifications/NotificationDetailSheet';
import { AppScreen } from '@/components/shared/AppScreen';
import { EmptyState } from '@/components/shared/EmptyState';
import { FilterChips } from '@/components/shared/FilterChips';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { spacing } from '@/constants/theme';
import { useNotificationShadeSync } from '@/hooks/use-notification-shade-sync';
import { useNotificationsInfiniteQuery } from '@/hooks/use-notifications';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { groupNotificationsByDate } from '@/lib/utils/group-notifications';
import type { NotificationRecord } from '@/types/notification/notification.types';
import { useWhitelistStore } from '@/stores/whitelist-store';

type ListItem =
  | { type: 'header'; title: string; key: string }
  | { type: 'notification'; record: NotificationRecord; key: string };

export default function FeedScreen() {
  const { colors } = useThemeColors();
  const appLabels = useWhitelistStore((s) => s.appLabels);
  const allowedPackages = useWhitelistStore((s) => s.allowedPackages);
  const [search, setSearch] = useState('');
  const [packageFilter, setPackageFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<NotificationRecord | null>(null);
  const sheetRef = useRef<BottomSheet>(null);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      packageName: packageFilter ?? undefined,
    }),
    [search, packageFilter]
  );

  const { syncFromShade, canSync } = useNotificationShadeSync();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch, isRefetching } =
    useNotificationsInfiniteQuery(filters);

  const refreshFeed = useCallback(async () => {
    if (canSync) {
      await syncFromShade();
    }
    await refetch();
  }, [canSync, syncFromShade, refetch]);

  const records = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const listItems = useMemo((): ListItem[] => {
    const sections = groupNotificationsByDate(records);
    const items: ListItem[] = [];
    for (const section of sections) {
      items.push({ type: 'header', title: section.title, key: `h-${section.title}` });
      for (const record of section.data) {
        items.push({ type: 'notification', record, key: record.id });
      }
    }
    return items;
  }, [records]);

  const chipOptions = useMemo(
    () =>
      allowedPackages.map((pkg) => ({
        id: pkg,
        label: appLabels[pkg] ?? pkg.split('.').pop() ?? pkg,
      })),
    [allowedPackages, appLabels]
  );

  const openDetail = useCallback((record: NotificationRecord) => {
    setSelected(record);
    sheetRef.current?.expand();
  }, []);

  if (isLoading) {
    return (
      <AppScreen title="Feed" subtitle="Loading notifications..." scroll={false}>
        <View style={styles.skeletons}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      title="Feed"
      subtitle={`${records.length} shown`}
      scroll={false}
      contentStyle={styles.feedContent}
    >
      <TextInput
        accessibilityLabel="Search notifications"
        placeholder="Search..."
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.search,
          { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      />
      <FilterChips
        options={chipOptions}
        selectedId={packageFilter}
        onSelect={setPackageFilter}
      />
      {listItems.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyScroll}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => void refreshFeed()}
              tintColor={colors.accent}
            />
          }
        >
          <EmptyState
            title="No notifications yet"
            description={
              canSync
                ? 'Pull down to sync alerts still in your notification shade. Cleared alerts cannot be recovered on Android.'
                : 'Enable notification access and whitelist an app in the Apps tab.'
            }
          />
        </ScrollView>
      ) : (
        <View style={styles.listContainer}>
          <FlashList
            data={listItems}
            keyExtractor={(item) => item.key}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => void refreshFeed()}
                tintColor={colors.accent}
              />
            }
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                void fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return (
                  <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                    {item.title}
                  </Text>
                );
              }
              return (
                <View style={styles.cardWrap}>
                  <NotificationCard record={item.record} onPress={openDetail} />
                </View>
              );
            }}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator color={colors.accent} style={styles.footer} />
              ) : null
            }
          />
        </View>
      )}
      <NotificationDetailSheet
        ref={sheetRef}
        record={selected}
        onClose={() => {
          setSelected(null);
          sheetRef.current?.close();
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  feedContent: { flex: 1 },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  listContainer: { flex: 1, minHeight: 300 },
  emptyScroll: { flexGrow: 1, justifyContent: 'center' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginVertical: spacing.sm,
  },
  cardWrap: { marginBottom: spacing.sm },
  skeletons: { gap: spacing.sm, padding: spacing.md },
  footer: { padding: spacing.md },
});
