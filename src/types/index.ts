import type React from 'react';
import type { LayoutRectangle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type HighlightShape = 'rectangle';

export interface OnboardingLabels {
  next?: string;
  back?: string;
  skip?: string;
  finish?: string;
}

export interface OnboardingStep {
  id: string;
  targetId: string;
  title: string;
  description: string;
  placement?: Placement;
  offset?: number;
  showSkip?: boolean;
  showBack?: boolean;
  actionText?: string;
  onNext?: () => void | Promise<void>;
  onShow?: () => void | Promise<void>;
}

export interface Measurable {
  measure: (
    callback: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void
  ) => void;
}

export interface TargetInfo {
  ref: Measurable;
  layout: LayoutRectangle | null;
}

export interface OnboardingContextValue {
  isVisible: boolean;
  isClosing: boolean;
  currentStepIndex: number;
  currentStep: OnboardingStep | null;
  totalSteps: number;
  targetLayout: LayoutRectangle | null;
  isTransitioning: boolean;

  start: (steps: OnboardingStep[]) => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
  complete: () => void;
  goToStep: (index: number) => void;
  registerTarget: (id: string, ref: Measurable) => void;
  unregisterTarget: (id: string) => void;
  onCloseComplete: () => void;
}

export interface OnboardingTheme {
  overlay: {
    color: string;
    opacity: number;
  };
  highlight: {
    borderColor: string;
    borderWidth: number;
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    padding: number;
  };
  tooltip: {
    backgroundColor: string;
    titleColor: string;
    descriptionColor: string;
    borderRadius: number;
    padding: number;
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
  };
  actions: {
    primaryColor: string;
    primaryTextColor: string;
    secondaryColor: string;
    secondaryTextColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
  };
  progress: {
    activeColor: string;
    inactiveColor: string;
    dotSize: number;
    dotSpacing: number;
  };
}

export interface SpotlightOverlayProps {
  targetLayout: LayoutRectangle | null;
  visible: boolean;
  shape?: HighlightShape;
  highlightPadding?: number;
  overlayOpacity?: number;
  overlayColor?: string;
  borderColor?: string;
  borderWidth?: number;
  shadowColor?: string;
  animationDuration?: number;
  onPressOverlay?: () => void;
}

export interface TooltipProps {
  targetLayout: LayoutRectangle | null;
  placement: Placement;
  visible: boolean;
  title: string;
  description: string;
  actionText?: string;
  onAction: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  stepNumber: number;
  totalSteps: number;
  offset?: number;
  safeAreaInsets?: SafeAreaInsets;
  theme?: Partial<OnboardingTheme>;
  labels?: OnboardingLabels;
}

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface OnboardingConfig {
  highlightShape?: HighlightShape;
  highlightPadding?: number;
  overlayOpacity?: number;
  overlayColor?: string;
  borderColor?: string;
  borderWidth?: number;
  shadowColor?: string;
  animationDuration?: number;
  closeOnOverlayPress?: boolean;
  labels?: OnboardingLabels;
  theme?: Partial<OnboardingTheme>;
  safeAreaInsets?: SafeAreaInsets;
}

export interface OnboardingProviderProps {
  children: React.ReactNode;
  onComplete?: () => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
  config?: OnboardingConfig;
}

export interface OnboardingOverlayProps {
  visible: boolean;
  isClosing?: boolean;
  targetLayout: LayoutRectangle | null;
  tooltipProps: {
    title: string;
    description: string;
    actionText?: string;
    onAction: () => void;
    onSkip?: () => void;
    onPrev?: () => void;
    showSkip?: boolean;
    showBack?: boolean;
    stepNumber: number;
    totalSteps: number;
    placement: Placement;
    offset?: number;
  };
  shape?: HighlightShape;
  highlightPadding?: number;
  overlayOpacity?: number;
  overlayColor?: string;
  borderColor?: string;
  borderWidth?: number;
  animationDuration?: number;
  onPressOverlay?: (() => void) | undefined;
  onCloseComplete?: () => void;
  theme?: Partial<OnboardingTheme>;
  labels?: OnboardingLabels;
  safeAreaInsets?: SafeAreaInsets;
}

export interface PositionResult {
  placement: Exclude<Placement, 'auto'>;
  x: number;
  y: number;
  arrowX: number;
  arrowY: number;
}

export interface AnimationConfig {
  duration: number;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    overshootClamping?: boolean;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
  };
}

export interface SpotlightAnimationState {
  x: SharedValue<number>;
  y: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
}
