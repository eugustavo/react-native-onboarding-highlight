---
"react-native-onboarding-highlight": minor
---

Make all config properties optional with DeepPartial

- Add DeepPartial utility type to support partial nested configuration
- Update OnboardingConfig to use DeepPartial for theme, labels and safeAreaInsets
- Create mergeTheme utility function to merge user config with defaults
- Update OnboardingProvider to automatically merge partial configs
- Export mergeTheme function for public use

Now you can configure only the properties you want to customize:
```typescript
const config: OnboardingConfig = {
  theme: {
    progress: {
      activeColor: '#007AFF',
      // dotSize and dotSpacing will use default values
    }
  }
}
```
