import type { LayoutRectangle } from 'react-native';
import {
  calculateAutoPlacement,
  calculatePosition,
  estimateTooltipSize,
  getValidPlacement,
} from '../../src/utils/positioning';
import type { SafeAreaInsets } from '../../src/types';

const SCREEN_WIDTH = 375;
const SCREEN_HEIGHT = 812;

const DEFAULT_SAFE_AREA: SafeAreaInsets = {
  top: 44,
  right: 0,
  bottom: 34,
  left: 0,
};

describe('positioning utils', () => {
  const mockTargetLayout: LayoutRectangle = {
    x: 100,
    y: 200,
    width: 100,
    height: 50,
  };

  describe('estimateTooltipSize', () => {
    it('should return minimum dimensions for short text', () => {
      const result = estimateTooltipSize('Short', 'Description');
      expect(result.width).toBe(280);
      expect(result.height).toBeGreaterThan(0);
      expect(result.height).toBeLessThanOrEqual(300);
    });

    it('should calculate height based on text length', () => {
      const shortResult = estimateTooltipSize('Title', 'Short');
      const longResult = estimateTooltipSize(
        'This is a very long title that should take up more space',
        'This is a very long description that should also take up more space and increase the height calculation significantly'
      );

      expect(longResult.height).toBeGreaterThan(shortResult.height);
    });

    it('should cap height at 300px', () => {
      const result = estimateTooltipSize(
        'A'.repeat(1000),
        'B'.repeat(1000)
      );
      expect(result.height).toBe(300);
    });
  });

  describe('calculateAutoPlacement', () => {
    it('should prefer bottom when there is enough space', () => {
      const result = calculateAutoPlacement({
        targetLayout: { x: 100, y: 100, width: 100, height: 50 },
        tooltipWidth: 200,
        tooltipHeight: 150,
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(result).toBe('bottom');
    });

    it('should prefer top when bottom has no space', () => {
      const result = calculateAutoPlacement({
        targetLayout: { x: 100, y: 700, width: 100, height: 50 },
        tooltipWidth: 200,
        tooltipHeight: 150,
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(result).toBe('top');
    });

    it('should select placement with most available space when none fit', () => {
      const result = calculateAutoPlacement({
        targetLayout: { x: 150, y: 350, width: 75, height: 50 },
        tooltipWidth: 300,
        tooltipHeight: 400,
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(['top', 'bottom', 'left', 'right']).toContain(result);
    });
  });

  describe('calculatePosition', () => {
    it('should calculate position for bottom placement', () => {
      const result = calculatePosition({
        targetLayout: mockTargetLayout,
        tooltipWidth: 200,
        tooltipHeight: 100,
        placement: 'bottom',
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(result.placement).toBe('bottom');
      expect(result.x).toBeGreaterThanOrEqual(16);
      expect(result.y).toBe(mockTargetLayout.y + mockTargetLayout.height + 12 + 12);
      expect(result.arrowX).toBeGreaterThan(0);
      expect(result.arrowY).toBe(-12);
    });

    it('should calculate position for top placement', () => {
      const result = calculatePosition({
        targetLayout: mockTargetLayout,
        tooltipWidth: 200,
        tooltipHeight: 100,
        placement: 'top',
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(result.placement).toBe('top');
      expect(result.y).toBe(mockTargetLayout.y - 100 - 12 - 12);
      expect(result.arrowY).toBe(100);
    });

    it('should calculate position for left placement', () => {
      const result = calculatePosition({
        targetLayout: mockTargetLayout,
        tooltipWidth: 200,
        tooltipHeight: 100,
        placement: 'left',
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(result.placement).toBe('left');
      expect(result.x).toBe(mockTargetLayout.x - 200 - 12 - 12);
      expect(result.arrowX).toBe(200);
    });

    it('should calculate position for right placement', () => {
      const result = calculatePosition({
        targetLayout: mockTargetLayout,
        tooltipWidth: 200,
        tooltipHeight: 100,
        placement: 'right',
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(result.placement).toBe('right');
      expect(result.x).toBe(mockTargetLayout.x + mockTargetLayout.width + 12 + 12);
      expect(result.arrowX).toBe(-12);
    });

    it('should auto-select placement when placement is auto', () => {
      const result = calculatePosition({
        targetLayout: mockTargetLayout,
        tooltipWidth: 200,
        tooltipHeight: 100,
        placement: 'auto',
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(['top', 'bottom', 'left', 'right']).toContain(result.placement);
    });

    it('should clamp position to safe area bounds', () => {
      const edgeTargetLayout: LayoutRectangle = {
        x: 10,
        y: 60,
        width: 50,
        height: 50,
      };

      const result = calculatePosition({
        targetLayout: edgeTargetLayout,
        tooltipWidth: 300,
        tooltipHeight: 100,
        placement: 'bottom',
        offset: 12,
        safeAreaInsets: DEFAULT_SAFE_AREA,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
      });

      expect(result.x).toBeGreaterThanOrEqual(DEFAULT_SAFE_AREA.left + 16);
      expect(result.y).toBeGreaterThanOrEqual(DEFAULT_SAFE_AREA.top + 16);
    });
  });

  describe('getValidPlacement', () => {
    it('should return provided placement when not auto', () => {
      const result = getValidPlacement(
        'left',
        mockTargetLayout,
        DEFAULT_SAFE_AREA,
        SCREEN_WIDTH,
        SCREEN_HEIGHT
      );

      expect(result).toBe('left');
    });

    it('should auto-select placement when placement is auto', () => {
      const result = getValidPlacement(
        'auto',
        mockTargetLayout,
        DEFAULT_SAFE_AREA,
        SCREEN_WIDTH,
        SCREEN_HEIGHT
      );

      expect(['top', 'bottom', 'left', 'right']).toContain(result);
    });
  });
});
