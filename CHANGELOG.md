# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-03-18

### Fixed

- **Android spotlight positioning with `statusBarTranslucent` Modal** — Changed measurement method from `measureInWindow()` back to `measure()` using `pageX/pageY` coordinates. When a Modal has `statusBarTranslucent={true}`, `measureInWindow()` returns Y coordinates that don't account for the status bar offset, causing the spotlight to appear misaligned. The `measure()` callback with `pageX/pageY` provides correct absolute coordinates in all scenarios.

- **Invalid layout measurements** — Added retry logic (up to 3 attempts with 100ms delay) when target measurements return invalid values (width/height ≤ 0 or pageY = 0). This handles race conditions where components haven't fully rendered yet.

- **Measurement timing issues** — Integrated `InteractionManager.runAfterInteractions()` to ensure measurements occur only after animations and transitions complete, preventing incorrect readings during screen transitions.

### Added

- **`onLayout` prop for `OnboardingWrapper`** — The wrapper now accepts an optional `onLayout` callback, enabling consumers to respond to layout changes (e.g., re-measure after orientation change).

### Changed

- **Tooltip layout improvements** — Progress dots are now centered above the title for a cleaner appearance. Description `numberOfLines` increased from 4 to 5 in `OnboardingOverlay`.

- **Semantic constants for tooltip sizing** — Replaced magic numbers in `estimateTooltipSize()` with named constants (`TOOLTIP_HEADER_HEIGHT`, `TOOLTIP_ACTIONS_HEIGHT`, `TOOLTIP_MAX_HEIGHT`, etc.) for better maintainability.

- **Configurable measurement timing** — Extracted delays into constants: `MEASURE_INITIAL_DELAY_MS` (300ms) and `MEASURE_TRANSITION_DELAY_MS` (150ms).

### Install

```bash
npm install react-native-onboarding-highlight@1.3.0
# or
yarn add react-native-onboarding-highlight@1.3.0
```

## [1.2.0] - 2026-03-17

### Fixed

- **`OnboardingWrapper` now uses `measureInWindow()` instead of `measure()`** — resolves incorrect spotlight positioning when target components are inside containers with `position: absolute` or `position: relative`. The previous approach returned coordinates relative to an ancestor layout context on Android; `measureInWindow()` always returns coordinates relative to the device window.

- **`OnboardingWrapper` is now layout-transparent by default** — a `View` wrapper without explicit sizing was causing children to lose their width when wrapped. The wrapper now applies `alignSelf: 'stretch'` as a default style, making it expand to fill the parent's cross-axis (width in a column layout) without requiring manual `style={{ width: '100%' }}` or `style={{ flex: 1 }}`. This default can still be overridden via the `style` prop.

### Migration from 1.1.2 to 1.2.0

No breaking changes. The fixes are fully backward-compatible.

#### Before (workaround required)

```tsx
// Previously you had to manually set width to avoid layout issues
<OnboardingWrapper stepId="add-button" style={{ width: '100%' }}>
  <Button title="Cadastrar cliente" onPress={handleAdd} />
</OnboardingWrapper>
```

#### After (no workaround needed)

```tsx
// Now the wrapper stretches to fill the parent automatically
<OnboardingWrapper stepId="add-button">
  <Button title="Cadastrar cliente" onPress={handleAdd} />
</OnboardingWrapper>

// You can still override the default if needed
<OnboardingWrapper stepId="inline-badge" style={{ alignSelf: 'center' }}>
  <Badge count={3} />
</OnboardingWrapper>
```

#### Positioning fix

Components wrapped inside absolutely-positioned containers (e.g. a button fixed at the bottom of the screen) now render the spotlight highlight in the correct position:

```tsx
// Bottom-fixed container — spotlight now highlights correctly
<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
  <OnboardingWrapper stepId="add-button">
    <Pressable onPress={handleAdd}>
      <Text>Cadastrar cliente</Text>
    </Pressable>
  </OnboardingWrapper>
</View>
```

### Install

```bash
npm install react-native-onboarding-highlight@1.2.0
# or
yarn add react-native-onboarding-highlight@1.2.0
```

## [1.1.2] - 2025-03-15

### Added

- Make all config properties optional with DeepPartial
  - Add DeepPartial utility type to support partial nested configuration
  - Update OnboardingConfig to use DeepPartial for theme, labels and safeAreaInsets
  - Create mergeTheme utility function to merge user config with defaults
  - Update OnboardingProvider to automatically merge partial configs
  - Export mergeTheme function for public use

## [1.1.1] - 2025-03-09

### Fixed

- Fix onboarding provider step callback lookup to use targetId instead of id

## [1.1.0] - 2025-03-09

### Added

- Initial stable release with spotlight highlighting and animated tooltips
- OnboardingProvider for managing onboarding state
- OnboardingWrapper for wrapping target components
- Customizable themes and labels
- Support for safe area insets

[Unreleased]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/eugustavo/react-native-onboarding-highlight/releases/tag/v1.1.0
