import '@testing-library/react-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const createSvgMock = (name) => {
    return React.forwardRef((props, ref) => {
      return React.createElement(View, { ref, ...props, testID: name });
    });
  };
  
  return {
    __esModule: true,
    default: createSvgMock('Svg'),
    Svg: createSvgMock('Svg'),
    Rect: createSvgMock('Rect'),
    Defs: createSvgMock('Defs'),
    Mask: createSvgMock('Mask'),
    LinearGradient: createSvgMock('LinearGradient'),
    Stop: createSvgMock('Stop'),
    Path: createSvgMock('Path'),
    Circle: createSvgMock('Circle'),
  };
});
