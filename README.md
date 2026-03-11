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
    showSkip: true,
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
      <OnboardingWrapper stepId="title" onSkip={() => console.log('Skipped on title')}>
        <Text>My App</Text>
      </OnboardingWrapper>

      <OnboardingWrapper 
        stepId="button" 
        onComplete={() => console.log('Done!')}
      >
        <Button title="Start" onPress={() => {}} />
      </OnboardingWrapper>
    </View>
  );
}

export default function App() {
  return (
    <OnboardingProvider>
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
  config?: OnboardingConfig;
}
```

### `OnboardingWrapper`

Wraps target elements that will be highlighted.

```tsx
interface OnboardingWrapperProps {
  stepId: string;                          // Unique identifier for this target
  children: React.ReactNode;
  onSkip?: () => void | Promise<void>;     // Called when user skips on this step
  onComplete?: () => void | Promise<void>; // Called when onboarding completes on this step (last step)
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
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';  // Tooltip position (default: 'auto')
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

const steps = [
  { id: 'welcome', targetId: 'title', title: 'Welcome!', description: '...' },
  { id: 'finish', targetId: 'button', title: 'Get Started', description: '...' },
];

async function onCompleteOnboarding() {
  await AsyncStorage.setItem('onboarding_completed', 'true');
}

function App() {
  return (
    <OnboardingProvider>
      <View>
        <OnboardingWrapper
          stepId="button"
          onComplete={onCompleteOnboarding}
        >
          <Button title="Start" onPress={() => {}} />
        </OnboardingWrapper>
      </View>
    </OnboardingProvider>
  );
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Releasing

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions and releases automatically.

When making changes:

```bash
# Add a changeset describing your changes
npm run changeset

# Commit your changes and the changeset
git add .
git commit -m "feat: add new feature"
git push
```

The GitHub Actions will automatically:
1. Create a release PR when changesets are detected
2. Publish to npm when the PR is merged
3. Create a GitHub Release with the changelog

## License

MIT
