import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { LayoutRectangle } from 'react-native';
import type {
  OnboardingContextValue,
  OnboardingProviderProps,
  OnboardingStep,
  OnboardingLabels,
  SafeAreaInsets,
  TargetInfo,
} from '../types';
import { OnboardingOverlay } from './onboarding-overlay';

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const DEFAULT_LABELS: OnboardingLabels = {
  next: 'Next',
  back: 'Back',
  skip: 'Skip',
  finish: 'Done',
};

const DEFAULT_SAFE_AREA_INSETS: SafeAreaInsets = {
  top: 44,
  right: 0,
  bottom: 34,
  left: 0,
};

export function OnboardingProvider({
  children,
  onComplete,
  onSkip,
  config,
}: OnboardingProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [targetLayout, setTargetLayout] = useState<LayoutRectangle | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const targetsRef = useRef<Map<string, TargetInfo>>(new Map());
  const measureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeAreaInsets = useMemo((): SafeAreaInsets => {
    if (config?.safeAreaInsets) {
      return config.safeAreaInsets;
    }
    return DEFAULT_SAFE_AREA_INSETS;
  }, [config?.safeAreaInsets]);

  const currentStep = steps[currentStepIndex] || null;
  const totalSteps = steps.length;

  const measureTarget = useCallback((targetId: string) => {
    const target = targetsRef.current.get(targetId);
    if (!target?.ref) {
      setTargetLayout(null);
      return;
    }

    target.ref.measure(
      (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
        setTargetLayout({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      }
    );
  }, []);

  const start = useCallback((newSteps: OnboardingStep[]) => {
    if (newSteps.length === 0) return;

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsVisible(true);
    setIsTransitioning(true);

    const firstStep = newSteps[0];
    if (firstStep) {
      measureTimeoutRef.current = setTimeout(() => {
        measureTarget(firstStep.targetId);
        setIsTransitioning(false);
        firstStep.onShow?.();
      }, 100);
    }
  }, [measureTarget]);

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return;

      setIsTransitioning(true);
      setTargetLayout(null);
      setCurrentStepIndex(index);

      const step = steps[index];
      if (step) {
        measureTimeoutRef.current = setTimeout(() => {
          measureTarget(step.targetId);
          setIsTransitioning(false);
          step.onShow?.();
        }, 150);
      }
    },
    [steps, measureTarget]
  );

  const next = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const currentStepData = steps[currentStepIndex];
      currentStepData?.onNext?.();
      goToStep(currentStepIndex + 1);
    } else {
      complete();
    }
  }, [currentStepIndex, steps, goToStep]);

  const prev = useCallback(() => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, goToStep]);

  const skip = useCallback(() => {
    setIsClosing(true);
  }, []);

  const complete = useCallback(() => {
    setIsClosing(true);
  }, []);

  const onCloseComplete = useCallback(async () => {
    setIsVisible(false);
    setIsClosing(false);
    setTargetLayout(null);

    if (currentStepIndex >= steps.length - 1) {
      await onComplete?.();
    } else {
      await onSkip?.();
    }
  }, [currentStepIndex, steps.length, onComplete, onSkip]);

  const registerTarget = useCallback((id: string, ref: { measure: TargetInfo['ref']['measure'] }) => {
    targetsRef.current.set(id, { ref, layout: null });
  }, []);

  const unregisterTarget = useCallback((id: string) => {
    targetsRef.current.delete(id);
  }, []);

  const value: OnboardingContextValue = {
    isVisible,
    isClosing,
    currentStepIndex,
    currentStep,
    totalSteps,
    targetLayout,
    isTransitioning,
    start,
    next,
    prev,
    skip,
    complete,
    goToStep,
    registerTarget,
    unregisterTarget,
    onCloseComplete,
  };

  const labels = useMemo(() => {
    return { ...DEFAULT_LABELS, ...config?.labels };
  }, [config?.labels]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      {isVisible && currentStep && (
        <OnboardingOverlay
          visible={isVisible}
          isClosing={isClosing}
          targetLayout={targetLayout}
          tooltipProps={{
            title: currentStep.title,
            description: currentStep.description,
            actionText: currentStep.actionText,
            onAction: next,
            onSkip: skip,
            onPrev: prev,
            showSkip: currentStep.showSkip !== false,
            showBack: currentStep.showBack !== false,
            stepNumber: currentStepIndex,
            totalSteps: totalSteps,
            placement: currentStep.placement || 'auto',
            offset: currentStep.offset || 12,
          }}
          shape={config?.highlightShape ?? 'rectangle'}
          highlightPadding={config?.highlightPadding ?? 8}
          overlayOpacity={config?.overlayOpacity ?? 0.75}
          overlayColor={config?.overlayColor ?? 'rgba(0, 0, 0, 0.75)'}
          borderColor={config?.borderColor ?? '#FFFFFF'}
          borderWidth={config?.borderWidth ?? 2}
          animationDuration={config?.animationDuration ?? 300}
          onPressOverlay={config?.closeOnOverlayPress ? skip : undefined}
          onCloseComplete={onCloseComplete}
          theme={config?.theme}
          labels={labels}
          safeAreaInsets={safeAreaInsets}
        />
      )}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
