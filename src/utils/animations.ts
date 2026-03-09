import type { AnimationConfig } from '../types';

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 300,
  springConfig: {
    damping: 15,
    stiffness: 300,
    mass: 1,
  },
};

export const FADE_ANIMATION_CONFIG: AnimationConfig = {
  duration: 200,
};

export const SPRING_ANIMATION_CONFIG: Omit<AnimationConfig, 'duration'> = {
  springConfig: {
    damping: 15,
    stiffness: 300,
    mass: 1,
  },
};

export const TOOLTIP_ANIMATION_CONFIG: AnimationConfig = {
  duration: 250,
  springConfig: {
    damping: 20,
    stiffness: 400,
    mass: 0.8,
  },
};
