import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  OnboardingProvider,
  useOnboarding,
  OnboardingWrapper,
  type OnboardingStep,
} from './index';

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'step-1',
    targetId: 'title',
    title: 'Welcome!',
    description: 'This is the main title of your app.',
    placement: 'bottom',
  },
  {
    id: 'step-2',
    targetId: 'button-1',
    title: 'Primary Action',
    description: 'Click this button to perform the main action.',
    placement: 'top',
  },
  {
    id: 'step-3',
    targetId: 'button-2',
    title: 'Secondary Action',
    description: 'This is another important feature.',
    placement: 'top',
  },
  {
    id: 'step-4',
    targetId: 'help-button',
    title: 'Need Help?',
    description: 'Click here anytime to get assistance.',
    placement: 'left',
  },
];

function HomeScreen() {
  const { start } = useOnboarding();

  useEffect(() => {
    const timer = setTimeout(() => {
      start(ONBOARDING_STEPS);
    }, 1000);

    return () => clearTimeout(timer);
  }, [start]);

  return (
    <View style={styles.container}>
      <OnboardingWrapper stepId="title" onSkip={() => console.log('Skipped on title')}>
        <View style={styles.header}>
          <Text style={styles.title}>My App</Text>
        </View>
      </OnboardingWrapper>

      <OnboardingWrapper stepId="button-1" onSkip={() => console.log('Skipped on button 1')}>
        <Button title="Primary Action" onPress={() => {}} />
      </OnboardingWrapper>

      <OnboardingWrapper stepId="button-2" onSkip={() => console.log('Skipped on button 2')}>
        <Button title="Secondary Action" onPress={() => {}} />
      </OnboardingWrapper>

      <OnboardingWrapper
        stepId="help-button"
        onComplete={() => console.log('Onboarding completed!')}
        onSkip={() => console.log('Onboarding skipped')}
      >
        <Button title="?" onPress={() => {}} />
      </OnboardingWrapper>
    </View>
  );
}

export default function App() {
  return (
    <OnboardingProvider
      config={{
        highlightShape: 'rectangle',
        highlightPadding: 8,
        overlayOpacity: 0.75,
        labels: {
          next: 'Next',
          back: 'Back',
          skip: 'Skip',
          finish: 'Done',
        },
      }}
    >
      <HomeScreen />
    </OnboardingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
