# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/eugustavo/react-native-onboarding-highlight/releases/tag/v1.1.0
