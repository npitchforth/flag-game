# Orientation-Responsive Layout Implementation

## Overview

This implementation adds orientation-responsive layouts for the native flag game app (iOS/Android) while keeping the web version unchanged. The game stats in `GameHeader` and `GameOverScreen` components now adapt to device orientation.

## Features

- **Portrait Mode**: Maintains the existing grid layout (2x2 grid for GameHeader, 2x2 grid for GameOverScreen)
- **Landscape Mode**: Displays all 4 stats in one horizontal row, similar to the web desktop layout
- **Web Version**: Unchanged - maintains existing behavior
- **Native Apps Only**: Only affects iOS/Android apps, web version remains unchanged

## Implementation Details

### 1. Custom Hook: `useOrientation`

**File**: `src/hooks/useOrientation.js`

- Detects if the app is running on a native platform (iOS/Android)
- Monitors device orientation changes using browser APIs
- Provides `isLandscape` and `isNativeApp` boolean values
- Uses `window.screen.orientation` API for native apps when available
- Falls back to window dimensions for web and older devices

### 2. Updated Components

#### GameHeader Component
- **File**: `src/components/GameHeader.jsx`
- Uses the `useOrientation` hook
- Applies different CSS classes based on orientation:
  - Portrait: `mobile-layout` (existing grid layout)
  - Landscape: `native-landscape-layout` (horizontal row)

#### GameOverScreen Component
- **File**: `src/components/GameOverScreen.jsx`
- Uses the `useOrientation` hook
- Applies the same responsive layout logic as GameHeader

### 3. CSS Styles

**File**: `src/styles/capacitor.css`

Added new styles for landscape layout:
```css
.native-app .game-stats.native-landscape-layout {
  display: flex !important;
  flex-direction: row !important;
  gap: 1rem !important;
  justify-content: center !important;
  align-items: center !important;
  /* ... */
}
```

## Layout Behavior

### Portrait Mode (Native Apps)
- **GameHeader**: Timer on top row, Score and Streak on bottom row (2x2 grid)
- **GameOverScreen**: Correct, Wrong, Accuracy, Streak in 2x2 grid

### Landscape Mode (Native Apps)
- **GameHeader**: Timer, Score, Streak in one horizontal row
- **GameOverScreen**: Correct, Wrong, Accuracy, Streak in one horizontal row

### Web Version
- **Unchanged**: Maintains existing desktop/mobile layouts

## Technical Notes

- Uses browser's built-in orientation detection APIs
- No additional Capacitor plugins required
- Responsive to both orientation changes and window resizing
- Includes debug logging for development/testing
- Graceful fallback for devices without orientation API support

## Testing

To test the implementation:

1. Build the project: `npm run build`
2. Sync to native: `npx cap sync`
3. Open in Android Studio: `npx cap open android`
4. Run on device/emulator and rotate between portrait/landscape
5. Verify that the layout changes appropriately in each orientation

 