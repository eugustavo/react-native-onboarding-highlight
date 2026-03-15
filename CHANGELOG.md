# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.2...HEAD
[1.1.2]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/eugustavo/react-native-onboarding-highlight/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/eugustavo/react-native-onboarding-highlight/releases/tag/v1.1.0
