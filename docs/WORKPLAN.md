# RL Playground - Work Plan

**Last Updated**: 2025-10-30
**Current Phase**: Phase 1 (Q-Learning on FrozenLake)

---

## Current Issues (Priority: CRITICAL)

### Issue #1: Training Pipeline Broken
**Symptoms:**
- Environment frame doesn't update during training
- Stuck showing "Training - Episode 0" throughout entire training
- Reward chart shows "No reward data yet" (never updates)
- Episode counter stuck at 0
- Learning data panel shows no data
- No real-time updates happening at all

**Impact**: Application is non-functional. Must fix before implementing new features.

**Investigation needed:**
1. Check if backend is sending SSE events correctly
2. Check if frontend is receiving SSE events
3. Verify data flow: Backend → SSE → Frontend → State → UI
4. Check browser console for JavaScript errors
5. Check backend logs for Python errors
6. Verify EventSource connection is established

---

## Phase 1: Fix Broken Training Pipeline

### Tasks:
1. **Investigate SSE streaming**
   - Check backend `/api/train/stream/<session_id>` endpoint
   - Verify callback function is being called after each episode
   - Verify SSE events are being sent with correct format
   - Check for any Python exceptions in training loop

2. **Investigate frontend event handling**
   - Check EventSource connection establishment
   - Verify event listeners are attached correctly
   - Check if events are being received (browser DevTools → Network → EventStream)
   - Verify state updates in React components

3. **Fix identified issues**
   - Fix backend if SSE events aren't being sent
   - Fix frontend if events aren't being received/processed
   - Fix state management if data isn't flowing to UI

4. **Verify fixes**
   - Start training with 100 episodes
   - Confirm environment frames update in real-time
   - Confirm reward chart updates with each episode
   - Confirm episode counter increments
   - Confirm training completes successfully

**Success criteria:** Training runs from Episode 0 to N with real-time updates in all visualizations.

---

## Phase 2: Implement Q-Table Visualization (Option A - Arrows)

