import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import type { TooltipProps } from '../types';
import { calculatePosition, estimateTooltipSize } from '../utils/positioning';
import { DEFAULT_THEME, DEFAULT_LABELS } from '../constants/theme';

export function Tooltip({
  targetLayout,
  placement,
  visible,
  title,
  description,
  actionText,
  onAction,
  onSkip,
  showSkip,
  stepNumber,
  totalSteps,
  offset = 12,
  safeAreaInsets,
  theme: customTheme,
  labels: customLabels,
}: TooltipProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const tooltipOpacity = useSharedValue(0);
  const tooltipScale = useSharedValue(0.9);
  const tooltipX = useSharedValue(0);
  const tooltipY = useSharedValue(0);
  const arrowRotation = useSharedValue(0);

  const [isVisible, setIsVisible] = useState(false);

  const theme = useMemo(() => {
    if (!customTheme) return DEFAULT_THEME;
    return {
      overlay: { ...DEFAULT_THEME.overlay, ...customTheme.overlay },
      highlight: { ...DEFAULT_THEME.highlight, ...customTheme.highlight },
      tooltip: { ...DEFAULT_THEME.tooltip, ...customTheme.tooltip },
      actions: { ...DEFAULT_THEME.actions, ...customTheme.actions },
      progress: { ...DEFAULT_THEME.progress, ...customTheme.progress },
    };
  }, [customTheme]);

  const labels = useMemo(() => {
    return { ...DEFAULT_LABELS, ...customLabels };
  }, [customLabels]);

  const position = useMemo(() => {
    if (!targetLayout || !safeAreaInsets) return null;

    const estimatedSize = estimateTooltipSize(title, description);

    return calculatePosition({
      targetLayout,
      tooltipWidth: estimatedSize.width,
      tooltipHeight: estimatedSize.height,
      placement,
      offset,
      safeAreaInsets,
      screenWidth,
      screenHeight,
    });
  }, [targetLayout, placement, offset, safeAreaInsets, title, description, screenWidth, screenHeight]);

  useEffect(() => {
    if (visible && position) {
      tooltipX.value = position.x;
      tooltipY.value = position.y;
      setIsVisible(true);

      tooltipOpacity.value = withTiming(1, { duration: 300 });
      tooltipScale.value = withSpring(1, { damping: 15, stiffness: 300 });

      switch (position.placement) {
        case 'top':
          arrowRotation.value = withTiming(180, { duration: 300 });
          break;
        case 'bottom':
          arrowRotation.value = withTiming(0, { duration: 300 });
          break;
        case 'left':
          arrowRotation.value = withTiming(90, { duration: 300 });
          break;
        case 'right':
          arrowRotation.value = withTiming(-90, { duration: 300 });
          break;
      }
    } else {
      tooltipOpacity.value = withTiming(0, { duration: 200 });
      tooltipScale.value = withTiming(0.9, { duration: 200 }, () => {
        setIsVisible(false);
      });
    }
  }, [visible, position, tooltipX, tooltipY, tooltipOpacity, tooltipScale, arrowRotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
    transform: [
      { translateX: tooltipX.value },
      { translateY: tooltipY.value },
      { scale: tooltipScale.value },
    ],
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));

  if (!isVisible || !position) return null;

  const isLastStep = stepNumber === totalSteps - 1;

  return (
    <Modal visible={visible} transparent={true} animationType="none">
      <Animated.View
        style={[
          styles.tooltip,
          {
            backgroundColor: theme.tooltip.backgroundColor,
            borderRadius: theme.tooltip.borderRadius,
            padding: theme.tooltip.padding,
            shadowColor: theme.tooltip.shadowColor,
            shadowOpacity: theme.tooltip.shadowOpacity,
            shadowRadius: theme.tooltip.shadowRadius,
            shadowOffset: theme.tooltip.shadowOffset,
            elevation: 5,
          },
          animatedStyle,
        ]}
        pointerEvents="auto"
      >
        <View style={styles.arrowContainer} pointerEvents="none">
          <Animated.View
            style={[
              styles.arrow,
              {
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderBottomWidth: 12,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: theme.tooltip.backgroundColor,
              },
              arrowStyle,
            ]}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.tooltip.titleColor }]} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.progressContainer}>
              {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    {
                      width: theme.progress.dotSize,
                      height: theme.progress.dotSize,
                      borderRadius: theme.progress.dotSize / 2,
                      marginRight: index < totalSteps - 1 ? theme.progress.dotSpacing : 0,
                      backgroundColor:
                        index === stepNumber
                          ? theme.progress.activeColor
                          : theme.progress.inactiveColor,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          <Text style={[styles.description, { color: theme.tooltip.descriptionColor }]} numberOfLines={4}>
            {description}
          </Text>

          <View style={styles.actions}>
            {showSkip && onSkip && (
              <Pressable
                onPress={onSkip}
                style={[
                  styles.skipButton,
                  {
                    backgroundColor: theme.actions.secondaryColor,
                    borderRadius: theme.actions.borderRadius,
                    paddingVertical: theme.actions.paddingVertical,
                    paddingHorizontal: theme.actions.paddingHorizontal,
                  },
                ]}
              >
                <Text style={[styles.skipText, { color: theme.actions.secondaryTextColor }]}>
                  {labels.skip}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={onAction}
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.actions.primaryColor,
                  borderRadius: theme.actions.borderRadius,
                  paddingVertical: theme.actions.paddingVertical,
                  paddingHorizontal: theme.actions.paddingHorizontal,
                },
              ]}
            >
              <Text style={[styles.actionText, { color: theme.actions.primaryTextColor }]}>
                {isLastStep ? labels.finish : actionText || labels.next}
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    width: 280,
    maxWidth: 300 - 32,
    marginHorizontal: 16,
  },
  arrowContainer: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -8,
  },
  arrow: {
    width: 0,
    height: 0,
  },
  content: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    opacity: 0.8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {},
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    minWidth: 80,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
