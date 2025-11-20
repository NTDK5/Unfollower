import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    View,
} from 'react-native';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Chip,
    Divider,
    FAB,
    IconButton,
    ProgressBar,
    Searchbar,
    Text,
    useTheme,
} from 'react-native-paper';
import Animated, {
    FadeInDown,
    FadeInUp,
    Layout,
} from 'react-native-reanimated';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  description?: string;
}

function StatsCard({ title, value, icon, color, description }: StatsCardProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInUp.duration(600)} style={styles.statsCardContainer}>
      <Card
        style={[
          styles.statsCard,
          {
            backgroundColor: theme.colors.surface,
            borderLeftWidth: 4,
            borderLeftColor: color,
          },
        ]}
      >
        <Card.Content style={styles.statsCardContent}>
          <View style={styles.statsHeader}>
            <Avatar.Icon
              size={48}
              icon={icon}
              style={[styles.statsIcon, { backgroundColor: color }]}
            />
            <View style={styles.statsTextContainer}>
              <Text variant="headlineMedium" style={[styles.statsValue, { color }]}>
                {value}
              </Text>
              <Text variant="titleSmall" style={styles.statsTitle}>
                {title}
              </Text>
              {description && (
                <Text variant="bodySmall" style={styles.statsDescription}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

interface UnfollowerItemProps {
  username: string;
  index: number;
  onCopy: (username: string) => void;
  onShare: (username: string) => void;
}

function UnfollowerItem({ username, index, onCopy, onShare }: UnfollowerItemProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400)}
      layout={Layout.springify()}
    >
      <Card
        style={[
          styles.unfollowerCard,
          {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <Card.Content style={styles.unfollowerCardContent}>
          <View style={styles.unfollowerInfo}>
            <Avatar.Text
              size={48}
              label={username.substring(0, 2).toUpperCase()}
              style={{ backgroundColor: theme.colors.primaryContainer }}
            />
            <View style={styles.unfollowerTextContainer}>
              <Text variant="titleMedium" style={styles.unfollowerUsername}>
                @{username}
              </Text>
              <Text variant="bodySmall" style={styles.unfollowerSubtext}>
                Not following you back
              </Text>
            </View>
          </View>
          <View style={styles.unfollowerActions}>
            <IconButton
              icon="content-copy"
              size={22}
              onPress={() => onCopy(username)}
              iconColor={theme.colors.primary}
            />
            <IconButton
              icon="share-variant"
              size={22}
              onPress={() => onShare(username)}
              iconColor={theme.colors.primary}
            />
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

export default function ResultsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ following?: string; followers?: string }>();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUsername, setCopiedUsername] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Parse the data from params
  const { following, followers, unfollowers } = useMemo(() => {
    try {
      const followingList: string[] = params.following
        ? JSON.parse(params.following)
        : [];
      const followersList: string[] = params.followers
        ? JSON.parse(params.followers)
        : [];

      // Create sets for faster lookup
      const followersSet = new Set(followersList);

      // Find people you follow who don't follow you back
      const unfollowersList = followingList.filter(
        (user) => !followersSet.has(user)
      );

      // Validate that we have data
      if (followingList.length === 0 && followersList.length === 0) {
        setHasError(true);
      }

      return {
        following: followingList,
        followers: followersList,
        unfollowers: unfollowersList,
      };
    } catch (error) {
      console.error('Error parsing params:', error);
      setHasError(true);
      return { following: [], followers: [], unfollowers: [] };
    }
  }, [params.following, params.followers]);

  // Redirect back if no data
  if (hasError || (!params.following && !params.followers)) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={64}
          color={theme.colors.error}
        />
        <Text variant="headlineSmall" style={{ marginTop: 20, marginBottom: 12, textAlign: 'center' }}>
          No Data Available
        </Text>
        <Text variant="bodyLarge" style={{ textAlign: 'center', opacity: 0.7, marginBottom: 32 }}>
          Please go back and upload both files to compare.
        </Text>
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  // Filter unfollowers based on search query
  const filteredUnfollowers = useMemo(() => {
    if (!searchQuery.trim()) {
      return unfollowers;
    }
    const query = searchQuery.toLowerCase();
    return unfollowers.filter((username) =>
      username.toLowerCase().includes(query)
    );
  }, [unfollowers, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFollowing = following.length;
    const totalFollowers = followers.length;
    const unfollowersCount = unfollowers.length;
    const unfollowBackCount = followers.filter(
      (user) => !following.includes(user)
    ).length;
    const mutualCount = following.filter((user) =>
      followers.includes(user)
    ).length;

    return {
      totalFollowing,
      totalFollowers,
      unfollowersCount,
      unfollowBackCount,
      mutualCount,
    };
  }, [following, followers, unfollowers]);

  const handleCopyUsername = async (username: string) => {
    await Clipboard.setStringAsync(username);
    setCopiedUsername(username);
    Alert.alert('Copied!', `@${username} copied to clipboard`);
    setTimeout(() => setCopiedUsername(null), 2000);
  };

  const handleShareUsername = async (username: string) => {
    try {
      await Share.share({
        message: `Check out @${username} on Instagram!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share username');
    }
  };

  const handleCopyAllUnfollowers = async () => {
    const unfollowersText = filteredUnfollowers.join('\n');
    await Clipboard.setStringAsync(unfollowersText);
    Alert.alert('Copied!', `All ${filteredUnfollowers.length} usernames copied to clipboard`);
  };

  const handleShareResults = async () => {
    try {
      const resultsText = `
Instagram Unfollower Analysis

📊 Statistics:
- Following: ${stats.totalFollowing}
- Followers: ${stats.totalFollowers}
- Unfollowers: ${stats.unfollowersCount}
- Mutual Follows: ${stats.mutualCount}

👥 Unfollowers (${filteredUnfollowers.length}):
${filteredUnfollowers.map((u) => `@${u}`).join('\n')}
      `.trim();

      try {
        await Share.share({
          message: resultsText,
        });
      } catch {
        await Clipboard.setStringAsync(resultsText);
        Alert.alert('Copied!', 'Results copied to clipboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share results');
    }
  };

  const unfollowerPercentage = stats.totalFollowing > 0
    ? (stats.unfollowersCount / stats.totalFollowing) * 100
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <View style={styles.headerTop}>
            <IconButton
              icon="arrow-left"
              size={28}
              onPress={() => router.back()}
              iconColor={theme.colors.onSurface}
            />
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Analysis Results
            </Text>
            <View style={{ width: 56 }} />
          </View>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Compare your Instagram followers and following
          </Text>
        </Animated.View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Following"
            value={stats.totalFollowing}
            icon="account-plus"
            color="#2196F3"
            description="People you follow"
          />
          <StatsCard
            title="Total Followers"
            value={stats.totalFollowers}
            icon="account-group"
            color="#4CAF50"
            description="People following you"
          />
          <StatsCard
            title="Unfollowers"
            value={stats.unfollowersCount}
            icon="account-remove"
            color="#F44336"
            description="Not following back"
          />
          <StatsCard
            title="Mutual Follows"
            value={stats.mutualCount}
            icon="account-heart"
            color="#FF9800"
            description="Following each other"
          />
        </View>

        {/* Progress Card */}
        {stats.totalFollowing > 0 && (
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <Card
              style={[
                styles.progressCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <View style={styles.progressHeader}>
                  <Text variant="titleMedium" style={styles.progressTitle}>
                    Unfollower Rate
                  </Text>
                  <Badge style={styles.progressBadge}>
                    {unfollowerPercentage.toFixed(1) + '%'}
                  </Badge>
                </View>
                <ProgressBar
                  progress={unfollowerPercentage / 100}
                  color={theme.colors.error}
                  style={styles.progressBar}
                />
                <Text variant="bodySmall" style={styles.progressText}>
                  {stats.unfollowersCount} out of {stats.totalFollowing} people
                  you follow don't follow you back
                </Text>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(300).duration(600)}>
          <Searchbar
            placeholder="Search unfollowers..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            iconColor={theme.colors.primary}
            inputStyle={styles.searchInput}
          />
        </Animated.View>

        {/* Unfollowers List Header */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={styles.listHeader}
        >
          <View style={styles.listHeaderLeft}>
            <Text variant="titleLarge" style={styles.listTitle}>
              Unfollowers
            </Text>
            <Chip
              mode="flat"
              style={styles.countChip}
              textStyle={styles.countChipText}
            >
              {filteredUnfollowers.length}
            </Chip>
          </View>
          {filteredUnfollowers.length > 0 && (
            <View style={styles.listHeaderActions}>
              <Button
                mode="text"
                icon="content-copy"
                onPress={handleCopyAllUnfollowers}
                compact
              >
                Copy All
              </Button>
              <Button
                mode="text"
                icon="share-variant"
                onPress={handleShareResults}
                compact
              >
                Share
              </Button>
            </View>
          )}
        </Animated.View>

        {/* Unfollowers List */}
        {filteredUnfollowers.length === 0 ? (
          <Animated.View
            entering={FadeInUp.delay(500).duration(600)}
            style={styles.emptyState}
          >
            <MaterialCommunityIcons
              name={searchQuery ? "magnify" : "account-check"}
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              {searchQuery
                ? 'No unfollowers found'
                : 'No unfollowers'}
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Everyone you follow follows you back! 🎉'}
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={filteredUnfollowers}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <UnfollowerItem
                username={item}
                index={index}
                onCopy={handleCopyUsername}
                onShare={handleShareUsername}
              />
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      {filteredUnfollowers.length > 0 && (
        <FAB
          icon="share-variant"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleShareResults}
          label="Share Results"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statsCardContainer: {
    marginBottom: 8,
  },
  statsCard: {
    borderRadius: 16,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  statsCardContent: {
    paddingVertical: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statsIcon: {
    backgroundColor: '#2196F3',
  },
  statsTextContainer: {
    flex: 1,
  },
  statsValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  statsDescription: {
    opacity: 0.7,
    marginTop: 2,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontWeight: '600',
  },
  progressBadge: {
    backgroundColor: '#F44336',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    opacity: 0.7,
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listTitle: {
    fontWeight: 'bold',
  },
  countChip: {
    backgroundColor: '#F44336',
  },
  countChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  listHeaderActions: {
    flexDirection: 'row',
    gap: 4,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  unfollowerCard: {
    marginBottom: 8,
    borderRadius: 12,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  unfollowerCardContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  unfollowerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  unfollowerTextContainer: {
    flex: 1,
  },
  unfollowerUsername: {
    fontWeight: '600',
    marginBottom: 2,
  },
  unfollowerSubtext: {
    opacity: 0.6,
  },
  unfollowerActions: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
});

