# Security Policy

## Supported versions

Only the latest release of IaC WebApps gets security fixes. Please check that the problem still exists there before reporting.

## Reporting a vulnerability

Report privately through GitHub: **Security → Report a vulnerability** on this repository ([direct link](https://github.com/wahidhendrawan/iac-webapps/security/advisories/new)). Do not open a public issue, discussion or pull request, and do not post exploit details or credentials anywhere public.

Please include:

- the version or commit you tested, browser, and whether you used the Docker image or the dev server
- the smallest steps or input that reproduce the problem
- what an attacker gains (data exposure, code execution, privilege escalation, denial of service, …)

Remove real credentials, customer data and sensitive logs from any evidence you share.

You should get a first reply within 7 days. Fixed issues are credited in the release notes unless you ask otherwise.

## In scope

- Generated Terraform/OpenTofu, Pulumi or Helm code that lets crafted input inject or break out of a value
- XSS, or leakage of API keys and provider credentials from the browser
- Weaknesses in the shipped nginx configuration (CSP, headers)

## Out of scope

- Security of the cloud resources you design and deploy
- Behaviour of the LLM providers the AI copilot calls with your own key

## Safe harbor

Good-faith research that follows this policy will not be treated as a violation of the license or of this policy. Only test against your own deployment, access no more data than needed to show the issue, and do not degrade services for other people.
