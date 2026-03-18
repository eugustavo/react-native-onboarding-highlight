import type { LayoutRectangle } from 'react-native';
import type {
  Placement,
  PositionResult,
  SafeAreaInsets,
} from '../types';

const ARROW_SIZE = 12;
const TOOLTIP_MIN_WIDTH = 280;
const TOOLTIP_HEIGHT_ESTIMATE = 180;

const TOOLTIP_HEADER_HEIGHT = 50;
const TOOLTIP_ACTIONS_HEIGHT = 50;
const TOOLTIP_LINE_HEIGHT_TITLE = 24;
const TOOLTIP_LINE_HEIGHT_DESC = 20;
const TOOLTIP_CHARS_PER_LINE_TITLE = 30;
const TOOLTIP_CHARS_PER_LINE_DESC = 35;
const TOOLTIP_MAX_HEIGHT = 280;

interface CalculatePositionParams {
  targetLayout: LayoutRectangle;
  tooltipWidth: number;
  tooltipHeight: number;
  placement: Placement;
  offset: number;
  safeAreaInsets: SafeAreaInsets;
}

export function calculateAutoPlacement({
  targetLayout,
  tooltipWidth,
  tooltipHeight,
  offset,
  safeAreaInsets,
  screenWidth,
  screenHeight,
}: Omit<CalculatePositionParams, 'placement'> & { screenWidth: number; screenHeight: number }): Exclude<Placement, 'auto'> {
  const spaceTop = targetLayout.y - safeAreaInsets.top - offset;
  const spaceBottom =
    screenHeight - targetLayout.y - targetLayout.height - safeAreaInsets.bottom - offset;
  const spaceLeft = targetLayout.x - safeAreaInsets.left - offset;
  const spaceRight =
    screenWidth - targetLayout.x - targetLayout.width - safeAreaInsets.right - offset;

  const fitsTop = spaceTop >= tooltipHeight;
  const fitsBottom = spaceBottom >= tooltipHeight;
  const fitsLeft = spaceLeft >= tooltipWidth;
  const fitsRight = spaceRight >= tooltipWidth;

  const spaces = [
    { placement: 'bottom' as const, space: spaceBottom, fits: fitsBottom },
    { placement: 'top' as const, space: spaceTop, fits: fitsTop },
    { placement: 'right' as const, space: spaceRight, fits: fitsRight },
    { placement: 'left' as const, space: spaceLeft, fits: fitsLeft },
  ];

  const fittingSpaces = spaces.filter((s) => s.fits);

  if (fittingSpaces.length > 0) {
    fittingSpaces.sort((a, b) => b.space - a.space);
    return fittingSpaces[0].placement;
  }

  spaces.sort((a, b) => b.space - a.space);
  return spaces[0].placement;
}

export function calculatePosition({
  targetLayout,
  tooltipWidth,
  tooltipHeight,
  placement,
  offset,
  safeAreaInsets,
  screenWidth,
  screenHeight,
}: CalculatePositionParams & { screenWidth: number; screenHeight: number }): PositionResult {
  const actualPlacement =
    placement === 'auto'
      ? calculateAutoPlacement({
          targetLayout,
          tooltipWidth,
          tooltipHeight,
          offset,
          safeAreaInsets,
          screenWidth,
          screenHeight,
        })
      : placement;

  let x = 0;
  let y = 0;
  let arrowX = 0;
  let arrowY = 0;

  const targetCenterX = targetLayout.x + targetLayout.width / 2;
  const targetCenterY = targetLayout.y + targetLayout.height / 2;

  switch (actualPlacement) {
    case 'top':
      x = Math.max(
        safeAreaInsets.left + 16,
        Math.min(
          targetCenterX - tooltipWidth / 2,
          screenWidth - safeAreaInsets.right - tooltipWidth - 16
        )
      );
      y = targetLayout.y - tooltipHeight - offset - ARROW_SIZE;
      arrowX = targetCenterX - x;
      arrowY = tooltipHeight;
      break;

    case 'bottom':
      x = Math.max(
        safeAreaInsets.left + 16,
        Math.min(
          targetCenterX - tooltipWidth / 2,
          screenWidth - safeAreaInsets.right - tooltipWidth - 16
        )
      );
      y = targetLayout.y + targetLayout.height + offset + ARROW_SIZE;
      arrowX = targetCenterX - x;
      arrowY = -ARROW_SIZE;
      break;

    case 'left':
      x = targetLayout.x - tooltipWidth - offset - ARROW_SIZE;
      y = Math.max(
        safeAreaInsets.top + 16,
        Math.min(
          targetCenterY - tooltipHeight / 2,
          screenHeight - safeAreaInsets.bottom - tooltipHeight - 16
        )
      );
      arrowX = tooltipWidth;
      arrowY = targetCenterY - y;
      break;

    case 'right':
      x = targetLayout.x + targetLayout.width + offset + ARROW_SIZE;
      y = Math.max(
        safeAreaInsets.top + 16,
        Math.min(
          targetCenterY - tooltipHeight / 2,
          screenHeight - safeAreaInsets.bottom - tooltipHeight - 16
        )
      );
      arrowX = -ARROW_SIZE;
      arrowY = targetCenterY - y;
      break;
  }

  x = Math.max(safeAreaInsets.left + 16, Math.min(x, screenWidth - tooltipWidth - safeAreaInsets.right - 16));
  y = Math.max(safeAreaInsets.top + 16, Math.min(y, screenHeight - tooltipHeight - safeAreaInsets.bottom - 16));

  return {
    placement: actualPlacement,
    x,
    y,
    arrowX,
    arrowY,
  };
}

export function estimateTooltipSize(title: string, description: string): {
  width: number;
  height: number;
} {
  const estimatedHeight =
    TOOLTIP_HEADER_HEIGHT +
    Math.ceil(title.length / TOOLTIP_CHARS_PER_LINE_TITLE) * TOOLTIP_LINE_HEIGHT_TITLE +
    Math.ceil(description.length / TOOLTIP_CHARS_PER_LINE_DESC) * TOOLTIP_LINE_HEIGHT_DESC +
    TOOLTIP_ACTIONS_HEIGHT;

  return {
    width: TOOLTIP_MIN_WIDTH,
    height: Math.min(estimatedHeight, TOOLTIP_MAX_HEIGHT),
  };
}

export function getValidPlacement(
  placement: Placement,
  targetLayout: LayoutRectangle,
  safeAreaInsets: SafeAreaInsets,
  screenWidth: number,
  screenHeight: number
): Exclude<Placement, 'auto'> {
  if (placement !== 'auto') {
    return placement;
  }

  return calculateAutoPlacement({
    targetLayout,
    tooltipWidth: TOOLTIP_MIN_WIDTH,
    tooltipHeight: TOOLTIP_HEIGHT_ESTIMATE,
    offset: 12,
    safeAreaInsets,
    screenWidth,
    screenHeight,
  });
}
