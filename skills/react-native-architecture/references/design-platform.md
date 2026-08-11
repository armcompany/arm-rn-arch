# Design and Platform Surface

## Design system

Separate tokens, themes, primitives, composed components, icons, and testing helpers. Centralize color, spacing, typography, radius, elevation, and motion. Support light/dark and accessibility contrast. Wrap a UI kit only where the wrapper imposes a stable product contract.

Select Paper for Material-oriented apps; Tamagui for a universal token-driven system; NativeWind for utility styling; Restyle for a lightweight typed internal system; an internal kit for distinctive product design. Verify current New Architecture and web compatibility before installation.

## Bootstrap and brand

Coordinate native splash, fonts, storage/session restoration, providers, and routes. Use local licensed OTF/TTF assets when deterministic startup matters. Generate iOS appearance variants, Android adaptive icons, notification icons, and web favicon when applicable. Test splash and icons in preview/release builds.

## Motion

Use built-in Animated for simple cases and Reanimated for gestures, layout, or UI-thread interactions. Use Lottie/Rive for designer-authored animation. Remotion generates video and is not a general RN UI animation engine. Centralize duration/easing tokens and honor Reduce Motion.

## Maps and location

Decide provider, geocoding, routing, clustering, offline maps, foreground/background location, pricing, privacy, and retention. Isolate provider APIs behind a module adapter when lock-in matters. Request permission in context, support denial, and never log precise location.

## Utilities

Prefer named pure areas such as formatting, validation, date-time, accessibility, testing, and platform. Keep a utility inside its module until two real consumers justify sharing. Never place network, storage, navigation, or business policy in a generic `utils` folder.
