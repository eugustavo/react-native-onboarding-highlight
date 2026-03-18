import React, { useRef, useEffect, useCallback } from 'react';
import { View, type ViewProps, type LayoutChangeEvent } from 'react-native';
import { useOnboarding } from './onboarding-provider';

export interface OnboardingWrapperProps extends ViewProps {
  stepId: string;
  children: React.ReactNode;
  onSkip?: () => void | Promise<void>;
  onComplete?: () => void | Promise<void>;
}

export function OnboardingWrapper({ stepId, children, onSkip, onComplete, style, onLayout, ...viewProps }: OnboardingWrapperProps) {
  const { registerTarget, unregisterTarget, registerStepCallbacks, unregisterStepCallbacks } = useOnboarding();
  const viewRef = useRef<View>(null);

  useEffect(() => {
    if (viewRef.current) {
      registerTarget(stepId, viewRef.current);
    }

    registerStepCallbacks(stepId, { onSkip, onComplete });

    return () => {
      unregisterTarget(stepId);
      unregisterStepCallbacks(stepId);
    };
  }, [stepId, registerTarget, unregisterTarget, registerStepCallbacks, unregisterStepCallbacks, onSkip, onComplete]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    if (viewRef.current) {
      registerTarget(stepId, viewRef.current);
    }
    onLayout?.(event);
  }, [stepId, registerTarget, onLayout]);

  return (
    <View
      ref={viewRef}
      {...viewProps}
      style={[{ alignSelf: 'stretch' }, style]}
      collapsable={false}
      onLayout={handleLayout}
    >
      {children}
    </View>
  );
}
