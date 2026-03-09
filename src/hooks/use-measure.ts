import { useRef, useCallback } from 'react';
import type { LayoutRectangle, View } from 'react-native';

export function useMeasure() {
  const ref = useRef<View>(null);

  const measure = useCallback((): Promise<LayoutRectangle | null> => {
    return new Promise((resolve) => {
      if (!ref.current) {
        resolve(null);
        return;
      }

      ref.current.measure(
        (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
          resolve({
            x: pageX,
            y: pageY,
            width,
            height,
          });
        }
      );
    });
  }, []);

  return { ref, measure };
}
