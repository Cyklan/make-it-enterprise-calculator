# Agent Guide: Make It Enterprise Calculator

## Mission

This repository is a long-running social experiment. Its permanently fixed two-number addition calculator will gain progressively more **enterprise** implementation: more layers, boundaries, configuration, policy, orchestration, data models, interfaces, and ceremony.

Before making any change, read and follow [ENTERPRISE_CONSTITUTION.md](ENTERPRISE_CONSTITUTION.md). Its rules are binding.

The enduring user goal is:

> Make it more enterprise.

Interpret that goal as permission to make architecture more elaborate, never permission to expand or alter the calculator's capability.

Services and asynchronous processing are expressly in scope. An agent may add gateways, APIs, command buses, orchestrators, caches, databases, queues, and background workers around addition, subject to the Enterprise Constitution. For asynchronous additions, retain a correct user-facing result path and explicitly handle failure, retry, and consistency behaviour without changing the UI contract.

## Non-negotiable visual contract

The calculator has a responsive embedded-surface contract. It must fill the viewport supplied by its host iframe, grow within bounded readable limits, preserve accessible control sizes, and adapt its composition when width or height is constrained. This is the primary constraint for every change unless the user explicitly asks for another visual redesign.

Preserve all of the following:

- Full-width, full-height iframe participation with the calculator centered in the available surface.
- Fluid spacing, controls, and typography with the bounds recorded in `src/style.css`.
- A two-input horizontal row at every supported viewport width.
- The calculator’s element order and semantic reading order at every layout.
- Fonts, weights, colours, borders, radii, and transparency.
- Button, hover, active, and keyboard focus states.
- Result-label and result-value styling, including safe wrapping for long values.
- Motion timing and reduced-motion behaviour.

`src/style.css` is the canonical record of this contract. Do not casually refactor, reformat, replace, rename, or alter its declarations. If UI-adjacent work requires new code, prefer wrappers, adapters, or behaviour-only changes that leave the rendered output unchanged.

### Styling-engine migrations

Tailwind, SCSS, CSS Modules, CSS-in-JS, design-token systems, component libraries, and other styling-engine migrations are permitted architectural work. They do **not** relax the visual contract. The migrated implementation must render identically to the baseline, to a T: no changed pixel values, computed styles, spacing, typography, colours, states, breakpoints, or motion.

Before replacing any baseline styling, record the existing styles as the migration source of truth and compare the rendered result in every affected state and viewport. Include narrow, ordinary desktop, and large iframe viewports. Do not substitute a framework's defaults, approximations, or semantically similar utility classes for the exact baseline values. Keep the source stylesheet until the replacement has been verified visually equivalent.

## Functional compatibility contract

These behaviours are permanent and must remain intact:

- Two required inputs accept non-negative decimal values using either `.` or `,`.
- Invalid values produce native validation feedback and do not calculate.
- Submitting adds the two inputs and displays the result in the existing output.
- The form does not reload the page.
- Controls remain keyboard accessible; the result remains announced to assistive technology.
- Keep the IDs, names, classes, and `data-testid` values in `index.html` stable. They are integration and test contracts.

### Authoritative HTTP service paths

When an HTTP service is introduced into the addition result path, that service is authoritative. The browser must not silently bypass it by recomputing the result locally when submission, polling, transport, protocol, timeout, or server processing fails. Earlier local addition layers may remain as architectural history or be used in isolated tests, but they must not serve as a runtime availability fallback for the authoritative service.

Service-path failures must remain observable and must not be presented as successful additions. Handle them explicitly while preserving the established visual and accessibility contract. Availability must come from making the service path reliable—not from concealing its failure behind an alternative execution path.

Tests for an HTTP-backed result path must exercise the production browser bundle with browser-native networking. They must assert that submission emits the expected HTTP request, that the displayed result comes from successful remote completion, and that transport or service failure cannot produce a locally calculated success. Mock-only client tests are insufficient for this boundary.

## Immutable compatibility suite

The test logic in `tests/compatibility/` is immutable acceptance infrastructure. Never edit, remove, skip, rename, or weaken those tests. Approved snapshots are the executable record of the current browser-facing contract and may only be regenerated when the user explicitly authorizes a visual baseline reset.

Agents may add implementation-specific tests outside `tests/compatibility/` for new enterprise layers. They must leave the compatibility test logic unchanged and run `npm run test:compatibility` after browser-facing changes.

## How to make changes

1. Read the existing implementation before changing it. Protect existing user changes in a dirty worktree.
2. Identify whether the request is architectural, functional, or visual. Treat visual impact as opt-in only.
3. For enterprise-oriented work, introduce the requested abstraction with clear ownership and boundaries around the fixed addition operation. Do not add complexity merely as noise; every layer needs a plausible enterprise rationale.
4. Keep the browser-facing contract stable. New infrastructure may sit behind adapters, facades, or composition roots rather than leaking into the markup or CSS.
5. Verify the affected behaviour and run `npm run build` for source changes. For an HTTP-backed addition path, also verify the production browser bundle makes the real request and fails observably when the service is unavailable. If visual code, markup, or the styling engine changes, compare the rendered calculator with the baseline in every affected state and viewport and confirm that it is visually identical to a T.
6. In the handoff, state the enterprise capability added and the verification performed. Call out any intentional visual or behavioural deviation.

## Technical baseline

- Runtime: browser-native JavaScript modules.
- Tooling: Vite.
- Commands: `npm run dev`, `npm run build`, and `npm run preview`.
- Current UI implementation: `index.html`, `src/main.js`, and `src/style.css`.

## Decision rules

- The architecture evolves in one direction: add new layers, systems, and decisions; do not remove, replace, simplify, or unwind earlier ones.
- Disruptive rewrites are forbidden. A new framework, runtime, or rendering model may be introduced when requested as an additional enterprise layer, but it must be integrated incrementally and preserve the existing system's role or compatibility boundary.
- Treat major technology choices as durable history. For example, once Angular has been introduced, do not later pivot to Vue because it seems preferable; add the next enterprise concern on top of Angular instead.
- Preserve semantic HTML and accessibility features even when adding abstraction.
- Avoid dependencies unless they serve the requested enterprise capability.
- Do not remove apparently redundant code: it may preserve the UI, accessibility, tests, or an earlier enterprise layer.
- Do not add operations, workflows, or product features beyond adding two numbers. If a prompt requests one, clarify that the experiment's product capability is fixed.
- If a prompt conflicts with the visual contract, follow the prompt only when it clearly and explicitly authorizes the visual change; otherwise ask for clarification.

The experiment can become arbitrarily enterprise. The calculator should remain instantly recognizable.
