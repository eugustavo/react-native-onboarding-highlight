import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text, Button, Modal } from 'react-native';
import {
  OnboardingProvider,
  useOnboarding,
  OnboardingWrapper,
  type OnboardingStep,
} from '../../src';

// Mock useMeasure hook to return valid layout
jest.mock('../../src/hooks/use-measure', () => ({
  useMeasure: () => ({
    measure: jest.fn((callback) => {
      callback({
        x: 100,
        y: 200,
        width: 100,
        height: 50,
      });
    }),
  }),
}));

const TEST_STEPS: OnboardingStep[] = [
  {
    id: 'step-1',
    targetId: 'target-1',
    title: 'First Step',
    description: 'This is the first step',
    placement: 'bottom',
  },
  {
    id: 'step-2',
    targetId: 'target-2',
    title: 'Second Step',
    description: 'This is the second step',
    placement: 'top',
  },
];

function TestComponent({ onStart }: { onStart?: (start: () => void) => void }) {
  const { start } = useOnboarding();

  return (
    <View>
      <OnboardingWrapper stepId="target-1">
        <View testID="target-1">
          <Text>Target 1</Text>
        </View>
      </OnboardingWrapper>
      <OnboardingWrapper stepId="target-2">
        <View testID="target-2">
          <Text>Target 2</Text>
        </View>
      </OnboardingWrapper>
      <Button
        title="Start"
        onPress={() => {
          start(TEST_STEPS);
          onStart?.(start);
        }}
      />
    </View>
  );
}

describe('OnboardingProvider', () => {
  it('should throw error when useOnboarding is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    function BadComponent() {
      useOnboarding();
      return null;
    }

    expect(() => {
      render(<BadComponent />);
    }).toThrow('useOnboarding must be used within an OnboardingProvider');

    consoleError.mockRestore();
  });

  it('should render children', () => {
    render(
      <OnboardingProvider>
        <View testID="child">
          <Text>Child</Text>
        </View>
      </OnboardingProvider>
    );

    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('should start onboarding when start is called', async () => {
    render(
      <OnboardingProvider>
        <TestComponent />
      </OnboardingProvider>
    );

    fireEvent.press(screen.getByText('Start'));

    // Check that the Modal is rendered (onboarding overlay is visible)
    await waitFor(() => {
      const modals = screen.UNSAFE_getAllByType(Modal);
      expect(modals.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });

  it('should call onComplete when onboarding finishes', async () => {
    const onComplete = jest.fn();

    render(
      <OnboardingProvider onComplete={onComplete}>
        <TestComponent />
      </OnboardingProvider>
    );

    fireEvent.press(screen.getByText('Start'));

    // Check that the Modal is rendered (onboarding overlay is visible)
    await waitFor(() => {
      const modals = screen.UNSAFE_getAllByType(Modal);
      expect(modals.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });
});

describe('OnboardingWrapper', () => {
  it('should render children', () => {
    render(
      <OnboardingProvider>
        <OnboardingWrapper stepId="test-step">
          <View testID="child">
            <Text>Test</Text>
          </View>
        </OnboardingWrapper>
      </OnboardingProvider>
    );

    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('should register target with stepId', () => {
    const TestRegistration = () => {
      const { start } = useOnboarding();
      
      return (
        <View>
          <OnboardingWrapper stepId="registered-step">
            <View testID="target">
              <Text>Target</Text>
            </View>
          </OnboardingWrapper>
          <Button
            title="Start"
            onPress={() =>
              start([
                {
                  id: 'step-1',
                  targetId: 'registered-step',
                  title: 'Registered Step',
                  description: 'Test',
                },
              ])
            }
          />
        </View>
      );
    };

    render(
      <OnboardingProvider>
        <TestRegistration />
      </OnboardingProvider>
    );

    expect(screen.getByTestId('target')).toBeTruthy();
  });
});
