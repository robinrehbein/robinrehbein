# Incremental Design Implementation Plan

Goal: Implement the user-approved incremental review while preserving the editorial identity.
Architecture: Keep React Router routes and source content. Add small client components for gallery interaction and email copy; share existing tokens and print treatments.
Tech Stack: React 19, React Router framework, Express, Node 24, plain CSS.
Spec: User-approved design review in conversation, 2026-10-21.

- [ ] Refine shared CSS/Nav: current marker, focus/targets, readable tags, restrained arrows, reduced motion, marquee pause and limited status ping.
- [ ] Add Gallery component: SSR scroll strip, previous/next, counter, native dialog enlargement, keyboard and focus recovery. Use in /work, add anchor index.
- [ ] Refine home project excerpt and internal link; retain full /work descriptions. Add factual role/status fields; mobile overlap clearance.
- [ ] Split about paragraphs, restrict certificate interaction to links. Legal language and TOC, heading rhythm.
- [ ] Add copy-email button with success/failure feedback, preserve mailto. Retain hero dust; shorter first-load intro, repeat-visit photo, offscreen pause and reduced-motion change handling.
- [ ] Verify behavior with focused tests and browser checks; run required typecheck/build/HTTP tests. Review complete diff. Start local server.

Review focus: no-JS images; gallery keyboard/focus and bounds; clipboard denial; dynamic reduced motion and background animation; narrow layouts. No remote mutations.
