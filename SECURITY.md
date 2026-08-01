# Security Policy

## Reporting a vulnerability

Please do **not** report suspected vulnerabilities in public issues, discussions, or pull requests. Use GitHub's [private vulnerability reporting](https://github.com/wahidhendrawan/iac-webapps/security/advisories/new) instead. If private reporting is unavailable, use the contact method listed in the repository's GitHub security policy.

Include a clear description of the issue, its potential impact, reproducible steps, affected versions, and any proof of concept, screenshots, or relevant logs. Do not include credentials, API keys, or other sensitive production data.

We aim to acknowledge reports within 48 hours and will work with the reporter to validate the issue, assess impact, and coordinate a fix and disclosure. Please allow reasonable time for remediation before discussing the issue publicly.

## Supported versions

Security fixes are provided for the latest released version. Update to the latest version before reporting an issue that may already be fixed.

## Secure contributions

- Treat all user-controlled input as untrusted; validate it and encode output for its destination.
- Never commit secrets, API keys, private infrastructure details, or `.env` files.
- Keep dependencies current and investigate known vulnerabilities before adding a dependency.
- Run the project's lint, test/coverage, and build checks before opening a pull request.

This is a client-side application. Any future backend or external-service integration must keep secrets in an appropriate server-side secret store rather than browser storage or source code.
