import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface FileUploadButtonProps {
  onPress: () => void;
  loading?: boolean;
  fileName?: string;
  disabled?: boolean;
  label?: string;
}

export function FileUploadButton({
  onPress,
  loading = false,
  fileName,
  disabled = false,
  label = 'Upload File',
}: FileUploadButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const elevation = useSharedValue(2);

  const hasFile = !!fileName;

  // Animated styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    elevation: elevation.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    elevation.value = withTiming(1);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    elevation.value = withTiming(2);
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <Animated.View style={animatedCardStyle}>
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: hasFile ? '#4CAF50' : theme.colors.outline,
            borderWidth: hasFile ? 2 : 1,
          },
        ]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.contentContainer}>
            {/* Icon Container */}
            <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: hasFile
                  ? '#E8F5E9'
                  : theme.colors.surfaceVariant,
              },
            ]}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                />
              ) : hasFile ? (
                <MaterialIcons
                  name="check-circle"
                  size={32}
                  color="#4CAF50"
                />
              ) : (
                <MaterialIcons
                  name="cloud-upload"
                  size={32}
                  color={theme.colors.onSurfaceVariant}
                />
              )}
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text
                variant="titleMedium"
                style={[
                  styles.title,
                  {
                    color: hasFile ? '#2E7D32' : theme.colors.onSurface,
                  },
                ]}
              >
                {hasFile ? '✓ File Uploaded Successfully' : label}
              </Text>
              {hasFile && fileName ? (
                <View style={styles.fileInfoContainer}>
                  <Chip
                    icon="file-document"
                    mode="flat"
                    style={[styles.chip, { backgroundColor: '#E8F5E9' }]}
                    textStyle={[styles.chipText, { color: '#2E7D32' }]}
                  >
                    {fileName.length > 35 ? `${fileName.substring(0, 35)}...` : fileName}
                  </Chip>
                </View>
              ) : (
                <Text
                  variant="bodySmall"
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Tap to select a JSON file
                </Text>
              )}
            </View>

            {/* Action Button */}
            {!loading && !hasFile && (
              <IconButton
                icon="arrow-up-circle"
                size={28}
                iconColor={theme.colors.primary}
                style={styles.actionButton}
                onPress={handlePress}
                disabled={disabled}
              />
            )}
          </View>
        </Card.Content>

        {/* Optional: Upload Button at Bottom */}
        {hasFile && (
          <Card.Actions style={styles.actions}>
            <Button
              mode="text"
              onPress={handlePress}
              disabled={disabled || loading}
              icon="refresh"
            >
              Change File
            </Button>
          </Card.Actions>
        )}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
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
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    marginTop: 2,
  },
  fileInfoContainer: {
    marginTop: 8,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
  },
  actionButton: {
    margin: 0,
  },
  actions: {
    paddingTop: 0,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});