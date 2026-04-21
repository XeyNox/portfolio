# Code Style

## TypeScript

- Prefer `interface` over `type` for object shapes; use `type` for unions/intersections
- Never use `any` — use `unknown` and narrow, or define a proper type
- Use `const` by default; only use `let` when reassignment is necessary
- Export types alongside the code that owns them, not in a separate types file
- Use strict null checks — never assume a value is non-null without checking

## React

- One component per file; file name matches the component name
- Props interface defined just above the component: `interface ButtonProps { ... }`
- Destructure props in the function signature: `function Button({ label, onClick }: ButtonProps)`
- Keep components focused — if a component does more than one thing, split it
- Prefer composition over conditionally rendering large JSX blocks
- Custom hooks go in `src/hooks/`, named `useXxx.ts`
- Avoid inline arrow functions in JSX for handlers that will be reused — extract them

## Naming

- Components: `PascalCase`
- Hooks, functions, variables: `camelCase`
- Constants (module-level, never mutated): `SCREAMING_SNAKE_CASE`
- CSS class names: Tailwind utilities only — no custom class names unless unavoidable
- Boolean variables and props: prefix with `is`, `has`, `can`, `should`

## Formatting

- 2-space indentation
- Single quotes for strings in TS/TSX; double quotes in JSX attributes
- Trailing commas in multi-line objects and arrays
- No semicolons (rely on ASI) — unless ESLint config enforces them
- Max line length: 100 characters; break JSX props one-per-line when over limit

## TailwindCSS

- Order classes: layout → sizing → spacing → typography → color → effects → responsive
- Extract repeated utility combos into a component, not a custom class
- Use `cn()` (or `clsx`) to conditionally merge classes — never string concatenation
- Keep responsive variants (`sm:`, `md:`, `lg:`) at the end of the class list

## Comments

- Write no comments unless the *why* is non-obvious
- Never comment what the code does — name things so it's self-evident
- `// TODO:` is acceptable temporarily; remove before merging to main
