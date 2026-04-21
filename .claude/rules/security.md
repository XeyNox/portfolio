# Security

## Secrets & Environment Variables

- Never hardcode API keys, tokens, or credentials — use `.env.local` (gitignored)
- Prefix public env vars with `VITE_` — anything without the prefix is not exposed to the client
- Treat `VITE_*` variables as public; never put sensitive secrets there
- Validate that `.env*.local` files are in `.gitignore` before committing

## Dependencies

- Audit dependencies before adding: check npm weekly downloads, last publish date, and GitHub stars
- Run `npm audit` regularly; fix critical/high severity issues immediately
- Prefer well-maintained packages with a small surface area over large all-in-one libs
- Pin exact versions in `package.json` for predictable installs (`"react": "18.3.1"` not `"^18"`)

## XSS Prevention

- Never use `dangerouslySetInnerHTML` — if unavoidable, sanitize input with DOMPurify first
- Never inject user-controlled strings into `href`, `src`, or event handlers
- React escapes JSX by default — don't bypass it

## Third-Party Scripts

- Only load scripts from trusted, well-known CDNs or self-host them
- Add `rel="noopener noreferrer"` to all `target="_blank"` anchor tags
- Use `<meta http-equiv="Content-Security-Policy">` or Vercel headers to restrict script sources

## Form & Input Handling

- Validate and sanitize all user input on the client (UX) and conceptually on any backend
- Use controlled inputs in React — avoid uncontrolled refs for user-facing forms
- Never eval user input or pass it to `Function()`, `setTimeout(string)`, etc.

## Vercel Deployment

- Set security headers in `vercel.json`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- Enable HTTPS-only redirects
- Review which environment variables are exposed to preview deployments
