# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## End-to-end tests (Playwright)

Browser tests live in `e2e/`. They cover public pages (branding, course filters, back-to-top),
the admin dashboard (sign-in, course create/delete with the styled confirm dialog, renamed
"Enrollments", Q&A help text) and the email-verification sign-in gate.

```sh
npm install                 # installs @playwright/test
npx playwright install chromium
npm run test:e2e            # starts the API and dev server automatically, then runs the specs
npm run test:e2e:ui         # interactive runner
```

The admin specs sign in with the seeded demo admin (`server/scripts/seed.js`). Override with
`ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars if you use different credentials.

