# 📘 Project Best Practices

## 1. Project Purpose
This project implements a modular, embeddable referral widget for web applications, built with React and Next.js. The widget enables user authentication (via passkeys/WebAuthn), wallet creation, referral sharing, and dashboard features, designed for integration into e-commerce or rewards-based platforms.

## 2. Project Structure
- **/src/app/**: Main Next.js application entry point, layout, and page components.
- **/widget-sdk/**: Core widget SDK, designed for embedding. Contains:
  - **components/**: UI pages (Auth, CreateWallet, Share, Dashboard) and dialog components.
  - **utils/**: API utilities for authentication, wallet, and referral logic.
  - **hooks/**: Custom React hooks (e.g., dialog state management).
  - **types/**: Shared TypeScript types.
  - **config.ts**: Widget configuration (API URL, referral code, etc.).
  - **index.ts**: SDK entry point for external usage.
- **/public/**: Static assets.
- **Config files**: `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `tailwind.config.js` (if present), etc.

## 3. Test Strategy
- **Current State**: No formal test files or frameworks are present.
- **Recommended**:
  - Use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/) for unit and integration tests.
  - Place tests alongside components as `*.test.tsx` or in a `__tests__/` directory.
  - Mock API calls and external dependencies.
  - Focus on unit tests for UI logic and integration tests for widget flows.
  - Aim for high coverage on core widget logic and API utilities.

## 4. Code Style
- **Language**: TypeScript with strict mode enabled.
- **Framework**: React (function components, hooks, no class components).
- **Naming**:
  - Components: `PascalCase` (e.g., `AuthPage.tsx`)
  - Functions/variables: `camelCase`
  - Types/interfaces: `PascalCase` with `Props`/`State` suffix where relevant
- **Async**: Use `async/await` for all asynchronous logic.
- **Error Handling**: Always handle errors in async functions; display user-friendly messages in UI.
- **Comments**: Use inline comments sparingly; prefer clear, self-documenting code. Add JSDoc for exported functions/utilities.
- **Styling**: Use Tailwind CSS utility classes for all UI styling.

## 5. Common Patterns
- **Component Composition**: Pages are composed of small, focused components.
- **Dialog Navigation**: Widget uses internal state to manage multi-step dialog navigation.
- **API Utilities**: All API interactions are abstracted in `/utils/api/`.
- **Hooks**: Custom hooks for dialog state and other reusable logic.
- **Config Injection**: Widget configuration is set via a setter and consumed via a getter for API calls.

## 6. Do's and Don'ts
- ✅ Do use TypeScript types for all props and API responses.
- ✅ Do keep UI logic and API logic separated.
- ✅ Do handle loading and error states in all async UI flows.
- ✅ Do use Tailwind for all styling; avoid inline styles except for dynamic values.
- ✅ Do keep components small and focused.
- ❌ Don't use class components or legacy React patterns.
- ❌ Don't hardcode API URLs or referral codes; always use config.
- ❌ Don't leave unhandled promise rejections or uncaught errors.
- ❌ Don't mix business logic into UI components.

## 7. Tools & Dependencies
- **React 19**: UI framework.
- **Next.js 15**: App framework and SSR.
- **TypeScript**: Type safety and tooling.
- **Tailwind CSS**: Utility-first styling.
- **@simplewebauthn/browser**: Passkey/WebAuthn authentication.
- **ESLint**: Linting and code quality.
- **Jest/React Testing Library** (recommended): Testing.
- **Setup**: Install dependencies with `pnpm install` (or `npm`/`yarn`). Run dev server with `pnpm dev`.

## 8. Other Notes
- The widget is designed to be embeddable and reusable in other React/Next.js projects.
- All API endpoints are expected to be provided by a backend at the configured `apiUrl`.
- No backend or database logic is present in this repo; all server interactions are via REST API calls.
- When generating new code, follow the established folder and naming conventions, and prefer composition over inheritance.
