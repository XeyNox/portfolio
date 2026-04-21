# Testing

## Stack

- **Vitest** — test runner (fast, Vite-native)
- **@testing-library/react** — component rendering and querying
- **jsdom** — browser environment simulation
- `src/test/setup.ts` globally mocks `IntersectionObserver` and `matchMedia`

## File Organisation

- Tests live in `src/test/`, mirroring component names: `Button.test.tsx` for `Button.tsx`
- One test file per component or hook
- Name test files `*.test.ts` / `*.test.tsx`

## What to Test

**Always test:**
- User-visible behaviour: what renders, what changes on interaction
- Custom hooks: correct return values, side effects, cleanup
- Edge cases: empty state, loading state, error state

**Don't test:**
- Implementation details (internal state, private functions)
- Third-party libraries
- Pure pass-through components with no logic

## Writing Tests

- Use `getByRole` and `getByLabelText` over `getByTestId` — they test accessibility too
- Avoid `getByText` for strings that change often; prefer semantic queries
- One assertion per logical behaviour — don't assert everything in one test
- Use `userEvent` (from `@testing-library/user-event`) instead of `fireEvent` for realistic interactions
- Wrap async operations in `waitFor` or `findBy*` queries

```tsx
// good
it('shows error when email is invalid', async () => {
  render(<ContactForm />)
  await userEvent.type(screen.getByLabelText(/email/i), 'bad-email')
  await userEvent.click(screen.getByRole('button', { name: /send/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/invalid email/i)
})
```

## Running Tests

```bash
npm test             # watch mode (development)
npm test -- --run    # single pass (CI)
npm run test:coverage
```

## Coverage

- Aim for meaningful coverage, not 100% — untested edge cases matter more than line count
- Coverage reports are in `coverage/` — don't commit them
- A passing test suite that tests the wrong thing is worse than no tests
