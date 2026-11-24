# AccessPath Route Accessibility Scoring Algorithm

## 1. Overview
Conventional routing engines optimize strictly for travel time or shortest distance. For wheelchair users, people with reduced mobility, parents with strollers, and elderly individuals, a route that is 100 meters shorter but contains flights of stairs, broken pavements, or missing curb ramps is unusable.

AccessPath calculates an **Accessibility Score (0–100)** for every route alternative by inspecting geometric obstacles, verified physical infrastructure (ramps, elevators), community barrier reports, and user-specified mobility preferences.

---

## 2. Mathematical Formulation & Rules

The route score begins at a baseline of **100 points**:

$$\text{Score} = \text{clamp}\Big(100 + \Delta_{\text{dist}} + \Delta_{\text{fixtures}} - \Delta_{\text{stairs}} - \Delta_{\text{barriers}},\, 0,\, 100\Big)$$

### A. Distance Relativity Bonus ($\Delta_{\text{dist}}$)
If an alternative is within 5% of the shortest path length:
$$\Delta_{\text{dist}} = \min\left(15, \left\lfloor \frac{\text{shortest\_dist}}{\text{route\_dist}} \times 15 \right\rfloor\right)$$

### B. Positive Accessibility Fixtures ($\Delta_{\text{fixtures}}$)
- **Verified Ramp Available**: $+5$ points each (capped at $+15$).
- **Functional Elevator Transition**: $+5$ points each (capped at $+10$).

### C. Stairs and Vertical Obstacles ($\Delta_{\text{stairs}}$)
- **Steps / Staircase flight**: $-15$ points per flight.
- **Preference Multiplier**: If user has enabled `avoid_stairs: true`, the staircase penalty is doubled to $-30$ points per flight. A route with stairs is marked non-recommended (`recommended: false`).

### D. Barrier Reports Penalty ($\Delta_{\text{barriers}}$)
Community barrier reports intersecting a 30-meter buffer along the route line are evaluated:
- **Broken Footpath / Blocked Sidewalk**: Base weight $10$
- **Missing Ramp / Broken Elevator**: Base weight $12$
- **Unsafe Pedestrian Crossing**: Base weight $15$

**Verification Weighting:**
- **Verified barriers**: Evaluated at **100%** weight.
- **Pending/Unverified community reports**: Evaluated at **40%** weight and flagged in the user interface.

**Distance Density Normalization:**
To avoid penalizing longer journeys simply because they span more ground, barrier penalties are normalized by route distance ($D_{\text{km}}$):
$$\text{Density Factor} = \text{clamp}\left(\frac{1}{\sqrt{\max(0.2, D_{\text{km}})}}, 0.6, 1.5\right)$$
$$\Delta_{\text{barriers}} = \left\lfloor \sum \text{weight}_i \times \text{Density Factor} \right\rfloor$$

---

## 3. Worked Example

Consider a route $R_1$ with the following characteristics:
- Distance: $1.2\text{ km}$ ($1200\text{ m}$)
- Baseline score: $100$
- Shortest alternative distance: $1200\text{ m}$ $\rightarrow \Delta_{\text{dist}} = +15$
- Ramps detected: $1$ $\rightarrow +5$
- Stairs: $0$
- Barriers along route:
  - 1 verified missing ramp: weight $12$
  - 1 unverified broken footpath: weight $10 \times 0.4 = 4$
  - Raw barrier penalty = $16$
  - Route km = $1.2$ $\rightarrow \text{Density Factor} = \frac{1}{\sqrt{1.2}} \approx 0.91$
  - Normalized barrier penalty = $\lfloor 16 \times 0.91 \rfloor = 14$

$$\text{Final Score} = \min(100, 100 + 15 + 5 - 14) = 100 - 14 + 15 = 100 \text{ (clamped)}$$
*(If starting strictly at 100 with deduction: $100 - 14 + 5 = 91$)*.

The breakdown and warning badges inform the user:
- Score: **91/100 (High Accessibility)**
- Warning: *1 verified obstacle (missing ramp)*
- Warning: *1 unverified community report (broken footpath)*
- Status: **Recommended Route**