### Design Specification: Arrow-Based Visualization

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  Q-Table Visualization (Policy View)   │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│   │  ↑  │ │  ↑  │ │  ↑  │ │  ↑  │    │ Row 0
│   │ ← → │ │ ← → │ │ ← → │ │ ← → │    │
│   │  ↓  │ │  ↓  │ │  ↓  │ │  ↓  │    │
│   └─────┘ └─────┘ └─────┘ └─────┘    │
│                                         │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │ Row 1
│   │  ↑  │ │  ↑  │ │  ↑  │ │  ↑  │    │
│   │ ← → │ │ ← → │ │ ← → │ │ ← → │    │
│   │  ↓  │ │  ↓  │ │  ↓  │ │  ↓  │    │
│   └─────┘ └─────┘ └─────┘ └─────┘    │
│                                         │
│   [... 2 more rows ...]                │
│                                         │
├─────────────────────────────────────────┤
│  Stats:                                 │
│  Min Q-value: -0.05                     │
│  Max Q-value: 0.95                      │
│  Avg Q-value: 0.42                      │
│  Current Episode: 347                   │
└─────────────────────────────────────────┘
```

**Features:**
- **4×4 Grid**: One cell per state (16 states total for FrozenLake)
- **4 Arrows per cell**: ↑ (up), ↓ (down), ← (left), → (right)
- **Color coding**:
  - Blue arrows: Normal actions (not the best)
  - RED arrows: Action(s) with maximum Q-value in that state
  - If multiple actions have the same max value → all are red
  - If all Q-values are equal (e.g., all 0.0) → all stay blue
- **Current state highlight**: Yellow glow/border around the cell being visited
- **Update frequency**: Every 100 training steps (configurable)
- **Stats panel**: Shows min/max/avg Q-values and current episode

**Arrow Color Logic:**
```python
# Example for state with Q-values: [0.1, 0.5, 0.5, 0.2]
max_value = 0.5
↑ action (0.1): blue (not max)
↓ action (0.5): RED (is max)
← action (0.5): RED (is max, tied)
→ action (0.2): blue (not max)
```

**Technical Implementation:**
1. Create new component: `frontend/src/components/QTableArrowView.jsx`
2. Receive Q-table data from backend via SSE (in `learning_data` field)
3. Process Q-table to determine max actions per state
4. Render 4×4 CSS Grid
5. Each cell contains 4 arrow elements (SVG or Unicode)
6. Apply CSS classes based on whether action is max
7. Highlight current state (if available in data)

**Backend changes needed:**
- Include Q-table in SSE events (already done via `learning_data`)
- Send Q-table every 100 steps (not every step)
- Include current state position during training (optional)

**Data format:**
```json
{
  "episode": 347,
  "reward": 1.0,
  "learning_data": {
    "q_table": [
      [0.1, 0.2, 0.3, 0.4],  // State 0: [up, down, left, right]
      [0.5, 0.6, 0.7, 0.8],  // State 1
      // ... 14 more states
    ],
    "current_state": 5  // Optional: which state agent is in
  },
  "frame": "base64_string",
  "status": "training"
}
```

### Tasks:
1. **Create QTableArrowView component**
   - Set up 4×4 grid layout
   - Create arrow elements (4 per cell)
   - Style arrows with default colors

2. **Implement max-action logic**
   - Function to find max Q-value(s) per state
   - Handle ties (multiple max values)
   - Handle all-equal case (all stay blue)

3. **Add color coding**
   - Blue for non-max arrows
   - Red for max arrows
   - CSS transitions for smooth updates

4. **Add current state highlight**
   - Yellow glow/border effect
   - Only show during training/playback

5. **Add stats panel**
   - Calculate min/max/avg Q-values
   - Display current episode
   - Update in real-time

6. **Integrate with App.jsx**
   - Add component to main layout
   - Pass Q-table data from state
   - Handle empty state (before training)

7. **Test with different scenarios**
   - Initial state (all zeros)
   - Mid-training (mixed values)
   - Trained policy (clear maxes)
   - Tie scenarios

**Success criteria:**
- Q-table visualizes correctly with arrows
- Max actions are red, others are blue
- Updates smoothly during training
- Stats panel shows correct values
- No performance issues

---

## Phase 3: Implement Q-Table Visualization (Option B - Numbers + Heatmap)

### Design Specification: Number-Based Visualization with Heatmap

**Visual Layout:**
```
┌──────────────────────────────────────────┐
│  Q-Table Visualization (Value View)     │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │  ↑ 0.25│ │  ↑ 0.50│ │  ↑ 0.75│      │
│  │ ← ✕ → │ │ ← ✕ → │ │ ← ✕ → │      │
│  │ 0.1 0.8│ │ 0.3 0.9│ │ 0.5 0.6│      │
│  │  ↓ 0.15│ │  ↓ 0.20│ │  ↓ 0.40│      │
│  └────────┘ └────────┘ └────────┘      │
│                                          │
│  [... more cells ...]                   │
│                                          │
│  Color legend:                           │
│  [blue gradient → yellow] (min → max)   │
└──────────────────────────────────────────┘
```

**Features:**
- **4×4 Grid**: One cell per state
- **4 Numbers per cell**: Actual Q-values for each action
- **Heatmap coloring**:
  - Colors are relative WITHIN each state (not global)
  - Min Q-value in state → blue
  - Max Q-value in state → yellow
  - Interpolate colors for values in between
- **Position**: Numbers arranged in cross pattern matching actions
  - Top: Up action value
  - Bottom: Down action value
  - Left: Left action value
  - Right: Right action value
- **Tooltip**: Hover to see exact values (optional enhancement)
- **Toggle button**: Switch between Arrow View (Option A) and Value View (Option B)

**Heatmap Color Logic (Per-State Normalization):**
```python
# Example for state with Q-values: [0.1, 0.2, 0.2, 0.3]
min_in_state = 0.1
max_in_state = 0.3
range = 0.2

# Normalize each value to [0, 1] within this state
up (0.1):    (0.1 - 0.1) / 0.2 = 0.0   → darkest blue
down (0.2):  (0.2 - 0.1) / 0.2 = 0.5   → mid-tone
left (0.2):  (0.2 - 0.1) / 0.2 = 0.5   → mid-tone
right (0.3): (0.3 - 0.1) / 0.2 = 1.0   → brightest yellow

