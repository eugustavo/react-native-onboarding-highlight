import {
  DEFAULT_ANIMATION_CONFIG,
  FADE_ANIMATION_CONFIG,
  SPRING_ANIMATION_CONFIG,
  TOOLTIP_ANIMATION_CONFIG,
} from '../../src/utils/animations';

describe('animation configs', () => {
  describe('DEFAULT_ANIMATION_CONFIG', () => {
    it('should have default duration of 300ms', () => {
      expect(DEFAULT_ANIMATION_CONFIG.duration).toBe(300);
    });

    it('should have spring config with damping and stiffness', () => {
      expect(DEFAULT_ANIMATION_CONFIG.springConfig).toBeDefined();
      expect(DEFAULT_ANIMATION_CONFIG.springConfig?.damping).toBe(15);
      expect(DEFAULT_ANIMATION_CONFIG.springConfig?.stiffness).toBe(300);
      expect(DEFAULT_ANIMATION_CONFIG.springConfig?.mass).toBe(1);
    });
  });

  describe('FADE_ANIMATION_CONFIG', () => {
    it('should have fade duration of 200ms', () => {
      expect(FADE_ANIMATION_CONFIG.duration).toBe(200);
    });

    it('should not have spring config', () => {
      expect(FADE_ANIMATION_CONFIG.springConfig).toBeUndefined();
    });
  });

  describe('SPRING_ANIMATION_CONFIG', () => {
    it('should have spring config', () => {
      expect(SPRING_ANIMATION_CONFIG.springConfig).toBeDefined();
      expect(SPRING_ANIMATION_CONFIG.springConfig?.damping).toBe(15);
      expect(SPRING_ANIMATION_CONFIG.springConfig?.stiffness).toBe(300);
    });
  });

  describe('TOOLTIP_ANIMATION_CONFIG', () => {
    it('should have tooltip duration of 250ms', () => {
      expect(TOOLTIP_ANIMATION_CONFIG.duration).toBe(250);
    });

    it('should have custom spring config', () => {
      expect(TOOLTIP_ANIMATION_CONFIG.springConfig).toBeDefined();
      expect(TOOLTIP_ANIMATION_CONFIG.springConfig?.damping).toBe(20);
      expect(TOOLTIP_ANIMATION_CONFIG.springConfig?.stiffness).toBe(400);
      expect(TOOLTIP_ANIMATION_CONFIG.springConfig?.mass).toBe(0.8);
    });
  });
});
