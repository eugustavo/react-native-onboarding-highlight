# react-native-onboarding-highlight 1.3.0

## What's Changed

This release brings significant improvements to measurement reliability, Android compatibility, and UI polish. All changes are backward compatible.

### 🔧 Major Improvements

- **Fixed Android Status Bar Issue**: Changed measurement method from `measureInWindow()` to `measure()` with `pageX/pageY` coordinates to correctly handle Android's `statusBarTranslucent` Modal property
- **Added Measurement Retry Logic**: Implemented automatic retry mechanism (up to 3 attempts) when target measurements are invalid
- **Interaction Manager Integration**: Added `InteractionManager.runAfterInteractions()` to ensure measurements occur after animations and transitions complete
- **onLayout Support**: `OnboardingWrapper` now accepts `onLayout` prop for better responsiveness to layout changes

### 🎨 UI Enhancements

- **Improved Tooltip Layout**: Progress dots are now centered above the title for a cleaner, more modern appearance
- **Better Text Handling**: Increased description `numberOfLines` from 4 to 5 in `OnboardingOverlay`
- **Consistent Styling**: Tooltip component now shares the same layout structure as OnboardingOverlay

### 🛠️ Code Quality

- **Semantic Constants**: Replaced magic numbers in `estimateTooltipSize()` with well-named constants (`TOOLTIP_HEADER_HEIGHT`, `TOOLTIP_ACTIONS_HEIGHT`, etc.)
- **Configurable Timing**: Extracted measurement delays into constants for easier tuning (`MEASURE_INITIAL_DELAY_MS`, `MEASURE_TRANSITION_DELAY_MS`)

## New Utilities

### Enhanced `OnboardingWrapper`

```tsx
<OnboardingWrapper
  stepId="my-step"
  onLayout={(event) => {
    // Handle layout changes
    console.log('Layout changed:', event.nativeEvent.layout);
  }}
>
  <MyComponent />
</OnboardingWrapper>
```

### Improved Measurement Reliability

The onboarding system now handles edge cases better:

- Retries measurements up to 3 times if layout is invalid
- Waits for interactions to complete before measuring
- Uses absolute coordinates (`pageX/pageY`) for accurate positioning

## Usage Example

```tsx
import { 
  OnboardingProvider, 
  OnboardingWrapper, 
  useOnboarding 
} from 'react-native-onboarding-highlight';

function App() {
  return (
    <OnboardingProvider
      config={{
        highlightPadding: 8,
        overlayOpacity: 0.75,
        animationDuration: 300,
        closeOnOverlayPress: true,
      }}
    >
      <HomeScreen />
    </OnboardingProvider>
  );
}

function HomeScreen() {
  const { start } = useOnboarding();

  const startOnboarding = () => {
    start([
      {
        id: 'step-1',
        targetId: 'welcome-button',
        title: 'Welcome!',
        description: 'This is the first step of your onboarding journey.',
        placement: 'bottom',
      },
      {
        id: 'step-2',
        targetId: 'profile-section',
        title: 'Your Profile',
        description: 'Access your profile settings here.',
        placement: 'auto', // Automatically chooses best position
      },
    ]);
  };

  return (
    <View>
      <OnboardingWrapper stepId="welcome-button">
        <Button title="Get Started" onPress={startOnboarding} />
      </OnboardingWrapper>

      <OnboardingWrapper stepId="profile-section">
        <ProfileCard />
      </OnboardingWrapper>
    </View>
  );
}
```

## Installation

```bash
npm install react-native-onboarding-highlight@1.3.0
```

Or with yarn:

```bash
yarn add react-native-onboarding-highlight@1.3.0
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install react-native-reanimated react-native-svg
```

## Full Changelog

### Features
- ✨ Added `onLayout` prop support to `OnboardingWrapper`
- ✨ Added measurement retry logic with configurable max retries
- ✨ Added `InteractionManager` integration for better timing

### Bug Fixes
- 🐛 Fixed Android spotlight positioning issue with `statusBarTranslucent` Modal
- 🐛 Fixed invalid layout measurements by validating `pageY > 0`

### Improvements
- 💄 Centered progress dots above title in tooltip
- 💄 Increased description lines from 4 to 5
- ♻️ Refactored `estimateTooltipSize()` with semantic constants
- ⚡ Improved measurement timing constants (300ms initial, 150ms transition)

### Code Quality
- 📚 Added inline comments explaining measurement method choice
- 🏷️ Better TypeScript support with explicit callback types

---

**Contributors**: @eugustavo

**Compare**: [v1.2.0...v1.3.0](https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.2.0...v1.3.0)
