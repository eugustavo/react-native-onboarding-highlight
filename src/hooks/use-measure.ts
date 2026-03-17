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

      ref.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          resolve({ x, y, width, height });
        }
      );
    });
  }, []);

  return { ref, measure };
}
