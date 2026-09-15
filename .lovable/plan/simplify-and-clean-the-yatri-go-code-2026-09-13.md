# Simplify and clean the YATRI GO code

## Goal
Make the project easier for a human beginner to read and maintain, without changing its screens, routes, stored data, or behavior. Keep TanStack Start because the working application depends on it; use straightforward React/TypeScript that follows familiar HTML, CSS, and JavaScript structure.

## Changes
- Remove duplicate login role-routing logic and keep one clearly named destination helper.
- Consolidate repeated database list-loading code in the admin data module while preserving every existing exported hook and function.
- Split the large admin page into small, plainly named section components for Overview, Content, Services, Vendors, Users, Bookings, Emergency, and Settings.
- Delete dead imports, unused values, and redundant branches found in the touched files.
- Keep markup semantic and styling in the existing shared CSS/design tokens; avoid clever abstractions and dense one-liners.

## Safety checks
- Keep public exports, route URLs, data shapes, labels, permissions, and visible behavior unchanged.
- Run focused type checks/tests available in the project and confirm the preview build is clean.
- Verify login role redirection and the admin access screen in the browser.

## Technical details
- The project cannot be converted to plain static HTML/CSS/Java without losing authentication, dashboards, maps, payments, and server-backed data.
- React JSX remains close to HTML, Tailwind classes remain the styling layer, and TypeScript remains the JavaScript-compatible logic layer.
