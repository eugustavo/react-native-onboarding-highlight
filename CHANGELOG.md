# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2024-03-09

### Improved
- **Bundle size reduced by 50%** - Removed source maps from npm package
  - Package size: 50.1 kB → 25.6 kB (48% reduction)
  - Unpacked size: 297.7 kB → 162.6 kB (45% reduction)
  - Total files: 79 → 46 (41% reduction)

### Changed
- **Removed optional dependency** `react-native-safe-area-context`
  - Safe area handling continues to work with built-in defaults (top: 44, bottom: 34)
  - Users can still customize via `config.safeAreaInsets` when needed
  - No breaking changes - functionality preserved

### Documentation
- Added "Why Choose Us" section to README highlighting key differentiators
- Updated comparison table with competitors
- Improved feature descriptions

### Bug Fixes
- **Temporarily disabled Circle Shape** from public API
  - Shape was causing rendering issues and will be re-enabled after fix
  - Rectangle shape continues to work perfectly (default and only option)
  - All Circle Shape code preserved internally for future re-enablement

## [0.1.1] - 2024-03-09

### Added
- Add repository, homepage and bugs fields to package.json
- Link package to GitHub repository

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

