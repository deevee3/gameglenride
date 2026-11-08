# Neon Spades: Cyber-Bet - Design Document

## 1. Game Overview
**Title:** Neon Spades: Cyber-Bet
**Genre:** Multiplayer Trick-Taking Card Game
**Platform:** Mobile (iOS/Android) & Web
**Theme:** Cyberpunk / Fantasy Casino (High-stakes underground card game)
**Visual Style:** Dark purple/indigo backgrounds, neon cyan/magenta accents, holographic card effects. Inspired by "Holdem Hub" aesthetic.

## 2. Game Mechanics & Rules

### Core Spades Rules
- **Players:** 4 (Solo or 2v2 Teams).
- **Deck:** Standard 52-card deck. Spades are always trump.
- **Objective:** Win the number of tricks bid.
- **Bidding:** Blind nil, Nil, and standard number bids.
- **Scoring:** 10 points per trick bid + 1 point per overtrick. 10 bags = -100 points.

### The Unique Twist: "Cyber-Overdrive"
To fit the "Power cards" and "Fantasy" theme, we introduce a **Class-Based Ability System**.

#### Setup
At the start of the match, each player selects a **Cyber-Rig** (Avatar):
1.  **The Hacker (Green):** *Passive:* Can see how many Spades opponents have (but not ranks) once per game. *Active:* **"Glitch"** - Swap one card from hand with the top card of the deck (Cost: 3 Charge).
2.  **The Enforcer (Red):** *Passive:* Winning a trick with a Spade gives +1 extra score point. *Active:* **"Lockdown"** - The winner of this trick takes no "Bags" (sandbags) even if it's an overtrick (Cost: 2 Charge).
3.  **The Hustler (Purple):** *Passive:* Nil bids are worth +10 bonus points. *Active:* **"Sleight"** - Pass a card to the left opponent and receive one from the right (Cost: 4 Charge).
4.  **The Oracle (Blue):** *Passive:* Can see the card played by the person to their right *before* playing their own (always acts last logic, simulated). *Active:* **"Forecast"** - Reveal the top 3 cards of the deck (Cost: 2 Charge).

#### Charge System
- Players start with 1 Charge.
- Win a trick with a Face Card (J, Q, K, A) = +1 Charge.
- Win a trick with a "Neon 10" (Special glowing 10s) = +2 Charge.
- Max Charge = 5.

## 3. UI / UX Design (Based on Screenshot)

### Main Game Screen Layout
The screen mimics the "Holdem Hub" screenshot but adapted for Spades.

#### Visual Hierarchy
- **Background:** Deep violet temple/casino interior, blurred depth of field.
- **The Table:** A glowing, floating oval table (Purple neon rim).
- **Center:** "The Dealer" (AI Avatar) presides over the table.
- **Trick Area:** The center of the table where played cards appear.

#### Player Positions
- **Bottom Center (You):**
    - **Hand:** Fanned out cards. Selected card pops up.
    - **Avatar:** Circular portrait with "Charge Meter" ring (Green/Yellow glow).
    - **Action Bar:** Floating pill-shaped buttons above the hand: `[BID]`, `[PLAY]`, `[ACTIVATE ABILITY]`.
- **Left / Top / Right (Opponents):**
    - **Avatar:** Circular portraits.
    - **Info:** Name, Current Bid (e.g., "3/5"), Score.
    - **Hand:** Small card backs indicating hand size.

#### Top Bar
- **Left:** Hamburger Menu (Settings).
- **Center:** Game Logo "Neon Spades".
- **Right:** Total Score / Currency ($54,500 style points).

#### Animations
- **Deal:** Cards fly from the Center Dealer to players.
- **Play:** Cards glide to the center table.
- **Win:** The trick "stacks" and flies to the winner's avatar.
- **Ability:** Screen shake + Neon overlay when a Cyber-Ability is used.

### Color Palette
- **Primary:** `Deep Violet (#2D0A31)`
- **Secondary:** `Neon Cyan (#00F0FF)` (Highlights, Trumps)
- **Accent:** `Hot Pink (#FF0099)` (Buttons, Alerts)
- **Surface:** `Dark Indigo (#150520)` (Table felt)
- **Text:** `White (#FFFFFF)` with outer glow.

## 4. Technical Outline (React + Expo)

### Project Structure
```
/app                  # Expo Router pages
  index.tsx           # Landing
  lobby.tsx           # Room selection
  game/[id].tsx       # Main game screen
/components
  /game
    Card.tsx          # Reanimated card component
    Hand.tsx          # ScrollView/FlatList for player hand
    Table.tsx         # SVG/Canvas game table
    Avatar.tsx        # Player status and charge ring
    TrickPile.tsx     # Center area
  /ui
    NeonButton.tsx    # Styled button
    GlassPanel.tsx    # BlurView containers
/game-logic
  engine.ts           # Core Spades rules (valid moves, winner)
  state.ts            # Zustand store
  types.ts            # TS Interfaces
/assets               # Images, Fonts
```

### Core Components & State

#### State Management (Zustand)
```typescript
// game-logic/state.ts
import { create } from 'zustand';

interface Card { suit: 'S'|'H'|'D'|'C'; rank: number; id: string; }
interface Player { id: string; name: string; avatar: string; hand: Card[]; bid: number; tricks: number; charge: number; role: 'Hacker'|'Enforcer'|... }

interface GameState {
  phase: 'BIDDING' | 'PLAYING' | 'SCORING';
  players: Player[];
  currentTurn: number; // Player index
  trick: { card: Card; playerId: string }[];
  trump: 'S';
  playCard: (playerId: string, cardId: string) => void;
  activateAbility: (playerId: string, abilityId: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // ... initial state and actions
}));
```

#### Card Component (Reanimated)
```typescript
// components/game/Card.tsx
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

export const Card = ({ card, onPlay, isPlayable }) => {
  const offset = useSharedValue({ x: 0, y: 0 });
  
  const drag = Gesture.Pan()
    .onChange((e) => {
      offset.value = { x: e.translationX, y: e.translationY };
    })
    .onEnd(() => {
      if (offset.value.y < -100 && isPlayable) {
        runOnJS(onPlay)(card.id);
      } else {
        offset.value = withSpring({ x: 0, y: 0 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }]
  }));

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Card Image/SVG */}
      </Animated.View>
    </GestureDetector>
  );
};
```

### Platform Considerations
- **Responsive Layout:**
  - Use `react-native-safe-area-context` for notches.
  - **Mobile:** Portrait mode. Hand is stacked at bottom.
  - **Web/Tablet:** Landscape mode. Table is wider, hand is spread out.
  - Use `Dimensions.get('window')` or NativeWind responsive classes (`md:flex-row`) to switch layouts.
- **Performance:**
  - Use `FlashList` for hands if many cards (though 13 is small enough for View).
  - Preload images using `expo-image`.

### Future Multiplayer
- **Backend:** Node.js + Socket.io (or Supabase Realtime).
- **Sync:** Server is authority. Client sends `ACTION_BID` or `ACTION_PLAY`. Server validates and broadcasts `GAME_UPDATE`.
