import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import type { OnboardingOverlayProps } from '../types';
import { calculatePosition, estimateTooltipSize } from '../utils/positioning';
import { DEFAULT_THEME, DEFAULT_LABELS } from '../constants/theme';

const HIGHLIGHT_PADDING = 8;
const DEFAULT_ANIMATION_DURATION = 400;
const TOOLTIP_WIDTH = 300;
const TRANSITION_DURATION = 350;

const DEFAULT_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.75)';
const DEFAULT_BORDER_COLOR = '#FFFFFF';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function OnboardingOverlay({
  visible,
  isClosing = false,
  targetLayout,
  tooltipProps,
  shape = 'rectangle',
  highlightPadding = HIGHLIGHT_PADDING,
  overlayColor = DEFAULT_OVERLAY_COLOR,
  borderColor = DEFAULT_BORDER_COLOR,
  borderWidth = 2,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  onPressOverlay,
  onCloseComplete,
  theme: customTheme,
  labels: customLabels,
  safeAreaInsets,
}: OnboardingOverlayProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const prevLayoutRef = useRef(targetLayout);

  const spotlightX = useSharedValue(0);
  const spotlightY = useSharedValue(0);
  const spotlightWidth = useSharedValue(0);
  const spotlightHeight = useSharedValue(0);
  const spotlightOpacity = useSharedValue(0);

  const tooltipOpacity = useSharedValue(0);
  const tooltipTranslateY = useSharedValue(0);

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

    const estimatedSize = estimateTooltipSize(tooltipProps.title, tooltipProps.description);

    return calculatePosition({
      targetLayout,
      tooltipWidth: Math.min(estimatedSize.width, TOOLTIP_WIDTH),
      tooltipHeight: estimatedSize.height,
      placement: tooltipProps.placement,
      offset: tooltipProps.offset || 12,
      safeAreaInsets,
      screenWidth,
      screenHeight,
    });
  }, [targetLayout, tooltipProps, safeAreaInsets, screenWidth, screenHeight]);

  useEffect(() => {
    if (!visible) {
      spotlightOpacity.value = withTiming(0, { duration: 250 });
      tooltipOpacity.value = withTiming(0, { duration: 250 });
      return;
    }

    if (targetLayout) {
      const padding = highlightPadding;
      const newX = targetLayout.x - padding;
      const newY = targetLayout.y - padding;
      const newW = targetLayout.width + padding * 2;
      const newH = targetLayout.height + padding * 2;

      if (!prevLayoutRef.current) {
        spotlightX.value = newX;
        spotlightY.value = newY;
        spotlightWidth.value = newW;
        spotlightHeight.value = newH;
        spotlightOpacity.value = withTiming(1, { duration: animationDuration });
      } else {
        spotlightX.value = withTiming(newX, { duration: TRANSITION_DURATION });
        spotlightY.value = withTiming(newY, { duration: TRANSITION_DURATION });
        spotlightWidth.value = withTiming(newW, { duration: TRANSITION_DURATION });
        spotlightHeight.value = withTiming(newH, { duration: TRANSITION_DURATION });

        if (spotlightOpacity.value === 0) {
          spotlightOpacity.value = withTiming(1, { duration: animationDuration });
        }
      }

      prevLayoutRef.current = targetLayout;
    }
  }, [visible, targetLayout, highlightPadding, animationDuration, spotlightX, spotlightY, spotlightWidth, spotlightHeight, spotlightOpacity]);

  const animatedPathProps = useAnimatedProps(() => {
    const rectX = spotlightX.value;
    const rectY = spotlightY.value;
    const rectW = spotlightWidth.value;
    const rectH = spotlightHeight.value;

    if (rectW === 0 || rectH === 0) {
      return { d: '' };
    }

    let path = '';

    // @ts-ignore - Circle shape temporarily disabled (will be re-enabled after bug fix)
    if (shape === 'circle') {
      const radius = Math.max(rectW, rectH) / 2;
      const centerX = rectX + rectW / 2;
      const centerY = rectY + rectH / 2;

      path = `
        M 0 0
        H ${screenWidth}
        V ${screenHeight}
        H 0
        Z
        M ${centerX} ${centerY - radius}
        A ${radius} ${radius} 0 1 0 ${centerX} ${centerY + radius}
        A ${radius} ${radius} 0 1 0 ${centerX} ${centerY - radius}
        Z
      `;
    } else {
      const radius = 8;
      path = `
        M 0 0
        H ${screenWidth}
        V ${screenHeight}
        H 0
        Z
        M ${rectX + radius} ${rectY}
        H ${rectX + rectW - radius}
        Q ${rectX + rectW} ${rectY} ${rectX + rectW} ${rectY + radius}
        V ${rectY + rectH - radius}
        Q ${rectX + rectW} ${rectY + rectH} ${rectX + rectW - radius} ${rectY + rectH}
        H ${rectX + radius}
        Q ${rectX} ${rectY + rectH} ${rectX} ${rectY + rectH - radius}
        V ${rectY + radius}
        Q ${rectX} ${rectY} ${rectX + radius} ${rectY}
        Z
      `;
    }

    return { d: path };
  });

  const animatedRectProps = useAnimatedProps(() => {
    const rectX = spotlightX.value;
    const rectY = spotlightY.value;
    const rectW = spotlightWidth.value;
    const rectH = spotlightHeight.value;

    if (rectW === 0 || rectH === 0) {
      return { x: 0, y: 0, width: 0, height: 0, rx: 0 };
    }

    return {
      x: rectX,
      y: rectY,
      width: rectW,
      height: rectH,
      // @ts-expect-error - Circle shape temporarily disabled (will be re-enabled after bug fix)
      rx: shape === 'circle' ? Math.max(rectW, rectH) / 2 : 8,
    };
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipTransitioning, setIsTooltipTransitioning] = useState(false);

  const [tooltipContent, setTooltipContent] = useState({
    title: tooltipProps.title,
    description: tooltipProps.description,
    actionText: tooltipProps.actionText,
    stepNumber: tooltipProps.stepNumber,
  });

  const nextPositionRef = useRef<{ x: number; y: number } | null>(null);

  const handleUpdateTooltip = () => {
    if (!position) return;

    setTooltipPosition({ x: position.x, y: position.y });
    setTooltipContent({
      title: tooltipProps.title,
      description: tooltipProps.description,
      actionText: tooltipProps.actionText,
      stepNumber: tooltipProps.stepNumber,
    });

    setTimeout(() => {
      const newStartOffset = position.placement === 'top' ? -20 : 20;
      tooltipTranslateY.value = newStartOffset;
      tooltipOpacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 400 })
      );
      tooltipTranslateY.value = withSequence(
        withTiming(newStartOffset, { duration: 0 }),
        withTiming(0, { duration: 400 })
      );

      setTimeout(() => {
        setIsTooltipTransitioning(false);
        if (nextPositionRef.current) {
          const pendingPosition = nextPositionRef.current;
          nextPositionRef.current = null;
          setTooltipPosition(pendingPosition);
        }
      }, 400);
    }, 150);
  };

  useEffect(() => {
    if (!visible) {
      setShowTooltip(false);
      setIsTooltipTransitioning(false);
      nextPositionRef.current = null;
      return;
    }

    if (!position) {
      setShowTooltip(false);
      return;
    }

    if (isTooltipTransitioning) {
      nextPositionRef.current = { x: position.x, y: position.y };
      return;
    }

    if (!showTooltip || (tooltipPosition.x === 0 && tooltipPosition.y === 0)) {
      setTooltipContent({
        title: tooltipProps.title,
        description: tooltipProps.description,
        actionText: tooltipProps.actionText,
        stepNumber: tooltipProps.stepNumber,
      });
      setTooltipPosition({ x: position.x, y: position.y });
      setShowTooltip(true);

      const startOffset = position.placement === 'top' ? -20 : 20;
      tooltipTranslateY.value = startOffset;
      tooltipOpacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 400 })
      );
      tooltipTranslateY.value = withSequence(
        withTiming(startOffset, { duration: 0 }),
        withTiming(0, { duration: 400 })
      );
      return;
    }

    setIsTooltipTransitioning(true);
    tooltipOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(handleUpdateTooltip)();
      }
    });
  }, [position, visible, tooltipProps]);

  const spotlightAnimatedStyle = useAnimatedStyle(() => ({
    opacity: spotlightOpacity.value,
  }));

  const tooltipAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: tooltipOpacity.value,
      transform: [{ translateY: tooltipTranslateY.value }],
    };
  });

  useEffect(() => {
    if (isClosing && visible) {
      tooltipOpacity.value = withTiming(0, { duration: 250 });
      tooltipTranslateY.value = withTiming(30, { duration: 250 });
      spotlightOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished && onCloseComplete) {
          runOnJS(onCloseComplete)();
        }
      });
    }
  }, [isClosing, visible, onCloseComplete, tooltipOpacity, tooltipTranslateY, spotlightOpacity]);

  if (!visible) return null;

  const isLastStep = tooltipContent.stepNumber === tooltipProps.totalSteps - 1;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View style={[StyleSheet.absoluteFill, spotlightAnimatedStyle]} pointerEvents="box-none">
          <Pressable style={StyleSheet.absoluteFill} onPress={onPressOverlay}>
            <Svg width={screenWidth} height={screenHeight} style={StyleSheet.absoluteFill}>
              <AnimatedPath
                animatedProps={animatedPathProps}
                fill={overlayColor}
                fillRule="evenodd"
              />
              <AnimatedRect
                animatedProps={animatedRectProps}
                fill="transparent"
                stroke={borderColor}
                strokeWidth={borderWidth}
              />
            </Svg>
          </Pressable>
        </Animated.View>

        {showTooltip && (
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
                left: tooltipPosition.x,
                top: tooltipPosition.y,
              },
              tooltipAnimatedStyle,
            ]}
            pointerEvents="auto"
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.tooltip.titleColor }]} numberOfLines={2}>
                  {tooltipContent.title}
                </Text>
                <View style={styles.progressContainer}>
                  {Array.from({ length: tooltipProps.totalSteps }).map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.progressDot,
                        {
                          width: theme.progress.dotSize,
                          height: theme.progress.dotSize,
                          borderRadius: theme.progress.dotSize / 2,
                          marginRight: index < tooltipProps.totalSteps - 1 ? theme.progress.dotSpacing : 0,
                          backgroundColor:
                            index === tooltipContent.stepNumber
                              ? theme.progress.activeColor
                              : theme.progress.inactiveColor,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>

              <Text
                style={[styles.description, { color: theme.tooltip.descriptionColor }]}
                numberOfLines={4}
              >
                {tooltipContent.description}
              </Text>

              <View style={styles.actions}>
                {tooltipProps.showBack && tooltipContent.stepNumber > 0 && tooltipProps.onPrev ? (
                  <Pressable
                    onPress={tooltipProps.onPrev}
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
                      {labels.back}
                    </Text>
                  </Pressable>
                ) : tooltipProps.showSkip && tooltipProps.onSkip ? (
                  <Pressable
                    onPress={tooltipProps.onSkip}
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
                ) : null}

                <Pressable
                  onPress={tooltipProps.onAction}
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
                    {isLastStep ? labels.finish : tooltipContent.actionText || labels.next}
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tooltip: {
    position: 'absolute',
    width: TOOLTIP_WIDTH,
    maxWidth: 300 - 32,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  skipButton: {
    marginRight: 'auto',
  },
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