# If all values are equal (e.g., all 0.0):
# Use neutral color (gray or white)
```

**Why per-state normalization?**
- Makes differences visible even in low-value states
- Early training: all Q-values near 0, but differences still visible
- Each state's best action is always clearly highlighted

**Technical Implementation:**
1. Create new component: `frontend/src/components/QTableValueView.jsx`
2. Calculate min/max per state for color normalization
3. Interpolate colors using CSS or JS color functions
4. Format numbers to 2-3 decimal places
5. Arrange numbers in cross pattern matching arrow positions

**Toggle Implementation:**
1. Add toggle button above Q-table visualization
2. State: `const [viewMode, setViewMode] = useState('arrows')`
3. Conditional rendering:
   ```jsx
   {viewMode === 'arrows' ? <QTableArrowView /> : <QTableValueView />}
   ```
4. Labels: "Policy View" (arrows) and "Value View" (numbers)

### Tasks:
1. **Create QTableValueView component**
   - Set up 4×4 grid layout
   - Create number display elements (4 per cell)
   - Position numbers in cross pattern

2. **Implement per-state heatmap logic**
   - Calculate min/max for each state
   - Normalize values to [0, 1]
   - Handle edge case: all values equal
   - Generate color based on normalized value

3. **Implement color interpolation**
   - Blue → Yellow gradient
   - Smooth transitions
   - Use HSL or RGB interpolation

4. **Add toggle functionality**
   - Create toggle button component
   - Add state management for view mode
   - Switch between Arrow and Value views
   - Remember preference (localStorage optional)

5. **Format numbers nicely**
   - Limit to 2-3 decimal places
   - Right-align or center
   - Appropriate font size

6. **Test with different scenarios**
   - Initial state (all zeros → neutral color)
   - Small differences (colors should still be distinct)
   - Large differences (colors should span full range)
   - Negative values (if they occur)

**Success criteria:**
- Toggle switches between views smoothly
- Numbers are readable and well-positioned
- Colors make differences clear within each state
- No confusion with global vs per-state coloring
- Performance is good (no lag during updates)

---

## Phase 4 (Future): Enhancements

### Potential Improvements:
1. **Hover tooltips** - Show exact Q-values on hover in Arrow View
2. **Playback highlighting** - During policy playback, highlight the path taken
3. **Animation** - Smooth transitions when Q-values change
4. **State labels** - Show state numbers (0-15) in each cell
5. **Special states** - Highlight Start (S), Goal (G), Holes (H) differently
6. **Comparison mode** - Compare Q-tables from different training runs
7. **Export** - Download Q-table as CSV or JSON
8. **3D visualization** - For more complex environments (future phases)

---

## Implementation Order Summary

1. ✅ **Fix broken training pipeline** (MUST DO FIRST)
2. ✅ **Implement Option A: Arrow-based visualization**
3. ✅ **Test thoroughly with real training**
4. ⏳ **Implement Option B: Number-based visualization with toggle**
5. ⏳ **Add enhancements as needed**

---

## Notes

- All Q-table visualizations should handle FrozenLake's 4×4 grid (16 states, 4 actions)
- Update frequency: Every 100 training steps (configurable in code)
- Should work during both training and after training completes
- Should reset to zeros when "Reset" button is clicked
- Consider performance: rendering should not slow down training

---

## Questions / Decisions Pending

- [ ] Should current state highlight show during training or only during playback?
  - **Decision**: Show during both training and playback

- [ ] Should we add a "speed" control for visualization updates?
  - **Decision**: TBD - maybe in Phase 4

- [ ] Global vs per-state color normalization for Option B?
  - **Decision**: Per-state normalization (better visibility of differences)

- [ ] Should arrows in Option A have gradient colors too, or just blue/red binary?
  - **Decision**: Just blue/red for simplicity (Option A is meant to be clear, not detailed)

---

## Technical Notes

**Backend considerations:**
- Q-table is already sent in `learning_data` field of SSE events
- May need to throttle Q-table updates to every 100 steps (currently sends every episode)
- Consider sending current state position for highlighting

**Frontend considerations:**
- Use CSS Grid for 4×4 layout
- Consider React.memo() or useMemo() for performance if updates are frequent
- SVG arrows might look better than Unicode arrows
- Color interpolation: use HSL color space for smoother gradients

**Testing:**
- Test with different learning rates (some converge faster than others)
- Test with different exploration rates (affects how Q-values evolve)
- Test with different number of episodes (1, 10, 100, 1000)
- Test reset functionality (should clear Q-table visualization)

---

## Resources

- FrozenLake documentation: https://gymnasium.farama.org/environments/toy_text/frozen_lake/
- Q-Learning algorithm: backend/algorithms/q_learning.py
- Current visualization components: frontend/src/components/
- SSE event format: backend/app.py (line 194-210)

---

**End of Work Plan**
