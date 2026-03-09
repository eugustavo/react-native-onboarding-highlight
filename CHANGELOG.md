# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-03-09

### Added
- Initial release
- `OnboardingProvider` - Context provider for managing onboarding state
- `OnboardingWrapper` - Component to wrap target elements
- `OnboardingOverlay` - Main overlay component with spotlight and tooltip
- `SpotlightOverlay` - Standalone spotlight component
- `Tooltip` - Standalone tooltip component
- `useOnboarding` - Hook for controlling the onboarding flow
- `useMeasure` - Utility hook for measuring elements
- Smart positioning algorithm that finds best tooltip placement
- Support for custom labels (i18n)
- Comprehensive theming system
- Optional `react-native-safe-area-context` support
- Full TypeScript support
- Unit tests for positioning and animation utilities

### Features
- Rectangle and circle highlight shapes
- Auto-placement or fixed tooltip positions
- Smooth Reanimated animations
- Back/Next navigation with step indicators
- Skip and Complete callbacks
- Configurable safe area insets
- Per-step custom actions (onNext, onShow)

