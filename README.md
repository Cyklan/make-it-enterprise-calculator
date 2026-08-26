# Make It Enterprise Calculator

A calculator. Its one and only capability is to add two numbers. Over hundreds of iterations, agents will introduce processes, layers, policies, adapters, services, schemas, governance, and other increasingly enterprise-shaped machinery around that fixed operation. The implementation may become gloriously over-engineered; the calculator’s visual identity must not.

## The invariant

The rendered calculator UI is a permanent responsive compatibility contract. It fills the viewport provided by an embedding iframe, grows within bounded readable limits, and retains its standard horizontal composition at narrow widths. Even when the implementation behind it changes completely—including a migration to Tailwind, SCSS, CSS-in-JS, or another styling engine—those behaviours must remain stable.

That means preserving the approved layouts, fluid sizing bounds, spacing, typography, colours, borders, radii, interaction states, and responsive behaviour. Architectural changes must be invisible: a styling-system migration must produce the same UI at every approved viewport. The calculator's capability never changes, and later visual changes require explicit authorization.

## Permanent capability

- Accept two required decimal values (with `.` or `,` as the decimal separator).
- Add them when **Add** is pressed.
- Show the result without reloading the page.
- Provide keyboard-accessible controls, visible focus states, and an announced result.

## Run locally

```sh
npm install
npm run dev
```

The development server prints its local URL. Create a production build with:

```sh
npm run build
```

Preview that build with `npm run preview`.

Run the immutable browser compatibility suite with:

```sh
npx playwright install chromium
npm run test:compatibility
```

## Project layout

```text
index.html      Calculator markup and accessibility semantics
src/main.js     Current input validation and addition behaviour
src/style.css   Canonical visual contract
public/         Static assets
tests/compatibility/ Immutable browser behaviour and approved visual baselines
```

## Working on the experiment

Read [AGENTS.md](AGENTS.md) and the binding [Enterprise Constitution](ENTERPRISE_CONSTITUTION.md) before making changes. In particular, treat `src/style.css`, the HTML structure that it styles, and the `data-testid` attributes as public compatibility surfaces. When a task calls for enterprise complexity, add it deliberately around the permanent two-number addition workflow.

The compatibility test logic is immutable acceptance infrastructure: agents must never modify, remove, skip, rename, or weaken it. Approved visual snapshots may only be regenerated during an explicitly authorized visual baseline reset.
