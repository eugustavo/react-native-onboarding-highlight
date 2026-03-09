import React, { useRef, useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import { useOnboarding } from './onboarding-provider';

export interface OnboardingWrapperProps extends ViewProps {
  stepId: string;
  children: React.ReactNode;
}

export function OnboardingWrapper({ stepId, children, ...viewProps }: OnboardingWrapperProps) {
  const { registerTarget, unregisterTarget } = useOnboarding();
  const viewRef = useRef<View>(null);

  useEffect(() => {
    if (viewRef.current) {
      registerTarget(stepId, viewRef.current);
    }
    return () => {
      unregisterTarget(stepId);
    };
  }, [stepId, registerTarget, unregisterTarget]);

  return (
    <View ref={viewRef} {...viewProps} collapsable={false}>
      {children}
    </View>
  );
}
