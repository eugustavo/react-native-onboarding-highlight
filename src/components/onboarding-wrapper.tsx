import React, { useRef, useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import { useOnboarding } from './onboarding-provider';

export interface OnboardingWrapperProps extends ViewProps {
  stepId: string;
  children: React.ReactNode;
  onSkip?: () => void | Promise<void>;
  onComplete?: () => void | Promise<void>;
}

export function OnboardingWrapper({ stepId, children, onSkip, onComplete, style, ...viewProps }: OnboardingWrapperProps) {
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

  return (
    <View ref={viewRef} {...viewProps} style={[{ alignSelf: 'stretch' }, style]} collapsable={false}>
      {children}
    </View>
  );
}
