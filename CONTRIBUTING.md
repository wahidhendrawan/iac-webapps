# Contributing to IaC WebApps

Thanks for helping improve IaC WebApps. By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Local setup

Requirements: Node.js 20 or later, npm 10 or later, and Git. Docker is optional for testing the production container.

1. Fork the repository and clone your fork.
2. Create a focused branch, such as `feat/hcl-validation` or `fix/security-scan`.
3. Install the locked dependency tree with `npm ci`.
4. Start the application with `npm run dev` (by default, `http://localhost:5173`).

Use `npm install` only when intentionally changing dependencies; commit the resulting `package-lock.json` with `package.json`.

## Before opening a pull request

Run these checks locally:

```bash
npm run lint
npm test
npm run coverage
npm run build
```

Add or update focused tests for changed behavior. Coverage is enforced for the security utility modules; do not lower a threshold without a clear justification.

Keep TypeScript strict, follow existing React component and utility patterns, and avoid unrelated formatting or refactoring. Use PascalCase for components, camelCase for functions and variables, and descriptive names for resources and configuration fields.

## Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/) because releases are generated from commit history. For example:

- `feat: add HCL validation feedback`
- `fix: reject invalid AWS regions`
- `docs: clarify local setup`
- `chore: update development tooling`

Use `feat!:` or include a `BREAKING CHANGE:` footer for breaking changes. Keep commits focused and write pull-request titles under 70 characters.

In the pull request, explain the problem and solution, link the related issue when applicable, describe testing performed, and call out user-facing or breaking changes. Update documentation for behavior users need to understand.

## Reporting issues

Search existing issues before filing a new one and use the supplied issue forms. Provide a minimal reproduction, expected and actual behavior, and relevant environment details. For questions or broader design discussion, use GitHub Discussions when available.

Do not report security vulnerabilities publicly; follow [SECURITY.md](SECURITY.md) instead.

## License

By contributing, you agree that your contributions are licensed under the [GNU General Public License v3.0](LICENSE).
