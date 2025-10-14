# Design Guidelines: Perfect Moods Canteen Radio Controller

## Design Approach
**Reference-Based Approach**: Match Perfect Moods website aesthetic exactly as requested - incorporating their brand identity, color scheme, and visual language into a functional radio control interface.

## Core Design Principles
1. **Brand Consistency**: Strict adherence to Perfect Moods visual identity
2. **Touch-First Design**: Optimized for iPad interaction with large, accessible controls
3. **Functional Clarity**: Clear status indicators and immediate feedback
4. **Ambient Integration**: Subtle, non-intrusive design suitable for canteen environment

## Color Palette

**Primary Colors** (Perfect Moods brand):
- Deep Purple/Violet: 270 65% 25% (primary brand)
- Bright Purple: 270 70% 50% (accents, active states)
- Dark Background: 270 40% 8% (backgrounds)

**Supporting Colors**:
- Success Green: 142 70% 45% (playing status)
- Neutral Gray: 0 0% 85% (inactive elements)
- White: 0 0% 100% (text on dark)

**Dark Mode** (default for canteen display):
- Background: 270 40% 8%
- Card surfaces: 270 30% 12%
- Borders: 270 20% 20%

## Typography

**Font Stack**:
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts)
- Fallback: -apple-system, BlinkMacSystemFont

**Type Scale**:
- Display/Time: text-6xl to text-8xl, font-bold (800-900)
- Status Text: text-2xl to text-3xl, font-semibold (600)
- Body/Labels: text-lg to text-xl, font-medium (500)
- Small Text: text-sm, font-normal (400)

## Layout System

**Spacing Primitives**: 
Consistent use of 4, 8, 12, 16, 24 units (p-4, p-8, p-12, p-16, p-24, etc.)

**Container Structure**:
- Full-height layout: min-h-screen
- Centered content: max-w-4xl mx-auto
- Card padding: p-12 to p-16
- Element gaps: gap-8 to gap-12

**Grid System**:
- Single column centered layout for primary controls
- Status indicators in flexible row layout
- Symmetrical padding and balanced composition

## Component Library

**Primary Control Button**:
- Size: Minimum 200px × 200px (touch-optimized)
- Shape: Rounded-full or rounded-3xl
- States: Clear visual distinction between play/pause
- Colors: Purple gradient when active, gray when inactive
- Icon size: Large (w-24 h-24 minimum)
- Shadow: Prominent for depth (shadow-2xl)

**Status Display**:
- Current time: Large, prominent (text-6xl+)
- Radio status: Color-coded (green playing, gray stopped)
- Schedule info: Secondary text style
- Day indicator: Subtle but clear

**Information Cards**:
- Background: Semi-transparent dark cards (bg-opacity-60)
- Border: Subtle purple borders (border-purple-500/20)
- Padding: Generous (p-8 to p-12)
- Rounded corners: rounded-2xl to rounded-3xl

**Visual Indicators**:
- Animated wave/pulse effect when playing
- Smooth transitions: transition-all duration-300
- Status badges with icons (Heroicons)
- Visual timer/schedule visualization

## Interaction Patterns

**Touch Interactions**:
- Large tap targets (minimum 44px × 44px)
- Immediate visual feedback on touch
- No hover states (iPad focused)
- Haptic-style visual responses

**Status Feedback**:
- Real-time clock display
- Clear playing/stopped indicators
- Schedule visualization (weekday awareness)
- Connection status if applicable

**Animations** (minimal, purposeful):
- Smooth scale on button press (scale-95)
- Fade transitions for status changes
- Pulse effect for active radio state
- No distracting continuous animations

## Page Structure

**Single-Page Dashboard Layout**:

1. **Header Section** (minimal):
   - Perfect Moods logo/branding
   - Current date and time (prominent)
   - Connection status indicator

2. **Main Control Area** (centered):
   - Large play/pause button (primary focus)
   - Current radio status with visual indicator
   - "Now Playing: Perfect Moods" text

3. **Schedule Information**:
   - Auto-play schedule display (8:00 - 17:30 weekdays)
   - Current day highlight
   - Visual schedule timeline

4. **Footer** (subtle):
   - Stream information
   - Last action timestamp
   - Manual override indicator if active

## Visual Enhancements

**Background Treatment**:
- Dark gradient with subtle purple tones
- Optional: Subtle animated gradient or particles (very minimal)
- Depth through layered opacity

**Glassmorphism Effects**:
- Frosted glass cards (backdrop-blur-lg)
- Semi-transparent overlays
- Layered depth with shadows

**Brand Elements**:
- Perfect Moods logo prominently placed
- Brand colors throughout interaction elements
- Music-themed iconography (Heroicons music notes, waves)

## Accessibility & Usability

- High contrast for readability in canteen lighting
- Touch targets exceed 44px minimum
- Clear disabled states for off-hours
- Immediate feedback for all interactions
- Status readable from distance (large text)

## Technical Considerations

- Icons: Heroicons (play, pause, music, clock, calendar)
- Audio visualization: CSS-only wave animation
- No external images beyond logo
- Optimized for iPad viewport (landscape and portrait)
- Persistent state across page refreshes