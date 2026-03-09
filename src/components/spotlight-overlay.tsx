import React, { useEffect, useMemo } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import type { SpotlightOverlayProps } from '../types';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function SpotlightOverlay({
  targetLayout,
  visible,
  shape = 'rectangle',
  highlightPadding = 8,
  overlayOpacity = 0.75,
  overlayColor = 'rgba(0, 0, 0, 0.75)',
  borderColor = '#FFFFFF',
  borderWidth = 2,
  animationDuration = 300,
  onPressOverlay,
}: SpotlightOverlayProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, { duration: animationDuration });
    } else {
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [visible, animationDuration, progress]);

  const pathData = useMemo(() => {
    if (!targetLayout) return '';

    const padding = highlightPadding;
    const x = targetLayout.x - padding;
    const y = targetLayout.y - padding;
    const w = targetLayout.width + padding * 2;
    const h = targetLayout.height + padding * 2;

    // @ts-expect-error - Circle shape temporarily disabled (will be re-enabled after bug fix)
    if (shape === 'circle') {
      const radius = Math.max(w, h) / 2;
      const centerX = x + w / 2;
      const centerY = y + h / 2;

      return `
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
    }

    const radius = 8;
    return `
      M 0 0
      H ${screenWidth}
      V ${screenHeight}
      H 0
      Z
      M ${x + radius} ${y}
      H ${x + w - radius}
      Q ${x + w} ${y} ${x + w} ${y + radius}
      V ${y + h - radius}
      Q ${x + w} ${y + h} ${x + w - radius} ${y + h}
      H ${x + radius}
      Q ${x} ${y + h} ${x} ${y + h - radius}
      V ${y + radius}
      Q ${x} ${y} ${x + radius} ${y}
      Z
    `;
  }, [targetLayout, highlightPadding, shape, screenWidth, screenHeight]);

  const rectProps = useMemo(() => {
    if (!targetLayout) return { x: 0, y: 0, width: 0, height: 0, rx: 0 };

    const padding = highlightPadding;
    const w = targetLayout.width + padding * 2;
    const h = targetLayout.height + padding * 2;

    return {
      x: targetLayout.x - padding,
      y: targetLayout.y - padding,
      width: w,
      height: h,
      // @ts-expect-error - Circle shape temporarily disabled (will be re-enabled after bug fix)
      rx: shape === 'circle' ? Math.max(w, h) / 2 : 8,
    };
  }, [targetLayout, highlightPadding, shape]);

  const animatedPathProps = useAnimatedProps(() => ({
    d: pathData,
  }));

  const animatedRectProps = useAnimatedProps(() => ({
    x: rectProps.x,
    y: rectProps.y,
    width: rectProps.width,
    height: rectProps.height,
    rx: rectProps.rx,
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value * overlayOpacity,
  }));

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
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
    </Modal>
  );
}
