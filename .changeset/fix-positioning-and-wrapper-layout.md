---
"react-native-onboarding-highlight": minor
---

## Fix spotlight positioning with `position: absolute/relative` containers

Replaces `measure()` with `measureInWindow()` across `OnboardingProvider` and the `useMeasure` hook.

`measure()` returns coordinates relative to ancestor layout contexts, which produces wrong `x`/`y` values on Android when the target component lives inside a container with `position: absolute` or `position: relative` (e.g. a button fixed at the bottom of the screen). `measureInWindow()` always returns coordinates relative to the device window, regardless of the component hierarchy.

Affected files:
- `src/types/index.ts` — added `measureInWindow` to the `Measurable` interface
- `src/components/onboarding-provider.tsx` — `measureTarget` now calls `measureInWindow`
- `src/hooks/use-measure.ts` — `measure` promise now resolves with `measureInWindow` values

## Fix `OnboardingWrapper` causing children to lose their width

Adds `alignSelf: 'stretch'` as a default style on the inner `View` of `OnboardingWrapper`.

Previously the wrapper rendered a bare `View` with no layout defaults. When a child component relied on `width: '100%'` or `flex: 1` to fill its parent, wrapping it with `OnboardingWrapper` would break that expectation because the wrapper itself had no defined width, collapsing to content size.

With `alignSelf: 'stretch'`, the wrapper expands to fill the parent's cross-axis automatically (width in a column layout), making it invisible to the layout system. The default can be overridden via the `style` prop.

**Before:**
```tsx
// Had to manually set width
<OnboardingWrapper stepId="add-button" style={{ width: '100%' }}>
  <Button title="Cadastrar cliente" onPress={handleAdd} />
</OnboardingWrapper>
```

**After:**
```tsx
// Works out of the box
<OnboardingWrapper stepId="add-button">
  <Button title="Cadastrar cliente" onPress={handleAdd} />
</OnboardingWrapper>
```
