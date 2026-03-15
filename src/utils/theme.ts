import type { OnboardingTheme } from '../types';

export function mergeTheme(
  defaultTheme: OnboardingTheme,
  userTheme: unknown
): OnboardingTheme {
  if (!userTheme || typeof userTheme !== 'object') {
    return defaultTheme;
  }

  const userThemeObj = userTheme as Partial<OnboardingTheme>;

  return {
    overlay: {
      ...defaultTheme.overlay,
      ...userThemeObj.overlay,
    },
    highlight: {
      ...defaultTheme.highlight,
      ...userThemeObj.highlight,
    },
    tooltip: {
      ...defaultTheme.tooltip,
      ...userThemeObj.tooltip,
    },
    actions: {
      ...defaultTheme.actions,
      ...userThemeObj.actions,
    },
    progress: {
      ...defaultTheme.progress,
      ...userThemeObj.progress,
    },
  };
}
