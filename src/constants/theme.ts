import type { OnboardingTheme, OnboardingLabels } from '../types';

export const DEFAULT_THEME: OnboardingTheme = {
  overlay: {
    color: 'rgba(0, 0, 0, 0.75)',
    opacity: 0.75,
  },
  highlight: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    padding: 8,
  },
  tooltip: {
    backgroundColor: '#FFFFFF',
    titleColor: '#000000',
    descriptionColor: '#666666',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  actions: {
    primaryColor: '#007AFF',
    primaryTextColor: '#FFFFFF',
    secondaryColor: 'transparent',
    secondaryTextColor: '#8E8E93',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  progress: {
    activeColor: '#007AFF',
    inactiveColor: '#E5E5EA',
    dotSize: 6,
    dotSpacing: 6,
  },
};

export const DEFAULT_LABELS: OnboardingLabels = {
  next: 'Next',
  back: 'Back',
  skip: 'Skip',
  finish: 'Done',
};
