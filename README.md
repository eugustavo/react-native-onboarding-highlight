# react-native-onboarding-highlight

A lightweight React Native library for creating beautiful onboarding experiences with spotlight highlighting and animated tooltips.

## Features

✨ **Zero dependencies** - Only peer dependencies on `react-native-reanimated` and `react-native-svg`  
🎯 **Smart positioning** - Automatically finds the best placement for tooltips  
🎨 **Fully customizable** - Comprehensive theming system  
🌐 **I18n ready** - Configurable labels for any language  
📱 **Safe area aware** - Built-in safe area handling (configurable)  
🔧 **TypeScript** - Fully typed  
⚡ **Smooth animations** - Powered by Reanimated 3

## Why Choose Us?

Unlike other onboarding libraries that offer **only spotlight** OR **only tooltips**, we provide a **complete, integrated solution**:

| Feature | react-native-onboarding-highlight | Competitors |
|---------|-----------------------------------|-------------|
| Spotlight + Tooltip integrated | ✅ | Usually only one |
| Smooth animations (Reanimated 3) | ✅ | Often basic/no animation |
| Smart auto-positioning | ✅ | Manual positioning |
| Complete theming system | ✅ | Limited/basic |
| Step navigation (next/back/skip) | ✅ | Often missing |
| Progress indicators | ✅ | Usually missing |
| Zero runtime dependencies | ✅ | May bundle heavy deps |

**Size:** ~26kB gzipped - Smaller than most alternatives while offering more features!  

## Installation

```bash
npm install react-native-onboarding-highlight
# or
yarn add react-native-onboarding-highlight
# or
pnpm add react-native-onboarding-highlight
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install react-native-reanimated react-native-svg
```

## Quick Start

```tsx
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import {
  OnboardingProvider,
  useOnboarding,
  OnboardingWrapper,
} from 'react-native-onboarding-highlight';

const steps = [
  {
    id: 'welcome',
    targetId: 'title',
    title: 'Welcome!',
    description: 'This is your app title',
    placement: 'bottom',
  },
  {
    id: 'action',
    targetId: 'button',
    title: 'Get Started',
    description: 'Click here to begin',
    placement: 'top',
  },
];

function HomeScreen() {
  const { start } = useOnboarding();

  useEffect(() => {
    // Start onboarding after a delay
    const timer = setTimeout(() => start(steps), 1000);
    return () => clearTimeout(timer);
  }, [start]);

  return (
    <View>
      <OnboardingWrapper stepId="title">
        <Text>My App</Text>
      </OnboardingWrapper>

      <OnboardingWrapper stepId="button">
        <Button title="Start" onPress={() => {}} />
      </OnboardingWrapper>
    </View>
  );
}

export default function App() {
  return (
    <OnboardingProvider
      onComplete={() => console.log('Done!')}
      onSkip={() => console.log('Skipped')}
    >
      <HomeScreen />
    </OnboardingProvider>
  );
}
```

## API Reference

### `OnboardingProvider`

The context provider that wraps your app.

```tsx
interface OnboardingProviderProps {
  children: React.ReactNode;
  onComplete?: () => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
  config?: OnboardingConfig;
}
```

### `OnboardingWrapper`

Wraps target elements that will be highlighted.

```tsx
interface OnboardingWrapperProps {
  stepId: string;  // Unique identifier for this target
  children: React.ReactNode;
}
```

### `useOnboarding`

Hook to control the onboarding flow.

```tsx
const {
  start,        // (steps: OnboardingStep[]) => void
  next,         // () => void
  prev,         // () => void
  skip,         // () => void
  complete,     // () => void
  goToStep,     // (index: number) => void
  isVisible,
  currentStepIndex,
  currentStep,
  totalSteps,
} = useOnboarding();
```

### `OnboardingStep`

```tsx
interface OnboardingStep {
  id: string;
  targetId: string;           // Must match OnboardingWrapper's stepId
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: number;            // Distance from target (default: 12)
  showSkip?: boolean;         // Show skip button (default: true)
  showBack?: boolean;         // Show back button (default: true)
  actionText?: string;        // Custom text for primary button
  onNext?: () => void | Promise<void>;
  onShow?: () => void | Promise<void>;
}
```

### `OnboardingConfig`

```tsx
interface OnboardingConfig {
  highlightPadding?: number;
  overlayOpacity?: number;
  overlayColor?: string;
  borderColor?: string;
  borderWidth?: number;
  animationDuration?: number;
  closeOnOverlayPress?: boolean;
  labels?: {
    next?: string;      // Default: 'Next'
    back?: string;      // Default: 'Back'
    skip?: string;      // Default: 'Skip'
    finish?: string;    // Default: 'Done'
  };
  theme?: Partial<OnboardingTheme>;
  safeAreaInsets?: {
    top: number;        // Default: 44 (iOS notch area)
    right: number;      // Default: 0
    bottom: number;     // Default: 34 (iOS home indicator)
    left: number;       // Default: 0
  };
}
```

### Theming

Full control over colors and styling:

```tsx
<OnboardingProvider
  config={{
    theme: {
      overlay: {
        color: 'rgba(0, 0, 0, 0.85)',
        opacity: 0.85,
      },
      highlight: {
        borderColor: '#6366f1',
        borderWidth: 3,
        shadowColor: '#6366f1',
        shadowOpacity: 0.5,
        shadowRadius: 15,
        padding: 10,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        descriptionColor: '#9ca3af',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      },
      actions: {
        primaryColor: '#6366f1',
        primaryTextColor: '#ffffff',
        secondaryColor: 'transparent',
        secondaryTextColor: '#9ca3af',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
      },
      progress: {
        activeColor: '#6366f1',
        inactiveColor: '#4b5563',
        dotSize: 8,
        dotSpacing: 8,
      },
    },
  }}
>
  {> children <}
</OnboardingProvider>
```

## Standalone Components

Use `SpotlightOverlay` or `Tooltip` independently for custom implementations.

```tsx
import { SpotlightOverlay, Tooltip } from 'react-native-onboarding-highlight';

// Spotlight only
<SpotlightOverlay
  targetLayout={{ x: 100, y: 200, width: 150, height: 50 }}
  visible={showSpotlight}
  onPressOverlay={() => setShowSpotlight(false)}
/>

// Tooltip only
<Tooltip
  targetLayout={{ x: 100, y: 200, width: 150, height: 50 }}
  placement="bottom"
  visible={showTooltip}
  title="Tooltip Title"
  description="Tooltip description text"
  stepNumber={0}
  totalSteps={3}
  onAction={() => setShowTooltip(false)}
/>
```

## Customization Examples

### Custom Labels (i18n)

```tsx
<OnboardingProvider
  config={{
    labels: {
      next: 'Próximo',
      back: 'Voltar',
      skip: 'Pular',
      finish: 'Concluir',
    },
  }}
>
```

### Persistence

Store progress using AsyncStorage or similar:

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_completed').then((value) => {
      setHasCompletedOnboarding(value === 'true');
    });
  }, []);

  return (
    <OnboardingProvider
      onComplete={async () => {
        await AsyncStorage.setItem('onboarding_completed', 'true');
      }}
    >
      {> children <}
    </OnboardingProvider>
  );
}
```

## License

MIT
